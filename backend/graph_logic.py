import networkx as nx
from typing import Dict, List, Any
from models import Session, UserGraph, Node, Edge
import uuid

class GraphBuilder:
    def __init__(self):
        # In-memory graph storage: user_id -> nx.Graph
        self.graphs: Dict[str, nx.Graph] = {}

    def _get_or_create_graph(self, user_id: str) -> nx.Graph:
        if user_id not in self.graphs:
            self.graphs[user_id] = nx.MultiDiGraph()
        return self.graphs[user_id]

    def process_session(self, session: Session):
        """
        Parses the session transcript to extract nodes and edges.
        In a real system, this would call an LLM.
        For MVP, we use simple keyword heuristics or simulated extraction.
        """
        G = self._get_or_create_graph(session.user_id)
        
        # 1. Add Session Node
        G.add_node(session.session_id, label="Session", timestamp=session.timestamp)
        
        # 2. Extract Entities (Simulated/Heuristic)
        # We'll extract "Goal" if we see words like "want to", "goal", "aim"
        text = session.transcript.lower()
        
        # Simple extraction logic for MVP demo
        entities = []
        if "improve" in text or "learn" in text:
            entities.append({"label": "Goal", "text": "Improve Skills"})
        if "stress" in text or "anxious" in text:
            entities.append({"label": "Sentiment", "text": "Anxious"})
        if "time" in text or "busy" in text:
            entities.append({"label": "Constraint", "text": "Time Constraints"})
            
        # Add nodes and edges to graph
        for entity in entities:
            node_id = f"{entity['label']}_{uuid.uuid4().hex[:8]}"
            G.add_node(node_id, label=entity['label'], text=entity['text'])
            # Edge from Session to Entity
            G.add_edge(session.session_id, node_id, relation="MENTIONS", weight=1.0)
            
            # If user node doesn't exist, create it mentally or explicitly?
            # Let's assume the graph IS the user profile, so we don't need a User node per se 
            # unless we want to link everything to a central node.
            # For traversal, linking to session is good enough for temporal tracking.

    def get_graph_data(self, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Returns the graph data in a JSON-serializable format."""
        if user_id:
             if user_id in self.graphs:
                 return nx.node_link_data(self.graphs[user_id])
             else:
                 return {"error": "User not found"}
        
        # Return all graphs
        all_data = {}
        for uid, G in self.graphs.items():
            all_data[uid] = nx.node_link_data(G)
        return all_data

    def get_user_context(self, user_id: str) -> str:
        """
        Retrieves a text representation of the User's Profile Graph.
        Aggregates all node labels and texts to form the 'User State'.
        """
        if user_id not in self.graphs:
            return ""
        
        G = self.graphs[user_id]
        context_parts = []
        
        # Prioritize recent nodes or specific types if needed? 
        # For MVP, we dump the whole graph state.
        for node_id, data in G.nodes(data=True):
            label = data.get('label', 'Unknown')
            text = data.get('text', '')
            if label != "Session": # Skip session markers, focus on content
                context_parts.append(f"{label}: {text}")
                
        return ". ".join(context_parts)
