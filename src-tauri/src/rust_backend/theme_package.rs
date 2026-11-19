use super::{files, Result};
use base64::{engine::general_purpose::STANDARD, Engine};
use flate2::read::{DeflateDecoder, ZlibDecoder};
use serde::Deserialize;
use serde_json::{json, Value};
use std::{collections::HashMap, io::Read};

pub(super) const LIMIT: usize = 5 * 1024 * 1024;
const BAD_PACKAGE: &str = "5 MiB 이하의 v1/v2 ZIP 테마를 확인해 주세요. PNG, 폰트, 파일 해시와 색상 대비를 확인해 주세요.";

fn check(valid: bool) -> Result {
    valid.then_some(()).ok_or_else(|| BAD_PACKAGE.into())
}

fn slice(bytes: &[u8], at: usize, count: usize) -> Result<&[u8]> {
    bytes.get(at..at + count).ok_or_else(|| BAD_PACKAGE.into())
}

fn le16(bytes: &[u8], at: usize) -> Result<usize> {
    Ok(u16::from_le_bytes(slice(bytes, at, 2)?.try_into()?) as usize)
}

fn le32(bytes: &[u8], at: usize) -> Result<usize> {
    Ok(u32::from_le_bytes(slice(bytes, at, 4)?.try_into()?) as usize)
}

fn be16(bytes: &[u8], at: usize) -> Result<usize> {
    Ok(u16::from_be_bytes(slice(bytes, at, 2)?.try_into()?) as usize)
}

fn be32(bytes: &[u8], at: usize) -> Result<usize> {
    Ok(u32::from_be_bytes(slice(bytes, at, 4)?.try_into()?) as usize)
}

fn entry_limit(name: &str) -> Result<usize> {
    Ok(match name {
        "manifest.json" => 65536,
        "licenses/font.txt" => 32768,
        "assets/atlas.png" => LIMIT,
        "assets/font.ttf" | "assets/font.otf" | "assets/font.woff" | "assets/font.woff2" => {
            2 * 1024 * 1024
        }
        _ => return Err(BAD_PACKAGE.into()),
    })
}

fn unpack(bytes: &[u8]) -> Result<HashMap<&str, Vec<u8>>> {
    check((22..=LIMIT).contains(&bytes.len()))?;
    let end = bytes.len() - 22;
    let record = &bytes[end..];
    let entries = le16(record, 8)?;
    let central = le32(record, 16)?;
    check(
        le32(record, 0)? == 0x06054b50
            && le32(record, 4)? == 0
            && matches!(entries, 2 | 4)
            && le16(record, 10)? == entries
            && central + le32(record, 12)? == end
            && le16(record, 20)? == 0,
    )?;
    let mut previous_end = 0;
    let mut pointer = central;
    let mut files = HashMap::new();
    for _ in 0..entries {
        let header = slice(&bytes[..end], pointer, 46)?;
        let flags = le16(header, 8)?;
        let method = le16(header, 10)?;
        let crc = le32(header, 16)?;
        let compressed = le32(header, 20)?;
        let size = le32(header, 24)?;
        let name_len = le16(header, 28)?;
        let local_pointer = le32(header, 42)?;
        let entry_end = pointer + 46 + name_len + le16(header, 30)? + le16(header, 32)?;
        let unix_type = (le32(header, 38)? >> 16) & 0xf000;
        check(
            le32(header, 0)? == 0x02014b50
                && matches!(flags, 0 | 2048)
                && matches!(method, 0 | 8)
                && matches!(unix_type, 0 | 0x8000)
                && le16(header, 34)? == 0
                && entry_end <= end
                && local_pointer == previous_end,
        )?;
        let name = std::str::from_utf8(slice(bytes, pointer + 46, name_len)?)?;
        check(!files.contains_key(name) && (1..=entry_limit(name)?).contains(&size))?;
        let local = slice(&bytes[..central], local_pointer, 30)?;
        let data_start = local_pointer + 30 + name_len + le16(local, 28)?;
        check(
            le32(local, 0)? == 0x04034b50
                && le16(local, 6)? == flags
                && le16(local, 8)? == method
                && le32(local, 14)? == crc
                && le32(local, 18)? == compressed
                && le32(local, 22)? == size
                && le16(local, 26)? == name_len
                && slice(bytes, local_pointer + 30, name_len)? == name.as_bytes(),
        )?;
        let packed = slice(&bytes[..central], data_start, compressed)?;
        let data = if method == 8 {
            let mut data = Vec::with_capacity(size);
            DeflateDecoder::new(packed)
                .take(size as u64 + 1)
                .read_to_end(&mut data)?;
            data
        } else {
            packed.to_vec()
        };
        check(data.len() == size && crc32fast::hash(&data) as usize == crc)?;
        files.insert(name, data);
        previous_end = data_start + compressed;
        pointer = entry_end;
    }
    check(pointer == end && previous_end == central)?;
    Ok(files)
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct Manifest {
    format_version: u8,
    theme_id: String,
    version: String,
    title: String,
    creator_label: String,
    license_id: String,
    compatibility: Compatibility,
    palette: Palette,
    layout: Layout,
    assets: Assets,
    plants: [Plant; 3],
    shelf: Shelf,
    motion: Motion,
    ui: Option<Ui>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct Compatibility {
    renderer_api: u8,
    min_app_version: String,
    #[serde(rename = "supportedOS")]
    supported_os: Vec<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct Palette {
    surface: Option<String>,
    surface_alt: Option<String>,
    accent: Option<String>,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Layout {
    preset: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Assets {
    atlas: Atlas,
    font: Option<Font>,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Atlas {
    path: String,
    sha256: String,
    width: usize,
    height: usize,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct Font {
    path: String,
    sha256: String,
    family: String,
    license_id: String,
    license_path: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Plant {
    asset: String,
    size: [usize; 2],
    anchor: [usize; 2],
    stages: [[usize; 2]; 4],
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Shelf {
    asset: String,
    left: [usize; 4],
    repeat: [usize; 4],
    right: [usize; 4],
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct Motion {
    preset: String,
    amplitude_px: u8,
    period_ms: u16,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct Ui {
    background: String,
    panel: String,
    sidebar: String,
    text: String,
    muted: String,
    border: String,
    accent: String,
    accent_text: String,
}

fn parse_color(value: &str) -> Result<f64> {
    let bytes = value.as_bytes();
    check(bytes.len() == 7 && bytes[0] == b'#' && bytes[1..].iter().all(u8::is_ascii_hexdigit))?;
    let weights = [0.2126, 0.7152, 0.0722];
    let mut sum = 0.0;
    for i in 0..3 {
        let component = f64::from(u8::from_str_radix(&value[1 + 2 * i..3 + 2 * i], 16)?) / 255.0;
        let linear = if component <= 0.04045 {
            component / 12.92
        } else {
            ((component + 0.055) / 1.055).powf(2.4)
        };
        sum += linear * weights[i];
    }
    Ok(sum)
}

fn label(value: &str, maximum: usize) -> bool {
    !value.trim().is_empty()
        && value.encode_utf16().count() <= maximum
        && !value.bytes().any(|byte| byte < 32 || byte == 127)
}

fn version(value: &str) -> bool {
    let parts: Vec<_> = value.split('.').collect();
    parts.len() == 3
        && parts
            .iter()
            .all(|part| (1..=4).contains(&part.len()) && part.bytes().all(|c| c.is_ascii_digit()))
}

fn validate_png(png: &[u8], atlas: &Atlas) -> Result {
    check(
        atlas.path == "assets/atlas.png"
            && files::digest(png) == atlas.sha256
            && (1..=1024).contains(&atlas.width)
            && (1..=1024).contains(&atlas.height)
            && png.starts_with(b"\x89PNG\r\n\x1a\n"),
    )?;
    let mut pointer = 8;
    let mut idat = Vec::new();
    let mut ended = false;
    while pointer < png.len() {
        let len = be32(png, pointer)?;
        check(len <= LIMIT)?;
        let payload = slice(png, pointer + 4, len + 4)?;
        check(crc32fast::hash(payload) as usize == be32(png, pointer + 8 + len)?)?;
        let (kind, data) = payload.split_at(4);
        match kind {
            b"IHDR" if pointer == 8 => check(
                len == 13
                    && be32(data, 0)? == atlas.width
                    && be32(data, 4)? == atlas.height
                    && data[8..] == [8, 6, 0, 0, 0],
            )?,
            b"IDAT" if pointer > 8 => idat.extend_from_slice(data),
            b"IEND" if pointer > 8 => {
                check(len == 0 && !idat.is_empty() && pointer + 12 == png.len())?;
                ended = true;
            }
            b"sRGB" | b"gAMA" | b"pHYs" | b"tEXt" if pointer > 8 && idat.is_empty() => {
                check(len <= 4096)?
            }
            _ => return Err(BAD_PACKAGE.into()),
        }
        pointer += len + 12;
    }
    check(ended)?;
    let stride = atlas.width * 4 + 1;
    let limit = stride * atlas.height;
    let mut pixels = Vec::with_capacity(limit);
    ZlibDecoder::new(idat.as_slice())
        .take(limit as u64 + 1)
        .read_to_end(&mut pixels)?;
    check(pixels.len() == limit && pixels.chunks_exact(stride).all(|row| row[0] <= 4))
}

fn validate_font<'a>(font: &Font, files: &'a HashMap<&str, Vec<u8>>) -> Result<&'a [u8]> {
    let bytes = files.get(font.path.as_str()).ok_or(BAD_PACKAGE)?;
    let license = std::str::from_utf8(files.get("licenses/font.txt").ok_or(BAD_PACKAGE)?)?;
    check(
        font.license_path == "licenses/font.txt"
            && label(&font.family, 60)
            && label(&font.license_id, 80)
            && !license.trim().is_empty()
            && !license.bytes().any(|b| b < 32 && !matches!(b, 9 | 10 | 13))
            && bytes.len() >= 48
            && super::files::digest(bytes) == font.sha256,
    )?;
    let signature: &[u8; 4] = match font.path.as_str() {
        "assets/font.ttf" => b"\0\x01\0\0",
        "assets/font.otf" => b"OTTO",
        "assets/font.woff" => b"wOFF",
        "assets/font.woff2" => b"wOF2",
        _ => return Err(BAD_PACKAGE.into()),
    };
    check(bytes.starts_with(signature))?;
    if matches!(signature, b"wOFF" | b"wOF2") {
        check(
            be32(bytes, 8)? == bytes.len()
                && (1..=256).contains(&be16(bytes, 12)?)
                && be32(bytes, 16)? <= 20 * 1024 * 1024,
        )?;
    } else {
        let count = be16(bytes, 4)?;
        let end = 12 + count * 16;
        check((1..=256).contains(&count) && end <= bytes.len())?;
        for index in 0..count {
            let offset = be32(bytes, 20 + index * 16)?;
            check(offset >= end && offset + be32(bytes, 24 + index * 16)? <= bytes.len())?;
        }
    }
    Ok(bytes)
}

pub(super) struct Package {
    pub digest: String,
    pub manifest: Value,
    pub atlas: Vec<u8>,
    pub font: Option<Vec<u8>>,
}

impl Package {
    pub fn parse(input: &[u8]) -> Result<Self> {
        Self::parse_inner(input).map_err(|_| BAD_PACKAGE.into())
    }

    fn parse_inner(input: &[u8]) -> Result<Self> {
        let files = unpack(input)?;
        let raw = files.get("manifest.json").ok_or(BAD_PACKAGE)?;
        let manifest: Manifest = serde_json::from_slice(raw)?;
        let json: Value = serde_json::from_slice(raw)?;
        let compatibility = &manifest.compatibility;
        let platforms: std::collections::HashSet<_> = compatibility.supported_os.iter().collect();
        check(
            matches!(manifest.format_version, 1 | 2)
                && (manifest.format_version == 2
                    || (json.get("ui").is_none() && json["assets"].get("font").is_none()))
                && json.get("ui").is_none_or(Value::is_object)
                && json["assets"].get("font").is_none_or(Value::is_object)
                && label(&manifest.theme_id, 100)
                && label(&manifest.title, 60)
                && label(&manifest.creator_label, 40)
                && label(&manifest.license_id, 80)
                && version(&manifest.version)
                && version(&compatibility.min_app_version)
                && compatibility.renderer_api == 1
                && (1..=3).contains(&platforms.len())
                && platforms.len() == compatibility.supported_os.len()
                && platforms
                    .iter()
                    .all(|os| matches!(os.as_str(), "win32" | "darwin" | "linux"))
                && manifest.layout.preset == "windowsill-v1",
        )?;
        let parse_version = |value: &str| {
            value
                .split('.')
                .filter_map(|part| part.parse::<u16>().ok())
                .collect::<Vec<_>>()
        };
        let platform = if cfg!(windows) {
            "win32"
        } else if cfg!(target_os = "macos") {
            "darwin"
        } else {
            "linux"
        };
        if parse_version(env!("CARGO_PKG_VERSION")) < parse_version(&compatibility.min_app_version)
            || !compatibility.supported_os.iter().any(|os| os == platform)
        {
            return Err("이 앱 버전 또는 OS에서 지원하지 않는 테마예요.".into());
        }
        for (key, color) in [
            ("surface", manifest.palette.surface),
            ("surfaceAlt", manifest.palette.surface_alt),
            ("accent", manifest.palette.accent),
        ] {
            if let Some(color) = color {
                parse_color(&color)?;
            } else {
                check(json["palette"].get(key).is_none())?;
            }
        }
        if let Some(ui) = manifest.ui {
            let contrast = |a: &str, b: &str| -> Result {
                let a = parse_color(a)?;
                let b = parse_color(b)?;
                check((a.max(b) + 0.05) / (a.min(b) + 0.05) >= 4.5)
            };
            for background in [ui.background, ui.panel, ui.sidebar] {
                contrast(&background, &ui.text)?;
                contrast(&background, &ui.muted)?;
            }
            parse_color(&ui.border)?;
            contrast(&ui.accent, &ui.accent_text)?;
        }
        let atlas = files.get("assets/atlas.png").ok_or(BAD_PACKAGE)?;
        validate_png(atlas, &manifest.assets.atlas)?;
        let bounds = &manifest.assets.atlas;
        let fits = |x: usize, y: usize, w: usize, h: usize| {
            x <= bounds.width.saturating_sub(w)
                && w <= bounds.width
                && y <= bounds.height.saturating_sub(h)
                && h <= bounds.height
        };
        for plant in manifest.plants {
            check(
                plant.asset == "atlas"
                    && plant.size == [64, 112]
                    && plant.anchor == [32, 112]
                    && plant.stages.iter().all(|[x, y]| fits(*x, *y, 64, 112)),
            )?;
        }
        check(
            manifest.shelf.asset == "atlas"
                && [
                    manifest.shelf.left,
                    manifest.shelf.repeat,
                    manifest.shelf.right,
                ]
                .iter()
                .all(|[x, y, w, h]| *w == 16 && *h == 26 && fits(*x, *y, *w, *h)),
        )?;
        check(
            matches!(manifest.motion.preset.as_str(), "none" | "sway")
                && manifest.motion.amplitude_px <= 2
                && (2000..=10000).contains(&manifest.motion.period_ms),
        )?;
        let font = manifest
            .assets
            .font
            .as_ref()
            .map(|font| validate_font(font, &files))
            .transpose()?;
        check(files.len() == if font.is_some() { 4 } else { 2 })?;
        Ok(Self {
            digest: super::files::digest(input),
            manifest: json,
            atlas: atlas.clone(),
            font: font.map(Vec::from),
        })
    }

    pub fn asset(&self) -> Value {
        json!({
            "id":self.digest,"manifest":self.manifest,
            "atlas":format!("data:image/png;base64,{}",STANDARD.encode(&self.atlas)),
            "font":self.font.as_ref().map(|bytes| STANDARD.encode(bytes)),
        })
    }

    pub fn catalog_entry(&self) -> Value {
        let mut scopes = Vec::with_capacity(3);
        if self.manifest["ui"].is_object() {
            scopes.push("메인 UI");
        }
        scopes.push("작은 창틀");
        if self.font.is_some() {
            scopes.push("폰트");
        }
        json!({"id":self.digest,"title":self.manifest["title"],"version":self.manifest["version"],"scopes":scopes})
    }
}
