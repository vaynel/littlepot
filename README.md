# 작은 창틀 0.6.32

작은 창틀의 기본 개발·배포 대상은 Tauri와 Rust입니다. 관리 창과 위젯은 기존 HTML·CSS·JavaScript 화면을 사용합니다. Rust 백엔드가 파일 정리, 복사·이동, 버전 보관과 복원, 분류 규칙, 로컬 테마와 테마 서버 통신을 처리합니다. Windows 앱은 WebView2에서 화면을 표시하며, 로컬 버전 보관에 번들 SQLite와 libgit2를 사용합니다.

**내 파일**에서 관리 폴더의 상태와 진행률을 상단에서 확인할 수 있습니다. 그 아래의 파일 목록과 버전 이력은 창의 작업 영역 전체를 사용합니다.

**보관 공간 → 버전 보관 위치**에서 로컬 드라이브나 폴더를 선택할 수 있습니다. 선택한 위치에 보관소를 만들고 기존 버전을 검증한 뒤 전환합니다. 원본 파일, 관리 목록, 분류 규칙과 테마는 기존 위치에 유지됩니다.

## Windows에서 설치

Windows x64 노트북에서는 설치 파일을 내려받아 실행하면 됩니다. [Windows x64 설치 파일 다운로드](https://raw.githubusercontent.com/vaynel/littlepot/main/downloads/windows/littlepot-x64-setup.exe)

## 개발 실행과 Windows 빌드

Windows x64에서 Node.js 22.12 이상, Rust MSVC 도구 체인, Microsoft C++ Build Tools 및 WebView2가 필요합니다. Node.js는 개발과 패키징에 사용합니다. WebView2가 없는 컴퓨터에서는 NSIS 설치 프로그램이 런타임을 내려받습니다. [Tauri 개발 환경](https://v2.tauri.app/start/prerequisites/) · [Windows 배포](https://v2.tauri.app/distribute/windows-installer/)

```powershell
npm.cmd ci
npm.cmd start
npm.cmd run build
```

Windows 설치 파일은 `src-tauri/target/release/bundle/nsis/`에 생성됩니다. 기존 Tauri·Node.js판은 비교와 데이터 이전에 사용할 수 있습니다. 이전 방식이 필요한 경우 `npm.cmd run start:node` 또는 `npm.cmd run build:node`로 실행합니다.

## 기존 프로필의 기록 가져오기

Rust판은 `%LOCALAPPDATA%\studio.windowsill.rust\garden-rust`를 사용합니다. 처음 이전할 때는 빈 Rust 프로필에서 원본 데이터 폴더를 지정합니다. 기존 Node.js 앱과 Rust 앱을 모두 종료한 뒤 아래 명령을 실행합니다. 가져온 관리 폴더는 일시 중지 상태에서 시작합니다.

```powershell
$env:WINDOWSILL_IMPORT_NODE_DATA_DIR = Join-Path $env:LOCALAPPDATA 'studio.windowsill.tauri\garden-v1'
npm.cmd start
Remove-Item Env:WINDOWSILL_IMPORT_NODE_DATA_DIR
```

기존 Electron판에서 가져올 때는 원본 폴더로 `%APPDATA%\little-windowsill\garden-v1`을 지정합니다.

설치한 앱에서는 위 환경 변수를 설정한 뒤 같은 PowerShell에서 설치 폴더의 `little-windowsill-rust.exe`를 실행해도 됩니다. 이전 Rust판으로 같은 원본을 가져온 적이 있다면 같은 명령을 다시 실행합니다. 이번에 추가된 규칙과 테마를 한 번 가져오며, 충돌하는 규칙과 이미 적용한 Rust 테마 설정은 Rust 프로필의 값을 우선합니다.

원본 폴더에는 `garden.sqlite`, `version-store/versions.sqlite`, `version-store/history.git`가 있어야 합니다. 화분과 일부 설정, 사용자 지정 폰트, 관리 상태, 확정된 버전과 이력을 가져옵니다. 분류 규칙의 켜짐 상태, 파일명 규칙과 예외, 학습된 추천, 저장한 폴더 정리 정책도 포함됩니다. `theme-store`에서 검증을 통과한 사용자 테마와 화면별 적용 상태, 색상·동작 설정, 직전 선택을 가져옵니다. 작업 대기열과 서버 로그인은 새 프로필에서 시작합니다.

같은 경로에서 파일이 교체된 이력은 각 파일 ID와 보관 버전을 유지합니다.

원본 SQLite와 WAL 파일은 임시 폴더로 복사한 뒤 복사본을 읽습니다. SQLite가 WAL 인덱스를 다시 만들어도 임시 폴더에만 기록됩니다. 새 프로필에 저장하기 전에 버전 파일과 테마 패키지의 SHA-256을 확인합니다. [SQLite WAL 문서](https://sqlite.org/wal.html)

## 수정할 파일

| 작업 | 파일 |
| --- | --- |
| 화면 동작과 레이아웃 | [JavaScript](renderer/assets/index-qT_XlmHI.js) · [CSS](renderer/assets/index-C1qDJFlN.css) |
| 창·위젯·트레이·파일 대화상자 | [Tauri 데스크톱 호스트](src-tauri/src/desktop.rs) |
| 화면과 백엔드의 요청·이벤트 | [화면 브리지](renderer/tauri-bridge.js) · [Rust 백엔드](src-tauri/src/rust_backend/mod.rs) |
| 파일 정리·복구·추천 | [복사·이동](src-tauri/src/rust_backend/workflow.rs) · [폴더 정리](src-tauri/src/rust_backend/organizer.rs) · [분류 규칙](src-tauri/src/rust_backend/intelligence.rs) |
| 버전 보관·비교·복원과 삭제 | [저장소](src-tauri/src/rust_backend/store.rs) · [기록 삭제](src-tauri/src/rust_backend/record_deletion.rs) |
| 테마 설치와 서버 통신 | [로컬 테마](src-tauri/src/rust_backend/themes.rs) · [테마 패키지](src-tauri/src/rust_backend/theme_package.rs) · [서버](src-tauri/src/rust_backend/theme_gallery.rs) |
