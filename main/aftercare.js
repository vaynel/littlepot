"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aftercare = void 0;
const native_1 = require("./native");
/** Durable post-transfer work. Retrying this queue never copies or moves a file. */
class Aftercare {
    core;
    versions;
    onChange = () => { };
    onComplete = (result) => { };
    canNotify = (_batch) => true;
    timer;
    running = null;
    stopped = false;
    constructor(core, versions) {
        this.core = core;
        this.versions = versions;
        core.db.exec(`CREATE TABLE IF NOT EXISTS aftercare(id TEXT PRIMARY KEY,operation TEXT NOT NULL,batch TEXT NOT NULL,kind TEXT NOT NULL,status TEXT NOT NULL,reason TEXT NOT NULL DEFAULT '',created INTEGER NOT NULL,updated INTEGER NOT NULL,notified INTEGER NOT NULL DEFAULT 0);
      CREATE INDEX IF NOT EXISTS aftercare_status ON aftercare(status,created);
      UPDATE aftercare SET status='queued' WHERE status='running';`);
    }
    enqueue(op, kind, batch = op.batch) {
        this.core.db.prepare('INSERT OR IGNORE INTO aftercare(id,operation,batch,kind,status,created,updated) VALUES (?,?,?,?,?,?,?)').run(`${kind}-${op.id}`, op.id, kind.startsWith('undo') ? `${kind}-${op.id}` : batch, kind, 'queued', Date.now(), Date.now());
        this.onChange();
    }
    retry(id) {
        const row = this.core.db.prepare('SELECT * FROM aftercare WHERE id=?').get(id);
        if (!row || row.status !== 'failed')
            throw new native_1.AppError('TASK', '다시 보관할 작업을 선택해 주세요.');
        this.core.db.prepare("UPDATE aftercare SET status='queued',reason='',notified=0,updated=? WHERE id=?").run(Date.now(), id);
        this.onChange();
        this.kick();
    }
    snapshot() {
        const counts = {};
        for (const r of this.core.db.prepare('SELECT status,COUNT(*) n FROM aftercare GROUP BY status').all())
            counts[r.status] = Number(r.n);
        const items = this.core.db.prepare("SELECT a.*,o.destination,o.source FROM aftercare a JOIN ops o ON o.id=a.operation ORDER BY CASE WHEN a.status IN ('queued','running','failed') THEN 0 ELSE 1 END,a.updated DESC LIMIT 100").all();
        return { counts, items };
    }
    start() { this.timer = setInterval(() => this.kick(), 250); this.kick(); }
    kick() { if (this.stopped || this.running || this.core.busy || this.versions.deleting)
        return; this.running = this.drain().finally(() => { this.running = null; }); }
    async drain() {
        while (!this.stopped && !this.core.busy && !this.versions.deleting) {
            const job = this.core.db.prepare("SELECT a.* FROM aftercare a JOIN ops o ON o.id=a.operation WHERE a.status='queued' AND o.status IN ('completed','undone') ORDER BY a.created,a.rowid LIMIT 1").get();
            if (!job)
                break;
            const op = this.core.db.prepare('SELECT * FROM ops WHERE id=?').get(job.operation);
            this.core.db.prepare("UPDATE aftercare SET status='running',updated=? WHERE id=?").run(Date.now(), job.id);
            this.onChange();
            try {
                // Undo may have completed before the queue got a turn; never recreate its destination.
                const superseded = !job.kind.startsWith('undo') && op.status === 'undone';
                const note = superseded ? '보관 전에 되돌린 작업이에요.' : await this.versions.recordTransferred(op, job.kind);
                this.core.db.prepare('UPDATE aftercare SET status=?,reason=?,updated=? WHERE id=?').run(superseded ? 'superseded' : 'completed', note || '', Date.now(), job.id);
            }
            catch (e) {
                this.core.db.prepare("UPDATE aftercare SET status='failed',reason=?,updated=? WHERE id=?").run(e instanceof Error ? e.message.slice(0, 240) : '버전 보관에 실패했어요.', Date.now(), job.id);
            }
            this.onChange();
        }
        if (this.core.busy || this.stopped || this.versions.deleting)
            return;
        for (const { batch } of this.core.db.prepare('SELECT DISTINCT batch FROM aftercare WHERE notified=0').all()) {
            if (!this.canNotify(batch))
                continue;
            const rows = this.core.db.prepare('SELECT * FROM aftercare WHERE batch=?').all(batch);
            if (rows.some(r => ['queued', 'running'].includes(r.status)))
                continue;
            this.core.db.prepare('UPDATE aftercare SET notified=1 WHERE batch=?').run(batch);
            try {
                this.onComplete({ batch, completed: rows.filter(r => r.status === 'completed').length, failed: rows.filter(r => r.status === 'failed').length, changed: rows.filter(r => r.reason && r.status !== 'failed').length });
            }
            catch { /* OS notifications are optional; durable status remains visible. */ }
        }
    }
    async idle() { this.kick(); await this.running; }
    async close() { this.stopped = true; clearInterval(this.timer); await this.running; }
}
exports.Aftercare = Aftercare;
