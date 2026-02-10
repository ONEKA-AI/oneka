import os
import random
import pandas as pd
from datetime import datetime, timedelta


NAIROBI_COORDS = (-1.2921, 36.8219)
MAKUENI_COORDS = (-1.8036, 37.6246)

SECTORS = [
    ("Health", "Health Facilities"),
    ("Water", "Water Infrastructure"),
    ("Transport", "Road Works"),
    ("Education", "School Infrastructure"),
]

PROJECT_TEMPLATES = {
    "Health": [
        "Construction of {facility} Health Centre",
        "Rehabilitation of {facility} Dispensary",
        "Upgrading of {facility} Sub-County Hospital",
        "Maternity Wing Expansion at {facility}",
        "Supply and Installation of Medical Equipment at {facility}",
    ],
    "Water": [
        "Construction of {facility} Water Pipeline",
        "Rehabilitation of {facility} Borehole",
        "Construction of {facility} Water Storage Tank",
        "Expansion of {facility} Water Supply Scheme",
    ],
    "Transport": [
        "Grading and Murraming of {facility} Road",
        "Construction of {facility} Footbridge",
        "Periodic Maintenance of {facility} Road Section",
        "Upgrading of {facility} Urban Road",
    ],
    "Education": [
        "Construction of {facility} Classroom Block",
        "Rehabilitation of {facility} Primary School",
        "Construction of {facility} Laboratory Block",
        "Supply of Furniture to {facility} Secondary School",
    ],
}

NAIROBI_PLACES = [
    "Kibera",
    "Langata",
    "Embakasi",
    "Kasarani",
    "Mathare",
    "Westlands",
    "Dagoretti",
    "Ruaraka",
    "Makadara",
]

MAKUENI_PLACES = [
    "Wote",
    "Kibwezi",
    "Mbooni",
    "Mtito Andei",
    "Makindu",
    "Kilome",
    "Emali",
    "Mukuyuni",
]


def random_date(start: datetime, end: datetime) -> datetime:
    delta = end - start
    random_days = random.randint(0, delta.days)
    return start + timedelta(days=random_days)


def jitter_coords(lat: float, lon: float, radius_km: float = 10.0) -> tuple[float, float]:
    """
    Jitter coordinates slightly around a county center.
    Very rough synthetic approximation.
    """
    # 1 degree latitude ~ 111 km
    jitter_deg = radius_km / 111.0
    new_lat = lat + random.uniform(-jitter_deg, jitter_deg)
    new_lon = lon + random.uniform(-jitter_deg, jitter_deg)
    return round(new_lat, 6), round(new_lon, 6)


def generate_projects_for_county(county: str, base_coords: tuple[float, float], n: int = 50) -> list[dict]:
    projects = []

    for i in range(n):
        sector, sub_sector = random.choice(SECTORS)

        facility = random.choice(NAIROBI_PLACES if county == "Nairobi" else MAKUENI_PLACES)

        template = random.choice(PROJECT_TEMPLATES[sector])
        project_name = template.format(facility=facility)

        fy = random.choice(["2023/2024", "2024/2025"])

        budget_allocated = random.randint(10_000_000, 350_000_000)
        amount_spent = int(budget_allocated * random.uniform(0.1, 1.1))

        report_date = random_date(
            datetime(2024, 1, 1),
            datetime(2025, 12, 31)
        )

        planned_start_date = random_date(
            datetime(2023, 7, 1),
            datetime(2024, 12, 31)
        )

        planned_end_date = planned_start_date + timedelta(days=random.randint(120, 900))

        # status logic
        today = datetime.now()

        if amount_spent < budget_allocated * 0.3 and today > planned_end_date:
            status = "Stalled"
        elif today > planned_end_date and amount_spent >= budget_allocated * 0.7:
            status = "Completed"
        elif today < planned_end_date:
            status = "Ongoing"
        else:
            status = random.choice(["Ongoing", "Delayed", "Stalled"])

        lat, lon = jitter_coords(base_coords[0], base_coords[1], radius_km=25)

        projects.append({
            "county": county,
            "project_name": project_name,
            "sector": sector,
            "sub_sector": sub_sector,
            "fy": fy,
            "budget_allocated_kes": budget_allocated,
            "amount_spent_kes": amount_spent,
            "status": status,
            "planned_start_date": planned_start_date.date().isoformat(),
            "planned_end_date": planned_end_date.date().isoformat(),
            "report_date": report_date.date().isoformat(),
            "latitude": lat,
            "longitude": lon,
            "source": "SYNTHETIC_COB_DATA",
        })

    return projects


def generate_and_save(output_dir: str = "data/external", n_each: int = 50):
    os.makedirs(output_dir, exist_ok=True)

    nairobi_projects = generate_projects_for_county("Nairobi", NAIROBI_COORDS, n=n_each)
    makueni_projects = generate_projects_for_county("Makueni", MAKUENI_COORDS, n=n_each)

    nairobi_path = os.path.join(output_dir, "cob_nairobi.csv")
    makueni_path = os.path.join(output_dir, "cob_makueni.csv")

    pd.DataFrame(nairobi_projects).to_csv(nairobi_path, index=False)
    pd.DataFrame(makueni_projects).to_csv(makueni_path, index=False)

    print(f"Saved Nairobi synthetic COB data -> {nairobi_path}")
    print(f"Saved Makueni synthetic COB data -> {makueni_path}")


if __name__ == "__main__":
    generate_and_save()