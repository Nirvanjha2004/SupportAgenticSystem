import asyncio
from ingestion.jobs.queue import JobQueue
from ingestion.registry import get_connector
from ingestion.storage.credentials import CredentialStore
from ingestion.chunking import thread_aware_chunk
from vectorstore.store import VectorStore
from config import settings

queue = JobQueue()
store = CredentialStore(settings.REDIS_URL, settings.ENCRYPTION_KEY)
vectorstore = VectorStore()

def run_backfill_job(job: dict):
    source_type = job["source_type"]
    workspace_id = job["workspace_id"]

    connector = get_connector(source_type)()
    credentials = store.get(source_type, workspace_id)
    if not credentials:
        raise Exception(f"No credentials for {source_type}/{workspace_id}")

    documents = connector.backfill(credentials, workspace_id)
    chunks = []
    for doc in documents:
        chunks.extend(thread_aware_chunk(doc))

    if chunks:
        vectorstore.upsert(chunks)

    return len(chunks)

async def worker_loop():
    while True:
        job = queue.dequeue_backfill(timeout=5)
        if job:
            try:
                count = await asyncio.to_thread(run_backfill_job, job)
                print(f"Backfill {job['id']}: {count} chunks indexed")
            except Exception as e:
                print(f"Backfill {job['id']} failed: {e}")
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(worker_loop())