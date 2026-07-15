import os
import requests
from typing import List
from langchain_core.embeddings import Embeddings


class JinaEmbeddings(Embeddings):
    def __init__(self, model: str = "jina-embeddings-v4", api_key: str = None):
        self.model = model
        self.api_key = api_key or os.getenv("JINA_API_KEY")
        if not self.api_key:
            raise ValueError("JINA_API_KEY environment variable is not set")
        self.url = "https://api.jina.ai/v1/embeddings"

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self._embed(texts)

    def embed_query(self, text: str) -> List[float]:
        return self._embed([text])[0]

    def _embed(self, texts: List[str]) -> List[List[float]]:
        all_embeddings = []
        batch_size = 128  # Jina API safe limit

        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            resp = requests.post(
                self.url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={"model": self.model, "input": batch},
            )
            resp.raise_for_status()
            data = resp.json()["data"]
            # Ensure order is preserved (sort by index returned from API)
            sorted_data = sorted(data, key=lambda x: x["index"])
            all_embeddings.extend([d["embedding"] for d in sorted_data])

        return all_embeddings