"""Copy a small, explicit set of game sources for presentation context."""
from datetime import datetime, timezone, timedelta
from hashlib import sha256
from pathlib import Path
import json
import shutil

SHOW = Path(__file__).resolve().parents[1]
REPO = SHOW.parent
# Chỉ thêm các nguồn người dùng chọn bổ sung vào bản show.
SOURCES = []


def main():
    if not SOURCES:
        print("No sources selected. Snapshot unchanged.")
        return
    # Preflight all inputs before changing an existing snapshot.
    for relative in SOURCES:
        source = (REPO / relative).resolve()
        if not source.is_relative_to(REPO) or not source.is_file():
            raise SystemExit(f"Missing or invalid source: {relative}")
    files = []
    for relative in SOURCES:
        source = REPO / relative
        destination = SHOW / "context/game" / Path(relative).relative_to("Game")
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
        files.append({
            "source": relative,
            "copy": destination.relative_to(SHOW).as_posix(),
            "sha256": sha256(destination.read_bytes()).hexdigest(),
        })
    manifest = {"capturedAt": datetime.now(timezone(timedelta(hours=7))).isoformat(timespec="seconds"), "files": files}
    (SHOW / "context/manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Copied {len(files)} source files. Review data/ and snapshotDate before presenting.")


if __name__ == "__main__":
    main()
