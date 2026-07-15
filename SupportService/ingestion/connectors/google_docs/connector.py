from ingestion.base import BaseConnector
from ingestion.models import RawDocument
from typing import List, Optional, Dict, Any
import requests
import base64
import json
from datetime import datetime, timezone
from urllib.parse import urlencode
import time

class GoogleDocsConnector(BaseConnector):
    """
    Google Drive API + Docs API (free tier: 10k queries/project/day).
    OAuth 2.0 with offline refresh tokens.
    """
    source_type = "google_docs"

    CLIENT_ID = "your_google_client_id"
    CLIENT_SECRET = "your_google_client_secret"
    REDIRECT_URI = "https://your-app.com/callback"

    def get_oauth_url(self, state: str) -> str:
        scopes = [
            "https://www.googleapis.com/auth/drive.readonly",
            "https://www.googleapis.com/auth/documents.readonly"
        ]
        params = {
            "client_id": self.CLIENT_ID,
            "redirect_uri": self.REDIRECT_URI,
            "response_type": "code",
            "scope": " ".join(scopes),
            "state": state,
            "access_type": "offline",
            "prompt": "consent"
        }
        return f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"

    def handle_oauth_callback(self, code: str) -> dict:
        resp = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": self.CLIENT_ID,
                "client_secret": self.CLIENT_SECRET,
                "redirect_uri": self.REDIRECT_URI,
                "grant_type": "authorization_code"
            }
        )
        resp.raise_for_status()
        return resp.json()

    def _api(self, endpoint: str, token: str, params=None):
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.get(
            f"https://www.googleapis.com{endpoint}",
            headers=headers,
            params=params
        )
        if resp.status_code == 429:
            time.sleep(int(resp.headers.get("Retry-After", 1)))
            return self._api(endpoint, token, params)
        resp.raise_for_status()
        return resp.json()

    def backfill(self, credentials: dict, workspace_id: str) -> List[RawDocument]:
        token = credentials.get("access_token")
        docs: List[RawDocument] = []

        # Drive API: list only Google Docs (no Sheets/Slides)
        page_token = None
        while True:
            params = {
                "q": "mimeType='application/vnd.google-apps.document' and trashed=false",
                "pageSize": 100,
                "fields": "nextPageToken,files(id,name,createdTime,modifiedTime,webViewLink,owners)"
            }
            if page_token:
                params["pageToken"] = page_token

            resp = self._api("/drive/v3/files", token, params)
            files = resp.get("files", [])

            for f in files:
                fid = f["id"]
                try:
                    # Docs API: fetch structured content
                    doc_data = self._api(f"/docs/v1/documents/{fid}", token)
                    text = self._extract_text(doc_data)

                    docs.append(RawDocument(
                        id=f"gdoc-{fid}",
                        source_type=self.source_type,
                        workspace_id=workspace_id,
                        title=f.get("name", "Untitled"),
                        content=text,
                        metadata={
                            "google_doc_id": fid,
                            "url": f.get("webViewLink", ""),
                            "created_time": f.get("createdTime"),
                            "modified_time": f.get("modifiedTime"),
                            "owners": [o.get("displayName") for o in f.get("owners", [])]
                        },
                        created_at=f.get("createdTime"),
                        updated_at=f.get("modifiedTime")
                    ))
                except Exception:
                    # Skip files we can't read (permissions, etc.)
                    continue

            page_token = resp.get("nextPageToken")
            if not page_token:
                break

        return docs

    def _extract_text(self, doc: dict) -> str:
        body = doc.get("body", {}).get("content", [])
        paragraphs = []
        for elem in body:
            if "paragraph" in elem:
                para = elem["paragraph"]
                text = "".join(
                    e["textRun"].get("content", "")
                    for e in para.get("elements", [])
                    if "textRun" in e
                )
                if text.strip():
                    paragraphs.append(text.strip())
            elif "table" in elem:
                # Flatten table cells to text
                for row in elem["table"].get("tableRows", []):
                    for cell in row.get("tableCells", []):
                        for c in cell.get("content", []):
                            if "paragraph" in c:
                                txt = "".join(
                                    e["textRun"].get("content", "")
                                    for e in c["paragraph"].get("elements", [])
                                    if "textRun" in e
                                )
                                if txt.strip():
                                    paragraphs.append(txt.strip())
        return "\n".join(paragraphs)

    def parse_event(self, payload: dict) -> Optional[RawDocument]:
        """
        Google Drive push notifications (free) or Workspace Events.
        Typical payload: { "changeType": "file", "fileId": "...", "file": {...} }
        """
        file_id = payload.get("fileId") or payload.get("id")
        if not file_id:
            return None

        return RawDocument(
            id=f"gdoc-{file_id}",
            source_type=self.source_type,
            workspace_id=payload.get("workspace_id", ""),
            title=payload.get("name", "Untitled"),
            content="",  # Fetch in production pipeline
            metadata={
                "google_doc_id": file_id,
                "event_type": payload.get("changeType", "unknown"),
                "mime_type": payload.get("mimeType", "")
            }
        )


