from fastapi import APIRouter, Depends
from pydantic import BaseModel
from api.auth import get_current_user
from models.user import User

router = APIRouter(prefix="/quiz", tags=["quiz"])

class QuizGenerateRequest(BaseModel):
    course_id: int
    topic: str
    num_questions: int = 5

@router.post("/generate")
def generate_quiz(req: QuizGenerateRequest, current_user: User = Depends(get_current_user)):
    return {
        "status": "ready",
        "message": "Quiz generation configured for Phase 4.",
        "course_id": req.course_id,
        "questions": []
    }

@router.post("/{quiz_id}/submit")
def submit_quiz(quiz_id: int, current_user: User = Depends(get_current_user)):
    return {"quiz_id": quiz_id, "score": 0.0, "status": "submitted"}
