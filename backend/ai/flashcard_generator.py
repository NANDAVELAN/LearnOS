from typing import List
from pydantic import BaseModel

class FlashcardModel(BaseModel):
    front: str
    back: str
    topic: str
    difficulty: str = "medium"

class FlashcardBatchModel(BaseModel):
    flashcards: List[FlashcardModel]
