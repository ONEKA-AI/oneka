# ingest/ppip_scraper/storage.py
import os
import json
from datetime import datetime

DATA_DIR = "data/raw/ppip"

os.makedirs(DATA_DIR, exist_ok=True)

def save_snapshot_json(data, source: str) -> dict:
    """
    Save JSON snapshot for audit purposes.
    Returns metadata including file path and timestamp.
    """
    timestamp = datetime.now().isoformat(timespec="seconds")
    filename = f"{source}_{timestamp}.json"
    filepath = os.path.join(DATA_DIR, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    return {"path": filepath, "timestamp": timestamp}
