"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanCoreRecords = cleanCoreRecords;
exports.cleanCoreDatabase = cleanCoreDatabase;
const record_deletion_1 = require("./record-deletion");
const file_controls_1 = require("./file-controls");
/** Idempotent companion cleanup; it never calls any filesystem mutation API. */
function cleanCoreRecords(core, target) {
    cleanCoreDatabase(core.db, target);
    core.plans.clear();
}
function cleanCoreDatabase(db, target) {
    const has = (name) => !!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(name);
    const match = (p) => typeof p === 'string' && (0, record_deletion_1.targetContains)(target, p);
    db.exec('BEGIN IMMEDIATE');
    try {
        const ops = db.prepare('SELECT id,source,destination FROM ops').all().filter(o => match(o.source) || match(o.destination)), ids = new Set(ops.map(o => o.id));
        if (has('task_items'))
            for (const task of db.prepare('SELECT id,operation,payload FROM task_items').all()) {
                const p = JSON.parse(task.payload);
                if (ids.has(task.operation) || match(p.source) || match(p.destination) || target.kind === 'root' && p.rootId === target.root)
                    db.prepare('DELETE FROM task_items WHERE id=?').run(task.id);
            }
        for (const op of ops) {
            if (has('aftercare'))
                db.prepare('DELETE FROM aftercare WHERE operation=?').run(op.id);
            db.prepare('DELETE FROM ops WHERE id=?').run(op.id);
        }
        if (has('organize_jobs')) {
            for (const job of db.prepare('SELECT id,root FROM organize_jobs').all()) {
                const affected = target.kind === 'root' ? job.root === target.root : db.prepare('SELECT source FROM organize_items WHERE job=?').all(job.id).some(i => match(i.source));
                if (!affected)
                    continue;
                for (const table of ['organize_dirs', 'organize_items', 'organize_protected', 'organize_folder_intents', 'organize_mkdir'])
                    if (has(table))
                        db.prepare(`DELETE FROM ${table} WHERE job=?`).run(job.id);
                db.prepare('DELETE FROM organize_jobs WHERE id=?').run(job.id);
            }
        }
        if (target.kind === 'root') {
            if (has('organize_policies'))
                db.prepare('DELETE FROM organize_policies WHERE root=?').run(target.root);
            for (const plant of db.prepare('SELECT id,folder FROM plants').all())
                if (plant.folder && (0, file_controls_1.filePathKey)(plant.folder) === (0, file_controls_1.filePathKey)(target.path))
                    db.prepare('UPDATE plants SET folder=NULL,folder_identity=NULL WHERE id=?').run(plant.id);
            const row = db.prepare("SELECT value FROM settings WHERE key='managedRootOrder'").get();
            db.prepare("INSERT OR REPLACE INTO settings VALUES ('managedRootOrder',?)").run(JSON.stringify((row ? JSON.parse(row.value) : []).filter((id) => id !== target.root)));
        }
        db.exec('COMMIT');
    }
    catch (e) {
        db.exec('ROLLBACK');
        throw e;
    }
}
