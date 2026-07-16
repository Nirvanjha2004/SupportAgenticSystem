import json
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
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
        self.job_status_prefix = "job_status:"

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
        # Set initial job status
        self._set_job_status(job_id, {
            "id": job_id,
            "source_type": source_type,
            "stage": "fetching",
            "progress": 0.0,
            "message": "Queued for backfill",
            "timestamp": datetime.utcnow().isoformat()
        })
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
        # Set initial job status
        self._set_job_status(job_id, {
            "id": job_id,
            "source_type": source_type,
            "stage": "fetching",
            "progress": 0.0,
            "message": "Queued for incremental ingest",
            "timestamp": datetime.utcnow().isoformat()
        })
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
    
    def _set_job_status(self, job_id: str, status: Dict[str, Any]):
        key = f"{self.job_status_prefix}{job_id}".encode()
        self.redis.setex(key, 3600, json.dumps(status))  # Expire after 1 hour
    
    def update_job_status(self, job_id: str, stage: str, progress: float, message: str):
        self._set_job_status(job_id, {
            "id": job_id,
            "source_type": self._get_job_source_type(job_id) or "unknown",
            "stage": stage,
            "progress": progress,
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    def _get_job_source_type(self, job_id: str) -> Optional[str]:
        key = f"{self.job_status_prefix}{job_id}".encode()
        data = self.redis.get(key)
        if data:
            return json.loads(data).get("source_type")
        return None
    
    def get_jobs_by_source(self, source_type: str) -> List[Dict[str, Any]]:
        keys = self.redis.keys(f"{self.job_status_prefix}*".encode())
        jobs = []
        for key_bytes in keys:
            data = self.redis.get(key_bytes)
            if data:
                job = json.loads(data)
                if job.get("source_type") == source_type:
                    jobs.append(job)
        # Sort by timestamp descending
        jobs.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        return jobs