from fastapi import APIRouter, HTTPException
import secrets
from ingestion.connectors.slack.oauth import SlackOAuth
from ingestion.storage.credentials import CredentialStore
from ingestion.jobs.queue import JobQueue
from config import settings

router = APIRouter()
store = CredentialStore(settings.REDIS_URL, settings.ENCRYPTION_KEY)
queue = JobQueue()

@router.get("/connectors/slack/install")
async def slack_install():
    state = secrets.token_urlsafe(32)
    # TODO: store state in Redis with TTL for CSRF protection
    url = SlackOAuth().get_authorize_url(state)
    return {"url": url}

@router.get("/connectors/slack/callback")
async def slack_callback(code: str, state: str):
    # TODO: verify state matches stored value
    try:
        credentials = SlackOAuth().exchange_code(code)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    workspace_id = credentials.get("team_id")
    if not workspace_id:
        raise HTTPException(status_code=400, detail="Missing team_id")

    store.save("slack", workspace_id, credentials)
    queue.enqueue_backfill("slack", workspace_id)

    return {"status": "connected", "workspace_id": workspace_id, "team_name": credentials.get("team_name")}