from typing import List
from pydantic import BaseModel

class QuestionModel(BaseModel):
    question: str
    type: str = "mcq"
    options: List[str]
    answer: int
    topic: str
    difficulty: str = "medium"

class QuizResponseModel(BaseModel):
    questions: List[QuestionModel]
