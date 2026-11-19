# 작은 창틀 개발 가이드

작은 창틀은 관리 폴더에 파일을 정리하고, 변경 이력을 로컬에 보관하며, 정리 활동을 화분의 성장으로 보여 주는 데스크톱 앱이다. 이 문서는 `main`의 0.6.32 버전(`1173215`)을 기준으로 한다.

## 개발 실행

Windows x64 개발 환경에는 Node.js 22.12 이상, Rust MSVC 도구 체인, Microsoft C++ Build Tools, WebView2가 필요하다. 저장소 루트에서 실행한다.

```powershell
npm.cmd ci
npm.cmd start
```

`npm.cmd start`와 `npm.cmd run build`는 모두 `rust-backend` 기능을 켜고 Rust용 Tauri 설정을 적용한다. 설치 파일은 `src-tauri/target/release/bundle/nsis/`에 생성된다. 기존 Node.js 백엔드로 동작을 비교할 때는 `npm.cmd run start:node`를 사용한다. [실행 스크립트](../package.json) · [Rust 설정](../src-tauri/tauri.rust.json)

## 코드 구조

| 영역 | 책임 | 먼저 읽을 코드 |
| --- | --- | --- |
| 화면 | 관리 창과 위젯의 HTML 진입점, 화면 전환, 사용자 입력, 상태 렌더링. Tauri가 저장소의 `renderer/`를 직접 로드한다. | [HTML](../renderer/index.html) · [화면 JavaScript](../renderer/assets/index-qT_XlmHI.js) · [CSS](../renderer/assets/index-C1qDJFlN.css) |
| 화면과 Rust의 연결 | `window.garden`이 화면에 제공하는 메서드, Rust 요청 결과 처리, 상태 변경 및 탐색 이벤트 구독 | [브리지](../renderer/tauri-bridge.js) · [Tauri 명령 진입점](../src-tauri/src/main.rs) |
| 데스크톱 호스트 | 관리 창·위젯의 생성과 배치, 트레이, 파일 대화상자, 운영체제에서 받은 드롭 이벤트 | [desktop.rs](../src-tauri/src/desktop.rs) |
| Rust 백엔드 | 앱 시작과 복구, 요청 분기, 폴더 감시, 화면에 전달할 상태 조합 | [rust_backend/mod.rs](../src-tauri/src/rust_backend/mod.rs) |
| 파일 작업과 저장 | 정리 계획·실행·되돌리기, 파일 식별과 경로 검사, SQLite 기록과 Git 버전 보관 | [workflow.rs](../src-tauri/src/rust_backend/workflow.rs) · [files.rs](../src-tauri/src/rust_backend/files.rs) · [store.rs](../src-tauri/src/rust_backend/store.rs) |
| 기존 Node.js 구현과 빌드 준비 | Node.js 백엔드는 `main/`에 있다. Rust 빌드도 이 디렉터리의 내장 테마 정의를 읽어 JSON을 생성한다. | [Node.js 진입점](../main/main.js) · [빌드 준비](../scripts/prepare-tauri.cjs) |

### 요청 하나가 화면을 갱신하는 과정

예를 들어 ‘내 파일’에서 버전 이력을 열면 화면이 `window.garden.manage("timeline", fileId)`를 호출한다. 브리지는 `invoke("garden", { method, args })`로 전달하고, Rust의 `garden` 명령은 요청을 보낸 창을 확인해 `Backend::call`로 넘긴다. `manage` 분기의 `timeline`은 `Store::timeline`에서 해당 파일의 버전을 최신 순으로 읽는다. 변경을 일으키는 작업은 별도로 `garden:changed` 이벤트를 보내며, 이를 구독한 화면이 `state()`로 현재 상태를 다시 읽는다. [브리지](../renderer/tauri-bridge.js) · [요청 분기](../src-tauri/src/rust_backend/mod.rs) · [화면 구독](../renderer/assets/index-qT_XlmHI.js)

## 주요 기능 흐름

### 1. 관리 폴더 연결과 첫 스캔

1. `bind`가 폴더 선택 창을 열고 파일 수, 용량, 제외 항목을 조사한다. 이때 폴더 식별값과 10분 동안 유효한 미리보기 토큰을 보관한다.
2. 사용자가 확인하면 `manage("confirmRoot", token)`이 폴더 식별값을 다시 확인한다. `Store::register`가 관리 폴더와 화분 연결을 등록한 뒤 감시와 첫 스캔을 시작한다.
3. `watch_loop`는 별도 저장소 연결로 스캔하면서 첫 스캔의 처리 수와 전체 수를 화면에 전달한다. 이후 생성·수정·삭제 이벤트를 모아서 해당 관리 폴더를 다시 확인하고, 60초 주기로 활성 폴더를 점검한다.

‘내 파일’의 진행률은 백엔드의 `state().managed.roots`에서 온다. 폴더 탐색은 `browseFolders`와 `folder-column-files`로 폴더 목록과 선택한 폴더의 파일을 각각 읽는다. 진행률 문제는 `watch_loop`, 목록 문제는 `Store::browse_folders`와 `Store::folder_column_files`에서 추적할 수 있다. [폴더 등록과 감시](../src-tauri/src/rust_backend/mod.rs) · [스캔과 목록 조회](../src-tauri/src/rust_backend/store.rs)

### 2. 위젯에 파일을 놓아 정리하기

1. 위젯에 파일이나 폴더를 놓으면 데스크톱 호스트가 드롭 경로를 토큰과 연결한다. Rust가 해당 창의 토큰에서 경로를 꺼내고, `prepare_import`가 화분에 연결된 활성 폴더를 대상으로 복사 미리보기를 만든다. 위젯은 관리 창을 열고, 관리 창은 `takeReview`로 미리보기를 받는다.
2. 파일만 놓으면 목적지를 추천하고, 폴더를 포함하면 원래 폴더 구조 유지가 기본이다. 추천은 사용자가 만든 분류 규칙, 파일명과 폴더명의 공통 단어, 비슷한 파일을 정리한 이력을 사용한다. 사용자가 목적지나 복사·이동 방식을 바꾸면 `revise`가 계획을 다시 만든다.
3. `execute`는 파일별 작업을 `task_items`에 등록한다. 실행 직전에 원본 식별값과 SHA-256, 대상 폴더와 이름 충돌을 다시 확인한다. 미리보기 후 원본이 바뀐 항목은 사유를 남기고 건너뛴다.
4. 실제 파일을 옮기기 전에 `ops`와 `op_journal`에 작업을 기록한다. 전송이 끝나면 `aftercare`에 버전 보관 작업을 넣고, 목적지 파일의 해시와 보관 버전이 일치하는지 확인한다. 따라서 ‘복사는 끝났는데 보관이 실패한’ 경우 전송 결과와 보관 결과를 각각 조회할 수 있다.

정리 실행 취소는 `undo`가 담당한다. 정리 후 파일이 그대로인지 검사하고, 이동한 파일은 원래 경로가 비어 있을 때 되돌린다. 복사 작업을 취소하면 복사본을 같은 파일시스템의 복구용 이름으로 옮긴다. 앱이 중간에 종료되면 다음 시작 때 `recover`가 저널과 양쪽 경로의 실제 파일을 대조한다. 결과가 모호한 작업은 `needs_review`로 남는다. [드롭 처리](../src-tauri/src/main.rs) · [가져오기 계획](../src-tauri/src/rust_backend/folder_import.rs) · [실행·복구](../src-tauri/src/rust_backend/workflow.rs) · [목적지 추천](../src-tauri/src/rust_backend/intelligence.rs)

### 3. 기존 폴더 일괄 정리

`organize-start`는 이미 관리 중인 폴더를 분석해 검토 목록을 만든다. 정리 정책에는 기존 폴더 활용, 유형별, 이름별, 날짜별 분류가 있다. 사용자는 제안을 선택하고 목적지를 수정하거나 새 폴더 생성을 승인할 수 있다. `organize-approve`는 검토 이후 추천 규칙과 학습 이력이 바뀌었는지 확인한다. 승인된 항목은 최대 20개씩 읽어 공통 파일 전송 코드로 넘긴다.

작업 전체의 상태는 `organize_jobs`, 파일별 상태는 `organize_items`에 남는다. 앱을 다시 열면 분석·실행 중이던 작업은 일시 중지 상태가 되고, 처리 중이던 항목은 실제 작업 기록과 대조한다. 일괄 정리 화면의 선택·승인 문제는 `organizer.rs`, 개별 파일의 전송 문제는 `workflow.rs`에서 확인한다. [일괄 정리](../src-tauri/src/rust_backend/organizer.rs) · [정리 정책](../src-tauri/src/rust_backend/organize_policy.rs)

### 4. 버전 생성, 비교와 복원

기본 Windows 프로필은 `%LOCALAPPDATA%\studio.windowsill.rust\garden-rust`다. 그 아래 `garden-rust.sqlite`에는 관리 폴더, 파일 식별값, 작업 이력, 버전 번호와 해시가 들어간다. 버전의 실제 파일 내용은 기본적으로 `version-store/history.git`의 Git 객체로 저장한다. 사용자가 버전 보관 위치를 변경하면 새 위치에 보관소를 준비하고 검증한 뒤 전환한다. [저장소 초기화](../src-tauri/src/rust_backend/store.rs) · [보관 위치 변경](../src-tauri/src/rust_backend/archive_location.rs)

- **생성** — 스캐너는 파일 식별값과 변경 정보를 기존 기록과 대조한다. 내용을 읽은 경우 SHA-256으로 변경을 판별하며, 새 내용은 Git blob으로 저장하고 SQLite의 `versions`에 파일 ID, 버전 순번, 해시, blob ID를 연결한다.
- **비교** — `compareVersions`는 같은 파일의 두 버전을 읽고 줄 단위 추가·삭제를 계산한다. 비교 대상은 버전당 256 KiB, 1,500줄 이하의 UTF-8 텍스트다.
- **복원** — `restore`는 선택한 버전의 blob을 읽어 SHA-256을 검증하고, ‘다른 이름으로 저장’ 창을 연다. 예를 들어 `회의록.txt`의 두 번째 버전은 `회의록_복원_v2.txt`가 기본 이름이다. [버전 읽기와 비교](../src-tauri/src/rust_backend/store.rs) · [복원 명령](../src-tauri/src/rust_backend/mod.rs)

### 5. 화분 성장과 테마

화분 경험치는 방문 일수와 해당 화분에서 완료된 정리 작업의 보상 합계로 계산한다. 정리를 되돌리면 해당 작업이 완료 집계에서 빠진다. 화면은 경험치 3·10·25에서 각각 새싹, 푸른 잎, 활짝 핀 꽃으로 표시한다. 성장 수치가 다르면 백엔드의 `Core::state`, 수치에 맞는 그림이나 문구가 다르면 화면의 성장 단계와 테마를 확인한다. 테마의 설치·적용, 패키지 읽기, 갤러리 통신은 별도 모듈에 있다. [경험치 집계](../src-tauri/src/rust_backend/mod.rs) · [단계 표시](../renderer/assets/index-qT_XlmHI.js) · [테마 적용](../src-tauri/src/rust_backend/themes.rs) · [테마 패키지](../src-tauri/src/rust_backend/theme_package.rs) · [갤러리](../src-tauri/src/rust_backend/theme_gallery.rs)

## 변경 후 동작을 확인하는 예

파일 정리와 버전 보관을 함께 수정했다면, 빈 테스트 폴더를 화분에 연결하고 첫 스캔이 끝난 뒤 그 폴더 밖의 작은 UTF-8 텍스트 파일을 위젯에 놓는다. 관리 창에서 복사 목적지를 확인하고 실행한다. ‘내 파일’에서 첫 버전이 보이면 **복사된 파일**의 한 줄을 바꾸고 다시 스캔한다. 타임라인에서 두 버전의 차이가 해당 줄인지 확인하고, 첫 버전을 다른 이름으로 복원해 원래 내용과 대조한다.

실행 취소는 별도의 파일로 확인한다. 파일을 이동한 뒤 내용을 바꾸지 않고 되돌리면 원래 위치로 돌아온다. 같은 절차에서 이동 후 내용을 바꾸면 앱이 변경을 감지하고 되돌리기를 중단한다. 이 두 경우로 버전 복원과 작업 실행 취소를 각각 검증할 수 있다.
