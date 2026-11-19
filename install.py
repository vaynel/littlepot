"""Install this collection into a Codex user skills directory."""

import argparse
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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dest", type=Path, default=Path.home() / ".agents" / "skills")
    parser.add_argument("--update", action="store_true", help="Replace changed skills after backing them up.")
    args = parser.parse_args()

    source = Path(__file__).resolve().parent / ".agents" / "skills"
    destination = args.dest.expanduser().resolve()
    if destination == source or source in destination.parents:
        parser.error("Choose a destination outside the bundled skills directory.")
    destination.mkdir(parents=True, exist_ok=True)

    backup = None
    conflicts = []
    for definition in sorted(source.glob("*/SKILL.md")):
        skill = definition.parent
        target = destination / skill.name
        if target.is_symlink() or (target.exists() and not target.is_dir()):
            conflicts.append(target)
            continue
        if target.exists():
            if skill_files(skill) == skill_files(target):
                print(f"Already installed: {skill.name}")
                continue
            if not args.update:
                conflicts.append(target)
                continue

        with TemporaryDirectory(prefix=".skill-install-", dir=destination.parent) as temp:
            staged = Path(temp) / skill.name
            shutil.copytree(skill, staged, ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
            saved = None
            if target.exists():
                if not args.update:
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


if __name__ == "__main__":
    raise SystemExit(main())
