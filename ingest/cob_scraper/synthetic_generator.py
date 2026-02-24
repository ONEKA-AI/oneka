import random
import uuid
from datetime import datetime, timedelta
import pandas as pd


# -------------------------------
# Helper utilities
# -------------------------------

def random_date(start: datetime, end: datetime) -> datetime:
    """Return random datetime between start and end."""
    delta = end - start
    seconds = random.randint(0, int(delta.total_seconds()))
    return start + timedelta(seconds=seconds)


def weighted_choice(choices: list[tuple[str, float]]) -> str:
    """choices = [(value, weight), ...]"""
    values = [c[0] for c in choices]
    weights = [c[1] for c in choices]
    return random.choices(values, weights=weights, k=1)[0]


def jitter_text(text: str) -> str:
    """Add realistic tender messiness: casing inconsistencies, typos, abbreviations."""
    tweaks = [
        lambda t: t.upper(),
        lambda t: t.title(),
        lambda t: t.lower(),
        lambda t: t.replace("Construction", "Const."),
        lambda t: t.replace("construction", "const"),
        lambda t: t.replace("Rehabilitation", "Rehab."),
        lambda t: t.replace("rehabilitation", "rehab"),
        lambda t: t.replace("Proposed", "PROP."),
        lambda t: t.replace("proposed", "prop"),
        lambda t: t.replace(" and ", " & "),
        lambda t: t.replace("  ", " "),
        lambda t: t + " (PHASE II)",
        lambda t: t + " - RE-ADVERTISEMENT",
        lambda t: t + " - LOT 1",
        lambda t: t.replace("Health Centre", "HC"),
        lambda t: t.replace("Dispensary", "Disp."),
    ]

    # apply 1–2 random tweaks
    for _ in range(random.randint(1, 2)):
        text = random.choice(tweaks)(text)

    # random small typo
    if random.random() < 0.12:
        text = text.replace("TION", "T0N") if "TION" in text else text

    return text


def month_gap(d1: datetime, d2: datetime) -> int:
    """Approx months between dates."""
    return max(0, int((d2 - d1).days / 30))


# -------------------------------
# Realistic simulation parameters
# -------------------------------

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

WEATHER_DELAY_MONTHS = [3, 4, 5, 10, 11]  # March-May + Oct-Nov (rains)


# -------------------------------
# Project name generation
# -------------------------------

def generate_project_title(project_type: str, county: str) -> str:
    wards = [
        "Kibra", "Embakasi", "Dagoretti", "Kasarani", "Langata",
        "Kangundo", "Wote", "Kaiti", "Mbooni", "Kilome",
        "Makindu", "Kibwezi East", "Kibwezi West"
    ]

    facilities = [
        "Kawangware", "Muthurwa", "Kikuyu", "Mlolongo", "Kikima",
        "Kathonzweni", "Emali", "Kikumbulyu", "Athi River", "Kiboko"
    ]

    ward = random.choice(wards)
    facility = random.choice(facilities)

    templates = {
        "Road Works": f"Proposed rehabilitation of {facility}-{ward} access road in {county} County",
        "Water Project": f"Construction of water pipeline extension and storage tank at {facility} in {county} County",
        "Dispensary Construction": f"Construction of {facility} Dispensary in {ward}, {county} County",
        "Health Centre Upgrade": f"Proposed upgrade of {facility} Health Centre in {ward}, {county} County",
        "School Classrooms": f"Construction of 4 classrooms at {facility} Primary School in {county} County",
        "ICT / Digitization": f"Supply, installation and commissioning of ICT equipment for county offices in {county} County",
        "Market / Trading Centre": f"Proposed construction of modern market at {facility} trading centre, {county} County",
        "Bridge / Culvert": f"Proposed construction of bridge/culvert at {facility} river crossing in {county} County",
        "Hospital Equipment": f"Supply and delivery of medical equipment for {facility} Sub County Hospital in {county} County",
    }

    title = templates.get(project_type, f"Development project in {county} County")
    return jitter_text(title)


# -------------------------------
# Progress + disbursement simulation
# -------------------------------

def simulate_disbursement(approved_budget: float, start_date: datetime, expected_end: datetime) -> dict:
    """
    Simulate disbursement behavior like treasury/IFMIS:
    multiple payments, sometimes front-loaded.
    """
    months = max(2, month_gap(start_date, expected_end))

    # decide number of disbursements
    n_payments = random.randint(1, min(6, months))

    # typical disbursement ratios: often not 100%
    max_ratio = random.uniform(0.45, 1.05)

    # but most won't exceed 100%
    if max_ratio > 1.0 and random.random() < 0.85:
        max_ratio = random.uniform(0.65, 1.0)

    disbursed_total = approved_budget * max_ratio

    # generate payment dates
    payment_dates = []
    for _ in range(n_payments):
        payment_dates.append(random_date(start_date, expected_end))

    payment_dates.sort()

    # generate payment amounts
    remaining = disbursed_total
    payments = []
    for i in range(n_payments):
        if i == n_payments - 1:
            amt = remaining
        else:
            amt = remaining * random.uniform(0.15, 0.45)
        remaining -= amt
        payments.append(max(0, amt))

    last_payment_date = payment_dates[-1]

    return {
        "num_disbursements": n_payments,
        "disbursed_amount": round(sum(payments), 2),
        "disbursement_ratio": round(sum(payments) / approved_budget, 3),
        "last_disbursement_date": last_payment_date.strftime("%Y-%m-%d"),
    }


def simulate_progress_curve(start_date: datetime, today: datetime, expected_end: datetime, contractor_type: str) -> float:
    """
    Simulate progress estimate based on time elapsed, randomness, contractor quality.
    Not linear: slow start, mid acceleration, possible plateau.
    """
    total_days = max(1, (expected_end - start_date).days)
    elapsed_days = max(0, (today - start_date).days)

    progress_time_ratio = min(1.5, elapsed_days / total_days)  # can exceed 1 if overdue

    # base curve: slow start then faster
    base_progress = (progress_time_ratio ** 0.85) * 100

    # contractor penalty
    if contractor_type == "Briefcase Contractor":
        base_progress *= random.uniform(0.35, 0.75)
    elif contractor_type == "Mid-level Contractor":
        base_progress *= random.uniform(0.65, 1.0)
    else:
        base_progress *= random.uniform(0.85, 1.15)

    # random stall plateau
    if random.random() < 0.25:
        plateau_factor = random.uniform(0.6, 0.95)
        base_progress *= plateau_factor

    # cap progress
    base_progress = max(0, min(100, base_progress))

    # add noise
    base_progress += random.uniform(-7, 7)
    return max(0, min(100, round(base_progress, 2)))


# -------------------------------
# Stalling logic (Kenya-realistic)
# -------------------------------

def compute_stall_probability(
    today: datetime,
    expected_end: datetime,
    progress: float,
    disbursement_ratio: float,
    contractor_type: str,
    procurement_method: str
) -> float:
    """
    Return probability (0–1) that project is stalled.
    This is the *core realism logic*.
    """
    overdue_days = (today - expected_end).days

    prob = 0.05

    # overdue is important but not absolute
    if overdue_days > 0:
        prob += min(0.45, overdue_days / 900)

    # suspicious if disbursed high but progress low
    if disbursement_ratio > 0.70 and progress < 40:
        prob += 0.25

    if disbursement_ratio > 0.90 and progress < 60:
        prob += 0.20

    # contractor risk
    if contractor_type == "Briefcase Contractor":
        prob += 0.25
    elif contractor_type == "Mid-level Contractor":
        prob += 0.10

    # procurement risk
    if procurement_method == "Direct Procurement":
        prob += 0.20
    elif procurement_method == "Restricted Tender":
        prob += 0.12

    # very low progress late in timeline
    if overdue_days > 180 and progress < 35:
        prob += 0.20

    # noise
    prob += random.uniform(-0.05, 0.05)

    return max(0, min(1, prob))


def assign_status(today: datetime, expected_end: datetime, progress: float, stall_prob: float) -> tuple[str, int]:
    """
    Decide status + label.
    """
    overdue_days = (today - expected_end).days

    # completed projects sometimes appear late but still marked completed
    if progress > 92 and random.random() < 0.75:
        return "COMPLETED", 0

    # stalled probability
    if random.random() < stall_prob:
        return "STALLED", 1

    # if overdue but not stalled -> ongoing delayed
    if overdue_days > 0:
        return "ONGOING (DELAYED)", 0

    return "ONGOING", 0


# -------------------------------
# Main generator
# -------------------------------

def generate_cob_projects(
    county: str,
    n_projects: int = 120,
    start_year: int = 2021,
    end_year: int = 2025,
    output_path: str = None
) -> pd.DataFrame:
    """
    Generate realistic synthetic CoB-like project monitoring dataset.
    """

    today = datetime.now()

    start_date_range = datetime(start_year, 1, 1)
    end_date_range = datetime(end_year, 12, 31)

    rows = []

    for _ in range(n_projects):
        project_id = str(uuid.uuid4())[:8]

        project_type = weighted_choice(PROJECT_TYPES)
        procurement_method = weighted_choice(PROCUREMENT_METHODS)
        contractor_type = weighted_choice(CONTRACTOR_TYPES)

        # fiscal-year bias: many projects start around May/June (budget cycle)
        if random.random() < 0.35:
            start_date = random_date(datetime(end_year, 5, 1), datetime(end_year, 7, 30))
        else:
            start_date = random_date(start_date_range, end_date_range)

        # duration based on project type
        min_d, max_d = DURATION_RULES[project_type]
        duration_days = random.randint(min_d, max_d)

        # rainy season delay injection
        if start_date.month in WEATHER_DELAY_MONTHS and random.random() < 0.30:
            duration_days += random.randint(30, 120)

        expected_end = start_date + timedelta(days=duration_days)

        # budget based on project type
        bmin, bmax = BUDGET_RULES[project_type]
        approved_budget = random.uniform(bmin, bmax)

        title = generate_project_title(project_type, county)

        # simulate disbursement
        disb = simulate_disbursement(approved_budget, start_date, expected_end)

        # simulate progress
        progress = simulate_progress_curve(start_date, today, expected_end, contractor_type)

        stall_prob = compute_stall_probability(
            today=today,
            expected_end=expected_end,
            progress=progress,
            disbursement_ratio=disb["disbursement_ratio"],
            contractor_type=contractor_type,
            procurement_method=procurement_method
        )

        status, is_stalled = assign_status(today, expected_end, progress, stall_prob)

        # completion date sometimes missing or inconsistent
        completion_date = None
        if status == "COMPLETED":
            # completed slightly early or late
            completion_date_dt = expected_end + timedelta(days=random.randint(-30, 120))
            completion_date = completion_date_dt.strftime("%Y-%m-%d")

        # corruption/anomaly injection
        anomaly_flag = 0
        if random.random() < 0.10:
            # disbursed high but progress suspiciously low
            progress = min(progress, random.uniform(5, 35))
            anomaly_flag = 1
            is_stalled = 1
            status = "STALLED"

        delay_days = (today - expected_end).days if today > expected_end else 0

        rows.append({
            "project_id": project_id,
            "county": county,
            "project_type": project_type,
            "tender_title": title,

            "procurement_method": procurement_method,
            "contractor_type": contractor_type,

            "start_date": start_date.strftime("%Y-%m-%d"),
            "expected_completion_date": expected_end.strftime("%Y-%m-%d"),
            "reported_completion_date": completion_date,

            "approved_budget_kes": round(approved_budget, 2),
            "disbursed_amount_kes": disb["disbursed_amount"],
            "disbursement_ratio": disb["disbursement_ratio"],
            "num_disbursements": disb["num_disbursements"],
            "last_disbursement_date": disb["last_disbursement_date"],

            "progress_estimate_pct": progress,
            "delay_days": delay_days,

            "status": status,
            "is_stalled": is_stalled,
            "anomaly_flag": anomaly_flag
        })

    df = pd.DataFrame(rows)

    if output_path:
        df.to_csv(output_path, index=False)
        print(f"[OK] Generated {len(df)} projects for {county} -> {output_path}")

    return df


# -------------------------------
# CLI Runner
# -------------------------------

if __name__ == "__main__":
    random.seed(42)

    generate_cob_projects(
        county="Nairobi",
        n_projects=150,
        start_year=2021,
        end_year=2025,
        output_path="data/external/cob_projects_nairobi.csv"
    )

    generate_cob_projects(
        county="Makueni",
        n_projects=120,
        start_year=2021,
        end_year=2025,
        output_path="data/external/cob_projects_makueni.csv"
    )
