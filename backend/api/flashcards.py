from fastapi import APIRouter, Depends
from pydantic import BaseModel
from api.auth import get_current_user
from models.user import User

router = APIRouter(prefix="/flashcards", tags=["flashcards"])

class FlashcardsGenerateRequest(BaseModel):
    course_id: int
    topic: str
    count: int = 5

@router.post("/generate")
def generate_flashcards(req: FlashcardsGenerateRequest, current_user: User = Depends(get_current_user)):
    return {
        "status": "ready",
        "message": "Flashcard generation ready for Phase 6.",
        "course_id": req.course_id,
        "flashcards": []
    }

@router.get("/{course_id}")
def get_flashcards(course_id: int, current_user: User = Depends(get_current_user)):
    return {"course_id": course_id, "flashcards": []}
