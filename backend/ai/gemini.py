from abc import ABC, abstractmethod
from typing import Optional
from utils.config import settings
from utils.logging import logger

class LLMProvider(ABC):
    @abstractmethod
    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        pass

class GeminiProvider(LLMProvider):
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self._client = None

    def _get_client(self):
        if self._client is None and self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self._client = genai.GenerativeModel(self.model_name)
            except Exception as e:
                logger.warning(f"Could not initialize Gemini model: {e}")
                self._client = None
        return self._client

    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        client = self._get_client()
        if not client:
            return "Gemini API key is not configured or client failed to initialize."
        try:
            full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
            response = client.generate_content(full_prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini generation error: {e}")
            raise

class OllamaProvider(LLMProvider):
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL

    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        try:
            import httpx
            payload = {
                "model": "llama3",
                "prompt": prompt,
                "system": system_prompt or "",
                "stream": False,
            }
            res = httpx.post(f"{self.base_url}/api/generate", json=payload, timeout=60.0)
            if res.status_code == 200:
                return res.json().get("response", "")
            return f"Ollama error: HTTP {res.status_code}"
        except Exception as e:
            logger.warning(f"Ollama fallback error: {e}")
            return f"Ollama fallback unreachable: {e}"

def get_llm_provider() -> LLMProvider:
    if settings.DEFAULT_LLM_PROVIDER == "ollama" or not settings.GEMINI_API_KEY:
        return OllamaProvider()
    return GeminiProvider()
