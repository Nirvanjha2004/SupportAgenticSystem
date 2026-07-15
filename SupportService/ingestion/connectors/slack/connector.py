from typing import List, Optional, Dict, Any
from ingestion.base import BaseConnector
from ingestion.models import RawDocument
from ingestion.connectors.slack.oauth import SlackOAuth
from ingestion.connectors.slack.backfill import SlackBackfill
from ingestion.connectors.slack.webhook import SlackWebhookHandler

class SlackConnector(BaseConnector):
    source_type = "slack"

    def __init__(self):
        self.oauth = SlackOAuth()
        self._webhook_handler: Optional[SlackWebhookHandler] = None

    def get_oauth_url(self, state: str) -> str:
        return self.oauth.get_authorize_url(state)

    def handle_oauth_callback(self, code: str) -> Dict[str, Any]:
        return self.oauth.exchange_code(code)

    def backfill(self, credentials: Dict[str, Any], workspace_id: str) -> List[RawDocument]:
        token = credentials.get("access_token")
        return SlackBackfill(token).backfill_workspace(workspace_id)

    def ingest_event(self, payload: Dict[str, Any]) -> Optional[RawDocument]:
        workspace_id = payload.get("team_id", "unknown")
        if self._webhook_handler:
            return self._webhook_handler.handle_event(payload, workspace_id)
        return None

    def set_webhook_secret(self, signing_secret: str):
        self._webhook_handler = SlackWebhookHandler(signing_secret)