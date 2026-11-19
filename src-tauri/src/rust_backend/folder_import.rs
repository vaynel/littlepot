use super::{files, Result};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    collections::{HashMap, HashSet},
    fs, io,
    path::{Component, Path, PathBuf},
};

pub(super) const IMPORT_LIMIT: usize = 200;

#[derive(Clone, Default, Serialize)]
pub(super) struct Inventory {
    pub files: Vec<PathBuf>,
    pub relative: HashMap<PathBuf, PathBuf>,
    pub folders: usize,
    pub empty: usize,
    pub excluded: usize,
    pub issues: Vec<Value>,
}

fn normalized_name(path: &Path) -> Result<PathBuf> {
    if !path.components().all(
        |part| matches!(part, Component::Normal(value) if valid_part(&value.to_string_lossy())),
    ) {
        return Err("일반 파일이나 하위 폴더 이름을 선택해 주세요.".into());
    }
    Ok(path.to_owned())
}

pub(super) fn valid_part(value: &str) -> bool {
    let lower = value.to_ascii_lowercase();
    let first = lower.split('.').next().unwrap_or_default();
    !value.is_empty()
        && !value.starts_with('.')
        && !value.ends_with(['.', ' '])
        && !value
            .chars()
            .any(|c| c.is_control() || "<>:\"|?*".contains(c))
        && !matches!(
            first,
            "con"
                | "prn"
                | "aux"
                | "nul"
                | "com1"
                | "com2"
                | "com3"
                | "com4"
                | "com5"
                | "com6"
                | "com7"
                | "com8"
                | "com9"
                | "lpt1"
                | "lpt2"
                | "lpt3"
                | "lpt4"
                | "lpt5"
                | "lpt6"
                | "lpt7"
                | "lpt8"
                | "lpt9"
        )
}

impl Inventory {
    fn issue(&mut self, path: &Path, reason: &str) {
        self.excluded += 1;
        if self.issues.len() < 30 {
            self.issues.push(json!({"path":path,"reason":reason}));
        }
    }

    pub fn collect(mut inputs: Vec<PathBuf>, root: &Path) -> Result<Self> {
        if !(1..=20).contains(&inputs.len()) {
            return Err("한 번에 파일·폴더 1~20개를 넣어 주세요.".into());
        }
        inputs.sort_by_key(|path| path.components().count());
        let mut result = Self::default();
        let mut seen = HashSet::new();
        let mut visited = 0;
        for input in inputs {
            let name = input.file_name().ok_or("파일이나 폴더를 선택해 주세요.")?;
            let mut stack = vec![(input.clone(), PathBuf::from(name), 0)];
            while let Some((path, relative, depth)) = stack.pop() {
                visited += 1;
                if visited > 10_000 {
                    return Err("탐색 항목이 너무 많아요. 더 작은 폴더로 나누어 주세요.".into());
                }
                if depth > 32
                    || normalized_name(&relative).is_err()
                    || relative
                        .file_name()
                        .is_some_and(|name| name.eq_ignore_ascii_case("node_modules"))
                {
                    result.issue(
                        &relative,
                        "기본 제외 항목이거나 일반 파일 이름을 확인할 수 없어요.",
                    );
                    continue;
                }
                let Ok(path) = files::local(&path) else {
                    result.issue(&relative, "연결되었거나 접근할 수 없는 경로예요.");
                    continue;
                };
                if !seen.insert(path.clone()) {
                    continue;
                }
                let Ok(metadata) = fs::metadata(&path) else {
                    result.issue(&relative, "항목에 접근할 수 없어요.");
                    continue;
                };
                if metadata.is_dir() {
                    if root.starts_with(&path) {
                        return Err("정리할 폴더 안에 목적지 관리 폴더가 있어요.".into());
                    }
                    if depth == 0 {
                        result.folders += 1;
                    }
                    let Ok(entries) = fs::read_dir(&path) else {
                        result.issue(&relative, "폴더에 접근할 수 없어요.");
                        continue;
                    };
                    let previous = stack.len();
                    for entry in entries {
                        match entry {
                            Ok(entry) => stack.push((
                                entry.path(),
                                relative.join(entry.file_name()),
                                depth + 1,
                            )),
                            Err(_) => result.issue(&relative, "폴더 항목을 읽지 못했어요."),
                        }
                        if stack.len() + visited > 10_000 {
                            return Err(
                                "탐색 항목이 너무 많아요. 더 작은 폴더로 나누어 주세요.".into()
                            );
                        }
                    }
                    if previous == stack.len() {
                        result.empty += 1;
                    }
                } else if metadata.is_file() && metadata.len() <= files::LIMIT {
                    if result.files.len() == IMPORT_LIMIT {
                        return Err("파일이 200개를 넘어요. 더 작은 폴더로 나누어 주세요.".into());
                    }
                    result.relative.insert(path.clone(), relative);
                    result.files.push(path);
                } else {
                    result.issue(&relative, "100 MiB 이하의 일반 파일만 정리할 수 있어요.");
                }
            }
        }
        if result.files.is_empty() {
            return Err("정리할 파일이 없어요. 빈 폴더나 제외 항목만 있는지 확인해 주세요.".into());
        }
        result.files.sort();
        Ok(result)
    }
}

#[derive(Clone, Deserialize, Serialize)]
pub(super) struct DirectoryTarget {
    pub target: PathBuf,
    pub anchor: PathBuf,
    key: String,
}

impl DirectoryTarget {
    pub fn inspect(root: &Path, target: &Path, allow_missing: bool) -> Result<Self> {
        if !target.starts_with(root) {
            return Err("관리 폴더 안에서 목적지를 선택해 주세요.".into());
        }
        normalized_name(target.strip_prefix(root)?)?;
        let mut anchor = target;
        loop {
            match fs::symlink_metadata(anchor) {
                Ok(_) => break,
                Err(error) if allow_missing && error.kind() == io::ErrorKind::NotFound => {
                    anchor = anchor.parent().ok_or("목적지 폴더를 확인해 주세요.")?;
                }
                Err(error) => return Err(error.into()),
            }
        }
        let anchor = files::local(anchor)?;
        if !anchor.starts_with(root) {
            return Err("관리 폴더 안에서 목적지를 선택해 주세요.".into());
        }
        let key = files::directory_identity(&anchor)?;
        Ok(Self {
            target: target.to_owned(),
            anchor,
            key,
        })
    }

    pub fn materialize(&self, root: &Path) -> Result<PathBuf> {
        self.validate(root)?;
        let relative = normalized_name(self.target.strip_prefix(&self.anchor)?)?;
        let mut cursor = self.anchor.clone();
        for component in relative.components() {
            cursor.push(component);
            match fs::create_dir(&cursor) {
                Ok(()) => {}
                Err(error) if error.kind() == io::ErrorKind::AlreadyExists => {}
                Err(error) => return Err(error.into()),
            }
            if !files::local(&cursor)?.is_dir() {
                return Err("목적지 폴더를 확인해 주세요.".into());
            }
        }
        Ok(files::local(&cursor)?)
    }

    pub fn validate(&self, root: &Path) -> Result {
        if !self.anchor.starts_with(root) || !self.target.starts_with(&self.anchor) {
            return Err("목적지가 관리 폴더를 벗어났어요.".into());
        }
        if files::directory_identity(&self.anchor)? != self.key {
            return Err("목적지 폴더가 바뀌었어요.".into());
        }
        Ok(())
    }
}
