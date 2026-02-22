from functools import lru_cache

import chromadb
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

from backend.core.config import get_settings

COLLECTION_NAME = "fitness_science"


@lru_cache(maxsize=1)
def get_embeddings() -> OpenAIEmbeddings:
    settings = get_settings()
    return OpenAIEmbeddings(
        model=settings.embedding_model,
        api_key=settings.openai_api_key,
    )


@lru_cache(maxsize=1)
def get_vectorstore() -> Chroma:
    settings = get_settings()
    client = chromadb.CloudClient(
        api_key=settings.chroma_api_key,
        tenant=settings.chroma_tenant,
        database=settings.chroma_database,
    )
    return Chroma(
        client=client,
        collection_name=COLLECTION_NAME,
        embedding_function=get_embeddings(),
    )


def get_retriever(k: int = 8):
    """MMR retrieval for diverse scientific evidence coverage."""
    return get_vectorstore().as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": k,
            "fetch_k": 20,
            "lambda_mult": 0.6,
        },
    )
