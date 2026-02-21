import requests
from bs4 import BeautifulSoup

def parse_project_page(url: str) -> dict:
    resp = requests.get(url)
    soup = BeautifulSoup(resp.text, "html.parser")

    title = soup.select_one("h1").text.strip()
    allocation = None
    info = soup.find(text="Allocation:")
    if info:
        allocation = info.find_next().strip()

    # no planned end date on openbudget; we’ll leave blank
    return {
        "url": url,
        "project_name": title,
        "planned_end_date": None,
        "allocation": allocation
    }
