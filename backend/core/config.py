from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Always resolve .env relative to this file (backend/core/config.py → repo root)
_ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    openai_api_key: str
    # ChromaDB Cloud
    chroma_api_key: str
    chroma_tenant: str
    chroma_database: str
    # Model settings
    model_name: str = "gpt-4o"
    embedding_model: str = "text-embedding-3-large"
    cors_origins: list[str] = ["http://localhost:5173"]

    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
