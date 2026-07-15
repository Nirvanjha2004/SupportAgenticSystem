import hmac
import hashlib
from typing import Dict, Any, Optional
from ingestion.models import RawDocument
from ingestion.connectors.slack.mappers import map_message_to_document

class SlackWebhookHandler:
    def __init__(self, signing_secret: str):
        self.signing_secret = signing_secret

    def verify_request(self, body: bytes, timestamp: str, signature: str) -> bool:
        basestring = f"v0:{timestamp}:{body.decode('utf-8')}".encode("utf-8")
        my_signature = "v0=" + hmac.new(
            self.signing_secret.encode("utf-8"),
            basestring,
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(my_signature, signature)

    def get_challenge_response(self, payload: Dict[str, Any]) -> str:
        return payload.get("challenge", "")

    def handle_event(self, payload: Dict[str, Any], workspace_id: str) -> Optional[RawDocument]:
        if payload.get("type") == "url_verification":
            return None

        if payload.get("type") != "event_callback":
            return None

        event = payload.get("event", {})
        if event.get("type") != "message":
            return None
        if event.get("bot_id") or event.get("subtype"):
            return None

        return map_message_to_document(
            message=event,
            channel_id=event.get("channel", ""),
            channel_name=payload.get("channel_name", "unknown"),
            workspace_id=workspace_id,
            user_name=event.get("user", "unknown")
        )