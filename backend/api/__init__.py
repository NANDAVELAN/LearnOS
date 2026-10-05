from api.auth import router as auth_router
from api.courses import router as courses_router
from api.documents import router as documents_router
from api.tutor import router as tutor_router
from api.quizzes import router as quizzes_router
from api.flashcards import router as flashcards_router
from api.roadmap import router as roadmap_router
from api.progress import router as progress_router
from api.attention import router as attention_router

__all__ = [
    "auth_router",
    "courses_router",
    "documents_router",
    "tutor_router",
    "quizzes_router",
    "flashcards_router",
    "roadmap_router",
    "progress_router",
    "attention_router",
]
