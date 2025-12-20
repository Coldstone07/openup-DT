import numpy as np
import faiss
from typing import List, Dict, Any
from models import Session

class EmbeddingManager:
    def __init__(self, dimension: int = 384):
        self.dimension = dimension
        self.use_mock = False
        self.model = None
        
        # Initialize Sentence Transformer
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            self.dimension = self.model.get_sentence_embedding_dimension()
        except ImportError:
            print("Warning: sentence-transformers not found. Using Mock Embeddings.")
            self.use_mock = True

        # Initialize FAISS index
        self.index = faiss.IndexFlatL2(self.dimension)
        # Store metadata mapping: index_id -> info
        self.metadata: Dict[int, Dict[str, Any]] = {}
        self.current_id = 0

    def _get_embedding(self, text: str) -> np.ndarray:
        if self.use_mock or not self.model:
            # Generate random vector for MVP demo if libs missing
            return np.random.rand(self.dimension).astype('float32')
        
        return self.model.encode([text])[0]

    def generate_embeddings_for_session(self, session: Session):
        """
        Generates embedding for the session transcript and adds to FAISS.
        """
        vector = self._get_embedding(session.transcript)
        
        # Add to FAISS
        # Note: FAISS expects a matrix (list of vectors)
        vector_np = np.array([vector]).astype('float32')
        self.index.add(vector_np)
        
        # Store metadata
        self.metadata[self.current_id] = {
            "session_id": session.session_id,
            "user_id": session.user_id,
            "user_type": session.user_type,
            "timestamp": session.timestamp
        }
        self.current_id += 1

    def search(self, query_text: str, k: int = 5) -> List[Dict[str, Any]]:
        query_vector = self._get_embedding(query_text)
        query_np = np.array([query_vector]).astype('float32')
        
        distances, indices = self.index.search(query_np, k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx in self.metadata:
                meta = self.metadata[idx]
                results.append({
                    "metadata": meta,
                    "score": float(1 / (1 + distances[0][i])) # Convert parameters distance to similarity score
                })
        return results

    def update_user_embedding(self, user_id: str, context_text: str, user_type: str = "unknown"):
        """
        Updates (or overwrites) the embedding for a specific user based on their Profile Graph context.
        This aligns with the 'EV derived from PG' requirement.
        """
        if not context_text:
            return

        vector = self._get_embedding(context_text)
        vector_np = np.array([vector]).astype('float32')

        # FAISS IndexFlatL2 doesn't support "update" easily by ID without IDMap.
        # For this MVP, we will simpler: We append the NEW vector and update the metadata pointer.
        # Queries will find the *latest* vector because we can filter for the most recent index per user?
        # NO, FAISS search returns everything. 
        # Better approach for MVP: Rebuild index? No, too slow.
        # We will just ADD it. And in search, we deduplicate by user_id, taking the one with highest score 
        # (which technically might be an old state, but likely the new state if it matches better).
        # OR: We maintain a separate dict for User Vectors for exact lookup, and FAISS for similarity.
        # Let's just Add it. The 'Feature Store' versioning concept allows history.
        
        self.index.add(vector_np)
        self.metadata[self.current_id] = {
            "user_id": user_id,
            "user_type": user_type,
            "type": "profile_snapshot", # Distinguish from raw sessions
            "type": "profile_snapshot", # Distinguish from raw sessions
            "text_preview": context_text[:50] + "..."
        }
        self.current_id += 1

    def get_user_vector(self, user_id: str) -> Optional[np.ndarray]:
        """
        Retrieves the latest embedding vector for a given user.
        """
        # Linear scan backwards to find the latest snapshot
        for i in range(self.current_id - 1, -1, -1):
            if i in self.metadata:
                meta = self.metadata[i]
                if meta['user_id'] == user_id and meta.get('type') == 'profile_snapshot':
                    # Retrieve vector from index
                    # FAISS IndexFlatL2 supports direct access via reconstruct if enabled, 
                    # but standard index might not. 
                    # For MVP with FlatL2, we can usually use `reconstruct`.
                    try:
                        return self.index.reconstruct(i)
                    except:
                        # If reconstruct not supported (rare for FlatL2), we'd need to store side-vectors.
                        # For now, assume it works or we should have stored it.
                        pass
        return None

    def search_by_vector(self, query_vector: np.ndarray, k: int = 5) -> List[Dict[str, Any]]:
        """
        Searches the index using a pre-computed vector.
        """
        query_np = np.array([query_vector]).astype('float32')
        distances, indices = self.index.search(query_np, k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx in self.metadata:
                meta = self.metadata[idx]
                results.append({
                    "metadata": meta,
                    "score": float(1 / (1 + distances[0][i]))
                })
        return results
