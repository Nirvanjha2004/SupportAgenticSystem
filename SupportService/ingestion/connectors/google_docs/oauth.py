from typing import Dict, Any
from urllib.parse import urlencode
import requests
from config import settings


class GoogleDocsOAuth:
    def __init__(self):
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
        self.redirect_uri = settings.GOOGLE_REDIRECT_URI

    def get_authorize_url(self, state: str) -> str:
        scopes = [
            "https://www.googleapis.com/auth/drive.readonly",
            "https://www.googleapis.com/auth/documents.readonly",
        ]
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "response_type": "code",
            "scope": " ".join(scopes),
            "state": state,
            "access_type": "offline",
            "prompt": "consent",  # Forces refresh_token every time
        }
        return f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"

    def exchange_code(self, code: str) -> Dict[str, Any]:
        resp = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "redirect_uri": self.redirect_uri,
                "grant_type": "authorization_code",
            },
        )
        resp.raise_for_status()
        data = resp.json()
        return {
            "access_token": data.get("access_token"),
            "refresh_token": data.get("refresh_token"),  # Critical for long-term sync
            "expires_in": data.get("expires_in"),
            "token_type": data.get("token_type"),
            "scope": data.get("scope"),
        }

    def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
        resp = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "refresh_token": refresh_token,
                "grant_type": "refresh_token",
            },
        )
        resp.raise_for_status()
        data = resp.json()
        return {
            "access_token": data.get("access_token"),
            "expires_in": data.get("expires_in"),
            "token_type": data.get("token_type"),
        }