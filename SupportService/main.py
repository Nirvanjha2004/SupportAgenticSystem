import os
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage, AIMessage

from config import settings
from api.routes import connectors, webhooks
from vectorstore.store import VectorStore
from rag.chain import build_rag_chain, build_structured_rag_chain, stream_rag_answer
from rag.models import CitedAnswer


# ─── Lifespan: init shared resources ─────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.vectorstore = VectorStore()
    app.state.rag_chain = build_rag_chain(app.state.vectorstore, stream=False)
    app.state.rag_stream_chain = build_rag_chain(app.state.vectorstore, stream=True)
    app.state.structured_chain = build_structured_rag_chain(app.state.vectorstore)
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
            "chat_history": _parse_history(req.chat_history)
        })
        return QueryResponse(
            answer=result.answer,
            sources=[{"citations": result.citations, "confidence": result.confidence}]
        )

    answer = app.state.rag_chain.invoke({
        "question": req.question,
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