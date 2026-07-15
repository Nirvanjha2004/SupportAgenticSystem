import asyncio
import logging
import sys
import traceback

# CRITICAL: Import connectors to trigger self-registration before anything else
import ingestion.connectors.slack      # noqa: F401
import ingestion.connectors.google_docs  # noqa: F401
import ingestion.connectors.notion       # noqa: F401

from ingestion.jobs.queue import JobQueue
from ingestion.registry import get_connector
from ingestion.chunking import thread_aware_chunk
from vectorstore.store import VectorStore
from config import settings

# ─── Logging setup ─────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("incremental_worker")

# ─── Shared resources ────────────────────────────────────────────────
queue = JobQueue()
vectorstore = VectorStore()


def run_incremental_job(job: dict) -> int:
    job_id = job.get("id", "unknown")
    source_type = job["source_type"]
    workspace_id = job["workspace_id"]
    payload = job.get("payload", {})

    logger.info("[job=%s] Starting incremental ingest | source=%s | workspace=%s | event_type=%s",
                job_id, source_type, workspace_id, payload.get("type", "unknown"))

    try:
        connector_cls = get_connector(source_type)
    except Exception as e:
        logger.error("[job=%s] Connector not found for '%s': %s", job_id, source_type, e)
        raise

    connector = connector_cls()

    # Parse event into RawDocument
    logger.debug("[job=%s] Parsing event payload...", job_id)
    document = connector.ingest_event(payload)

    if document is None:
        logger.info("[job=%s] Event skipped (no document produced by parser)", job_id)
        return 0

    logger.info("[job=%s] Parsed document | id=%s | title=%s", job_id, document.id, document.title or "n/a")

    # Chunk
    logger.info("[job=%s] Chunking document...", job_id)
    try:
        chunks = thread_aware_chunk(document)
    except Exception as e:
        logger.error("[job=%s] Chunking failed for doc %s: %s", job_id, document.id, e)
        raise

    logger.info("[job=%s] Produced %d chunks", job_id, len(chunks))

    # Upsert
    if chunks:
        logger.info("[job=%s] Upserting %d chunks into vector store...", job_id, len(chunks))
        vectorstore.upsert(chunks)
        logger.info("[job=%s] Upsert complete", job_id)
    else:
        logger.warning("[job=%s] No chunks to upsert", job_id)

    return len(chunks)


async def worker_loop():
    logger.info("Incremental worker started | waiting for events...")
    while True:
        try:
            job = queue.dequeue_incremental(timeout=5)
        except Exception as e:
            logger.error("Redis dequeue error: %s", e)
            await asyncio.sleep(5)
            continue

        if job is None:
            # BRPOP timed out — normal
            continue

        job_id = job.get("id", "unknown")
        logger.info("[job=%s] Dequeued incremental job", job_id)

        try:
            count = await asyncio.to_thread(run_incremental_job, job)
            logger.info("[job=%s] Completed | %d chunks indexed", job_id, count)
        except Exception as e:
            logger.error("[job=%s] FAILED: %s", job_id, e)
            logger.debug("[job=%s] Traceback:\n%s", job_id, traceback.format_exc())

        await asyncio.sleep(0.1)


if __name__ == "__main__":
    try:
        asyncio.run(worker_loop())
    except KeyboardInterrupt:
        logger.info("Incremental worker shutting down (KeyboardInterrupt)")