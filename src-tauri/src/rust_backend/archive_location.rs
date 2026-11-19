use super::{files, record_deletion::archive_path, store::MIN_FREE_SPACE, Result, Store};
use git2::{Oid, Repository};
use rusqlite::params;
use serde_json::json;
use sha2::{Digest, Sha256};
use std::{
    fs::{self, File},
    io,
    path::{Path, PathBuf},
};
use tempfile::{Builder, TempDir};

pub(super) struct StagedArchive {
    repo: Repository,
    directory: TempDir,
}

fn inside(path: &Path, parent: &Path) -> bool {
    #[cfg(windows)]
    return PathBuf::from(path.to_string_lossy().to_lowercase())
        .starts_with(PathBuf::from(parent.to_string_lossy().to_lowercase()));
    #[cfg(not(windows))]
    return path.starts_with(parent);
}

pub(super) fn overlap(a: &Path, b: &Path) -> bool {
    inside(a, b) || inside(b, a)
}

fn hash_file(path: &Path) -> io::Result<[u8; 32]> {
    let mut hash = Sha256::new();
    io::copy(&mut File::open(path)?, &mut hash)?;
    Ok(hash.finalize().into())
}

fn copy_archive(source: &Path, destination: &Path) -> Result<()> {
    fs::create_dir(destination)?;
    let mut directories = vec![(source.to_owned(), destination.to_owned())];
    while let Some((source, destination)) = directories.pop() {
        for entry in fs::read_dir(source)? {
            let entry = entry?;
            let path = entry.path();
            let metadata = fs::symlink_metadata(&path)?;
            let target = destination.join(entry.file_name());
            if files::is_link(&metadata) {
                return Err("보관소 안에 연결 경로가 있어요.".into());
            }
            if metadata.is_dir() {
                fs::create_dir(&target)?;
                directories.push((path, target));
            } else if metadata.is_file() {
                let mut output = File::options().write(true).create_new(true).open(&target)?;
                io::copy(&mut File::open(&path)?, &mut output)?;
                if hash_file(&path)? != hash_file(&target)? {
                    return Err("옮긴 보관 파일의 무결성을 확인하지 못했어요.".into());
                }
                output.sync_all()?;
            } else {
                return Err("일반 파일로 구성된 버전 보관소만 옮길 수 있어요.".into());
            }
        }
    }
    Ok(())
}

impl Store {
    pub(super) fn archive_directory(&self) -> &Path {
        self.repo
            .path()
            .parent()
            .expect("bare repository directory")
    }

    pub(super) fn validate_archive_parent(&self, parent: &Path) -> Result<()> {
        if !parent.is_dir()
            || inside(parent, &self.data)
            || inside(parent, self.archive_directory())
            || self.roots()?.iter().any(|root| {
                root["path"]
                    .as_str()
                    .is_some_and(|path| inside(parent, Path::new(path)))
            })
        {
            return Err("관리 폴더나 현재 보관소 밖의 폴더를 선택해 주세요.".into());
        }
        Ok(())
    }

    fn validate_archive_destination(&self, directory: &Path) -> Result<()> {
        if overlap(directory, &self.data)
            || overlap(directory, self.archive_directory())
            || self.roots()?.iter().any(|root| {
                root["path"]
                    .as_str()
                    .is_some_and(|path| overlap(directory, Path::new(path)))
            })
        {
            return Err("관리 폴더와 보관소는 서로 겹칠 수 없어요.".into());
        }
        Ok(())
    }

    pub(super) fn stage_archive(&self, parent: &Path, identity: &str) -> Result<StagedArchive> {
        self.finish_archive_cleanup()?;
        self.validate_archive_parent(parent)?;
        if files::directory_identity(parent)? != identity {
            return Err("선택한 폴더가 바뀌었어요. 다시 선택해 주세요.".into());
        }
        if files::disk_space(parent)?.0
            < files::tree_size(self.repo.path())?.saturating_add(MIN_FREE_SPACE)
        {
            return Err("선택한 드라이브에 기존 보관본을 옮길 공간이 부족해요.".into());
        }
        let directory = Builder::new().prefix("Windowsill-").tempdir_in(parent)?;
        self.validate_archive_destination(directory.path())?;
        let current = self.get("archiveCurrent", json!("history.git"))?;
        let target = archive_path(directory.path(), super::text(&current)?)?;
        copy_archive(self.repo.path(), &target)?;
        if files::disk_space(directory.path())?.0 < MIN_FREE_SPACE {
            return Err("옮긴 뒤의 디스크 여유 공간이 부족해요.".into());
        }
        let repo = Repository::open_bare(target)?;
        let odb = repo.odb()?;
        let mut statement = self.db.prepare("SELECT DISTINCT blob FROM versions")?;
        for id in statement.query_map([], |row| row.get::<_, String>(0))? {
            if !odb.exists(Oid::from_str(&id?)?) {
                return Err("옮긴 보관소에서 기존 버전을 찾지 못했어요.".into());
            }
        }
        drop(odb);
        Ok(StagedArchive { repo, directory })
    }

    pub(super) fn activate_archive(&mut self, staged: StagedArchive) -> Result<()> {
        let directory = files::local(staged.directory.path())?;
        self.validate_archive_destination(&directory)?;
        let current = self.get("archiveCurrent", json!("history.git"))?;
        let retired = json!({"directory": self.archive_directory(), "name": current,
            "identity": files::directory_identity(self.repo.path())?});
        let tx = self.db.transaction()?;
        for (key, value) in [
            ("archiveDirectory", json!(directory)),
            ("archiveMoveFrom", retired),
        ] {
            tx.execute(
                "INSERT OR REPLACE INTO settings VALUES (?,?)",
                params![key, value.to_string()],
            )?;
        }
        tx.commit()?;
        let _ = staged.directory.keep();
        self.repo = staged.repo;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn archive_move_preserves_versions_and_reopens_after_restart() -> Result<()> {
        let fixture = tempfile::tempdir()?;
        let managed = fixture.path().join("managed");
        fs::create_dir(&managed)?;
        let destination = if let Some(parent) = std::env::var_os("WINDOWSILL_ARCHIVE_TEST_PARENT") {
            Builder::new()
                .prefix("archive-location-test-")
                .tempdir_in(parent)?
        } else {
            tempfile::tempdir()?
        };
        let data = fixture.path().join("data");
        let original = managed.join("memo.txt");
        fs::write(&original, b"first")?;
        let mut store = Store::open(data.clone())?;
        let root = store.register(&managed, None, None)?;
        store.scan(&root)?;
        let first: String = store
            .db
            .query_row("SELECT id FROM versions", [], |row| row.get(0))?;
        assert!(store
            .validate_archive_parent(&files::local(&managed)?)
            .is_err());
        let old_archive = store.repo.path().to_owned();
        let parent = files::local(destination.path())?;
        let identity = files::directory_identity(&parent)?;
        assert!(store.stage_archive(&parent, "wrong identity").is_err());
        assert!(fs::read_dir(&parent)?.next().is_none());

        let staged = store.stage_archive(&parent, &identity)?;
        assert_eq!(store.version(&first)?.3, b"first");
        assert!(old_archive.is_dir());
        store.activate_archive(staged)?;
        assert!(old_archive.is_dir());
        drop(store);

        let mut store = Store::open(data)?;
        assert!(store.archive_directory().starts_with(&parent));
        assert!(!old_archive.exists());
        assert_eq!(store.version(&first)?.3, b"first");
        assert_eq!(fs::read(&original)?, b"first");

        fs::write(&original, b"second version")?;
        store.scan(&root)?;
        let second: String =
            store
                .db
                .query_row("SELECT id FROM versions WHERE seq=2", [], |row| row.get(0))?;
        assert_eq!(store.version(&second)?.3, b"second version");
        store.compact()?;
        assert_eq!(store.version(&first)?.3, b"first");
        assert_eq!(store.version(&second)?.3, b"second version");

        let archive_directory = store.archive_directory().to_owned();
        store.delete_records("root", &root)?;
        assert_eq!(store.archive_directory(), archive_directory);
        assert_eq!(fs::read(&original)?, b"second version");
        Ok(())
    }
}
