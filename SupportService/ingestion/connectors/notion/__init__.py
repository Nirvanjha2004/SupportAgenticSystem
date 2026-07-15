from ingestion.connectors.notion.connector import NotionConnector
from ingestion.registry import register_connector

register_connector("notion", NotionConnector)

__all__ = ["NotionConnector"]