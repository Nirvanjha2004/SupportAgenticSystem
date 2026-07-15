from abc import ABC, abstractmethod
from typing import List
from ingestion.models import RawDocument

class BaseConnector(ABC):
    source_type: str  # "slack", "google_docs", "notion"

    @abstractmethod
    def get_oauth_url(self, state: str) -> str:
        """Return the URL user is redirected to for authorization."""
        ...

    @abstractmethod
    def handle_oauth_callback(self, code: str) -> dict:
        """Exchange code for token, return credentials to persist."""
        ...

    @abstractmethod
    def backfill(self, credentials: dict, workspace_id: str) -> List[RawDocument]:
        """Pull historical data on first connect."""
        ...

    @abstractmethod
    def parse_event(self, payload: dict) -> RawDocument | None:
        """Convert a real-time webhook/event payload into a RawDocument."""
        ...