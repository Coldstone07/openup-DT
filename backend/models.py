from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Union, Any
from datetime import datetime
import uuid

class Session(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_type: str  # "mentor" or "mentee"
    transcript: str
    timestamp: datetime = Field(default_factory=datetime.now)
    metadata: Dict[str, Any] = {}

class Node(BaseModel):
    id: str
    label: str  # Goal, Constraint, Sentiment, RiskFactor
    text: str
    properties: Dict[str, Any] = {}

class Edge(BaseModel):
    source: str
    target: str
    relation: str
    weight: float = 1.0

class UserGraph(BaseModel):
    user_id: str
    nodes: List[Node] = []
    edges: List[Edge] = []

class MatchRequest(BaseModel):
    user_id: str
    top_k: int = 3

class MatchResult(BaseModel):
    mentor_id: str
    score: float
    rationale: str
