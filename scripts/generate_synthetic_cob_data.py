import random
import pandas as pd
from datetime import datetime, timedelta
import os

random.seed(42)

SECTORS = [
    "Roads & Transport",
    "Water & Sanitation",
    "Health",
    "Education",
    "Markets & Trade",
    "Public Works",
    "Housing & Urban Development",
    "Agriculture",
    "Energy",
]

PROJECT_TEMPLATES = {
    "Roads & Transport": [
        "Construction of {place} Access Road",
        "Upgrading of {place} Road to Bitumen Standards",
        "Rehabilitation of {place} Bridge",
        "Construction of {place} Footbridge",
        "Grading and Murraming of {place} Road",
    ],
    "Water & Sanitation": [
        "Drilling and Equipping of Borehole at {place}",
        "Construction of {place} Water Pan",
        "Expansion of {place} Water Supply System",
        "Rehabilitation of {place} Sewer Line",
        "Construction of {place} Water Treatment Plant",
    ],
    "Health": [
        "Construction of {place} Dispensary",
        "Upgrading of {place} Health Centre",
        "Construction of {place} Maternity Wing",
        "Supply of Medical Equipment to {place} Hospital",
        "Rehabilitation of {place} Hospital Ward",
    ],
    "Education": [
        "Construction of {place} ECDE Classroom",
        "Construction of {place} Secondary School Laboratory",
        "Rehabilitation of {place} Primary School",
        "Construction of {place} Dormitory",
        "Supply of Desks to {place} School",
    ],
    "Markets & Trade": [
        "Construction of {place} Market Stalls",
        "Rehabilitation of {place} Market",
        "Construction of {place} Bus Park",
        "Construction of {place} Retail Centre",
    ],
    "Public Works": [
        "Renovation of County Offices at {place}",
        "Construction of {place} Administration Block",
        "Construction of {place} Public Toilet",
        "Rehabilitation of {place} Government Buildings",
    ],
    "Housing & Urban Development": [
        "Construction of Affordable Housing Units at {place}",
        "Upgrading of Street Lighting at {place}",
        "Construction of {place} Drainage System",
    ],
    "Agriculture": [
        "Construction of {place} Irrigation Scheme",
        "Establishment of {place} Dairy Value Chain Facility",
        "Construction of {place} Livestock Market",
    ],
    "Energy": [
        "Installation of Solar Street Lights at {place}",
        "Construction of {place} Mini-Grid",
        "Expansion of Power Supply Network at {place}",
    ],
}

NAIROBI_PLACES = [
    "Kibra", "Embakasi", "Lang'ata", "Westlands", "Dagoretti",
    "Kasarani", "Mathare", "Starehe", "Roysambu", "Kamukunji",
]

MAKUENI_PLACES = [
    "Wote", "Kibwezi", "Mtito Andei", "Mbooni", "Kathonzweni",
    "Makindu", "Kilome", "Mukaa", "Kalawa", "Nguumo",
]

def random_money(min_val=5_000_000, max_val=800_000_000):
    return round(random.uniform(min_val, max_val), 2)

def random_date(start, end):
    delta = end - start
    days = random.randint(0, delta.days)
    return start + timedelta(days=days)

def generate_projects(county, places, n=150):
    projects = []

    for _ in range(n):
        sector = random.choice(SECTORS)
        template = random.choice(PROJECT_TEMPLATES[sector])
        place = random.choice(places)

        project_name = template.format(place=place)

        fy_start_year = random.choice([2022, 2023, 2024, 2025])
        financial_year = f"{fy_start_year}/{fy_start_year+1}"

        start_date = datetime(fy_start_year, 7, 1)
        end_date = datetime(fy_start_year + 1, 6, 30)

        project_start = random_date(start_date, end_date)

        expected_duration_days = random.randint(90, 720)  # 3 months to 2 years
        expected_end = project_start + timedelta(days=expected_duration_days)

        budget = random_money()
        spent_ratio = random.uniform(0.1, 1.05)  # can exceed slightly (bad accounting lol)
        spent = round(budget * spent_ratio, 2)

        completion = int(min(100, max(0, random.gauss(60, 30))))

        today = datetime.now()

        # Determine status
        if completion >= 95:
            status = "completed"
        else:
            if today > expected_end and completion < 80:
                status = "stalled"
            else:
                status = "ongoing"

        report_quarter = random.choice(["Q1", "Q2", "Q3", "Q4"])
        report_year = fy_start_year + 1
        source_report = f"COB Report {report_quarter} FY {financial_year}"

        projects.append({
            "project_name": project_name,
            "county": county,
            "sector": sector,
            "financial_year": financial_year,
            "start_date": project_start.date(),
            "expected_end_date": expected_end.date(),
            "budget_allocated_kes": budget,
            "amount_spent_kes": spent,
            "completion_percent": completion,
            "status": status,
            "source_report": source_report
        })

    return pd.DataFrame(projects)

def main():
    os.makedirs("data/external", exist_ok=True)

    nairobi_df = generate_projects("Nairobi", NAIROBI_PLACES, n=200)
    makueni_df = generate_projects("Makueni", MAKUENI_PLACES, n=200)

    nairobi_path = "data/external/cob_projects_nairobi.csv"
    makueni_path = "data/external/cob_projects_makueni.csv"

    nairobi_df.to_csv(nairobi_path, index=False)
    makueni_df.to_csv(makueni_path, index=False)

    print(f"Generated: {nairobi_path} ({len(nairobi_df)} rows)")
    print(f"Generated: {makueni_path} ({len(makueni_df)} rows)")

    print("\nSample Nairobi Projects:")
    print(nairobi_df.head(5).to_string(index=False))

    print("\nSample Makueni Projects:")
    print(makueni_df.head(5).to_string(index=False))

if __name__ == "__main__":
    main()