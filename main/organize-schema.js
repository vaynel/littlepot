"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataSignature = exports.objectIdentity = void 0;
exports.organizeSchema = organizeSchema;
exports.catalogSchema = catalogSchema;
exports.routingRevision = routingRevision;
const node_crypto_1 = require("node:crypto");
function organizeSchema(db) {
    db.exec(`
 CREATE TABLE IF NOT EXISTS organize_jobs(id TEXT PRIMARY KEY, schema_version INTEGER NOT NULL DEFAULT 1,root TEXT NOT NULL,root_path TEXT NOT NULL,root_identity TEXT NOT NULL,scope TEXT NOT NULL,recursive INTEGER NOT NULL,state TEXT NOT NULL,revision INTEGER NOT NULL DEFAULT 0,rules_revision TEXT NOT NULL DEFAULT '',cursor TEXT NOT NULL DEFAULT '',observed INTEGER NOT NULL DEFAULT 0,excluded INTEGER NOT NULL DEFAULT 0,issues INTEGER NOT NULL DEFAULT 0,error TEXT NOT NULL DEFAULT '',created INTEGER NOT NULL,updated INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS organize_dirs(job TEXT NOT NULL,path TEXT NOT NULL,depth INTEGER NOT NULL,state TEXT NOT NULL DEFAULT 'queued',PRIMARY KEY(job,path));
 CREATE INDEX IF NOT EXISTS organize_dirs_queue ON organize_dirs(job,state,path);
 CREATE TABLE IF NOT EXISTS organize_items(seq INTEGER PRIMARY KEY AUTOINCREMENT,id TEXT NOT NULL UNIQUE,job TEXT NOT NULL,file TEXT NOT NULL DEFAULT '',source TEXT NOT NULL,signature TEXT NOT NULL,identity TEXT NOT NULL,parent_identity TEXT NOT NULL,destination TEXT NOT NULL DEFAULT '',destination_identity TEXT NOT NULL DEFAULT '',reason TEXT NOT NULL DEFAULT '',state TEXT NOT NULL,selected INTEGER NOT NULL DEFAULT 0,revision INTEGER NOT NULL DEFAULT 0,approved INTEGER,plan TEXT NOT NULL UNIQUE,operation TEXT,UNIQUE(job,source));
 CREATE INDEX IF NOT EXISTS organize_items_page ON organize_items(job,seq);
 CREATE INDEX IF NOT EXISTS organize_items_state ON organize_items(job,state,selected,seq);
 CREATE TABLE IF NOT EXISTS organize_protected(job TEXT NOT NULL,path TEXT NOT NULL,PRIMARY KEY(job,path));
 CREATE TABLE IF NOT EXISTS organize_folder_intents(job TEXT NOT NULL,path TEXT NOT NULL,anchor TEXT NOT NULL,identity TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'proposed',approved INTEGER NOT NULL DEFAULT 0,created_identity TEXT NOT NULL DEFAULT '',PRIMARY KEY(job,path));
 CREATE TABLE IF NOT EXISTS organize_policies(root TEXT NOT NULL,scope TEXT NOT NULL,policy TEXT NOT NULL,PRIMARY KEY(root,scope));
 CREATE TABLE IF NOT EXISTS organize_mkdir(job TEXT NOT NULL,path TEXT NOT NULL,state TEXT NOT NULL,identity TEXT NOT NULL DEFAULT '',PRIMARY KEY(job,path));
 `);
    const columns = db.prepare('PRAGMA table_info(organize_jobs)').all();
    if (!columns.some(x => x.name === 'policy'))
        db.exec("ALTER TABLE organize_jobs ADD COLUMN policy TEXT NOT NULL DEFAULT ''");
    if (!columns.some(x => x.name === 'archived'))
        db.exec('ALTER TABLE organize_jobs ADD COLUMN archived INTEGER NOT NULL DEFAULT 0');
    db.exec('CREATE INDEX IF NOT EXISTS organize_jobs_visible ON organize_jobs(archived,root,created)');
}
function catalogSchema(db) {
    db.exec(`CREATE TABLE IF NOT EXISTS catalog_entries(root TEXT NOT NULL,path TEXT NOT NULL,parent TEXT NOT NULL,kind TEXT NOT NULL,identity TEXT NOT NULL,signature TEXT NOT NULL,bytes INTEGER NOT NULL,generation TEXT NOT NULL,PRIMARY KEY(root,path));
 CREATE INDEX IF NOT EXISTS catalog_parent ON catalog_entries(root,parent,path);
 CREATE INDEX IF NOT EXISTS catalog_generation ON catalog_entries(root,generation,kind,path);
 CREATE INDEX IF NOT EXISTS file_identity ON files(root,identity);
 CREATE TABLE IF NOT EXISTS catalog_recommendations(root TEXT NOT NULL,path TEXT NOT NULL,signature TEXT NOT NULL,rules TEXT NOT NULL,folders TEXT NOT NULL,destination TEXT NOT NULL,reason TEXT NOT NULL,PRIMARY KEY(root,path));`);
}
function routingRevision(db, root) {
    return (0, node_crypto_1.createHash)('sha256').update(JSON.stringify([
        db.prepare('SELECT * FROM routing_rules WHERE root=? ORDER BY id').all(root),
        db.prepare('SELECT * FROM preferences WHERE root=? ORDER BY pattern,folder').all(root)
    ])).digest('hex');
}
const objectIdentity = (s) => `${s.dev}:${s.ino}:${s.birthtimeNs}`;
exports.objectIdentity = objectIdentity;
const metadataSignature = (s) => `${(0, exports.objectIdentity)(s)}:${s.size}:${s.mtimeNs}:${s.ctimeNs}`;
exports.metadataSignature = metadataSignature;
