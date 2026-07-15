from typing import List
from ingestion.models import RawDocument

def recursive_chunk(
    document: RawDocument,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
    separators: List[str] = None
) -> List[RawDocument]:
    if separators is None:
        separators = ["\n\n", "\n", ". ", " ", ""]

    text = document.content
    chunks = []

    def _split(t: str, sep: str) -> List[str]:
        return list(t) if sep == "" else t.split(sep)

    def _merge(splits: List[str], sep: str, limit: int) -> List[str]:
        docs, current, total = [], [], 0
        for d in splits:
            length = len(d)
            overhead = len(sep) if sep else 0
            if total + length + overhead > limit and current:
                docs.append(sep.join(current))
                while current and total > chunk_overlap:
                    total -= len(current[0]) + overhead
                    current.pop(0)
                current, total = [], 0
            current.append(d)
            total += length + overhead
        if current:
            docs.append(sep.join(current))
        return docs

    final = [text]
    for sep in separators:
        new_final = []
        for chunk in final:
            if len(chunk) > chunk_size:
                new_final.extend(_merge(_split(chunk, sep), sep, chunk_size))
            else:
                new_final.append(chunk)
        final = new_final

    result = []
    for i, text in enumerate(final):
        if not text.strip():
            continue
        result.append(RawDocument(
            id=f"{document.id}-chunk-{i}",
            source_type=document.source_type,
            workspace_id=document.workspace_id,
            title=document.title,
            content=text,
            metadata={**document.metadata, "parent_id": document.id, "chunk_index": i},
            created_at=document.created_at,
            updated_at=document.updated_at,
            chunk_index=i
        ))
    return result

def thread_aware_chunk(doc: RawDocument, **kwargs) -> List[RawDocument]:
    """Slack-specific: respect thread boundaries before generic splitting."""
    slack_seps = ["\n---\n", "\n\n", "\n", ". ", " ", ""]
    return recursive_chunk(doc, separators=slack_seps, **kwargs)