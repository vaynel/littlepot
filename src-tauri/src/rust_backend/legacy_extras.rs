use super::{files, legacy::each, theme_package::Package, themes, Result};
use rusqlite::{params, Connection};
use serde_json::{json, Value};
use std::{
    collections::{HashMap, HashSet},
    fs,
    io::ErrorKind,
    path::Path,
};

fn has_table(db: &Connection, name: &str) -> Result<bool> {
    Ok(db.query_row(
        "SELECT EXISTS(SELECT 1 FROM sqlite_schema WHERE type='table' AND name=?)",
        [name],
        |row| row.get(0),
    )?)
}

fn digest_id(id: &str) -> bool {
    id.len() == 64
        && id
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

fn rules(target: &Connection, index: &Connection, garden: &Connection) -> Result {
    if has_table(index, "routing_rules")? {
        each(
            index,
            "SELECT id,root,keywords,extension,folder,enabled,updated FROM routing_rules",
            |row| {
                target.execute(
                    "INSERT INTO routing_rules(id,root,keywords,extension,folder,enabled,updated)
                 SELECT ?1,?2,?3,?4,?5,?6,?7 WHERE EXISTS(SELECT 1 FROM roots WHERE id=?2)
                 ON CONFLICT DO NOTHING",
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
    }

    let mut added = HashSet::new();
    if has_table(index, "rules")? {
        each(
            index,
            "SELECT id,root,scope,template,revision,active FROM rules",
            |row| {
                let id: String = row.get(0)?;
                let inserted = target.execute(
                    "INSERT INTO name_rules(id,root,scope,template,revision,active)
                 SELECT ?1,?2,?3,?4,?5,?6 WHERE EXISTS(SELECT 1 FROM roots WHERE id=?2)
                 ON CONFLICT DO NOTHING",
                    params![
                        id,
                        row.get::<_, String>(1)?,
                        row.get::<_, String>(2)?,
                        row.get::<_, String>(3)?,
                        row.get::<_, i64>(4)?,
                        row.get::<_, i64>(5)?,
                    ],
                )?;
                if inserted == 1 {
                    added.insert(id);
                }
                Ok(())
            },
        )?;
    }
    if !added.is_empty() && has_table(index, "exceptions")? {
        each(index, "SELECT file,rule,revision FROM exceptions", |row| {
            let rule: String = row.get(1)?;
            if added.contains(&rule) {
                target.execute(
                    "INSERT INTO name_exceptions(file,rule,revision) SELECT ?1,?2,?3
                     WHERE EXISTS(SELECT 1 FROM files f JOIN name_rules r ON r.root=f.root
                         WHERE f.id=?1 AND f.status!='forgotten' AND r.id=?2)
                     ON CONFLICT DO NOTHING",
                    params![row.get::<_, String>(0)?, rule, row.get::<_, i64>(2)?],
                )?;
            }
            Ok(())
        })?;
    }

    if has_table(index, "preferences")? {
        each(
            index,
            "SELECT root,pattern,folder,count,updated FROM preferences",
            |row| {
                target.execute(
                    "INSERT INTO preferences(root,pattern,folder,count,updated)
                 SELECT ?1,?2,?3,?4,?5 WHERE EXISTS(SELECT 1 FROM roots WHERE id=?1)
                 ON CONFLICT DO NOTHING",
                    params![
                        row.get::<_, String>(0)?,
                        row.get::<_, String>(1)?,
                        row.get::<_, String>(2)?,
                        row.get::<_, f64>(3)?,
                        row.get::<_, i64>(4)?,
                    ],
                )?;
                Ok(())
            },
        )?;
    }
    if has_table(index, "learned_ops")? {
        // The old deduplication rows encode the file hash in the operation key.
        each(
            index,
            "SELECT op,root,pattern,folder FROM learned_ops WHERE weight=0 AND active=0",
            |row| {
                let op: String = row.get(0)?;
                let root: String = row.get(1)?;
                let folder: String = row.get(3)?;
                if let Some((hash, old_folder)) = op
                    .strip_prefix(&root)
                    .and_then(|suffix| suffix.strip_prefix(':'))
                    .and_then(|suffix| suffix.split_once(':'))
                {
                    if digest_id(hash) && old_folder == folder {
                        target.execute(
                            "INSERT INTO learned_ops(op,root,pattern,folder,weight,active,hash)
                         SELECT ?1,?2,?3,?4,0,0,?5 WHERE EXISTS(SELECT 1 FROM roots WHERE id=?2)
                         ON CONFLICT DO NOTHING",
                            params![op, root, row.get::<_, String>(2)?, folder, hash],
                        )?;
                    }
                }
                Ok(())
            },
        )?;
    }

    if has_table(garden, "organize_policies")? {
        each(
            garden,
            "SELECT root,scope,policy FROM organize_policies",
            |row| {
                target.execute(
                    "INSERT INTO organize_policies(root,scope,policy)
                 SELECT ?1,?2,?3 WHERE EXISTS(SELECT 1 FROM roots WHERE id=?1)
                 ON CONFLICT DO NOTHING",
                    params![
                        row.get::<_, String>(0)?,
                        row.get::<_, String>(1)?,
                        row.get::<_, String>(2)?
                    ],
                )?;
                Ok(())
            },
        )?;
    }
    Ok(())
}

fn optional_theme_file(path: &Path) -> Result<Option<Vec<u8>>> {
    match fs::symlink_metadata(path) {
        Ok(_) => themes::read_package(path).map(Some),
        Err(error) if error.kind() == ErrorKind::NotFound => Ok(None),
        Err(error) => Err(error.into()),
    }
}

#[derive(Copy, Clone)]
struct Scopes {
    main: bool,
    font: bool,
}

fn scopes(id: &Value, installed: &HashMap<String, Scopes>) -> Option<Scopes> {
    if let Some(theme) = themes::lookup(id) {
        return Some(Scopes {
            main: theme["manifest"]["ui"].is_object(),
            font: theme["font"].is_string(),
        });
    }
    installed.get(id.as_str()?).copied()
}

fn preferences(value: &Value) -> Option<Value> {
    let reduced = value["reduced"].as_bool()?;
    let accent = value.get("accent")?;
    if !accent.is_null()
        && !accent.as_str().is_some_and(|color| {
            color.len() == 7
                && color.starts_with('#')
                && color.as_bytes()[1..].iter().all(u8::is_ascii_hexdigit)
        })
    {
        return None;
    }
    Some(json!({"accent":accent,"reduced":reduced}))
}

fn selection(value: &Value, installed: &HashMap<String, Scopes>) -> Value {
    let mut result = json!({"main":null,"widget":null,"font":null,"preferences":{},"overrides":{}});
    for key in ["main", "widget", "font"] {
        let id = &value[key];
        if scopes(id, installed)
            .is_some_and(|scope| (key != "main" || scope.main) && (key != "font" || scope.font))
        {
            result[key] = id.clone();
        }
    }
    if let Some(items) = value["preferences"].as_object() {
        for (id, option) in items {
            if digest_id(id) || themes::lookup(&json!(id)).is_some() {
                if let Some(preference) = preferences(option) {
                    result["preferences"][id] = preference;
                }
            }
        }
    }
    for key in ["main", "widget"] {
        if let Some(preference) = preferences(&value["overrides"][key]) {
            result["overrides"][key] = preference;
        }
    }
    result
}

fn import_themes(target: &Connection, dir: &Path) -> Result {
    match fs::symlink_metadata(dir) {
        Err(error) if error.kind() == ErrorKind::NotFound => return Ok(()),
        Err(error) => return Err(error.into()),
        Ok(_) => {}
    }
    let dir = files::local(dir)?;
    let mut installed = HashMap::new();
    for entry in fs::read_dir(&dir)? {
        let entry = entry?;
        let name = entry.file_name();
        let Some(id) = name
            .to_str()
            .and_then(|name| name.strip_suffix(".silltheme"))
            .filter(|id| digest_id(id))
        else {
            continue;
        };
        let bytes = themes::read_package(&entry.path())?;
        let Ok(package) = Package::parse(&bytes) else {
            continue;
        };
        if package.digest != id {
            continue;
        }
        target.execute(
            "INSERT INTO installed_themes(id,entry,package) VALUES (?,?,?) ON CONFLICT(id) DO NOTHING",
            params![id, package.catalog_entry().to_string(), bytes],
        )?;
        installed.insert(
            id.to_owned(),
            Scopes {
                main: package.manifest["ui"].is_object(),
                font: package.font.is_some(),
            },
        );
    }

    let state_exists: bool = target.query_row(
        "SELECT EXISTS(SELECT 1 FROM settings WHERE key='themeState')",
        [],
        |row| row.get(0),
    )?;
    if !state_exists {
        let saved = optional_theme_file(&dir.join("selection.json"))?;
        let active = if let Some(bytes) = saved {
            serde_json::from_slice(&bytes)?
        } else if let Some(bytes) = optional_theme_file(&dir.join("active"))? {
            let id = json!(std::str::from_utf8(&bytes)?.trim());
            json!({"current":{"main":id,"widget":id,"font":id},"previous":null})
        } else {
            Value::Null
        };
        if active["current"].is_object() {
            let current = selection(&active["current"], &installed);
            let previous = active["previous"]
                .is_object()
                .then(|| selection(&active["previous"], &installed));
            let state = json!({"selection":current,"previous":previous,"revision":1});
            target.execute(
                "INSERT INTO settings VALUES ('themeState',?)",
                [state.to_string()],
            )?;
        }
    }
    if optional_theme_file(&dir.join("guide-version"))?.as_deref() == Some(b"2") {
        target.execute(
            "INSERT OR IGNORE INTO settings VALUES ('themeGuideSeen','true')",
            [],
        )?;
    }
    Ok(())
}

pub(super) fn import(
    target: &Connection,
    garden: &Connection,
    index: &Connection,
    source: &Path,
) -> Result {
    rules(target, index, garden)?;
    import_themes(target, &source.join("theme-store"))?;
    target.execute(
        "INSERT INTO settings VALUES ('legacyExtrasImported','true')",
        [],
    )?;
    Ok(())
}
