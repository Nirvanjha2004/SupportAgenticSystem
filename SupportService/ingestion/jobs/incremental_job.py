import asyncio
from ingestion.jobs.queue import JobQueue
from ingestion.registry import get_connector
from ingestion.chunking import thread_aware_chunk
from vectorstore.store import VectorStore
from config import settings

queue = JobQueue()
vectorstore = VectorStore()

def run_incremental_job(job: dict):
    source_type = job["source_type"]
    payload = job["payload"]

    connector = get_connector(source_type)()
    document = connector.ingest_event(payload)

    if not document:
        return 0

    chunks = thread_aware_chunk(document)
    if chunks:
        vectorstore.upsert(chunks)

    return len(chunks)

async def worker_loop():
    while True:
        job = queue.dequeue_incremental(timeout=5)
        if job:
            try:
                count = await asyncio.to_thread(run_incremental_job, job)
                print(f"Incremental {job['id']}: {count} chunks indexed")
            except Exception as e:
                print(f"Incremental {job['id']} failed: {e}")
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(worker_loop())