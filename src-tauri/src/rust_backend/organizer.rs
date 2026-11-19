use super::{
    files, folder_import::DirectoryTarget, intelligence, now, organize_policy::Policy, text,
    workflow::OrganizedTransfer, Core, Result, Store,
};
use rusqlite::params;
use serde_json::{json, Value};
use std::{
    collections::HashMap,
    path::{Path, PathBuf},
    sync::atomic::{AtomicBool, Ordering},
};
use uuid::Uuid;

const JOB_JSON: &str = "json_object('id',j.id,'root',j.root,'scope',j.scope,'root_path',r.path,
    'recursive',j.recursive,'state',j.state,'revision',j.revision,'observed',j.observed,
    'excluded',j.excluded,'issues',j.issues,'error',j.error,'created',j.created,'updated',j.updated,
    'policy',j.policy,'rules_revision',j.rules_revision,'root_key',j.root_key)";

pub(super) fn jobs(store: &Store, root: Option<&str>) -> Result<Vec<Value>> {
    store.rows(
        &format!(
            "SELECT {JOB_JSON} FROM organize_jobs j JOIN roots r ON r.id=j.root
         WHERE (?1 IS NULL OR j.root=?1) ORDER BY j.created DESC,j.rowid DESC LIMIT 20"
        ),
        [root],
    )
}

fn job(store: &Store, id: &str) -> Result<Value> {
    store
        .rows(
            &format!(
                "SELECT {JOB_JSON} FROM organize_jobs j JOIN roots r ON r.id=j.root WHERE j.id=?"
            ),
            [id],
        )?
        .pop()
        .ok_or_else(|| "정리 작업을 찾지 못했어요.".into())
}

fn items(
    store: &Store,
    id: &str,
    after: i64,
    size: i64,
    filter: &str,
    target: &str,
) -> Result<Vec<Value>> {
    store.rows(
        "SELECT json_object('seq',seq,'id',id,'source',source,'destination',destination,
            'state',state,'selected',selected,'reason',reason,'operation',operation)
         FROM organize_items WHERE job=?1 AND seq>?2
          AND (?3='' OR destination=?3) AND CASE ?4
              WHEN 'all' THEN 1 WHEN 'issues' THEN state IN ('review','blocked','failed','needs_review','new_folder')
              ELSE state NOT IN ('keep','excluded') END ORDER BY seq LIMIT ?5",
        params![id,after,target,filter,size],
    )
}

fn page(store: &Store, id: &str, options: &Value) -> Result<Value> {
    let job = job(store, id)?;
    let after = options["after"].as_i64().unwrap_or(0).max(0);
    let size = options["size"]
        .as_i64()
        .filter(|s| [10, 20, 50, 100].contains(s))
        .unwrap_or(20);
    let mut items = items(
        store,
        id,
        after,
        size + 1,
        options["filter"].as_str().unwrap_or("changes"),
        options["destination"].as_str().unwrap_or_default(),
    )?;
    let has_next = items.len() > size as usize;
    items.truncate(size as usize);
    let next = items
        .last()
        .and_then(|item| item["seq"].as_i64())
        .unwrap_or(after);
    let counts = store
        .rows(
            "SELECT json_group_object(state,n) FROM
        (SELECT state,count(*) n FROM organize_items WHERE job=? GROUP BY state)",
            [id],
        )?
        .pop();
    let selected: i64 = store.db.query_row(
        "SELECT count(*) FROM organize_items WHERE job=? AND selected=1",
        [id],
        |r| r.get(0),
    )?;
    let groups = store.rows("SELECT json_object('destination',destination,'n',count(*)) FROM organize_items
        WHERE job=? AND destination!='' AND state NOT IN ('excluded','keep') GROUP BY destination ORDER BY destination LIMIT 100", [id])?;
    let folders = store.rows("SELECT json_object('path',f.path,'approved',f.approved,'state','proposed',
        'n',(SELECT count(*) FROM organize_items i WHERE i.job=f.job AND i.destination=f.path
          AND i.state IN ('suggested','new_folder'))) FROM organize_folders f WHERE f.job=? ORDER BY f.path", [id])?;
    let stored = store.rows(
        "SELECT json_object('status',a.status,'n',count(*)) FROM aftercare a
        JOIN organize_items i ON i.operation=a.operation WHERE i.job=? GROUP BY a.status",
        [id],
    )?;
    Ok(
        json!({"job":job,"items":items,"counts":counts,"selected":selected,"groups":groups,
        "folders":folders,"stored":stored,"hasNext":has_next,"next":next}),
    )
}

fn root_for_job(store: &Store, info: &Value) -> Result<PathBuf> {
    let id = text(&info["root"])?;
    let active: bool = store
        .db
        .query_row("SELECT active FROM roots WHERE id=?", [id], |r| r.get(0))?;
    let path = files::local(&store.root_path(id)?)?;
    if !active || info["root_key"] != files::directory_identity(&path)? {
        return Err("관리 폴더가 바뀌었어요. 다시 분석해 주세요.".into());
    }
    Ok(path)
}

fn revision(store: &Store, root: &str) -> Result<String> {
    let configured = store.rows(
        "SELECT json_array(id,keywords,extension,folder,enabled,updated)
      FROM routing_rules WHERE root=? ORDER BY id",
        [root],
    )?;
    let learned = store.rows(
        "SELECT json_array(pattern,folder,count,updated)
      FROM preferences WHERE root=? ORDER BY pattern,folder",
        [root],
    )?;
    Ok(files::digest(&serde_json::to_vec(&(configured, learned))?))
}

fn verify_review(info: &Value, input: &Value) -> Result {
    if info["state"] != "review"
        || !input["revision"].is_i64()
        || input["revision"] != info["revision"]
    {
        return Err("계획이 바뀌었어요. 다시 확인해 주세요.".into());
    }
    Ok(())
}

fn start(store: &mut Store, root: &str, input: &Value) -> Result<Value> {
    let path = files::local(&store.root_path(root)?)?;
    let active: bool = store
        .db
        .query_row("SELECT active FROM roots WHERE id=?", [root], |r| r.get(0))?;
    let scope = files::local(Path::new(text(&input["scope"])?))?;
    if !active || !scope.is_dir() || !scope.starts_with(&path) {
        return Err("활성 관리 폴더 안에서 정리 범위를 선택해 주세요.".into());
    }
    let id = Uuid::new_v4().to_string();
    let policy = Policy::parse(&input["policy"])?;
    store.db.execute("INSERT INTO organize_jobs(id,root,scope,root_key,recursive,state,policy,rules_revision,created,updated)
        VALUES (?,?,?,?,?,'indexing',?,?,?,?)", params![
        id,root,scope.to_string_lossy(),files::directory_identity(&path)?,input["recursive"] == true,
        serde_json::to_string(&policy)?,revision(store,root)?,now(),now(),
    ])?;
    Ok(json!(id))
}

pub(super) fn build_review(store: &mut Store, id: &str, cancel: &AtomicBool) -> Result {
    let info = job(store, id)?;
    let root = root_for_job(store, &info)?;
    let root_id = text(&info["root"])?;
    let scope = Path::new(text(&info["scope"])?);
    let policy: Policy = serde_json::from_str(text(&info["policy"])?)?;
    let inventory = files::tree(scope)?;
    let existing = if policy.mode == "existing" {
        files::tree(&root)?.folders
    } else {
        Vec::new()
    };
    let paused = || cancel.load(Ordering::Relaxed);
    let mut results = Vec::new();
    let mut folders = HashMap::new();
    let mut protection = HashMap::new();
    let mut issues = if inventory.complete { 0 } else { 1 };
    let unmanaged: std::collections::HashSet<String> = store
        .list(root_id, true)?
        .into_iter()
        .filter_map(|f| f["path"].as_str().map(str::to_owned))
        .collect();
    let observed = inventory.files.len();
    let mut excluded = inventory.issues.len();
    for source in inventory.files {
        if paused() {
            break;
        }
        let Some(parent) = source.parent() else {
            continue;
        };
        if info["recursive"] != 1 && parent != scope {
            continue;
        }
        let signature = match files::signature(&source) {
            Ok(value) => value,
            Err(_) => {
                issues += 1;
                continue;
            }
        };
        let mut entry = Item {
            source: source.clone(),
            signature,
            folder: PathBuf::new(),
            target: None,
            state: "review",
            reason: "목적지를 직접 확인해 주세요.".into(),
        };
        let protected = *protection
            .entry(parent.to_owned())
            .or_insert_with(|| policy.protected(&root, parent));
        if protected || unmanaged.contains(source.to_string_lossy().as_ref()) {
            entry.state = "excluded";
            entry.reason = "그대로 두기로 한 폴더 또는 파일이에요.".into();
            excluded += 1;
        } else {
            let (target, reason) = if policy.mode == "existing" {
                let recommendation = intelligence::recommend(store, root_id, &source, &existing)?;
                (
                    recommendation["selected"]
                        .as_str()
                        .filter(|folder| !folder.is_empty())
                        .map(PathBuf::from),
                    recommendation["candidates"][0]["reason"]
                        .as_str()
                        .unwrap_or("목적지를 직접 확인해 주세요.")
                        .to_owned(),
                )
            } else {
                let (relative, reason) = policy.destination(&source);
                (
                    relative.map(|relative| root.join(relative)),
                    reason.to_owned(),
                )
            };
            entry.reason = reason;
            if let Some(target) = target {
                let protected = *protection
                    .entry(target.clone())
                    .or_insert_with(|| policy.protected(&root, &target));
                if !protected {
                    let candidate =
                        entry.set_destination(&root, &target, true, entry.reason.clone());
                    if candidate.is_err() {
                        entry.state = "blocked";
                        entry.reason = "목적지를 확인할 수 없어요.".into();
                    }
                    if entry.state == "new_folder" {
                        if let Some(target) = &entry.target {
                            folders
                                .entry(entry.folder.clone())
                                .or_insert_with(|| target.clone());
                        }
                    }
                } else {
                    entry.reason = "그대로 둘 폴더는 목적지로 선택할 수 없어요.".into();
                }
            }
        }
        results.push(entry);
    }
    let tx = store.db.transaction()?;
    tx.execute("DELETE FROM organize_items WHERE job=?", [id])?;
    tx.execute("DELETE FROM organize_folders WHERE job=?", [id])?;
    for item in results {
        tx.execute(
            "INSERT INTO organize_items(id,job,source,signature,destination,target,state,reason)
            VALUES (?,?,?,?,?,?,?,?)",
            params![
                Uuid::new_v4().to_string(),
                id,
                item.source.to_string_lossy(),
                item.signature,
                item.folder.to_string_lossy(),
                item.target
                    .as_ref()
                    .map(serde_json::to_string)
                    .transpose()?,
                item.state,
                item.reason,
            ],
        )?;
    }
    for (path, target) in folders {
        tx.execute(
            "INSERT INTO organize_folders(job,path,target) VALUES (?,?,?)",
            params![id, path.to_string_lossy(), serde_json::to_string(&target)?],
        )?;
    }
    tx.execute("UPDATE organize_jobs SET state=?,revision=revision+1,observed=?,excluded=?,issues=?,updated=? WHERE id=?",
        params![if paused() { "paused" } else { "review" },observed as i64,excluded as i64,issues,now(),id])?;
    tx.commit()?;
    Ok(())
}

struct Item {
    source: PathBuf,
    signature: String,
    folder: PathBuf,
    target: Option<DirectoryTarget>,
    state: &'static str,
    reason: String,
}

impl Item {
    fn set_destination(
        &mut self,
        root: &Path,
        folder: &Path,
        missing: bool,
        reason: String,
    ) -> Result {
        let target = DirectoryTarget::inspect(root, folder, missing)?;
        let filename = self
            .source
            .file_name()
            .ok_or("파일 이름을 확인해 주세요.")?;
        self.state = if self.source.parent() == Some(folder) {
            "keep"
        } else if folder.join(filename).exists() {
            "blocked"
        } else if target.anchor != target.target {
            "new_folder"
        } else {
            "suggested"
        };
        self.reason = if self.state == "blocked" {
            "같은 이름의 파일이 있어요.".into()
        } else {
            reason
        };
        self.folder = folder.to_owned();
        self.target = Some(target);
        Ok(())
    }
}

pub(super) fn recover(store: &Store) -> Result {
    store.db.execute(
        "UPDATE organize_items SET operation=(SELECT o.id FROM ops o WHERE o.batch=organize_items.batch
              AND o.source=organize_items.source LIMIT 1),
         state=coalesce((SELECT CASE o.status WHEN 'completed' THEN 'completed' WHEN 'undone' THEN 'completed'
            WHEN 'needs_review' THEN 'needs_review' ELSE 'failed' END FROM ops o
            WHERE o.batch=organize_items.batch AND o.source=organize_items.source LIMIT 1),'suggested')
         WHERE state IN ('running','queued')", [],
    )?;
    store.db.execute(
        "UPDATE organize_jobs SET state='paused',updated=? WHERE state IN ('indexing','executing')",
        [now()],
    )?;
    Ok(())
}

pub(super) fn run_batch(core: &mut Core, id: &str, cancel: &AtomicBool) -> Result<bool> {
    let info = job(&core.store, id)?;
    if info["state"] != "executing" {
        return Ok(false);
    }
    let root = root_for_job(&core.store, &info)?;
    let root_id = text(&info["root"])?;
    if cancel.load(Ordering::Relaxed) {
        core.store.db.execute(
            "UPDATE organize_items SET state='suggested',selected=0 WHERE job=? AND state='queued'",
            [id],
        )?;
        core.store.db.execute(
            "UPDATE organize_jobs SET state='paused',updated=? WHERE id=?",
            params![now(), id],
        )?;
        return Ok(false);
    }
    let transfers = core.store.rows(
        "SELECT json_object('id',id,'source',source,'signature',signature,'target',json(target))
        FROM organize_items WHERE job=? AND state='queued' ORDER BY seq LIMIT 20",
        [id],
    )?;
    if transfers.is_empty() {
        let failed: bool = core.store.db.query_row(
            "SELECT EXISTS(SELECT 1 FROM organize_items
            WHERE job=? AND state IN ('failed','needs_review'))",
            [id],
            |r| r.get(0),
        )?;
        core.store.db.execute(
            "UPDATE organize_jobs SET state=?,updated=? WHERE id=?",
            params![if failed { "partial" } else { "done" }, now(), id],
        )?;
        return Ok(false);
    }
    let batch = Uuid::new_v4().to_string();
    let mut prepared = Vec::new();
    for entry in &transfers {
        let target: DirectoryTarget = serde_json::from_value(entry["target"].clone())?;
        target.validate(&root)?;
        prepared.push(OrganizedTransfer {
            source: PathBuf::from(text(&entry["source"])?),
            signature: text(&entry["signature"])?.to_owned(),
            destination: target,
        });
    }
    core.prepare_organized(&batch, root_id, prepared)?;
    {
        let tx = core.store.db.transaction()?;
        for entry in &transfers {
            tx.execute(
                "UPDATE organize_items SET state='running',batch=? WHERE id=?",
                params![batch, text(&entry["id"])?],
            )?;
        }
        tx.commit()?;
    }
    let result = core.execute(&batch, cancel)?;
    let rows = result["rows"]
        .as_array()
        .ok_or("정리 결과를 확인해 주세요.")?;
    let tx = core.store.db.transaction()?;
    for (entry, row) in transfers.iter().zip(rows) {
        let state = match row["status"].as_str() {
            Some("completed") => "completed",
            Some("canceled") => "suggested",
            _ => "failed",
        };
        tx.execute(
            "UPDATE organize_items SET state=?,operation=?,reason=?,selected=0 WHERE id=?",
            params![
                state,
                row["id"].as_str(),
                row["reason"].as_str().unwrap_or_default(),
                text(&entry["id"])?
            ],
        )?;
    }
    tx.commit()?;
    Ok(true)
}

pub(super) fn call(
    store: &mut Store,
    command: &str,
    first: &Value,
    input: &Value,
) -> Result<Value> {
    if command == "organize-list" {
        return Ok(json!(jobs(store, first.as_str())?));
    }
    let id = text(first)?;
    match command {
        "organize-page" => return page(store, id, input),
        "organize-policy" => {
            store.root_path(id)?;
            return Ok(store
                .rows(
                    "SELECT policy FROM organize_policies WHERE root=? AND scope=?",
                    params![id, text(input)?],
                )?
                .pop()
                .unwrap_or(Value::Null));
        }
        "organize-start" => return start(store, id, input),
        _ => {}
    }
    let info = job(store, id)?;
    match command {
        "organize-select" => {
            verify_review(&info, input)?;
            let selected = input["selected"]
                .as_bool()
                .ok_or("선택 상태를 확인해 주세요.")?;
            store.db.execute(
                "UPDATE organize_items SET selected=?1 WHERE job=?2 AND state='suggested'
                AND (?3 IS NULL OR id=?3)",
                params![selected, id, input["item"].as_str()],
            )?;
        }
        "organize-destination" => {
            verify_review(&info, input)?;
            let root = root_for_job(store, &info)?;
            let policy: Policy = serde_json::from_str(text(&info["policy"])?)?;
            let path = files::local(Path::new(text(&input["destination"])?))?;
            let item_id = text(&input["item"])?;
            let (source, signature): (String, String) = store.db.query_row(
                "SELECT source,signature FROM organize_items WHERE job=? AND id=?
                 AND state IN ('suggested','review','blocked','failed','keep','new_folder')",
                params![id, item_id],
                |r| Ok((r.get(0)?, r.get(1)?)),
            )?;
            if policy.protected(&root, &path) || files::signature(Path::new(&source))? != signature
            {
                return Err("원본이나 목적지가 바뀌었어요. 다시 분석해 주세요.".into());
            }
            let mut item = Item {
                source: source.into(),
                signature,
                folder: PathBuf::new(),
                target: None,
                state: "review",
                reason: String::new(),
            };
            item.set_destination(&root, &path, false, "직접 선택한 위치예요.".into())?;
            let tx = store.db.transaction()?;
            tx.execute("UPDATE organize_items SET destination=?,target=?,state=?,reason=?,selected=0 WHERE id=?",
                params![path.to_string_lossy(),serde_json::to_string(&item.target)?,item.state,item.reason,item_id])?;
            tx.execute(
                "UPDATE organize_jobs SET revision=revision+1,updated=? WHERE id=?",
                params![now(), id],
            )?;
            tx.commit()?;
        }
        "organize-folder-approve" => {
            verify_review(&info, input)?;
            let root = root_for_job(store, &info)?;
            let path = text(&input["path"])?;
            let approved = input["approved"]
                .as_bool()
                .ok_or("폴더 승인 여부를 확인해 주세요.")?;
            let saved: String = store.db.query_row(
                "SELECT target FROM organize_folders WHERE job=? AND path=?",
                params![id, path],
                |r| r.get(0),
            )?;
            let target: DirectoryTarget = serde_json::from_str(&saved)?;
            target.validate(&root)?;
            if target.target.exists() {
                return Err("목적지 폴더가 바뀌었어요. 다시 분석해 주세요.".into());
            }
            let tx = store.db.transaction()?;
            tx.execute(
                "UPDATE organize_folders SET approved=? WHERE job=? AND path=?",
                params![approved, id, path],
            )?;
            tx.execute(
                "UPDATE organize_items SET state=?,selected=0 WHERE job=? AND destination=?
                AND state IN ('new_folder','suggested')",
                params![if approved { "suggested" } else { "new_folder" }, id, path],
            )?;
            tx.execute(
                "UPDATE organize_jobs SET revision=revision+1,updated=? WHERE id=?",
                params![now(), id],
            )?;
            tx.commit()?;
        }
        "organize-approve" => {
            verify_review(&info, input)?;
            root_for_job(store, &info)?;
            let root = text(&info["root"])?;
            if info["rules_revision"] != revision(store, root)? {
                return Err("추천 규칙이나 학습 정보가 바뀌었어요. 다시 분석해 주세요.".into());
            }
            if info["issues"].as_i64().is_some_and(|n| n > 0) && input["acceptPartial"] != true {
                return Err("확인하지 못한 범위를 제외하고 진행할지 확인해 주세요.".into());
            }
            let tx = store.db.transaction()?;
            let selected = tx.execute("UPDATE organize_items SET state='queued' WHERE job=? AND state='suggested' AND selected=1", [id])?;
            if selected == 0 {
                return Err("이동할 항목을 선택해 주세요.".into());
            }
            let policy: Policy = serde_json::from_str(text(&info["policy"])?)?;
            if policy.remember {
                tx.execute(
                    "INSERT OR REPLACE INTO organize_policies VALUES (?,?,?)",
                    params![root, text(&info["scope"])?, text(&info["policy"])?],
                )?;
            }
            tx.execute(
                "UPDATE organize_jobs SET state='executing',updated=? WHERE id=?",
                params![now(), id],
            )?;
            tx.commit()?;
        }
        "organize-pause" => {
            if matches!(info["state"].as_str(), Some("indexing" | "executing")) {
                store.db.execute(
                    "UPDATE organize_jobs SET state='paused',updated=? WHERE id=?",
                    params![now(), id],
                )?;
            }
        }
        "organize-resume" | "organize-review" => {
            if !matches!(
                info["state"].as_str(),
                Some("partial" | "done" | "paused" | "failed")
            ) {
                return Err("정리 상태를 확인해 주세요.".into());
            }
            root_for_job(store, &info)?;
            let rule_revision = revision(store, text(&info["root"])?)?;
            let tx = store.db.transaction()?;
            let observed = info["observed"].as_i64().unwrap_or(0);
            let state = if observed == 0 { "indexing" } else { "review" };
            tx.execute("UPDATE organize_items SET state='suggested',selected=0 WHERE job=? AND state='queued'", [id])?;
            tx.execute("UPDATE organize_jobs SET state=?,rules_revision=?,revision=revision+1,error='',updated=? WHERE id=?",
                params![state,rule_revision,now(),id])?;
            tx.commit()?;
            return Ok(json!({"resume":state}));
        }
        _ => return Err("정리 요청을 확인해 주세요.".into()),
    }
    Ok(json!(true))
}
