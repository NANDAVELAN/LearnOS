import os
from datetime import datetime
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from db.database import get_db
from models.course import Course
from models.document import Document
from models.user import User
from api.auth import get_current_user
from utils.config import settings
from utils.logging import logger

router = APIRouter(prefix="/documents", tags=["documents"])


class DocumentResponse(BaseModel):
    id: int
    course_id: int
    filename: str
    file_path: str
    file_size_bytes: int
    page_count: int
    mime_type: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    course_id: int = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id, Course.user_id == current_user.id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found or access denied."
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF documents are supported (.pdf extension required)."
        )

    upload_dir = settings.resolved_upload_dir()
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    safe_filename = "".join(c for c in file.filename if c.isalnum() or c in "._- ")
    saved_filename = f"{course_id}_{timestamp}_{safe_filename}"
    target_path = upload_dir / saved_filename

    file_size = 0
    try:
        with open(target_path, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                buffer.write(chunk)
                file_size += len(chunk)
    except Exception as e:
        logger.error(f"Failed to write file to disk: {e}")
        if target_path.exists():
            target_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save uploaded file."
        )

    page_count = 1
    try:
        import fitz
        pdf_doc = fitz.open(str(target_path))
        page_count = len(pdf_doc)
        pdf_doc.close()
    except Exception as e:
        logger.warning(f"PyMuPDF page count error: {e}")

    doc_record = Document(
        course_id=course_id,
        filename=file.filename,
        file_path=str(target_path),
        file_size_bytes=file_size,
        page_count=page_count,
        mime_type=file.content_type or "application/pdf",
    )
    db.add(doc_record)
    db.commit()
    db.refresh(doc_record)

    logger.info(f"Successfully uploaded: {file.filename} ({page_count} pages) for course {course_id}")
    return doc_record


@router.get("", response_model=List[DocumentResponse])
def get_documents(
    course_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Document).join(Course).filter(Course.user_id == current_user.id)
    if course_id is not None:
        query = query.filter(Document.course_id == course_id)
    return query.order_by(Document.created_at.desc()).all()


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    doc = db.query(Document).join(Course).filter(
        Document.id == document_id,
        Course.user_id == current_user.id
    ).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")
    return doc


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    doc = db.query(Document).join(Course).filter(
        Document.id == document_id,
        Course.user_id == current_user.id
    ).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    file_path = Path(doc.file_path)
    if file_path.exists():
        try:
            file_path.unlink()
        except Exception:
            pass

    db.delete(doc)
    db.commit()
    return None
