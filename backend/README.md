# AI Mentorship System MVP

This is a FastAPI-based backend for an AI mentorship matching system using multi-agent architecture with graph-based reasoning and differential privacy.

## Architecture Overview

- **Framework**: FastAPI (Python)
- **Data Stores**:
  - Graph Store: NetworkX (In-memory for MVP, serializable to JSON)
  - Vector Store: FAISS (Simple flat index)
- **Core Components**:
  - GraphBuilder: Extracts entities from text
  - PrivacyEngine: Adds differential privacy noise to embeddings
  - MatchingEngine: Calculates similarity and applies epsilon-greedy logic

## Project Structure

```
backend/
├── main.py              # FastAPI app and endpoints (/session, /match)
├── models.py            # Pydantic models (Session, UserProfile, MatchResult)
├── graph_logic.py       # NetworkX wrapper, graph construction logic, and "Node" extraction
├── embeddings.py        # Semantic embedding generation (sentence-transformers) and FAISS integration
├── privacy.py           # Differential privacy utilities (noise injection)
├── matching.py          # Logic for cosine similarity and outcome-informed priors
└── test_mvp.py          # Test script for MVP verification
```

## Features

1. **Graph-based reasoning** using NetworkX for storing mentorship relationships
2. **Semantic matching** using FAISS vector store
3. **Differential privacy** for protecting user data
4. **Epsilon-greedy matching** for optimal mentor-mentee pairing