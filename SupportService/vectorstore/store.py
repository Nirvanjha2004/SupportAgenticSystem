from langchain_chroma import Chroma
from config import CHROMA_PERSIST_DIR
from embeddings.jina import JinaEmbeddings

def get_vector_store():
    embeddings = JinaEmbeddings(model="jina-embeddings-v4")
    store = Chroma(
        collection_name="test",
        embedding_function=embeddings,
        persist_directory=CHROMA_PERSIST_DIR,
    )
    return store

def seed_if_empty(store, texts):
    if store._collection.count() == 0:
        store.add_texts(texts)