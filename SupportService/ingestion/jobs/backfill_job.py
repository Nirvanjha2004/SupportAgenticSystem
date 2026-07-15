from ingestion.registry import get_connector
from ingestion.chunking import chunk_documents
from vectorstore.store import get_vector_store

def run_backfill(source_type: str, workspace_id: str, credentials: dict):
    connector = get_connector(source_type)
    raw_docs = connector.backfill(credentials, workspace_id)
    chunks = chunk_documents(raw_docs)

    store = get_vector_store()
    store.add_texts(
        texts=[c.content for c in chunks],
        metadatas=[c.metadata for c in chunks],
    )