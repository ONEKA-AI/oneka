# ingest/ppip_scraper/scraper.py
import time
import requests
from .config import HEADERS, REQUEST_DELAY_SECONDS

def fetch_tender_json(page: int, perpage: int = 20) -> dict:
    """
    Fetch active tenders from tenders.go.ke JSON API.
    """
    url = (
        "https://tenders.go.ke/api/active-tenders"
        f"?search=&perpage={perpage}&sortby=&order=asc&page={page}"
        "&tender_ref=&title=&pe:name=&procurementMethod:title="
        "&procurementCategory:title=&close_at=&published_at=&addendum_added="
    )
    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    time.sleep(REQUEST_DELAY_SECONDS)
    return response.json()
