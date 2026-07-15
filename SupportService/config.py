import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    REDIS_URL: str = "redis://localhost:6379/0"
    ENCRYPTION_KEY: str  # 32-byte base64-encoded Fernet key
    SLACK_CLIENT_ID: str
    SLACK_CLIENT_SECRET: str
    SLACK_REDIRECT_URI: str = "http://localhost:8000/connectors/slack/callback"
    SLACK_SIGNING_SECRET: str = ""  # From Slack app "Basic Info"
    JINA_API_KEY : str
    GROQ_API_KEY : str
    CHROMA_PERSIST_DIR : str
    
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/connectors/google_docs/callback"

    # Notion
    NOTION_CLIENT_ID: str
    NOTION_CLIENT_SECRET: str
    NOTION_REDIRECT_URI: str = "http://localhost:8000/connectors/notion/callback"


    class Config:
        env_file = ".env"

settings = Settings()