from pathlib import Path
from shutil import copy2, copytree, rmtree


ROOT = Path(__file__).resolve().parent
FRONTEND = ROOT / "frontend"
PUBLIC = ROOT / "public"


def main() -> None:
    if PUBLIC.exists():
        rmtree(PUBLIC)

    PUBLIC.mkdir(parents=True, exist_ok=True)

    for name in ("pages", "styles", "scripts"):
        source = FRONTEND / name
        target = PUBLIC / name
        if source.exists():
            copytree(source, target)

    favicon = FRONTEND / "favicon.ico"
    if favicon.exists():
        copy2(favicon, PUBLIC / "favicon.ico")


if __name__ == "__main__":
    main()
