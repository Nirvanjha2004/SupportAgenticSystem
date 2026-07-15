from typing import List, Optional, Dict, Any, AsyncIterator
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import (
    RunnablePassthrough, 
    RunnableBranch, 
    RunnableLambda,
    RunnableConfig
)
from langchain_core.documents import Document
from langchain_core.messages import BaseMessage
from config import GROQ_API_KEY
from rag.prompts import RAG_PROMPT, CONDENSE_QUESTION_PROMPT, FALLBACK_PROMPT
from rag.models import CitedAnswer
from vectorstore.store import VectorStore


# ─── Helpers ──────────────────────────────────────────────────────────

def _format_docs_with_sources(docs: List[Document]) -> str:
    """Rich context formatting with metadata for citations."""
    if not docs:
        return "No relevant documents found."
    
    formatted = []
    for i, doc in enumerate(docs, 1):
        meta = doc.metadata
        source_type = meta.get("source_type", "unknown")
        title = meta.get("title", "Untitled") or "Untitled"
        url = meta.get("url", "") or meta.get("permalink", "")
        channel = meta.get("channel_name", "")
        user = meta.get("user_name", "")
        updated = meta.get("updated_at", "")
        
        header_parts = [f"[{i}] {title}"]
        if source_type == "slack" and channel:
            header_parts.append(f"Slack #{channel}")
        elif source_type == "notion":
            header_parts.append("Notion")
        elif source_type == "google_docs":
            header_parts.append("Google Doc")
        if user:
            header_parts.append(f"by {user}")
        if updated:
            header_parts.append(f"({updated})")
        
        header = " | ".join(header_parts)
        if url:
            header += f"\nURL: {url}"
        
        formatted.append(f"{header}\n{doc.page_content}")
    
    return "\n\n---\n\n".join(formatted)


def _has_relevant_docs(inputs: Dict[str, Any]) -> bool:
    docs = inputs.get("docs", [])
    return len(docs) > 0


# ─── Sub-chains ───────────────────────────────────────────────────────

def build_condense_chain():
    """Turns follow-up questions into standalone queries using history."""
    llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=GROQ_API_KEY, temperature=0)
    return CONDENSE_QUESTION_PROMPT | llm | StrOutputParser()


# ─── Main RAG Chain ───────────────────────────────────────────────────

def build_rag_chain(
    vectorstore: VectorStore,
    stream: bool = False
):
    """
    Returns a runnable that accepts:
        { "question": str, "chat_history": List[BaseMessage] (optional) }
    
    Returns:
        - str answer (with citations like [1], [2]) if stream=False
        - AsyncIterator[str] if stream=True
    """
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=GROQ_API_KEY,
        temperature=0,
        streaming=stream
    )
    
    condense_chain = build_condense_chain()
    
    def _retrieve(inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Fetch docs from Chroma and format context."""
        question = inputs.get("standalone_question") or inputs["question"]
        # Use score-based search to filter out junk
        docs = vectorstore.search_with_relevance(query=question, k=5, threshold=0.3)
        context = _format_docs_with_sources(docs)
        return {
            **inputs,
            "docs": docs,
            "context": context,
            "question": question  # ensure we use the standalone version
        }
    
    # Branch: RAG if docs exist, fallback if empty
    rag_branch = RAG_PROMPT | llm | StrOutputParser()
    fallback_branch = FALLBACK_PROMPT | llm | StrOutputParser()
    
    chain = (
        # Step 1: Condense question if chat_history exists
        RunnablePassthrough.assign(
            standalone_question=lambda x: condense_chain.invoke({
                "chat_history": x.get("chat_history", []),
                "question": x["question"]
            }) if x.get("chat_history") else x["question"]
        )
        # Step 2: Retrieve & format
        | RunnableLambda(_retrieve)
        # Step 3: Route to RAG or fallback
        | RunnableBranch(
            (_has_relevant_docs, rag_branch),
            fallback_branch
        )
    )
    
    return chain


# ─── Structured Output Chain (with citations) ─────────────────────────

def build_structured_rag_chain(vectorstore: VectorStore):
    """
    Returns a CitedAnswer object with .answer, .citations[], .confidence, etc.
    Slightly slower but guarantees parsable citations.
    """
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=GROQ_API_KEY,
        temperature=0
    ).with_structured_output(CitedAnswer)
    
    def _retrieve(inputs: Dict[str, Any]) -> Dict[str, Any]:
        docs = vectorstore.search_with_relevance(query=inputs["question"], k=5, threshold=0.3)
        return {
            "context": _format_docs_with_sources(docs),
            "question": inputs["question"],
            "chat_history": inputs.get("chat_history", [])
        }
    
    return (
        RunnablePassthrough()
        | RunnableLambda(_retrieve)
        | RAG_PROMPT
        | llm
    )


# ─── Streaming helper ─────────────────────────────────────────────────

async def stream_rag_answer(
    chain,
    question: str,
    chat_history: Optional[List[BaseMessage]] = None
) -> AsyncIterator[str]:
    """Convenience wrapper for streaming tokens."""
    async for chunk in chain.astream({
        "question": question,
        "chat_history": chat_history or []
    }):
        yield chunk