from pathlib import Path
from typing import Any, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security & JWT
    SECRET_KEY: str = "learning-companion-super-secret-jwt-key-32-chars-min"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/learnos"

    # Storage for PDFs
    UPLOAD_DIR: str = "/app/uploads"

    # Vector Store (ChromaDB)
    CHROMA_HOST: str = "chromadb"
    CHROMA_PORT: int = 8000

    # LLM Providers
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    DEFAULT_LLM_PROVIDER: str = "gemini"

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, v: Any) -> bool:
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.lower() in ("true", "1", "yes", "on", "dev", "development")
        return bool(v)

    def resolved_upload_dir(self) -> Path:
        target = Path(self.UPLOAD_DIR)
        try:
            target.mkdir(parents=True, exist_ok=True)
            return target
        except Exception:
            fallback = Path(__file__).resolve().parent.parent / "uploads"
            fallback.mkdir(parents=True, exist_ok=True)
            return fallback


settings = Settings()
