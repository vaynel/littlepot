"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStore = exports.retryable = void 0;
const node_crypto_1 = require("node:crypto");
const native_1 = require("./native");
exports.retryable = new Set(['failed', 'canceled', 'skipped', 'not_moved', 'interrupted']);
class TaskStore {
    db;
    constructor(db) {
        this.db = db;
        db.exec(`CREATE TABLE IF NOT EXISTS task_items(id TEXT PRIMARY KEY,batch TEXT NOT NULL,payload TEXT NOT NULL,status TEXT NOT NULL,reason TEXT NOT NULL DEFAULT '',operation TEXT,created INTEGER NOT NULL,updated INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS task_items_created ON task_items(created);
      CREATE INDEX IF NOT EXISTS task_items_batch ON task_items(batch);`);
    }
    get(id) {
        const row = this.db.prepare('SELECT * FROM task_items WHERE id=?').get(id);
        if (!row)
            throw new native_1.AppError('TASK', '작업 기록을 찾지 못했어요.');
        return { ...JSON.parse(row.payload), ...row, payload: undefined };
    }
    start(plan) {
        this.db.exec('BEGIN IMMEDIATE');
        try {
            if (plan.retryTask) {
                const old = this.get(plan.retryTask);
                if (!exports.retryable.has(old.status))
                    throw new native_1.AppError('TASK', '이미 처리했거나 확인이 필요한 작업이에요.');
                this.update(old.id, 'retried', '');
            }
            const ids = plan.rows.map((row) => {
                const id = (0, node_crypto_1.randomUUID)(), now = Date.now();
                this.db.prepare('INSERT INTO task_items(id,batch,payload,status,created,updated) VALUES (?,?,?,?,?,?)').run(id, plan.id, JSON.stringify({ ...row, plant: plan.plant, rootId: plan.rootId, folder: plan.folder, folderIdentity: plan.folderIdentity, mode: plan.mode, retryOf: plan.retryTask }), 'queued', now, now);
                return id;
            });
            this.db.exec('COMMIT');
            return ids;
        }
        catch (e) {
            this.db.exec('ROLLBACK');
            throw e;
        }
    }
    update(id, status, reason = '', operation) {
        this.db.prepare('UPDATE task_items SET status=?,reason=?,operation=COALESCE(?,operation),updated=? WHERE id=?').run(status, reason, operation || null, Date.now(), id);
    }
    reconcile() {
        // Journal wins over interrupted UI state. Never perform a file operation here.
        for (const row of this.db.prepare("SELECT * FROM task_items WHERE status IN ('queued','running','needs_review')").all()) {
            let op = this.db.prepare('SELECT id,status,error FROM ops WHERE id=?').get(row.operation || '');
            // A process may stop after INSERT ops but before attaching its ID here.
            if (!op && row.status !== 'queued')
                op = this.db.prepare('SELECT id,status,error FROM ops WHERE batch=? AND source=? ORDER BY created DESC LIMIT 1').get(row.batch, JSON.parse(row.payload).source);
            this.update(row.id, op ? (['planned', 'undo_planned'].includes(op.status) ? 'needs_review' : op.status) : 'interrupted', op?.error || '', op?.id);
        }
    }
    snapshot() {
        const counts = {};
        for (const row of this.db.prepare('SELECT status,COUNT(*) n FROM task_items GROUP BY status').all())
            counts[row.status] = Number(row.n);
        // Unresolved work must not disappear behind a page of successful operations.
        const rows = this.db.prepare("SELECT id FROM task_items ORDER BY CASE WHEN status IN ('queued','running','needs_review','failed','canceled','skipped','not_moved','interrupted') THEN 0 ELSE 1 END,created DESC,rowid DESC LIMIT 100").all();
        return { counts, items: rows.map(row => { const { identity, parentIdentity, folderIdentity, ...item } = this.get(row.id); return item; }), limit: 100 };
    }
}
exports.TaskStore = TaskStore;
