import random
from typing import List, Optional
from models import MatchRequest, MatchResult
from embeddings import EmbeddingManager

class MatchingEngine:
    def __init__(self, embedding_manager: Optional[EmbeddingManager] = None):
        self.embedding_manager = embedding_manager

    def find_matches(self, request: MatchRequest) -> List[MatchResult]:
        # Epsilon-greedy strategy
        EPSILON = 0.2
        
        matches = []
        
        # Exploration: Random match
        if random.random() < EPSILON: 
            matches.append(MatchResult(
                mentor_id="random_explorer_" + str(random.randint(100,999)),
                score=0.5,
                rationale="Exploratory match to diversify connections."
            ))
            return matches 

        # Exploitation: Semantic search
        # Exploitation: Semantic search
        if self.embedding_manager:
            # [ARCH UPDATE] Graph-Aware Matching
            # Retrieve the Mentee's "Embedding Vector" (EV) derived from their Profile Graph
            user_vector = self.embedding_manager.get_user_vector(request.user_id)
            
            if user_vector is not None:
                # Search using the User's Vector
                results = self.embedding_manager.search_by_vector(user_vector, k=request.top_k)
            else:
                # Cold Start Fallback: If no graph vector, use a generic intent or their latest session?
                # For now, fallback to a "New User" generic search
                results = self.embedding_manager.search("new user looking for mentorship", k=request.top_k)

            for res in results:
                meta = res['metadata']
                # Basic Filtering
                if meta['user_id'] == request.user_id:
                    continue
                if meta['user_type'] == 'mentee': # Assume we want mentors
                     continue
                     
                matches.append(MatchResult(
                    mentor_id=meta['user_id'],
                    score=res['score'],
                    rationale=f"High semantic alignment (Score: {res['score']:.2f})"
                ))
        
        # Fallback if no matches
        if not matches:
             matches.append(MatchResult(
                mentor_id="default_mentor_01",
                score=0.1,
                rationale="Standard recommendation (cold start)."
            ))
            
        return matches[:request.top_k]
