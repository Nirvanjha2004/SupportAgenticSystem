from datetime import datetime, timezone
from typing import Optional, Dict, Any
from ingestion.models import RawDocument, SourceType


def map_file_to_document(
    file_data: Dict[str, Any],
    content_text: str,
    workspace_id: str,
) -> Optional[RawDocument]:
    fid = file_data.get("id")
    if not fid:
        return None

    created = file_data.get("createdTime")
    modified = file_data.get("modifiedTime")

    def _parse_dt(iso: str) -> Optional[datetime]:
        if not iso:
            return None
        try:
            return datetime.fromisoformat(iso.replace("Z", "+00:00"))
        except Exception:
            return None

    return RawDocument(
        id=f"gdoc-{fid}",
        source_type=SourceType.GOOGLE_DOCS,
        workspace_id=workspace_id,
        title=file_data.get("name", "Untitled"),
        content=content_text,
        metadata={
            "google_doc_id": fid,
            "url": file_data.get("webViewLink", ""),
            "mime_type": file_data.get("mimeType", ""),
            "owners": [o.get("displayName") for o in file_data.get("owners", [])],
            "created_time": created,
            "modified_time": modified,
        },
        created_at=_parse_dt(created),
        updated_at=_parse_dt(modified),
    )