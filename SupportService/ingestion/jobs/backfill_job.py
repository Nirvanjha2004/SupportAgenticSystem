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
from ingestion.storage.credentials import CredentialStore
from ingestion.chunking import thread_aware_chunk
from vectorstore.store import VectorStore
from config import settings

# ... rest of the file stays exactly the same

# ─── Logging setup ─────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("backfill_worker")

# ─── Shared resources ────────────────────────────────────────────────
queue = JobQueue()
store = CredentialStore(settings.REDIS_URL, settings.ENCRYPTION_KEY)
vectorstore = VectorStore()


def run_backfill_job(job: dict) -> int:
    job_id = job.get("id", "unknown")
    source_type = job["source_type"]
    workspace_id = job["workspace_id"]

    logger.info("[job=%s] Starting backfill | source=%s | workspace=%s", job_id, source_type, workspace_id)

    try:
        connector_cls = get_connector(source_type)
    except Exception as e:
        logger.error("[job=%s] Connector not found for '%s': %s", job_id, source_type, e)
        raise

    connector = connector_cls()
    credentials = store.get(source_type, workspace_id)

    if not credentials:
        logger.error("[job=%s] No credentials found for %s/%s", job_id, source_type, workspace_id)
        raise Exception(f"No credentials for {source_type}/{workspace_id}")

    logger.info("[job=%s] Retrieved credentials | bot_user=%s", job_id, credentials.get("bot_user_id", "n/a"))

    # Fetch raw documents
    logger.info("[job=%s] Fetching documents from %s...", job_id, source_type)
    documents = connector.backfill(credentials, workspace_id)
    logger.info("[job=%s] Fetched %d raw documents", job_id, len(documents))

    # Chunk
    logger.info("[job=%s] Chunking documents...", job_id)
    chunks = []
    for doc in documents:
        try:
            chunks.extend(thread_aware_chunk(doc))
        except Exception as e:
            logger.warning("[job=%s] Failed to chunk doc %s: %s", job_id, doc.id, e)

    logger.info("[job=%s] Produced %d chunks", job_id, len(chunks))

    # Upsert to Chroma
    if chunks:
        logger.info("[job=%s] Upserting %d chunks into vector store...", job_id, len(chunks))
        vectorstore.upsert(chunks)
        logger.info("[job=%s] Upsert complete", job_id)
    else:
        logger.warning("[job=%s] No chunks to upsert", job_id)

    return len(chunks)


async def worker_loop():
    logger.info("Backfill worker started | waiting for jobs...")
    while True:
        try:
            job = queue.dequeue_backfill(timeout=5)
        except Exception as e:
            logger.error("Redis dequeue error: %s", e)
            await asyncio.sleep(5)
            continue

        if job is None:
            # BRPOP timed out — normal, just loop
            continue

        job_id = job.get("id", "unknown")
        logger.info("[job=%s] Dequeued backfill job", job_id)

        try:
            count = await asyncio.to_thread(run_backfill_job, job)
            logger.info("[job=%s] Completed | %d chunks indexed", job_id, count)
        except Exception as e:
            logger.error("[job=%s] FAILED: %s", job_id, e)
            logger.debug("[job=%s] Traceback:\n%s", job_id, traceback.format_exc())

        await asyncio.sleep(0.1)


if __name__ == "__main__":
    try:
        asyncio.run(worker_loop())
    except KeyboardInterrupt:
        logger.info("Backfill worker shutting down (KeyboardInterrupt)")