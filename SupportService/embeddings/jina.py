import os
import requests
from typing import List
from langchain_core.embeddings import Embeddings
class JinaEmbeddings(Embeddings):
    """Minimal LangChain-compatible wrapper for Jina AI embeddings API."""

    def __init__(
        self,
        model: str = "jina-embeddings-v4",
        api_key: str | None = None,
        task: str = "retrieval.passage",
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
        data = sorted(data, key=lambda d: d.get("index", 0))
        return [d["embedding"] for d in data]

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self._embed(texts, task="retrieval.passage")

    def embed_query(self, text: str) -> List[float]:
        return self._embed([text], task="retrieval.query")[0]
