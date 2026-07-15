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
    JINA_API_KEY = os.environ["JINA_API_KEY"]
    GROQ_API_KEY = os.environ["GROQ_API_KEY"]
    CHROMA_PERSIST_DIR = "./chroma_db"

    class Config:
        env_file = ".env"

settings = Settings()