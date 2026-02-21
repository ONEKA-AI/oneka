from rapidfuzz import process, fuzz
from datetime import datetime
from typing import List, Dict

def cross_reference_tenders(tenders: List[Dict], cob_projects: List[Dict]) -> List[Dict]:
    """
    Adds planned_end_date and stalled flag to tenders if a matching COB project is found
    """
    cob_lookup = {p['project_name']: p for p in cob_projects}

    for tender in tenders:
        match, score = process.extractOne(
            tender['title'],
            cob_lookup.keys(),
            scorer=fuzz.token_sort_ratio
        )
        if score > 70:  # match threshold
            tender['planned_end_date'] = cob_lookup[match]['planned_end_date']
            # check stalled
            try:
                planned = datetime.strptime(tender['planned_end_date'], "%Y-%m-%d")
                today = datetime.today()
                tender['stalled'] = planned < today
            except Exception:
                tender['stalled'] = None
        else:
            tender['planned_end_date'] = None
            tender['stalled'] = None

    return tenders
