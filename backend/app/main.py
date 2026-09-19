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

# Strict CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
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

@app.get("/")
async def root():
    return {
        "message": "Welcome to Sahayak (सहायक) - Senior Life Companion API",
        "docs": "/docs",
        "health": "/api/health"
    }
