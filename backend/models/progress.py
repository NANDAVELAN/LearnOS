from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_name = Column(String(255), nullable=True)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    duration_minutes = Column(Float, default=0.0)

    # Relationships
    user = relationship("User", back_populates="study_sessions")
    attention_events = relationship("AttentionEvent", back_populates="session", cascade="all, delete-orphan")


class TopicMastery(Base):
    __tablename__ = "topic_mastery"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_name = Column(String(255), nullable=False)
    mastery_score = Column(Float, default=0.0)
    attempts_count = Column(Integer, default=0)
    last_accuracy = Column(Float, default=0.0)
    is_weak = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="topic_masteries")


class AttentionEvent(Base):
    __tablename__ = "attention_events"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("study_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    face_present = Column(Boolean, default=True)
    attention_score = Column(Float, nullable=False)
    state = Column(String(50), default="FOCUSED")

    # Relationships
    session = relationship("StudySession", back_populates="attention_events")


class BreakRecommendation(Base):
    __tablename__ = "break_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    session_id = Column(Integer, ForeignKey("study_sessions.id", ondelete="CASCADE"), nullable=True, index=True)
    reason = Column(String(255), default="Sustained low attention detected")
    duration_minutes = Column(Integer, default=10)
    recommended_at = Column(DateTime, default=datetime.utcnow)
    accepted = Column(Boolean, default=False)
