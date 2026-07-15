from datetime import datetime, timezone
from typing import Optional, Dict, Any
from ingestion.models import RawDocument, SourceType

def map_message_to_document(
    message: Dict[str, Any],
    channel_id: str,
    channel_name: str,
    workspace_id: str,
    user_name: str = "unknown"
) -> Optional[RawDocument]:
    ts = message.get("ts")
    if not ts:
        return None

    if message.get("subtype") in ("bot_message", "channel_join", "channel_leave", "channel_topic"):
        return None

    dt = datetime.fromtimestamp(float(ts), tz=timezone.utc)
    text = message.get("text", "") or ""

    files = message.get("files", [])
    if files:
        names = [f.get("name", "unnamed") for f in files]
        text += f"\n[Attached files: {', '.join(names)}]"

    return RawDocument(
        id=f"slack-{channel_id}-{ts}",
        source_type=SourceType.SLACK,
        workspace_id=workspace_id,
        title=f"#{channel_name} — {user_name}",
        content=text,
        metadata={
            "channel_id": channel_id,
            "channel_name": channel_name,
            "user_id": message.get("user", "unknown"),
            "user_name": user_name,
            "timestamp": ts,
            "thread_ts": message.get("thread_ts"),
            "parent_ts": message.get("parent_ts"),
            "has_files": bool(files),
            "reactions": [r.get("name") for r in message.get("reactions", [])],
            "permalink": message.get("permalink", ""),
            "message_type": message.get("type", "message"),
            "subtype": message.get("subtype")
        },
        created_at=dt,
        updated_at=dt
    )