use super::{folder_import, intelligence, text, Result};
use chrono::Datelike;
use regex::Regex;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{
    collections::{BTreeMap, BTreeSet},
    path::{Path, PathBuf},
    sync::LazyLock,
};

const TYPES: [(&str, &str, &[&str]); 5] = [
    (
        "documents",
        "문서",
        &[
            "pdf", "txt", "md", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "hwp", "hwpx", "csv",
            "rtf",
        ],
    ),
    (
        "images",
        "이미지",
        &[
            "jpg", "jpeg", "png", "gif", "webp", "heic", "bmp", "tif", "tiff", "svg",
        ],
    ),
    ("video", "영상", &["mp4", "mov", "mkv", "avi", "webm"]),
    (
        "audio",
        "음악",
        &["mp3", "wav", "flac", "aac", "m4a", "ogg"],
    ),
    ("archives", "압축", &["zip", "7z", "rar", "tar", "gz"]),
];

#[derive(Clone, Deserialize, Serialize)]
pub(super) struct Policy {
    pub mode: String,
    pub remember: bool,
    pub protect: bool,
    pub exclusions: Vec<String>,
    pub targets: BTreeMap<String, String>,
    pub terms: Vec<Term>,
}

#[derive(Clone, Deserialize, Serialize)]
pub(super) struct Term {
    word: String,
    folder: String,
}

pub(super) fn relative(value: &str) -> Result<String> {
    let clean = value.trim().replace('\\', "/");
    if clean.encode_utf16().count() > 240
        || clean.split('/').count() > 8
        || clean
            .split('/')
            .any(|part| !folder_import::valid_part(part))
    {
        return Err("관리 폴더 안의 일반 하위 폴더 이름을 입력해 주세요.".into());
    }
    Ok(clean)
}

impl Policy {
    pub fn parse(value: &Value) -> Result<Self> {
        let legacy = value.is_null();
        let mode = if legacy {
            "existing"
        } else {
            text(&value["mode"])?
        };
        if !matches!(mode, "existing" | "type" | "name" | "date") {
            return Err("정리 기준을 선택해 주세요.".into());
        }
        let mut targets = BTreeMap::new();
        for (key, name, _) in TYPES {
            let target = value["targets"][key]
                .as_str()
                .filter(|value| !value.is_empty())
                .unwrap_or(name);
            targets.insert(key.to_owned(), relative(target)?);
        }
        let mut exclusions = Vec::new();
        let mut terms = Vec::new();
        if !legacy {
            let excluded = value["exclusions"]
                .as_array()
                .filter(|v| v.len() <= 40)
                .ok_or("정리 범위를 확인해 주세요.")?;
            for exclude in excluded {
                exclusions.push(relative(text(exclude)?)?);
            }
            let values = value["terms"]
                .as_array()
                .filter(|v| v.len() <= 30)
                .ok_or("이름 단어를 확인해 주세요.")?;
            for value in values {
                let word = intelligence::normalize(text(&value["word"])?.trim());
                if word.is_empty() || word.encode_utf16().count() > 40 {
                    return Err("이름 단어를 입력해 주세요.".into());
                }
                terms.push(Term {
                    word,
                    folder: relative(text(&value["folder"])?)?,
                });
            }
        }
        if mode == "name" && terms.is_empty() {
            return Err("이름 단어와 목적지를 한 개 이상 지정해 주세요.".into());
        }
        Ok(Self {
            mode: mode.to_owned(),
            remember: legacy || value["remember"] == true,
            protect: !legacy && value["protect"] != false,
            exclusions,
            targets,
            terms,
        })
    }

    pub fn destination(&self, source: &Path) -> (Option<PathBuf>, &'static str) {
        let name = intelligence::normalize(
            source
                .file_name()
                .and_then(|name| name.to_str())
                .unwrap_or_default(),
        );
        match self.mode.as_str() {
            "type" => {
                let ext = Path::new(&name)
                    .extension()
                    .and_then(|ext| ext.to_str())
                    .unwrap_or_default();
                if let Some((key, name, _)) = TYPES.iter().find(|(_, _, exts)| exts.contains(&ext))
                {
                    let target = self.targets.get(*key).map(String::as_str).unwrap_or(name);
                    return (
                        Some(PathBuf::from(target)),
                        "확장자에 따른 파일 종류 기준이에요.",
                    );
                }
                (None, "분류할 수 없는 파일 형식이에요. 직접 확인해 주세요.")
            }
            "name" => {
                let matched: BTreeSet<_> = self
                    .terms
                    .iter()
                    .filter(|term| name.contains(&term.word))
                    .map(|term| &term.folder)
                    .collect();
                match matched.len() {
                    0 => (None, "지정한 이름 단어가 없어요."),
                    1 => (
                        matched.first().map(PathBuf::from),
                        "내가 지정한 이름 단어와 일치해요.",
                    ),
                    _ => (None, "이름 단어가 여러 목적지와 일치해요."),
                }
            }
            "date" => {
                static DATE: LazyLock<Regex> = LazyLock::new(|| {
                    Regex::new(r"[0-9]{4}(?:-[0-9]{2}-[0-9]{2}|[0-9]{4})").unwrap()
                });
                let dates = DATE
                    .find_iter(&name)
                    .filter(|interval| {
                        let bytes = name.as_bytes();
                        (interval.start() == 0 || !bytes[interval.start() - 1].is_ascii_digit())
                            && bytes
                                .get(interval.end())
                                .is_none_or(|b| !b.is_ascii_digit())
                    })
                    .collect::<Vec<_>>();
                if dates.len() != 1 {
                    return (None, "파일명에 날짜가 없거나 여러 개예요.");
                }
                if let Some(date) =
                    intelligence::parse_date(dates[0].as_str()).filter(|date| date.year() >= 1900)
                {
                    return (
                        Some(PathBuf::from(format!(
                            "{}/{:02}",
                            date.year(),
                            date.month()
                        ))),
                        "파일명에 있는 유효한 날짜의 연도와 월이에요.",
                    );
                }
                (None, "파일명 날짜가 올바르지 않아요.")
            }
            _ => (None, ""),
        }
    }

    pub fn protected(&self, root: &Path, path: &Path) -> bool {
        if self
            .exclusions
            .iter()
            .any(|part| path.starts_with(root.join(part)))
        {
            return true;
        }
        if !self.protect {
            return false;
        }
        path.ancestors()
            .take_while(|folder| folder.starts_with(root))
            .any(|folder| {
                [
                    ".git",
                    ".obsidian",
                    "package.json",
                    "pyproject.toml",
                    "Cargo.toml",
                    "go.mod",
                ]
                .iter()
                .any(|marker| folder.join(marker).exists())
                    || std::fs::read_dir(folder).ok().is_some_and(|entries| {
                        entries.flatten().any(|entry| {
                            entry
                                .path()
                                .extension()
                                .and_then(|ext| ext.to_str())
                                .is_some_and(|ext| {
                                    ["sln", "xcodeproj", "app"]
                                        .iter()
                                        .any(|expected| ext.eq_ignore_ascii_case(expected))
                                })
                        })
                    })
            })
    }
}
