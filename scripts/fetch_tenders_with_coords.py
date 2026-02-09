# scripts/fetch_tenders_with_coords.py
from ingest.ppip_scraper.run import run as fetch_ppip_tenders
from ingest.registry_matching.kmhfl import load_cached_facilities
from ingest.geolocation.geolocate import assign_coordinates
import json
import os

OUTPUT_FILE = "data/processed/tenders_with_coords.json"
os.makedirs("data/processed", exist_ok=True)

# 1️⃣ Fetch 100 tenders
tenders = fetch_ppip_tenders()

# 2️⃣ Load KMHFL facilities (from cache or API)
facilities = load_cached_facilities()

# 3️⃣ Assign coordinates
tenders_with_coords = assign_coordinates(tenders, facilities)

# 4️⃣ Save processed tenders
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(tenders_with_coords, f, indent=2, ensure_ascii=False)

print(f"Saved {len(tenders_with_coords)} tenders with coordinates to {OUTPUT_FILE}")
