"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardSnapshot = dashboardSnapshot;
exports.recordFileOpen = recordFileOpen;
// Read indexed records only: opening Home must not walk users' folders.
function dashboardSnapshot(db) {
    const sizeRows = db.prepare(`SELECT f.root,COUNT(*) files,COUNT(s.file) measured,COALESCE(SUM(s.bytes),0) bytes,MAX(s.checked) checked
 FROM files f LEFT JOIN file_sizes s ON s.file=f.id WHERE f.status NOT IN ('deleted','replaced') AND NOT EXISTS (SELECT 1 FROM file_controls fc WHERE fc.file=f.id AND fc.state='off') GROUP BY f.root`).all();
    const recent = db.prepare(`SELECT f.id,f.root,f.path,f.status,v.seq version,v.created,v.kind
 FROM files f JOIN versions v ON v.file=f.id AND v.seq=(SELECT MAX(v2.seq) FROM versions v2 WHERE v2.file=f.id)
 WHERE f.status NOT IN ('deleted','replaced') AND NOT EXISTS (SELECT 1 FROM file_controls fc WHERE fc.file=f.id AND fc.state='off') ORDER BY v.created DESC,f.id LIMIT 5`).all();
    const opened = db.prepare(`SELECT f.id,f.root,f.path,f.status,o.opened,(SELECT MAX(seq) FROM versions v WHERE v.file=f.id) version
 FROM file_opens o JOIN files f ON f.id=o.file WHERE f.status NOT IN ('deleted','replaced') AND NOT EXISTS (SELECT 1 FROM file_controls fc WHERE fc.file=f.id AND fc.state='off') ORDER BY o.opened DESC,f.id LIMIT 5`).all();
    return { sizes: sizeRows, recent, opened, openStatus: 'unknown' };
}
function recordFileOpen(db, id) {
    if (!db.prepare("SELECT id FROM files WHERE id=? AND status NOT IN ('deleted','replaced')").get(id))
        return;
    db.prepare('INSERT OR REPLACE INTO file_opens VALUES (?,?)').run(id, Date.now());
    db.exec('DELETE FROM file_opens WHERE file NOT IN (SELECT file FROM file_opens ORDER BY opened DESC,file LIMIT 50)');
}
