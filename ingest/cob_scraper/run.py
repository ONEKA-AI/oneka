from ingest.cob_scraper.cob_parser import load_cob_csv


def run():
    nairobi_projects = load_cob_csv("data/external/cob_projects_nairobi.csv")
    makueni_projects = load_cob_csv("data/external/cob_projects_makueni.csv")

    cob_projects = nairobi_projects + makueni_projects

    print(f"Loaded {len(nairobi_projects)} Nairobi COB projects")
    print(f"Loaded {len(makueni_projects)} Makueni COB projects")
    print(f"Total COB projects loaded: {len(cob_projects)}")

    print("\n=== SAMPLE COB PROJECTS (FIRST 5) ===")
    for i, project in enumerate(cob_projects[:5], start=1):
        print(f"\nProject {i}")
        print(f"Name      : {project.get('project_name')}")
        print(f"County    : {project.get('county')}")
        print(f"Sector    : {project.get('sector')}")
        print(f"FY        : {project.get('financial_year')}")
        print(f"Start     : {project.get('start_date')}")
        print(f"Expected  : {project.get('expected_end_date')}")
        print(f"Budget    : {project.get('budget_allocated_kes')}")
        print(f"Spent     : {project.get('amount_spent_kes')}")
        print(f"Complete% : {project.get('completion_percent')}")
        print(f"Status    : {project.get('status')}")
        print(f"Source    : {project.get('source_report')}")


if __name__ == "__main__":
    run()