from ingest.ppip_scraper.run import run as fetch_ppip_tenders
from ingest.cob_scraper.cob_parser import load_cob_csv
from ingest.cob_scraper.cross_reference import cross_reference_tenders

def run():
    # Load COB projects
    cob_projects = load_cob_csv("data/external/cob_projects.csv")

    # Fetch tenders
    tenders = fetch_ppip_tenders()

    # Cross-reference COB
    tenders_with_cob = cross_reference_tenders(tenders, cob_projects)

    # Print first 5 results
    print("=== SAMPLE CROSS-REFERENCED TENDERS ===\n")
    for i, t in enumerate(tenders_with_cob[:5], 1):
        print(f"{i}. {t['title']}")
        print(f"   Published      : {t.get('published')}")
        print(f"   Close date     : {t.get('close')}")
        print(f"   Planned End    : {t.get('planned_end_date')}")
        print(f"   Stalled?       : {t.get('stalled')}\n")

if __name__ == "__main__":
    run()
