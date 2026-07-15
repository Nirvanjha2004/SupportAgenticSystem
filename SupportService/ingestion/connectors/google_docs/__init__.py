from ingestion.connectors.google_docs.connector import GoogleDocsConnector
from ingestion.registry import register_connector

register_connector("google_docs", GoogleDocsConnector)

__all__ = ["GoogleDocsConnector"]