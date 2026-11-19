#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(not(feature = "rust-backend"))]
mod backend;
#[cfg(feature = "rust-backend")]
#[path = "rust_backend/mod.rs"]
mod backend;
mod desktop;

use backend::Backend;
use serde_json::{json, Value};
use std::sync::Arc;
use tauri::{ipc::Response, Manager, RunEvent, State, WebviewWindow};

#[tauri::command]
async fn garden(
    window: WebviewWindow,
    backend: State<'_, Arc<Backend>>,
    drops: State<'_, desktop::Drops>,
    method: String,
    mut args: Vec<Value>,
) -> Result<Value, String> {
    if !matches!(window.label(), "manager" | "widget") {
        return Err("허용되지 않은 요청이에요.".into());
    }
    if method == "drop" {
        let token = args
            .first()
            .and_then(Value::as_u64)
            .ok_or("파일을 다시 놓아 주세요.")?;
        args[0] = json!(drops.take(window.label(), token)?);
    }
    backend.call(window.label(), &method, args).await
}

#[tauri::command]
fn widget_gesture(window: WebviewWindow, kind: String) -> Result<(), String> {
    desktop::gesture(&window, &kind).map_err(|error| error.to_string())
}

#[tauri::command]
async fn read_dropped_image(
    window: WebviewWindow,
    drops: State<'_, desktop::Drops>,
    token: u64,
) -> Result<Response, String> {
    if window.label() != "manager" {
        return Err("관리 화면에서 이용해 주세요.".into());
    }
    let paths = drops.take(window.label(), token)?;
    let path = paths
        .into_iter()
        .next()
        .ok_or("이미지 파일을 다시 놓아 주세요.")?;
    let bytes = tauri::async_runtime::spawn_blocking(move || {
        desktop::dropped_image(&path).map_err(|error| error.to_string())
    })
    .await
    .map_err(|error| error.to_string())??;
    Ok(Response::new(bytes))
}

fn main() {
    let builder = tauri::Builder::default();
    #[cfg(target_os = "macos")]
    let builder = builder.plugin(tauri_plugin_notification::init());
    builder
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            desktop::event(app, "activate", Value::Null)
        }))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .manage(desktop::Drops::default())
        .invoke_handler(tauri::generate_handler![
            garden,
            widget_gesture,
            read_dropped_image
        ])
        .on_menu_event(|app, notice| desktop::event(app, notice.id().as_ref(), Value::Null))
        .setup(|app| Backend::start(app.handle()))
        .build(tauri::generate_context!())
        .expect("Windowsill desktop initialization failed")
        .run(|app, event| match event {
            RunEvent::ExitRequested {
                code: None, api, ..
            } => api.prevent_exit(),
            RunEvent::Exit => {
                if let Some(backend) = app.try_state::<Arc<Backend>>() {
                    backend.stop();
                }
            }
            _ => {}
        });
}
