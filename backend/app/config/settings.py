from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "466232fccc3af06f9344ae10bd35130194df318e6b6f53a9f2d60f66f6033849"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS settings
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    CORS_METHODS: list[str] = ["*"]
    CORS_HEADERS: list[str] = ["*"]

settings = Settings()