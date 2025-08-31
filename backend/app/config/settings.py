from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # CORS settings
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    CORS_METHODS: list[str] = ["*"]
    CORS_HEADERS: list[str] = ["*"]

settings = Settings()