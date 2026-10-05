from typing import List
from pydantic import BaseModel

class RoadmapDayModel(BaseModel):
    day: int
    topic: str
    estimated_hours: float
    difficulty: str = "medium"
    prerequisites: List[str] = []

class CourseRoadmapModel(BaseModel):
    course_title: str
    total_days: int
    roadmap: List[RoadmapDayModel]
