from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from db.database import get_db
from models.course import Course
from models.user import User
from api.auth import get_current_user

router = APIRouter(prefix="/courses", tags=["courses"])


class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    goal_days: int = 20
    hours_per_day: float = 2.0
    student_level: str = "Intermediate"


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    goal_days: Optional[int] = None
    hours_per_day: Optional[float] = None
    student_level: Optional[str] = None


class DocumentSummary(BaseModel):
    id: int
    filename: str
    file_size_bytes: int
    page_count: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class CourseResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    goal_days: int
    hours_per_day: float
    student_level: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    documents: List[DocumentSummary] = []

    model_config = ConfigDict(from_attributes=True)


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    course_in: CourseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = Course(
        user_id=current_user.id,
        title=course_in.title,
        description=course_in.description,
        goal_days=course_in.goal_days,
        hours_per_day=course_in.hours_per_day,
        student_level=course_in.student_level,
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.get("", response_model=List[CourseResponse])
def get_courses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Course).filter(Course.user_id == current_user.id).order_by(Course.created_at.desc()).all()


@router.get("/{course_id}", response_model=CourseResponse)
def get_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id, Course.user_id == current_user.id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")
    return course


@router.put("/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: int,
    course_in: CourseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id, Course.user_id == current_user.id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")

    update_data = course_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(course, field, val)

    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id, Course.user_id == current_user.id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")

    db.delete(course)
    db.commit()
    return None
