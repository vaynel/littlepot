use sha2::{Digest, Sha256};
use std::{
    fs::{self, File, Metadata},
    io::{self, Read, Write},
    path::{Component, Path, PathBuf},
};
use uuid::Uuid;

pub const LIMIT: u64 = 100 * 1024 * 1024;

#[cfg(windows)]
pub(super) fn is_link(metadata: &Metadata) -> bool {
    use std::os::windows::fs::MetadataExt;
    metadata.file_attributes() & (0x400 | 0x1000 | 0x40000 | 0x400000) != 0
}

#[cfg(not(windows))]
pub(super) fn is_link(metadata: &Metadata) -> bool {
    metadata.file_type().is_symlink()
}

pub fn local(path: &Path) -> io::Result<PathBuf> {
    if !path.is_absolute() || path.components().any(|c| matches!(c, Component::ParentDir)) {
        return Err(io::Error::other("절대 로컬 경로를 선택해 주세요."));
    }
    #[cfg(windows)]
    {
        use std::path::Prefix;
        if !matches!(path.components().next(), Some(Component::Prefix(prefix)) if matches!(prefix.kind(), Prefix::Disk(_)))
            || path
                .components()
                .any(|c| matches!(c, Component::Normal(s) if s.to_string_lossy().contains(':')))
        {
            return Err(io::Error::other(
                "로컬 드라이브의 일반 경로를 선택해 주세요.",
            ));
        }
    }
    for ancestor in path.ancestors().filter(|p| p.has_root()) {
        if is_link(&fs::symlink_metadata(ancestor)?) {
            return Err(io::Error::other(
                "연결되거나 오프라인인 경로는 사용할 수 없어요.",
            ));
        }
    }
    dunce::canonicalize(path)
}

pub fn destination(path: &Path) -> io::Result<PathBuf> {
    let name = path
        .file_name()
        .ok_or_else(|| io::Error::other("파일 이름을 확인해 주세요."))?;
    let parent = path
        .parent()
        .ok_or_else(|| io::Error::other("저장 폴더를 확인해 주세요."))?;
    if name.to_string_lossy().starts_with('.') || name.to_string_lossy().contains(':') {
        return Err(io::Error::other("일반 파일 이름을 선택해 주세요."));
    }
    Ok(local(parent)?.join(name))
}

pub struct Tree {
    pub files: Vec<PathBuf>,
    pub folders: Vec<PathBuf>,
    pub issues: Vec<(PathBuf, &'static str)>,
    pub complete: bool,
}

pub fn tree(path: &Path) -> io::Result<Tree> {
    let path = local(path)?;
    let mut folders = vec![path];
    let mut tree = Tree {
        files: Vec::new(),
        folders: Vec::new(),
        issues: Vec::new(),
        complete: true,
    };
    while let Some(folder) = folders.pop() {
        tree.folders.push(folder.clone());
        let entries = match fs::read_dir(&folder) {
            Ok(entries) => entries,
            Err(_) => {
                tree.issues.push((folder, "폴더에 접근할 수 없어요."));
                tree.complete = false;
                continue;
            }
        };
        for entry in entries {
            let Ok(entry) = entry else {
                tree.complete = false;
                continue;
            };
            let name = entry.file_name().to_string_lossy().to_lowercase();
            let path = entry.path();
            if name.starts_with('.')
                || name == "node_modules"
                || name.ends_with("-wal")
                || name.ends_with("-shm")
                || name.ends_with(".sqlite")
                || name.ends_with(".db")
            {
                tree.issues.push((path, "기본 제외 항목이에요."));
                continue;
            }
            let Ok(metadata) = fs::symlink_metadata(&path) else {
                tree.issues.push((path, "항목에 접근할 수 없어요."));
                tree.complete = false;
                continue;
            };
            if is_link(&metadata) {
                tree.issues.push((path, "연결 경로나 오프라인 항목이에요."));
                continue;
            }
            if metadata.is_dir() {
                folders.push(path);
            } else if metadata.is_file() && metadata.len() <= LIMIT {
                tree.files.push(path);
            } else {
                tree.issues
                    .push((path, "100 MiB 이하의 일반 파일만 보관할 수 있어요."));
            }
        }
    }
    tree.files.sort();
    tree.folders.sort();
    tree.issues.sort_by(|a, b| a.0.cmp(&b.0));
    Ok(tree)
}

pub fn read(path: &Path) -> io::Result<Vec<u8>> {
    read_open(&File::open(local(path)?)?)
}

pub fn read_with_identity(path: &Path) -> io::Result<(String, Vec<u8>)> {
    let file = File::open(local(path)?)?;
    Ok((identity(&file)?, read_open(&file)?))
}

pub fn directory_identity(path: &Path) -> io::Result<String> {
    let path = local(path)?;
    let mut config = File::options();
    config.read(true);
    #[cfg(windows)]
    {
        use std::os::windows::fs::OpenOptionsExt;
        use windows_sys::Win32::Storage::FileSystem::FILE_FLAG_BACKUP_SEMANTICS;
        config.custom_flags(FILE_FLAG_BACKUP_SEMANTICS);
    }
    let folder = config.open(path)?;
    if !folder.metadata()?.is_dir() {
        return Err(io::Error::other("폴더를 확인해 주세요."));
    }
    observation_identity(&folder)
}

pub fn signature(path: &Path) -> io::Result<String> {
    Ok(ObservedFile::open(path)?.signature)
}

pub struct ObservedFile {
    file: File,
    pub key: String,
    pub signature: String,
}

impl ObservedFile {
    pub fn open(path: &Path) -> io::Result<Self> {
        let file = File::open(local(path)?)?;
        let key = observation_identity(&file)?;
        let signature = signature_from(&file, &key)?;
        Ok(Self {
            file,
            key,
            signature,
        })
    }

    pub fn bytes(&self) -> io::Result<Vec<u8>> {
        if signature_from(&self.file, &self.key)? != self.signature {
            return Err(io::Error::other("읽기 전에 파일이 바뀌었어요."));
        }
        read_open(&self.file)
    }
}

fn signature_from(file: &File, key: &str) -> io::Result<String> {
    let metadata = file.metadata()?;
    Ok(format!(
        "{key}:{}:{:?}",
        metadata.len(),
        metadata.modified()?
    ))
}

fn read_open(file: &File) -> io::Result<Vec<u8>> {
    let before = file.metadata()?;
    if !before.is_file() || before.len() > LIMIT {
        return Err(io::Error::other(
            "100 MiB 이하의 일반 파일을 선택해 주세요.",
        ));
    }
    let mut bytes = Vec::with_capacity(before.len() as usize);
    file.take(LIMIT + 1).read_to_end(&mut bytes)?;
    let after = file.metadata()?;
    if after.len() != bytes.len() as u64
        || after.len() != before.len()
        || after.modified()? != before.modified()?
    {
        return Err(io::Error::other("읽는 동안 파일 내용이 바뀌었어요."));
    }
    Ok(bytes)
}

#[cfg(windows)]
fn identity(file: &File) -> io::Result<String> {
    use std::{
        mem::{size_of, MaybeUninit},
        os::windows::{fs::MetadataExt, io::AsRawHandle},
    };
    use windows_sys::Win32::Storage::FileSystem::{
        FileIdInfo, GetFileInformationByHandleEx, FILE_ID_INFO,
    };
    let mut info = MaybeUninit::<FILE_ID_INFO>::uninit();
    // The handle remains open for this call. Win32 initializes info only on success.
    if unsafe {
        GetFileInformationByHandleEx(
            file.as_raw_handle(),
            FileIdInfo,
            info.as_mut_ptr().cast(),
            size_of::<FILE_ID_INFO>() as u32,
        )
    } == 0
    {
        return Err(io::Error::last_os_error());
    }
    let info = unsafe { info.assume_init() };
    Ok(format!(
        "{}:{}:{}",
        info.VolumeSerialNumber,
        digest(&info.FileId.Identifier),
        file.metadata()?.creation_time()
    ))
}

#[cfg(windows)]
fn observation_identity(file: &File) -> io::Result<String> {
    use std::{mem::MaybeUninit, os::windows::io::AsRawHandle};
    use windows_sys::Win32::{
        Foundation::{ERROR_INVALID_FUNCTION, ERROR_INVALID_PARAMETER, ERROR_NOT_SUPPORTED},
        Storage::FileSystem::{GetFileInformationByHandle, BY_HANDLE_FILE_INFORMATION},
    };
    match identity(file) {
        Ok(key) => return Ok(key),
        Err(error)
            if error.raw_os_error().is_some_and(|code| {
                matches!(
                    code as u32,
                    ERROR_INVALID_FUNCTION | ERROR_INVALID_PARAMETER | ERROR_NOT_SUPPORTED
                )
            }) => {}
        Err(error) => return Err(error),
    }
    let mut info = MaybeUninit::<BY_HANDLE_FILE_INFORMATION>::uninit();
    // This fallback is for scans. FAT-family file indexes can change after a rename.
    if unsafe { GetFileInformationByHandle(file.as_raw_handle(), info.as_mut_ptr()) } == 0 {
        return Err(io::Error::last_os_error());
    }
    let info = unsafe { info.assume_init() };
    Ok(format!(
        "file-index:{}:{}:{}:{}:{}",
        info.dwVolumeSerialNumber,
        info.nFileIndexHigh,
        info.nFileIndexLow,
        info.ftCreationTime.dwHighDateTime,
        info.ftCreationTime.dwLowDateTime,
    ))
}

#[cfg(unix)]
fn observation_identity(file: &File) -> io::Result<String> {
    identity(file)
}

#[cfg(unix)]
fn identity(file: &File) -> io::Result<String> {
    use std::{os::unix::fs::MetadataExt, time::UNIX_EPOCH};
    let metadata = file.metadata()?;
    let birth = metadata
        .created()
        .ok()
        .and_then(|time| time.duration_since(UNIX_EPOCH).ok());
    Ok(format!("{}:{}:{birth:?}", metadata.dev(), metadata.ino()))
}

pub fn digest(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}

pub fn tree_size(path: &Path) -> io::Result<u64> {
    let mut pending = vec![path.to_owned()];
    let mut bytes = 0_u64;
    while let Some(path) = pending.pop() {
        let info = fs::symlink_metadata(&path)?;
        if is_link(&info) {
            continue;
        }
        if info.is_dir() {
            for entry in fs::read_dir(&path)? {
                pending.push(entry?.path());
            }
        } else if info.is_file() {
            bytes = bytes.saturating_add(info.len());
        }
    }
    Ok(bytes)
}

#[cfg(windows)]
pub fn disk_space(path: &Path) -> io::Result<(u64, u64)> {
    use std::os::windows::ffi::OsStrExt;
    use windows_sys::Win32::Storage::FileSystem::GetDiskFreeSpaceExW;
    let path: Vec<u16> = path.as_os_str().encode_wide().chain(Some(0)).collect();
    let (mut free, mut total) = (0, 0);
    if unsafe { GetDiskFreeSpaceExW(path.as_ptr(), &mut free, &mut total, std::ptr::null_mut()) }
        == 0
    {
        return Err(io::Error::last_os_error());
    }
    Ok((free, total))
}

#[cfg(unix)]
pub fn disk_space(path: &Path) -> io::Result<(u64, u64)> {
    use std::{ffi::CString, mem::MaybeUninit, os::unix::ffi::OsStrExt};
    let path = CString::new(path.as_os_str().as_bytes())?;
    let mut output = MaybeUninit::<libc::statvfs>::uninit();
    if unsafe { libc::statvfs(path.as_ptr(), output.as_mut_ptr()) } != 0 {
        return Err(io::Error::last_os_error());
    }
    let output = unsafe { output.assume_init() };
    let unit = output.f_frsize as u64;
    Ok((
        (output.f_bavail as u64).saturating_mul(unit),
        (output.f_blocks as u64).saturating_mul(unit),
    ))
}

pub fn publish(path: &Path, bytes: &[u8]) -> io::Result<()> {
    let path = destination(path)?;
    let temp = stage(&path, bytes)?;
    let result = move_new(&temp, &path);
    if result.is_err() {
        let _ = fs::remove_file(temp);
    }
    result
}

pub fn stage(path: &Path, bytes: &[u8]) -> io::Result<PathBuf> {
    let temp = path.with_file_name(format!(".windowsill-{}.tmp", Uuid::new_v4()));
    let mut file = File::options().write(true).create_new(true).open(&temp)?;
    let result = file.write_all(bytes).and_then(|()| file.sync_all());
    drop(file);
    if result.is_err() {
        let _ = fs::remove_file(&temp);
    }
    result.map(|()| temp)
}

#[cfg(windows)]
pub fn move_new(from: &Path, to: &Path) -> io::Result<()> {
    use std::os::windows::ffi::OsStrExt;
    #[link(name = "kernel32")]
    extern "system" {
        fn MoveFileExW(from: *const u16, to: *const u16, flags: u32) -> i32;
    }
    let wide = |path: &Path| {
        path.as_os_str()
            .encode_wide()
            .chain(Some(0))
            .collect::<Vec<_>>()
    };
    let (from, to) = (wide(from), wide(to));
    // No REPLACE_EXISTING or COPY_ALLOWED. This call stays on one volume and never replaces a file.
    if unsafe { MoveFileExW(from.as_ptr(), to.as_ptr(), 0) } != 0 {
        Ok(())
    } else {
        Err(io::Error::last_os_error())
    }
}

#[cfg(target_os = "macos")]
pub fn move_new(from: &Path, to: &Path) -> io::Result<()> {
    use std::{ffi::CString, os::unix::ffi::OsStrExt};
    let from = CString::new(from.as_os_str().as_bytes())?;
    let to = CString::new(to.as_os_str().as_bytes())?;
    if unsafe { libc::renamex_np(from.as_ptr(), to.as_ptr(), libc::RENAME_EXCL) } == 0 {
        Ok(())
    } else {
        Err(io::Error::last_os_error())
    }
}

#[cfg(not(any(windows, target_os = "macos")))]
pub fn move_new(from: &Path, to: &Path) -> io::Result<()> {
    fs::hard_link(from, to)?;
    fs::remove_file(from)
}
