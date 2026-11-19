use super::{files, folder_import, now, text, Result, Store};
use chrono::NaiveDate;
use regex::{Captures, Regex};
use rusqlite::{params, OptionalExtension};
use serde_json::{json, Value};
use std::{
    collections::{BTreeMap, HashSet},
    path::{Path, PathBuf},
    sync::LazyLock,
};
use unicode_normalization::UnicodeNormalization;
use uuid::Uuid;

static WORD: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"[\p{L}\p{N}]+").unwrap());
static LETTERS_OR_NUMBER: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"[\p{L}]+|[0-9]+").unwrap());
static DATE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"[0-9]{4}[-. ]?[0-9]{2}[-. ]?[0-9]{2}").unwrap());
static FIELD: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"\{[^{}]+\}").unwrap());

pub(super) fn normalize(value: &str) -> String {
    value.nfkc().flat_map(char::to_lowercase).collect()
}

fn numeric(word: &str) -> bool {
    !word.is_empty() && word.bytes().all(|b| b.is_ascii_digit())
}

fn name_tokens(value: &str) -> Vec<String> {
    let value = normalize(value);
    let mut seen = HashSet::new();
    WORD.find_iter(&value)
        .map(|m| m.as_str())
        .filter(|word| {
            word.chars().count() > 1
                && !numeric(word)
                && !word.strip_prefix('v').is_some_and(numeric)
                && !matches!(
                    *word,
                    "img"
                        | "dsc"
                        | "image"
                        | "scan"
                        | "screenshot"
                        | "final"
                        | "copy"
                        | "최종"
                        | "사본"
                        | "새"
                        | "문서"
                        | "untitled"
                        | "new"
                )
                && seen.insert(*word)
        })
        .map(str::to_owned)
        .collect()
}

fn stem(path: &Path) -> &str {
    path.file_stem()
        .and_then(|name| name.to_str())
        .unwrap_or_default()
}

fn extension(path: &Path) -> String {
    path.extension()
        .and_then(|value| value.to_str())
        .map(normalize)
        .unwrap_or_default()
}

pub(super) fn parse_date(value: &str) -> Option<NaiveDate> {
    let digits = value.replace(['-', '.'], "");
    if digits.len() != 8 || !numeric(&digits) {
        return None;
    }
    let year = digits[..4].parse().ok()?;
    if year < 100 {
        return None;
    }
    NaiveDate::from_ymd_opt(year, digits[4..6].parse().ok()?, digits[6..].parse().ok()?)
}

fn template(name: &Path) -> String {
    let value = DATE.replace_all(stem(name), |m: &Captures<'_>| {
        if parse_date(&m[0]).is_some() {
            "§".to_owned()
        } else {
            m[0].to_owned()
        }
    });
    let mut result = LETTERS_OR_NUMBER
        .replace_all(&value, |m: &Captures<'_>| {
            if numeric(&m[0]) {
                "{번호}"
            } else {
                "{텍스트}"
            }
        })
        .replace('§', "{날짜}");
    let ext = extension(name);
    if !ext.is_empty() {
        result.push('.');
        result.push_str(&ext);
    }
    result
}

fn name_rule(template: &str) -> Result<(Regex, Vec<usize>)> {
    let mut pattern = String::from("^");
    let mut position = 0;
    let mut dates = Vec::new();
    for (idx, field) in FIELD.find_iter(template).enumerate() {
        let literal = &template[position..field.start()];
        if literal.contains(['{', '}']) {
            return Err("파일명 형식의 괄호를 확인해 주세요.".into());
        }
        pattern.push_str(&regex::escape(literal));
        match field.as_str() {
            "{날짜}" => {
                dates.push(idx + 1);
                pattern.push_str("([0-9]{4}(?:[-.]?[0-9]{2}){2})");
            }
            "{번호}" => pattern.push_str("([0-9]+)"),
            "{텍스트}" | "{거래처}" | "{문서종류}" => pattern.push_str("([^_/]+?)"),
            _ => return Err("사용할 수 있는 파일명 필드를 확인해 주세요.".into()),
        }
        position = field.end();
    }
    let literal = &template[position..];
    if literal.contains(['{', '}']) {
        return Err("파일명 형식의 괄호를 확인해 주세요.".into());
    }
    pattern.push_str(&regex::escape(literal));
    pattern.push('$');
    Ok((Regex::new(&pattern)?, dates))
}

fn routing(store: &Store, root: &str) -> Result<Vec<Value>> {
    store.rows("SELECT json_object('id',id,'root',root,'keywords',json(keywords),'extension',extension,
        'folder',folder,'enabled',enabled,'updated',updated) FROM routing_rules WHERE root=? ORDER BY updated DESC", [root])
}

fn habits(store: &Store, root: &str) -> Result<Vec<Value>> {
    store.rows("SELECT json_object('root',root,'pattern',pattern,'folder',folder,'count',count,'updated',updated)
        FROM preferences WHERE root=? AND count>0 ORDER BY count DESC", [root])
}

pub(super) fn recommend(
    store: &Store,
    root: &str,
    source: &Path,
    folders: &[PathBuf],
) -> Result<Value> {
    let root_path = store.root_path(root)?;
    let ext = extension(source);
    let name = normalize(stem(source));
    let tokens = name_tokens(&name);
    let mut destinations = HashSet::new();
    for rule in routing(store, root)? {
        if rule["enabled"] == 1
            && (rule["extension"] == ext || rule["extension"] == "")
            && rule["keywords"].as_array().is_some_and(|list| {
                list.iter()
                    .all(|word| word.as_str().is_some_and(|word| name.contains(word)))
            })
        {
            if let Some(path) = rule["folder"]
                .as_str()
                .map(PathBuf::from)
                .filter(|folder| folders.contains(folder))
            {
                destinations.insert(path);
            }
        }
    }
    let habits = habits(store, root)?;
    let mut scored = Vec::with_capacity(folders.len());
    for folder in folders
        .iter()
        .filter(|folder| folder.starts_with(&root_path))
    {
        let relative = folder.strip_prefix(&root_path)?.to_string_lossy();
        let found = name_tokens(&relative);
        let matches: Vec<_> = tokens
            .iter()
            .filter(|word| {
                found
                    .iter()
                    .any(|f| f.contains(word.as_str()) || word.contains(f))
            })
            .collect();
        let mut history = 0.0;
        for record in &habits {
            let Some(pattern) = record["pattern"].as_str().map(Path::new) else {
                continue;
            };
            if record["folder"].as_str().map(Path::new) != Some(folder) || extension(pattern) != ext
            {
                continue;
            }
            let previous = name_tokens(stem(pattern));
            let overlap = tokens
                .iter()
                .filter(|token| previous.contains(token))
                .count();
            let distinct = tokens
                .iter()
                .chain(&previous)
                .collect::<HashSet<_>>()
                .len()
                .max(1);
            let age = now()
                .saturating_sub(record["updated"].as_i64().unwrap_or(0))
                .max(0) as f64;
            history += record["count"].as_f64().unwrap_or(0.0) * overlap as f64 / distinct as f64
                * 0.5_f64.powf(age / (90.0 * 86_400_000.0));
        }
        let explicit = destinations.contains(folder);
        let score = (if explicit { 100.0 } else { 0.0 })
            + (matches.len() * 2) as f64
            + (history * 1.2).min(6.0);
        let reason = if explicit {
            "직접 만든 분류 규칙과 일치해요."
        } else if history >= 1.0 {
            "같은 확장자의 비슷한 이름을 정리한 이력을 반영했어요."
        } else if !matches.is_empty() {
            "파일명과 폴더명의 단어가 일치해요."
        } else {
            "이름만으로 위치를 정하기 어려워요. 직접 선택해 주세요."
        };
        scored.push((
            score,
            folder,
            json!({"folder":folder,"score":score,"explicit":explicit,
            "matches":matches,"evidenceWeight":(history*10.0).round()/10.0,"reason":reason}),
        ));
    }
    scored.sort_by(|left, right| right.0.total_cmp(&left.0).then_with(|| left.1.cmp(right.1)));
    let conflict = destinations.len() > 1;
    let strong = !conflict
        && scored.first().is_some_and(|top| {
            destinations.len() == 1
                || (top.0 >= 2.0 && scored.get(1).is_none_or(|next| top.0 - next.0 >= 1.0))
        });
    let mut names = tokens.iter().take(3).cloned().collect::<Vec<_>>();
    if tokens.len() >= 2 {
        names.push(tokens[..2].join("_"));
    }
    let existing: HashSet<_> = folders
        .iter()
        .filter_map(|path| path.file_name()?.to_str())
        .map(normalize)
        .collect();
    names.retain(|name| {
        name.chars().count() <= 40 && folder_import::valid_part(name) && !existing.contains(name)
    });
    names.truncate(3);
    Ok(
        json!({"candidates":scored.iter().take(3).map(|row| &row.2).collect::<Vec<_>>(),
        "folders":folders,"selected":if strong { scored[0].1.to_str().unwrap_or_default() } else { "" },
        "confidence":if conflict { "conflict" } else if strong { "clear" } else { "review" },"folderNames":names}),
    )
}

fn rules(store: &Store, root: &str) -> Result<Vec<Value>> {
    store.rows("SELECT json_object('id',id,'root',root,'scope',scope,'template',template,'revision',revision,'active',active)
        FROM name_rules WHERE root=? AND active=1 ORDER BY length(scope) DESC", [root])
}

fn analyze(store: &Store, root: &str, folders: &[PathBuf]) -> Result<Value> {
    let root_info = store
        .roots()?
        .into_iter()
        .find(|value| value["id"] == root)
        .ok_or("관리 폴더를 선택해 주세요.")?;
    let rules = rules(store, root)?;
    let compiled = rules
        .iter()
        .map(|rule| name_rule(text(&rule["template"])?))
        .collect::<Result<Vec<_>>>()?;
    let mut groups: BTreeMap<(PathBuf, String), (HashSet<String>, Vec<String>)> = BTreeMap::new();
    let mut rows = Vec::new();
    for mut file in store
        .list(root, false)?
        .into_iter()
        .filter(|file| file["status"] != "deleted" && file["status"] != "replaced")
    {
        let path = PathBuf::from(text(&file["path"])?);
        let name = path
            .file_name()
            .and_then(|name| name.to_str())
            .unwrap_or_default();
        let scope = path.parent().ok_or("파일 이름을 확인해 주세요.")?;
        let (seen, examples) = groups
            .entry((scope.to_owned(), template(&path)))
            .or_default();
        let identity = file["hash"]
            .as_str()
            .filter(|hash| !hash.is_empty())
            .unwrap_or(text(&file["id"])?);
        if seen.insert(identity.to_owned()) && examples.len() < 3 {
            examples.push(name.to_owned());
        }
        let matched = rules.iter().zip(&compiled).find(|(rule, _)| {
            rule["scope"]
                .as_str()
                .is_some_and(|scope| path.starts_with(scope))
        });
        let (status, reason) = if let Some((rule, (format, dates))) = matched {
            let exists: bool = store.db.query_row("SELECT EXISTS(SELECT 1 FROM name_exceptions WHERE file=? AND rule=? AND revision=?)",
                params![text(&file["id"])?, text(&rule["id"])?, rule["revision"].as_i64()], |r| r.get(0))?;
            if exists {
                ("exception", "이 파일은 사용자가 지정한 예외예요.")
            } else if let Some(groups) = format.captures(name) {
                if dates.iter().all(|i| parse_date(&groups[*i]).is_some()) {
                    ("match", "파일명 형식이 일치해요.")
                } else {
                    ("mismatch", "유효한 날짜가 아니에요.")
                }
            } else {
                ("mismatch", "필수 구간·순서·구분자·확장자가 규칙과 달라요.")
            }
        } else {
            ("none", "이 범위에 승인한 규칙이 없어요.")
        };
        file["versionStatus"] = file["status"].clone();
        file["status"] = json!(status);
        file["reason"] = json!(reason);
        file["name"] = json!(name);
        file["rule"] = matched
            .map(|(rule, _)| rule["id"].clone())
            .unwrap_or_else(|| json!(""));
        file["revision"] = matched
            .map(|(rule, _)| rule["revision"].clone())
            .unwrap_or_else(|| json!(0));
        file["template"] = matched
            .map(|(rule, _)| rule["template"].clone())
            .unwrap_or_else(|| json!(""));
        rows.push(file);
    }
    let candidates: Vec<_> = groups
        .into_iter()
        .filter_map(|((scope, format), (seen, examples))| {
            if seen.len() < 5
                || rules.iter().any(|rule| {
                    rule["scope"].as_str().map(Path::new) == Some(&scope)
                        && rule["template"] == format
                })
            {
                return None;
            }
            Some(json!({"template":format,"scope":scope,"count":seen.len(),"examples":examples}))
        })
        .collect();
    Ok(
        json!({"root":root_info,"rules":rules,"routing":routing(store,root)?,"folders":folders,
        "candidates":candidates,"rows":rows,"habits":habits(store,root)?.into_iter().take(30).collect::<Vec<_>>()}),
    )
}

pub(super) fn call(
    store: &mut Store,
    command: &str,
    a: &Value,
    b: &Value,
    c: &Value,
    folders: &[PathBuf],
) -> Result<Value> {
    let first = text(a)?;
    match command {
        "analyze" => analyze(store, first, folders),
        "testRecommendation" => {
            let name = text(b)?.trim();
            if name.is_empty()
                || name.encode_utf16().count() > 200
                || name
                    .chars()
                    .any(|ch| ch.is_control() || matches!(ch, '/' | '\\'))
            {
                return Err("경로가 아닌 파일명 하나를 입력해 주세요.".into());
            }
            recommend(store, first, Path::new(name), folders)
        }
        "saveRouting" => {
            let root = store.root_path(first)?;
            let folder = files::local(Path::new(text(&b["folder"])?))?;
            if !folder.starts_with(root) || !folder.is_dir() {
                return Err("관리 폴더 안의 목적지를 선택해 주세요.".into());
            }
            let mut unique = HashSet::new();
            let words: Vec<_> = text(&b["keywords"])?
                .split(',')
                .map(|word| normalize(word.trim()))
                .filter(|word| !word.is_empty() && unique.insert(word.clone()))
                .collect();
            let ext = normalize(text(&b["extension"])?.trim());
            let ext = ext.strip_prefix('.').unwrap_or(&ext);
            if words.is_empty()
                || words.len() > 5
                || words.iter().any(|word| {
                    word.encode_utf16().count() > 40
                        || !WORD.is_match(word)
                        || word
                            .chars()
                            .any(|ch| ch.is_control() || matches!(ch, '/' | '\\'))
                })
                || ext.len() > 12
                || !ext
                    .bytes()
                    .all(|ch| ch.is_ascii_lowercase() || ch.is_ascii_digit())
            {
                return Err("이름 단어는 쉼표로 최대 5개, 확장자는 pdf처럼 입력해 주세요.".into());
            }
            let id = text(&b["id"])?;
            if !id.is_empty() && !routing(store, first)?.iter().any(|rule| rule["id"] == id) {
                return Err("수정할 분류 규칙을 찾지 못했어요.".into());
            }
            let id = if id.is_empty() {
                Uuid::new_v4().to_string()
            } else {
                id.to_owned()
            };
            store.db.execute("INSERT INTO routing_rules VALUES (?,?,?,?,?,1,?) ON CONFLICT(id) DO UPDATE
                SET keywords=excluded.keywords,extension=excluded.extension,folder=excluded.folder,enabled=1,updated=excluded.updated",
                params![id,first,json!(words).to_string(),ext,folder.to_string_lossy(),now()])?;
            Ok(json!(routing(store, first)?))
        }
        "toggleRouting" => {
            let enabled = c.as_bool().ok_or("규칙 상태를 확인해 주세요.")?;
            let n = store.db.execute(
                "UPDATE routing_rules SET enabled=?,updated=? WHERE root=? AND id=?",
                params![enabled, now(), first, text(b)?],
            )?;
            if n == 0 {
                return Err("분류 규칙을 찾지 못했어요.".into());
            }
            Ok(json!(true))
        }
        "approveRule" => {
            let root = store.root_path(first)?;
            let scope = files::local(Path::new(text(b)?))?;
            let format = text(c)?;
            if !scope.starts_with(root)
                || !scope.is_dir()
                || format.trim().is_empty()
                || format.encode_utf16().count() > 180
                || format.contains(['/', '\\', '\0'])
            {
                return Err("관리 범위와 파일명 형식을 확인해 주세요.".into());
            }
            name_rule(format)?;
            store.db.execute(
                "INSERT INTO name_rules VALUES (?,?,?,?,1,1) ON CONFLICT(root,scope) DO UPDATE
                SET template=excluded.template,revision=name_rules.revision+1,active=1",
                params![
                    Uuid::new_v4().to_string(),
                    first,
                    scope.to_string_lossy(),
                    format
                ],
            )?;
            analyze(store, first, folders)
        }
        "exception" => {
            let (root, path): (String, String) =
                store
                    .db
                    .query_row("SELECT root,path FROM files WHERE id=?", [first], |r| {
                        Ok((r.get(0)?, r.get(1)?))
                    })?;
            let rule = rules(store, &root)?
                .into_iter()
                .find(|rule| {
                    rule["scope"]
                        .as_str()
                        .is_some_and(|scope| Path::new(&path).starts_with(scope))
                })
                .ok_or("적용할 규칙이 없어요.")?;
            let rule_id = text(&rule["id"])?;
            if b == true {
                store.db.execute(
                    "INSERT OR IGNORE INTO name_exceptions VALUES (?,?,?)",
                    params![first, rule_id, rule["revision"].as_i64()],
                )?;
            } else {
                store.db.execute(
                    "DELETE FROM name_exceptions WHERE file=? AND rule=?",
                    params![first, rule_id],
                )?;
            }
            Ok(json!(true))
        }
        "disableRule" => {
            store
                .db
                .execute("UPDATE name_rules SET active=0 WHERE id=?", [first])?;
            Ok(json!(true))
        }
        "resetLearning" => {
            store.root_path(first)?;
            let tx = store.db.transaction()?;
            tx.execute("DELETE FROM preferences WHERE root=?", [first])?;
            tx.execute("UPDATE learned_ops SET active=0 WHERE root=?", [first])?;
            tx.commit()?;
            Ok(json!(true))
        }
        _ => Err("분류 요청을 확인해 주세요.".into()),
    }
}

pub(super) fn learn(
    store: &mut Store,
    id: &str,
    root: &str,
    source: &Path,
    dest: &Path,
    hash: &str,
) -> Result<()> {
    let folder = dest
        .parent()
        .ok_or("관리 폴더를 확인해 주세요.")?
        .to_string_lossy();
    let repeated: bool = store.db.query_row(
        "SELECT EXISTS(SELECT 1 FROM learned_ops WHERE op=?
        OR (root=? AND hash=? AND folder=?))",
        params![id, root, hash, folder],
        |r| r.get(0),
    )?;
    if repeated {
        return Ok(());
    }
    let mut tokens = normalize(stem(source));
    for marker in ["최종", "사본", "final", "copy"] {
        tokens = tokens.replace(marker, "");
    }
    let mut pattern = WORD
        .find_iter(&tokens)
        .map(|m| if numeric(m.as_str()) { "#" } else { m.as_str() })
        .collect::<Vec<_>>()
        .join("|");
    let ext = extension(source);
    if !ext.is_empty() {
        pattern.push('.');
        pattern.push_str(&ext);
    }
    let tx = store.db.transaction()?;
    tx.execute(
        "INSERT INTO learned_ops VALUES (?,?,?,?,1.0,1,?)",
        params![id, root, pattern, folder, hash],
    )?;
    tx.execute(
        "INSERT INTO preferences VALUES (?,?,?,1.0,?) ON CONFLICT(root,pattern,folder)
        DO UPDATE SET count=count+1.0,updated=excluded.updated",
        params![root, pattern, folder, now()],
    )?;
    tx.commit()?;
    Ok(())
}

pub(super) fn unlearn(store: &mut Store, id: &str) -> Result<()> {
    let row: Option<(String, String, String, f64)> = store
        .db
        .query_row(
            "SELECT root,pattern,folder,weight FROM learned_ops WHERE op=? AND active=1",
            [id],
            |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?, r.get(3)?)),
        )
        .optional()?;
    let Some((root, pattern, folder, weight)) = row else {
        return Ok(());
    };
    let tx = store.db.transaction()?;
    tx.execute(
        "UPDATE preferences SET count=max(0,count-?) WHERE root=? AND pattern=? AND folder=?",
        params![weight, root, pattern, folder],
    )?;
    tx.execute("UPDATE learned_ops SET active=0 WHERE op=?", [id])?;
    tx.commit()?;
    Ok(())
}
