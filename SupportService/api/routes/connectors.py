from fastapi import APIRouter, HTTPException
import secrets
from ingestion.connectors.slack.oauth import SlackOAuth
from ingestion.connectors.google_docs.oauth import GoogleDocsOAuth
from ingestion.connectors.notion.oauth import NotionOAuth
from ingestion.storage.credentials import CredentialStore
from ingestion.jobs.queue import JobQueue
from config import settings

router = APIRouter()
store = CredentialStore(settings.REDIS_URL, settings.ENCRYPTION_KEY)
queue = JobQueue()


# ─── Slack ───────────────────────────────────────────────────────────

@router.get("/connectors/slack/install")
async def slack_install():
    state = secrets.token_urlsafe(32)
    url = SlackOAuth().get_authorize_url(state)
    return {"url": url}

@router.get("/connectors/slack/callback")
async def slack_callback(code: str, state: str):
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


# ─── Google Docs ─────────────────────────────────────────────────────

@router.get("/connectors/google_docs/install")
async def google_docs_install():
    state = secrets.token_urlsafe(32)
    url = GoogleDocsOAuth().get_authorize_url(state)
    return {"url": url}

@router.get("/connectors/google_docs/callback")
async def google_docs_callback(code: str, state: str):
    try:
        credentials = GoogleDocsOAuth().exchange_code(code)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Google doesn't return workspace_id in the same way; we use a placeholder or extract from token
    workspace_id = credentials.get("scope", "google-workspace")  # Or call tokeninfo if needed
    store.save("google_docs", workspace_id, credentials)
    queue.enqueue_backfill("google_docs", workspace_id)

    return {"status": "connected", "workspace_id": workspace_id}


# ─── Notion ──────────────────────────────────────────────────────────

@router.get("/connectors/notion/install")
async def notion_install():
    state = secrets.token_urlsafe(32)
    url = NotionOAuth().get_authorize_url(state)
    return {"url": url}

@router.get("/connectors/notion/callback")
async def notion_callback(code: str, state: str):
    try:
        credentials = NotionOAuth().exchange_code(code)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    workspace_id = credentials.get("workspace_id")
    if not workspace_id:
        raise HTTPException(status_code=400, detail="Missing workspace_id")

    store.save("notion", workspace_id, credentials)
    queue.enqueue_backfill("notion", workspace_id)

    return {"status": "connected", "workspace_id": workspace_id, "workspace_name": credentials.get("workspace_name")}