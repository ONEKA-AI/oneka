import pandas as pd
from typing import List, Dict

def load_cob_csv(file_path: str) -> List[Dict]:
    """
    Load COB project data with at least columns:
    - project_name
    - planned_end_date (YYYY-MM-DD)
    """
    df = pd.read_csv(file_path)
    projects = df.to_dict(orient="records")
    return projects
