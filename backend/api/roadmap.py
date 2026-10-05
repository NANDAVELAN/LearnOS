from fastapi import APIRouter, Depends
from pydantic import BaseModel
from api.auth import get_current_user
from models.user import User

router = APIRouter(prefix="/roadmap", tags=["roadmap"])

class RoadmapGenerateRequest(BaseModel):
    course_id: int
    goal_days: int = 20
    hours_per_day: float = 2.0

@router.post("/generate")
def generate_roadmap(req: RoadmapGenerateRequest, current_user: User = Depends(get_current_user)):
    return {
        "status": "ready",
        "message": "Roadmap generator ready for Phase 3.",
        "course_id": req.course_id,
        "items": []
    }

@router.get("/{course_id}")
def get_roadmap(course_id: int, current_user: User = Depends(get_current_user)):
    return {"course_id": course_id, "items": []}
