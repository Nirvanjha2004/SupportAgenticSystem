from langchain_core.prompts import ChatPromptTemplate

rag_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Answer the question using ONLY the provided context. "
               "If the context doesn't contain the answer, say you don't know.\n\nContext:\n{context}"),
    ("human", "{question}"),
])