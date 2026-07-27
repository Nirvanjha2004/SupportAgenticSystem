from typing import List, Optional, Tuple, Dict, Any
from langchain_chroma import Chroma
from langchain_core.documents import Document
from config import settings
from embeddings.jina import JinaEmbeddings
from ingestion.models import RawDocument


class VectorStore:
    def __init__(self, collection_name: str = "support_documents"):
        self.embeddings = JinaEmbeddings(model="jina-embeddings-v4")
        self.store = Chroma(
            collection_name=collection_name,
            embedding_function=self.embeddings,
            persist_directory=settings.CHROMA_PERSIST_DIR,
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

    def _format_chroma_filter(self, filter_dict: Optional[dict]) -> Optional[dict]:
        """Format filter dict for Chroma; use $and operator if multiple fields exist."""
        if not filter_dict:
            return None
        if len(filter_dict) == 1:
            return filter_dict
        return {"$and": [{k: v} for k, v in filter_dict.items()]}

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
        final_filter = self._format_chroma_filter(filter_dict)
        return self.store.similarity_search(query, k=k, filter=final_filter)

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
        final_filter = self._format_chroma_filter(filter_dict)
        results: List[Tuple[Document, float]] = self.store.similarity_search_with_score(
            query, k=k, filter=final_filter
        )
        return [doc for doc, score in results if score <= threshold]

    def get_documents(
        self,
        query: Optional[str] = None,
        source_type: Optional[str] = None,
        workspace_id: Optional[str] = None,
        k: int = 100
    ) -> List[Dict[str, Any]]:
        """Get documents, optionally filtered by query, source type, and workspace_id."""
        filter_dict: Dict[str, Any] = {}
        if source_type:
            filter_dict["source_type"] = source_type
        if workspace_id:
            filter_dict["workspace_id"] = workspace_id
        
        if query:
            docs = self.search(query, k=k, filter_dict=filter_dict if filter_dict else None)
        else:
            # Get all docs (or up to k)
            chroma_filter = self._format_chroma_filter(filter_dict)
            result = self.store._collection.get(
                limit=k,
                where=chroma_filter
            )
            docs = [
                Document(page_content=doc, metadata=meta)
                for doc, meta in zip(result["documents"] or [], result["metadatas"] or [])
            ]
        
        # Group by raw_id to avoid duplicate chunks in the list
        unique_docs: Dict[str, Dict[str, Any]] = {}
        for doc in docs:
            raw_id = doc.metadata.get("raw_id", doc.id)
            if raw_id not in unique_docs:
                unique_docs[raw_id] = {
                    "title": doc.metadata.get("title", "Untitled"),
                    "snippet": doc.page_content[:150] + "..." if len(doc.page_content) > 150 else doc.page_content,
                    "source": doc.metadata.get("source_type", "unknown"),
                    "date": doc.metadata.get("updated_at", doc.metadata.get("created_at", "Unknown"))
                }
        
        return list(unique_docs.values())

    def count_by_source(self, source_type: str, workspace_id: Optional[str] = None) -> int:
        """Count number of documents (chunks) for a source type, optionally scoped by workspace_id."""
        where_filter: Dict[str, Any] = {"source_type": source_type}
        if workspace_id:
            where_filter["workspace_id"] = workspace_id
        chroma_filter = self._format_chroma_filter(where_filter)
        result = self.store._collection.get(where=chroma_filter)
        return len(result["ids"] or [])

    def delete_by_workspace(self, workspace_id: str) -> None:
        self.store._collection.delete(where={"workspace_id": workspace_id})

    def delete_by_source(self, source_type: str, workspace_id: str) -> None:
        chroma_filter = self._format_chroma_filter({"source_type": source_type, "workspace_id": workspace_id})
        self.store._collection.delete(
            where=chroma_filter
        )