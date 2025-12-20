#!/bin/bash
set -e

# Cleanup any existing
pkill -f uvicorn || true
pkill -f vite || true

# 1. Start Backend
echo "Starting Backend..."
cd backend
source venv/bin/activate
export PYTHONUNBUFFERED=1
python3 -m uvicorn main:app --port 8000 --log-level warning > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend
echo "Waiting for Backend to be ready..."
until curl -s http://localhost:8000/health | grep "healthy"; do
  sleep 1
done
echo "Backend is Ready."

# 2. Start Frontend
echo "Starting Frontend..."
cd ../frontend
npm run dev -- --port 5173 > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo "Application is running."
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8000"
echo "Press Ctrl+C to stop."

wait
