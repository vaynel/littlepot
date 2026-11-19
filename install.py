"""Install this collection for Codex, Claude Code, or both."""

import argparse
import os
from pathlib import Path
import shutil
import sys
from tempfile import TemporaryDirectory, mkdtemp


def skill_files(folder):
    return {
        file.relative_to(folder): file.read_bytes()
        for file in folder.rglob("*")
        if file.is_file() and file.suffix != ".pyc" and "__pycache__" not in file.parts
    }


def install_skills(skills, destination, update):
    destination.mkdir(parents=True, exist_ok=True)

    backup = None
    conflicts = []
    for skill in sorted(skills, key=lambda folder: folder.name):
        target = destination / skill.name
        if target.is_symlink() or (target.exists() and not target.is_dir()):
            conflicts.append(target)
            continue
        if target.exists():
            if skill_files(skill) == skill_files(target):
                print(f"Already installed: {skill.name}")
                continue
            if not update:
                conflicts.append(target)
                continue

        with TemporaryDirectory(prefix=".skill-install-", dir=destination.parent) as temp:
            staged = Path(temp) / skill.name
            shutil.copytree(skill, staged, ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
            saved = None
            if target.exists():
                if not update:
                    conflicts.append(target)
                    continue
                if backup is None:
                    backup = Path(mkdtemp(prefix="codex-skills-backup-", dir=destination.parent))
                saved = backup / skill.name
                target.rename(saved)
            try:
                staged.rename(target)
            except OSError:
                if saved is not None:
                    saved.rename(target)
                raise
        print(f"Installed: {skill.name}")

    if backup is not None:
        print(f"Previous versions: {backup}")
    for path in conflicts:
        print(f"Existing entry preserved: {path}", file=sys.stderr)
    return int(bool(conflicts))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", choices=("both", "codex", "claude"), help="Default: both (codex with --dest alone).")
    parser.add_argument("--dest", type=Path, help="Override the skills directory for one target.")
    parser.add_argument("--update", action="store_true", help="Replace changed skills after backing them up.")
    args = parser.parse_args()
    target = args.target or ("codex" if args.dest is not None else "both")
    if target == "both" and args.dest is not None:
        parser.error("Use --dest with a single target.")

    root = Path(__file__).resolve().parent
    codex_source = root / ".agents" / "skills"
    claude_source = root / "variants" / "claude"
    codex_skills = {item.parent.name: item.parent for item in codex_source.glob("*/SKILL.md")}
    claude_variants = {item.parent.name: item.parent for item in claude_source.glob("*/SKILL.md")}
    claude_home = Path(os.environ.get("CLAUDE_CONFIG_DIR") or Path.home() / ".claude")
    destinations = {
        "codex": (codex_skills, Path.home() / ".agents" / "skills"),
        "claude": ({**codex_skills, **claude_variants}, claude_home / "skills"),
    }
    selected = destinations if target == "both" else (target,)
    planned = []
    for name in selected:
        skills, default = destinations[name]
        destination = (args.dest or default).expanduser().resolve()
        if any(destination == folder or folder in destination.parents for folder in (codex_source, claude_source)):
            parser.error("Choose a destination outside the bundled skills directories.")
        planned.append((name, skills, destination))

    if len({destination for _, _, destination in planned}) != len(planned):
        parser.error("Codex and Claude Code need separate skills directories.")

    status = 0
    for name, skills, destination in planned:
        print(f"{name}: {destination}")
        status |= install_skills(skills.values(), destination, args.update)
    return status


if __name__ == "__main__":
    raise SystemExit(main())
