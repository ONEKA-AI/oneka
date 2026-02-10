
# Ingest Folder

This folder contains modules responsible for **data ingestion and preprocessing** in ONEKA AI.

## Subfolders
- `ppip_scraper/` — Scrapes tender data from [tenders.go.ke](https://tenders.go.ke).  
- `registry_matching/` — Matches tender projects to KMHFL health facilities.  
- `geolocation/` — Uses fuzzy string matching to assign latitude/longitude coordinates.

## Purpose
- Fetch and normalize tender data.
- Map tenders to official health facility locations.
- Prepare datasets for satellite analysis and ML.

## Usage Example
Run the integration script that uses these modules:

```bash
python3 -m scripts.fetch_tenders_with_coords
