from fastapi import APIRouter, Depends
from pydantic import BaseModel
from api.auth import get_current_user
from models.user import User

router = APIRouter(prefix="/attention", tags=["attention"])

class AttentionEventRequest(BaseModel):
    session_id: int
    attention_score: float
    face_present: bool = True
    state: str = "FOCUSED"

@router.post("/event")
def record_attention_event(req: AttentionEventRequest, current_user: User = Depends(get_current_user)):
    return {
        "status": "recorded",
        "session_id": req.session_id,
        "state": req.state,
        "recommend_break": req.attention_score < 0.25
    }

@router.get("/{session_id}")
def get_session_attention(session_id: int, current_user: User = Depends(get_current_user)):
    return {"session_id": session_id, "average_attention": 0.85, "events_count": 0}
