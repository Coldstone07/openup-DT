#!/bin/bash
set -e

# Setup venv if needed
if [ ! -d "venv" ]; then
    echo "Creating venv..."
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip --quiet
    pip install fastapi uvicorn pydantic networkx numpy requests scikit-learn faiss-cpu sentence-transformers --quiet
else
    source venv/bin/activate
fi

echo "Starting Server..."
# Start server in background
# Unbuffered output for python
export PYTHONUNBUFFERED=1
python3 -m uvicorn main:app --port 8000 --log-level info > server.log 2>&1 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

echo "Waiting for server to be healthy..."
# Loop until health check passes or timeout
TIMEOUT=30
COUNT=0
while [ $COUNT -lt $TIMEOUT ]; do
    if curl -s http://localhost:8000/health | grep "healthy" > /dev/null; then
        echo "Server is UP!"
        break
    fi
    echo "Waiting for server... ($COUNT/$TIMEOUT)"
    sleep 1
    COUNT=$((COUNT+1))
done

if [ $COUNT -eq $TIMEOUT ]; then
    echo "Server failed to start in $TIMEOUT seconds."
    cat server.log
    kill $SERVER_PID
    exit 1
fi

echo "Running Test Script..."
python3 test_mvp.py

# Cleanup
echo "Stopping Server..."
kill $SERVER_PID
echo "Done."
