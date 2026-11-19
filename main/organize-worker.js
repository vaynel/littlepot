"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_worker_threads_1 = require("node:worker_threads");
const node_sqlite_1 = require("node:sqlite");
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = require("node:crypto");
const native_1 = require("./native");
const versions_1 = require("./versions");
const file_controls_1 = require("./file-controls");
const recommendation_1 = require("./recommendation");
const organize_schema_1 = require("./organize-schema");
const organize_policy_1 = require("./organize-policy");
const folder_import_1 = require("./folder-import");
// Only metadata is indexed here. Git captures remain owned by VersionStore.
const db = new node_sqlite_1.DatabaseSync(node_worker_threads_1.workerData.garden), vdb = new node_sqlite_1.DatabaseSync(node_worker_threads_1.workerData.versions);
db.exec('PRAGMA busy_timeout=5000');
vdb.exec('PRAGMA busy_timeout=5000');
(0, organize_schema_1.catalogSchema)(vdb);
let stopped = false;
node_worker_threads_1.parentPort?.on('message', () => { stopped = true; });
const job = () => db.prepare('SELECT * FROM organize_jobs WHERE id=?').get(node_worker_threads_1.workerData.id);
const excluded = new Set(['.git', 'node_modules', '.windowsill-recovered', '.DS_Store']);
const ping = () => node_worker_threads_1.parentPort?.postMessage({ changed: true });
function transaction(db, fn) { db.exec('BEGIN IMMEDIATE'); try {
    fn();
    db.exec('COMMIT');
}
catch (e) {
    db.exec('ROLLBACK');
    throw e;
} }
async function main() {
    let j = job();
    const policy = (0, organize_policy_1.normalizePolicy)(j.policy ? JSON.parse(j.policy) : undefined);
    const rootStat = await promises_1.default.stat((0, native_1.safePath)(j.root_path, true), { bigint: true });
    if ((0, organize_schema_1.objectIdentity)(rootStat) !== j.root_identity)
        throw Error('관리 폴더가 바뀌었어요. 다시 확인해 주세요.');
    const root = vdb.prepare('SELECT * FROM roots WHERE id=?').get(j.root);
    if (!root?.active || root.identity !== j.root_identity)
        throw Error('폴더 관리를 다시 시작해 주세요.');
    if (j.state === 'indexing') {
        let pending = [];
        const save = vdb.prepare('INSERT INTO catalog_entries VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(root,path) DO UPDATE SET parent=excluded.parent,kind=excluded.kind,identity=excluded.identity,signature=excluded.signature,bytes=excluded.bytes,generation=excluded.generation');
        const flush = () => { if (!pending.length)
            return; transaction(vdb, () => { for (const values of pending) {
            save.run(...values);
            if (values[3] === 'directory')
                vdb.prepare('INSERT OR IGNORE INTO root_folders VALUES (?,?)').run(values[0], values[1]);
        } }); pending = []; };
        db.prepare("UPDATE organize_dirs SET state='queued' WHERE job=? AND state='running'").run(j.id);
        db.prepare('INSERT OR IGNORE INTO organize_dirs(job,path,depth) VALUES (?,?,0)').run(j.id, j.root_path);
        while (!stopped) {
            const dir = db.prepare("SELECT * FROM organize_dirs WHERE job=? AND state='queued' ORDER BY depth,path LIMIT 1").get(j.id);
            if (!dir)
                break;
            db.prepare("UPDATE organize_dirs SET state='running' WHERE job=? AND path=?").run(j.id, dir.path);
            try {
                (0, native_1.safePath)(dir.path, true);
                const dstat = await promises_1.default.stat(dir.path, { bigint: true });
                if (dstat.dev !== rootStat.dev)
                    throw Error('다른 장치의 폴더예요.');
                const handle = await promises_1.default.opendir(dir.path);
                for await (const e of handle) {
                    if (stopped)
                        break;
                    if (policy.protect && (0, organize_policy_1.projectMarker)(e.name))
                        db.prepare('INSERT OR IGNORE INTO organize_protected VALUES (?,?)').run(j.id, /\.(app|xcodeproj)$/i.test(e.name) ? node_path_1.default.join(dir.path, e.name) : dir.path);
                    if (excluded.has(e.name) || e.name.startsWith('.windowsill-') || e.name.startsWith('~$') || /\.(tmp|swp|lock)$/i.test(e.name)) {
                        db.prepare('UPDATE organize_jobs SET excluded=excluded+1 WHERE id=?').run(j.id);
                        continue;
                    }
                    const file = node_path_1.default.join(dir.path, e.name);
                    try {
                        const s = await promises_1.default.lstat(file, { bigint: true });
                        if (s.isSymbolicLink() || s.dev !== rootStat.dev || (!s.isDirectory() && (!s.isFile() || s.nlink > 1n)))
                            throw Error('연결 경로·다른 장치는 제외해요.');
                        // Metadata only: validate directory components once per directory. lstat
                        // rejects leaf links; execution revalidates every full path and identity.
                        if (s.isDirectory())
                            (0, native_1.safePath)(file, true);
                        if (s.isDirectory() && dir.depth >= 32)
                            throw Error('하위 폴더 깊이 제한이에요.');
                        pending.push([j.root, file, dir.path, s.isDirectory() ? 'directory' : 'file', (0, organize_schema_1.objectIdentity)(s), (0, organize_schema_1.metadataSignature)(s), Number(s.size), j.id]);
                        if (pending.length >= 100)
                            flush();
                        if (s.isDirectory()) {
                            db.prepare('INSERT OR IGNORE INTO organize_dirs(job,path,depth) VALUES (?,?,?)').run(j.id, file, dir.depth + 1);
                        }
                    }
                    catch (e) {
                        if (String(e?.code || '').includes('SQLITE'))
                            throw e;
                        db.prepare('UPDATE organize_jobs SET issues=issues+1 WHERE id=?').run(j.id);
                    }
                }
                flush();
                if (!stopped)
                    db.prepare("UPDATE organize_dirs SET state='done' WHERE job=? AND path=?").run(j.id, dir.path);
            }
            catch (e) {
                if (String(e?.code || '').includes('SQLITE'))
                    throw e;
                db.prepare("UPDATE organize_dirs SET state='failed' WHERE job=? AND path=?").run(j.id, dir.path);
                db.prepare('UPDATE organize_jobs SET issues=issues+1 WHERE id=?').run(j.id);
            }
            const count = vdb.prepare("SELECT COUNT(*) n FROM catalog_entries WHERE root=? AND generation=? AND kind='file'").get(j.root, j.id);
            db.prepare('UPDATE organize_jobs SET observed=?,updated=? WHERE id=?').run(count.n, Date.now(), j.id);
            ping();
        }
        flush();
        if (stopped)
            return;
        db.prepare("UPDATE organize_jobs SET state='analyzing',rules_revision=?,updated=? WHERE id=?").run((0, organize_schema_1.routingRevision)(vdb, j.root), Date.now(), j.id);
        j = job();
        ping();
    }
    const directoryRows = vdb.prepare("SELECT path,identity FROM catalog_entries WHERE root=? AND generation=? AND kind='directory' ORDER BY path").all(j.root, j.id);
    const folders = [j.root_path, ...directoryRows.map(x => x.path)], identities = new Map([[j.root_path, j.root_identity], ...directoryRows.map(x => [x.path, x.identity])]);
    const folderRevision = (0, node_crypto_1.createHash)('sha256').update(JSON.stringify([...identities])).digest('hex');
    const rec = new recommendation_1.Recommendations({ db: vdb, root: () => root });
    const protectedDirs = db.prepare('SELECT path FROM organize_protected WHERE job=?').all(j.id).map(x => x.path);
    const locks = policy.exclusions.map(p => node_path_1.default.join(j.root_path, p));
    const add = db.prepare('INSERT OR IGNORE INTO organize_items(id,job,file,source,signature,identity,parent_identity,destination,destination_identity,reason,state,plan) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
    while (!stopped) {
        const entries = vdb.prepare("SELECT c.*,(SELECT id FROM files f WHERE f.root=c.root AND f.path=c.path AND f.identity=c.identity AND f.status NOT IN ('deleted','replaced') LIMIT 1) file FROM catalog_entries c WHERE root=? AND generation=? AND kind='file' AND path>? ORDER BY path LIMIT 100").all(j.root, j.id, j.cursor);
        if (!entries.length)
            break;
        const planned = [], cacheWrites = [];
        for (const entry of entries) {
            if (stopped)
                return;
            j.cursor = entry.path;
            if (!(0, versions_1.inside)(j.scope, entry.path) || !j.recursive && entry.parent !== j.scope)
                continue;
            let cached = policy.mode === 'existing' ? vdb.prepare('SELECT destination,reason FROM catalog_recommendations WHERE root=? AND path=? AND signature=? AND rules=? AND folders=?').get(j.root, entry.path, entry.signature, j.rules_revision, folderRevision) : null;
            if (policy.mode !== 'existing') {
                const result = (0, organize_policy_1.policyDestination)(policy, entry.path);
                cached = { destination: result.relative ? node_path_1.default.join(j.root_path, result.relative) : '', reason: result.reason };
            }
            if (!cached) {
                const r = await rec.recommend(j.root, entry.path, folders);
                cached = { destination: r.selected || '', reason: r.confidence === 'conflict' ? '분류 규칙이 충돌해요. 목적지를 직접 선택해 주세요.' : r.candidates[0]?.reason || '위치를 직접 선택해 주세요.' };
                cacheWrites.push([j.root, entry.path, entry.signature, j.rules_revision, folderRevision, cached.destination, cached.reason]);
            }
            const destination = cached.destination;
            let state = destination ? (destination === entry.parent ? 'keep' : 'suggested') : 'review', reason = cached.reason, parentIdentity = identities.get(entry.parent) || '', destIdentity = identities.get(destination) || '';
            try {
                if (!parentIdentity)
                    throw Error('폴더를 확인하지 못했어요.');
                if (destination && !destIdentity) {
                    const target = (0, folder_import_1.inspectDestination)(j.root_path, destination, true);
                    if (target.target === target.anchor)
                        throw Error('분석 중 목적지가 변경됐어요.');
                    db.prepare('INSERT OR IGNORE INTO organize_folder_intents(job,path,anchor,identity) VALUES (?,?,?,?)').run(j.id, destination, target.anchor, target.identity);
                    state = 'new_folder';
                }
                if (destination && state === 'suggested') {
                    try {
                        await promises_1.default.lstat(node_path_1.default.join(destination, node_path_1.default.basename(entry.path)));
                        state = 'blocked';
                        reason = '같은 이름의 파일이 있어요.';
                    }
                    catch (e) {
                        if (e.code !== 'ENOENT')
                            throw e;
                    }
                }
                if (entry.bytes > 100 * 1024 ** 2) {
                    state = 'blocked';
                    reason = '100MiB 이하 파일만 이동할 수 있어요.';
                }
            }
            catch {
                state = 'blocked';
                reason = '폴더 위치나 권한을 확인해 주세요.';
            }
            if ([...protectedDirs, ...locks].some(p => (0, versions_1.inside)(p, entry.path))) {
                state = 'excluded';
                reason = '보호하거나 그대로 두기로 한 범위예요.';
            }
            if (destination && [...protectedDirs, ...locks].some(p => (0, versions_1.inside)(p, destination))) {
                state = 'excluded';
                reason = '보호하거나 그대로 두기로 한 범위예요.';
            }
            if ((0, file_controls_1.fileExcluded)(vdb, j.root, entry.path)) {
                state = 'excluded';
                reason = '관리 해제한 파일이에요.';
            }
            const id = (0, node_crypto_1.randomUUID)();
            planned.push([id, j.id, entry.file || '', entry.path, entry.signature, entry.identity, parentIdentity, destination, destIdentity, reason, state, id]);
        }
        transaction(vdb, () => { const save = vdb.prepare('INSERT OR REPLACE INTO catalog_recommendations VALUES (?,?,?,?,?,?,?)'); for (const values of cacheWrites)
            save.run(...values); });
        transaction(db, () => { for (const values of planned)
            add.run(...values); db.prepare('UPDATE organize_jobs SET cursor=?,updated=? WHERE id=?').run(j.cursor, Date.now(), j.id); });
        ping();
    }
    if (!stopped) {
        if ((0, organize_schema_1.objectIdentity)(await promises_1.default.stat((0, native_1.safePath)(j.root_path, true), { bigint: true })) !== j.root_identity)
            throw Error('분석 중 관리 폴더가 바뀌었어요.');
        db.prepare("UPDATE organize_jobs SET state='review',observed=(SELECT COUNT(*) FROM organize_items WHERE job=?),revision=revision+1,updated=? WHERE id=?").run(j.id, Date.now(), j.id);
        ping();
    }
}
main().catch(e => { db.prepare("UPDATE organize_jobs SET state='failed',error=?,updated=? WHERE id=?").run(e instanceof Error ? e.message : '분석에 실패했어요.', Date.now(), node_worker_threads_1.workerData.id); ping(); }).finally(() => { db.close(); vdb.close(); node_worker_threads_1.parentPort?.close(); });
