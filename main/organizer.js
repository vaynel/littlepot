"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organizer = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = require("node:crypto");
const node_worker_threads_1 = require("node:worker_threads");
const versions_1 = require("./versions");
const native_1 = require("./native");
const organize_schema_1 = require("./organize-schema");
const organize_policy_1 = require("./organize-policy");
/** SQLite owns review/selection/progress. Only one bounded item is handed to the legacy engine. */
class Organizer {
    core;
    versions;
    onChange = () => { };
    learnLocation(op, kind, intelligence) {
        const item = this.itemFor(op);
        if (!item)
            return false;
        const j = this.job(item.job), before = (0, organize_schema_1.routingRevision)(this.versions.db, j.root);
        if (j.policy && !JSON.parse(j.policy).remember)
            return true;
        // An approved choice is evidence, never an automatic move rule. Own learning
        // can resume this plan; unrelated edits still invalidate its review snapshot.
        if (kind.startsWith('undo'))
            intelligence.unlearn(op.id);
        else
            intelligence.learn(op.id, j.root, op.source, op.destination, .7, JSON.parse(op.identity).hash);
        if (j.rules_revision === before)
            this.core.db.prepare('UPDATE organize_jobs SET rules_revision=? WHERE id=?').run((0, organize_schema_1.routingRevision)(this.versions.db, j.root), j.id);
        return true;
    }
    worker = null;
    work = null;
    execution = null;
    paused = false;
    stopped = false;
    transferring = false;
    constructor(core, versions) {
        this.core = core;
        this.versions = versions;
        (0, organize_schema_1.organizeSchema)(core.db);
        (0, organize_schema_1.catalogSchema)(versions.db);
        versions.db.exec('CREATE TABLE IF NOT EXISTS organize_receipts(operation TEXT NOT NULL,kind TEXT NOT NULL,PRIMARY KEY(operation,kind))');
        core.db.prepare("UPDATE organize_jobs SET state='paused',error='앱이 종료되어 멈췄어요. 확인 후 계속할 수 있어요.' WHERE state IN ('indexing','analyzing','executing')").run();
        this.archiveUnusedDrafts();
    }
    job(id) { const j = this.core.db.prepare('SELECT * FROM organize_jobs WHERE id=? AND schema_version=1 AND archived=0').get(id); if (!j)
        throw new native_1.AppError('PLAN', '정리 계획을 찾지 못했어요.'); return j; }
    root(j) { const r = this.versions.root(j.root); if (!r.active || r.path !== j.root_path || r.identity !== j.root_identity || (0, organize_schema_1.objectIdentity)(node_fs_1.default.statSync((0, native_1.safePath)(r.path, true), { bigint: true })) !== j.root_identity)
        throw new native_1.AppError('ROOT', '관리 폴더가 바뀌었어요. 다시 확인해 주세요.'); return r; }
    summary(root) { return this.core.db.prepare(`SELECT * FROM organize_jobs WHERE archived=0 ${root ? 'AND root=?' : ''} ORDER BY created DESC,rowid DESC LIMIT 20`).all(...(root ? [root] : [])); }
    archiveUnusedDrafts() {
        // Retain execution/recovery evidence and any explicit selection. Only supersede untouched drafts.
        this.core.db.exec(`UPDATE organize_jobs AS old SET archived=1 WHERE old.archived=0 AND old.state='review' AND old.revision<=1
   AND NOT EXISTS(SELECT 1 FROM organize_items i WHERE i.job=old.id AND (i.selected=1 OR i.approved IS NOT NULL OR i.operation IS NOT NULL))
   AND NOT EXISTS(SELECT 1 FROM organize_folder_intents f WHERE f.job=old.id AND (f.approved=1 OR f.state='created'))
   AND NOT EXISTS(SELECT 1 FROM organize_mkdir m WHERE m.job=old.id)
   AND EXISTS(SELECT 1 FROM organize_jobs newer WHERE newer.archived=0 AND newer.state='review'
    AND newer.root=old.root AND newer.root_identity=old.root_identity AND newer.scope=old.scope
    AND newer.recursive=old.recursive AND newer.policy=old.policy
    AND (newer.created>old.created OR (newer.created=old.created AND newer.rowid>old.rowid)))`);
    }
    page(id, after = 0, size = 20, filter = 'changes', destination = '') {
        const j = this.job(id);
        size = [10, 20, 50, 100].includes(size) ? size : 20;
        after = Number.isSafeInteger(after) && after >= 0 ? after : 0;
        const where = (filter === 'all' ? '' : filter === 'issues' ? " AND state IN ('review','blocked','failed','needs_review','new_folder')" : " AND state NOT IN ('keep','excluded')") + (destination ? ' AND destination=?' : '');
        const items = this.core.db.prepare(`SELECT * FROM organize_items WHERE job=? AND seq>?${where} ORDER BY seq LIMIT ?`).all(id, after, ...(destination ? [destination] : []), size + 1);
        const hasNext = items.length > size;
        if (hasNext)
            items.pop();
        const counts = {};
        for (const row of this.core.db.prepare('SELECT state,COUNT(*) n FROM organize_items WHERE job=? GROUP BY state').all(id))
            counts[row.state] = Number(row.n);
        const selected = Number(this.core.db.prepare('SELECT COUNT(*) n FROM organize_items WHERE job=? AND selected=1').get(id).n);
        const stored = this.core.db.prepare('SELECT status,COUNT(*) n FROM aftercare WHERE batch=? GROUP BY status').all(id);
        const folders = this.core.db.prepare("SELECT f.*,(SELECT COUNT(*) FROM organize_items i WHERE i.job=f.job AND i.destination=f.path AND i.state IN ('new_folder','suggested')) n FROM organize_folder_intents f WHERE job=? AND state!='created' ORDER BY path").all(id);
        const groups = this.core.db.prepare("SELECT destination,COUNT(*) n FROM organize_items WHERE job=? AND destination!='' AND state NOT IN ('excluded','keep') GROUP BY destination ORDER BY destination LIMIT 100").all(id);
        return { job: j, items, counts, selected, stored, folders, groups, hasNext, next: items.at(-1)?.seq || after };
    }
    policy(root, scope) { this.versions.root(root); const row = this.core.db.prepare('SELECT policy FROM organize_policies WHERE root=? AND scope=?').get(root, scope); return row ? JSON.parse(row.policy) : null; }
    start(rootId, scope, recursive, input) {
        if (this.worker || this.execution)
            throw new native_1.AppError('BUSY', '진행 중인 정리를 먼저 멈춰 주세요.');
        const r = this.versions.root(rootId), folder = (0, native_1.safePath)(scope, true);
        if (!r.active || !(0, versions_1.inside)(r.path, folder))
            throw new native_1.AppError('ROOT', '관리 폴더 안에서 선택해 주세요.');
        const j = { root: r.id, root_path: r.path, root_identity: r.identity };
        this.root(j);
        const id = (0, node_crypto_1.randomUUID)(), now = Date.now();
        const policy = (0, organize_policy_1.normalizePolicy)(input);
        this.core.db.prepare("INSERT INTO organize_jobs(id,root,root_path,root_identity,scope,recursive,state,created,updated) VALUES (?,?,?,?,?,?,'indexing',?,?)").run(id, r.id, r.path, r.identity, folder, recursive ? 1 : 0, now, now);
        if (input !== undefined)
            this.core.db.prepare('UPDATE organize_jobs SET policy=? WHERE id=?').run(JSON.stringify(policy), id);
        this.analyze(id);
        return id;
    }
    analyze(id) {
        if (this.stopped)
            throw new native_1.AppError('PLAN', '앱 종료 중이에요.');
        const worker = this.worker = new node_worker_threads_1.Worker(node_path_1.default.join(__dirname, 'organize-worker.js'), { workerData: { id, garden: node_path_1.default.join(this.core.dataDir, 'garden.sqlite'), versions: node_path_1.default.join(this.versions.dataDir, 'versions.sqlite') } });
        this.work = new Promise(resolve => {
            let last = 0;
            worker.on('message', () => { if (Date.now() - last > 250) {
                last = Date.now();
                this.onChange();
            } });
            worker.on('error', () => { this.core.db.prepare("UPDATE organize_jobs SET state='failed',error='분석을 마치지 못했어요. 다시 분석해 주세요.' WHERE id=?").run(id); });
            worker.on('exit', () => { this.worker = null; this.work = null; this.archiveUnusedDrafts(); this.onChange(); resolve(); });
        });
        this.onChange();
    }
    async pause(id) {
        const j = this.job(id);
        if (!['indexing', 'analyzing', 'executing'].includes(j.state))
            return;
        this.paused = true;
        if (this.worker) {
            this.worker.postMessage('stop');
            await this.work;
        }
        if (this.execution) {
            this.core.cancel = true;
            await this.execution;
        }
        if (['indexing', 'analyzing', 'executing'].includes(this.job(id).state))
            this.core.db.prepare("UPDATE organize_jobs SET state='paused',updated=? WHERE id=?").run(Date.now(), id);
        this.onChange();
    }
    resume(id) {
        if (this.worker || this.execution)
            throw new native_1.AppError('BUSY', '다른 정리를 먼저 멈춰 주세요.');
        const j = this.job(id);
        this.root(j);
        if (j.state !== 'paused')
            throw new native_1.AppError('PLAN', '계획 상태를 다시 확인해 주세요.');
        // A plan with approved items returns to review. Restart never silently moves files.
        const approved = this.core.db.prepare('SELECT id FROM organize_items WHERE job=? AND approved IS NOT NULL LIMIT 1').get(id);
        if (approved) {
            this.reconcile(id);
            this.core.db.prepare("UPDATE organize_jobs SET state='review',error='',revision=revision+1 WHERE id=?").run(id);
        }
        else {
            this.core.db.prepare("UPDATE organize_jobs SET state=?,error='' WHERE id=?").run(j.rules_revision ? 'analyzing' : 'indexing', id);
            this.analyze(id);
        }
        this.onChange();
    }
    select(id, itemId, selected, revision) {
        const j = this.job(id);
        if (j.state !== 'review' || j.revision !== revision)
            throw new native_1.AppError('PLAN', '계획이 바뀌었어요. 다시 확인해 주세요.');
        if (typeof selected !== 'boolean')
            throw new native_1.AppError('PLAN', '선택을 확인해 주세요.');
        this.core.db.prepare(`UPDATE organize_items SET selected=? WHERE job=? AND state='suggested'${itemId ? ' AND id=?' : ''}`).run(selected ? 1 : 0, id, ...(itemId ? [itemId] : []));
        this.onChange();
    }
    approveFolder(id, folder, approved, revision) {
        const j = this.job(id);
        this.root(j);
        if (j.state !== 'review' || j.revision !== revision || typeof approved !== 'boolean')
            throw new native_1.AppError('PLAN', '계획을 다시 확인해 주세요.');
        const row = this.core.db.prepare("SELECT * FROM organize_folder_intents WHERE job=? AND path=? AND state='proposed'").get(id, folder);
        if (!row)
            throw new native_1.AppError('PLAN', '생성할 폴더를 다시 확인해 주세요.');
        if ((0, organize_schema_1.objectIdentity)(node_fs_1.default.statSync((0, native_1.safePath)(row.anchor, true), { bigint: true })) !== row.identity || node_fs_1.default.existsSync(folder))
            throw new native_1.AppError('CHANGED', '목적지 폴더가 바뀌었어요. 새로 분석해 주세요.');
        this.core.db.exec('BEGIN IMMEDIATE');
        try {
            this.core.db.prepare('UPDATE organize_folder_intents SET approved=? WHERE job=? AND path=?').run(approved ? 1 : 0, id, folder);
            this.core.db.prepare("UPDATE organize_items SET state=?,selected=0,approved=NULL WHERE job=? AND destination=? AND state IN ('new_folder','suggested')").run(approved ? 'suggested' : 'new_folder', id, folder);
            this.core.db.prepare('UPDATE organize_jobs SET revision=revision+1 WHERE id=?').run(id);
            this.core.db.exec('COMMIT');
        }
        catch (e) {
            this.core.db.exec('ROLLBACK');
            throw e;
        }
        this.onChange();
    }
    ensureDestination(j, item) {
        if (item.destination_identity)
            return;
        const intent = this.core.db.prepare('SELECT * FROM organize_folder_intents WHERE job=? AND path=?').get(j.id, item.destination);
        if (!intent?.approved || (0, organize_schema_1.objectIdentity)(node_fs_1.default.statSync((0, native_1.safePath)(intent.anchor, true), { bigint: true })) !== intent.identity)
            throw new native_1.AppError('PLAN', '새 폴더 생성 승인을 다시 확인해 주세요.');
        let cursor = intent.anchor;
        for (const component of node_path_1.default.relative(intent.anchor, intent.path).split(node_path_1.default.sep).filter(Boolean)) {
            const parent = cursor, parentIdentity = (0, organize_schema_1.objectIdentity)(node_fs_1.default.statSync((0, native_1.safePath)(parent, true), { bigint: true }));
            cursor = node_path_1.default.join(cursor, component);
            const receipt = this.core.db.prepare('SELECT * FROM organize_mkdir WHERE job=? AND path=?').get(j.id, cursor);
            if (receipt?.state === 'created') {
                if ((0, organize_schema_1.objectIdentity)(node_fs_1.default.statSync((0, native_1.safePath)(cursor, true), { bigint: true })) !== receipt.identity)
                    throw new native_1.AppError('CHANGED', '만든 폴더가 바뀌었어요.');
                continue;
            }
            if (node_fs_1.default.existsSync(cursor))
                throw new native_1.AppError('CHANGED', '예상하지 않은 폴더가 생겼어요. 위치를 다시 확인해 주세요.');
            this.core.db.prepare("INSERT OR REPLACE INTO organize_mkdir(job,path,state) VALUES (?,?,'planned')").run(j.id, cursor);
            if ((0, organize_schema_1.objectIdentity)(node_fs_1.default.statSync((0, native_1.safePath)(parent, true), { bigint: true })) !== parentIdentity)
                throw new native_1.AppError('CHANGED', '상위 폴더가 바뀌었어요.');
            node_fs_1.default.mkdirSync(cursor);
            const identity = (0, organize_schema_1.objectIdentity)(node_fs_1.default.statSync((0, native_1.safePath)(cursor, true), { bigint: true }));
            this.core.db.prepare("UPDATE organize_mkdir SET state='created',identity=? WHERE job=? AND path=?").run(identity, j.id, cursor);
        }
        const identity = (0, organize_schema_1.objectIdentity)(node_fs_1.default.statSync((0, native_1.safePath)(intent.path, true), { bigint: true }));
        this.core.db.prepare("UPDATE organize_folder_intents SET state='created',created_identity=? WHERE job=? AND path=?").run(identity, j.id, intent.path);
        this.core.db.prepare('UPDATE organize_items SET destination_identity=? WHERE job=? AND destination=? AND destination_identity=\'\'').run(identity, j.id, intent.path);
        item.destination_identity = identity;
    }
    destination(id, itemId, destination, revision) {
        const j = this.job(id);
        this.root(j);
        if (j.state !== 'review' || j.revision !== revision)
            throw new native_1.AppError('PLAN', '계획이 바뀌었어요.');
        const item = this.core.db.prepare('SELECT * FROM organize_items WHERE job=? AND id=?').get(id, itemId);
        if (!item || !['suggested', 'review', 'blocked', 'failed', 'keep', 'new_folder'].includes(item.state))
            throw new native_1.AppError('PLAN', '다시 선택할 항목을 확인해 주세요.');
        const folder = (0, native_1.safePath)(destination, true);
        if (!(0, versions_1.inside)(j.root_path, folder))
            throw new native_1.AppError('ROOT', '같은 관리 폴더 안에서 선택해 주세요.');
        const policy = (0, organize_policy_1.normalizePolicy)(j.policy ? JSON.parse(j.policy) : undefined);
        const protectedPaths = policy.protect ? this.core.db.prepare('SELECT path FROM organize_protected WHERE job=?').all(id).map(x => x.path) : [];
        if ([...protectedPaths, ...policy.exclusions.map(x => node_path_1.default.join(j.root_path, x))].some(x => (0, versions_1.inside)(x, folder)))
            throw new native_1.AppError('PROTECTED', '그대로 둘 폴더는 목적지로 선택할 수 없어요.');
        const s = node_fs_1.default.statSync((0, native_1.safePath)(item.source), { bigint: true });
        if ((0, organize_schema_1.objectIdentity)(s) !== item.identity)
            throw new native_1.AppError('CHANGED', '원본이 교체됐어요. 새로 분석해 주세요.');
        const destStat = node_fs_1.default.statSync(folder, { bigint: true });
        if (s.dev !== destStat.dev || s.size > 100n * 1024n ** 2n)
            throw new native_1.AppError('SIZE', '같은 장치의 100MiB 이하 파일만 이동할 수 있어요.');
        let state = folder === node_path_1.default.dirname(item.source) ? 'keep' : 'suggested';
        if (state === 'suggested' && node_fs_1.default.existsSync(node_path_1.default.join(folder, node_path_1.default.basename(item.source))))
            state = 'blocked';
        this.core.db.prepare("UPDATE organize_items SET destination=?,destination_identity=?,signature=?,parent_identity=?,reason=?,state=?,selected=0,approved=NULL,revision=revision+1,plan=? WHERE id=?").run(folder, (0, organize_schema_1.objectIdentity)(destStat), (0, organize_schema_1.metadataSignature)(s), (0, organize_schema_1.objectIdentity)(node_fs_1.default.statSync((0, native_1.safePath)(node_path_1.default.dirname(item.source), true), { bigint: true })), state === 'blocked' ? '같은 이름의 파일이 있어요.' : '직접 선택한 위치예요.', state, (0, node_crypto_1.randomUUID)(), itemId);
        this.core.db.prepare('UPDATE organize_jobs SET revision=revision+1 WHERE id=?').run(id);
        this.onChange();
    }
    approve(id, revision, acceptPartial = false) {
        if (this.worker || this.execution)
            throw new native_1.AppError('BUSY', '진행 중인 정리를 먼저 멈춰 주세요.');
        this.core.assertReady();
        const j = this.job(id);
        this.root(j);
        if (j.state !== 'review' || j.revision !== revision)
            throw new native_1.AppError('PLAN', '계획이 바뀌었어요. 다시 확인해 주세요.');
        if (j.issues && !acceptPartial)
            throw new native_1.AppError('PLAN', '확인하지 못한 범위를 제외하고 진행할지 확인해 주세요.');
        if ((0, organize_schema_1.routingRevision)(this.versions.db, j.root) !== j.rules_revision)
            throw new native_1.AppError('PLAN', '추천 규칙이나 학습 정보가 바뀌었어요. 새로 분석해 주세요.');
        if (!this.core.db.prepare("SELECT id FROM organize_items WHERE job=? AND state='suggested' AND selected=1 LIMIT 1").get(id))
            throw new native_1.AppError('PLAN', '이동할 항목을 선택해 주세요.');
        if (j.policy && JSON.parse(j.policy).remember)
            this.core.db.prepare('INSERT OR REPLACE INTO organize_policies VALUES (?,?,?)').run(j.root, j.scope, j.policy);
        this.core.db.exec('BEGIN IMMEDIATE');
        try {
            this.core.db.prepare("UPDATE organize_items SET state='queued',approved=revision WHERE job=? AND state='suggested' AND selected=1").run(id);
            this.core.db.prepare("UPDATE organize_jobs SET state='executing',error='',updated=? WHERE id=?").run(Date.now(), id);
            this.core.db.exec('COMMIT');
        }
        catch (e) {
            this.core.db.exec('ROLLBACK');
            throw e;
        }
        this.paused = false;
        this.execution = this.execute(id).finally(() => { this.execution = null; this.transferring = false; this.onChange(); });
        this.onChange();
    }
    async execute(id) {
        this.transferring = true;
        try {
            while (!this.paused && !this.stopped) {
                const item = this.core.db.prepare("SELECT * FROM organize_items WHERE job=? AND state='queued' ORDER BY seq LIMIT 1").get(id);
                if (!item)
                    break;
                const j = this.job(id);
                try {
                    const r = this.root(j), source = (0, native_1.safePath)(item.source), s = await promises_1.default.stat(source, { bigint: true });
                    // Never create a destination for a source already changed since review.
                    if ((0, organize_schema_1.metadataSignature)(s) !== item.signature)
                        throw new native_1.AppError('CHANGED', '분석 후 원본이 바뀌었어요.');
                    if (this.versions.isFileExcluded(j.root, item.source))
                        throw new native_1.AppError('FILE', '관리 해제한 파일이에요.');
                    this.ensureDestination(j, item);
                    if (!(0, versions_1.inside)(j.scope, source) || (0, organize_schema_1.metadataSignature)(s) !== item.signature || (0, organize_schema_1.objectIdentity)(node_fs_1.default.statSync((0, native_1.safePath)(node_path_1.default.dirname(source), true), { bigint: true })) !== item.parent_identity || (0, organize_schema_1.objectIdentity)(node_fs_1.default.statSync((0, native_1.safePath)(item.destination, true), { bigint: true })) !== item.destination_identity)
                        throw new native_1.AppError('CHANGED', '분석 후 파일이나 폴더가 바뀌었어요. 위치를 다시 확인해 주세요.');
                    if (item.approved !== item.revision)
                        throw new native_1.AppError('PLAN', '선택한 계획을 다시 확인해 주세요.');
                    this.core.db.prepare("UPDATE organize_items SET state='running' WHERE id=?").run(item.id);
                    const plan = await this.core.prepare([source], r.plant ?? -1, 'move', { [source]: item.destination }, { managedRoot: { id: r.id, path: r.path, identity: r.identity }, planId: item.plan });
                    // Preparation hashes only this file; reject changes relative to reviewed metadata.
                    if ((0, organize_schema_1.metadataSignature)(await promises_1.default.stat(source, { bigint: true })) !== item.signature) {
                        this.core.plans.delete(plan.id);
                        throw new native_1.AppError('CHANGED', '확인 중 원본이 바뀌었어요.');
                    }
                    const result = await this.core.execute(plan.id), row = result.rows[0];
                    this.core.results.delete(plan.id);
                    this.core.db.prepare('UPDATE organize_items SET state=?,reason=?,operation=?,selected=0 WHERE id=?').run(row.status === 'completed' ? 'completed' : row.status === 'needs_review' ? 'needs_review' : row.status === 'canceled' ? 'suggested' : 'failed', row.reason || '', row.id || null, item.id);
                    if (row.status === 'needs_review')
                        break;
                }
                catch (e) {
                    const pending = this.core.db.prepare("SELECT id FROM ops WHERE batch=? AND status IN ('planned','needs_review','undo_planned')").get(item.plan);
                    this.core.db.prepare('UPDATE organize_items SET state=?,reason=?,selected=0 WHERE id=?').run(pending ? 'needs_review' : 'failed', e instanceof Error ? e.message : '이동하지 못했어요.', item.id);
                    if (pending)
                        break;
                }
                this.onChange();
                await new Promise(r => setImmediate(r));
            }
        }
        finally {
            const pending = this.core.db.prepare("SELECT id FROM organize_items WHERE job=? AND state IN ('queued','running') LIMIT 1").get(id);
            const errors = this.core.db.prepare("SELECT id FROM organize_items WHERE job=? AND state IN ('failed','needs_review') LIMIT 1").get(id);
            this.core.db.prepare('UPDATE organize_jobs SET state=?,updated=? WHERE id=?').run(pending ? 'paused' : errors ? 'partial' : 'done', Date.now(), id);
            this.transferring = false;
        }
    }
    reconcile(id) {
        let after = 0;
        while (true) {
            const rows = this.core.db.prepare("SELECT * FROM organize_items WHERE job=? AND seq>? AND state IN ('queued','running','needs_review','completed') ORDER BY seq LIMIT 100").all(id, after);
            if (!rows.length)
                break;
            for (const row of rows) {
                after = row.seq;
                const op = this.core.db.prepare('SELECT * FROM ops WHERE batch=? ORDER BY created DESC LIMIT 1').get(row.plan);
                const state = op?.status === 'completed' ? 'completed' : op?.status === 'undone' ? 'undone' : op && ['planned', 'needs_review', 'undo_planned'].includes(op.status) ? 'needs_review' : 'suggested';
                this.core.db.prepare('UPDATE organize_items SET state=?,selected=0,operation=? WHERE id=?').run(state, op?.id || null, row.id);
            }
        }
    }
    review(id) { const j = this.job(id); if (!['partial', 'done', 'paused'].includes(j.state))
        throw new native_1.AppError('PLAN', '진행 상태를 먼저 확인해 주세요.'); this.reconcile(id); this.core.db.prepare("UPDATE organize_jobs SET state='review',revision=revision+1 WHERE id=?").run(id); this.onChange(); }
    itemFor(op) { return this.core.db.prepare('SELECT * FROM organize_items WHERE plan=?').get(op.batch); }
    validateOperation(op) { const item = this.itemFor(op); if (!item)
        return false; const j = this.job(item.job); this.root(j); if (this.versions.isFileExcluded(j.root, op.source))
        throw new native_1.AppError('FILE', '관리 해제한 파일이에요.'); if (op.source !== item.source || op.destination !== node_path_1.default.join(item.destination, node_path_1.default.basename(item.source)))
        throw new native_1.AppError('PLAN', '정리 계획과 파일 위치가 달라요.'); if ((0, organize_schema_1.objectIdentity)(node_fs_1.default.statSync((0, native_1.safePath)(node_path_1.default.dirname(op.source), true), { bigint: true })) !== item.parent_identity)
        throw new native_1.AppError('CHANGED', '원본 폴더가 바뀌었어요.'); return true; }
    /** Metadata receipt shares the version DB transaction; retry cannot fork file history. */
    recordLocation(op, kind) {
        const item = this.itemFor(op);
        if (!item)
            return;
        const v = this.versions.db, j = this.job(item.job), undo = kind === 'undo-move', source = undo ? op.destination : op.source, target = undo ? op.source : op.destination;
        if (v.prepare('SELECT 1 FROM organize_receipts WHERE operation=? AND kind=?').get(op.id, kind))
            return;
        this.root(j);
        const stat = node_fs_1.default.statSync((0, native_1.safePath)(target), { bigint: true });
        const expected = JSON.parse(op.identity);
        if ((0, organize_schema_1.objectIdentity)(stat) !== `${expected.dev}:${expected.ino}:${expected.birth}`)
            throw new native_1.AppError('CHANGED', '이동한 파일이 교체되었어요.');
        let file = v.prepare("SELECT * FROM files WHERE root=? AND identity=? AND status NOT IN ('deleted','replaced') ORDER BY observed DESC LIMIT 1").get(j.root, (0, organize_schema_1.objectIdentity)(stat));
        if (!file && item.file)
            file = v.prepare('SELECT * FROM files WHERE id=? AND identity=?').get(item.file, (0, organize_schema_1.objectIdentity)(stat));
        const id = file?.id || (0, node_crypto_1.randomUUID)();
        v.exec('BEGIN IMMEDIATE');
        try {
            if (file)
                v.prepare('UPDATE files SET path=?,status=CASE WHEN hash=\'\' THEN \'pending\' ELSE \'stored\' END WHERE id=?').run(target, id);
            else
                v.prepare("INSERT INTO files VALUES (?,?,?,?,?,'pending','',?,'')").run(id, j.root, target, (0, organize_schema_1.objectIdentity)(stat), '', Date.now());
            v.prepare("INSERT OR IGNORE INTO events(id,file,kind,path,old_path,hash,snapshot,status,created,metadata) VALUES (?,?,?,?,?,'','','pending',?,?)").run(`location-${kind}-${op.id}`, id, kind, target, source, Date.now(), JSON.stringify({ operationId: op.id }));
            v.prepare('INSERT INTO organize_receipts VALUES (?,?)').run(op.id, kind);
            v.prepare('DELETE FROM catalog_entries WHERE root=? AND path=?').run(j.root, source);
            v.prepare('INSERT OR REPLACE INTO catalog_entries VALUES (?,?,?,?,?,?,?,?)').run(j.root, target, node_path_1.default.dirname(target), 'file', (0, organize_schema_1.objectIdentity)(stat), (0, organize_schema_1.metadataSignature)(stat), Number(stat.size), `move-${op.id}`);
            v.exec('COMMIT');
        }
        catch (e) {
            v.exec('ROLLBACK');
            throw e;
        }
        this.core.db.prepare('UPDATE organize_items SET file=?,operation=? WHERE id=?').run(id, op.id, item.id);
    }
    async idle() { await this.work; await this.execution; }
    async close() { this.stopped = true; this.paused = true; if (this.worker)
        this.worker.postMessage('stop'); if (this.execution)
        this.core.cancel = true; await this.idle(); }
}
exports.Organizer = Organizer;
