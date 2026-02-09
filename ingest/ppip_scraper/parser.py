# ingest/ppip_scraper/parser.py
from typing import List, Dict

def parse_tender_json(json_data: Dict) -> List[Dict]:
    """
    Parse the JSON data from tenders.go.ke into a list of tenders.
    """
    tenders = []

    for item in json_data.get("data", []):
        tenders.append({
            "title": item.get("title", "No title"),
            "url": "https://tenders.go.ke" + item.get("link", ""),
            "id": item.get("id", None),
            "close_at": item.get("close_at", ""),
            "published_at": item.get("published_at", "")
        })

    return tenders
