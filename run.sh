#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
export PATH="$HOME/.local/bin:$PATH"

echo "=================================================="
echo "Starting Sahayak: Senior Life Companion"
echo "=================================================="

# Check Python and Node
echo "Checking environment..."
python3.12 --version || echo "Using system python"
node -v || echo "Using system node"

# Start Backend
echo "Starting FastAPI Backend on http://127.0.0.1:8000 ..."
cd "$DIR/backend"
source venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

# Start Frontend
echo "Starting Vite Frontend on http://127.0.0.1:5173 ..."
cd "$DIR/frontend"
npm run dev -- --host 127.0.0.1 --port 5173 &
FRONTEND_PID=$!

trap "echo 'Shutting down services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM EXIT

echo "=================================================="
echo "Sahayak is running!"
echo "Frontend: http://127.0.0.1:5173"
echo "Backend Docs: http://127.0.0.1:8000/docs"
echo "Press Ctrl+C to stop both servers."
echo "=================================================="

wait
