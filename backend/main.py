# AI Mentorship System - FastAPI Backend
from fastapi import FastAPI, HTTPException
from typing import List
import json

from models import Session, MatchRequest, MatchResult
from graph_logic import GraphBuilder
from embeddings import EmbeddingManager
from privacy import PrivacyEngine
from matching import MatchingEngine

app = FastAPI(
    title="AI Mentorship System",
    description="Backend for an AI mentorship matching system using graph-based reasoning and differential privacy",
    version="0.1.0"
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for MVP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize core components
graph_builder = GraphBuilder()
embedding_manager = EmbeddingManager()
privacy_engine = PrivacyEngine()
matching_engine = MatchingEngine(embedding_manager)

@app.get("/")
async def root():
    return {"message": "AI Mentorship System API is running"}

@app.post("/session")
async def process_session(session: Session):
    """Process a mentorship session and update the graph"""
    try:
        # Build graph from session data
        graph_builder.process_session(session)
        
        # [ARCH UPDATE] Generate Embedding from Profile Graph (AI Hive "EV")
        # 1. Get the updated context from the graph
        user_context = graph_builder.get_user_context(session.user_id)
        
        # 2. Update the User's Embedding Vector
        embedding_manager.update_user_embedding(
            user_id=session.user_id, 
            context_text=user_context,
            user_type=session.user_type
        )
        
        # (Optional) We can still keep session-level embeddings if we want granular search
        # embedding_manager.generate_embeddings_for_session(session)
        
        return {
            "message": "Session processed successfully",
            "session_id": session.session_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing session: {str(e)}")

@app.post("/match")
async def find_matches(match_request: MatchRequest) -> List[MatchResult]:
    """Find mentor-mentee matches based on session data"""
    try:
        # Run matching engine
        matches = matching_engine.find_matches(match_request)
        
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding matches: {str(e)}")

@app.get("/graph")
async def get_graph():
    """Get the current graph representation"""
    try:
        graph_data = graph_builder.get_graph_data()
        return graph_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving graph: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "AI Mentorship System"}
