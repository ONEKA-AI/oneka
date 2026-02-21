from .scraper import fetch_tender_json
from .parser import parse_tender_list

START_DATE = "2024-01-01"
END_DATE = "2025-12-31"
MAX_PAGES = 10


def run():
    all_tenders = []

    for page in range(1, MAX_PAGES + 1):
        print(f"Fetching page {page}...")

        try:
            raw_json = fetch_tender_json(
                page=page,
                start_date=START_DATE,
                end_date=END_DATE
            )

            tenders = parse_tender_list(raw_json)
            all_tenders.extend(tenders)

        except Exception as e:
            print(f"Error fetching page {page}: {e}")

    print(f"\nFetched {len(all_tenders)} tenders")
    return all_tenders


if __name__ == "__main__":
    run()
