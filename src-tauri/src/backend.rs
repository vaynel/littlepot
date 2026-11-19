use serde::Deserialize;
use serde_json::{json, Value};
use std::{
    collections::HashMap,
    env,
    io::{self, BufRead, BufReader, BufWriter, Write},
    os::windows::process::CommandExt,
    path::PathBuf,
    process::{Child, Command, Stdio},
    sync::{
        atomic::{AtomicBool, AtomicU64, Ordering},
        mpsc, Arc, Mutex,
    },
    thread,
};
use tauri::{AppHandle, Manager};
use tokio::sync::oneshot;

type Reply = Result<Value, String>;

pub struct Backend {
    child: Mutex<Child>,
    output: mpsc::Sender<Value>,
    pending: Mutex<HashMap<u64, oneshot::Sender<Reply>>>,
    next_id: AtomicU64,
    exiting: AtomicBool,
}

#[derive(Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
enum Message {
    Reply {
        id: u64,
        value: Value,
        error: Option<String>,
    },
    Host {
        id: Option<u64>,
        operation: String,
        #[serde(default)]
        payload: Value,
    },
}

impl Backend {
    pub fn start(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
        let runtime = if cfg!(debug_assertions) {
            PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("runtime")
        } else {
            // Git resolves its bundled templates relative to the executable path.
            dunce::simplified(&app.path().resource_dir()?).join("runtime")
        };
        let data = match env::var_os("WINDOWSILL_TEST_DATA_DIR").filter(|p| !p.is_empty()) {
            Some(path) => std::path::absolute(path)?,
            None => app.path().app_local_data_dir()?.join("garden-v1"),
        };
        std::fs::create_dir_all(&data)?;
        let git_dir = runtime.join("git/ucrt64/bin");
        let inherited_path = env::var_os("PATH").unwrap_or_default();
        let path = env::join_paths(
            std::iter::once(git_dir.clone()).chain(env::split_paths(&inherited_path)),
        )?;
        let mut child = Command::new(runtime.join("node.exe"))
            .arg(runtime.join("backend/main.js"))
            .current_dir(&runtime)
            .env("WINDOWSILL_DATA_DIR", data)
            .env("WINDOWSILL_VERSION", app.package_info().version.to_string())
            .env("WINDOWSILL_GIT", git_dir.join("git.exe"))
            .env("PATH", path)
            .env_remove("NODE_OPTIONS")
            .env_remove("NODE_PATH")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .creation_flags(0x08000000) // CREATE_NO_WINDOW
            .spawn()?;
        let stdin = child.stdin.take().unwrap();
        let stdout = child.stdout.take().unwrap();
        let (output, queue) = mpsc::channel::<Value>();
        thread::spawn(move || {
            let mut writer = BufWriter::new(stdin);
            for packet in queue {
                let result = serde_json::to_writer(&mut writer, &packet)
                    .map_err(io::Error::other)
                    .and_then(|()| writer.write_all(b"\n"))
                    .and_then(|()| writer.flush());
                if result.is_err() {
                    break;
                }
            }
        });

        let backend = Arc::new(Self {
            child: Mutex::new(child),
            output,
            pending: Mutex::new(HashMap::new()),
            next_id: AtomicU64::new(1),
            exiting: AtomicBool::new(false),
        });
        app.manage(Arc::clone(&backend));
        let app = app.clone();
        thread::spawn(move || {
            for line in BufReader::new(stdout).lines() {
                let Ok(line) = line else { break };
                match serde_json::from_str::<Message>(&line) {
                    Ok(Message::Reply { id, value, error }) => {
                        if let Some(reply) = backend.pending.lock().unwrap().remove(&id) {
                            let _ = reply.send(error.map_or(Ok(value), Err));
                        }
                    }
                    Ok(Message::Host {
                        id,
                        operation,
                        payload,
                    }) => {
                        if operation == "exit" {
                            backend.exiting.store(true, Ordering::Release);
                            app.exit(payload.as_i64().unwrap_or(0) as i32);
                        } else {
                            crate::desktop::dispatch(&app, id, operation, payload);
                        }
                    }
                    Err(error) => eprintln!("Invalid Windowsill backend response: {error}"),
                }
            }
            let unexpected = !backend.exiting.swap(true, Ordering::AcqRel);
            backend.pending.lock().unwrap().clear();
            if unexpected {
                crate::desktop::backend_stopped(&app);
            }
        });
        Ok(())
    }

    pub async fn call(&self, window: &str, method: &str, args: Vec<Value>) -> Reply {
        let id = self.next_id.fetch_add(1, Ordering::Relaxed);
        let (reply, receiver) = oneshot::channel();
        {
            let mut pending = self.pending.lock().unwrap();
            if self.exiting.load(Ordering::Acquire) {
                return Err("파일 관리 서비스가 종료됐어요.".into());
            }
            pending.insert(id, reply);
        }
        let packet = json!({"type":"call", "id":id, "window":window, "method":method, "args":args});
        if self.output.send(packet).is_err() {
            self.pending.lock().unwrap().remove(&id);
        }
        receiver
            .await
            .unwrap_or_else(|_| Err("파일 관리 서비스에 연결할 수 없어요.".into()))
    }

    pub fn event(&self, event: &str, payload: Value) {
        let _ = self
            .output
            .send(json!({"type":"event", "event":event, "payload":payload}));
    }

    pub fn reply(&self, id: u64, reply: Reply) {
        let packet = match reply {
            Ok(value) => json!({"type":"host_reply", "id":id, "value":value}),
            Err(error) => json!({"type":"host_reply", "id":id, "error":error}),
        };
        let _ = self.output.send(packet);
    }

    pub fn stop(&self) {
        self.exiting.store(true, Ordering::Release);
        let mut child = self.child.lock().unwrap();
        let _ = child.kill();
        let _ = child.wait();
    }
}
