from datetime import datetime

def parse_tender_list(api_response: dict) -> list[dict]:
    tenders = []

    for item in api_response.get("data", []):
        tenders.append({
            "title": item.get("title"),
            "reference": item.get("tender_ref"),
            "published_at": item.get("published_at"),
            "close_at": item.get("close_at"),
            "procuring_entity": item.get("pe", {}).get("name"),
            "raw": item
        })

    return tenders
