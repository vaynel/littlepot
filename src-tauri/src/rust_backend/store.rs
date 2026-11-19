use super::{files, Result};
use git2::{Oid, Repository, RepositoryInitOptions};
use rusqlite::{params, Connection, OptionalExtension, Params};
use serde_json::{json, Value};
use similar::{ChangeTag, TextDiff};
use std::{
    fs,
    path::{Path, PathBuf},
    time::{Duration, Instant},
};
use uuid::Uuid;

pub struct Store {
    pub db: Connection,
    pub data: PathBuf,
    pub repo: Repository,
}

pub(super) const MIN_FREE_SPACE: u64 = 64 * 1024 * 1024;
const WRITE_OVERHEAD: u64 = 8 * 1024;

#[derive(Clone, Copy)]
pub(super) struct ScanProgress {
    pub total: usize,
    pub processed: usize,
    pub complete_listing: bool,
}

#[derive(Default)]
struct IndexedFile {
    id: String,
    hash: String,
    path: String,
    status: String,
    signature: String,
    management: String,
}

fn indexed_file(row: &rusqlite::Row<'_>) -> rusqlite::Result<IndexedFile> {
    Ok(IndexedFile {
        id: row.get(0)?,
        hash: row.get(1)?,
        path: row.get(2)?,
        status: row.get(3)?,
        signature: row.get(4)?,
        management: row.get(5)?,
    })
}

const INDEXED_FILE: &str = "SELECT f.id,f.hash,f.path,f.status,COALESCE(i.signature,''),COALESCE(c.state,'')
    FROM files f LEFT JOIN file_controls c ON c.file=f.id LEFT JOIN file_identities i ON i.file=f.id ";

const FILE_COLUMNS: &str = "id TEXT PRIMARY KEY,root TEXT NOT NULL REFERENCES roots(id),
    path TEXT NOT NULL,hash TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'stored',
    bytes INTEGER NOT NULL,observed INTEGER NOT NULL";

fn create_file_index(db: &mut Connection) -> Result {
    let old_schema: bool = db.query_row(
        "SELECT EXISTS(SELECT 1 FROM pragma_index_list('files') WHERE origin='u')",
        [],
        |row| row.get(0),
    )?;
    if old_schema {
        db.execute_batch("PRAGMA foreign_keys=OFF;")?;
        let tx = db.transaction()?;
        tx.execute_batch(&format!(
            "CREATE TABLE files_new({FILE_COLUMNS});
             INSERT INTO files_new SELECT id,root,path,hash,status,bytes,observed FROM files;
             DROP TABLE files;
             ALTER TABLE files_new RENAME TO files;",
        ))?;
        let foreign_key_errors: bool = tx.query_row(
            "SELECT EXISTS(SELECT 1 FROM pragma_foreign_key_check)",
            [],
            |row| row.get(0),
        )?;
        if foreign_key_errors {
            return Err("파일 이력의 연결을 확인하지 못했어요.".into());
        }
        tx.commit()?;
        db.execute_batch("PRAGMA foreign_keys=ON;")?;
    }
    db.execute_batch(
        "CREATE INDEX IF NOT EXISTS files_root_path ON files(root,path,observed);
         CREATE UNIQUE INDEX IF NOT EXISTS files_current_path ON files(root,path)
         WHERE status NOT IN ('deleted','replaced');",
    )?;
    Ok(())
}

fn save_observation(
    tx: &rusqlite::Transaction,
    file: &IndexedFile,
    observed: &files::ObservedFile,
    path: &str,
) -> Result<()> {
    tx.execute(
        "INSERT OR REPLACE INTO file_identities VALUES (?,?,?)",
        params![file.id, observed.key, observed.signature],
    )?;
    if !file.path.is_empty() && file.path != path {
        tx.execute(
            "INSERT INTO events(id,file,kind,path,old_path,status,created,metadata)
             VALUES (?,?,'renamed',?,?,'committed',?,'{}')",
            params![Uuid::new_v4().to_string(), file.id, path, file.path, now()],
        )?;
    }
    Ok(())
}

pub fn now() -> i64 {
    chrono::Utc::now().timestamp_millis()
}

impl Store {
    pub(super) fn open_scanner(data: PathBuf, archive: &Path) -> Result<Self> {
        let db = Connection::open_with_flags(
            data.join("garden-rust.sqlite"),
            rusqlite::OpenFlags::SQLITE_OPEN_READ_WRITE,
        )?;
        db.busy_timeout(Duration::from_secs(5))?;
        db.execute_batch("PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON;")?;
        let repo = Repository::open_bare(archive)?;
        Ok(Self { db, data, repo })
    }

    pub fn open(data: PathBuf) -> Result<Self> {
        fs::create_dir_all(&data)?;
        let data = dunce::canonicalize(data)?;
        let mut db = Connection::open(data.join("garden-rust.sqlite"))?;
        db.busy_timeout(Duration::from_secs(5))?;
        db.execute_batch(&format!("PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON;
          CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
          CREATE TABLE IF NOT EXISTS installed_themes(id TEXT PRIMARY KEY,entry TEXT NOT NULL,package BLOB NOT NULL);
          CREATE TABLE IF NOT EXISTS diagnostic_events(id INTEGER PRIMARY KEY,created INTEGER NOT NULL,entry TEXT NOT NULL);
          CREATE TABLE IF NOT EXISTS visits(day TEXT PRIMARY KEY);
          CREATE TABLE IF NOT EXISTS plants(id INTEGER PRIMARY KEY,name TEXT NOT NULL,folder TEXT);
          CREATE TABLE IF NOT EXISTS roots(id TEXT PRIMARY KEY,plant INTEGER UNIQUE,path TEXT UNIQUE,active INTEGER NOT NULL,scanned INTEGER DEFAULT 0);
          CREATE TABLE IF NOT EXISTS files({FILE_COLUMNS});
          CREATE TABLE IF NOT EXISTS file_controls(file TEXT PRIMARY KEY REFERENCES files(id),state TEXT NOT NULL,updated INTEGER NOT NULL);
          CREATE TABLE IF NOT EXISTS file_identities(file TEXT PRIMARY KEY REFERENCES files(id),file_key TEXT NOT NULL,signature TEXT NOT NULL);
          CREATE INDEX IF NOT EXISTS file_identity_lookup ON file_identities(file_key);
          CREATE TABLE IF NOT EXISTS file_opens(file TEXT PRIMARY KEY REFERENCES files(id),opened INTEGER NOT NULL);
          CREATE TABLE IF NOT EXISTS scan_issues(root TEXT NOT NULL REFERENCES roots(id),path TEXT NOT NULL,reason TEXT NOT NULL,PRIMARY KEY(root,path));
          CREATE TABLE IF NOT EXISTS scan_folders(root TEXT NOT NULL REFERENCES roots(id),path TEXT NOT NULL,PRIMARY KEY(root,path));
          CREATE TABLE IF NOT EXISTS versions(id TEXT PRIMARY KEY,file TEXT NOT NULL REFERENCES files(id),seq INTEGER NOT NULL,hash TEXT NOT NULL,blob TEXT NOT NULL,created INTEGER NOT NULL,kind TEXT NOT NULL,UNIQUE(file,seq));
          CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY,file TEXT NOT NULL REFERENCES files(id),kind TEXT NOT NULL,path TEXT NOT NULL,old_path TEXT,status TEXT NOT NULL,created INTEGER NOT NULL,metadata TEXT);
          CREATE INDEX IF NOT EXISTS events_file_created ON events(file,created DESC);
          CREATE TABLE IF NOT EXISTS gaps(id TEXT PRIMARY KEY,root TEXT NOT NULL REFERENCES roots(id),start INTEGER NOT NULL,end INTEGER,reason TEXT NOT NULL);
          CREATE TABLE IF NOT EXISTS routing_rules(id TEXT PRIMARY KEY,root TEXT NOT NULL REFERENCES roots(id),keywords TEXT NOT NULL,extension TEXT NOT NULL,folder TEXT NOT NULL,enabled INTEGER NOT NULL,updated INTEGER NOT NULL);
          CREATE TABLE IF NOT EXISTS name_rules(id TEXT PRIMARY KEY,root TEXT NOT NULL REFERENCES roots(id),scope TEXT NOT NULL,template TEXT NOT NULL,revision INTEGER NOT NULL,active INTEGER NOT NULL,UNIQUE(root,scope));
          CREATE TABLE IF NOT EXISTS name_exceptions(file TEXT NOT NULL REFERENCES files(id),rule TEXT NOT NULL REFERENCES name_rules(id),revision INTEGER NOT NULL,PRIMARY KEY(file,rule,revision));
          CREATE TABLE IF NOT EXISTS preferences(root TEXT NOT NULL REFERENCES roots(id),pattern TEXT NOT NULL,folder TEXT NOT NULL,count REAL NOT NULL,updated INTEGER NOT NULL,PRIMARY KEY(root,pattern,folder));
          CREATE TABLE IF NOT EXISTS learned_ops(op TEXT PRIMARY KEY,root TEXT NOT NULL REFERENCES roots(id),pattern TEXT NOT NULL,folder TEXT NOT NULL,weight REAL NOT NULL,active INTEGER NOT NULL,hash TEXT NOT NULL);
          CREATE TABLE IF NOT EXISTS organize_jobs(id TEXT PRIMARY KEY, root TEXT NOT NULL REFERENCES roots(id), scope TEXT NOT NULL, root_key TEXT NOT NULL,
            recursive INTEGER NOT NULL, state TEXT NOT NULL, policy TEXT NOT NULL, rules_revision TEXT NOT NULL,
            revision INTEGER NOT NULL DEFAULT 0, observed INTEGER NOT NULL DEFAULT 0, excluded INTEGER NOT NULL DEFAULT 0,
            issues INTEGER NOT NULL DEFAULT 0, error TEXT NOT NULL DEFAULT '', created INTEGER NOT NULL, updated INTEGER NOT NULL);
          CREATE TABLE IF NOT EXISTS organize_items(seq INTEGER PRIMARY KEY,id TEXT UNIQUE NOT NULL,job TEXT NOT NULL REFERENCES organize_jobs(id),
            source TEXT NOT NULL,signature TEXT NOT NULL,destination TEXT NOT NULL DEFAULT '',target TEXT,state TEXT NOT NULL,
            selected INTEGER NOT NULL DEFAULT 0,reason TEXT NOT NULL DEFAULT '',batch TEXT,operation TEXT REFERENCES ops(id));
          CREATE INDEX IF NOT EXISTS organize_items_job ON organize_items(job,seq);
          CREATE TABLE IF NOT EXISTS organize_folders(job TEXT NOT NULL REFERENCES organize_jobs(id),path TEXT NOT NULL,target TEXT NOT NULL,
            approved INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(job,path));
          CREATE TABLE IF NOT EXISTS organize_policies(root TEXT NOT NULL REFERENCES roots(id),scope TEXT NOT NULL,policy TEXT NOT NULL,PRIMARY KEY(root,scope));
          CREATE TABLE IF NOT EXISTS ops(id TEXT PRIMARY KEY,batch TEXT,plant INTEGER,source TEXT,destination TEXT,hash TEXT,mode TEXT,status TEXT,reward INTEGER DEFAULT 1,created INTEGER);
          CREATE TABLE IF NOT EXISTS op_journal(id TEXT PRIMARY KEY REFERENCES ops(id),from_path TEXT NOT NULL,to_path TEXT NOT NULL,file_key TEXT NOT NULL,undo INTEGER NOT NULL);
          CREATE TABLE IF NOT EXISTS task_items(id TEXT PRIMARY KEY,batch TEXT NOT NULL,payload TEXT NOT NULL,status TEXT NOT NULL,reason TEXT NOT NULL DEFAULT '',operation TEXT REFERENCES ops(id),created INTEGER NOT NULL,updated INTEGER NOT NULL);
          CREATE TABLE IF NOT EXISTS aftercare(id TEXT PRIMARY KEY,operation TEXT NOT NULL REFERENCES ops(id),root TEXT NOT NULL REFERENCES roots(id),kind TEXT NOT NULL,status TEXT NOT NULL,reason TEXT NOT NULL DEFAULT '',updated INTEGER NOT NULL);"))?;
        create_file_index(&mut db)?;
        for (id, name) in ["문서", "사진", "보관"].into_iter().enumerate() {
            db.execute(
                "INSERT OR IGNORE INTO plants(id,name) VALUES (?,?)",
                params![id as i64, name],
            )?;
        }
        db.execute(
            "INSERT OR IGNORE INTO visits VALUES (?)",
            [chrono::Local::now().date_naive().to_string()],
        )?;
        let stored_archive = db
            .query_row(
                "SELECT value FROM settings WHERE key='archiveCurrent'",
                [],
                |row| row.get::<_, String>(0),
            )
            .optional()?;
        let archive = stored_archive
            .as_deref()
            .map(serde_json::from_str::<String>)
            .transpose()?;
        let archive_name = archive.as_deref().unwrap_or("history.git");
        let archive_directory: Option<PathBuf> = db
            .query_row(
                "SELECT value FROM settings WHERE key='archiveDirectory'",
                [],
                |row| row.get::<_, String>(0),
            )
            .optional()?
            .map(|value| serde_json::from_str(&value))
            .transpose()?;
        let versions = if let Some(directory) = &archive_directory {
            files::local(directory).map_err(|_| "지정한 버전 보관 드라이브에 연결해 주세요.")?
        } else {
            let directory = data.join("version-store");
            fs::create_dir_all(&directory)?;
            directory
        };
        let repo_path = super::record_deletion::archive_path(&versions, archive_name)?;
        let repo =
            if repo_path.join("HEAD").is_file() || archive.is_some() || archive_directory.is_some()
            {
                Repository::open_bare(&repo_path)?
            } else {
                Repository::init_opts(
                    &repo_path,
                    RepositoryInitOptions::new()
                        .bare(true)
                        .external_template(false),
                )?
            };
        let store = Self { db, data, repo };
        let _ = store.finish_archive_cleanup();
        if store.get("recordJob", Value::Null)?["phase"] == "queued" {
            store.set("recordJob", &json!({"phase":"failed","error":"앱이 종료되어 삭제를 중단했어요. 다시 선택해 주세요."}))?;
        }
        Ok(store)
    }

    pub fn get(&self, key: &str, fallback: Value) -> Result<Value> {
        let text = self
            .db
            .query_row("SELECT value FROM settings WHERE key=?", [key], |row| {
                row.get::<_, String>(0)
            })
            .optional()?;
        Ok(text
            .map(|v| serde_json::from_str(&v))
            .transpose()?
            .unwrap_or(fallback))
    }

    pub fn set(&self, key: &str, value: &Value) -> Result<()> {
        self.db.execute(
            "INSERT OR REPLACE INTO settings VALUES (?,?)",
            params![key, value.to_string()],
        )?;
        Ok(())
    }

    pub fn rows(&self, sql: &str, args: impl Params) -> Result<Vec<Value>> {
        let mut stmt = self.db.prepare(sql)?;
        let mut rows = stmt.query(args)?;
        let mut values = Vec::new();
        while let Some(row) = rows.next()? {
            values.push(serde_json::from_str(&row.get::<_, String>(0)?)?);
        }
        Ok(values)
    }

    pub fn root_path(&self, id: &str) -> Result<PathBuf> {
        let path: String = self
            .db
            .query_row("SELECT path FROM roots WHERE id=?", [id], |r| r.get(0))?;
        Ok(PathBuf::from(path))
    }

    pub fn register(
        &mut self,
        path: &Path,
        plant: Option<i64>,
        name: Option<&str>,
    ) -> Result<String> {
        let path = files::local(path)?;
        if !path.is_dir()
            || path.parent().is_none()
            || path.starts_with(&self.data)
            || self.data.starts_with(&path)
            || super::archive_location::overlap(&path, self.archive_directory())
        {
            return Err("앱 데이터 경로와 분리된 관리 폴더를 선택해 주세요.".into());
        }
        if name.is_some_and(|name| name.trim().is_empty() || name.chars().count() > 12) {
            return Err("화분 이름은 1~12자로 입력해 주세요.".into());
        }
        let path = path.to_str().ok_or("지원하는 경로 이름을 선택해 주세요.")?;
        let existing = self
            .db
            .query_row("SELECT id FROM roots WHERE path=?", [path], |r| {
                r.get::<_, String>(0)
            })
            .optional()?;
        let id = existing.unwrap_or_else(|| Uuid::new_v4().to_string());
        for root in self.roots()? {
            let other = Path::new(
                root["path"]
                    .as_str()
                    .ok_or("기존 관리 경로를 확인해 주세요.")?,
            );
            if root["id"] != id && (other.starts_with(path) || Path::new(path).starts_with(other)) {
                return Err("이미 관리하는 폴더와 겹치는 경로예요.".into());
            }
        }
        let tx = self.db.transaction()?;
        tx.execute(
            "INSERT INTO roots(id,path,active) VALUES (?,?,1)
             ON CONFLICT(id) DO UPDATE SET active=1",
            params![id, path],
        )?;
        if let Some(plant) = plant {
            Self::assign(&tx, &id, plant, path)?;
            tx.execute(
                "UPDATE plants SET name=COALESCE(?,name) WHERE id=?",
                params![name, plant],
            )?;
        }
        tx.commit()?;
        Ok(id)
    }

    fn assign(tx: &rusqlite::Transaction, id: &str, plant: i64, path: &str) -> Result<()> {
        tx.execute(
            "UPDATE plants SET folder=NULL WHERE id=(SELECT plant FROM roots WHERE id=?)",
            [id],
        )?;
        tx.execute("UPDATE roots SET plant=NULL WHERE plant=?", [plant])?;
        tx.execute("UPDATE roots SET plant=? WHERE id=?", params![plant, id])?;
        tx.execute(
            "UPDATE plants SET folder=? WHERE id=?",
            params![path, plant],
        )?;
        Ok(())
    }

    pub fn shortcut(&mut self, root: &str, plant: i64) -> Result<()> {
        let path = self.root_path(root)?;
        if !files::local(&path)?.is_dir() {
            return Err("관리 폴더의 위치를 확인해 주세요.".into());
        }
        let tx = self.db.transaction()?;
        Self::assign(
            &tx,
            root,
            plant,
            path.to_str().ok_or("관리 경로를 확인해 주세요.")?,
        )?;
        tx.commit()?;
        Ok(())
    }

    pub fn roots(&self) -> Result<Vec<Value>> {
        self.rows("SELECT json_object('id',r.id,'plant',r.plant,'path',r.path,'active',json(CASE WHEN r.active=1 THEN 'true' ELSE 'false' END),
          'status',CASE WHEN r.active=1 THEN 'ready' ELSE 'paused' END,'error','','scanned',r.scanned,'processed',r.scanned,'total',r.scanned,'total_known',1,'excluded',0,
          'stored', (SELECT count(*) FROM files WHERE root=r.id AND status='stored'),'versions',(SELECT count(*) FROM versions v JOIN files f ON f.id=v.file WHERE f.root=r.id),'pending',0)
          FROM roots r ORDER BY r.plant, r.path", [])
    }

    pub fn scan(&mut self, root: &str) -> Result<()> {
        self.scan_with_events(root, &[], |_| {})
    }

    pub(super) fn scan_with_events(
        &mut self,
        root: &str,
        paths: &[PathBuf],
        mut report: impl FnMut(ScanProgress),
    ) -> Result<()> {
        let folder = self.root_path(root)?;
        let budget = self.get("storageBudget", json!(5))?.as_u64().unwrap_or(5) * super::GIB;
        let mut used = files::tree_size(self.archive_directory())?;
        let index_on_archive_drive = self.archive_directory().starts_with(&self.data);
        let mut tree = files::tree(&folder)?;
        let first_scan: bool =
            self.db
                .query_row("SELECT scanned=0 FROM roots WHERE id=?", [root], |row| {
                    row.get(0)
                })?;
        if first_scan {
            let mut statement = self
                .db
                .prepare("SELECT path FROM files WHERE root=? AND status='stored'")?;
            let stored = statement
                .query_map([root], |row| row.get::<_, String>(0))?
                .collect::<std::result::Result<std::collections::HashSet<_>, _>>()?;
            if !stored.is_empty() {
                tree.files
                    .sort_by_key(|path| path.to_str().is_some_and(|path| stored.contains(path)));
            }
        }
        let mut progress = ScanProgress {
            total: tree.files.len(),
            processed: 0,
            complete_listing: tree.complete,
        };
        report(progress);
        let mut last_report = Instant::now();
        let mut issues = tree.issues;
        let mut seen = std::collections::HashSet::new();
        for (index, path) in tree.files.into_iter().enumerate() {
            if last_report.elapsed() >= Duration::from_secs(15) {
                progress.processed = index;
                report(progress);
                last_report = Instant::now();
            }
            let Some(text) = path.to_str() else { continue };
            seen.insert(text.to_owned());
            let mut previous = self
                .db
                .query_row(
                    &format!(
                        "{INDEXED_FILE} WHERE f.root=? AND f.path=? AND f.status!='replaced'
                        ORDER BY f.status='deleted',f.observed DESC,f.id LIMIT 1"
                    ),
                    params![root, text],
                    indexed_file,
                )
                .optional()?;
            if previous
                .as_ref()
                .is_some_and(|file| file.management == "off")
            {
                continue;
            }
            let observed = match files::ObservedFile::open(&path) {
                Ok(observed) => observed,
                Err(_) => {
                    issues.push((path, "파일을 확인하지 못했어요. 지금 확인을 눌러 주세요."));
                    continue;
                }
            };
            if previous.is_none() && !observed.key.starts_with("file-index:") {
                let mut statement = self.db.prepare(&format!(
                    "{INDEXED_FILE} WHERE f.root=? AND i.file_key=? AND f.status!='replaced'
                     AND COALESCE(c.state,'')!='off'
                     ORDER BY f.observed DESC"
                ))?;
                for file in statement.query_map(params![root, observed.key], indexed_file)? {
                    let file = file?;
                    if fs::symlink_metadata(&file.path)
                        .is_err_and(|e| e.kind() == std::io::ErrorKind::NotFound)
                    {
                        previous = Some(file);
                        break;
                    }
                }
            }
            let file = previous.unwrap_or_else(|| IndexedFile {
                id: Uuid::new_v4().to_string(),
                ..Default::default()
            });
            if file.status == "stored"
                && file.path == text
                && file.signature == observed.signature
                && !paths.contains(&path)
            {
                continue;
            }
            let bytes = match observed.bytes() {
                Ok(bytes) => bytes,
                Err(_) => {
                    issues.push((path, "파일을 읽지 못했어요. 지금 확인을 눌러 주세요."));
                    continue;
                }
            };
            let hash = files::digest(&bytes);
            if file.hash == hash {
                let tx = self.db.transaction()?;
                tx.execute(
                    "UPDATE files SET status='stored',path=?,bytes=?,observed=? WHERE id=?",
                    params![text, bytes.len() as i64, now(), file.id],
                )?;
                save_observation(&tx, &file, &observed, text)?;
                tx.commit()?;
                continue;
            }
            let known = Oid::hash_object(git2::ObjectType::Blob, &bytes)?;
            let new_object = !self.repo.odb()?.exists(known);
            let estimate =
                WRITE_OVERHEAD.saturating_add(if new_object { bytes.len() as u64 } else { 0 });
            if used.saturating_add(estimate) > budget
                || files::disk_space(self.repo.path())?.0 < estimate.saturating_add(MIN_FREE_SPACE)
                || (!index_on_archive_drive
                    && files::disk_space(&self.data)?.0 < MIN_FREE_SPACE + WRITE_OVERHEAD)
            {
                issues.push((
                    path,
                    "보관 공간이 부족해요. 한도와 디스크 여유 공간을 확인해 주세요.",
                ));
                continue;
            }
            let blob = self.repo.blob(&bytes)?;
            if new_object {
                let name = blob.to_string();
                let loose = self
                    .repo
                    .path()
                    .join("objects")
                    .join(&name[..2])
                    .join(&name[2..]);
                let size = fs::metadata(loose).map_or(estimate, |metadata| metadata.len());
                used = used.saturating_add(size);
            }
            let version = Uuid::new_v4().to_string();
            self.repo.reference(
                &format!("refs/windowsill/{version}"),
                blob,
                false,
                "Archive file version",
            )?;
            // Loose references contain the object ID followed by a newline.
            used = used.saturating_add(41);
            let blob = blob.to_string();
            let tx = self.db.transaction()?;
            tx.execute("INSERT INTO files(id,root,path,hash,bytes,observed) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET path=excluded.path,hash=excluded.hash,bytes=excluded.bytes,observed=excluded.observed,status='stored'",
                params![file.id,root,text,hash,bytes.len() as i64,now()])?;
            save_observation(&tx, &file, &observed, text)?;
            tx.execute("INSERT INTO versions SELECT ?,?,coalesce(max(seq),0)+1,?,?,?,? FROM versions WHERE file=?",
                params![version,file.id,hash,blob,now(),if file.hash.is_empty() { "created" } else { "changed" },file.id])?;
            tx.execute(
                "INSERT INTO events(id,file,kind,path,old_path,status,created,metadata)
                VALUES (?,?,?,?,'','committed',?,'{}')",
                params![
                    version,
                    file.id,
                    if file.hash.is_empty() {
                        "initial"
                    } else {
                        "content"
                    },
                    text,
                    now(),
                ],
            )?;
            tx.commit()?;
        }
        let excluded: std::collections::HashSet<&Path> =
            issues.iter().map(|issue| issue.0.as_path()).collect();
        if tree.complete {
            for file in self.list(root, false)? {
                if let Some(path) = file["path"].as_str().filter(|path| !seen.contains(*path)) {
                    if !excluded.contains(Path::new(path))
                        && fs::symlink_metadata(path)
                            .is_err_and(|error| error.kind() == std::io::ErrorKind::NotFound)
                    {
                        self.db.execute("UPDATE files SET status='deleted' WHERE root=? AND path=? AND status!='replaced'",
                            params![root, path])?;
                    }
                }
            }
        }
        let tx = self.db.transaction()?;
        tx.execute("DELETE FROM scan_issues WHERE root=?", [root])?;
        if tree.complete {
            tx.execute("DELETE FROM scan_folders WHERE root=?", [root])?;
        }
        for folder in tree.folders {
            if let Some(folder) = folder.to_str() {
                tx.execute(
                    "INSERT OR IGNORE INTO scan_folders VALUES (?,?)",
                    params![root, folder],
                )?;
            }
        }
        for (path, reason) in &issues {
            tx.execute(
                "INSERT OR REPLACE INTO scan_issues VALUES (?,?,?)",
                params![root, path.to_string_lossy(), reason],
            )?;
        }
        tx.execute(
            "UPDATE roots SET scanned=? WHERE id=?",
            params![seen.len() as i64, root],
        )?;
        tx.commit()?;
        Ok(())
    }

    pub fn browse_folders(&self, root: &str) -> Result<Vec<PathBuf>> {
        let base = self.root_path(root)?;
        let mut folders = std::collections::BTreeSet::from([base.clone()]);
        let mut indexed = self
            .db
            .prepare("SELECT path FROM scan_folders WHERE root=?")?;
        for path in indexed.query_map([root], |row| row.get::<_, String>(0))? {
            folders.insert(PathBuf::from(path?));
        }
        if folders.len() <= 1 {
            let mut files = self.db.prepare(
                "SELECT path FROM files WHERE root=? AND status NOT IN ('deleted','replaced')",
            )?;
            for path in files.query_map([root], |row| row.get::<_, String>(0))? {
                for parent in Path::new(&path?)
                    .ancestors()
                    .skip(1)
                    .take_while(|p| p.starts_with(&base))
                {
                    folders.insert(parent.to_owned());
                }
            }
        }
        Ok(folders.into_iter().collect())
    }

    pub fn folder_column_files(
        &self,
        root: &str,
        folder: &Path,
        direct_only: bool,
    ) -> Result<Vec<Value>> {
        let base = self.root_path(root)?;
        let relative = folder.strip_prefix(&base)?;
        if relative
            .components()
            .any(|part| !matches!(part, std::path::Component::Normal(_)))
        {
            return Err("관리 폴더 안의 경로를 선택해 주세요.".into());
        }
        let mut columns = Vec::new();
        for directory in folder.ancestors().take_while(|p| p.starts_with(&base)) {
            // Both bounds share the directory name. Incrementing the final separator
            // gives an exclusive upper bound for the indexed (root,path) prefix.
            let sep = std::path::MAIN_SEPARATOR;
            let name = directory.to_string_lossy();
            let stem = name.trim_end_matches(sep);
            let prefix = format!("{stem}{sep}");
            let end = format!("{stem}{}", char::from(sep as u8 + 1));
            columns.extend(self.rows(
                "SELECT json_object('id',f.id,'path',f.path,'status',f.status,'version_count',
                    (SELECT count(*) FROM versions WHERE file=f.id))
                 FROM files f LEFT JOIN file_controls c ON c.file=f.id
                 WHERE f.root=?1 AND f.path>=?2 AND f.path<?3
                   AND instr(substr(f.path,length(?2)+1),?4)=0 AND COALESCE(c.state,'')!='off'
                 ORDER BY f.path,f.status IN ('deleted','replaced'),f.observed DESC,f.id",
                params![root, prefix, end, sep.to_string()],
            )?);
            if direct_only {
                break;
            }
        }
        Ok(columns)
    }

    pub fn list(&self, root: &str, unmanaged: bool) -> Result<Vec<Value>> {
        self.rows("SELECT json_object('id',f.id,'root',f.root,'path',f.path,'status',f.status,'hash',f.hash,'bytes',f.bytes,'error','','management',COALESCE(c.state,''),'observed',f.observed,'version_count',(SELECT count(*) FROM versions WHERE file=f.id))
            FROM files f LEFT JOIN file_controls c ON c.file=f.id
            WHERE f.root=? AND (COALESCE(c.state,'')='off')=?
            ORDER BY f.path,f.status IN ('deleted','replaced'),f.observed DESC,f.id", params![root, unmanaged])
    }

    pub fn manage_file(&mut self, id: &str, action: &str) -> Result<()> {
        let (root, status): (String, String) =
            self.db
                .query_row("SELECT root,status FROM files WHERE id=?", [id], |r| {
                    Ok((r.get(0)?, r.get(1)?))
                })?;
        let state = match action {
            "stop" => "off",
            "resume" => "keep",
            "keep" if status == "deleted" || status == "replaced" => "keep",
            _ => return Err("파일의 관리 선택을 다시 확인해 주세요.".into()),
        };
        self.db.execute(
            "INSERT OR REPLACE INTO file_controls VALUES (?,?,?)",
            params![id, state, now()],
        )?;
        if state == "keep"
            && self
                .db
                .query_row("SELECT active FROM roots WHERE id=?", [&root], |r| {
                    r.get::<_, bool>(0)
                })?
        {
            self.scan(&root)?;
        }
        Ok(())
    }

    pub fn timeline(&self, file: &str) -> Result<Value> {
        let entry = self.rows("SELECT json_object('id',f.id,'root',f.root,'path',f.path,'status',f.status,'management',COALESCE(c.state,'')) FROM files f LEFT JOIN file_controls c ON c.file=f.id WHERE f.id=?", [file])?.pop().ok_or("파일 기록을 찾지 못했어요.")?;
        let versions = self.rows("SELECT json_object('id',id,'seq',seq,'hash',hash,'blob',blob,'created',created,'kind',kind) FROM versions WHERE file=? ORDER BY seq DESC", [file])?;
        let events = self.rows("SELECT json_object('id',id,'kind',kind,'path',path,'old_path',old_path,'status',status,'created',created,'metadata',metadata) FROM events WHERE file=? ORDER BY created DESC", [file])?;
        let root = entry["root"]
            .as_str()
            .ok_or("관리 폴더 기록을 찾지 못했어요.")?;
        let gaps = self.rows("SELECT json_object('id',id,'root',root,'start',start,'end',end,'reason',reason) FROM gaps WHERE root=? ORDER BY start DESC LIMIT 30", [root])?;
        Ok(json!({"file":entry,"versions":versions,"events":events,"gaps":gaps}))
    }

    pub fn version(&self, id: &str) -> Result<(String, PathBuf, i64, Vec<u8>)> {
        let (file, path, seq, blob, hash): (String,String,i64,String,String) = self.db.query_row(
            "SELECT f.id,f.path,v.seq,v.blob,v.hash FROM versions v JOIN files f ON f.id=v.file WHERE v.id=?", [id],
            |r| Ok((r.get(0)?,r.get(1)?,r.get(2)?,r.get(3)?,r.get(4)?)))?;
        if blob.len() != 40 || !blob.bytes().all(|b| b.is_ascii_hexdigit()) {
            return Err("유효하지 않은 Git 객체예요.".into());
        }
        let bytes = self
            .repo
            .find_blob(Oid::from_str(&blob)?)?
            .content()
            .to_vec();
        if files::digest(&bytes) != hash {
            return Err("보관한 파일의 무결성을 확인하지 못했어요.".into());
        }
        Ok((file, PathBuf::from(path), seq, bytes))
    }

    pub fn diff(&self, file: &str, a: &str, b: &str) -> Result<Value> {
        let (left, _, old, before) = self.version(a)?;
        let (right, _, new, after) = self.version(b)?;
        if left != file || right != file {
            return Err("같은 파일의 두 버전을 선택해 주세요.".into());
        }
        let decode = |bytes: &[u8]| -> Result<String> {
            let text = std::str::from_utf8(bytes)?.trim_start_matches('\u{feff}');
            if bytes.len() > 256 * 1024
                || text.lines().count() > 1500
                || text.bytes().any(|b| b < 32 && !matches!(b, 9 | 10 | 13))
            {
                return Err("256KiB 및 1,500줄 이하의 텍스트를 비교할 수 있어요.".into());
            }
            Ok(text.to_owned())
        };
        let a_text = decode(&before)?;
        let b_text = decode(&after)?;
        let a_norm = a_text.replace("\r\n", "\n");
        let b_norm = b_text.replace("\r\n", "\n");
        let diff = TextDiff::from_lines(&a_norm, &b_norm);
        let (mut added, mut removed) = (0, 0);
        let rows = diff.iter_all_changes().map(|change| {
            let kind = match change.tag() { ChangeTag::Equal => "equal", ChangeTag::Delete => { removed += 1; "remove" }, ChangeTag::Insert => { added += 1; "add" } };
            json!({"kind":kind,"text":change.value().trim_end_matches('\n'),"oldLine":change.old_index().map(|i|i+1),"newLine":change.new_index().map(|i|i+1)})
        }).collect::<Vec<_>>();
        Ok(
            json!({"file":file,"from":{"id":a,"seq":old},"to":{"id":b,"seq":new},"rows":rows,"added":added,"removed":removed,"identical":before==after,
            "lineEndingChanged":a_text.contains("\r\n")!=b_text.contains("\r\n"),"fromFinalNewline":a_text.ends_with('\n'),"toFinalNewline":b_text.ends_with('\n')}),
        )
    }

    pub fn compact(&self) -> Result<()> {
        let size = files::tree_size(self.repo.path())?;
        if files::disk_space(self.repo.path())?.0
            < size.saturating_mul(2).saturating_add(MIN_FREE_SPACE)
        {
            return Err("압축에 필요한 임시 공간이 부족해요.".into());
        }
        let mut pack = self.repo.packbuilder()?;
        let mut stmt = self.db.prepare("SELECT DISTINCT blob,hash FROM versions")?;
        let blobs = stmt
            .query_map([], |r| Ok((r.get::<_, String>(0)?, r.get::<_, String>(1)?)))?
            .collect::<std::result::Result<Vec<_>, _>>()?;
        if blobs.is_empty() {
            return Ok(());
        }
        let objects = self.repo.path().join("objects");
        let pack_dir = objects.join("pack");
        fs::create_dir_all(&pack_dir)?;
        for (id, _) in &blobs {
            pack.insert_object(Oid::from_str(id)?, None)?;
        }
        let staged_objects = tempfile::tempdir_in(&objects)?;
        let staged_pack = staged_objects.path().join("pack");
        fs::create_dir(&staged_pack)?;
        pack.write(&staged_pack, 0)?;
        {
            // Keep the verification database isolated from the live loose objects.
            let packed = git2::Odb::new()?;
            packed.add_disk_alternate(
                staged_objects
                    .path()
                    .to_str()
                    .ok_or("보관소 경로를 확인해 주세요.")?,
            )?;
            for (id, hash) in &blobs {
                let object = packed.read(Oid::from_str(id)?)?;
                if files::digest(object.data()) != *hash {
                    return Err("압축된 보관소의 무결성을 확인하지 못했어요.".into());
                }
            }
        }
        let name = pack
            .name()?
            .ok_or("압축된 보관소의 이름을 확인하지 못했어요.")?;
        for extension in ["pack", "idx"] {
            let name = format!("pack-{name}.{extension}");
            let source = staged_pack.join(&name);
            #[cfg(windows)]
            make_writable(&source)?;
            fs::File::options().write(true).open(&source)?.sync_all()?;
            let target = pack_dir.join(name);
            fs::rename(&source, &target)?;
        }
        self.repo.odb()?.refresh()?;
        for (id, _) in &blobs {
            let loose = objects.join(&id[..2]).join(&id[2..]);
            if loose.is_file() {
                #[cfg(windows)]
                make_writable(&loose)?;
                fs::remove_file(loose)?;
            }
        }
        Ok(())
    }
}

#[cfg(windows)]
pub(super) fn make_writable(path: &Path) -> std::io::Result<()> {
    let mut permissions = fs::metadata(path)?.permissions();
    if permissions.readonly() {
        permissions.set_readonly(false);
        fs::set_permissions(path, permissions)?;
    }
    Ok(())
}
