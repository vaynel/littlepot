use super::folder_import::{DirectoryTarget, Inventory};
use super::{files, intelligence, now, Core, Result};
use rusqlite::{params, OptionalExtension};
use serde_json::{json, Value};
use std::{
    collections::HashSet,
    path::{Path, PathBuf},
    sync::atomic::{AtomicBool, Ordering},
    time::Instant,
};
use uuid::Uuid;

pub(super) struct Plan {
    pub paths: Vec<PathBuf>,
    pub plant: i64,
    mode: String,
    root: String,
    root_key: String,
    pub(super) inventory: Inventory,
    pub(super) layout: String,
    pub(super) base: PathBuf,
    once: bool,
    rows: Vec<PlanRow>,
    created: Instant,
    pub(super) retry_task: Option<String>,
}

struct PlanRow {
    source: PathBuf,
    destination: PathBuf,
    name: String,
    hash: String,
    file_key: String,
    parent: Option<DirectoryTarget>,
    status: &'static str,
    reason: String,
    recommendation: Value,
}

pub(super) struct OrganizedTransfer {
    pub source: PathBuf,
    pub signature: String,
    pub destination: DirectoryTarget,
}

impl PlanRow {
    fn json(&self) -> Value {
        json!({"source":self.source,"destination":self.destination,"destinationFolder":self.destination.parent(),"name":self.name,
            "status":self.status,"reason":self.reason,"recommendation":self.recommendation})
    }
}

impl Core {
    #[cfg(test)]
    pub(super) fn prepare(
        &mut self,
        paths: Vec<PathBuf>,
        plant: i64,
        mode: &str,
        destinations: &Value,
    ) -> Result<Value> {
        self.prepare_import(paths, plant, mode, destinations, None, false, None)
    }

    pub(super) fn prepare_import(
        &mut self,
        paths: Vec<PathBuf>,
        plant: i64,
        mode: &str,
        destinations: &Value,
        layout: Option<&str>,
        once: bool,
        previous: Option<Inventory>,
    ) -> Result<Value> {
        if !matches!(mode, "copy" | "move") {
            return Err("복사 또는 이동을 선택해 주세요.".into());
        }
        let root: String = self
            .store
            .db
            .query_row(
                "SELECT id FROM roots WHERE plant=? AND active=1",
                [plant],
                |r| r.get(0),
            )
            .optional()?
            .ok_or("화분에 관리 폴더를 먼저 연결해 주세요.")?;
        let folder = files::local(&self.store.root_path(&root)?)?;
        let root_key = files::directory_identity(&folder)?;
        let inventory = match previous {
            Some(inventory) => inventory,
            None => Inventory::collect(paths.clone(), &folder)?,
        };
        let layout = if inventory.folders == 0 {
            "recommend"
        } else {
            layout.unwrap_or("structure")
        };
        if !matches!(layout, "structure" | "recommend") {
            return Err("정리 방식을 확인해 주세요.".into());
        }
        let base = if layout == "structure" {
            let path = destinations["__base"]
                .as_str()
                .map(Path::new)
                .unwrap_or(&folder);
            DirectoryTarget::inspect(&folder, path, false)?.target
        } else {
            folder.clone()
        };
        let targets = self.folders(&root)?;
        let mut seen_sources = HashSet::new();
        let mut seen_targets = HashSet::new();
        let mut rows = Vec::new();
        for input in &inventory.files {
            let mut row = PlanRow {
                source: input.clone(),
                destination: PathBuf::new(),
                name: input
                    .file_name()
                    .unwrap_or_default()
                    .to_string_lossy()
                    .into_owned(),
                hash: String::new(),
                file_key: String::new(),
                parent: None,
                status: "choose",
                reason: "목적지 폴더를 선택해 주세요.".into(),
                recommendation: Value::Null,
            };
            let row_result: Result = (|| {
                row.source = files::local(input)?;
                if row.source.starts_with(&self.store.data)
                    || !seen_sources.insert(row.source.clone())
                    || !row.source.is_file()
                {
                    return Err("중복되거나 사용할 수 없는 파일이에요.".into());
                }
                let parent = if layout == "structure" {
                    base.join(
                        inventory.relative[&row.source]
                            .parent()
                            .unwrap_or(Path::new("")),
                    )
                } else {
                    row.recommendation =
                        intelligence::recommend(&self.store, &root, &row.source, &targets)?;
                    let chosen = destinations
                        .get(row.source.to_string_lossy().as_ref())
                        .and_then(Value::as_str)
                        .or_else(|| row.recommendation["selected"].as_str());
                    let Some(chosen) = chosen.filter(|s| !s.is_empty()) else {
                        if row.recommendation["confidence"] == "conflict" {
                            row.reason =
                                "분류 규칙이 충돌해요. 목적지를 직접 선택해 주세요.".into();
                        }
                        return Ok(());
                    };
                    PathBuf::from(chosen)
                };
                if row.source.parent() == Some(&parent) {
                    return Err("관리 루트 안의 다른 목적지 폴더를 선택해 주세요.".into());
                }
                let parent = DirectoryTarget::inspect(&folder, &parent, layout == "structure")?;
                row.destination = parent
                    .target
                    .join(row.source.file_name().ok_or("파일 이름을 확인해 주세요.")?);
                row.parent = Some(parent);
                if row.destination.exists()
                    || !seen_targets.insert(row.destination.to_string_lossy().to_lowercase())
                {
                    return Err("같은 이름이 있어 건너뛰어요.".into());
                }
                let (key, bytes) = files::read_with_identity(&row.source)?;
                row.hash = files::digest(&bytes);
                row.file_key = key;
                row.status = "ready";
                row.reason.clear();
                Ok(())
            })();
            if let Err(error) = row_result {
                row.status = "skipped";
                row.reason = error.to_string();
            }
            rows.push(row);
        }
        let id = Uuid::new_v4().to_string();
        let preview = rows
            .iter()
            .map(|row| {
                let mut value = row.json();
                value["relative"] = json!(inventory.relative.get(&row.source));
                value
            })
            .collect::<Vec<_>>();
        let value = json!({"id":id,"plant":plant,"folder":folder,"rootId":root,"created":now(),"rows":preview,
            "mode":mode,"folderImport":inventory.folders>0,"layout":layout,"base":base,"targetFolders":targets,"inventory":inventory,"once":once});
        self.plans
            .retain(|_, plan| plan.created.elapsed().as_secs() < 600);
        self.plans.insert(
            id,
            Plan {
                paths,
                plant,
                mode: mode.into(),
                root,
                root_key,
                inventory,
                layout: layout.to_owned(),
                base,
                once,
                rows,
                created: Instant::now(),
                retry_task: None,
            },
        );
        Ok(value)
    }

    pub(super) fn execute(&mut self, id: &str, cancel: &AtomicBool) -> Result<Value> {
        if self.blocked()? {
            return Err("이전 파일 정리 결과를 먼저 확인해 주세요.".into());
        }
        let plan = self
            .plans
            .remove(id)
            .filter(|plan| plan.created.elapsed().as_secs() < 600)
            .ok_or("정리 미리보기를 다시 열어 주세요.")?;
        let active =
            self.store
                .db
                .query_row("SELECT active FROM roots WHERE id=?", [&plan.root], |r| {
                    r.get::<_, bool>(0)
                })?;
        if !active {
            return Err("관리 폴더를 다시 활성화해 주세요.".into());
        }
        let parent = files::local(&self.store.root_path(&plan.root)?)?;
        if files::directory_identity(&parent)? != plan.root_key {
            return Err("연결 폴더가 바뀌었어요.".into());
        }
        let tasks = {
            let tx = self.store.db.transaction()?;
            if let Some(id) = &plan.retry_task {
                let updated = tx.execute(
                    "UPDATE task_items SET status='retried',updated=? WHERE id=?
                     AND status IN ('failed','canceled','skipped','not_moved','interrupted')",
                    params![now(), id],
                )?;
                if updated != 1 {
                    return Err("이미 처리한 작업이에요.".into());
                }
            }
            let mut ids = Vec::with_capacity(plan.rows.len());
            for row in &plan.rows {
                let mut payload = row.json();
                payload["rootId"] = json!(&plan.root);
                payload["plant"] = json!(plan.plant);
                payload["mode"] = json!(&plan.mode);
                let task = Uuid::new_v4().to_string();
                tx.execute(
                    "INSERT INTO task_items(id,batch,payload,status,created,updated) VALUES (?,?,?,'queued',?,?)",
                    params![task,id,payload.to_string(),now(),now()],
                )?;
                ids.push(task);
            }
            tx.commit()?;
            ids
        };
        let mut rows = Vec::new();
        for (mut row, task) in plan.rows.into_iter().zip(tasks) {
            if cancel.load(Ordering::Relaxed) || self.blocked()? || row.status != "ready" {
                row.status = if cancel.load(Ordering::Relaxed) {
                    "canceled"
                } else {
                    "skipped"
                };
                if row.reason.is_empty() {
                    row.reason = "작업을 중단했어요.".into();
                }
                self.store.db.execute(
                    "UPDATE task_items SET status=?,reason=?,updated=? WHERE id=?",
                    params![row.status, row.reason, now(), task],
                )?;
                let mut value = row.json();
                value["taskId"] = json!(task);
                rows.push(value);
                continue;
            }
            let op = Uuid::new_v4().to_string();
            let result: Result = (|| {
                let source = files::local(&row.source)?;
                if source.starts_with(&self.store.data) {
                    return Err("대상 파일 또는 관리 경로가 바뀌었어요.".into());
                }
                let (key, bytes) = files::read_with_identity(&source)?;
                if key != row.file_key || files::digest(&bytes) != row.hash {
                    return Err("미리보기 이후 원본이 바뀌었어요.".into());
                }
                let folder = row
                    .parent
                    .as_ref()
                    .ok_or("목적지 폴더를 확인해 주세요.")?
                    .materialize(&parent)?;
                let target = files::destination(
                    &folder.join(
                        row.destination
                            .file_name()
                            .ok_or("파일 이름을 확인해 주세요.")?,
                    ),
                )?;
                if target.exists() {
                    return Err("대상 파일 또는 관리 경로가 바뀌었어요.".into());
                }
                let staged = if plan.mode == "copy" {
                    Some(files::stage(&target, &bytes)?)
                } else {
                    None
                };
                drop(bytes);
                let from = staged.as_deref().unwrap_or(&source);
                let file_key = if staged.is_some() {
                    let (staged_key, bytes) = files::read_with_identity(from)?;
                    if files::digest(&bytes) != row.hash {
                        return Err("임시 복사본을 확인하지 못했어요.".into());
                    }
                    staged_key
                } else {
                    key
                };
                let tx = self.store.db.transaction()?;
                tx.execute("INSERT INTO ops(id,batch,plant,source,destination,hash,mode,status,created) VALUES (?,?,?,?,?,?,?,'planned',?)",
                    params![op,id,plan.plant,source.to_string_lossy(),target.to_string_lossy(),row.hash,plan.mode,now()])?;
                tx.execute(
                    "INSERT INTO op_journal VALUES (?,?,?,?,0)",
                    params![
                        op,
                        from.to_string_lossy(),
                        target.to_string_lossy(),
                        file_key
                    ],
                )?;
                tx.execute(
                    "UPDATE task_items SET status='running',operation=?,updated=? WHERE id=?",
                    params![op, now(), task],
                )?;
                tx.commit()?;
                self.transfer(
                    &op,
                    from,
                    &target,
                    &file_key,
                    &row.hash,
                    false,
                    staged.is_some(),
                )
            })();
            match result {
                Ok(()) => row.status = "completed",
                Err(error) => {
                    row.status = "skipped";
                    row.reason = error.to_string();
                }
            }
            self.store.db.execute(
                "UPDATE task_items SET status=COALESCE((SELECT CASE
                    WHEN status IN ('planned','undo_planned') THEN 'needs_review' ELSE status END
                    FROM ops WHERE id=task_items.operation),?),reason=?,updated=? WHERE id=?",
                params![row.status, row.reason, now(), task],
            )?;
            let mut value = row.json();
            value["taskId"] = json!(task);
            if row.status == "completed" {
                value["id"] = json!(op);
                self.enqueue_archive(&op, &plan.root)?;
                if !plan.once {
                    if let Err(error) = intelligence::learn(
                        &mut self.store,
                        &op,
                        &plan.root,
                        &row.source,
                        &row.destination,
                        &row.hash,
                    ) {
                        eprintln!("Windowsill routing history: {error}");
                    }
                }
            }
            rows.push(value);
        }
        // The watcher also handles changes to target roots. This keeps the result independent of event timing.
        self.archive_transfers(&plan.root)?;
        Ok(json!({"id":id,"rows":rows}))
    }

    pub(super) fn prepare_organized(
        &mut self,
        batch: &str,
        root: &str,
        transfers: Vec<OrganizedTransfer>,
    ) -> Result<()> {
        let folder = files::local(&self.store.root_path(root)?)?;
        let root_key = files::directory_identity(&folder)?;
        let plant = self.store.db.query_row(
            "SELECT COALESCE(plant,-1) FROM roots WHERE id=? AND active=1",
            [root],
            |row| row.get::<_, i64>(0),
        )?;
        let mut destinations = HashSet::new();
        let mut rows = Vec::with_capacity(transfers.len());
        for transfer in transfers {
            let name = transfer
                .source
                .file_name()
                .unwrap_or_default()
                .to_string_lossy()
                .into_owned();
            let mut row = PlanRow {
                source: transfer.source,
                destination: transfer.destination.target.join(&name),
                name,
                hash: String::new(),
                file_key: String::new(),
                parent: Some(transfer.destination),
                status: "skipped",
                reason: String::new(),
                recommendation: Value::Null,
            };
            let validation: Result = (|| {
                let source = files::local(&row.source)?;
                if !source.starts_with(&folder)
                    || files::signature(&source)? != transfer.signature
                    || source.parent() == row.destination.parent()
                    || row.destination.exists()
                    || !destinations.insert(row.destination.to_string_lossy().to_lowercase())
                {
                    return Err("원본 또는 목적지가 바뀌었어요. 다시 확인해 주세요.".into());
                }
                if let Some(target) = &row.parent {
                    target.validate(&folder)?;
                }
                let (key, bytes) = files::read_with_identity(&source)?;
                row.hash = files::digest(&bytes);
                row.file_key = key;
                row.status = "ready";
                Ok(())
            })();
            if let Err(error) = validation {
                row.reason = error.to_string();
            }
            rows.push(row);
        }
        self.plans.insert(
            batch.to_owned(),
            Plan {
                paths: Vec::new(),
                plant,
                mode: "move".into(),
                root: root.into(),
                root_key,
                inventory: Inventory::default(),
                layout: "recommend".into(),
                base: folder,
                rows,
                created: Instant::now(),
                retry_task: None,
                once: false,
            },
        );
        Ok(())
    }

    pub(super) fn retry_task(&mut self, task: &str) -> Result<Value> {
        let payload = self
            .store
            .rows(
                "SELECT payload FROM task_items WHERE id=? AND status IN
             ('failed','canceled','skipped','not_moved','interrupted')",
                [task],
            )?
            .pop()
            .ok_or("다시 진행할 작업을 선택해 주세요.")?;
        let source = super::text(&payload["source"])?;
        let plant = payload["plant"].as_i64().ok_or("화분을 확인해 주세요.")?;
        let root: String = self.store.db.query_row(
            "SELECT id FROM roots WHERE plant=? AND active=1",
            [plant],
            |r| r.get(0),
        )?;
        if payload["rootId"] != root {
            return Err("이전 작업의 관리 폴더를 다시 연결해 주세요.".into());
        }
        let mut destinations = json!({});
        destinations[source] = payload["destinationFolder"].clone();
        let value = self.prepare_import(
            vec![PathBuf::from(source)],
            plant,
            super::text(&payload["mode"])?,
            &destinations,
            None,
            false,
            None,
        )?;
        let id = super::text(&value["id"])?;
        if let Some(plan) = self.plans.get_mut(id) {
            plan.retry_task = Some(task.to_owned());
        }
        Ok(value)
    }

    pub(super) fn enqueue_archive(&self, op: &str, root: &str) -> Result<()> {
        self.store.db.execute(
            "INSERT OR IGNORE INTO aftercare(id,operation,root,kind,status,updated)
             SELECT mode||'-'||id,id,?,mode,'queued',? FROM ops WHERE id=? AND status='completed'",
            params![root, now(), op],
        )?;
        Ok(())
    }

    pub(super) fn archive_transfers(&mut self, root: &str) -> Result<()> {
        let queued: bool = self.store.db.query_row(
            "SELECT EXISTS(SELECT 1 FROM aftercare WHERE root=? AND status='queued')",
            [root],
            |r| r.get(0),
        )?;
        if !queued {
            return Ok(());
        }
        let scanned = self.store.scan(root).is_ok();
        self.store.db.execute(
            "UPDATE aftercare SET status=CASE
                WHEN (SELECT status FROM ops WHERE id=operation)='undone' THEN 'superseded'
                WHEN ? AND EXISTS(SELECT 1 FROM files f JOIN ops o ON o.id=operation
                  WHERE f.root=aftercare.root AND f.path=o.destination AND f.hash=o.hash
                    AND EXISTS (SELECT 1 FROM versions v WHERE v.file=f.id AND v.hash=f.hash))
                THEN 'completed' ELSE 'failed' END,updated=? WHERE root=? AND status='queued'",
            params![scanned, now(), root],
        )?;
        self.store.db.execute(
            "UPDATE aftercare SET reason=CASE WHEN status='failed' THEN '파일 버전을 확인하지 못했어요.' ELSE '' END
             WHERE root=?", [root],
        )?;
        Ok(())
    }

    pub(super) fn undo(&mut self, id: &str) -> Result<()> {
        if self.blocked()? {
            return Err("이전 파일 정리 결과를 먼저 확인해 주세요.".into());
        }
        let (source, destination, hash, mode, file_key): (String, String, String, String, String) =
            self.store.db.query_row(
                "SELECT o.source,o.destination,o.hash,o.mode,j.file_key FROM ops o
                 JOIN op_journal j ON j.id=o.id WHERE o.id=? AND o.status='completed'",
                [id],
                |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?, r.get(3)?, r.get(4)?)),
            )?;
        let destination = files::local(Path::new(&destination))?;
        if !matches_file(&destination, &file_key, &hash) {
            return Err("정리 후 파일이 바뀌었어요.".into());
        }
        let target = if mode == "move" {
            let original = files::destination(Path::new(&source))?;
            if original.exists() || original.starts_with(&self.store.data) {
                return Err("원래 경로에 다른 파일이 있어요.".into());
            }
            original
        } else {
            // Keep the recovered copy on the same filesystem as its original destination.
            destination.with_file_name(format!(".windowsill-recovered-{}", Uuid::new_v4()))
        };
        let tx = self.store.db.transaction()?;
        tx.execute("UPDATE ops SET status='undo_planned' WHERE id=?", [id])?;
        tx.execute(
            "UPDATE op_journal SET from_path=?,to_path=?,undo=1 WHERE id=?",
            params![destination.to_string_lossy(), target.to_string_lossy(), id],
        )?;
        tx.commit()?;
        self.transfer(id, &destination, &target, &file_key, &hash, true, false)?;
        intelligence::unlearn(&mut self.store, id)
    }

    fn transfer(
        &self,
        id: &str,
        from: &Path,
        to: &Path,
        file_key: &str,
        hash: &str,
        undo: bool,
        staged: bool,
    ) -> Result<()> {
        if !matches_file(from, file_key, hash) {
            self.set_op_status(id, "needs_review")?;
            return Err("파일이 바뀌었어요. 원본과 정리 위치를 확인해 주세요.".into());
        }
        if let Err(error) = files::move_new(from, to) {
            self.set_op_status(id, if undo { "completed" } else { "not_moved" })?;
            if staged && matches_file(from, file_key, hash) {
                let _ = std::fs::remove_file(from);
            }
            return Err(error.into());
        }
        if !matches_file(to, file_key, hash) {
            self.set_op_status(id, "needs_review")?;
            return Err("정리 결과를 확인해 주세요.".into());
        }
        self.set_op_status(id, if undo { "undone" } else { "completed" })
    }

    fn set_op_status(&self, id: &str, status: &str) -> Result<()> {
        self.store
            .db
            .execute("UPDATE ops SET status=? WHERE id=?", params![status, id])?;
        Ok(())
    }

    pub(super) fn blocked(&self) -> Result<bool> {
        Ok(self.store.db.query_row(
            "SELECT EXISTS(SELECT 1 FROM ops WHERE status IN ('prepared','planned','undo_planned','needs_review'))",
            [], |r| r.get(0),
        )?)
    }

    pub(super) fn recover(&mut self) -> Result<()> {
        let pending = self.store.rows(
            "SELECT json_object('id',o.id,'mode',o.mode,'hash',o.hash,'from',j.from_path,
              'to',j.to_path,'key',j.file_key,'undo',j.undo) FROM ops o JOIN op_journal j ON j.id=o.id
              WHERE o.status IN ('planned','undo_planned','needs_review')",
            [],
        )?;
        for row in pending {
            let from = Path::new(super::text(&row["from"])?);
            let to = Path::new(super::text(&row["to"])?);
            let key = super::text(&row["key"])?;
            let hash = super::text(&row["hash"])?;
            let undo = row["undo"] == 1;
            let from_matches = matches_file(from, key, hash);
            let to_matches = matches_file(to, key, hash);
            let from_missing = std::fs::symlink_metadata(from)
                .is_err_and(|e| e.kind() == std::io::ErrorKind::NotFound);
            let status = if to_matches && from_missing {
                if undo {
                    "undone"
                } else {
                    "completed"
                }
            } else if from_matches && !to_matches {
                if undo {
                    "completed"
                } else {
                    "not_moved"
                }
            } else {
                "needs_review"
            };
            self.set_op_status(super::text(&row["id"])?, status)?;
        }
        self.store.db.execute(
            "UPDATE task_items SET status=COALESCE((SELECT CASE
               WHEN status IN ('planned','undo_planned') THEN 'needs_review' ELSE status END
               FROM ops WHERE id=task_items.operation),'interrupted'),updated=?
             WHERE status IN ('queued','running','needs_review')",
            [now()],
        )?;
        let rows = self.store.rows(
            "SELECT json_object('operation',t.operation,'root',json_extract(t.payload,'$.rootId'))
             FROM task_items t JOIN ops o ON o.id=t.operation WHERE o.status='completed'
               AND NOT EXISTS (SELECT 1 FROM aftercare a WHERE a.operation=o.id)",
            [],
        )?;
        let mut roots = HashSet::new();
        for row in rows {
            let root = super::text(&row["root"])?;
            self.enqueue_archive(super::text(&row["operation"])?, root)?;
            roots.insert(root.to_owned());
        }
        for root in roots {
            self.archive_transfers(&root)?;
        }
        Ok(())
    }
}

fn matches_file(path: &Path, key: &str, digest: &str) -> bool {
    files::read_with_identity(path)
        .is_ok_and(|(actual, bytes)| actual == key && files::digest(&bytes) == digest)
}
