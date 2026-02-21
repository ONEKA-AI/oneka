from ingest.openbudget_scraper.search import search_projects
from ingest.openbudget_scraper.parser import parse_project_page
import csv

def run(county: str):
    links = search_projects(county)
    projects = []

    for link in links:
        projects.append(parse_project_page(link))

    # save CSV
    with open(f"data/external/openbudget_{county.lower()}.csv", "w") as f:
        writer = csv.DictWriter(f, fieldnames=["project_name","planned_end_date","allocation","url"])
        writer.writeheader()
        for p in projects:
            writer.writerow(p)

    print(f"Saved {len(projects)} projects to CSV for {county}")

if __name__ == "__main__":
    run("Nairobi")
    run("Makueni")
