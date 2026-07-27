from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
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
async def slack_install(workspace_id: str = Query(...)):
    state = workspace_id
    url = SlackOAuth().get_authorize_url(state)
    return RedirectResponse(url=url)

@router.get("/connectors/slack/callback")
async def slack_callback(code: str, state: str):
    try:
        credentials = SlackOAuth().exchange_code(code)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    workspace_id = state or credentials.get("team_id")
    if not workspace_id:
        raise HTTPException(status_code=400, detail="Missing workspace_id")

    store.save("slack", workspace_id, credentials)
    queue.enqueue_backfill("slack", workspace_id)

    # Redirect back to onboarding page
    return RedirectResponse(url=f"{FRONTEND_URL}/onboarding")


# ─── Google Docs ─────────────────────────────────────────────────────

@router.get("/connectors/google_docs/install")
async def google_docs_install(workspace_id: str = Query(...)):
    state = workspace_id
    url = GoogleDocsOAuth().get_authorize_url(state)
    return RedirectResponse(url=url)

@router.get("/connectors/google_docs/callback")
async def google_docs_callback(code: str, state: str):
    try:
        credentials = GoogleDocsOAuth().exchange_code(code)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Use onboarding workspace id from OAuth state so connector status is tenant-scoped.
    workspace_id = state
    access_token = credentials.get("access_token")
    try:
        user_resp = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user_resp.raise_for_status()
        _ = user_resp.json()
    except Exception as e:
        # Fallback if userinfo fails; keep the app workspace id from OAuth state.
        pass

    if not workspace_id:
        raise HTTPException(status_code=400, detail="Missing workspace_id")

    store.save("google_docs", workspace_id, credentials)
    queue.enqueue_backfill("google_docs", workspace_id)

    # Redirect back to onboarding page
    return RedirectResponse(url=f"{FRONTEND_URL}/onboarding")


# ─── Notion ──────────────────────────────────────────────────────────

@router.get("/connectors/notion/install")
async def notion_install(workspace_id: str = Query(...)):
    state = workspace_id
    url = NotionOAuth().get_authorize_url(state)
    return RedirectResponse(url=url)

@router.get("/connectors/notion/callback")
async def notion_callback(code: str, state: str):
    try:
        credentials = NotionOAuth().exchange_code(code)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    workspace_id = state or credentials.get("workspace_id")
    if not workspace_id:
        raise HTTPException(status_code=400, detail="Missing workspace_id")

    store.save("notion", workspace_id, credentials)
    queue.enqueue_backfill("notion", workspace_id)

    # Redirect back to onboarding page
    return RedirectResponse(url=f"{FRONTEND_URL}/onboarding")