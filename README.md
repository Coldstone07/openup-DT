# OpenUp AI Mentorship System (MVP)

A **multi-agent AI Hive architecture** for automated mentorship matching. This system builds privacy-respecting user models ("Profile Graphs") and uses graph-based reasoning to match mentees with mentors.

## Architecture

This MVP implements the core "AI Hive" components:

1.  **Ingestion**: Accepts mentorship session transcripts (simulating Voice/ASR).
2.  **Profile Graph (PG)**: Extracts and maintains a dynamic knowledge graph for each user (Goals, Constraints, Sentiments).
3.  **Embedding Vector (EV)**: Generates semantic embeddings derived from the **Profile Graph** (not just raw text) to represent the user's evolving state.
4.  **Matching Engine**: Uses weighted cosine similarity and an epsilon-greedy strategy to pair users.
5.  **Privacy**: Implements differential privacy by adding calibrated noise to embeddings.

## Project Structure

- `backend/`: FastAPI application.
    - `main.py`: API entry point.
    - `graph_logic.py`: Graph management (NetworkX).
    - `embeddings.py`: Vector generation (SentenceTransformers + FAISS).
    - `privacy.py`: Differential privacy logic.
- `frontend/`: React + Tailwind CSS dashboard.

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+

### 1. Run the Full Stack
We provide a unified script to start both backend and frontend:

```bash
bash run_app.sh
```
*Access frontend at [http://localhost:5173](http://localhost:5173).*

### 2. Manual Setup
**Backend**:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn main:app --reload
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

## Usage Guide

1.  **New Session**:
    - Go to the "New Session" tab.
    - Select your role (Mentor/Mentee).
    - Enter a transcript (e.g., "I need help with public speaking").
    - Submit.

2.  **Matching**:
    - The system updates your **Profile Graph**.
    - It generates a new **Embedding Vector** based on your updated graph context.
    - It searches the vector database for compatible users (epsilon-greedy exploration included).
    - Matches are displayed with a rationale card.

3.  **Dashboard**:
    - View system stats and the raw graph representation.

## Architecture Alignment (AI Hive)
- **Profile Graph**: Implemented via `graph_logic.py` (Nodes: Goal, Risk, etc.).
- **Vector Store**: Implements `embeddings.py` using FAISS.
- **Privacy**: `privacy.py` injects noise into vectors before matching.
- **Graph-Aware Embeddings**: The system specifically aggregates graph node texts to form the user embedding, ensuring matches are based on distinct user traits rather than transient session words.
