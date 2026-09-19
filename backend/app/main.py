import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.services.reminder_service import init_db
from app.api.endpoints import router as api_router

# Configure clean logging (no sensitive data)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("sahayak.api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize SQLite database
    logger.info("Initializing Sahayak database and seed reminders...")
    await init_db()
    logger.info("Sahayak Backend API ready to assist senior citizens.")
    yield
    # Shutdown
    logger.info("Sahayak Backend API shut down cleanly.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Accessible, trustworthy, proactive GenAI companion backend for senior citizens.",
    lifespan=lifespan
)

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Strict CORS configuration
is_wildcard = "*" in settings.cors_origins_list
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if is_wildcard else settings.cors_origins_list,
    allow_credentials=False if is_wildcard else True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global safe error handlers (Never expose stack traces)
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "data": None,
            "error": exc.detail
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error on {request.url.path}: {exc.errors()[:2]}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "data": None,
            "error": "The input provided was not in the expected format. Please check your message and try again."
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Internal server error on {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "data": None,
            "error": "An unexpected issue occurred while processing your request. Please rest assured your data is safe and try again."
        }
    )

# Register API Router
app.include_router(api_router)

# Determine path to built frontend (supports both local and containerized deployments)
frontend_dist_dir = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
)
if not os.path.exists(frontend_dist_dir):
    # Container / production fallback
    frontend_dist_dir = "/app/frontend/dist"

if os.path.exists(frontend_dist_dir):
    assets_dir = os.path.join(frontend_dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    async def serve_root():
        index_file = os.path.join(frontend_dist_dir, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        return {"message": "Welcome to Sahayak API", "docs": "/docs", "health": "/api/health"}

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        if full_path.startswith("api/") or full_path in ("docs", "redoc", "openapi.json"):
            raise HTTPException(status_code=404, detail="Not Found")
        
        file_path = os.path.join(frontend_dist_dir, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        
        index_file = os.path.join(frontend_dist_dir, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Page not found")
else:
    @app.get("/")
    async def root():
        return {
            "message": "Welcome to Sahayak (सहायक) - Senior Life Companion API",
            "docs": "/docs",
            "health": "/api/health"
        }
