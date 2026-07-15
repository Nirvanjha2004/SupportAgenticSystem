from typing import List, Optional, Dict, Any
from ingestion.base import BaseConnector
from ingestion.models import RawDocument
from ingestion.connectors.google_docs.oauth import GoogleDocsOAuth
from ingestion.connectors.google_docs.backfill import GoogleDocsBackfill


class GoogleDocsConnector(BaseConnector):
    source_type = "google_docs"

    def __init__(self):
        self.oauth = GoogleDocsOAuth()

    def get_oauth_url(self, state: str) -> str:
        return self.oauth.get_authorize_url(state)

    def handle_oauth_callback(self, code: str) -> Dict[str, Any]:
        return self.oauth.exchange_code(code)

    def backfill(self, credentials: Dict[str, Any], workspace_id: str) -> List[RawDocument]:
        token = credentials.get("access_token")
        return GoogleDocsBackfill(token).backfill_workspace(workspace_id)

    def ingest_event(self, payload: Dict[str, Any]) -> Optional[RawDocument]:
        """
        Google Drive push notifications or Workspace Events.
        Payload: { "changeType": "file", "fileId": "...", "file": {...} }
        """
        file_id = payload.get("fileId") or payload.get("id")
        if not file_id:
            return None

        return RawDocument(
            id=f"gdoc-{file_id}",
            source_type=self.source_type,
            workspace_id=payload.get("workspace_id", "unknown"),
            title=payload.get("name", "Untitled"),
            content="",  # Fetch in production pipeline if needed
            metadata={
                "google_doc_id": file_id,
                "event_type": payload.get("changeType", "unknown"),
                "mime_type": payload.get("mimeType", ""),
            },
        )