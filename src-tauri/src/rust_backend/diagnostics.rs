use super::{files, Result, Store};
use chrono::{SecondsFormat, Utc};
use rusqlite::params;
use serde_json::{json, Value};
use std::{
    path::Path,
    time::{Duration, Instant},
};
use uuid::Uuid;

const RETENTION_MS: i64 = 14 * 24 * 60 * 60 * 1000;
const EXPORT_LIMIT: i64 = 500;
const STORE_LIMIT: i64 = 2_000;

#[derive(Default)]
pub(super) struct Diagnostics {
    preview: Option<Preview>,
    session: Uuid,
    rate: Option<(Instant, u32)>,
    dropped: u32,
    unavailable: bool,
}

struct Preview {
    token: String,
    text: String,
    created: Instant,
}

#[derive(Clone, Copy)]
pub(super) enum Event {
    Start,
    Quit,
    InvokeFailure,
    RendererError,
    RendererRejection,
}

impl Event {
    fn name(self) -> &'static str {
        match self {
            Self::Start => "app.start",
            Self::Quit => "app.quit",
            Self::InvokeFailure => "ipc.failure",
            Self::RendererError => "renderer.error",
            Self::RendererRejection => "renderer.rejection",
        }
    }
}

impl Diagnostics {
    pub fn new() -> Self {
        Self {
            session: Uuid::new_v4(),
            ..Self::default()
        }
    }

    pub fn close_review(&mut self) {
        self.preview = None;
    }

    pub fn record(&mut self, store: &Store, event: Event) {
        let rate = self.rate.get_or_insert((Instant::now(), 0));
        if rate.0.elapsed() >= Duration::from_secs(60) {
            *rate = (Instant::now(), 0);
        }
        if rate.1 >= 200 && !matches!(event, Event::Start | Event::Quit) {
            self.dropped = self.dropped.saturating_add(1);
            return;
        }
        rate.1 += 1;
        let now = Utc::now();
        let entry = json!({
            "time":now.to_rfc3339_opts(SecondsFormat::Millis,true),
            "id":Uuid::new_v4(),
            "session":self.session,
            "version":env!("CARGO_PKG_VERSION"),
            "event":event.name(),
        });
        let outcome = store
            .db
            .execute(
                "INSERT INTO diagnostic_events(created,entry) VALUES (?,?)",
                params![now.timestamp_millis(), entry.to_string()],
            )
            .and_then(|_| {
                store.db.execute(
                    "DELETE FROM diagnostic_events WHERE created < ? OR id <=
             (SELECT id FROM diagnostic_events ORDER BY id DESC LIMIT 1 OFFSET ?)",
                    params![now.timestamp_millis() - RETENTION_MS, STORE_LIMIT],
                )
            });
        self.unavailable = outcome.is_err();
    }

    pub fn preview(&mut self, store: &Store) -> Result<Value> {
        let now = Utc::now();
        let cutoff = now.timestamp_millis() - RETENTION_MS;
        let rows = store.rows(
            "SELECT entry FROM diagnostic_events WHERE created >= ? ORDER BY id DESC LIMIT ?",
            params![cutoff, EXPORT_LIMIT],
        )?;
        let count: i64 = store.db.query_row(
            "SELECT count(*) FROM diagnostic_events WHERE created >= ?",
            [cutoff],
            |r| r.get(0),
        )?;
        let token = Uuid::new_v4().to_string();
        let events: Vec<Value> = rows
            .into_iter()
            .rev()
            .filter_map(|row| {
                let name = row["event"].as_str().filter(|name| {
                    matches!(
                        *name,
                        "app.start"
                            | "app.quit"
                            | "ipc.failure"
                            | "renderer.error"
                            | "renderer.rejection"
                    )
                })?;
                let parse_id = |key: &str| Uuid::parse_str(row[key].as_str()?).ok();
                let time = chrono::DateTime::parse_from_rfc3339(row["time"].as_str()?).ok()?;
                Some(json!({
                    "time":time.with_timezone(&Utc).to_rfc3339_opts(SecondsFormat::Millis,true),
                    "id":parse_id("id")?,
                    "session":parse_id("session")?,
                    "version":env!("CARGO_PKG_VERSION"),
                    "event":name,
                }))
            })
            .collect();
        let report = json!({
            "schemaVersion":1,"reportId":token,
            "createdAt":now.to_rfc3339_opts(SecondsFormat::Millis,true),
            "appVersion":env!("CARGO_PKG_VERSION"),
            "platform":if cfg!(windows) {"win32"} else {"darwin"},
            "architecture":std::env::consts::ARCH,
            "runtime":{"backend":"rust"},
            "privacy":"Only application event types, timestamps and diagnostic IDs. No automatic upload.",
            "storageAvailable":!self.unavailable,
            "limits":{"retentionDays":14,"storedEvents":STORE_LIMIT,"exportEvents":EXPORT_LIMIT},
            "omittedEvents":count.saturating_sub(events.len() as i64),
            "rateLimitedEvents":self.dropped,"events":events,
        });
        let text = serde_json::to_string_pretty(&report)?;
        let result = json!({"token":token,"text":text,"storageAvailable":!self.unavailable});
        self.preview = Some(Preview {
            token,
            text,
            created: Instant::now(),
        });
        Ok(result)
    }

    pub fn validate(&self, token: &str) -> Result<()> {
        self.reviewed(token).map(|_| ())
    }

    fn reviewed(&self, token: &str) -> Result<&Preview> {
        self.preview
            .as_ref()
            .filter(|preview| {
                preview.token == token && preview.created.elapsed() < Duration::from_secs(600)
            })
            .ok_or_else(|| "진단 내용을 다시 확인해 주세요.".into())
    }

    pub fn save(&mut self, store: &Store, token: &str, path: &Path) -> Result<Value> {
        let preview = self.reviewed(token)?;
        let path = if path
            .extension()
            .is_some_and(|ext| ext.eq_ignore_ascii_case("json"))
        {
            path.to_owned()
        } else {
            let mut name = path.as_os_str().to_owned();
            name.push(".json");
            name.into()
        };
        let path = files::destination(&path)?;
        if path.starts_with(files::local(&store.data)?) {
            return Err("앱 기록 폴더 밖에 저장해 주세요.".into());
        }
        files::publish(&path, preview.text.as_bytes())?;
        self.preview = None;
        Ok(json!({"saved":true}))
    }
}
