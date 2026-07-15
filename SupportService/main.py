import os
import requests
from typing import List
from langchain_core.embeddings import Embeddings
from langchain_chroma import Chroma
from langchain_groq import ChatGroq

class JinaEmbeddings(Embeddings):
    """Minimal LangChain-compatible wrapper for Jina AI embeddings API."""

    def __init__(
        self,
        model: str = "jina-embeddings-v4",
        api_key: str | None = None,
        task: str = "retrieval.passage",  # use "retrieval.query" for queries
    ):
        self.model = model
        self.api_key = 'jina_8ad270a2482c499ba6484c0ce28d37d2xbEYWQIIXXYyp2bh3uxKC1i81-pG'
        self.task = task
        self.url = "https://api.jina.ai/v1/embeddings"

    def _embed(self, texts: List[str], task: str) -> List[List[float]]:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }
        payload = {
            "model": self.model,
            "task": task,
            "input": [{"text": t} for t in texts],
        }
        response = requests.post(self.url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()["data"]
        # API may not preserve order, so sort by index if present
        data = sorted(data, key=lambda d: d.get("index", 0))
        return [d["embedding"] for d in data]

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self._embed(texts, task="retrieval.passage")

    def embed_query(self, text: str) -> List[float]:
        return self._embed([text], task="retrieval.query")[0]


# --- Usage ---

texts = [
    "LangChain is an open-source framework for building applications powered by large language models.",
    "Chroma is a vector database that stores embeddings and performs similarity search for retrieval augmented generation systems.",
    "Jina AI provides state-of-the-art embedding models such as jina-embeddings-v4 for semantic search and retrieval.",
    "Python is a high-level programming language widely used for web development, artificial intelligence, and data science.",
    "Redis is an in-memory data structure store commonly used for caching, message queues, and session management.",
    "Docker packages applications and their dependencies into lightweight containers that can run consistently across environments.",
    "Kubernetes automates deployment, scaling, and management of containerized applications across clusters of machines.",
    "MongoDB is a NoSQL document database that stores data in flexible JSON-like BSON documents.",
    "PostgreSQL is an open-source relational database known for its reliability, extensibility, and SQL compliance.",
    "Retrieval-Augmented Generation combines vector search with language models to answer questions using external knowledge.",
]

groqChat = ChatGroq(
    
)

embeddings = JinaEmbeddings(model="jina-embeddings-v4")

vector_store = Chroma(
    collection_name="test",
    embedding_function=embeddings,
    persist_directory="./chroma_db"
)

vector_store.add_texts(texts)
retriever = vector_store.as_retriever()


def get_results():
    ans = retriever.invoke("What is Langchain ?")
    print(ans)


get_results()