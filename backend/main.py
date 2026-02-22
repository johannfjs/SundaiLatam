from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes.chat import router as chat_router
from backend.api.routes.ingest import router as ingest_router
from backend.core.config import get_settings
from backend.rag.vectorstore import get_vectorstore


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm the ChromaDB connection on startup
    get_vectorstore()
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="FitScience API",
        version="1.0.0",
        description="Science-based workout routine generator powered by RAG + OpenAI",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(chat_router, prefix="/api")
    app.include_router(ingest_router, prefix="/api")

    return app


app = create_app()
