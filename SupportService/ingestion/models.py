from pydantic import BaseModel
from datetime import datetime

class RawDocument(BaseModel):
    source_type: str        # "slack", "notion", "google_docs"
    workspace_id: str
    external_id: str        # slack message ts, notion block id, gdoc id
    content: str
    metadata: dict          # channel_id, author, url, doc_title, etc.
    created_at: datetime