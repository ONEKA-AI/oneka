# ingest/ppip_scraper/run.py
from .scraper import fetch_tender_json
from .parser import parse_tender_json
from .storage import save_snapshot_json
from .config import MAX_PAGES

def run():
    """
    Fetch up to 100 tenders from tenders.go.ke and save JSON snapshots for audit.
    Returns a list of tender dicts.
    """
    all_tenders = []
    perpage = 50  # fetch 50 tenders per page → 100 tenders in 2 pages

    for page in range(1, MAX_PAGES + 1):
        print(f"Fetching page {page}...")
        try:
            json_data = fetch_tender_json(page, perpage)
        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            continue

        # Save JSON snapshot for audit
        snapshot = save_snapshot_json(json_data, source=f"ppip_page_{page}")

        # Parse tenders
        tenders = parse_tender_json(json_data)

        # Annotate each tender with page and snapshot
        for t in tenders:
            t["source_page"] = page
            t["snapshot_path"] = snapshot["path"]

        all_tenders.extend(tenders)

        # Stop once we have 100 tenders
        if len(all_tenders) >= 100:
            break

    return all_tenders[:100]

if __name__ == "__main__":
    tenders = run()
    print(f"\nFetched {len(tenders)} tenders\n")
    for t in tenders[:5]:  # print first 5 for verification
        print(f"Title: {t['title']}")
        print(f"URL: {t['url']}")
        print(f"Close date: {t['close_at']}")
        print(f"Published: {t['published_at']}")
        print(f"Snapshot path: {t['snapshot_path']}\n")
