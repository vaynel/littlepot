# 작은 창틀에서 사용한 Codex·Claude Code 스킬

이 저장소의 스킬 5개를 Codex와 Claude Code에서 사용할 수 있습니다. Impeccable과 Plannotator는 각 도구에 맞는 공식 스킬 사본을 설치하고, `step-flow-diagram`은 두 도구에서 같은 구현을 사용합니다.

| 스킬 | 용도 | 출처 |
|---|---|---|
| `impeccable` | UI 설계, 리디자인, 접근성 및 화면 검토 | [Codex용](https://github.com/pbakaus/impeccable/tree/skill-v4.10.0/.agents/skills/impeccable) · [Claude Code용](https://github.com/pbakaus/impeccable/tree/skill-v4.10.0/.claude/skills/impeccable) |
| `plannotator-review` | Git 변경사항 또는 PR을 브라우저에서 검토 | [Codex용](https://github.com/backnotprop/plannotator/tree/5f84993b648a466dee512ba12d9302f79b934e4a/apps/skills/core) · [Claude Code용](https://github.com/backnotprop/plannotator/tree/5f84993b648a466dee512ba12d9302f79b934e4a/apps/skills/claude) |
| `plannotator-annotate` | 문서, HTML, 폴더에 주석 달기 | Plannotator |
| `plannotator-last` | 현재 도구의 최근 답변에 주석 달기 | Plannotator |
| `step-flow-diagram` | 단계 흐름을 한글 SVG 또는 PNG로 그리기 | 로컬 스킬 · 파일 보관 흐름 예제 포함 |

## 다른 PC에서 설치

Git과 Python 3가 필요합니다. 아래 명령은 두 도구에 동시에 설치합니다.

```powershell
git clone --branch codex-skills --single-branch https://github.com/vaynel/littlepot.git littlepot-codex-skills
cd littlepot-codex-skills
python install.py
```

macOS와 Linux에서는 `python3 install.py`를 쓰세요. 하나만 설치하려면 `--target codex` 또는 `--target claude`를 붙이세요.

| 도구 | 설치 위치 | 호출 예 |
|---|---|---|
| Codex | `~/.agents/skills` | `$impeccable`, `$plannotator-review` |
| Claude Code | `~/.claude/skills` | `/impeccable`, `/plannotator-review` |

Claude Code에서 `CLAUDE_CONFIG_DIR`을 사용하면 해당 폴더의 `skills`에 설치합니다. 대상 하나의 경로를 직접 정하려면 `python install.py --target claude --dest 경로`처럼 실행하세요. 기존 `--dest` 단독 사용은 Codex용입니다. 설치한 뒤 해당 도구에서 새 세션을 여세요. [Codex 스킬 문서](https://developers.openai.com/codex/skills) · [Claude Code 스킬 문서](https://code.claude.com/docs/en/skills)

## 갱신

기존 클론에서 실행합니다.

```powershell
git pull --ff-only
python install.py --update
```

내용이 달라 교체되는 스킬은 해당 도구의 `skills` 폴더 옆 `codex-skills-backup-*` 폴더에 이전 사본을 보관합니다. 갱신할 도구를 고를 때도 `--target`을 쓸 수 있습니다.

## 실행에 필요한 도구

- Impeccable 명령은 처음 실행할 때 플랫폼에 맞는 엔진을 내려받습니다. macOS·Linux 실행 스크립트와 Windows용 `impeccable.cmd`를 포함했습니다. [Impeccable](https://github.com/pbakaus/impeccable)
- Plannotator 스킬은 `PATH`에서 `plannotator` CLI를 사용합니다. 공식 설치 도구의 최소 설치 옵션으로 CLI만 추가할 수 있습니다. [Plannotator 설치](https://github.com/backnotprop/plannotator#install)
- `step-flow-diagram`은 Python 3로 SVG를 생성합니다. PNG가 필요하면 `rsvg-convert`와 한글 글꼴을 설치하세요.

설치 스크립트의 작업 범위는 스킬 파일 복사입니다. 실행 도구, 계정과 플러그인 설정은 각 PC에서 관리합니다. 외부 스킬의 라이선스와 고지문은 [`licenses`](licenses/) 폴더에 있습니다.
