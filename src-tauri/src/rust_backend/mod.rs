mod archive_location;
mod diagnostics;
mod files;
mod folder_import;
mod fonts;
mod intelligence;
mod legacy;
mod legacy_extras;
mod organize_policy;
mod organizer;
mod record_deletion;
mod store;
mod theme_gallery;
mod theme_package;
mod themes;
mod workflow;

use crate::desktop;
use diagnostics::{Diagnostics, Event as DiagnosticEvent};
use notify::{EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use rusqlite::params;
use serde_json::{json, Value};
use std::{
    collections::{HashMap, HashSet},
    env, fs,
    path::{Path, PathBuf},
    sync::{
        atomic::{AtomicBool, Ordering},
        mpsc, Arc, Mutex, Weak,
    },
    thread,
    time::{Duration, Instant},
};
use store::{now, Store};
use tauri::{AppHandle, Manager};
use uuid::Uuid;

type Result<T = ()> = std::result::Result<T, Box<dyn std::error::Error + Send + Sync>>;
const GIB: u64 = 1024 * 1024 * 1024;

pub struct Backend {
    app: AppHandle,
    core: Mutex<Core>,
    archive_work: Mutex<()>,
    watcher: Mutex<RecommendedWatcher>,
    scan_wake: mpsc::SyncSender<Vec<PathBuf>>,
    initial_scans: Mutex<InitialScans>,
    cancelling: AtomicBool,
    transferring: AtomicBool,
    deleting: AtomicBool,
    organizing: Mutex<Option<String>>,
    gallery: Mutex<theme_gallery::Gallery>,
    gallery_status: Mutex<Value>,
}

struct Preview {
    path: PathBuf,
    identity: String,
    plant: Option<i64>,
    name: Option<String>,
    time: Instant,
}
struct Core {
    store: Store,
    fonts: fonts::Fonts,
    diagnostics: Diagnostics,
    previews: HashMap<String, Preview>,
    archive_preview: Option<ArchivePreview>,
    plans: HashMap<String, workflow::Plan>,
    review: Option<Value>,
    tray_ready: bool,
    storage_sizes: Option<StorageSizes>,
}

#[derive(Default)]
struct InitialScans {
    queued: HashSet<String>,
    progress: HashMap<String, store::ScanProgress>,
    errors: HashMap<String, String>,
}

struct ArchivePreview {
    token: String,
    path: PathBuf,
    identity: String,
    created: Instant,
}

#[derive(Clone, Copy)]
struct StorageSizes {
    repo: u64,
    archives: u64,
    checked: i64,
}

fn storage_sizes(archive: &Path) -> Result<StorageSizes> {
    let repo = files::tree_size(archive)?;
    let mut archives = repo;
    let directory = archive
        .parent()
        .ok_or("버전 보관소 경로를 확인해 주세요.")?;
    for entry in fs::read_dir(directory)? {
        let path = entry?.path();
        if path != archive {
            archives = archives.saturating_add(files::tree_size(&path)?);
        }
    }
    Ok(StorageSizes {
        repo,
        archives,
        checked: now(),
    })
}

fn uses_archive(method: &str, command: Option<&str>) -> bool {
    if method == "manage" {
        return !matches!(
            command,
            Some(
                "dashboard"
                    | "storage"
                    | "storage-pick-directory"
                    | "files"
                    | "browseFolders"
                    | "attention-files"
                    | "timeline"
                    | "organize-list"
                    | "organize-page"
                    | "organize-policy"
                    | "rootOrder"
                    | "shortcut"
                    | "confirmRoot"
            )
        );
    }
    matches!(
        method,
        "drop" | "revise" | "execute" | "undo" | "recover" | "taskRetry"
    )
}

impl Backend {
    pub fn start(app: &AppHandle) -> std::result::Result<(), Box<dyn std::error::Error>> {
        let data = match env::var_os("WINDOWSILL_TEST_DATA_DIR").filter(|path| !path.is_empty()) {
            Some(path) => std::path::absolute(path)?,
            None => app.path().app_local_data_dir()?.join("garden-rust"),
        };
        let mut store = Store::open(data).map_err(|e| std::io::Error::other(e.to_string()))?;
        if let Some(source) =
            env::var_os("WINDOWSILL_IMPORT_NODE_DATA_DIR").filter(|path| !path.is_empty())
        {
            let source = std::path::absolute(source)?;
            store
                .import_legacy(&source)
                .map_err(|e| std::io::Error::other(e.to_string()))?;
        }
        let (sender, events) = mpsc::sync_channel(64);
        let scan_wake = sender.clone();
        let watcher = notify::recommended_watcher(move |res: notify::Result<notify::Event>| {
            if let Ok(event) = res {
                if matches!(
                    event.kind,
                    EventKind::Create(_)
                        | EventKind::Modify(_)
                        | EventKind::Remove(_)
                        | EventKind::Any
                ) {
                    let _ = sender.try_send(event.paths);
                }
            }
        })?;
        let mut diagnostics = Diagnostics::new();
        diagnostics.record(&store, DiagnosticEvent::Start);
        let gallery = theme_gallery::Gallery::default();
        let backend = Arc::new(Self {
            app: app.clone(),
            core: Mutex::new(Core {
                store,
                fonts: fonts::Fonts::default(),
                diagnostics,
                previews: HashMap::new(),
                archive_preview: None,
                plans: HashMap::new(),
                review: None,
                tray_ready: false,
                storage_sizes: None,
            }),
            archive_work: Mutex::new(()),
            watcher: Mutex::new(watcher),
            scan_wake,
            initial_scans: Mutex::new(InitialScans::default()),
            cancelling: AtomicBool::new(false),
            transferring: AtomicBool::new(false),
            deleting: AtomicBool::new(false),
            organizing: Mutex::new(None),
            gallery_status: Mutex::new(gallery.status()),
            gallery: Mutex::new(gallery),
        });
        app.manage(Arc::clone(&backend));
        let roots = {
            let mut core = backend.core.lock().unwrap();
            core.recover()
                .map_err(|e| std::io::Error::other(e.to_string()))?;
            organizer::recover(&core.store).map_err(|e| std::io::Error::other(e.to_string()))?;
            core.store
                .roots()
                .map_err(|e| std::io::Error::other(e.to_string()))?
        };
        for root in roots.iter().filter(|root| root["active"] == true) {
            if let Some(path) = root["path"].as_str() {
                backend.watch(Path::new(path));
                if root["scanned"] == 0 {
                    if let Some(id) = root["id"].as_str() {
                        backend.queue_initial_scan(id, Path::new(path));
                    }
                }
            }
        }
        backend.send("tray", json!({"title":"작은 창틀","manager":"작은 창틀 열기","widget":"창틀 정리 모드","hide":"창틀 숨기기","quit":"종료"}));
        backend.show_manager("garden");
        {
            let core = backend.core.lock().unwrap();
            backend
                .show_widget(&core.store, true, false, false)
                .map_err(|e| std::io::Error::other(e.to_string()))?;
        }
        let background = Arc::downgrade(&backend);
        thread::spawn(move || watch_loop(background, events));
        Ok(())
    }

    fn send(&self, operation: &str, payload: Value) {
        desktop::dispatch(&self.app, None, operation.into(), payload);
    }
    fn changed(&self) {
        self.send("changed", Value::Null);
    }
    fn show_manager(&self, route: &str) {
        self.send("manager", json!({"route":route,"title":"작은 창틀"}));
    }

    fn show_widget(&self, store: &Store, show: bool, focus: bool, adjust: bool) -> Result<()> {
        let count = store
            .get("visiblePlants", json!(3))?
            .as_i64()
            .unwrap_or(3)
            .clamp(1, 3);
        let mut bounds = store.get("widgetBounds", json!({}))?;
        if !bounds.is_object() {
            bounds = json!({});
        }
        if adjust || bounds["width"].is_null() {
            bounds["width"] = json!(54 + 42 * count);
        }
        if adjust || bounds["height"].is_null() {
            bounds["height"] = json!(100);
        }
        self.send("widget", json!({"title":"작은 창틀 · 정원","bounds":bounds,"minWidth":62+26*count,"show":show,"focus":focus,"adjust":adjust}));
        Ok(())
    }

    fn watch(&self, path: &Path) {
        if let Err(error) = self
            .watcher
            .lock()
            .unwrap()
            .watch(path, RecursiveMode::Recursive)
        {
            eprintln!("Windowsill folder watcher: {error}");
        }
    }

    fn queue_initial_scan(&self, id: &str, path: &Path) {
        let mut scans = self.initial_scans.lock().unwrap();
        scans.errors.remove(id);
        scans.queued.insert(id.to_owned());
        let _ = self.scan_wake.try_send(vec![path.to_owned()]);
    }

    pub fn event(&self, event: &str, payload: Value) {
        let Some(backend) = self
            .app
            .try_state::<Arc<Self>>()
            .map(|state| state.inner().clone())
        else {
            return;
        };
        let event = event.to_owned();
        tauri::async_runtime::spawn_blocking(move || {
            let mut core = backend.core.lock().unwrap();
            let result: Result = match event.as_str() {
                "activate" => {
                    backend.send("click-through", json!(false));
                    backend.show_manager("garden");
                    Ok(())
                }
                "manager" => {
                    backend.show_manager("garden");
                    Ok(())
                }
                "help" | "files" => {
                    backend.show_manager(&event);
                    Ok(())
                }
                "widget" => backend.show_widget(&core.store, true, true, false),
                "reset" => backend.show_widget(&core.store, true, false, true),
                "view" => {
                    backend.send("click-through", json!(true));
                    Ok(())
                }
                "hide" => {
                    backend.send("hide-widget", Value::Null);
                    Ok(())
                }
                "quit" => {
                    backend.app.exit(0);
                    Ok(())
                }
                "tray-ready" => {
                    core.tray_ready = payload == true;
                    backend.changed();
                    Ok(())
                }
                "widget-bounds" => core.store.set("widgetBounds", &payload),
                "manager-closed" => {
                    core.diagnostics.close_review();
                    Ok(())
                }
                _ => Ok(()),
            };
            if let Err(error) = result {
                eprintln!("Windowsill desktop event: {error}");
            }
        });
    }

    fn move_storage(&self, sender: &str, token: &Value) -> Result<Value> {
        if sender != "manager" {
            return Err("관리 화면에서 이용해 주세요.".into());
        }
        let token = text(token)?;
        let preview = {
            let mut core = self.core.lock().unwrap();
            if !core.archive_preview.as_ref().is_some_and(|preview| {
                preview.token == token && preview.created.elapsed() < Duration::from_secs(600)
            }) {
                return Err("보관 위치를 다시 선택해 주세요.".into());
            }
            core.archive_preview.take().unwrap()
        };
        let _archive = self.archive_work.lock().unwrap();
        let (data, archive) = {
            let core = self.core.lock().unwrap();
            (core.store.data.clone(), core.store.repo.path().to_owned())
        };
        let staged = Store::open_scanner(data.clone(), &archive)?
            .stage_archive(&preview.path, &preview.identity)?;
        let target = {
            let mut core = self.core.lock().unwrap();
            core.store.activate_archive(staged)?;
            core.storage_sizes = None;
            core.store.repo.path().to_owned()
        };
        if let Err(error) =
            Store::open_scanner(data, &target).and_then(|store| store.finish_archive_cleanup())
        {
            eprintln!("Windowsill archive move cleanup: {error}");
        }
        let sizes = storage_sizes(&target).ok();
        let mut core = self.core.lock().unwrap();
        core.storage_sizes = sizes;
        self.changed();
        core.storage()
    }

    pub async fn call(
        &self,
        window: &str,
        method: &str,
        args: Vec<Value>,
    ) -> std::result::Result<Value, String> {
        if method == "cancel" {
            if window == "manager" && self.transferring.load(Ordering::SeqCst) {
                self.cancelling.store(true, Ordering::SeqCst);
            }
            return Ok(json!({"ok":true,"value":true}));
        }
        if window == "manager"
            && method == "manage"
            && args
                .first()
                .is_some_and(|command| *command == "organize-pause")
            && args
                .get(1)
                .and_then(Value::as_str)
                .is_some_and(|id| self.organizing.lock().unwrap().as_deref() == Some(id))
        {
            self.cancelling.store(true, Ordering::SeqCst);
            return Ok(json!({"ok":true,"value":true}));
        }
        let backend = self.app.state::<Arc<Self>>().inner().clone();
        let sender = window.to_owned();
        let method = method.to_owned();
        tauri::async_runtime::spawn_blocking(move || {
            if method == "manage"
                && args
                    .first()
                    .is_some_and(|command| command == "storage-move")
            {
                return match backend.move_storage(&sender, args.get(1).unwrap_or(&Value::Null)) {
                    Ok(value) => json!({"ok":true,"value":value}),
                    Err(error) => json!({"ok":false,"error":error.to_string()}),
                };
            }
            if method == "themes"
                && args
                    .first()
                    .is_some_and(|command| theme_gallery::handles(command, args.get(2)))
            {
                return match backend.gallery_call(&sender, &args) {
                    Ok(result) => json!({"ok":true,"value":result}),
                    Err(error) => json!({"ok":false,"error":error.to_string()}),
                };
            }
            // Archive writers take this lock before the UI state lock.
            let _archive = uses_archive(&method, args.first().and_then(Value::as_str))
                .then(|| backend.archive_work.lock().unwrap());
            let mut core = backend.core.lock().unwrap();
            match backend.invoke(&mut core, &sender, &method, &args) {
                Ok(value) => json!({"ok":true,"value":value}),
                Err(error) => {
                    let Core {
                        diagnostics, store, ..
                    } = &mut *core;
                    if !matches!(method.as_str(), "state" | "diagnostics") {
                        diagnostics.record(store, DiagnosticEvent::InvokeFailure);
                    }
                    json!({"ok":false,"error":error.to_string()})
                }
            }
        })
        .await
        .map_err(|e| e.to_string())
    }

    pub fn stop(&self) {
        if let Ok(mut core) = self.core.try_lock() {
            let Core {
                diagnostics, store, ..
            } = &mut *core;
            diagnostics.record(store, DiagnosticEvent::Quit);
        }
    }

    fn dialog(&self, sender: &str, action: &str, mut options: Value) -> Result<Option<PathBuf>> {
        options["sender"] = json!(sender);
        let result =
            desktop::request(&self.app, action, options).map_err(|error| error.to_string())?;
        Ok(result.as_str().map(PathBuf::from))
    }

    fn gallery_call(&self, sender: &str, args: &[Value]) -> Result<Value> {
        if sender != "manager" {
            return Err("관리 화면에서 이용해 주세요.".into());
        }
        let command = text(&args[0])?;
        let id = args.get(1).unwrap_or(&Value::Null);
        let options = args.get(2).unwrap_or(&Value::Null);
        let mut gallery = self.gallery.lock().unwrap();
        let path = if command == "upload" {
            if id != true || !gallery.signed_in() {
                return Err("로그인과 공유 권한을 확인해 주세요.".into());
            }
            self.dialog(
                sender,
                "open-dialog",
                json!({
                    "title":"공유할 테마 선택","properties":["openFile"],
                    "filters":[{"name":"창틀 테마","extensions":["silltheme","zip"]}],
                }),
            )?
        } else {
            None
        };
        let response = gallery.call(command, id, options, path.as_deref());
        let status = gallery.status();
        *self.gallery_status.lock().unwrap() = status.clone();
        drop(gallery);
        let mut core = self.core.lock().unwrap();
        response?.finish(&mut core.store, &status)
    }

    fn run_organization(&self, id: String, analyze: bool) {
        let backend = self.app.state::<Arc<Self>>().inner().clone();
        self.cancelling.store(false, Ordering::SeqCst);
        self.transferring.store(true, Ordering::SeqCst);
        *self.organizing.lock().unwrap() = Some(id.clone());
        tauri::async_runtime::spawn_blocking(move || {
            let result: Result = if analyze {
                let mut core = backend.core.lock().unwrap();
                organizer::build_review(&mut core.store, &id, &backend.cancelling)
            } else {
                loop {
                    let result = {
                        let _archive = backend.archive_work.lock().unwrap();
                        let mut core = backend.core.lock().unwrap();
                        organizer::run_batch(&mut core, &id, &backend.cancelling)
                    };
                    match result {
                        Ok(true) => {
                            backend.changed();
                            thread::yield_now();
                        }
                        Ok(false) => break Ok(()),
                        Err(error) => break Err(error),
                    }
                }
            };
            if let Err(err) = result {
                let core = backend.core.lock().unwrap();
                let _ = organizer::recover(&core.store);
                let _ = core.store.db.execute(
                    "UPDATE organize_jobs SET state='failed',error=?,updated=? WHERE id=?",
                    params![err.to_string(), now(), id],
                );
            }
            *backend.organizing.lock().unwrap() = None;
            backend.transferring.store(false, Ordering::SeqCst);
            backend.changed();
        });
    }

    fn run_delete(&self, kind: String, id: String, folder: Option<PathBuf>) {
        let backend = self.app.state::<Arc<Self>>().inner().clone();
        self.deleting.store(true, Ordering::SeqCst);
        tauri::async_runtime::spawn_blocking(move || {
            let _archive = backend.archive_work.lock().unwrap();
            let mut core = backend.core.lock().unwrap();
            let result = core.store.delete_records(&kind, &id);
            core.plans.clear();
            core.review = None;
            if let Err(error) = result {
                let job = core
                    .store
                    .get("recordJob", Value::Null)
                    .unwrap_or(Value::Null);
                if job["cleanupPending"] != true {
                    let _ = core.store.set(
                        "recordJob",
                        &json!({"phase":"failed","error":error.to_string()}),
                    );
                }
            } else {
                core.storage_sizes = storage_sizes(core.store.repo.path()).ok();
                if let Some(folder) = folder {
                    let _ = backend.watcher.lock().unwrap().unwatch(&folder);
                    let mut scans = backend.initial_scans.lock().unwrap();
                    scans.queued.remove(&id);
                    scans.progress.remove(&id);
                    scans.errors.remove(&id);
                }
            }
            backend.deleting.store(false, Ordering::SeqCst);
            backend.changed();
        });
    }

    fn invoke(&self, core: &mut Core, sender: &str, method: &str, args: &[Value]) -> Result<Value> {
        let first = args.first().unwrap_or(&Value::Null);
        let second = args.get(1).unwrap_or(&Value::Null);
        if self.deleting.load(Ordering::SeqCst)
            && matches!(
                method,
                "execute" | "undo" | "drop" | "revise" | "taskRetry" | "recover" | "bind"
            )
        {
            return Err("관리 기록을 삭제하고 있어요. 잠시 기다려 주세요.".into());
        }
        match method {
            "state" => {
                let mut value = core.state(&self.app.package_info().version.to_string())?;
                if let Some(roots) = value["managed"]["roots"].as_array_mut() {
                    let scans = self.initial_scans.lock().unwrap();
                    for root in roots.iter_mut().filter(|root| root["active"] == true) {
                        let Some(id) = root["id"].as_str() else {
                            continue;
                        };
                        if scans.queued.contains(id) {
                            let progress = scans.progress.get(id).copied();
                            root["status"] = json!("initial");
                            root["total_known"] =
                                json!(progress.is_some_and(|p| p.complete_listing));
                            if let Some(progress) = progress {
                                root["total"] = json!(progress.total);
                                root["processed"] = json!(progress.processed);
                            }
                        } else if let Some(error) = scans.errors.get(id) {
                            let first_scan = root["scanned"] == 0;
                            root["status"] = json!("unavailable");
                            root["error"] = json!(error);
                            if first_scan {
                                root["total_known"] = json!(0);
                            }
                        }
                    }
                }
                value["managed"]["deleting"] = json!(self.deleting.load(Ordering::SeqCst));
                value["busy"] = json!(
                    self.transferring.load(Ordering::SeqCst)
                        && self.organizing.lock().unwrap().is_none()
                );
                Ok(value)
            }
            "manage" => self.manage(
                core,
                sender,
                text(first)?,
                args.get(1..).unwrap_or_default(),
            ),
            "themes" => {
                if sender != "manager" && first != "active" {
                    return Err("관리 화면에서 이용해 주세요.".into());
                }
                if first == "import" {
                    let path = self.dialog(
                        sender,
                        "open-dialog",
                        json!({
                            "title":"받은 테마 파일 설치","properties":["openFile"],
                            "filters":[{"name":"창틀 테마","extensions":["silltheme","zip"]}],
                        }),
                    )?;
                    let result = match path {
                        Some(path) => themes::install(&core.store, &themes::read_package(&path)?),
                        None => themes::catalog(&core.store),
                    }?;
                    return Ok(theme_gallery::combine(
                        result,
                        &self.gallery_status.lock().unwrap(),
                    ));
                }
                let result = themes::call(
                    &mut core.store,
                    text(first)?,
                    second,
                    args.get(2).unwrap_or(&Value::Null),
                )?;
                if matches!(
                    first.as_str(),
                    Some("apply" | "activate" | "undo" | "remove")
                ) {
                    self.changed();
                }
                Ok(if result.get("builtins").is_some() {
                    theme_gallery::combine(result, &self.gallery_status.lock().unwrap())
                } else {
                    result
                })
            }
            "font" if first == "read" => fonts::Fonts::read(&core.store),
            "font" if sender == "manager" => {
                let result = match text(first)? {
                    "pick" => {
                        let path = self.dialog(sender, "open-dialog", json!({
                            "title":"앱에서 사용할 폰트 선택",
                            "properties":["openFile"],
                            "filters":[{"name":"폰트","extensions":["ttf","otf","woff","woff2"]}]
                        }))?;
                        return match path {
                            Some(path) => core.fonts.stage(&path),
                            None => Ok(Value::Null),
                        };
                    }
                    "install" => core.fonts.install(&core.store, text(second)?)?,
                    "reset" => core.fonts.reset(&core.store)?,
                    _ => return Err("알 수 없는 폰트 요청이에요.".into()),
                };
                self.changed();
                Ok(result)
            }
            "diagnostics" => match text(first)? {
                "renderer-error" | "renderer-rejection" => {
                    let event = if first == "renderer-error" {
                        DiagnosticEvent::RendererError
                    } else {
                        DiagnosticEvent::RendererRejection
                    };
                    core.diagnostics.record(&core.store, event);
                    Ok(json!(true))
                }
                "preview" if sender == "manager" => core.diagnostics.preview(&core.store),
                "export" if sender == "manager" => {
                    let token = text(second)?;
                    core.diagnostics.validate(token)?;
                    let path = self.dialog(
                        sender,
                        "save-dialog",
                        json!({
                            "title":"진단 파일 저장",
                            "defaultPath":format!("windowsill-diagnostics-{token}.json"),
                            "filters":[{"name":"JSON","extensions":["json"]}],
                        }),
                    )?;
                    match path {
                        Some(path) => core.diagnostics.save(&core.store, token, &path),
                        None => Ok(json!({"saved":false})),
                    }
                }
                _ => Err("관리 화면에서 이용해 주세요.".into()),
            },
            "widgetMenu" if sender == "widget" => {
                self.send("widget-menu", json!({"manager":"정원 관리 · 파일 정리","help":"사용 안내","hint":"크기: 왼쪽 위 모서리를 드래그","reset":"작은 기본 크기로","view":"클릭 통과로 감상하기","hide":"창틀 숨기기","quit":"종료"}));
                Ok(json!(true))
            }
            "bind" => {
                let plant = first
                    .as_i64()
                    .filter(|value| (-1..=2).contains(value))
                    .ok_or("화분을 선택해 주세요.")?;
                let Some(path) = self.dialog(
                    sender,
                    "open-dialog",
                    json!({"title":"화분에 연결할 폴더 선택","properties":["openDirectory"]}),
                )?
                else {
                    return Ok(Value::Null);
                };
                let path = files::local(&path)?;
                if !path.is_dir()
                    || path.parent().is_none()
                    || path.starts_with(&core.store.data)
                    || core.store.data.starts_with(&path)
                {
                    return Err("일반 로컬 폴더를 선택해 주세요.".into());
                }
                let index = files::tree(&path)?;
                let bytes: u64 = index
                    .files
                    .iter()
                    .filter_map(|p| fs::metadata(p).ok().map(|m| m.len()))
                    .sum();
                let token = Uuid::new_v4().to_string();
                let name = second
                    .as_str()
                    .filter(|name| !name.trim().is_empty())
                    .map(str::to_owned);
                core.previews
                    .retain(|_, preview| preview.time.elapsed().as_secs() < 600);
                core.previews.insert(
                    token.clone(),
                    Preview {
                        path: path.clone(),
                        identity: files::directory_identity(&path)?,
                        plant: (plant >= 0).then_some(plant),
                        name,
                        time: Instant::now(),
                    },
                );
                Ok(
                    json!({"folder":path,"token":token,"plant":plant,"name":second,"count":index.files.len(),"bytes":bytes,
                        "excluded":index.issues.len(),"issues":index.issues.iter().take(15).map(|(path, reason)| json!({"path":path,"reason":reason})).collect::<Vec<_>>(),
                        "complete":index.complete,"gitReady":true}),
                )
            }
            "renamePlant" => {
                let id = first
                    .as_i64()
                    .filter(|id| (0..=2).contains(id))
                    .ok_or("화분을 선택해 주세요.")?;
                let name = text(second)?.trim();
                if name.is_empty() || name.chars().count() > 12 {
                    return Err("화분 이름은 1~12자로 입력해 주세요.".into());
                }
                core.store
                    .db
                    .execute("UPDATE plants SET name=? WHERE id=?", params![name, id])?;
                self.changed();
                core.state(&self.app.package_info().version.to_string())
            }
            "drop" => {
                let files: Vec<PathBuf> = serde_json::from_value(first.clone())?;
                let plant = second
                    .as_i64()
                    .filter(|id| (0..=2).contains(id))
                    .ok_or("화분을 선택해 주세요.")?;
                let value =
                    core.prepare_import(files, plant, "copy", &Value::Null, None, false, None)?;
                if sender == "widget" {
                    core.review = Some(value);
                    self.show_manager("files");
                    Ok(Value::Null)
                } else {
                    Ok(value)
                }
            }
            "takeReview" => Ok(if sender == "manager" {
                core.review.take().unwrap_or(Value::Null)
            } else {
                Value::Null
            }),
            "revise" => {
                let id = text(first)?;
                let old = core.plans.get(id).ok_or("파일을 다시 선택해 주세요.")?;
                let (paths, plant, retry_task, inventory) = (
                    old.paths.clone(),
                    old.plant,
                    old.retry_task.clone(),
                    old.inventory.clone(),
                );
                let layout = args
                    .get(4)
                    .and_then(Value::as_str)
                    .unwrap_or(&old.layout)
                    .to_owned();
                let once = args.get(3).is_some_and(|value| *value == true);
                let mut destinations = args
                    .get(2)
                    .filter(|value| value.is_object())
                    .cloned()
                    .ok_or("목적지를 확인해 주세요.")?;
                if layout == "structure" && destinations["__base"].is_null() {
                    destinations["__base"] = json!(old.base);
                }
                let value = core.prepare_import(
                    paths,
                    plant,
                    text(second)?,
                    &destinations,
                    Some(&layout),
                    once,
                    Some(inventory),
                )?;
                if let Some(plan) = core.plans.get_mut(text(&value["id"])?) {
                    plan.retry_task = retry_task;
                }
                core.plans.remove(id);
                Ok(value)
            }
            "taskRetry" if sender == "manager" => core.retry_task(text(first)?),
            "execute" => {
                let id = text(first)?;
                if self.transferring.load(Ordering::SeqCst) {
                    return Err("진행 중인 정리를 먼저 멈춰 주세요.".into());
                }
                self.cancelling.store(false, Ordering::SeqCst);
                self.transferring.store(true, Ordering::SeqCst);
                let outcome = core.execute(id, &self.cancelling);
                self.transferring.store(false, Ordering::SeqCst);
                self.changed();
                outcome
            }
            "undo" => {
                core.undo(text(first)?)?;
                self.changed();
                core.state(&self.app.package_info().version.to_string())
            }
            "recover" if sender == "manager" => {
                core.recover()?;
                self.changed();
                core.state(&self.app.package_info().version.to_string())
            }
            "pick" | "pickFolder" => Err("파일이나 폴더를 선택 창에서 가져와 주세요.".into()),
            "openFolder" => {
                let path: Option<String> = core.store.db.query_row(
                    "SELECT folder FROM plants WHERE id=?",
                    [first.as_i64().unwrap_or(-1)],
                    |r| r.get(0),
                )?;
                if let Some(path) = path {
                    desktop::request(
                        &self.app,
                        "open-path",
                        json!(files::local(Path::new(&path))?),
                    )
                    .map_err(|e| e.to_string())?;
                }
                Ok(json!(true))
            }
            "setting" => {
                let key = text(first)?;
                let value = if key == "uiLabels" {
                    validate_labels(second)?
                } else {
                    if !valid_setting(key, second) {
                        return Err("설정 값을 확인해 주세요.".into());
                    }
                    second.clone()
                };
                core.store.set(key, &value)?;
                if key == "visiblePlants" {
                    self.show_widget(&core.store, false, false, true)?;
                }
                self.changed();
                core.state(&self.app.package_info().version.to_string())
            }
            "manager" => {
                self.show_manager(first.as_str().unwrap_or("garden"));
                Ok(json!(true))
            }
            "widget" => {
                self.show_widget(&core.store, true, true, false)?;
                Ok(json!(true))
            }
            "view" if core.tray_ready => {
                self.send("click-through", json!(first == true));
                Ok(json!(true))
            }
            "quit" => {
                self.app.exit(0);
                Ok(json!(true))
            }
            _ => Err("지원하지 않는 요청이에요.".into()),
        }
    }

    fn manage(
        &self,
        core: &mut Core,
        sender: &str,
        command: &str,
        args: &[Value],
    ) -> Result<Value> {
        let a = args.first().unwrap_or(&Value::Null);
        let b = args.get(1).unwrap_or(&Value::Null);
        let c = args.get(2).unwrap_or(&Value::Null);
        match command {
            "dashboard" => core.dashboard(),
            "storage" => core.storage(),
            "guide" => {
                if !a["step"].as_u64().is_some_and(|step| step <= 5)
                    || !matches!(
                        a["status"].as_str(),
                        Some("not_started" | "in_progress" | "deferred" | "completed")
                    )
                {
                    return Err("안내 진행을 확인해 주세요.".into());
                }
                core.store.set("guide", a)?;
                core.store.set("onboarded", &json!(true))?;
                self.changed();
                Ok(json!(true))
            }
            "confirmRoot" => {
                if self.deleting.load(Ordering::SeqCst) {
                    return Err("관리 기록을 삭제하고 있어요. 잠시 기다려 주세요.".into());
                }
                let preview = core
                    .previews
                    .remove(text(a)?)
                    .filter(|p| p.time.elapsed().as_secs() < 600)
                    .ok_or("폴더를 다시 선택해 주세요.")?;
                if files::directory_identity(&preview.path)? != preview.identity {
                    return Err("선택한 폴더가 바뀌었어요. 다시 선택해 주세요.".into());
                }
                let id =
                    core.store
                        .register(&preview.path, preview.plant, preview.name.as_deref())?;
                self.watch(&preview.path);
                self.queue_initial_scan(&id, &preview.path);
                self.changed();
                Ok(json!({"id":id,"path":preview.path}))
            }
            "rootOrder" => {
                let order = a
                    .as_array()
                    .filter(|values| values.len() <= 10000)
                    .ok_or("관리 폴더 순서를 확인해 주세요.")?;
                let roots = core.store.roots()?;
                let available: Vec<&str> = roots
                    .iter()
                    .filter_map(|root| root["id"].as_str())
                    .collect();
                let mut seen = HashSet::new();
                let mut result = Vec::with_capacity(available.len());
                for id in order {
                    let id = text(id)?;
                    if !available.contains(&id) || !seen.insert(id) {
                        return Err("관리 폴더 순서를 확인해 주세요.".into());
                    }
                    result.push(id);
                }
                result.extend(available.into_iter().filter(|id| !seen.contains(id)));
                let result = json!(result);
                core.store.set("managedRootOrder", &result)?;
                self.changed();
                Ok(result)
            }
            "shortcut" => {
                if self.deleting.load(Ordering::SeqCst) {
                    return Err("관리 기록을 삭제하고 있어요. 잠시 기다려 주세요.".into());
                }
                let plant = b
                    .as_i64()
                    .filter(|id| (0..=2).contains(id))
                    .ok_or("화분을 선택해 주세요.")?;
                core.store.shortcut(text(a)?, plant)?;
                self.changed();
                Ok(json!(true))
            }
            "files" => Ok(json!(core.store.list(text(a)?, b == "unmanaged")?)),
            "file-management" => {
                core.store.manage_file(text(a)?, text(b)?)?;
                self.changed();
                Ok(json!(true))
            }
            "attention-files" => {
                let root = text(a)?;
                let mut entries = core.store.list(root, true)?;
                for entry in &mut entries {
                    entry["kind"] = json!("file");
                    entry["reason"] = json!("사용자가 자동 관리를 해제했어요.");
                }
                entries.extend(core.store.rows(
                    "SELECT json_object('path',path,'kind','file','reason',reason,'management','') FROM scan_issues WHERE root=? ORDER BY path", [root],
                )?);
                Ok(json!(entries))
            }
            "organize-folders" => {
                let query = intelligence::normalize(b.as_str().unwrap_or_default());
                Ok(json!(core
                    .folders(text(a)?)?
                    .into_iter()
                    .filter(|folder| intelligence::normalize(&folder.to_string_lossy())
                        .contains(&query))
                    .take(50)
                    .collect::<Vec<_>>()))
            }
            "browseFolders" => Ok(json!(core.store.browse_folders(text(a)?)?)),
            "folders" => Ok(json!(core.folders(text(a)?)?)),
            "organize-list"
            | "organize-page"
            | "organize-policy"
            | "organize-start"
            | "organize-select"
            | "organize-destination"
            | "organize-folder-approve"
            | "organize-approve"
            | "organize-pause"
            | "organize-resume"
            | "organize-review" => {
                if sender != "manager" {
                    return Err("관리 화면에서 이용해 주세요.".into());
                }
                if matches!(
                    command,
                    "organize-start" | "organize-approve" | "organize-resume" | "organize-review"
                ) && self.transferring.load(Ordering::SeqCst)
                {
                    return Err("진행 중인 정리를 먼저 멈춰 주세요.".into());
                }
                if command == "organize-approve" && core.blocked()? {
                    return Err("이전 파일 정리 결과를 먼저 확인해 주세요.".into());
                }
                let value = organizer::call(&mut core.store, command, a, b)?;
                match command {
                    "organize-start" => self.run_organization(text(&value)?.to_owned(), true),
                    "organize-approve" => self.run_organization(text(a)?.to_owned(), false),
                    "organize-resume" | "organize-review" if value["resume"] == "indexing" => {
                        self.run_organization(text(a)?.to_owned(), true)
                    }
                    _ => {}
                }
                if !matches!(
                    command,
                    "organize-list" | "organize-page" | "organize-policy"
                ) {
                    self.changed();
                }
                Ok(value)
            }
            "timeline" => core.store.timeline(text(a)?),
            "compareVersions" => core.store.diff(text(a)?, text(b)?, text(c)?),
            "scan" => {
                core.store.scan(text(a)?)?;
                self.changed();
                Ok(json!(true))
            }
            "retry" => {
                core.recover()?;
                core.store.finish_archive_cleanup()?;
                for root in core
                    .store
                    .roots()?
                    .into_iter()
                    .filter(|root| root["active"] == true)
                {
                    let id = text(&root["id"])?;
                    self.watch(&core.store.root_path(id)?);
                    core.store.scan(id)?;
                }
                self.changed();
                Ok(json!(true))
            }
            "delete-records" if sender == "manager" => {
                if self.transferring.load(Ordering::SeqCst)
                    || self.deleting.load(Ordering::SeqCst)
                    || core.blocked()?
                {
                    return Err("진행 중인 정리를 마친 뒤 기록을 삭제해 주세요.".into());
                }
                let kind = text(a)?;
                let id = text(b)?;
                if !matches!(kind, "root" | "file") {
                    return Err("삭제할 관리 기록을 다시 선택해 주세요.".into());
                }
                let folder = (kind == "root")
                    .then(|| core.store.root_path(id))
                    .transpose()?;
                core.store.finish_archive_cleanup()?;
                core.store.set("recordJob", &json!({"phase":"queued"}))?;
                self.run_delete(kind.to_owned(), id.to_owned(), folder);
                self.changed();
                Ok(json!({"accepted":true}))
            }
            "aftercare-retry" => {
                let id = text(a)?;
                let root: String = core.store.db.query_row(
                    "SELECT root FROM aftercare WHERE id=? AND status='failed'",
                    [id],
                    |r| r.get(0),
                )?;
                core.store.db.execute(
                    "UPDATE aftercare SET status='queued',reason='',updated=? WHERE id=?",
                    params![now(), id],
                )?;
                core.archive_transfers(&root)?;
                self.changed();
                Ok(json!(true))
            }
            "tutorial" => {
                let mut tutorial = core.store.get("tutorial", Value::Null)?;
                match text(a)? {
                    "start" => {
                        let baseline = core.store.rows(
                            "SELECT json_quote(id) FROM ops ORDER BY created DESC LIMIT 200",
                            [],
                        )?;
                        tutorial = json!({"status":"active","startedAt":now(),"baseline":baseline});
                    }
                    "skip" | "finish" if tutorial["status"] == "active" => {
                        if a == "finish" {
                            let completed: bool = core.store.db.query_row(
                                "SELECT EXISTS(SELECT 1 FROM ops o JOIN aftercare a ON a.operation=o.id
                                  WHERE o.status='completed' AND a.status='completed' AND o.created>=?
                                  AND NOT EXISTS(SELECT 1 FROM json_each(?) WHERE value=o.id))",
                                params![tutorial["startedAt"].as_i64(), tutorial["baseline"].to_string()], |r| r.get(0),
                            )?;
                            if !completed {
                                return Err(
                                    "파일 전달과 버전 보관이 끝난 뒤 완료할 수 있어요.".into()
                                );
                            }
                        }
                        tutorial["status"] = json!(if a == "finish" {
                            "completed"
                        } else {
                            "skipped"
                        });
                    }
                    _ => return Err("안내 진행을 확인해 주세요.".into()),
                }
                core.store.set("tutorial", &tutorial)?;
                core.store
                    .set("guide", &json!({"step":0,"status":"completed","version":1}))?;
                core.store.set("onboarded", &json!(true))?;
                self.changed();
                Ok(json!(true))
            }
            "restore" => {
                let (_, previous, seq, bytes) = core.store.version(text(a)?)?;
                let extension = previous
                    .extension()
                    .and_then(|e| e.to_str())
                    .map(|e| format!(".{e}"))
                    .unwrap_or_default();
                let default = previous.with_file_name(format!(
                    "{}_복원_v{seq}{extension}",
                    previous
                        .file_stem()
                        .and_then(|s| s.to_str())
                        .unwrap_or("파일")
                ));
                let Some(path) = self.dialog(
                    sender,
                    "save-dialog",
                    json!({"title":"다른 이름으로 저장","defaultPath":default}),
                )?
                else {
                    return Ok(Value::Null);
                };
                let path = files::destination(&path)?;
                if path.starts_with(&core.store.data) {
                    return Err("앱 데이터 폴더 밖에 저장해 주세요.".into());
                }
                files::publish(&path, &bytes)?;
                self.changed();
                Ok(json!({"destination":path}))
            }
            "active" => {
                let active = b.as_bool().ok_or("관리 상태를 확인해 주세요.")?;
                let id = text(a)?;
                core.store
                    .db
                    .execute("UPDATE roots SET active=? WHERE id=?", params![active, id])?;
                if active {
                    self.watch(&core.store.root_path(id)?);
                    core.store.scan(id)?;
                }
                self.changed();
                Ok(json!(true))
            }
            "storage-budget" => {
                if !a
                    .as_u64()
                    .is_some_and(|n| [1, 2, 5, 10, 20, 50].contains(&n))
                {
                    return Err("보관 용량을 확인해 주세요.".into());
                }
                core.store.set("storageBudget", a)?;
                self.changed();
                core.storage()
            }
            "storage-pick-directory" if sender == "manager" => {
                let Some(path) = self.dialog(sender, "open-dialog", json!({
                    "title":"버전을 보관할 드라이브 또는 폴더 선택", "properties":["openDirectory"]
                }))? else {
                    return Ok(Value::Null);
                };
                let path = files::local(&path)?;
                core.store.validate_archive_parent(&path)?;
                let token = Uuid::new_v4().to_string();
                core.archive_preview = Some(ArchivePreview {
                    token: token.clone(),
                    path: path.clone(),
                    identity: files::directory_identity(&path)?,
                    created: Instant::now(),
                });
                Ok(json!({"token":token,"path":path}))
            }
            "storage-compact" => {
                core.storage_sizes = Some(storage_sizes(core.store.repo.path())?);
                let before = core.storage()?;
                core.store.compact()?;
                core.storage_sizes = Some(storage_sizes(core.store.repo.path())?);
                self.changed();
                let mut after = core.storage()?;
                after["saved"] = json!(before["used"]
                    .as_u64()
                    .unwrap_or(0)
                    .saturating_sub(after["used"].as_u64().unwrap_or(0)));
                Ok(after)
            }
            "openFile" | "openFileFolder" => {
                let (path, root, hash): (String, String, String) = core.store.db.query_row(
                    "SELECT path,root,hash FROM files WHERE id=? AND (status='stored' OR ?='openFileFolder')",
                    params![text(a)?, command],
                    |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?)),
                )?;
                let path = Path::new(&path);
                let path = files::local(if command == "openFileFolder" {
                    path.parent().ok_or("폴더를 확인해 주세요.")?
                } else {
                    path
                })?;
                if !path.starts_with(files::local(&core.store.root_path(&root)?)?) {
                    return Err("관리 경로가 바뀌었어요. 폴더를 다시 확인해 주세요.".into());
                }
                if command == "openFile" && files::digest(&files::read(&path)?) != hash {
                    return Err("파일이 바뀌었어요. 지금 확인을 누른 뒤 다시 열어 주세요.".into());
                }
                desktop::request(&self.app, "open-path", json!(path)).map_err(|e| e.to_string())?;
                if command == "openFile" {
                    core.store.db.execute(
                        "INSERT OR REPLACE INTO file_opens VALUES (?,?)",
                        params![text(a)?, now()],
                    )?;
                    core.store.db.execute(
                        "DELETE FROM file_opens WHERE file NOT IN (SELECT file FROM file_opens ORDER BY opened DESC,file LIMIT 50)",
                        [],
                    )?;
                    self.changed();
                }
                Ok(json!(true))
            }
            "analyze" | "testRecommendation" | "approveRule" | "saveRouting" | "toggleRouting"
            | "exception" | "disableRule" | "resetLearning" => {
                let folders = if matches!(command, "analyze" | "testRecommendation" | "approveRule")
                {
                    core.folders(text(a)?)?
                } else {
                    Vec::new()
                };
                let value = intelligence::call(&mut core.store, command, a, b, c, &folders)?;
                if !matches!(command, "analyze" | "testRecommendation") {
                    self.changed();
                }
                Ok(value)
            }
            _ => Err("지원하지 않는 관리 요청이에요.".into()),
        }
    }
}

fn watch_loop(backend: Weak<Backend>, events: mpsc::Receiver<Vec<PathBuf>>) {
    let refresh = Duration::from_secs(60);
    let mut next_scan = Instant::now();
    loop {
        let paths = match events.recv_timeout(next_scan.saturating_duration_since(Instant::now())) {
            Ok(mut paths) => {
                thread::sleep(Duration::from_millis(650));
                for batch in events.try_iter().take(64) {
                    paths.extend(batch);
                }
                paths
            }
            Err(mpsc::RecvTimeoutError::Timeout) => Vec::new(),
            Err(mpsc::RecvTimeoutError::Disconnected) => break,
        };
        let scheduled = Instant::now() >= next_scan;
        let Some(backend) = backend.upgrade() else {
            break;
        };
        if scheduled {
            let _archive = backend.archive_work.lock().unwrap();
            let archive = {
                let core = backend.core.lock().unwrap();
                core.store.repo.path().to_owned()
            };
            if let Ok(sizes) = storage_sizes(&archive) {
                backend.core.lock().unwrap().storage_sizes = Some(sizes);
                backend.changed();
            }
        }
        let mut roots = backend
            .core
            .lock()
            .unwrap()
            .store
            .roots()
            .unwrap_or_default();
        let queued = backend.initial_scans.lock().unwrap().queued.clone();
        roots.sort_by_key(|root| !root["id"].as_str().is_some_and(|id| queued.contains(id)));
        for root in roots.iter().filter(|root| root["active"] == true) {
            let Some(folder) = root["path"].as_str().map(Path::new) else {
                continue;
            };
            let Some(id) = root["id"].as_str() else {
                continue;
            };
            if !scheduled
                && !queued.contains(id)
                && !paths.is_empty()
                && !paths
                    .iter()
                    .any(|path| path.starts_with(folder) || folder.starts_with(path))
            {
                continue;
            }
            {
                let _archive = backend.archive_work.lock().unwrap();
                let (data, archive) = {
                    let core = backend.core.lock().unwrap();
                    let current: rusqlite::Result<(PathBuf, bool)> = core.store.db.query_row(
                        "SELECT path,active FROM roots WHERE id=?",
                        [id],
                        |row| Ok((PathBuf::from(row.get::<_, String>(0)?), row.get(1)?)),
                    );
                    if !matches!(current, Ok((ref path, true)) if path == folder) {
                        backend.initial_scans.lock().unwrap().queued.remove(id);
                        continue;
                    }
                    (core.store.data.clone(), core.store.repo.path().to_owned())
                };
                let result = Store::open_scanner(data, &archive).and_then(|mut store| {
                    store.scan_with_events(id, &paths, |progress| {
                        if queued.contains(id) {
                            backend
                                .initial_scans
                                .lock()
                                .unwrap()
                                .progress
                                .insert(id.to_owned(), progress);
                            backend.changed();
                        }
                    })
                });
                let mut scans = backend.initial_scans.lock().unwrap();
                let initial = scans.queued.remove(id);
                scans.progress.remove(id);
                let error_changed;
                if let Err(error) = result {
                    eprintln!("Windowsill scan: {error}");
                    let error = error.to_string();
                    error_changed = scans.errors.get(id) != Some(&error);
                    scans.errors.insert(id.to_owned(), error);
                } else {
                    scans.errors.remove(id);
                    error_changed = true;
                }
                drop(scans);
                if initial || error_changed {
                    backend.changed();
                }
            }
        }
        if scheduled {
            next_scan = Instant::now() + refresh;
        }
    }
}

fn text(value: &Value) -> Result<&str> {
    value
        .as_str()
        .ok_or_else(|| "요청 값을 확인해 주세요.".into())
}

fn valid_setting(key: &str, value: &Value) -> bool {
    match key {
        "reducedMotion" | "onboarded" => value.is_boolean(),
        "visiblePlants" => matches!(value.as_i64(), Some(1..=3)),
        "searchPageSize" => matches!(value.as_i64(), Some(10 | 20 | 50 | 100)),
        "language" => matches!(value.as_str(), Some("ko" | "en" | "ja" | "zh-CN")),
        "fontChoice" => matches!(
            value.as_str(),
            Some(
                "theme"
                    | "system"
                    | "custom"
                    | "default"
                    | "flowers"
                    | "files"
                    | "runner"
                    | "night"
            )
        ),
        "theme" => matches!(value.as_str(), Some("sage" | "evening" | "cream")),
        _ => false,
    }
}

fn validate_labels(value: &Value) -> Result<Value> {
    let invalid = "문구의 길이와 사용할 수 없는 문자를 확인해 주세요.";
    let mut output = serde_json::Map::new();
    for (key, value) in value.as_object().ok_or(invalid)? {
        let limit = match key.as_str() {
            "homeDescription" | "overviewDescription" => 160,
            "shortcutNoun" => 30,
            "homeTitle" | "homeEyebrow" | "overviewEyebrow" | "overviewTitle" | "folderMetric"
            | "savedMetric" | "organizedMetric" | "sceneTitle" | "shortcutsTitle"
            | "recentTitle" | "brandTitle" | "sidebarCaption" | "topCaption" | "filesTitle"
            | "themesTitle" | "settingsTitle" | "historyTitle" => 60,
            _ => return Err(invalid.into()),
        };
        let text = value.as_str().ok_or(invalid)?;
        if text.chars().count() > limit || text.chars().any(|c|
            matches!(c, '\0'..='\u{1f}' | '\u{7f}' | '\u{202a}'..='\u{202e}' | '\u{2066}'..='\u{2069}'))
        {
            return Err(invalid.into());
        }
        let text = text.trim();
        if !text.is_empty() {
            output.insert(key.clone(), json!(text));
        }
    }
    Ok(Value::Object(output))
}

impl Core {
    fn state(&self, version: &str) -> Result<Value> {
        let days: i64 = self
            .store
            .db
            .query_row("SELECT count(*) FROM visits", [], |r| r.get(0))?;
        let plants = self.store.rows("SELECT json_object('id',p.id,'name',p.name,'folder',p.folder,'xp',?+coalesce((SELECT sum(o.reward) FROM ops o WHERE o.plant=p.id AND status='completed'),0)) FROM plants p ORDER BY p.id",[days])?;
        let ops = self.store.rows("SELECT json_object('id',id,'batch',batch,'plant',plant,'source',source,'destination',destination,'mode',mode,'status',status,'reward',reward,'created',created,'error','') FROM ops ORDER BY created DESC LIMIT 200",[])?;
        let total: i64 = self.store.db.query_row(
            "SELECT count(*) FROM ops WHERE status='completed'",
            [],
            |r| r.get(0),
        )?;
        let mut settings = json!({"uiLabels":{},"managedRootOrder":[],"language":"ko","searchPageSize":20,"fontChoice":"theme","customFont":null,"visiblePlants":3,"theme":"sage","reducedMotion":false,"onboarded":false});
        for (key, value) in settings.as_object_mut().unwrap() {
            *value = self.store.get(key, value.clone())?;
        }
        let roots = self.store.roots()?;
        let storage = self.storage()?;
        let tasks = self.store.rows(
            "SELECT json_patch(payload,json_object('id',id,'batch',batch,'status',status,'reason',reason,
              'operation',operation,'created',created,'updated',updated)) FROM task_items
              ORDER BY CASE WHEN status IN ('completed','undone','retried') THEN 1 ELSE 0 END,created DESC LIMIT 100", [],
        )?;
        let task_counts = self.store.rows(
            "SELECT json_group_object(status,n) FROM (SELECT status,count(*) n FROM task_items GROUP BY status)", [],
        )?.pop().unwrap_or_else(|| json!({}));
        let archive = self.store.rows(
            "SELECT json_object('id',a.id,'operation',a.operation,'batch',o.batch,'kind',a.kind,
              'status',a.status,'reason',a.reason,'updated',a.updated,'destination',o.destination,'source',o.source)
             FROM aftercare a JOIN ops o ON o.id=a.operation
             ORDER BY CASE WHEN a.status IN ('failed','queued') THEN 0 ELSE 1 END,a.updated DESC LIMIT 100", [],
        )?;
        let archive_counts = self.store.rows(
            "SELECT json_group_object(status,n) FROM (SELECT status,count(*) n FROM aftercare GROUP BY status)", [],
        )?.pop().unwrap_or_else(|| json!({}));
        Ok(
            json!({"plants":plants,"days":days,"ops":ops,"tasks":{"counts":task_counts,"items":tasks,"limit":100},"total":total,"today":total,"blocked":self.blocked()?,"busy":false,"progress":null,"settings":settings,
            "tutorial":self.store.get("tutorial",Value::Null)?,"organize":organizer::jobs(&self.store,None)?,"aftercare":{"counts":archive_counts,"items":archive},"themes":themes::summary(&self.store)?,"managed":{"ready":true,"roots":roots,"storage":storage,"budget":storage["budget"],"error":"","deleting":false,"recordJob":self.store.get("recordJob",Value::Null)?},
            "guide":self.store.get("guide",json!({"step":0,"status":"not_started","version":1}))?,"native":true,"platform":if cfg!(windows) {"win32"} else {"darwin"},"canClickThrough":self.tray_ready,"version":version}),
        )
    }

    fn dashboard(&self) -> Result<Value> {
        let sizes = self.store.rows("SELECT json_object('root',root,'files',count(*),'measured',count(*),'bytes',coalesce(sum(bytes),0),'checked',max(observed)) FROM files f WHERE status='stored' AND NOT EXISTS(SELECT 1 FROM file_controls c WHERE c.file=f.id AND c.state='off') GROUP BY root",[])?;
        let recent = self.store.rows("SELECT json_object('id',f.id,'root',f.root,'path',f.path,'status',f.status,'version',v.seq,'created',v.created,'kind',v.kind) FROM files f JOIN versions v ON v.file=f.id WHERE f.status='stored' AND v.seq=(SELECT max(v2.seq) FROM versions v2 WHERE v2.file=f.id) AND NOT EXISTS(SELECT 1 FROM file_controls c WHERE c.file=f.id AND c.state='off') ORDER BY v.created DESC,f.id LIMIT 5",[])?;
        let opened = self.store.rows("SELECT json_object('id',f.id,'root',f.root,'path',f.path,'status',f.status,'version',(SELECT max(seq) FROM versions WHERE file=f.id),'opened',o.opened) FROM file_opens o JOIN files f ON o.file=f.id WHERE f.status='stored' AND NOT EXISTS(SELECT 1 FROM file_controls c WHERE c.file=f.id AND c.state='off') ORDER BY o.opened DESC,f.id LIMIT 5",[])?;
        Ok(json!({"sizes":sizes,"recent":recent,"opened":opened,"openStatus":"unknown"}))
    }

    fn storage(&self) -> Result<Value> {
        let versions: i64 = self
            .store
            .db
            .query_row("SELECT count(*) FROM versions", [], |r| r.get(0))?;
        let budget = self
            .store
            .get("storageBudget", json!(5))?
            .as_u64()
            .unwrap_or(5)
            * GIB;
        let index: u64 = [
            "garden-rust.sqlite",
            "garden-rust.sqlite-wal",
            "garden-rust.sqlite-shm",
        ]
        .iter()
        .filter_map(|name| fs::metadata(self.store.data.join(name)).ok())
        .map(|m| m.len())
        .sum();
        let used = self
            .storage_sizes
            .map(|sizes| sizes.archives.saturating_add(index));
        let repo = self.storage_sizes.map(|sizes| sizes.repo);
        let disk = files::disk_space(self.store.repo.path()).ok();
        let cleanup = self.store.get("archiveMoveFrom", Value::Null)?;
        Ok(
            json!({"used":used,"repo":repo,"pending":0,"other":used.zip(repo).map(|(used, repo)| used.saturating_sub(repo)),
                "free":disk.map(|d| d.0),"diskTotal":disk.map(|d| d.1),"budget":budget,
                "location":self.store.archive_directory(),"locationCleanupPending":!cleanup.is_null(),
                "remaining":used.map(|used| budget.saturating_sub(used)),"versions":versions,
                "checked":self.storage_sizes.map(|sizes| sizes.checked),"working":false}),
        )
    }

    fn folders(&self, root: &str) -> Result<Vec<PathBuf>> {
        let path = self.store.root_path(root)?;
        Ok(files::tree(&path)?.folders)
    }
}
