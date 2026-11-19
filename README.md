# 작은 창틀에서 사용한 Codex 스킬

현재 사용 중인 사용자 설치 스킬 5개와 설치 도구를 담았습니다. Codex 기본 스킬과 Figma 같은 플러그인 스킬은 각 PC에서 Codex와 해당 플러그인을 설치하면 제공됩니다.

| 스킬 | 용도 | 출처 |
|---|---|---|
| `impeccable` | UI 설계, 리디자인, 접근성 및 화면 검토 | [Impeccable `skill-v4.10.0`](https://github.com/pbakaus/impeccable/tree/skill-v4.10.0/.agents/skills/impeccable) |
| `plannotator-review` | Git 변경사항 또는 PR을 브라우저에서 검토 | [Plannotator for Codex](https://github.com/backnotprop/plannotator/tree/5f84993b648a466dee512ba12d9302f79b934e4a/apps/codex) |
| `plannotator-annotate` | 문서, HTML, 폴더에 주석 달기 | [Plannotator 스킬 원본](https://github.com/backnotprop/plannotator/tree/5f84993b648a466dee512ba12d9302f79b934e4a/apps/skills/core) |
| `plannotator-last` | Codex의 최근 답변에 주석 달기 | [Plannotator 스킬 원본](https://github.com/backnotprop/plannotator/tree/5f84993b648a466dee512ba12d9302f79b934e4a/apps/skills/core) |
| `step-flow-diagram` | 단계 흐름을 한글 SVG 또는 PNG로 그리기 | 기존 로컬 스킬 · 파일 보관 흐름 샘플 포함 |

## 다른 PC에서 설치

Git과 Python 3가 필요합니다. Windows PowerShell에서 실행합니다.

```powershell
git clone --branch codex-skills --single-branch https://github.com/vaynel/littlepot.git littlepot-codex-skills
cd littlepot-codex-skills
python install.py
```

macOS나 Linux에서는 마지막 명령을 `python3 install.py`로 실행합니다. 기본 설치 경로는 `~/.agents/skills`이고 `--dest 경로`로 바꿀 수 있습니다. 설치 후 Codex를 다시 열면 스킬을 사용할 수 있습니다. [Codex 스킬 문서](https://developers.openai.com/codex/skills)

기존 설치를 갱신하려면 이 폴더에서 `git pull --ff-only`를 실행한 다음 Windows에서는 `python install.py --update`, macOS나 Linux에서는 `python3 install.py --update`를 실행합니다. 내용이 다른 스킬의 이전 버전은 `skills` 폴더 옆의 `codex-skills-backup-*` 폴더에 보관합니다.

## 실행에 필요한 도구

- Impeccable 명령은 처음 실행할 때 플랫폼에 맞는 엔진을 내려받습니다. `impeccable` 실행 스크립트와 Windows용 `impeccable.cmd`를 포함했습니다. [Impeccable](https://github.com/pbakaus/impeccable)
- Plannotator 스킬 3개는 `plannotator` CLI가 필요합니다. 공식 설치 안내에 따라 실행 파일을 설치하고 `PATH`에 추가하세요. 스킬만 사용할 때는 공식 설치 도구의 최소 설치 옵션을 사용할 수 있습니다. [Plannotator 설치](https://github.com/backnotprop/plannotator#install)
- `step-flow-diagram`은 Python 3로 SVG를 생성합니다. PNG가 필요하면 `rsvg-convert`와 한글을 지원하는 글꼴을 설치하세요.

`install.py`는 스킬 디렉터리를 복사합니다. 실행 도구, Codex 플러그인과 계정 연결은 사용하는 PC에서 설치하고 설정합니다. 외부 스킬의 원본 라이선스와 고지문은 [`licenses`](licenses/) 폴더에 있습니다.
