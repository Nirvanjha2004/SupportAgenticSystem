import json
import uuid
from datetime import datetime
from typing import Optional, Dict, Any
import redis
from config import settings


class JobQueue:
    def __init__(self):
        # socket_timeout=None prevents BRPOP from crashing on Windows
        self.redis = redis.from_url(
            settings.REDIS_URL,
            socket_timeout=None,        # Allow blocking forever (BRPOP needs this)
            socket_connect_timeout=5,   # But fail fast if Redis is down
            health_check_interval=30,   # Keep idle connections alive
            decode_responses=False,     # We decode bytes ourselves
        )
        self.backfill_q = "queue:backfill"
        self.incremental_q = "queue:incremental"

    def enqueue_backfill(self, source_type: str, workspace_id: str, payload: Optional[Dict[str, Any]] = None) -> str:
        job_id = str(uuid.uuid4())
        job = {
            "id": job_id,
            "source_type": source_type,
            "workspace_id": workspace_id,
            "payload": payload or {},
            "created_at": datetime.utcnow().isoformat()
        }
        self.redis.lpush(self.backfill_q, json.dumps(job))
        return job_id

    def enqueue_incremental(self, source_type: str, workspace_id: str, payload: Dict[str, Any]) -> str:
        job_id = str(uuid.uuid4())
        job = {
            "id": job_id,
            "source_type": source_type,
            "workspace_id": workspace_id,
            "payload": payload,
            "created_at": datetime.utcnow().isoformat()
        }
        self.redis.lpush(self.incremental_q, json.dumps(job))
        return job_id

    def dequeue_backfill(self, timeout: int = 5) -> Optional[Dict[str, Any]]:
        # BRPOP returns (b'queue:backfill', b'job_json') or None on timeout
        result = self.redis.brpop(self.backfill_q, timeout=timeout)
        if result is None:
            return None
        # result is a tuple: (queue_name, job_bytes)
        _, job_bytes = result
        return json.loads(job_bytes)

    def dequeue_incremental(self, timeout: int = 5) -> Optional[Dict[str, Any]]:
        result = self.redis.brpop(self.incremental_q, timeout=timeout)
        if result is None:
            return None
        _, job_bytes = result
        return json.loads(job_bytes)