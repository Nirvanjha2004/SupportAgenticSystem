from ingestion.base import BaseConnector
from ingestion.models import RawDocument
from typing import List, Optional, Dict, Any
import requests
import base64
import json
from datetime import datetime, timezone
from urllib.parse import urlencode
import time

class SlackConnector(BaseConnector):
    """
    Slack Web API (free tier: 1 req/sec for some methods, tiered otherwise).
    Uses OAuth v2 + conversations.history + Events API.
    """
    source_type = "slack"

    CLIENT_ID = "your_slack_client_id"
    CLIENT_SECRET = "your_slack_client_secret"
    REDIRECT_URI = "https://your-app.com/callback"

    def get_oauth_url(self, state: str) -> str:
        scopes = [
            "channels:history",
            "groups:history",
            "im:history",
            "mpim:history",
            "channels:read",
            "groups:read",
            "users:read"
        ]
        params = {
            "client_id": self.CLIENT_ID,
            "scope": ",".join(scopes),
            "redirect_uri": self.REDIRECT_URI,
            "state": state
        }
        return f"https://slack.com/oauth/v2/authorize?{urlencode(params)}"

    def handle_oauth_callback(self, code: str) -> dict:
        resp = requests.post(
            "https://slack.com/api/oauth.v2.access",
            data={
                "code": code,
                "client_id": self.CLIENT_ID,
                "client_secret": self.CLIENT_SECRET,
                "redirect_uri": self.REDIRECT_URI
            }
        )
        resp.raise_for_status()
        data = resp.json()
        if not data.get("ok"):
            raise Exception(f"Slack OAuth failed: {data.get('error')}")

        return {
            "access_token": data.get("access_token"),
            "team_id": data.get("team", {}).get("id"),
            "team_name": data.get("team", {}).get("name"),
            "authed_user": data.get("authed_user", {})
        }

    def _api(self, method: str, token: str, params: dict) -> dict:
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.post(
            f"https://slack.com/api/{method}",
            headers=headers,
            data=params
        )
        resp.raise_for_status()
        data = resp.json()

        if not data.get("ok"):
            err = data.get("error", "unknown")
            if err == "ratelimited":
                retry = int(resp.headers.get("Retry-After", 1))
                time.sleep(retry)
                return self._api(method, token, params)
            raise Exception(f"Slack API error ({method}): {err}")

        return data

    def backfill(self, credentials: dict, workspace_id: str) -> List[RawDocument]:
        token = credentials.get("access_token")
        docs: List[RawDocument] = []

        # 1) List all conversation types
        channels = []
        for ctype in ("public_channel", "private_channel", "mpim", "im"):
            cursor = None
            while True:
                params = {"types": ctype, "limit": 200}
                if cursor:
                    params["cursor"] = cursor

                resp = self._api("conversations.list", token, params)
                channels.extend(resp.get("channels", []))
                cursor = resp.get("response_metadata", {}).get("next_cursor")
                if not cursor:
                    break

        # 2) Fetch history per channel
        for ch in channels:
            cid = ch["id"]
            cname = ch.get("name") or ch.get("user", "DM")

            cursor = None
            while True:
                params = {"channel": cid, "limit": 200}
                if cursor:
                    params["cursor"] = cursor

                resp = self._api("conversations.history", token, params)
                messages = resp.get("messages", [])

                for msg in messages:
                    if msg.get("subtype") in ("bot_message", "channel_join", "channel_leave"):
                        continue

                    doc = self._message_to_doc(msg, cid, cname, workspace_id, token)
                    if doc:
                        docs.append(doc)

                    # Fetch thread replies
                    if msg.get("reply_count", 0) > 0:
                        try:
                            thread = self._api(
                                "conversations.replies",
                                token,
                                {"channel": cid, "ts": msg["ts"]}
                            )
                            for reply in thread.get("messages", [])[1:]:
                                rd = self._message_to_doc(reply, cid, cname, workspace_id, token, parent_ts=msg["ts"])
                                if rd:
                                    docs.append(rd)
                        except Exception:
                            pass

                cursor = resp.get("response_metadata", {}).get("next_cursor")
                if not cursor:
                    break

        return docs

    def _message_to_doc(self, msg: dict, channel_id: str, channel_name: str,
                        workspace_id: str, token: str, parent_ts: Optional[str] = None) -> Optional[RawDocument]:
        ts = msg.get("ts")
        if not ts:
            return None

        user_id = msg.get("user", "unknown")
        user_name = self._get_user_name(user_id, token)

        dt = datetime.fromtimestamp(float(ts), tz=timezone.utc).isoformat()

        return RawDocument(
            id=f"slack-{channel_id}-{ts}",
            source_type=self.source_type,
            workspace_id=workspace_id,
            title=f"#{channel_name} — {user_name}",
            content=msg.get("text", ""),
            metadata={
                "channel_id": channel_id,
                "channel_name": channel_name,
                "user_id": user_id,
                "user_name": user_name,
                "timestamp": ts,
                "parent_ts": parent_ts,
                "has_files": "files" in msg,
                "reactions": [r.get("name") for r in msg.get("reactions", [])]
            },
            created_at=dt,
            updated_at=dt
        )

    def _get_user_name(self, user_id: str, token: str) -> str:
        if user_id == "unknown":
            return "unknown"
        try:
            resp = self._api("users.info", token, {"user": user_id})
            u = resp.get("user", {})
            return u.get("real_name") or u.get("name", user_id)
        except Exception:
            return user_id

    def parse_event(self, payload: dict) -> Optional[RawDocument]:
        """
        Slack Events API (free). Payload has nested `event` object.
        """
        event = payload.get("event", {})
        if event.get("type") != "message":
            return None

        # Skip bot messages, thread broadcasts, message edits
        if event.get("bot_id") or event.get("subtype"):
            return None

        channel = event.get("channel", "")
        ts = event.get("ts", "")
        if not ts:
            return None

        dt = datetime.fromtimestamp(float(ts), tz=timezone.utc).isoformat()

        return RawDocument(
            id=f"slack-{channel}-{ts}",
            source_type=self.source_type,
            workspace_id=payload.get("team_id", ""),
            title=f"Message in {channel}",
            content=event.get("text", ""),
            metadata={
                "channel_id": channel,
                "user_id": event.get("user", ""),
                "timestamp": ts,
                "thread_ts": event.get("thread_ts")
            },
            created_at=dt,
            updated_at=dt
        )