from fastapi import APIRouter, Depends
from pydantic import BaseModel
from api.auth import get_current_user
from models.user import User

router = APIRouter(prefix="/tutor", tags=["tutor"])

class TutorChatRequest(BaseModel):
    course_id: int
    message: str

@router.post("/chat")
def tutor_chat(req: TutorChatRequest, current_user: User = Depends(get_current_user)):
    return {
        "reply": "AI Tutor endpoint ready. Full RAG pipeline will be enabled in Phase 2.",
        "course_id": req.course_id,
        "sources": []
    }
