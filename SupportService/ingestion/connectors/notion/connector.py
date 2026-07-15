from ingestion.base import BaseConnector
from ingestion.models import RawDocument
from typing import List, Optional, Dict, Any
import requests
import base64
import json
from datetime import datetime, timezone
from urllib.parse import urlencode
import time


class NotionConnector(BaseConnector):
    """
    Notion Integration API (free tier: ~3 req/sec).
    Uses OAuth 2.0 + /v1/search + /v1/blocks/{id}/children.
    """
    source_type = "notion"

    CLIENT_ID = "your_notion_client_id"      # Load from env in production
    CLIENT_SECRET = "your_notion_client_secret"
    REDIRECT_URI = "https://your-app.com/callback"

    def get_oauth_url(self, state: str) -> str:
        params = {
            "client_id": self.CLIENT_ID,
            "redirect_uri": self.REDIRECT_URI,
            "response_type": "code",
            "state": state,
            "owner": "user"
        }
        return f"https://api.notion.com/v1/oauth/authorize?{urlencode(params)}"

    def handle_oauth_callback(self, code: str) -> dict:
        auth_str = f"{self.CLIENT_ID}:{self.CLIENT_SECRET}"
        auth_b64 = base64.b64encode(auth_str.encode()).decode()

        resp = requests.post(
            "https://api.notion.com/v1/oauth/token",
            headers={
                "Authorization": f"Basic {auth_b64}",
                "Content-Type": "application/json"
            },
            json={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": self.REDIRECT_URI
            }
        )
        resp.raise_for_status()
        return resp.json()

    def _api(self, method: str, endpoint: str, token: str, json_data=None, params=None):
        """Thin wrapper with rate-limit backoff."""
        headers = {
            "Authorization": f"Bearer {token}",
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
        }
        url = f"https://api.notion.com/v1{endpoint}"

        if method == "GET":
            resp = requests.get(url, headers=headers, params=params)
        else:
            resp = requests.post(url, headers=headers, json=json_data)

        # Free-tier rate limit: 3 req/sec — backoff if 429
        if resp.status_code == 429:
            retry = int(resp.headers.get("Retry-After", 1))
            time.sleep(retry)
            return self._api(method, endpoint, token, json_data, params)

        resp.raise_for_status()
        return resp.json()

    def backfill(self, credentials: dict, workspace_id: str) -> List[RawDocument]:
        token = credentials.get("access_token")
        docs: List[RawDocument] = []

        # 1) Paginated search across all pages/databases
        items = []
        cursor = None
        while True:
            payload = {"page_size": 100}
            if cursor:
                payload["start_cursor"] = cursor

            resp = self._api("POST", "/search", token, json_data=payload)
            items.extend(resp.get("results", []))
            if not resp.get("has_more"):
                break
            cursor = resp.get("next_cursor")

        # 2) Fetch content for each page
        for item in items:
            obj = item.get("object")
            iid = item.get("id")

            if obj == "page":
                page = self._api("GET", f"/pages/{iid}", token)
                title = self._extract_title(page)
                blocks = self._fetch_blocks(iid, token)
                text = self._blocks_to_markdown(blocks)

                docs.append(RawDocument(
                    id=f"notion-{iid}",
                    source_type=self.source_type,
                    workspace_id=workspace_id,
                    title=title,
                    content=text,
                    metadata={
                        "notion_id": iid,
                        "url": page.get("url", ""),
                        "created_time": page.get("created_time"),
                        "last_edited_time": page.get("last_edited_time"),
                        "object_type": "page"
                    },
                    created_at=page.get("created_time"),
                    updated_at=page.get("last_edited_time")
                ))

            elif obj == "database":
                # Treat DB schema as a document; skip rows to stay in free tier
                db = self._api("GET", f"/databases/{iid}", token)
                docs.append(RawDocument(
                    id=f"notion-{iid}",
                    source_type=self.source_type,
                    workspace_id=workspace_id,
                    title=self._extract_title(db),
                    content=json.dumps(db.get("properties", {})),
                    metadata={
                        "notion_id": iid,
                        "url": db.get("url", ""),
                        "created_time": db.get("created_time"),
                        "last_edited_time": db.get("last_edited_time"),
                        "object_type": "database"
                    },
                    created_at=db.get("created_time"),
                    updated_at=db.get("last_edited_time")
                ))

        return docs

    def _fetch_blocks(self, block_id: str, token: str) -> List[dict]:
        blocks = []
        cursor = None
        while True:
            params = {"start_cursor": cursor} if cursor else None
            resp = self._api("GET", f"/blocks/{block_id}/children", token, params=params)
            blocks.extend(resp.get("results", []))
            if not resp.get("has_more"):
                break
            cursor = resp.get("next_cursor")

        # Recursively fetch nested blocks
        all_blocks = []
        for b in blocks:
            all_blocks.append(b)
            if b.get("has_children"):
                all_blocks.extend(self._fetch_blocks(b["id"], token))
        return all_blocks

    def _blocks_to_markdown(self, blocks: List[dict]) -> str:
        out = []
        for b in blocks:
            t = b.get("type", "")
            val = b.get(t, {})
            if "rich_text" in val:
                line = "".join(rt.get("plain_text", "") for rt in val["rich_text"])
                if t.startswith("heading"):
                    level = int(t[-1]) if t[-1].isdigit() else 1
                    out.append(f"{'#' * level} {line}")
                elif t == "bulleted_list_item":
                    out.append(f"- {line}")
                elif t == "numbered_list_item":
                    out.append(f"1. {line}")
                elif t == "to_do":
                    checked = "x" if val.get("checked") else " "
                    out.append(f"- [{checked}] {line}")
                elif t == "code":
                    lang = val.get("language", "")
                    out.append(f"```{lang}\n{line}\n```")
                else:
                    out.append(line)
            elif t == "divider":
                out.append("---")
        return "\n".join(out)

    def _extract_title(self, obj: dict) -> str:
        props = obj.get("properties", {})
        title = props.get("title")
        if title and "title" in title:
            return "".join(t.get("plain_text", "") for t in title["title"])
        # Database title
        db_title = obj.get("title", [])
        if db_title:
            return "".join(t.get("plain_text", "") for t in db_title)
        return "Untitled"

    def parse_event(self, payload: dict) -> Optional[RawDocument]:
        """
        Notion webhooks (2024+) or polling-based events.
        Free tier supports webhooks; payload shape is:
        { "type": "page.created"|"page.updated", "page": {...} }
        """
        event_type = payload.get("type", "")
        if not event_type.startswith("page."):
            return None

        page = payload.get("page", {})
        pid = page.get("id")
        if not pid:
            return None

        return RawDocument(
            id=f"notion-{pid}",
            source_type=self.source_type,
            workspace_id=payload.get("workspace_id", ""),
            title=self._extract_title(page),
            content="",  # In production, fetch blocks here
            metadata={
                "notion_id": pid,
                "event_type": event_type,
                "url": page.get("url", "")
            },
            updated_at=page.get("last_edited_time")
        )


