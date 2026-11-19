use crate::backend::Backend;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    collections::HashMap,
    fs::File,
    io::Read,
    path::{Path, PathBuf},
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc, Mutex,
    },
    thread,
    time::{Duration, Instant},
};
use tauri::{
    menu::{Menu, MenuBuilder},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    webview::{NewWindowResponse, PageLoadEvent},
    window::Color,
    AppHandle, DragDropEvent, Emitter, LogicalSize, Manager, PhysicalPosition, PhysicalSize,
    WebviewEvent, WebviewUrl, WebviewWindow, WebviewWindowBuilder, WindowEvent,
};
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};
#[cfg(target_os = "macos")]
use tauri_plugin_notification::NotificationExt;
use tauri_plugin_opener::OpenerExt;
use tauri_runtime::ResizeDirection;

const TRAY: &str = "windowsill";
const DROP_EXPIRY: Duration = Duration::from_secs(30);
const IMAGE_LIMIT: u64 = 20 * 1024 * 1024;
type Result<T = ()> = std::result::Result<T, Box<dyn std::error::Error>>;

struct Drop {
    token: u64,
    paths: Vec<PathBuf>,
    created: Instant,
}

#[derive(Default)]
pub struct Drops {
    next: AtomicU64,
    pending: Mutex<HashMap<String, Drop>>,
}

impl Drops {
    fn insert(&self, label: &str, paths: Vec<PathBuf>) -> u64 {
        let token = self.next.fetch_add(1, Ordering::Relaxed) + 1;
        self.pending.lock().unwrap().insert(
            label.into(),
            Drop {
                token,
                paths,
                created: Instant::now(),
            },
        );
        token
    }

    pub fn take(&self, label: &str, token: u64) -> std::result::Result<Vec<PathBuf>, String> {
        let mut pending = self.pending.lock().unwrap();
        if pending
            .get(label)
            .is_some_and(|drop| drop.token == token && drop.created.elapsed() <= DROP_EXPIRY)
        {
            return Ok(pending.remove(label).unwrap().paths);
        }
        Err("파일을 다시 놓아 주세요.".into())
    }
}

pub fn event(app: &AppHandle, name: &str, data: Value) {
    if let Some(backend) = app.try_state::<Arc<Backend>>() {
        backend.event(name, data);
    }
}

#[cfg(not(feature = "rust-backend"))]
pub fn backend_stopped(app: &AppHandle) {
    let app = app.clone();
    thread::spawn(move || {
        app.dialog()
            .message("파일 관리 서비스가 종료됐어요. 앱을 다시 시작해 주세요.")
            .title("작은 창틀")
            .kind(MessageDialogKind::Error)
            .blocking_show();
        app.exit(1);
    });
}

pub fn dispatch(app: &AppHandle, _id: Option<u64>, operation: String, payload: Value) {
    #[cfg(not(feature = "rust-backend"))]
    if let Some(id) = _id {
        let app = app.clone();
        thread::spawn(move || {
            let reply = request(&app, &operation, payload).map_err(|error| error.to_string());
            app.state::<Arc<Backend>>().reply(id, reply);
        });
        return;
    }
    let host = app.clone();
    let _ = app.run_on_main_thread(move || {
        if let Err(error) = notify(&host, &operation, payload) {
            eprintln!("Windowsill desktop operation {operation}: {error}");
            if operation == "manager" || operation == "widget" {
                host.dialog()
                    .message(error.to_string())
                    .title("작은 창틀을 열지 못했어요")
                    .kind(MessageDialogKind::Error)
                    .show(|_| {});
            }
        }
    });
}

pub(crate) fn request(app: &AppHandle, operation: &str, payload: Value) -> Result<Value> {
    match operation {
        "open-dialog" | "save-dialog" => dialog(
            app,
            operation == "save-dialog",
            serde_json::from_value(payload)?,
        ),
        "open-path" => {
            let path: String = serde_json::from_value(payload)?;
            app.opener().open_path(path, None::<String>)?;
            Ok(Value::Null)
        }
        "startup-error" => {
            app.dialog()
                .message(payload.as_str().unwrap_or_default())
                .title("작은 창틀을 열지 못했어요")
                .kind(MessageDialogKind::Error)
                .blocking_show();
            Ok(Value::Null)
        }
        _ => Err(format!("Unknown desktop request: {operation}").into()),
    }
}

fn notify(app: &AppHandle, operation: &str, payload: Value) -> Result {
    match operation {
        "manager" => show_manager(app, serde_json::from_value(payload)?),
        "widget" => show_widget(app, serde_json::from_value(payload)?),
        "tray" => refresh_tray(app, &payload),
        "widget-menu" => widget_menu(app, &payload),
        "changed" => Ok(app.emit("garden:changed", ())?),
        "hide-widget" => {
            if let Some(window) = app.get_webview_window("widget") {
                window.hide()?;
            }
            Ok(())
        }
        "click-through" => {
            if let Some(window) = app.get_webview_window("widget") {
                window.set_ignore_cursor_events(payload.as_bool().unwrap_or(false))?;
            }
            Ok(())
        }
        "titles" => {
            for label in ["manager", "widget"] {
                if let Some(window) = app.get_webview_window(label) {
                    window.set_title(text(&payload, label))?;
                }
            }
            Ok(())
        }
        "notification" => {
            let title = text(&payload, "title").to_owned();
            let body = text(&payload, "body").to_owned();
            #[cfg(windows)]
            let route = text(&payload, "route").to_owned();
            let host = app.clone();
            thread::spawn(move || {
                #[cfg(windows)]
                {
                    let mut toast = tauri_winrt_notification::Toast::new(&host.config().identifier)
                        .title(&title)
                        .text1(&body);
                    if route == "files" {
                        toast = toast.on_activated(move |_| {
                            event(&host, "files", Value::Null);
                            Ok(())
                        });
                    }
                    let _ = toast.show();
                }
                #[cfg(target_os = "macos")]
                let _ = host.notification().builder().title(title).body(body).show();
            });
            Ok(())
        }
        _ => Err(format!("Unknown desktop operation: {operation}").into()),
    }
}

fn text<'a>(object: &'a Value, key: &str) -> &'a str {
    object[key].as_str().unwrap_or_default()
}

#[derive(Deserialize)]
struct Filter {
    name: String,
    extensions: Vec<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct DialogOptions {
    sender: String,
    title: String,
    default_path: Option<PathBuf>,
    #[serde(default)]
    properties: Vec<String>,
    #[serde(default)]
    filters: Vec<Filter>,
}

fn dialog(app: &AppHandle, save: bool, options: DialogOptions) -> Result<Value> {
    let mut builder = app.dialog().file().set_title(options.title);
    if let Some(parent) = app.get_webview_window(&options.sender) {
        builder = builder.set_parent(&parent);
    }
    if let Some(path) = options.default_path {
        if let Some(parent) = path.parent().filter(|p| p.is_absolute()) {
            builder = builder.set_directory(parent);
        }
        if let Some(name) = path.file_name() {
            builder = builder.set_file_name(name.to_string_lossy());
        }
    }
    for filter in options.filters {
        let extensions = filter
            .extensions
            .iter()
            .map(String::as_str)
            .collect::<Vec<_>>();
        builder = builder.add_filter(filter.name, &extensions);
    }
    let selected = if save {
        builder.blocking_save_file()
    } else if options.properties.iter().any(|p| p == "openDirectory") {
        builder.blocking_pick_folder()
    } else {
        builder.blocking_pick_file()
    };
    Ok(serde_json::to_value(
        selected.map(|path| path.into_path()).transpose()?,
    )?)
}

fn window<'a>(
    app: &'a AppHandle,
    label: &str,
    query: &str,
) -> WebviewWindowBuilder<'a, tauri::Wry, AppHandle> {
    let url = WebviewUrl::App(format!("index.html?{query}").into());
    WebviewWindowBuilder::new(app, label, url)
        .on_navigation(|url| {
            (url.scheme() == "tauri" && url.host_str() == Some("localhost"))
                || (matches!(url.scheme(), "http" | "https")
                    && url.host_str() == Some("tauri.localhost"))
        })
        .on_new_window(|_, _| NewWindowResponse::Deny)
        .drag_and_drop(true)
        .devtools(cfg!(debug_assertions))
        .visible(false)
}

#[derive(Deserialize)]
struct ManagerOptions {
    title: String,
    route: String,
}

fn show_manager(app: &AppHandle, options: ManagerOptions) -> Result {
    if let Some(manager) = app.get_webview_window("manager") {
        manager.unminimize()?;
        manager.show()?;
        manager.set_focus()?;
        manager.emit_to("manager", "garden:navigate", options.route)?;
        manager.emit_to("manager", "garden:changed", ())?;
        return Ok(());
    }
    let route = match options.route.as_str() {
        "files" | "rules" | "help" | "history" | "settings" | "themes" => &options.route,
        _ => "garden",
    };
    let manager = window(app, "manager", &format!("page={route}"))
        .title(options.title)
        .inner_size(1160.0, 800.0)
        .min_inner_size(540.0, 420.0)
        .background_color(Color(247, 245, 239, 255))
        .on_page_load(|window, payload| {
            if payload.event() == PageLoadEvent::Finished {
                let _ = window.show();
            }
        })
        .build()?;
    attach_drop(&manager);
    let host = app.clone();
    manager.on_window_event(move |notice| {
        if matches!(notice, WindowEvent::Destroyed) {
            host.state::<Drops>()
                .pending
                .lock()
                .unwrap()
                .remove("manager");
            event(&host, "manager-closed", Value::Null);
        }
    });
    Ok(())
}

#[derive(Deserialize, Serialize)]
struct Bounds {
    x: Option<i32>,
    y: Option<i32>,
    width: f64,
    height: f64,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct WidgetOptions {
    title: String,
    bounds: Bounds,
    min_width: f64,
    show: bool,
    focus: bool,
    adjust: bool,
}

fn place_widget(app: &AppHandle, widget: &WebviewWindow, options: &WidgetOptions) -> Result {
    let (x, y) = (options.bounds.x, options.bounds.y);
    let monitor = match (x, y) {
        (Some(x), Some(y)) => app.monitor_from_point(f64::from(x), f64::from(y))?,
        _ => None,
    }
    .or(app.primary_monitor()?)
    .ok_or("No monitor available")?;
    let area = monitor.work_area();
    let dpi = monitor.scale_factor();
    let to_px = |value: f64| (value * dpi).round() as i32;
    let width =
        to_px(options.bounds.width.clamp(options.min_width, 800.0)).min(area.size.width as i32);
    let height = to_px(options.bounds.height.clamp(80.0, 500.0)).min(area.size.height as i32);
    let right = area.position.x + area.size.width as i32;
    let bottom = area.position.y + area.size.height as i32;
    let mut x = x.unwrap_or(right - width - to_px(12.0));
    let y = y.unwrap_or(bottom - height - to_px(12.0));
    if options.adjust {
        let old = widget.outer_size()?.width as i32;
        if (x - area.position.x) > right - x - old {
            x += old - width;
        }
    }
    widget.set_min_size(Some(LogicalSize::new(options.min_width, 80.0)))?;
    widget.set_position(PhysicalPosition::new(
        x.clamp(area.position.x, right - width),
        y.clamp(area.position.y, bottom - height),
    ))?;
    widget.set_size(PhysicalSize::new(width as u32, height as u32))?;
    Ok(())
}

fn show_widget(app: &AppHandle, options: WidgetOptions) -> Result {
    if let Some(widget) = app.get_webview_window("widget") {
        if options.adjust {
            place_widget(app, &widget, &options)?;
        }
        if options.show {
            widget.set_ignore_cursor_events(false)?;
            widget.show()?;
            if options.focus {
                widget.set_focus()?;
            }
        }
        return Ok(());
    }
    let widget = window(app, "widget", "widget=1")
        .title(&options.title)
        .decorations(false)
        .transparent(true)
        .shadow(false)
        .always_on_top(true)
        .skip_taskbar(app.tray_by_id(TRAY).is_some())
        .focused(options.focus)
        .maximizable(false)
        .minimizable(false)
        .background_color(Color(0, 0, 0, 0))
        .max_inner_size(800.0, 500.0)
        .build()?;
    place_widget(app, &widget, &options)?;
    attach_drop(&widget);
    let watched = widget.clone();
    widget.on_window_event(move |notice| match notice {
        WindowEvent::CloseRequested { api, .. }
            if watched.app_handle().tray_by_id(TRAY).is_some() =>
        {
            api.prevent_close();
            let _ = watched.hide();
        }
        WindowEvent::Moved(_) | WindowEvent::Resized(_) => report_bounds(&watched),
        _ => {}
    });
    if options.show {
        widget.show()?;
    }
    report_bounds(&widget);
    Ok(())
}

fn report_bounds(window: &WebviewWindow) {
    if let (Ok(position), Ok(size), Ok(dpi)) = (
        window.outer_position(),
        window.inner_size(),
        window.scale_factor(),
    ) {
        let bounds = Bounds {
            x: Some(position.x),
            y: Some(position.y),
            width: f64::from(size.width) / dpi,
            height: f64::from(size.height) / dpi,
        };
        event(window.app_handle(), "widget-bounds", json!(bounds));
    }
}

fn menu(app: &AppHandle, labels: &Value, items: &[&str]) -> tauri::Result<Menu<tauri::Wry>> {
    let mut menu = MenuBuilder::new(app);
    for item in items {
        menu = if *item == "-" {
            menu.separator()
        } else if *item == "hint" {
            menu.item(&tauri::menu::MenuItem::with_id(
                app,
                *item,
                text(labels, item),
                false,
                None::<&str>,
            )?)
        } else {
            menu.text(*item, text(labels, item))
        };
    }
    menu.build()
}

fn refresh_tray(app: &AppHandle, labels: &Value) -> Result {
    let menu = menu(app, labels, &["manager", "widget", "hide", "-", "quit"])?;
    let title = text(labels, "title");
    if let Some(tray) = app.tray_by_id(TRAY) {
        tray.set_menu(Some(menu))?;
        tray.set_tooltip(Some(title))?;
        return Ok(());
    }
    let mut builder = TrayIconBuilder::with_id(TRAY)
        .menu(&menu)
        .tooltip(title)
        .show_menu_on_left_click(false)
        .on_tray_icon_event(|tray, notice| {
            if let TrayIconEvent::DoubleClick {
                button: MouseButton::Left,
                ..
            } = notice
            {
                event(tray.app_handle(), "manager", Value::Null);
            }
        });
    if let Some(icon) = app.default_window_icon() {
        builder = builder.icon(icon.clone());
    }
    let result = builder.build(app);
    event(app, "tray-ready", json!(result.is_ok()));
    result?;
    Ok(())
}

fn widget_menu(app: &AppHandle, labels: &Value) -> Result {
    if let Some(widget) = app.get_webview_window("widget") {
        let mut items = vec!["manager", "help", "hint", "reset"];
        if app.tray_by_id(TRAY).is_some() {
            items.push("view");
        }
        items.extend(["hide", "-", "quit"]);
        widget.popup_menu(&menu(app, labels, &items)?)?;
    }
    Ok(())
}

fn attach_drop(window: &WebviewWindow) {
    let target = window.clone();
    window.on_webview_event(move |notice| {
        let WebviewEvent::DragDrop(notice) = notice else { return };
        let dpi = target.scale_factor().unwrap_or(1.0);
        let payload = match notice {
            DragDropEvent::Enter { position, .. } | DragDropEvent::Over { position } => {
                json!({"phase":"hover", "x":position.x/dpi, "y":position.y/dpi})
            }
            DragDropEvent::Drop { paths, position } if !paths.is_empty() => {
                let first = paths[0].file_name().map(|name| name.to_string_lossy().into_owned());
                let token = target.state::<Drops>().insert(target.label(), paths.clone());
                json!({"phase":"drop", "token":token, "first":first, "x":position.x/dpi, "y":position.y/dpi})
            }
            _ => json!({"phase":"leave"}),
        };
        let _ = target.emit_to(target.label(), "garden:native-drop", payload);
    });
}

pub fn gesture(window: &WebviewWindow, kind: &str) -> Result {
    if window.label() != "widget" {
        return Err("창틀에서만 이용할 수 있어요.".into());
    }
    match kind {
        "move" => window.start_dragging()?,
        "resize" => window
            .as_ref()
            .window()
            .start_resize_dragging(ResizeDirection::NorthWest)?,
        _ => return Err("지원하지 않는 창 동작이에요.".into()),
    }
    Ok(())
}

pub fn dropped_image(path: &Path) -> Result<Vec<u8>> {
    let extension = path
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or_default()
        .to_ascii_lowercase();
    if !matches!(
        extension.as_str(),
        "png" | "jpg" | "jpeg" | "gif" | "webp" | "bmp" | "avif"
    ) {
        return Err("이미지 파일을 선택해 주세요.".into());
    }
    let file = File::open(path)?;
    let metadata = file.metadata()?;
    if !metadata.is_file() || metadata.len() > IMAGE_LIMIT {
        return Err("20MB 이하의 이미지 파일을 선택해 주세요.".into());
    }
    let mut bytes = Vec::with_capacity(metadata.len() as usize);
    file.take(IMAGE_LIMIT + 1).read_to_end(&mut bytes)?;
    if bytes.len() as u64 > IMAGE_LIMIT {
        return Err("20MB 이하의 이미지 파일을 선택해 주세요.".into());
    }
    Ok(bytes)
}
