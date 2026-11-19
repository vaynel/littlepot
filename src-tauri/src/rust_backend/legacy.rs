use super::{files, legacy_extras, Result, Store};
use git2::{Oid, Repository};
use rusqlite::{params, Connection, OpenFlags};
use serde_json::{json, Value};
use std::{
    fs::{self, File},
    io::{self, ErrorKind},
    path::{Path, PathBuf},
};

const SETTINGS: &[&str] = &[
    "customFont",
    "fontChoice",
    "guide",
    "language",
    "managedRootOrder",
    "onboarded",
    "reducedMotion",
    "searchPageSize",
    "theme",
    "uiLabels",
    "visiblePlants",
    "widgetBounds",
];

fn snapshot(path: &Path, destination: &Path) -> Result<Connection> {
    fn with_suffix(path: &Path, suffix: &str) -> PathBuf {
        let mut name = path.as_os_str().to_owned();
        name.push(suffix);
        name.into()
    }
    fn signature(path: &Path) -> Result<Option<String>> {
        match fs::symlink_metadata(path) {
            Ok(_) => Ok(Some(files::signature(path)?)),
            Err(error) if error.kind() == ErrorKind::NotFound => Ok(None),
            Err(error) => Err(error.into()),
        }
    }
    let path = files::local(path)?;
    let suffixes = ["", "-wal", "-journal"];
    let states = suffixes
        .iter()
        .map(|suffix| signature(&with_suffix(&path, suffix)))
        .collect::<Result<Vec<_>>>()?;
    for (suffix, state) in suffixes.iter().zip(&states) {
        if state.is_some() {
            let mut original = File::open(files::local(&with_suffix(&path, suffix))?)?;
            let mut copy = File::create(with_suffix(destination, suffix))?;
            io::copy(&mut original, &mut copy)?;
        }
    }
    for (suffix, state) in suffixes.iter().zip(states) {
        if signature(&with_suffix(&path, suffix))? != state {
            return Err(
                "기존 데이터가 읽는 동안 바뀌었어요. 기존 앱을 종료한 뒤 다시 실행해 주세요."
                    .into(),
            );
        }
    }
    // SQLite may rebuild the WAL index or recover a journal in this private copy.
    let db = Connection::open_with_flags(destination, OpenFlags::SQLITE_OPEN_READ_WRITE)?;
    db.execute_batch("PRAGMA query_only=ON; PRAGMA trusted_schema=OFF; BEGIN DEFERRED")?;
    Ok(db)
}

pub(super) fn each(
    db: &Connection,
    sql: &str,
    mut visit: impl FnMut(&rusqlite::Row<'_>) -> Result,
) -> Result {
    let mut statement = db.prepare(sql)?;
    let mut rows = statement.query([])?;
    while let Some(row) = rows.next()? {
        visit(row)?;
    }
    Ok(())
}

impl Store {
    pub fn import_legacy(&mut self, source: &Path) -> Result {
        let source = files::local(source)?;
        if source.starts_with(&self.data) || self.data.starts_with(&source) {
            return Err("Node.js판과 Rust판의 데이터 폴더를 따로 선택해 주세요.".into());
        }
        let already_imported = self.get("legacyImported", Value::Null)? == json!(source);
        if already_imported && self.get("legacyExtrasImported", Value::Null)? == true {
            return Ok(());
        }
        if !already_imported {
            let busy: bool = self.db.query_row(
                "SELECT EXISTS(SELECT 1 FROM roots UNION ALL SELECT 1 FROM versions
                 UNION ALL SELECT 1 FROM ops UNION ALL SELECT 1 FROM settings
                 UNION ALL SELECT 1 FROM installed_themes)",
                [],
                |r| r.get(0),
            )?;
            if busy {
                return Err(
                    "기존 기록을 가져오려면 비어 있는 Rust판 데이터 폴더가 필요해요.".into(),
                );
            }
        }
        let scratch = tempfile::tempdir()?;
        let core = snapshot(
            &source.join("garden.sqlite"),
            &scratch.path().join("garden.sqlite"),
        )?;
        let version_dir = source.join("version-store");
        let index = snapshot(
            &version_dir.join("versions.sqlite"),
            &scratch.path().join("versions.sqlite"),
        )?;
        if already_imported {
            let tx = self.db.transaction()?;
            legacy_extras::import(&tx, &core, &index, &source)?;
            tx.commit()?;
            return Ok(());
        }
        let source_repo = Repository::open_bare(files::local(&version_dir.join("history.git"))?)?;
        let tx = self.db.transaction()?;
        each(
            &core,
            "SELECT id,name,folder FROM plants WHERE id BETWEEN 0 AND 2",
            |row| {
                tx.execute(
                    "UPDATE plants SET name=?,folder=? WHERE id=?",
                    params![
                        row.get::<_, String>(1)?,
                        row.get::<_, Option<String>>(2)?,
                        row.get::<_, i64>(0)?,
                    ],
                )?;
                Ok(())
            },
        )?;
        each(&core, "SELECT day FROM visits", |row| {
            tx.execute(
                "INSERT OR IGNORE INTO visits VALUES (?)",
                [row.get::<_, String>(0)?],
            )?;
            Ok(())
        })?;
        each(&core, "SELECT key,value FROM settings", |row| {
            let key: String = row.get(0)?;
            if !SETTINGS.contains(&key.as_str()) {
                return Ok(());
            }
            let text: String = row.get(1)?;
            let value: Value = serde_json::from_str(&text)?;
            if key == "customFont" && !value.is_null() {
                let id = value["id"]
                    .as_str()
                    .filter(|id| {
                        id.len() == 64
                            && id
                                .bytes()
                                .all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b))
                    })
                    .ok_or("기존 폰트 기록을 확인해 주세요.")?;
                let rel = Path::new("fonts").join(format!("{id}.font"));
                let bytes = super::fonts::font_bytes(&source.join(&rel))?;
                if files::digest(&bytes) != id {
                    return Err("기존 폰트 파일의 무결성을 확인하지 못했어요.".into());
                }
                let path = self.data.join(rel);
                fs::create_dir_all(self.data.join("fonts"))?;
                if path.exists() {
                    if files::digest(&super::fonts::font_bytes(&path)?) != id {
                        return Err("Rust판 데이터 폴더의 폰트 파일을 확인해 주세요.".into());
                    }
                } else {
                    files::publish(&path, &bytes)?;
                }
            }
            tx.execute("INSERT INTO settings VALUES (?,?)", params![key, text])?;
            Ok(())
        })?;
        each(&index, "SELECT id,plant,path FROM roots", |row| {
            tx.execute(
                "INSERT INTO roots(id,plant,path,active) VALUES (?,?,?,0)",
                params![
                    row.get::<_, String>(0)?,
                    row.get::<_, Option<i64>>(1)?,
                    row.get::<_, String>(2)?,
                ],
            )?;
            Ok(())
        })?;
        each(
            &index,
            "SELECT f.id,f.root,f.path,COALESCE(f.hash,''),f.status,COALESCE(s.bytes,0),
              COALESCE(f.observed,0) FROM files f LEFT JOIN file_sizes s ON s.file=f.id",
            |row| {
                tx.execute(
                    "INSERT INTO files VALUES (?,?,?,?,?,?,?)",
                    params![
                        row.get::<_, String>(0)?,
                        row.get::<_, String>(1)?,
                        row.get::<_, String>(2)?,
                        row.get::<_, String>(3)?,
                        row.get::<_, String>(4)?,
                        row.get::<_, i64>(5)?,
                        row.get::<_, i64>(6)?,
                    ],
                )?;
                Ok(())
            },
        )?;
        each(
            &index,
            "SELECT id,file,seq,hash,blob,created,kind FROM versions",
            |row| {
                let id: String = row.get(0)?;
                let hash: String = row.get(3)?;
                let oid = Oid::from_str(&row.get::<_, String>(4)?)?;
                let previous = source_repo.find_blob(oid)?;
                if previous.content().len() as u64 > files::LIMIT
                    || files::digest(previous.content()) != hash
                {
                    return Err("기존 버전 파일의 무결성을 확인하지 못했어요.".into());
                }
                let saved = self.repo.blob(previous.content())?;
                if saved != oid {
                    return Err("버전 보관소의 객체 형식이 달라요.".into());
                }
                let reference = format!("refs/windowsill/legacy/{}", files::digest(id.as_bytes()));
                self.repo
                    .reference(&reference, saved, true, "Import verified legacy blob")?;
                tx.execute(
                    "INSERT INTO versions VALUES (?,?,?,?,?,?,?)",
                    params![
                        id,
                        row.get::<_, String>(1)?,
                        row.get::<_, i64>(2)?,
                        hash,
                        saved.to_string(),
                        row.get::<_, i64>(5)?,
                        row.get::<_, String>(6)?,
                    ],
                )?;
                Ok(())
            },
        )?;
        each(
            &index,
            "SELECT id,file,kind,path,old_path,status,created,metadata FROM events
              WHERE status='committed'",
            |row| {
                tx.execute(
                    "INSERT INTO events
              SELECT ?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM files WHERE id=?2)",
                    params![
                        row.get::<_, String>(0)?,
                        row.get::<_, String>(1)?,
                        row.get::<_, String>(2)?,
                        row.get::<_, String>(3)?,
                        row.get::<_, Option<String>>(4)?,
                        row.get::<_, String>(5)?,
                        row.get::<_, i64>(6)?,
                        row.get::<_, Option<String>>(7)?,
                    ],
                )?;
                Ok(())
            },
        )?;
        each(&index, "SELECT id,root,start,end,reason FROM gaps", |row| {
            tx.execute(
                "INSERT INTO gaps VALUES (?,?,?,?,?)",
                params![
                    row.get::<_, String>(0)?,
                    row.get::<_, String>(1)?,
                    row.get::<_, i64>(2)?,
                    row.get::<_, Option<i64>>(3)?,
                    row.get::<_, String>(4)?,
                ],
            )?;
            Ok(())
        })?;
        each(
            &index,
            "SELECT file,state,updated FROM file_controls
              WHERE EXISTS(SELECT 1 FROM files WHERE id=file_controls.file)",
            |row| {
                tx.execute(
                    "INSERT INTO file_controls VALUES (?,?,?)",
                    params![
                        row.get::<_, String>(0)?,
                        row.get::<_, String>(1)?,
                        row.get::<_, i64>(2)?,
                    ],
                )?;
                Ok(())
            },
        )?;
        let budget: Option<String> = index
            .query_row(
                "SELECT value FROM meta WHERE key='storage-budget'",
                [],
                |r| r.get(0),
            )
            .ok();
        if let Some(gib) = budget
            .and_then(|s| s.parse::<u64>().ok())
            .and_then(|bytes| {
                [1, 2, 5, 10, 20, 50]
                    .into_iter()
                    .find(|gib| bytes == gib * super::GIB)
            })
        {
            tx.execute(
                "INSERT INTO settings VALUES ('storageBudget',?)",
                [gib.to_string()],
            )?;
        }
        legacy_extras::import(&tx, &core, &index, &source)?;
        tx.execute(
            "INSERT INTO settings VALUES ('legacyImported',?)",
            [json!(source).to_string()],
        )?;
        tx.commit()?;
        Ok(())
    }
}
