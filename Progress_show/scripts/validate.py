"""Validate editable data, relationships, local files and snapshot integrity."""
from pathlib import Path
from hashlib import sha256
from datetime import date
from urllib.parse import urlsplit
import json
import re
import sys

SHOW = Path(__file__).resolve().parents[1]
STATUSES = {"done", "active", "planned", "blocked"}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def local_file(relative):
    require(isinstance(relative, str) and "\\" not in relative and not re.search(r"[:?#]", relative), f"Invalid path: {relative}")
    path = (SHOW / relative).resolve()
    require(path.is_relative_to(SHOW) and path.is_file(), f"Missing local file: {relative}")
    return path


def read_data(name):
    text = (SHOW / f"data/{name}.js").read_text(encoding="utf-8")
    prefix = f"window.OCEANBOUND.{name} = "
    require(text.count(prefix) == 1, f"Expected one assignment for {name}")
    payload = text.split(prefix, 1)[1].strip()
    require(payload.endswith(";"), f"Missing semicolon: {name}")
    return json.loads(payload[:-1])


def validate():
    project, journey, tasks, assets = [read_data(name) for name in ("project", "journey", "tasks", "assets")]
    for key in ("name", "phase", "description", "scopeNote"):
        require(isinstance(project.get(key), str) and project[key].strip(), f"Missing project.{key}")
    for key in ("snapshotDate", "engine"):
        require(isinstance(project.get(key), str), f"Missing project.{key}")
    if project["snapshotDate"]:
        date.fromisoformat(project["snapshotDate"])
    for name, items in (("journey", journey), ("tasks", tasks), ("assets", assets)):
        require(isinstance(items, list), f"{name} must be an array")
        ids = []
        for item in items:
            require(re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", item.get("id", "")), f"Invalid ID in {name}")
            ids.append(item["id"])
            for key in ("title", "description"):
                require(isinstance(item.get(key), str) and item[key].strip(), f"Missing {name}.{key}")
            require(item.get("status") in STATUSES, f"Invalid status: {item['id']}")
        require(len(ids) == len(set(ids)), f"Duplicate IDs: {name}")
    manifest = json.loads(local_file("context/manifest.json").read_text(encoding="utf-8"))
    copies = {}
    for entry in manifest["files"]:
        require(entry["source"].startswith("Game/") and ".." not in entry["source"].split("/"), "Invalid source path")
        require(entry["source"] not in copies, "Duplicate source in manifest")
        copied = local_file(entry["copy"])
        require(sha256(copied.read_bytes()).hexdigest() == entry["sha256"], f"Snapshot hash mismatch: {entry['copy']}")
        copies[entry["source"]] = entry["copy"]
        if "--compare-source" in sys.argv:
            source = SHOW.parent / entry["source"]
            require(source.is_file() and sha256(source.read_bytes()).hexdigest() == entry["sha256"], f"Snapshot differs from game: {entry['source']}")
    stages = {item["id"] for item in journey}
    asset_ids = {item["id"] for item in assets}
    for item in journey + tasks:
        require(isinstance(item.get("evidence"), list), f"Missing evidence list: {item['id']}")
        if item["status"] == "done":
            require(item["evidence"], f"Done item has no evidence: {item['id']}")
        for source in item["evidence"]:
            require(source in copies, f"Evidence not snapshotted: {source}")
    for item in tasks:
        require(isinstance(item.get("category"), str) and item["category"], f"Missing category: {item['id']}")
        require(item.get("milestone") in stages, f"Unknown milestone: {item['id']}")
        require(isinstance(item.get("tags"), list) and all(isinstance(tag, str) for tag in item["tags"]), f"Invalid tags: {item['id']}")
        require(isinstance(item.get("assetIds"), list) and set(item["assetIds"]) <= asset_ids, f"Unknown asset ID: {item['id']}")
    for asset in assets:
        local_file(asset["preview"])
        for key in ("previewAlt", "type", "note"):
            require(isinstance(asset.get(key), str) and asset[key], f"Missing asset.{key}: {asset['id']}")
        require(isinstance(asset.get("tags"), list) and all(isinstance(tag, str) for tag in asset["tags"]), f"Invalid tags: {asset['id']}")
        require(isinstance(asset.get("files"), list) and asset["files"], f"No files: {asset['id']}")
        for entry in asset["files"]:
            require(copies.get(entry["source"]) == entry["copy"], f"Asset/manifest mismatch: {entry['source']}")
            local_file(entry["copy"])
    design = read_data("design")
    require(isinstance(design, list), "design must be an array")
    design_ids = set()
    for section in design:
        key = section.get("id", "")
        require(isinstance(key, str) and re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", key), "Invalid design ID")
        require(key not in design_ids, f"Duplicate design ID: {key}")
        # Parents precede their children, so a cycle cannot be introduced.
        require(section.get("parent") is None or section["parent"] in design_ids, f"Unknown or unordered design parent: {key}")
        design_ids.add(key)
        require(isinstance(section.get("number"), str), f"Missing design.number: {key}")
        require(isinstance(section.get("title"), str) and section["title"].strip(), f"Missing design.title: {key}")
        require(isinstance(section.get("content"), list) and all(isinstance(p, str) and p.strip() for p in section["content"]), f"Invalid design.content: {key}")
        sources = section.get("sources", [])
        require(isinstance(sources, list), f"Invalid design.sources: {key}")
        for source in sources:
            require(isinstance(source, dict), f"Invalid design source: {key}")
            require(isinstance(source.get("label"), str) and source["label"].strip(), f"Missing source label: {key}")
            url = source.get("url")
            require(isinstance(url, str) and not re.search(r"[\s\\\x00-\x1f\x7f]", url), f"Invalid source URL: {key}")
            parsed = urlsplit(url)
            require(parsed.scheme == "https" and parsed.hostname and not parsed.username and not parsed.password, f"Source must be an HTTPS URL without credentials: {key}")
    for page in ("main.html", "design.html"):
        html = local_file(page).read_text(encoding="utf-8")
        for relative in re.findall(r'(?:src|href)="([^"#]+)"', html):
            local_file(relative)
    print(f"OK: {len(tasks)} tasks, {len(journey)} stages, {len(assets)} asset groups, {len(design)} document sections, {len(copies)} verified copies.")


if __name__ == "__main__":
    try:
        validate()
    except (ValueError, KeyError, TypeError, OSError) as error:
        raise SystemExit(f"ERROR: {error}")
