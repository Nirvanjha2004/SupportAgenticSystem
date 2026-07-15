from typing import Dict, Any
from urllib.parse import urlencode
import requests
from config import settings


class SlackOAuth:
    def __init__(self):
        self.client_id = settings.SLACK_CLIENT_ID
        self.client_secret = settings.SLACK_CLIENT_SECRET
        self.redirect_uri = settings.SLACK_REDIRECT_URI

    def get_authorize_url(self, state: str) -> str:
        scopes = [
            "channels:history",
            "groups:history",
            "im:history",
            "mpim:history",
            "channels:read",
            "groups:read",
            "users:read",
            "team:read"
        ]
        params = {
            "client_id": self.client_id,
            "scope": ",".join(scopes),
            "redirect_uri": self.redirect_uri,
            "state": state
        }
        return f"https://slack.com/oauth/v2/authorize?{urlencode(params)}"

    def exchange_code(self, code: str) -> Dict[str, Any]:
        resp = requests.post(
            "https://slack.com/api/oauth.v2.access",
            data={
                "code": code,
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "redirect_uri": self.redirect_uri
            }
        )
        resp.raise_for_status()
        data = resp.json()
        if not data.get("ok"):
            raise Exception(f"Slack OAuth error: {data.get('error')}")

        # CRITICAL FIX: use (x or {}) instead of .get(x, {}) because Slack may send null
        team = data.get("team") or {}
        enterprise = data.get("enterprise") or {}
        authed_user = data.get("authed_user") or {}

        return {
            "access_token": data.get("access_token"),
            "team_id": team.get("id"),
            "team_name": team.get("name"),
            "enterprise_id": enterprise.get("id"),
            "authed_user": authed_user,
            "bot_user_id": data.get("bot_user_id"),
            "scope": data.get("scope")
        }