from datetime import datetime, timezone
from typing import Optional, Dict, Any
from ingestion.models import RawDocument, SourceType


def map_page_to_document(
    page: Dict[str, Any],
    text_content: str,
    workspace_id: str,
) -> Optional[RawDocument]:
    pid = page.get("id")
    if not pid:
        return None

    created = page.get("created_time")
    edited = page.get("last_edited_time")

    def _parse_dt(iso: str) -> Optional[datetime]:
        if not iso:
            return None
        try:
            return datetime.fromisoformat(iso.replace("Z", "+00:00"))
        except Exception:
            return None

    title = "Untitled"
    props = page.get("properties", {})
    title_prop = props.get("title")
    if title_prop and "title" in title_prop:
        title = "".join(t.get("plain_text", "") for t in title_prop["title"])

    return RawDocument(
        id=f"notion-{pid}",
        source_type=SourceType.NOTION,
        workspace_id=workspace_id,
        title=title,
        content=text_content,
        metadata={
            "notion_id": pid,
            "url": page.get("url", ""),
            "created_time": created,
            "last_edited_time": edited,
            "object_type": page.get("object", "page"),
        },
        created_at=_parse_dt(created),
        updated_at=_parse_dt(edited),
    )


def map_database_to_document(
    db: Dict[str, Any],
    workspace_id: str,
) -> Optional[RawDocument]:
    did = db.get("id")
    if not did:
        return None

    title_parts = db.get("title", [])
    title = "".join(t.get("plain_text", "") for t in title_parts) or "Untitled Database"

    created = db.get("created_time")
    edited = db.get("last_edited_time")

    def _parse_dt(iso: str) -> Optional[datetime]:
        if not iso:
            return None
        try:
            return datetime.fromisoformat(iso.replace("Z", "+00:00"))
        except Exception:
            return None

    return RawDocument(
        id=f"notion-{did}",
        source_type=SourceType.NOTION,
        workspace_id=workspace_id,
        title=title,
        content=str(db.get("properties", {})),
        metadata={
            "notion_id": did,
            "url": db.get("url", ""),
            "created_time": created,
            "last_edited_time": edited,
            "object_type": "database",
        },
        created_at=_parse_dt(created),
        updated_at=_parse_dt(edited),
    )