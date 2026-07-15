from typing import List, Optional, Tuple
from langchain_chroma import Chroma
from langchain_core.documents import Document
from config import CHROMA_PERSIST_DIR
from embeddings.jina import JinaEmbeddings
from ingestion.models import RawDocument


class VectorStore:
    def __init__(self, collection_name: str = "support_documents"):
        self.embeddings = JinaEmbeddings(model="jina-embeddings-v4")
        self.store = Chroma(
            collection_name=collection_name,
            embedding_function=self.embeddings,
            persist_directory=CHROMA_PERSIST_DIR,
        )

    def _sanitize_metadata(self, metadata: dict) -> dict:
        """Chroma only accepts scalar values."""
        clean = {}
        for k, v in metadata.items():
            if v is None:
                continue
            if isinstance(v, (str, int, float, bool)):
                clean[k] = v
            elif isinstance(v, list):
                clean[k] = ", ".join(str(x) for x in v)
            elif isinstance(v, dict):
                for sub_k, sub_v in v.items():
                    if isinstance(sub_v, (str, int, float, bool)):
                        clean[f"{k}.{sub_k}"] = sub_v
                    elif sub_v is not None:
                        clean[f"{k}.{sub_k}"] = str(sub_v)
            else:
                clean[k] = str(v)
        return clean

    def _to_lc_document(self, doc: RawDocument) -> Document:
        meta = {
            "raw_id": doc.id,
            "source_type": str(doc.source_type),
            "workspace_id": doc.workspace_id,
            "title": doc.title or "",
            "chunk_index": doc.chunk_index if doc.chunk_index is not None else -1,
            "created_at": doc.created_at.isoformat() if doc.created_at else "",
            "updated_at": doc.updated_at.isoformat() if doc.updated_at else "",
        }
        meta.update(self._sanitize_metadata(doc.metadata))
        return Document(page_content=doc.content, metadata=meta)

    def upsert(self, documents: List[RawDocument]) -> int:
        if not documents:
            return 0
        docs = [self._to_lc_document(d) for d in documents]
        ids = [d.id for d in documents]
        self.store._collection.upsert(
            ids=ids,
            documents=[d.page_content for d in docs],
            metadatas=[d.metadata for d in docs],
        )
        return len(documents)

    def search(self, query: str, k: int = 5, filter_dict: Optional[dict] = None) -> List[Document]:
        final_filter = filter_dict or {}
        return self.store.similarity_search(query, k=k, filter=final_filter if final_filter else None)

    def search_with_relevance(
        self, 
        query: str, 
        k: int = 5, 
        threshold: float = 0.3,
        filter_dict: Optional[dict] = None
    ) -> List[Document]:
        """
        Returns docs with cosine distance <= threshold.
        Chroma uses cosine distance (0 = identical, 2 = opposite), so threshold
        of 0.3 ≈ 0.85 cosine similarity.
        """
        results: List[Tuple[Document, float]] = self.store.similarity_search_with_score(
            query, k=k, filter=filter_dict or None
        )
        return [doc for doc, score in results if score <= threshold]

    def delete_by_workspace(self, workspace_id: str) -> None:
        self.store._collection.delete(where={"workspace_id": workspace_id})

    def delete_by_source(self, source_type: str, workspace_id: str) -> None:
        self.store._collection.delete(
            where={"source_type": source_type, "workspace_id": workspace_id}
        )