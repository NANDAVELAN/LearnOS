from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import (
    auth_router,
    courses_router,
    documents_router,
    tutor_router,
    quizzes_router,
    flashcards_router,
    roadmap_router,
    progress_router,
    attention_router,
)
from db.database import init_db
from utils.config import settings
from utils.logging import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up AI Personalized Learning Companion backend...")
    init_db()
    upload_dir = settings.resolved_upload_dir()
    logger.info(f"Upload directory initialized at: {upload_dir}")
    yield
    logger.info("Shutting down backend...")


app = FastAPI(
    title="AI Personalized Learning Companion API",
    description="Adaptive full-stack study platform backend",
    version="1.0.0",
    lifespan=lifespan,
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["system"])
def root():
    return {
        "app": "AI Personalized Learning Companion",
        "status": "online",
        "docs_url": "/docs",
    }


@app.get("/health", tags=["system"])
def health():
    return {
        "status": "ok",
        "app": "AI Personalized Learning Companion",
        "version": "1.0.0",
    }


app.include_router(auth_router)
app.include_router(courses_router)
app.include_router(documents_router)
app.include_router(roadmap_router)
app.include_router(tutor_router)
app.include_router(quizzes_router)
app.include_router(flashcards_router)
app.include_router(progress_router)
app.include_router(attention_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
