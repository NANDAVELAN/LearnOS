from typing import List, Dict, Any
from ai.gemini import get_llm_provider

def generate_tutor_response(question: str, context_chunks: List[Dict[str, Any]], topic: str) -> Dict[str, Any]:
    return {"answer": "This is a placeholder tutor response.", "sources": []}
