use super::{
    files,
    theme_package::{Package, LIMIT},
    Result, Store,
};
use base64::{engine::general_purpose::STANDARD, Engine};
use rusqlite::{params, OptionalExtension};
use serde_json::{json, Value};
use std::{fs::File, io::Read, path::Path, sync::OnceLock};

const SURFACES: [&str; 3] = ["main", "widget", "font"];

fn builtins() -> &'static Vec<Value> {
    static THEMES: OnceLock<Vec<Value>> = OnceLock::new();
    THEMES.get_or_init(|| {
        serde_json::from_str(include_str!("../../gen/rust-builtin-themes.json"))
            .expect("bundled theme data")
    })
}

pub(super) fn lookup(id: &Value) -> Option<&'static Value> {
    builtins().iter().find(|theme| &theme["id"] == id)
}

fn selected(store: &Store) -> Result<Value> {
    store.get("themeState", json!({"selection":{"main":null,"widget":null,"font":null,"preferences":{},"overrides":{}},"previous":null,"revision":0}))
}

fn active(store: &Store, selection: &Value) -> Result<Value> {
    for key in ["widget", "main", "font"] {
        if let Some(builtin) = lookup(&selection[key]) {
            return Ok(json!({"id":builtin["id"],"title":builtin["title"]}));
        }
        if let Some(id) = selection[key].as_str() {
            if let Some(entry) = store
                .rows("SELECT entry FROM installed_themes WHERE id=?", [id])?
                .pop()
            {
                return Ok(json!({"id":entry["id"],"title":entry["title"]}));
            }
        }
    }
    Ok(Value::Null)
}

pub fn summary(store: &Store) -> Result<Value> {
    let state = selected(store)?;
    Ok(json!({"active":active(store, &state["selection"])?,"revision":state["revision"]}))
}

pub fn catalog(store: &Store) -> Result<Value> {
    let state = selected(store)?;
    let installed = store.rows("SELECT entry FROM installed_themes ORDER BY rowid", [])?;
    Ok(
        json!({"installed":installed,"builtins":builtins(),"active":active(store, &state["selection"])?,
        "selection":state["selection"],"canUndo":!state["previous"].is_null(),"user":null,
        "guideSeen":store.get("themeGuideSeen", json!(false))?}),
    )
}

pub(super) fn load(store: &Store, id: &Value) -> Result<Value> {
    if id.is_null() {
        return Ok(Value::Null);
    }
    if let Some(builtin) = lookup(id) {
        return Ok(builtin.clone());
    }
    let id = id.as_str().ok_or("테마를 다시 선택해 주세요.")?;
    let bytes = store
        .db
        .query_row(
            "SELECT package FROM installed_themes WHERE id=?",
            [id],
            |r| r.get::<_, Vec<u8>>(0),
        )
        .optional()?
        .ok_or("설치된 테마를 찾지 못했어요.")?;
    let theme = Package::parse(&bytes)?;
    if theme.digest != id {
        return Err("설치한 테마가 손상됐어요.".into());
    }
    Ok(theme.asset())
}

pub(super) fn decode_created(value: &Value) -> Result<Vec<u8>> {
    let encoded = value
        .as_str()
        .filter(|value| !value.is_empty() && value.len() <= LIMIT.div_ceil(3) * 4)
        .ok_or("만든 테마 파일을 확인해 주세요.")?;
    let bytes = STANDARD.decode(encoded)?;
    if bytes.len() > LIMIT {
        return Err("테마가 5 MiB를 넘어요.".into());
    }
    Ok(bytes)
}

pub(super) fn read_package(path: &Path) -> Result<Vec<u8>> {
    let file = File::open(files::local(path)?)?;
    let initial = file.metadata()?;
    if !initial.is_file() || initial.len() > LIMIT as u64 {
        return Err("5 MiB 이하의 테마 파일을 선택해 주세요.".into());
    }
    let mut bytes = Vec::with_capacity(initial.len() as usize);
    (&file).take(LIMIT as u64 + 1).read_to_end(&mut bytes)?;
    if initial.len() != bytes.len() as u64 || initial.modified()? != file.metadata()?.modified()? {
        return Err("테마 파일이 바뀌었어요. 다시 선택해 주세요.".into());
    }
    Ok(bytes)
}

pub(super) fn install(store: &Store, bytes: &[u8]) -> Result<Value> {
    let theme = Package::parse(bytes)?;
    let count: i64 = store
        .db
        .query_row("SELECT count(*) FROM installed_themes", [], |r| r.get(0))?;
    let installed: bool = store.db.query_row(
        "SELECT EXISTS(SELECT 1 FROM installed_themes WHERE id=?)",
        [&theme.digest],
        |r| r.get(0),
    )?;
    if !installed && count >= 50 {
        return Err("설치한 테마를 삭제한 후 다시 시도해 주세요.".into());
    }
    store.db.execute(
        "INSERT OR IGNORE INTO installed_themes VALUES (?,?,?)",
        params![theme.digest, theme.catalog_entry().to_string(), bytes],
    )?;
    catalog(store)
}

pub fn call(store: &mut Store, method: &str, id: &Value, options: &Value) -> Result<Value> {
    let state = selected(store)?;
    let current = &state["selection"];
    match method {
        "active" => {
            let mut applied = json!({});
            for key in SURFACES {
                applied[key] = load(store, &current[key])?;
            }
            return Ok(
                json!({"active":active(store,current)?,"revision":state["revision"],"selection":current,"applied":applied}),
            );
        }
        "local" => return catalog(store),
        "guide-seen" => {
            store.set("themeGuideSeen", &json!(true))?;
            return catalog(store);
        }
        "install-created" => return install(store, &decode_created(id)?),
        "preview" if options != true => {
            let mut theme = load(store, id)?;
            if theme.is_null() {
                return Err("테마를 다시 선택해 주세요.".into());
            }
            theme["hasFont"] = json!(!theme["font"].is_null());
            theme["font"] = Value::Null;
            return Ok(theme);
        }
        _ => {}
    }
    let mut next = current.clone();
    match method {
        "activate" => {
            let theme = load(store, id)?;
            next["main"] = if theme["manifest"]["ui"].is_object() {
                id.clone()
            } else {
                Value::Null
            };
            next["widget"] = id.clone();
            next["font"] = if theme["font"].is_string() {
                id.clone()
            } else {
                Value::Null
            };
            next["overrides"] = json!({});
        }
        "apply" => {
            let theme = load(store, id)?;
            if theme.is_null() {
                return Err("테마를 다시 선택해 주세요.".into());
            }
            if !SURFACES.iter().all(|key| options[key].is_boolean())
                || !SURFACES.iter().any(|key| options[key] == true)
                || !options["reduced"].is_boolean()
                || (!options["accent"].is_null()
                    && !options["accent"].as_str().is_some_and(|s| {
                        s.starts_with('#')
                            && s.len() == 7
                            && s.as_bytes()[1..].iter().all(u8::is_ascii_hexdigit)
                    }))
            {
                return Err("테마 적용 설정을 확인해 주세요.".into());
            }
            let prefs = json!({"accent":options["accent"],"reduced":options["reduced"]});
            for key in SURFACES {
                if options[key] == true {
                    next[key] = theme["id"].clone();
                    if key != "font" {
                        next["overrides"][key] = prefs.clone();
                    }
                }
            }
            next["preferences"][theme["id"].as_str().unwrap()] = prefs;
        }
        "undo" if !state["previous"].is_null() => next = state["previous"].clone(),
        "remove" => {
            let id = id
                .as_str()
                .filter(|id| id.len() == 64 && id.bytes().all(|b| b.is_ascii_hexdigit()))
                .ok_or("설치한 테마를 선택해 주세요.")?;
            for key in SURFACES {
                if next[key] == id {
                    next[key] = Value::Null;
                    if let Some(overrides) = next["overrides"].as_object_mut() {
                        overrides.remove(key);
                    }
                }
            }
            if let Some(preferences) = next["preferences"].as_object_mut() {
                preferences.remove(id);
            }
            let tx = store.db.transaction()?;
            tx.execute("DELETE FROM installed_themes WHERE id=?", [id])?;
            let updated = json!({"selection":next,"previous":null,"revision":state["revision"].as_u64().unwrap_or(0)+1});
            tx.execute(
                "INSERT OR REPLACE INTO settings VALUES ('themeState',?)",
                [updated.to_string()],
            )?;
            tx.commit()?;
            return catalog(store);
        }
        _ => return Err("알 수 없는 테마 요청이에요.".into()),
    }
    let next = json!({"selection":next,"previous":current,"revision":state["revision"].as_u64().unwrap_or(0)+1});
    store.set("themeState", &next)?;
    catalog(store)
}
