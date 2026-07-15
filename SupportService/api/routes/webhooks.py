from fastapi import APIRouter, Request, Header, HTTPException
from ingestion.jobs.queue import JobQueue
from ingestion.connectors.slack.connector import SlackConnector
from config import settings

router = APIRouter()
queue = JobQueue()


# ─── Slack ───────────────────────────────────────────────────────────

@router.post("/webhooks/slack/events")
async def slack_events(
    request: Request,
    x_slack_signature: str = Header(None),
    x_slack_request_timestamp: str = Header(None),
):
    body = await request.body()
    payload = await request.json()

    if payload.get("type") == "url_verification":
        return {"challenge": payload.get("challenge")}

    if settings.SLACK_SIGNING_SECRET:
        connector = SlackConnector()
        connector.set_webhook_secret(settings.SLACK_SIGNING_SECRET)
        if not connector._webhook_handler.verify_request(
            body, x_slack_request_timestamp or "", x_slack_signature or ""
        ):
            raise HTTPException(status_code=401, detail="Invalid signature")

    workspace_id = payload.get("team_id", "unknown")
    queue.enqueue_incremental("slack", workspace_id, payload)
    return {"status": "ok"}


# ─── Notion ──────────────────────────────────────────────────────────

@router.post("/webhooks/notion/events")
async def notion_events(request: Request):
    payload = await request.json()
    # Notion webhooks are newer; verify signature if available
    workspace_id = payload.get("workspace_id", "unknown")
    queue.enqueue_incremental("notion", workspace_id, payload)
    return {"status": "ok"}


# ─── Google Docs ─────────────────────────────────────────────────────
# Google Drive push notifications use a different mechanism (Pub/Sub or HTTPS)
# and are usually configured via the Google Cloud Console, not a simple webhook endpoint.
# You'd verify the X-Goog-Resource-State header and enqueue accordingly.