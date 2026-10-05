from typing import List

class LocalEmbeddingProvider:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self._model = None

    def get_model(self):
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._model = SentenceTransformer(self.model_name)
            except ImportError:
                return None
        return self._model

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        model = self.get_model()
        if model is None:
            return [[0.0] * 384 for _ in texts]
        return model.encode(texts).tolist()

    def embed_query(self, query: str) -> List[float]:
        model = self.get_model()
        if model is None:
            return [0.0] * 384
        return model.encode(query).tolist()

local_embedder = LocalEmbeddingProvider()
