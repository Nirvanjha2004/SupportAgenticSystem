from typing import List, Optional, Dict, Any
from ingestion.base import BaseConnector
from ingestion.models import RawDocument
from ingestion.connectors.notion.oauth import NotionOAuth
from ingestion.connectors.notion.backfill import NotionBackfill


class NotionConnector(BaseConnector):
    source_type = "notion"

    def __init__(self):
        self.oauth = NotionOAuth()

    def get_oauth_url(self, state: str) -> str:
        return self.oauth.get_authorize_url(state)

    def handle_oauth_callback(self, code: str) -> Dict[str, Any]:
        return self.oauth.exchange_code(code)

    def backfill(self, credentials: Dict[str, Any], workspace_id: str) -> List[RawDocument]:
        token = credentials.get("access_token")
        return NotionBackfill(token).backfill_workspace(workspace_id)

    def ingest_event(self, payload: Dict[str, Any]) -> Optional[RawDocument]:
        """
        Notion webhooks (2024+) or polling events.
        Payload: { "type": "page.created"|"page.updated", "page": {...} }
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
            workspace_id=payload.get("workspace_id", "unknown"),
            title="Notion Page",  # Would extract from page object in production
            content="",
            metadata={
                "notion_id": pid,
                "event_type": event_type,
                "url": page.get("url", ""),
            },
            updated_at=page.get("last_edited_time"),
        )