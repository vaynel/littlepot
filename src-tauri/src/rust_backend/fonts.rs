use super::{files, Result, Store};
use base64::{engine::general_purpose::STANDARD, Engine};
use serde_json::{json, Value};
use std::{
    fs::{self, File},
    io::Read,
    path::{Path, PathBuf},
    time::{Duration, Instant},
};
use uuid::Uuid;

const LIMIT: u64 = 20 * 1024 * 1024;

#[derive(Default)]
pub(super) struct Fonts {
    pending: Option<Preview>,
}

struct Preview {
    token: String,
    name: String,
    bytes: Vec<u8>,
    created: Instant,
}

pub(super) fn font_bytes(path: &Path) -> Result<Vec<u8>> {
    let file = File::open(files::local(path)?)?;
    let before = file.metadata()?;
    if !before.is_file() || !(12..=LIMIT).contains(&before.len()) {
        return Err("20 MiB 이하의 폰트 파일을 선택해 주세요.".into());
    }
    let mut bytes = Vec::with_capacity(before.len() as usize);
    (&file).take(LIMIT + 1).read_to_end(&mut bytes)?;
    if before.len() != bytes.len() as u64 || before.modified()? != file.metadata()?.modified()? {
        return Err("읽는 중 파일이 바뀌었어요. 다시 선택해 주세요.".into());
    }
    if !matches!(&bytes[..4], b"\0\x01\0\0" | b"OTTO" | b"wOFF" | b"wOF2") {
        return Err("TTF·OTF·WOFF·WOFF2 파일을 선택해 주세요.".into());
    }
    Ok(bytes)
}

fn font_path(store: &Store, id: &str) -> Result<PathBuf> {
    if id.len() != 64
        || !id
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
    {
        return Err("저장된 폰트를 확인하지 못했어요. 다시 가져와 주세요.".into());
    }
    Ok(store.data.join("fonts").join(format!("{id}.font")))
}

fn remove_previous(store: &Store, previous: &Value, keep: Option<&str>) {
    if let Some(id) = previous["id"].as_str().filter(|id| Some(*id) != keep) {
        if let Ok(path) = font_path(store, id).and_then(|path| Ok(files::local(&path)?)) {
            let _ = fs::remove_file(path);
        }
    }
}

impl Fonts {
    pub fn stage(&mut self, path: &Path) -> Result<Value> {
        self.pending = None;
        if !matches!(
            path.extension()
                .and_then(|ext| ext.to_str())
                .map(str::to_ascii_lowercase)
                .as_deref(),
            Some("ttf" | "otf" | "woff" | "woff2")
        ) {
            return Err("TTF·OTF·WOFF·WOFF2 파일을 선택해 주세요.".into());
        }
        let bytes = font_bytes(path)?;
        let token = Uuid::new_v4().to_string();
        let name = path
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned();
        let response = json!({"token":token,"name":name,"data":STANDARD.encode(&bytes)});
        self.pending = Some(Preview {
            token,
            name,
            bytes,
            created: Instant::now(),
        });
        Ok(response)
    }

    pub fn install(&mut self, store: &Store, token: &str) -> Result<Value> {
        if !self.pending.as_ref().is_some_and(|item| {
            item.token == token && item.created.elapsed() < Duration::from_secs(600)
        }) {
            return Err("폰트 파일을 다시 선택해 주세요.".into());
        }
        let item = self.pending.take().unwrap();
        let id = files::digest(&item.bytes);
        let path = font_path(store, &id)?;
        fs::create_dir_all(store.data.join("fonts"))?;
        match files::publish(&path, &item.bytes) {
            Ok(()) => {}
            Err(error) if error.kind() == std::io::ErrorKind::AlreadyExists => {
                if files::digest(&font_bytes(&path)?) != id {
                    return Err("기존 폰트의 무결성을 확인하지 못했어요.".into());
                }
            }
            Err(error) => return Err(error.into()),
        }
        let previous = store.get("customFont", Value::Null)?;
        let value = json!({"id":id,"name":item.name});
        store.set("customFont", &value)?;
        remove_previous(store, &previous, Some(&id));
        Ok(value)
    }

    pub fn read(store: &Store) -> Result<Value> {
        let mut meta = store.get("customFont", Value::Null)?;
        if meta.is_null() {
            return Ok(meta);
        }
        let id = meta["id"]
            .as_str()
            .ok_or("저장된 폰트를 확인하지 못했어요.")?;
        let bytes = font_bytes(&font_path(store, id)?)?;
        if files::digest(&bytes) != id {
            return Err("보관한 폰트가 바뀌었어요. 다시 가져와 주세요.".into());
        }
        meta["data"] = json!(STANDARD.encode(bytes));
        Ok(meta)
    }

    pub fn reset(&mut self, store: &Store) -> Result<Value> {
        self.pending = None;
        let previous = store.get("customFont", Value::Null)?;
        store.set("customFont", &Value::Null)?;
        remove_previous(store, &previous, None);
        Ok(Value::Null)
    }
}
