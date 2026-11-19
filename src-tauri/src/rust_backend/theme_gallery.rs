use super::{
    files,
    theme_package::{Package, LIMIT},
    themes, Result, Store,
};
use reqwest::{
    blocking::{Client, RequestBuilder},
    header::{HeaderMap, CONTENT_TYPE},
    redirect::Policy,
    retry, Method, StatusCode, Url,
};
use serde_json::{json, Value};
use std::{
    collections::HashMap,
    error::Error,
    io::{self, Read},
    net::{Ipv4Addr, SocketAddr},
    path::Path,
    time::{Duration, Instant},
};

const DEFAULT: &str = "https://littlepot.log2u.me:18472";

struct Route {
    url: Url,
    label: &'static str,
    lan: bool,
}

struct Reply {
    status: StatusCode,
    headers: HeaderMap,
    bytes: Vec<u8>,
}

pub(super) enum Response {
    Catalog,
    Browse { policy: Value, page: Value },
    Download(Vec<u8>),
    Preview(Value),
    LocalPreview(String),
    Published(Value),
}

#[derive(Default)]
pub(super) struct Gallery {
    selected: Option<(usize, Instant)>,
    user: Value,
    token: Option<String>,
    catalog_digests: HashMap<String, String>,
}

fn routes() -> Result<Vec<Route>> {
    if let Some(endpoint) =
        std::env::var_os("WINDOWSILL_THEME_SERVER").filter(|value| !value.is_empty())
    {
        let url = Url::parse(endpoint.to_str().ok_or("테마 서버 주소를 확인해 주세요.")?)?;
        let trusted = url.scheme() == "https"
            || (url.scheme() == "http"
                && matches!(url.host_str(), Some("localhost" | "127.0.0.1")));
        if !trusted
            || url.host_str().is_none()
            || !url.username().is_empty()
            || url.password().is_some()
            || url.query().is_some()
            || url.fragment().is_some()
            || url.path() != "/"
        {
            return Err("테마 서버 주소를 확인해 주세요.".into());
        }
        return Ok(vec![Route {
            url,
            label: "지정한 서버",
            lan: false,
        }]);
    }
    Ok(vec![
        Route {
            url: Url::parse(DEFAULT)?,
            label: "도메인 HTTPS",
            lan: false,
        },
        Route {
            url: Url::parse(DEFAULT)?,
            label: "내부망 HTTPS",
            lan: true,
        },
        Route {
            url: Url::parse("http://127.0.0.1:18880")?,
            label: "개발 SSH 터널",
            lan: false,
        },
    ])
}

fn is_transport_error(error: &(dyn Error + 'static)) -> bool {
    if error
        .downcast_ref::<reqwest::Error>()
        .is_some_and(reqwest::Error::is_timeout)
    {
        return true;
    }
    if let Some(error) = error.downcast_ref::<io::Error>() {
        if matches!(
            error.kind(),
            io::ErrorKind::ConnectionRefused
                | io::ErrorKind::ConnectionReset
                | io::ErrorKind::HostUnreachable
                | io::ErrorKind::NetworkUnreachable
                | io::ErrorKind::TimedOut
                | io::ErrorKind::BrokenPipe
                | io::ErrorKind::ConnectionAborted
        ) || matches!(error.raw_os_error(), Some(11001 | 11002))
        {
            return true;
        }
    }
    error.source().is_some_and(is_transport_error)
}

fn read_reply(request: RequestBuilder, limit: usize) -> Result<Reply> {
    let response = request.send()?;
    let status = response.status();
    let headers = response.headers().clone();
    if response
        .content_length()
        .is_some_and(|size| size > limit as u64)
    {
        return Err("테마 서버 응답 크기가 너무 커요.".into());
    }
    let mut bytes = Vec::new();
    response.take(limit as u64 + 1).read_to_end(&mut bytes)?;
    if bytes.len() > limit {
        return Err("테마 서버 응답 크기가 너무 커요.".into());
    }
    Ok(Reply {
        status,
        headers,
        bytes,
    })
}

fn client(route: &Route) -> Result<Client> {
    let mut builder = Client::builder()
        .no_proxy()
        .redirect(Policy::none())
        .retry(retry::never())
        .connect_timeout(Duration::from_millis(3500));
    if route.lan {
        let address = SocketAddr::from((Ipv4Addr::new(192, 168, 35, 96), 18472));
        builder = builder.resolve(
            route.url.host_str().ok_or("테마 서버를 확인해 주세요.")?,
            address,
        );
    }
    Ok(builder.build()?)
}

fn remote_id(id: &Value) -> Result<&str> {
    id.as_str()
        .filter(|id| *id == "sample" || (id.len() == 32 && lower_hex(id)))
        .ok_or_else(|| "테마를 다시 선택해 주세요.".into())
}

fn lower_hex(id: &str) -> bool {
    id.bytes()
        .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

pub(super) fn handles(command: &Value, options: Option<&Value>) -> bool {
    matches!(
        command.as_str(),
        Some(
            "browse" | "login" | "register" | "logout" | "publish-created" | "upload" | "download"
        )
    ) || (*command == "preview" && options == Some(&json!(true)))
}

impl Gallery {
    pub fn status(&self) -> Value {
        let routes = routes().unwrap_or_default();
        let selected = self.selected.and_then(|(index, _)| routes.get(index));
        let default = routes
            .first()
            .map(|route| route.url.origin().ascii_serialization())
            .unwrap_or_else(|| DEFAULT.into());
        json!({
            "endpoint":selected.map(|route| route.url.origin().ascii_serialization()).unwrap_or(default),
            "connection":selected.map(|route| route.label).unwrap_or("연결 전"),
            "fallback":self.selected.is_some_and(|(index, _)| index > 0),
            "user":self.user,
        })
    }

    pub fn signed_in(&self) -> bool {
        !self.user.is_null() && self.token.is_some()
    }

    fn select(&mut self, routes: &[Route]) -> Result<usize> {
        if let Some((index, until)) = self.selected {
            if index < routes.len() && Instant::now() < until {
                return Ok(index);
            }
        }
        self.selected = None;
        for (index, route) in routes.iter().enumerate() {
            let query = client(route)?
                .get(route.url.join("/healthz")?)
                .timeout(Duration::from_millis(3500));
            let response = match read_reply(query, 16384) {
                Ok(reply) => reply,
                Err(error) if is_transport_error(error.as_ref()) => continue,
                Err(_) => return Err("테마 서버의 안전한 연결을 확인하지 못했어요.".into()),
            };
            let health = serde_json::from_slice::<Value>(&response.bytes).unwrap_or(Value::Null);
            if !response.status.is_success()
                || health["status"] != "ok"
                || health["appThemeInstall"] != true
                || health["db"] != "ready"
            {
                return Err("올바른 테마 서버인지 확인하지 못했어요.".into());
            }
            self.selected = Some((index, Instant::now() + Duration::from_secs(60)));
            return Ok(index);
        }
        Err("테마 서버에 연결하지 못했어요. 설치한 테마는 계속 사용할 수 있어요.".into())
    }

    fn request(
        &mut self,
        path: &str,
        method: Method,
        body: Option<(&'static str, Vec<u8>)>,
    ) -> Result<Reply> {
        let routes = routes()?;
        let index = self.select(&routes)?;
        let route = &routes[index];
        let url = route.url.join(path)?;
        if url.origin() != route.url.origin() {
            return Err("허용되지 않은 서버 경로예요.".into());
        }
        let mut request = client(route)?
            .request(method, url)
            .timeout(Duration::from_secs(15));
        if let Some(token) = &self.token {
            request = request.bearer_auth(token);
        }
        if let Some((kind, body)) = body {
            request = request.header(CONTENT_TYPE, kind).body(body);
        }
        let response = match read_reply(request, LIMIT) {
            Ok(reply) => reply,
            Err(_) => {
                self.selected = None;
                return Err(
                    "테마 서버 응답을 읽지 못했어요. 결과를 확인한 뒤 다시 시도해 주세요.".into(),
                );
            }
        };
        if response.status == StatusCode::UNAUTHORIZED {
            self.sign_out();
        }
        if !response.status.is_success() {
            let error = serde_json::from_slice::<Value>(&response.bytes).unwrap_or(Value::Null);
            return Err(error["error"]
                .as_str()
                .filter(|msg| msg.chars().count() <= 240)
                .unwrap_or("테마 요청에 실패했어요.")
                .to_owned()
                .into());
        }
        Ok(response)
    }

    fn json(
        &mut self,
        path: &str,
        method: Method,
        body: Option<(&'static str, Vec<u8>)>,
    ) -> Result<Value> {
        let reply = self.request(path, method, body)?;
        Ok(serde_json::from_slice(&reply.bytes)?)
    }

    fn sign_out(&mut self) {
        self.token = None;
        self.user = Value::Null;
    }

    pub fn call(
        &mut self,
        command: &str,
        id: &Value,
        info: &Value,
        upload: Option<&Path>,
    ) -> Result<Response> {
        match command {
            "browse" => {
                let page = id.as_u64().unwrap_or(1).max(1);
                let policy = self.json("/v1/policy", Method::GET, None)?;
                let page = self.json(&format!("/v1/themes?page={page}"), Method::GET, None)?;
                let me = self.json("/v1/auth/me", Method::GET, None)?;
                self.user = me["user"].clone();
                if self.user.is_null() {
                    self.token = None;
                }
                if let Some(items) = page["themes"].as_array() {
                    for item in items.iter().take(1000) {
                        if let (Ok(id), Some(digest)) =
                            (remote_id(&item["id"]), item["digest"].as_str())
                        {
                            if digest.len() == 64
                                && lower_hex(digest)
                                && self.catalog_digests.len() < 5000
                            {
                                self.catalog_digests.insert(id.into(), digest.into());
                            }
                        }
                    }
                }
                Ok(Response::Browse { policy, page })
            }
            "login" | "register" => {
                let id = id.as_str().filter(|id| id.encode_utf16().count() <= 32);
                let password = info.as_str().filter(|pw| pw.encode_utf16().count() <= 128);
                let (Some(id), Some(password)) = (id, password) else {
                    return Err("아이디와 비밀번호를 확인해 주세요.".into());
                };
                let body = serde_json::to_vec(&json!({"id":id,"password":password}))?;
                let reply = self.json(
                    &format!("/v1/auth/{command}"),
                    Method::POST,
                    Some(("application/json", body)),
                )?;
                let token = reply["token"]
                    .as_str()
                    .filter(|token| {
                        !token.is_empty()
                            && token.len() <= 4096
                            && token.bytes().all(|b| (33..=126).contains(&b))
                    })
                    .ok_or("테마 서버의 로그인 응답을 확인해 주세요.")?;
                self.token = Some(token.into());
                self.user = reply["user"].clone();
                Ok(Response::Catalog)
            }
            "logout" => {
                let result = self.request("/v1/auth/logout", Method::POST, None);
                self.sign_out();
                result?;
                Ok(Response::Catalog)
            }
            "publish-created" | "upload" => {
                if !self.signed_in()
                    || (command == "publish-created" && *info != true)
                    || (command == "upload" && *id != true)
                {
                    return Err("로그인과 공유 권한을 확인해 주세요.".into());
                }
                let bytes = if command == "publish-created" {
                    themes::decode_created(id)?
                } else {
                    let Some(path) = upload else {
                        return Ok(Response::Catalog);
                    };
                    themes::read_package(path)?
                };
                Package::parse(&bytes)?;
                let result =
                    self.json("/v1/themes", Method::POST, Some(("application/zip", bytes)))?;
                Ok(Response::Published(result))
            }
            "download" => {
                if !self.signed_in() {
                    return Err("로그인 후 테마를 받을 수 있어요.".into());
                }
                let id = remote_id(id)?;
                let response =
                    self.request(&format!("/v1/themes/{id}/download"), Method::GET, None)?;
                let digest = files::digest(&response.bytes);
                if response
                    .headers
                    .get("x-content-sha256")
                    .and_then(|value| value.to_str().ok())
                    != Some(digest.as_str())
                {
                    return Err("다운로드 무결성을 확인하지 못했어요.".into());
                }
                Ok(Response::Download(response.bytes))
            }
            "preview" => {
                let id = remote_id(id)?;
                match self.json(&format!("/v1/themes/{id}/preview"), Method::GET, None) {
                    Ok(value) => Ok(Response::Preview(value)),
                    Err(error) => self
                        .catalog_digests
                        .get(id)
                        .cloned()
                        .map(Response::LocalPreview)
                        .ok_or(error),
                }
            }
            _ => Err("알 수 없는 테마 요청이에요.".into()),
        }
    }
}

pub(super) fn combine(mut catalog: Value, status: &Value) -> Value {
    if let Some(fields) = status.as_object() {
        for (key, value) in fields {
            catalog[key] = value.clone();
        }
    }
    catalog
}

impl Response {
    pub fn finish(self, store: &mut Store, status: &Value) -> Result<Value> {
        let catalog = || themes::catalog(store).map(|catalog| combine(catalog, status));
        match self {
            Self::Catalog => catalog(),
            Self::Browse { policy, page } => {
                let mut result = combine(catalog()?, &page);
                result["policy"] = policy;
                Ok(result)
            }
            Self::Download(bytes) => Ok(combine(themes::install(store, &bytes)?, status)),
            Self::Preview(value) | Self::Published(value) => Ok(value),
            Self::LocalPreview(id) => themes::call(store, "preview", &json!(id), &Value::Null),
        }
    }
}
