from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from ingestion.models import RawDocument

class BaseConnector(ABC):
    source_type: str

    @abstractmethod
    def get_oauth_url(self, state: str) -> str:
        ...

    @abstractmethod
    def handle_oauth_callback(self, code: str) -> Dict[str, Any]:
        ...

    @abstractmethod
    def backfill(self, credentials: Dict[str, Any], workspace_id: str) -> List[RawDocument]:
        ...

    @abstractmethod
    def ingest_event(self, payload: Dict[str, Any]) -> Optional[RawDocument]:
        ...