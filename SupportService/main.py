from vectorstore.store import get_vector_store, seed_if_empty
from rag.chain import build_rag_chain
from data.seed_texts import texts

vector_store = get_vector_store()
seed_if_empty(vector_store, texts)

retriever = vector_store.as_retriever(search_kwargs={"k": 3})
rag_chain = build_rag_chain(retriever)


def get_results(query: str):
    answer = rag_chain.invoke(query)
    print(answer)
    return answer


if __name__ == "__main__":
    get_results("What is Langchain ?")