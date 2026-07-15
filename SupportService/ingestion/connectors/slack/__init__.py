from ingestion.connectors.slack.connector import SlackConnector
from ingestion.registry import register_connector

register_connector("slack", SlackConnector)

__all__ = ["SlackConnector"]