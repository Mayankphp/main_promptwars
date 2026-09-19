import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    PROJECT_NAME: str = "Sahayak: Senior Life Companion API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    
    # API & Model Configuration
    GEMINI_API_KEY: str = Field(default="")
    GEMINI_MODEL: str = Field(default="gemini-3.5-flash")
    
    # Host & Port
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
    
    # Security Limits
    MAX_TEXT_LENGTH: int = 15000  # 15KB max text length
    MAX_UPLOAD_SIZE_BYTES: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_EXTENSIONS: set = {".txt", ".png", ".jpg", ".jpeg", ".pdf", ".webp"}
    
    # Database
    DATABASE_PATH: str = "sahayak.db"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()
