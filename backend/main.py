from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.routers import users, audio, websocket
from app.database.connection import test_db_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
)

app.include_router(users.router)
app.include_router(audio.router)
app.include_router(websocket.router)

@app.on_event("startup")
async def startup_event():
    await test_db_connection()

app.include_router(users.router)