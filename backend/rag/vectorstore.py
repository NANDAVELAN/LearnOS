from utils.config import settings
from utils.logging import logger

class ChromaVectorStore:
    def __init__(self):
        self.host = settings.CHROMA_HOST
        self.port = settings.CHROMA_PORT
        self._client = None

    def get_client(self):
        if self._client is None:
            try:
                import chromadb
                self._client = chromadb.HttpClient(host=self.host, port=self.port)
            except Exception as e:
                logger.warning(f"Could not connect to ChromaDB at {self.host}:{self.port} - {e}")
                return None
        return self._client

    def get_or_create_course_collection(self, course_id: int):
        client = self.get_client()
        if client:
            return client.get_or_create_collection(name=f"course_{course_id}")
        return None

chroma_store = ChromaVectorStore()
