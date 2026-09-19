import os
import io
from typing import List, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status
from app.core.config import settings
from app.core.security import sanitize_untrusted_input
from app.schemas.analysis import (
    ApiResponse,
    AnalyzeRequest,
    SafetyCheckRequest,
    AnalysisResponse
)
from app.schemas.reminder import (
    ReminderCreate,
    ReminderResponse
)
from app.services.gemini_service import gemini_service
from app.services.safety_service import analyze_safety_heuristics
from app.services import reminder_service
from app.utils.sample_data import SAMPLE_SCENARIOS

router = APIRouter(prefix="/api")

@router.get("/health", response_model=ApiResponse[dict])
async def health_check():
    """Health check endpoint confirming API status and active GenAI model."""
    return ApiResponse(
        success=True,
        data={
            "status": "healthy",
            "project": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "model": settings.GEMINI_MODEL,
            "environment": settings.ENVIRONMENT,
            "api_key_configured": bool(settings.GEMINI_API_KEY)
        },
        error=None
    )

@router.get("/samples", response_model=ApiResponse[List[dict]])
async def get_samples():
    """Return preloaded realistic scenarios for quick 1-click senior testing."""
    return ApiResponse(success=True, data=SAMPLE_SCENARIOS, error=None)

@router.post("/analyze", response_model=ApiResponse[AnalysisResponse])
async def analyze_text(request: AnalyzeRequest):
    """
    Unified Senior Assistant endpoint:
    Simplifies complex messages, extracts dates & amounts, provides action checklists,
    explains difficult words, assesses fraud risks, and anticipates proactive next steps.
    """
    if len(request.content.strip()) < 3:
        raise HTTPException(status_code=400, detail="Input text is too short to analyze.")
    if len(request.content) > settings.MAX_TEXT_LENGTH:
        raise HTTPException(
            status_code=413,
            detail=f"Content exceeds maximum length of {settings.MAX_TEXT_LENGTH} characters."
        )

    try:
        result = await gemini_service.analyze_content(
            content=request.content,
            language=request.language,
            task_context=request.task_context
        )
        return ApiResponse(success=True, data=result, error=None)
    except Exception as e:
        # Fallback will catch inside gemini_service, but catch any unexpected edge case
        raise HTTPException(
            status_code=500,
            detail="AI service encountered an unexpected error. Please try again or use manual verification."
        )

@router.post("/safety-check", response_model=ApiResponse[AnalysisResponse])
async def safety_check(request: SafetyCheckRequest):
    """
    Dedicated Trust & Safety endpoint:
    Flags warning signs (OTP theft, urgency, disconnection threats, shortened links).
    """
    if len(request.content.strip()) < 3:
        raise HTTPException(status_code=400, detail="Input text is too short to check.")

    result = await gemini_service.analyze_content(
        content=request.content,
        language=request.language,
        task_context="Safety and Scam Verification"
    )
    return ApiResponse(success=True, data=result, error=None)

@router.post("/upload", response_model=ApiResponse[dict])
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts text or document files, validates size & extension, and extracts plain text.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' is not supported. Please upload text, PDF, or image files."
        )

    content_bytes = await file.read()
    if len(content_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_BYTES // (1024*1024)}MB."
        )

    extracted_text = ""
    if ext in [".txt"]:
        try:
            extracted_text = content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            extracted_text = content_bytes.decode("latin-1", errors="ignore")
    else:
        # For demo purposes with images or PDFs, provide a clean preview extraction notice
        extracted_text = f"Document '{file.filename}' successfully uploaded ({len(content_bytes)} bytes). Content received for senior review."

    return ApiResponse(
        success=True,
        data={
            "filename": file.filename,
            "size_bytes": len(content_bytes),
            "text": extracted_text[:settings.MAX_TEXT_LENGTH]
        },
        error=None
    )

# --- Reminders Endpoints ---

@router.get("/reminders", response_model=ApiResponse[List[ReminderResponse]])
async def get_reminders():
    """Retrieve all upcoming deadlines and reminders for the senior citizen."""
    items = await reminder_service.get_reminders(include_completed=True)
    return ApiResponse(success=True, data=items, error=None)

@router.post("/reminders", response_model=ApiResponse[ReminderResponse], status_code=status.HTTP_201_CREATED)
async def add_reminder(item: ReminderCreate):
    """
    Create a new reminder after explicit user confirmation.
    """
    created = await reminder_service.create_reminder(item)
    return ApiResponse(success=True, data=created, error=None)

@router.patch("/reminders/{reminder_id}/toggle", response_model=ApiResponse[ReminderResponse])
async def toggle_reminder_status(reminder_id: int):
    """Toggle reminder between active and completed."""
    updated = await reminder_service.toggle_reminder(reminder_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Reminder not found.")
    return ApiResponse(success=True, data=updated, error=None)

@router.delete("/reminders/{reminder_id}", response_model=ApiResponse[dict])
async def remove_reminder(reminder_id: int):
    """Delete a reminder."""
    success = await reminder_service.delete_reminder(reminder_id)
    if not success:
        raise HTTPException(status_code=404, detail="Reminder not found.")
    return ApiResponse(success=True, data={"deleted": True, "id": reminder_id}, error=None)
