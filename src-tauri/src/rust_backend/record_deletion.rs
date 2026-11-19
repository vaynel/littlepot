use super::{files, now, text, Result, Store};
use git2::{Oid, Repository, RepositoryInitOptions};
use rusqlite::params;
use serde_json::{json, Value};
use std::{
    collections::HashSet,
    fs, io,
    path::{Path, PathBuf},
};
use uuid::Uuid;

pub(super) fn archive_path(directory: &Path, name: &str) -> Result<PathBuf> {
    if name != "history.git"
        && name
            .strip_prefix("history-")
            .and_then(|name| name.strip_suffix(".git"))
            .and_then(|id| Uuid::parse_str(id).ok())
            .is_none()
    {
        return Err("보관소 경로를 확인해 주세요.".into());
    }
    Ok(directory.join(name))
}

fn remove_archive(root: PathBuf) -> Result {
    match fs::symlink_metadata(&root) {
        Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(()),
        Err(error) => return Err(error.into()),
        Ok(_) => {}
    }
    if files::local(&root)? != root {
        return Err("보관소 경로가 바뀌었어요.".into());
    }
    let mut directories = vec![root];
    let mut cursor = 0;
    while cursor < directories.len() {
        for entry in fs::read_dir(&directories[cursor])? {
            let entry = entry?;
            let entry_path = files::local(&entry.path())?;
            let metadata = fs::symlink_metadata(&entry_path)?;
            if metadata.is_dir() {
                directories.push(entry_path);
            } else if metadata.is_file() {
                #[cfg(windows)]
                super::store::make_writable(&entry_path)?;
                fs::remove_file(&entry_path)?;
            }
        }
        cursor += 1;
    }
    for directory in directories.iter().rev() {
        fs::remove_dir(directory)?;
    }
    Ok(())
}

fn normalized(path: &str) -> PathBuf {
    if cfg!(windows) {
        PathBuf::from(path.to_lowercase())
    } else {
        PathBuf::from(path)
    }
}

impl Store {
    pub fn finish_archive_cleanup(&self) -> Result {
        let current = self.get("archiveCurrent", json!("history.git"))?;
        let moved_from = self.get("archiveMoveFrom", Value::Null)?;
        if !moved_from.is_null() {
            let retired = archive_path(
                Path::new(text(&moved_from["directory"])?),
                text(&moved_from["name"])?,
            )?;
            if retired.parent() == Some(self.archive_directory()) {
                return Err("현재 버전 보관소 상태를 확인해 주세요.".into());
            }
            match files::directory_identity(&retired) {
                Ok(identity) if identity == moved_from["identity"].as_str().unwrap_or_default() => {
                    remove_archive(retired)?
                }
                Err(error)
                    if error.kind() == io::ErrorKind::NotFound
                        && retired.parent().is_some_and(Path::is_dir) => {}
                _ => {
                    return Err(
                        "이전 보관소 경로가 바뀌었어요. 남겨 둔 보관소를 확인해 주세요.".into(),
                    )
                }
            }
            self.db
                .execute("DELETE FROM settings WHERE key='archiveMoveFrom'", [])?;
        }
        for key in ["archiveRetired", "archivePending"] {
            let obsolete = self.get(key, Value::Null)?;
            if obsolete.is_null() {
                continue;
            }
            if obsolete == current {
                return Err("현재 버전 보관소 상태를 확인해 주세요.".into());
            }
            remove_archive(archive_path(self.archive_directory(), text(&obsolete)?)?)?;
            self.db.execute("DELETE FROM settings WHERE key=?", [key])?;
        }
        let job = self.get("recordJob", Value::Null)?;
        if job["cleanupPending"] == true {
            self.set("recordJob", &json!({"phase":"done","cleanupPending":false}))?;
        }
        Ok(())
    }

    pub(super) fn delete_records(&mut self, kind: &str, id: &str) -> Result {
        self.finish_archive_cleanup()?;
        let (root, target): (String, String) = match kind {
            "root" => self
                .db
                .query_row("SELECT id,path FROM roots WHERE id=?", [id], |r| {
                    Ok((r.get(0)?, r.get(1)?))
                })?,
            "file" => self.db.query_row(
                "SELECT root,path FROM files WHERE id=? AND status!='forgotten'",
                [id],
                |r| Ok((r.get(0)?, r.get(1)?)),
            )?,
            _ => return Err("삭제할 관리 기록을 다시 선택해 주세요.".into()),
        };
        let target_path = normalized(&target);
        let affected = |path: &str| {
            let path = normalized(path);
            if kind == "file" {
                path == target_path
            } else {
                path.starts_with(&target_path)
            }
        };
        let files = self.rows(
            "SELECT json_object('id',id,'path',path) FROM files WHERE root=?",
            [&root],
        )?;
        let ids: HashSet<String> = files
            .iter()
            .filter_map(|file| {
                if kind != "root" && !affected(file["path"].as_str()?) {
                    return None;
                }
                Some(file["id"].as_str()?.to_owned())
            })
            .collect();
        let versions = self.rows(
            "SELECT json_object('id',id,'file',file,'hash',hash,'blob',blob) FROM versions",
            [],
        )?;
        let ops = self.rows(
            "SELECT json_object('id',id,'source',source,'destination',destination) FROM ops",
            [],
        )?;
        let operations: Vec<&str> = ops
            .iter()
            .filter_map(|op| {
                if !["source", "destination"]
                    .iter()
                    .any(|key| op[key].as_str().is_some_and(affected))
                {
                    return None;
                }
                op["id"].as_str()
            })
            .collect();
        let name = format!("history-{}.git", Uuid::new_v4());
        let retired = self.get("archiveCurrent", json!("history.git"))?;
        self.set("archivePending", &json!(name))?;
        let repo = Repository::init_opts(
            &archive_path(self.archive_directory(), &name)?,
            RepositoryInitOptions::new()
                .bare(true)
                .external_template(false),
        )?;
        for version in &versions {
            if ids.contains(text(&version["file"])?) {
                continue;
            }
            let oid = Oid::from_str(text(&version["blob"])?)?;
            let existing = self.repo.find_blob(oid)?;
            if files::digest(existing.content()) != version["hash"].as_str().unwrap_or_default()
                || repo.blob(existing.content())? != oid
            {
                return Err("남길 버전의 무결성을 확인하지 못했어요.".into());
            }
            let name = format!(
                "refs/windowsill/{}",
                files::digest(text(&version["id"])?.as_bytes())
            );
            repo.reference(&name, oid, false, "Retain archived version")?;
        }
        self.db.execute_batch("PRAGMA secure_delete=ON")?;
        let tx = self.db.transaction()?;
        for operation in &operations {
            tx.execute("DELETE FROM task_items WHERE operation=?", [operation])?;
            tx.execute("DELETE FROM aftercare WHERE operation=?", [operation])?;
            tx.execute("DELETE FROM op_journal WHERE id=?", [operation])?;
            tx.execute(
                "UPDATE organize_items SET operation=NULL WHERE operation=?",
                [operation],
            )?;
            tx.execute("DELETE FROM learned_ops WHERE op=?", [operation])?;
            tx.execute("DELETE FROM ops WHERE id=?", [operation])?;
        }
        for file in &ids {
            for table in [
                "versions",
                "events",
                "file_controls",
                "file_opens",
                "name_exceptions",
                "file_identities",
            ] {
                tx.execute(&format!("DELETE FROM {table} WHERE file=?"), [file])?;
            }
            if kind == "file" && file == id {
                tx.execute(
                    "UPDATE files SET hash='',bytes=0,status='forgotten',observed=? WHERE id=?",
                    params![now(), file],
                )?;
                tx.execute(
                    "INSERT INTO file_controls VALUES (?,'off',?)",
                    params![file, now()],
                )?;
            } else {
                tx.execute("DELETE FROM files WHERE id=?", [file])?;
            }
        }
        if kind == "root" {
            tx.execute("DELETE FROM aftercare WHERE root=?", [&root])?;
            tx.execute("DELETE FROM organize_items WHERE job IN (SELECT id FROM organize_jobs WHERE root=?)", [&root])?;
            tx.execute("DELETE FROM organize_folders WHERE job IN (SELECT id FROM organize_jobs WHERE root=?)", [&root])?;
            for table in [
                "gaps",
                "scan_issues",
                "scan_folders",
                "routing_rules",
                "name_rules",
                "preferences",
                "learned_ops",
                "organize_jobs",
                "organize_policies",
            ] {
                tx.execute(&format!("DELETE FROM {table} WHERE root=?"), [&root])?;
            }
            tx.execute(
                "UPDATE plants SET folder=NULL WHERE id=(SELECT plant FROM roots WHERE id=?)",
                [&root],
            )?;
            tx.execute("DELETE FROM roots WHERE id=?", [&root])?;
        } else {
            tx.execute(
                "DELETE FROM organize_items WHERE source=? OR operation IN
               (SELECT id FROM ops WHERE source=? OR destination=?)",
                params![target, target, target],
            )?;
            tx.execute(
                "DELETE FROM scan_issues WHERE root=? AND path=?",
                params![root, target],
            )?;
        }
        tx.execute(
            "INSERT OR REPLACE INTO settings VALUES ('archiveCurrent',?)",
            [json!(name).to_string()],
        )?;
        tx.execute(
            "INSERT OR REPLACE INTO settings VALUES ('archiveRetired',?)",
            [retired.to_string()],
        )?;
        tx.execute(
            "INSERT OR REPLACE INTO settings VALUES ('recordJob',?)",
            [json!({"phase":"done","cleanupPending":true}).to_string()],
        )?;
        tx.execute("DELETE FROM settings WHERE key='archivePending'", [])?;
        tx.commit()?;
        self.repo = repo;
        let _ = self.db.execute_batch("PRAGMA wal_checkpoint(TRUNCATE)");
        self.finish_archive_cleanup()
    }
}
