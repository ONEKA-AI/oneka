import pandas as pd


REQUIRED_COLUMNS = [
    "county",
    "project_name",
    "sector",
    "sub_sector",
    "fy",
    "budget_allocated_kes",
    "amount_spent_kes",
    "status",
    "planned_start_date",
    "planned_end_date",
    "report_date",
    "latitude",
    "longitude",
    "source",
]


def load_cob_csv(file_path: str) -> list[dict]:
    """
    Loads a COB-style project CSV into a list of dicts.
    This is what we cross-reference against tenders.
    """

    df = pd.read_csv(file_path)

    # Validate columns
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns in {file_path}: {missing}")

    # Convert NaN -> None
    df = df.where(pd.notnull(df), None)

    # Return as list of dict records
    return df.to_dict(orient="records")


def normalize_project_name(name: str) -> str:
    """
    Light normalization to improve fuzzy matching.
    """
    if not isinstance(name, str):
        return ""

    name = name.lower()
    name = name.replace("&", "and")
    name = name.replace("-", " ")
    name = name.replace("/", " ")
    name = " ".join(name.split())

    return name