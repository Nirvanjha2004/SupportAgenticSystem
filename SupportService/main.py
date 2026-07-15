import os
import requests
from typing import List
from langchain_core.embeddings import Embeddings
from langchain_chroma import Chroma
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough


class JinaEmbeddings(Embeddings):
    """Minimal LangChain-compatible wrapper for Jina AI embeddings API."""

    def __init__(
        self,
        model: str = "jina-embeddings-v4",
        api_key: str | None = None,
        task: str = "retrieval.passage",
    ):
        self.model = model
        self.api_key = api_key or os.environ["JINA_API_KEY"]
        self.task = task
        self.url = "https://api.jina.ai/v1/embeddings"

    def _embed(self, texts: List[str], task: str) -> List[List[float]]:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }
        payload = {
            "model": self.model,
            "task": task,
            "input": [{"text": t} for t in texts],
        }
        response = requests.post(self.url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()["data"]
        data = sorted(data, key=lambda d: d.get("index", 0))
        return [d["embedding"] for d in data]

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self._embed(texts, task="retrieval.passage")

    def embed_query(self, text: str) -> List[float]:
        return self._embed([text], task="retrieval.query")[0]


# --- Data ---

texts = [
    "LangChain is an open-source framework for building applications powered by large language models.",
    "Chroma is a vector database that stores embeddings and performs similarity search for retrieval augmented generation systems.",
    "Jina AI provides state-of-the-art embedding models such as jina-embeddings-v4 for semantic search and retrieval.",
    "Python is a high-level programming language widely used for web development, artificial intelligence, and data science.",
    "Redis is an in-memory data structure store commonly used for caching, message queues, and session management.",
    "Docker packages applications and their dependencies into lightweight containers that can run consistently across environments.",
    "Kubernetes automates deployment, scaling, and management of containerized applications across clusters of machines.",
    "MongoDB is a NoSQL document database that stores data in flexible JSON-like BSON documents.",
    "PostgreSQL is an open-source relational database known for its reliability, extensibility, and SQL compliance.",
    "Retrieval-Augmented Generation combines vector search with language models to answer questions using external knowledge.",
]

# --- Setup ---

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.environ["GROQ_API_KEY"],
    temperature=0,
)

embeddings = JinaEmbeddings(model="jina-embeddings-v4")

vector_store = Chroma(
    collection_name="test",
    embedding_function=embeddings,
    persist_directory="./chroma_db",
)

# Avoid re-adding texts every run once persisted
if vector_store._collection.count() == 0:
    vector_store.add_texts(texts)

retriever = vector_store.as_retriever(search_kwargs={"k": 3})

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Answer the question using ONLY the provided context. "
               "If the context doesn't contain the answer, say you don't know — don't make things up.\n\n"
               "Context:\n{context}"),
    ("human", "{question}"),
])


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


# --- RAG chain ---

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)


def get_results(query: str):
    answer = rag_chain.invoke(query)
    print(answer)
    return answer


if __name__ == "__main__":
    get_results("What is Langchain ?")