from typing import Dict, Any, Optional, List, Tuple
import json
import redis
from cryptography.fernet import Fernet


class CredentialStore:
    def __init__(self, redis_url: str, encryption_key: str):
        self.redis = redis.from_url(
            redis_url,
            socket_timeout=5,
            socket_connect_timeout=5,
            health_check_interval=30,
            decode_responses=False,
        )
        self.cipher = Fernet(encryption_key.encode() if isinstance(encryption_key, str) else encryption_key)

    def _key(self, source_type: str, workspace_id: str) -> str:
        return f"credentials:{source_type}:{workspace_id}"

    def save(self, source_type: str, workspace_id: str, credentials: Dict[str, Any]):
        encrypted = self.cipher.encrypt(json.dumps(credentials).encode())
        self.redis.set(self._key(source_type, workspace_id), encrypted)

    def get(self, source_type: str, workspace_id: str) -> Optional[Dict[str, Any]]:
        data = self.redis.get(self._key(source_type, workspace_id))
        if not data:
            return None
        return json.loads(self.cipher.decrypt(data))

    def delete(self, source_type: str, workspace_id: str):
        self.redis.delete(self._key(source_type, workspace_id))

    def list_all(self) -> List[Tuple[str, str]]:
        """List all (source_type, workspace_id) pairs that have credentials stored."""
        keys = self.redis.keys(b"credentials:*")
        results = []
        for key_bytes in keys:
            key_str = key_bytes.decode()
            parts = key_str.split(":")
            if len(parts) == 3:
                results.append((parts[1], parts[2]))
        return results