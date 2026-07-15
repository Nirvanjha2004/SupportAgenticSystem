from typing import Dict, Type
from ingestion.base import BaseConnector

_REGISTRY: Dict[str, Type[BaseConnector]] = {}

def register_connector(source_type: str, connector_class: Type[BaseConnector]):
    _REGISTRY[source_type] = connector_class

def get_connector(source_type: str) -> Type[BaseConnector]:
    if source_type not in _REGISTRY:
        raise ValueError(f"No connector registered for: {source_type}")
    return _REGISTRY[source_type]

def list_connectors() -> Dict[str, Type[BaseConnector]]:
    return _REGISTRY.copy()