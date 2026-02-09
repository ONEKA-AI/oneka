from rapidfuzz import process, fuzz
from typing import List, Dict

def match_tender_to_facility(tender_title: str, facilities: List[Dict], threshold: int = 70) -> Dict:
    """
    Match a tender to the most likely health facility using fuzzy matching.
    Returns the facility dict or None if no good match found.
    """
    if not facilities:
        return None

    names = [f["name"] for f in facilities]
    match = process.extractOne(tender_title, names, scorer=fuzz.token_sort_ratio)

    if match and match[1] >= threshold:
        # find the full facility record
        for f in facilities:
            if f["name"] == match[0]:
                return f
    return None

def assign_coordinates(tenders: List[Dict], facilities: List[Dict], threshold: int = 70) -> List[Dict]:
    """
    Loop over tenders and assign lat/lon based on closest facility match.
    """
    for tender in tenders:
        facility = match_tender_to_facility(tender.get("title", ""), facilities, threshold)
        if facility:
            tender["latitude"] = facility.get("latitude")
            tender["longitude"] = facility.get("longitude")
            tender["matched_facility"] = facility.get("name")
        else:
            tender["latitude"] = None
            tender["longitude"] = None
            tender["matched_facility"] = None

    return tenders
