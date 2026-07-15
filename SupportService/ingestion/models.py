from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any
from enum import Enum

class SourceType(str, Enum):
    SLACK = "slack"
    NOTION = "notion"
    GOOGLE_DOCS = "google_docs"

class RawDocument(BaseModel):
    id: str
    source_type: SourceType
    workspace_id: str
    title: Optional[str] = None
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    chunk_index: Optional[int] = None