import requests
from datetime import datetime

API_URL = "https://tenders.go.ke/api/closed-tenders?search=&perpage=10&sortby=&order=asc&page=1&tender_ref=&title=&pe%3Aname=&procurementMethod%3Atitle=&procurementCategory%3Atitle=&close_at=&published_at=&addendum_added="

def fetch_tender_json(page: int, start_date: str, end_date: str):
    """
    Fetch tenders from the API for a given page and date range.
    Returns a list of tender dicts.
    """
    params = {
        "search": "",
        "perpage": 10,
        "sortby": "",
        "order": "desc",
        "page": page,
        "tender_ref": "",
        "title": "",
        "pe:name": "",
        "procurementMethod:title": "",
        "procurementCategory:title": "",
        "close_at": "",
        #"published_at": f"{start_date},{end_date}",  # filter historical
        "addendum_added": ""
    }

    try:
        resp = requests.get(API_URL, params=params)
        resp.raise_for_status()
        data = resp.json()

        # Depending on API structure, data may be a list or a dict with 'data' key
        tenders = data.get("data") if isinstance(data, dict) else data

        # Ensure all items are dicts; if not, wrap string as dict
        processed = []
        for t in tenders:
            if isinstance(t, dict):
                processed.append(t)
            else:
                # fallback: just store as title
                processed.append({"title": str(t)})
        return processed

    except Exception as e:
        print(f"Error fetching page {page}: {e}")
        return []
