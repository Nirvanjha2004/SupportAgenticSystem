from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
import secrets
import requests
from ingestion.connectors.slack.oauth import SlackOAuth
from ingestion.connectors.google_docs.oauth import GoogleDocsOAuth
from ingestion.connectors.notion.oauth import NotionOAuth
from ingestion.storage.credentials import CredentialStore
from ingestion.jobs.queue import JobQueue
from config import settings

router = APIRouter()
store = CredentialStore(settings.REDIS_URL, settings.ENCRYPTION_KEY)
queue = JobQueue()

# Frontend URL for redirect after OAuth
FRONTEND_URL = "http://localhost:5173"


# ─── Slack ───────────────────────────────────────────────────────────

@router.get("/connectors/slack/install")
async def slack_install():
    state = secrets.token_urlsafe(32)
    url = SlackOAuth().get_authorize_url(state)
    return RedirectResponse(url=url)

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

    # Redirect back to onboarding page
    return RedirectResponse(url=f"{FRONTEND_URL}/onboarding")


# ─── Google Docs ─────────────────────────────────────────────────────

@router.get("/connectors/google_docs/install")
async def google_docs_install():
    state = secrets.token_urlsafe(32)
    url = GoogleDocsOAuth().get_authorize_url(state)
    return RedirectResponse(url=url)

@router.get("/connectors/google_docs/callback")
async def google_docs_callback(code: str, state: str):
    try:
        credentials = GoogleDocsOAuth().exchange_code(code)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Fetch user info to get a real workspace identifier
    access_token = credentials.get("access_token")
    try:
        user_resp = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user_resp.raise_for_status()
        user_info = user_resp.json()
        workspace_id = user_info.get("email", "unknown-google-user")
        user_email = user_info.get("email")
    except Exception as e:
        # Fallback if userinfo fails
        workspace_id = credentials.get("refresh_token", "unknown")[:20]
        user_email = None

    store.save("google_docs", workspace_id, credentials)
    queue.enqueue_backfill("google_docs", workspace_id)

    # Redirect back to onboarding page
    return RedirectResponse(url=f"{FRONTEND_URL}/onboarding")


# ─── Notion ──────────────────────────────────────────────────────────

@router.get("/connectors/notion/install")
async def notion_install():
    state = secrets.token_urlsafe(32)
    url = NotionOAuth().get_authorize_url(state)
    return RedirectResponse(url=url)

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

    # Redirect back to onboarding page
    return RedirectResponse(url=f"{FRONTEND_URL}/onboarding")