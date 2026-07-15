import os
from dotenv import load_dotenv

load_dotenv()

JINA_API_KEY = os.environ["JINA_API_KEY"]
GROQ_API_KEY = os.environ["GROQ_API_KEY"]
CHROMA_PERSIST_DIR = "./chroma_db"