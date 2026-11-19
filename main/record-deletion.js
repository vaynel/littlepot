"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordDeletion = exports.targetContains = void 0;
const node_path_1 = __importDefault(require("node:path"));
const native_1 = require("./native");
const file_controls_1 = require("./file-controls");
const targetContains = (target, p) => {
    if (!p)
        return false;
    const a = (0, file_controls_1.filePathKey)(target.path), b = (0, file_controls_1.filePathKey)(p), rel = node_path_1.default.relative(a, b);
    return target.kind === 'file' ? a === b : !rel || (!rel.startsWith('..' + node_path_1.default.sep) && rel !== '..' && !node_path_1.default.isAbsolute(rel));
};
exports.targetContains = targetContains;
/** Only app-owned SQL rows and the private Git repository are mutated here. */
class RecordDeletion {
    db;
    git;
    notify;
    onPhase = (_phase) => { };
    afterRef; // crash-recovery test hook
    constructor(db, git, notify) {
        this.db = db;
        this.git = git;
        this.notify = notify;
        db.exec('CREATE TABLE IF NOT EXISTS record_deletion (id INTEGER PRIMARY KEY CHECK(id=1),target TEXT NOT NULL,old_head TEXT NOT NULL,new_head TEXT NOT NULL)');
    }
    table(name) { return !!this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(name); }
    async head() { try {
        return (await this.git(['rev-parse', '--verify', 'refs/heads/history'])).toString().trim();
    }
    catch {
        return '';
    } }
    async start(kind, id) {
        this.onPhase('deleting');
        if (kind !== 'file' && kind !== 'root')
            throw new native_1.AppError('DELETE', '삭제할 관리 기록을 다시 선택해 주세요.');
        if (this.db.prepare('SELECT id FROM record_deletion').get())
            throw new native_1.AppError('DELETE', '이전 기록 삭제를 먼저 완료해 주세요.');
        const row = this.db.prepare(kind === 'file' ? 'SELECT * FROM files WHERE id=?' : 'SELECT * FROM roots WHERE id=?').get(id);
        if (!row)
            throw new native_1.AppError('DELETE', '삭제할 관리 기록을 찾지 못했어요.');
        const root = kind === 'root' ? id : row.root;
        const files = this.db.prepare('SELECT id,path FROM files WHERE root=?').all(root).filter(f => kind === 'root' || (0, file_controls_1.filePathKey)(f.path) === (0, file_controls_1.filePathKey)(row.path)).map(f => f.id);
        const target = { kind, id, root, path: row.path, files }, ids = new Set(files);
        const allVersions = this.db.prepare('SELECT * FROM versions').all();
        const versions = allVersions.filter(v => !ids.has(v.file)), removedIds = new Set(allVersions.filter(v => ids.has(v.file)).map(v => v.id));
        const retainedIds = new Set(versions.map(v => v.id));
        const events = this.db.prepare('SELECT * FROM events ORDER BY created,rowid').all().filter(e => !ids.has(e.file) && (retainedIds.has(e.id) || !removedIds.has(e.id) && (e.file || !(0, exports.targetContains)(target, e.path) && !(0, exports.targetContains)(target, e.old_path))));
        if (events.some(e => e.status === 'pending'))
            throw new native_1.AppError('DELETE', '보관 중인 작업을 마친 뒤 기록을 삭제해 주세요.');
        // A parentless checkpoint keeps all surviving bytes, without retaining deleted
        // content through the old history parent chain. SQLite remains the timeline index.
        const metadata = (await this.git(['hash-object', '-w', '--stdin'], Buffer.from(JSON.stringify({ schema: 2, events, versions })))).toString().trim();
        const blobs = [...new Set([...versions.map(v => v.blob), ...events.map(e => e.blob)].filter(Boolean))].sort();
        const tree = (await this.git(['mktree'], Buffer.from(`100644 blob ${metadata}\trecords.json\n` + blobs.map(b => `100644 blob ${b}\tcontent-${b}\n`).join('')))).toString().trim();
        const commit = (await this.git(['commit-tree', tree, '-m', 'Windowsill retained records checkpoint'])).toString().trim();
        const old = await this.head();
        this.db.prepare('INSERT INTO record_deletion VALUES (1,?,?,?)').run(JSON.stringify(target), old, commit);
        await this.recover();
        return { kind, files: files.length, cleanupPending: await this.compact() };
    }
    async recover() {
        const job = this.db.prepare('SELECT * FROM record_deletion WHERE id=1').get();
        if (!job)
            return;
        const target = JSON.parse(job.target), head = await this.head();
        if (head !== job.new_head) {
            if (head !== job.old_head)
                throw new native_1.AppError('DELETE', '기록 저장소 상태가 바뀌었어요. 삭제 복구를 확인해 주세요.');
            await this.git(['update-ref', 'refs/heads/history', job.new_head, head || '0'.repeat(job.new_head.length)]);
            this.afterRef?.();
        }
        const ids = new Set(target.files);
        this.db.exec('BEGIN IMMEDIATE');
        try {
            // Capture version-owned operation event IDs before removing their index rows.
            const removedIds = new Set(this.db.prepare('SELECT id,file FROM versions').all().filter(v => ids.has(v.file)).map(v => v.id));
            const protectedIds = new Set(this.db.prepare('SELECT id,file FROM versions').all().filter(v => !ids.has(v.file)).map(v => v.id));
            for (const event of this.db.prepare('SELECT id,file,path,old_path FROM events').all()) {
                if (ids.has(event.file) || !protectedIds.has(event.id) && (removedIds.has(event.id) || !event.file && ((0, exports.targetContains)(target, event.path) || (0, exports.targetContains)(target, event.old_path))))
                    this.db.prepare('DELETE FROM events WHERE id=?').run(event.id);
            }
            for (const id of target.files)
                for (const table of ['versions', 'file_sizes', 'file_opens', 'exceptions', 'file_controls'])
                    this.db.prepare(`DELETE FROM ${table} WHERE file=?`).run(id);
            for (const id of target.files)
                this.db.prepare('DELETE FROM files WHERE id=?').run(id);
            if (target.kind === 'root') {
                for (const table of ['root_inventory', 'root_folders', 'gaps', 'preferences', 'learned_ops', 'rules', 'file_controls', 'routing_rules', 'catalog_entries', 'catalog_recommendations'])
                    if (this.table(table))
                        this.db.prepare(`DELETE FROM ${table} WHERE root=?`).run(target.root);
                this.db.prepare('DELETE FROM roots WHERE id=?').run(target.root);
            }
            else {
                // Minimal opt-out marker: do not silently recreate the erased history.
                const key = (0, file_controls_1.filePathKey)(target.path);
                this.db.prepare('DELETE FROM file_controls WHERE root=? AND path_key=?').run(target.root, key);
                this.db.prepare('INSERT INTO file_controls VALUES (?,?,?,?,?,?)').run(target.id, target.root, target.path, key, 'off', Date.now());
            }
            this.db.prepare("UPDATE events SET commit_id=? WHERE status='committed'").run(job.new_head);
            this.db.prepare('UPDATE versions SET commit_id=?').run(job.new_head);
            this.db.prepare("INSERT OR REPLACE INTO meta VALUES ('record-cleanup-pending','1')").run();
            this.db.exec('COMMIT');
        }
        catch (e) {
            this.db.exec('ROLLBACK');
            throw e;
        }
        // The durable journal remains until other app databases have also been cleaned.
        // This callback must be idempotent: a crash can repeat it at the next startup.
        this.notify(target);
        this.db.prepare('DELETE FROM record_deletion WHERE id=1').run();
    }
    async compact() {
        if (!this.db.prepare("SELECT value FROM meta WHERE key='record-cleanup-pending'").get())
            return false;
        this.onPhase('compacting');
        try {
            await this.git(['reflog', 'expire', '--expire=now', '--all']);
            await this.git(['gc', '--prune=now']);
            this.db.prepare("DELETE FROM meta WHERE key='record-cleanup-pending'").run();
            return false;
        }
        catch {
            return true;
        } // Logical deletion is durable; retry physical cleanup on startup.
    }
}
exports.RecordDeletion = RecordDeletion;
