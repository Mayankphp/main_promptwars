# =========================================================
# Stage 1: Build Frontend (Vite + React)
# =========================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# =========================================================
# Stage 2: Unified Production Runner (FastAPI + Python 3.12)
# =========================================================
FROM python:3.12-slim
WORKDIR /app

# Install basic networking utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend ./backend

# Copy built frontend static bundle
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

ENV HOST=0.0.0.0
ENV PORT=8000
ENV ENVIRONMENT=production

EXPOSE 8000

# Start uvicorn on the dynamic cloud PORT (defaults to 8000 if not set)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
