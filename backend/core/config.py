from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


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
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
