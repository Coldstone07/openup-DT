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
        if "time" in text or "busy" in text or "schedule" in text:
            entities.append({"label": "Constraint", "text": "Time Constraints"})
        if "job" in text or "hiring" in text or "career" in text:
             entities.append({"label": "Goal", "text": "Job Search / Career Growth"})
        if "fundraising" in text or "investor" in text or "scale" in text:
             entities.append({"label": "Goal", "text": "Startup Fundraising & Scaling"})
        if "leadership" in text or "management" in text:
             entities.append({"label": "Goal", "text": "Leadership Skills"})
        if "ai" in text or "ml" in text or "data" in text:
             entities.append({"label": "Interest", "text": "AI & Data Science"})
            
        # Add nodes and edges to graph
        for entity in entities:
            node_id = f"{entity['label']}_{uuid.uuid4().hex[:8]}"
            G.add_node(node_id, label=entity['label'], text=entity['text'])
            # Edge from Session to Entity
            G.add_edge(session.session_id, node_id, relation="MENTIONS", weight=1.0)

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
        Also includes the latest session transcript to ensure dense embeddings.
        """
        if user_id not in self.graphs:
            return ""
        
        G = self.graphs[user_id]
        context_parts = []
        
        # 1. Add Graph Nodes (Long-term memory)
        for node_id, data in G.nodes(data=True):
            label = data.get('label', 'Unknown')
            text = data.get('text', '')
            if label != "Session": 
                context_parts.append(f"{label}: {text}")

        # 2. Flatten relevant session history (or just the latest)??
        # The AI Hive "EV" is derived from the graph. 
        # Since we added "Goal" nodes, that should be enough.
        # But if the graph is empty (cold start), we should fallback to session usage.
        
        if not context_parts:
             # Try to find the latest session node
             session_nodes = [n for n, d in G.nodes(data=True) if d.get('label') == 'Session']
             # (This is a simplified check, ideally sort by timestamp)
             if session_nodes:
                 context_parts.append("New User History: (Processing...)") # Placeholder
        
        return ". ".join(context_parts)
