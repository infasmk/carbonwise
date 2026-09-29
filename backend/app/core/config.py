import os
from typing import List

class Settings:
    PROJECT_NAME: str = "CARBONWISE"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./carbonwise.db")
    DEMO_MODE_NOTICE: str = "ILLUSTRATIVE DEMO — NOT JSL PRODUCTION DATA"

settings = Settings()
