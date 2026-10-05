from fastapi import APIRouter, Depends
from api.auth import get_current_user
from models.user import User

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/{course_id}")
def get_progress(course_id: int, current_user: User = Depends(get_current_user)):
    return {
        "course_id": course_id,
        "mastery_score": 0.0,
        "topics_completed": 0,
        "total_study_time_minutes": 0,
        "weak_topics": [],
        "recent_activity": []
    }
