# main.py
import os
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage, AIMessage

from config import settings
from api.routes import connectors, webhooks
from vectorstore.store import VectorStore
from rag.chain import build_rag_chain, build_structured_rag_chain, stream_rag_answer
from rag.models import CitedAnswer
from ingestion.storage.credentials import CredentialStore
from ingestion.jobs.queue import JobQueue

# ─── CRITICAL: Import connectors to trigger self-registration ─────────
import ingestion.connectors.slack      # noqa: F401
import ingestion.connectors.google_docs  # noqa: F401
import ingestion.connectors.notion       # noqa: F401


# ─── Lifespan: init shared resources ─────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.vectorstore = VectorStore()
    app.state.rag_chain = build_rag_chain(app.state.vectorstore, stream=False)
    app.state.rag_stream_chain = build_rag_chain(app.state.vectorstore, stream=True)
    app.state.structured_chain = build_structured_rag_chain(app.state.vectorstore)
    app.state.credential_store = CredentialStore(settings.REDIS_URL, settings.ENCRYPTION_KEY)
    app.state.job_queue = JobQueue()
    yield
    # Shutdown (Chroma persists automatically, nothing to close)
    pass


# ─── App ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="SupportService",
    description="Async ingestion + RAG over Slack, Notion, and Google Docs",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────

app.include_router(connectors.router)
app.include_router(webhooks.router)


# ─── Request / Response Models ───────────────────────────────────────

class QueryRequest(BaseModel):
    question: str
    workspace_id: Optional[str] = None
    chat_history: List[dict] = Field(default_factory=list)
    stream: bool = False
    structured: bool = False


class QueryResponse(BaseModel):
    answer: str
    sources: List[dict] = Field(default_factory=list)


class ConnectorStatusResponse(BaseModel):
    type: str
    name: str
    connected: bool
    status: str
    last_synced: Optional[str] = None
    doc_count: Optional[int] = None
    progress: Optional[float] = None


# ─── Health ──────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "support-service"}


# ─── RAG Query ───────────────────────────────────────────────────────

@app.post("/query", response_model=QueryResponse)
async def query(req: QueryRequest):
    """
    Standard RAG query. Returns a cited answer with source metadata.
    """
    if req.structured:
        # Return structured CitedAnswer
        result = app.state.structured_chain.invoke({
            "question": req.question,
            "workspace_id": req.workspace_id,
            "chat_history": _parse_history(req.chat_history)
        })
        return QueryResponse(
            answer=result.answer,
            sources=[{"citations": result.citations, "confidence": result.confidence}]
        )

    answer = app.state.rag_chain.invoke({
        "question": req.question,
        "workspace_id": req.workspace_id,
        "chat_history": _parse_history(req.chat_history)
    })

    return QueryResponse(answer=answer)


@app.post("/query/stream")
async def query_stream(req: QueryRequest):
    """
    Streaming RAG query. Returns SSE tokens as they are generated.
    """
    async def event_generator():
        async for token in stream_rag_answer(
            app.state.rag_stream_chain,
            req.question,
            _parse_history(req.chat_history)
        ):
            yield f"data: {token}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )


# ─── Connectors ───────────────────────────────────────────────────────

@app.get("/connectors", response_model=List[ConnectorStatusResponse])
async def get_connectors(workspace_id: Optional[str] = Query(None)):
    """List all connectors and their status."""
    connectors_list = [
        {"type": "slack", "name": "Slack"},
        {"type": "google_docs", "name": "Google Docs"},
        {"type": "notion", "name": "Notion"}
    ]
    
    if not workspace_id:
        return []

    connected_pairs = app.state.credential_store.list_all(workspace_id)
    connected_sources = {src_type for src_type, _ in connected_pairs}
    
    response = []
    for conn in connectors_list:
        doc_count = app.state.vectorstore.count_by_source(conn["type"], workspace_id) if conn["type"] in connected_sources else 0
        jobs = app.state.job_queue.get_jobs_by_source(conn["type"], workspace_id)
        latest_job = jobs[0] if jobs else None
        
        status = "idle"
        progress = None
        if conn["type"] in connected_sources:
            if latest_job and latest_job.get("stage") in ["fetching", "chunking", "embedding"]:
                status = "syncing"
                progress = latest_job.get("progress")
            else:
                status = "synced"
        
        response.append(ConnectorStatusResponse(
            type=conn["type"],
            name=conn["name"],
            connected=conn["type"] in connected_sources,
            status=status,
            doc_count=doc_count if doc_count > 0 else None,
            progress=progress,
            last_synced=latest_job.get("timestamp") if latest_job else None
        ))
    
    return response


# ─── Documents ────────────────────────────────────────────────────────

@app.get("/documents")
async def get_documents(
    q: Optional[str] = Query(None, description="Search query"),
    source: Optional[str] = Query(None, description="Filter by source type (slack, google_docs, notion)"),
    workspace_id: Optional[str] = Query(None, description="Workspace ID for multitenant filtering")
):
    """Get list of documents, optionally filtered by query, source, or workspace."""
    docs = app.state.vectorstore.get_documents(query=q, source_type=source, workspace_id=workspace_id)
    return docs


# ─── Sources Jobs ─────────────────────────────────────────────────────

@app.get("/sources/{source_type}/jobs")
async def get_source_jobs(source_type: str, workspace_id: Optional[str] = Query(None)):
    """Get ingestion jobs for a specific source type."""
    if not workspace_id:
        return []
    jobs = app.state.job_queue.get_jobs_by_source(source_type, workspace_id)
    return jobs


# ─── Helpers ─────────────────────────────────────────────────────────

def _parse_history(history: List[dict]) -> List:
    """Convert JSON chat history to LangChain message objects."""
    messages = []
    for msg in history:
        role = msg.get("role")
        content = msg.get("content", "")
        if role == "human":
            messages.append(HumanMessage(content=content))
        elif role == "ai":
            messages.append(AIMessage(content=content))
    return messages


# ─── Dev entrypoint ──────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)