import os
import json
import requests
from datetime import datetime

DATA_DIR = "data/external"
KMHFL_CACHE = os.path.join(DATA_DIR, "kmhfl.json")
os.makedirs(DATA_DIR, exist_ok=True)

KMHFL_API_URL = "https://kmhfl.health.go.ke/api/facilities"

def fetch_kmhfl():
    """
    Fetch the full list of health facilities from KMHFL API.
    Returns a list of facility dicts.
    """
    print("Fetching KMHFL data from API...")
    response = requests.get(KMHFL_API_URL, timeout=30)
    response.raise_for_status()
    facilities = response.json()

    # Save cache for audit / offline use
    save_facilities_cache(facilities)

    print(f"Fetched {len(facilities)} facilities.")
    return facilities

def save_facilities_cache(facilities):
    timestamp = datetime.now().isoformat(timespec="seconds")
    with open(KMHFL_CACHE, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": timestamp,
            "facilities": facilities
        }, f, indent=2, ensure_ascii=False)

def load_cached_facilities():
    """
    Load facilities from cached JSON. Returns list of dicts.
    """
    if not os.path.exists(KMHFL_CACHE):
        return fetch_kmhfl()

    with open(KMHFL_CACHE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("facilities", [])





















































