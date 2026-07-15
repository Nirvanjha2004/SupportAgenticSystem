from typing import Dict, Any
from urllib.parse import urlencode
import base64
import requests
from config import settings


class NotionOAuth:
    def __init__(self):
        self.client_id = settings.NOTION_CLIENT_ID
        self.client_secret = settings.NOTION_CLIENT_SECRET
        self.redirect_uri = settings.NOTION_REDIRECT_URI

    def get_authorize_url(self, state: str) -> str:
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "response_type": "code",
            "state": state,
            "owner": "user",
        }
        return f"https://api.notion.com/v1/oauth/authorize?{urlencode(params)}"

    def exchange_code(self, code: str) -> Dict[str, Any]:
        auth_str = f"{self.client_id}:{self.client_secret}"
        auth_b64 = base64.b64encode(auth_str.encode()).decode()

        resp = requests.post(
            "https://api.notion.com/v1/oauth/token",
            headers={
                "Authorization": f"Basic {auth_b64}",
                "Content-Type": "application/json",
            },
            json={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": self.redirect_uri,
            },
        )
        resp.raise_for_status()
        data = resp.json()
        return {
            "access_token": data.get("access_token"),
            "workspace_id": data.get("workspace_id"),
            "workspace_name": data.get("workspace_name"),
            "workspace_icon": data.get("workspace_icon"),
            "bot_id": data.get("bot_id"),
            "owner": data.get("owner"),
        }