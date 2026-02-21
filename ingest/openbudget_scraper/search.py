import requests
from bs4 import BeautifulSoup
from typing import List

BASE_URL = "https://video-mba2-1.xx.fbcdn.net/o1/v/t2/f2/m366/AQM694J_f9XFyVBeVHGbpd_4Wsz5mNkn6LPiFxTeezkwvqCtnaP9f0JwpvA4zLiuscDVX_wcmH46IsuIqZFMvJvkTZVwTDLRPEFqlfvnX3Hvmg.mp4?_nc_cat=101&_nc_sid=9ca052&_nc_ht=video-mba2-1.xx.fbcdn.net&_nc_ohc=wbCzHTB41tgQ7kNvwFicSyO&efg=eyJ2ZW5jb2RlX3RhZyI6ImRhc2hfdnA5LWJhc2ljLWdlbjJfNzIwcCIsInZpZGVvX2lkIjoxMjI5NDI3Njc4NTMwMzExLCJvaWxfdXJsZ2VuX2FwcF9pZCI6MCwiY2xpZW50X25hbWUiOiJ1bmtub3duIiwieHB2X2Fzc2V0X2lkIjoxOTQ2MDUwNzAyNjg5OTUwLCJhc3NldF9hZ2VfZGF5cyI6MSwidmlfdXNlY2FzZV9pZCI6MTAxMjIsImR1cmF0aW9uX3MiOjQ2LCJiaXRyYXRlIjo2MDg3MTQsInVybGdlbl9zb3VyY2UiOiJ3d3cifQ%3D%3D&ccb=17-1&_nc_gid=3L7bFkW558MSNQHdopU4Zw&_nc_zt=28&oh=00_Aftw1zR9pzGM24CRum11-WJ11XGTjUb27F2YSqOSz02kpA&oe=6987DFD7&bytestart=970&byteend=405984"

def search_projects(county: str) -> List[str]:
    """
    Searches for project pages by county name on openbudget.or.ke
    """
    url = f"{BASE_URL}/search?query={county}"
    resp = requests.get(url)
    soup = BeautifulSoup(resp.text, "html.parser")
    
    links = []
    for a in soup.select("a[href*='/project/']"):
        links.append(BASE_URL + a["href"])
    
    return list(set(links))
