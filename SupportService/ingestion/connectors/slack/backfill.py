from typing import List, Dict, Any, Optional
import requests
import time
from ingestion.models import RawDocument
from ingestion.connectors.slack.mappers import map_message_to_document

class SlackBackfill:
    def __init__(self, access_token: str):
        self.token = access_token
        self.base_url = "https://slack.com/api"

    def _api(self, method: str, params: Dict[str, Any]) -> Dict[str, Any]:
        headers = {"Authorization": f"Bearer {self.token}"}
        resp = requests.post(f"{self.base_url}/{method}", headers=headers, data=params)
        resp.raise_for_status()
        data = resp.json()

        if not data.get("ok"):
            err = data.get("error", "unknown")
            if err == "ratelimited":
                retry = int(resp.headers.get("Retry-After", 1))
                time.sleep(retry)
                return self._api(method, params)
            raise Exception(f"Slack API error ({method}): {err}")
        return data

    def get_user_name(self, user_id: str) -> str:
        if not user_id or user_id == "unknown":
            return "unknown"
        try:
            resp = self._api("users.info", {"user": user_id})
            u = resp.get("user", {})
            return u.get("real_name") or u.get("name") or user_id
        except Exception:
            return user_id

    def list_conversations(self, types: str = "public_channel,private_channel,mpim,im") -> List[Dict[str, Any]]:
        channels, cursor = [], None
        while True:
            params = {"types": types, "limit": 200}
            if cursor:
                params["cursor"] = cursor
            resp = self._api("conversations.list", params)
            channels.extend(resp.get("channels", []))
            cursor = resp.get("response_metadata", {}).get("next_cursor")
            if not cursor:
                break
        return channels

    def fetch_history(self, channel_id: str, limit: int = 200) -> List[Dict[str, Any]]:
        messages, cursor = [], None
        while True:
            params = {"channel": channel_id, "limit": limit}
            if cursor:
                params["cursor"] = cursor
            resp = self._api("conversations.history", params)
            batch = resp.get("messages", [])
            messages.extend(batch)
            cursor = resp.get("response_metadata", {}).get("next_cursor")
            if not cursor or not batch:
                break
        return messages

    def fetch_replies(self, channel_id: str, thread_ts: str) -> List[Dict[str, Any]]:
        resp = self._api("conversations.replies", {"channel": channel_id, "ts": thread_ts})
        return resp.get("messages", [])

    def backfill_workspace(self, workspace_id: str) -> List[RawDocument]:
        docs = []
        for ch in self.list_conversations():
            cid = ch["id"]
            cname = ch.get("name") or ch.get("user", "DM")

            for msg in self.fetch_history(cid):
                if msg.get("subtype") in ("bot_message", "channel_join", "channel_leave"):
                    continue

                user_name = self.get_user_name(msg.get("user", "unknown"))
                doc = map_message_to_document(msg, cid, cname, workspace_id, user_name)
                if doc:
                    docs.append(doc)

                if msg.get("reply_count", 0) > 0:
                    try:
                        for reply in self.fetch_replies(cid, msg["ts"])[1:]:
                            reply["parent_ts"] = msg["ts"]
                            ru = self.get_user_name(reply.get("user", "unknown"))
                            rd = map_message_to_document(reply, cid, cname, workspace_id, ru)
                            if rd:
                                docs.append(rd)
                    except Exception:
                        pass
        return docs