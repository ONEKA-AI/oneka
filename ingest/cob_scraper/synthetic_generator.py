import random
import uuid
from datetime import datetime, timedelta
import pandas as pd


# ==========================================================
# COUNTY BOUNDING BOXES (approximate but realistic)
# ==========================================================

COUNTY_BOUNDS = {
    "Nairobi": {
        "lat_min": -1.45,
        "lat_max": -1.15,
        "lon_min": 36.65,
        "lon_max": 37.05,
    },
    "Makueni": {
        "lat_min": -2.50,
        "lat_max": -1.30,
        "lon_min": 37.20,
        "lon_max": 38.30,
    }
}


# ==========================================================
# PROJECT CONFIG
# ==========================================================

PROJECT_TYPES = [
    ("Road Works", 0.18),
    ("Water Project", 0.16),
    ("Dispensary Construction", 0.14),
    ("Health Centre Upgrade", 0.10),
    ("School Classrooms", 0.12),
    ("ICT / Digitization", 0.05),
    ("Market / Trading Centre", 0.06),
    ("Bridge / Culvert", 0.07),
    ("Hospital Equipment", 0.12),
]

DURATION_RULES = {
    "Road Works": (240, 900),
    "Water Project": (200, 700),
    "Dispensary Construction": (180, 450),
    "Health Centre Upgrade": (120, 400),
    "School Classrooms": (120, 400),
    "ICT / Digitization": (60, 250),
    "Market / Trading Centre": (150, 500),
    "Bridge / Culvert": (200, 600),
    "Hospital Equipment": (60, 220),
}

BUDGET_RULES = {
    "Road Works": (30_000_000, 600_000_000),
    "Water Project": (15_000_000, 300_000_000),
    "Dispensary Construction": (5_000_000, 60_000_000),
    "Health Centre Upgrade": (8_000_000, 120_000_000),
    "School Classrooms": (2_000_000, 40_000_000),
    "ICT / Digitization": (1_000_000, 80_000_000),
    "Market / Trading Centre": (5_000_000, 120_000_000),
    "Bridge / Culvert": (10_000_000, 250_000_000),
    "Hospital Equipment": (2_000_000, 200_000_000),
}

PROCUREMENT_METHODS = [
    ("Open Tender", 0.45),
    ("Request for Quotation", 0.20),
    ("Restricted Tender", 0.15),
    ("Direct Procurement", 0.08),
    ("Framework Contract", 0.07),
    ("Low Value Procurement", 0.05),
]

CONTRACTOR_TYPES = [
    ("Established Contractor", 0.55),
    ("Mid-level Contractor", 0.30),
    ("Briefcase Contractor", 0.15),
]

WEATHER_DELAY_MONTHS = [3, 4, 5, 10, 11]


# ==========================================================
# UTILITIES
# ==========================================================

def weighted_choice(choices):
    values = [c[0] for c in choices]
    weights = [c[1] for c in choices]
    return random.choices(values, weights=weights, k=1)[0]


def random_date(start, end):
    delta = end - start
    seconds = random.randint(0, int(delta.total_seconds()))
    return start + timedelta(seconds=seconds)


def generate_coordinates(county):
    bounds = COUNTY_BOUNDS.get(county)

    if not bounds:
        return round(random.uniform(-2.5, 1.5), 6), round(random.uniform(34.0, 40.0), 6)

    lat = random.uniform(bounds["lat_min"], bounds["lat_max"])
    lon = random.uniform(bounds["lon_min"], bounds["lon_max"])

    return round(lat, 6), round(lon, 6)


def month_gap(d1, d2):
    return max(1, int((d2 - d1).days / 30))


# ==========================================================
# TITLE GENERATION
# ==========================================================

def generate_project_title(project_type, county):
    facilities = [
        "Kawangware", "Mlolongo", "Kikima", "Kathonzweni",
        "Emali", "Kiboko", "Makindu", "Kasarani", "Langata"
    ]

    facility = random.choice(facilities)

    templates = {
        "Road Works": f"Proposed rehabilitation of {facility} access road in {county} County",
        "Water Project": f"Construction of water pipeline extension at {facility} in {county} County",
        "Dispensary Construction": f"Construction of {facility} Dispensary in {county} County",
        "Health Centre Upgrade": f"Upgrade of {facility} Health Centre in {county} County",
        "School Classrooms": f"Construction of classrooms at {facility} Primary School in {county} County",
        "ICT / Digitization": f"Supply and installation of ICT equipment in {county} County offices",
        "Market / Trading Centre": f"Construction of modern market at {facility} trading centre, {county}",
        "Bridge / Culvert": f"Construction of bridge/culvert at {facility} river crossing",
        "Hospital Equipment": f"Supply and delivery of medical equipment to {facility} Hospital",
    }

    return templates.get(project_type, f"Development project in {county} County")


# ==========================================================
# DISBURSEMENT SIMULATION
# ==========================================================

def simulate_disbursement(approved_budget, start_date, expected_end):
    months = month_gap(start_date, expected_end)
    n_payments = random.randint(1, min(6, months))

    max_ratio = random.uniform(0.5, 1.05)
    if max_ratio > 1.0 and random.random() < 0.8:
        max_ratio = random.uniform(0.7, 1.0)

    total_disbursed = approved_budget * max_ratio

    last_payment = random_date(start_date, expected_end)

    return {
        "num_disbursements": n_payments,
        "disbursed_amount": round(total_disbursed, 2),
        "disbursement_ratio": round(total_disbursed / approved_budget, 3),
        "last_disbursement_date": last_payment.strftime("%Y-%m-%d"),
    }


# ==========================================================
# PROGRESS SIMULATION
# ==========================================================

def simulate_progress(start_date, today, expected_end, contractor_type):
    total_days = max(1, (expected_end - start_date).days)
    elapsed_days = max(0, (today - start_date).days)

    ratio = min(1.5, elapsed_days / total_days)
    base_progress = (ratio ** 0.85) * 100

    if contractor_type == "Briefcase Contractor":
        base_progress *= random.uniform(0.4, 0.75)
    elif contractor_type == "Mid-level Contractor":
        base_progress *= random.uniform(0.7, 1.0)
    else:
        base_progress *= random.uniform(0.9, 1.1)

    base_progress += random.uniform(-6, 6)
    return max(0, min(100, round(base_progress, 2)))


# ==========================================================
# STALL LOGIC
# ==========================================================

def compute_stall_probability(today, expected_end, progress, disb_ratio, contractor_type, procurement_method):
    overdue_days = (today - expected_end).days
    prob = 0.05

    if overdue_days > 0:
        prob += min(0.45, overdue_days / 900)

    if disb_ratio > 0.75 and progress < 40:
        prob += 0.25

    if contractor_type == "Briefcase Contractor":
        prob += 0.25

    if procurement_method == "Direct Procurement":
        prob += 0.20

    prob += random.uniform(-0.05, 0.05)
    return max(0, min(1, prob))


def assign_status(today, expected_end, progress, stall_prob):
    overdue_days = (today - expected_end).days

    if progress > 92 and random.random() < 0.75:
        return "COMPLETED", 0

    if random.random() < stall_prob:
        return "STALLED", 1

    if overdue_days > 0:
        return "ONGOING (DELAYED)", 0

    return "ONGOING", 0


# ==========================================================
# MAIN GENERATOR
# ==========================================================

def generate_cob_projects(county, n_projects=120, start_year=2021, end_year=2025, output_path=None):

    today = datetime.now()
    start_range = datetime(start_year, 1, 1)
    end_range = datetime(end_year, 12, 31)

    rows = []

    for _ in range(n_projects):
        project_id = str(uuid.uuid4())[:8]

        project_type = weighted_choice(PROJECT_TYPES)
        procurement_method = weighted_choice(PROCUREMENT_METHODS)
        contractor_type = weighted_choice(CONTRACTOR_TYPES)

        if random.random() < 0.35:
            start_date = random_date(datetime(end_year, 5, 1), datetime(end_year, 7, 30))
        else:
            start_date = random_date(start_range, end_range)

        min_d, max_d = DURATION_RULES[project_type]
        duration_days = random.randint(min_d, max_d)

        if start_date.month in WEATHER_DELAY_MONTHS and random.random() < 0.3:
            duration_days += random.randint(30, 120)

        expected_end = start_date + timedelta(days=duration_days)

        bmin, bmax = BUDGET_RULES[project_type]
        approved_budget = random.uniform(bmin, bmax)

        title = generate_project_title(project_type, county)
        disb = simulate_disbursement(approved_budget, start_date, expected_end)

        progress = simulate_progress(start_date, today, expected_end, contractor_type)

        stall_prob = compute_stall_probability(
            today, expected_end, progress,
            disb["disbursement_ratio"],
            contractor_type,
            procurement_method
        )

        status, is_stalled = assign_status(today, expected_end, progress, stall_prob)

        latitude, longitude = generate_coordinates(county)

        delay_days = max(0, (today - expected_end).days)

        rows.append({
            "project_id": project_id,
            "county": county,
            "latitude": latitude,
            "longitude": longitude,
            "project_type": project_type,
            "tender_title": title,
            "procurement_method": procurement_method,
            "contractor_type": contractor_type,
            "start_date": start_date.strftime("%Y-%m-%d"),
            "expected_completion_date": expected_end.strftime("%Y-%m-%d"),
            "approved_budget_kes": round(approved_budget, 2),
            "disbursed_amount_kes": disb["disbursed_amount"],
            "disbursement_ratio": disb["disbursement_ratio"],
            "num_disbursements": disb["num_disbursements"],
            "last_disbursement_date": disb["last_disbursement_date"],
            "progress_estimate_pct": progress,
            "delay_days": delay_days,
            "status": status,
            "is_stalled": is_stalled,
        })

    df = pd.DataFrame(rows)

    if output_path:
        df.to_csv(output_path, index=False)
        print(f"[OK] Generated {len(df)} projects for {county} -> {output_path}")

    return df


# ==========================================================
# CLI ENTRY
# ==========================================================

if __name__ == "__main__":
    random.seed(42)

    generate_cob_projects(
        county="Nairobi",
        n_projects=150,
        output_path="data/external/cob_projects_nairobi.csv"
    )

    generate_cob_projects(
        county="Makueni",
        n_projects=120,
        output_path="data/external/cob_projects_makueni.csv"
    )