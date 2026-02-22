from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

from backend.agent.prompts import ROUTINE_FORMAT_INSTRUCTIONS, SYSTEM_PROMPT
from backend.core.config import get_settings
from backend.rag.vectorstore import get_retriever


def _format_docs(docs: list) -> str:
    """Format retrieved documents into a single context string."""
    parts = []
    for i, doc in enumerate(docs, 1):
        source = doc.metadata.get("source_file", "unknown")
        page = doc.metadata.get("page", "")
        page_str = f", p.{page}" if page != "" else ""
        parts.append(f"[Source {i} — {source}{page_str}]\n{doc.page_content}")
    return "\n\n---\n\n".join(parts)


def build_rag_chain():
    """Build and return the LCEL RAG chain for routine generation."""
    settings = get_settings()

    llm = ChatOpenAI(
        model=settings.model_name,
        temperature=0.3,
        streaming=True,
        api_key=settings.openai_api_key,
        max_tokens=4096,
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT + "\n\n" + ROUTINE_FORMAT_INSTRUCTIONS),
        ("human", """User Profile:
- Goal: {goal}
- Fitness Level: {fitness_level}
- Available Equipment: {equipment}
- Training Days per Week: {days_per_week}
- Session Length: {session_minutes} minutes
- Injuries / Limitations: {injuries}
- Additional Context: {additional_context}

Science Context Retrieved from Research Articles:
{context}

Generate a complete, evidence-based workout routine following the exact JSON schema after your narrative explanation.
"""),
    ])

    retriever = get_retriever(k=8)

    # Build retrieval query from the user's goal and context
    def build_query(inputs: dict) -> str:
        parts = [
            inputs.get("goal", ""),
            inputs.get("fitness_level", ""),
            inputs.get("additional_context", ""),
        ]
        return " ".join(p for p in parts if p)

    chain = (
        RunnablePassthrough.assign(
            context=lambda x: _format_docs(retriever.invoke(build_query(x)))
        )
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain
