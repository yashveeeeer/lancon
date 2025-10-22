from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # CORS settings
    CORS_ORIGINS: list[str] = ["http://localhost:3000",       # for local dev
                               "http://13.60.82.132",         # your EC2 public IP (no port since nginx serves on 80)
                               ]
    CORS_METHODS: list[str] = ["*"]
    CORS_HEADERS: list[str] = ["*"]

settings = Settings()