from ingestion.connectors.slack.connector import SlackConnector
from ingestion.connectors.google_docs.connector import GoogleDocsConnector
from ingestion.connectors.notion.connector import NotionConnector

CONNECTOR_REGISTRY = {
    "slack": SlackConnector,
    "google_docs": GoogleDocsConnector,
    "notion": NotionConnector,
}

def get_connector(source_type: str):
    return CONNECTOR_REGISTRY[source_type]()