from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# 1. Converts "what about the second one?" → standalone question
CONDENSE_QUESTION_PROMPT = ChatPromptTemplate.from_messages([
    ("system", 
     "Given the conversation history and a follow-up question, rephrase it to be a "
     "standalone question that includes all necessary context. Do NOT answer the question."),
    MessagesPlaceholder("chat_history"),
    ("human", "Follow-up question: {question}\nStandalone question:"),
])

# 2. Main RAG prompt with strict citation rules
RAG_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a precise internal support assistant. Answer the user's question using ONLY the provided context.

RULES:
1. Base your answer strictly on the context below. Do not use outside knowledge.
2. Cite sources using [index] format (e.g., "Restart the service [1]").
3. If multiple sources conflict, mention the conflict and which sources disagree.
4. If the context doesn't contain enough information, say "I don't have enough information to answer that" and suggest what information might help.
5. Keep answers concise but complete. Use bullet points for steps or lists.
6. Prioritize more recent sources when information conflicts.

CONTEXT:
{context}"""),
    MessagesPlaceholder("chat_history"),
    ("human", "{question}"),
])

# 3. Fallback when no relevant docs are retrieved
FALLBACK_PROMPT = ChatPromptTemplate.from_messages([
    ("system", 
     "You are a helpful support assistant. No relevant documents were found in the knowledge base for this question. "
     "Politely explain that you don't have the answer and suggest where they might look or what details to provide."),
    MessagesPlaceholder("chat_history"),
    ("human", "{question}"),
])