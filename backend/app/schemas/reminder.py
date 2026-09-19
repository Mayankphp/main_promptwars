from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime

class ReminderCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    due_date: str = Field(..., description="Date string or ISO format, e.g. '2026-09-25' or '25 September'")
    due_date_formatted: Optional[str] = None
    category: str = Field(default="bill", description="'bill', 'medical', 'pension', 'renewal', 'general'")
    amount: Optional[str] = Field(default=None, description="Optional amount, e.g. '₹2,840'")
    notes: Optional[str] = Field(default=None, max_length=1000)

class ReminderUpdate(BaseModel):
    title: Optional[str] = None
    due_date: Optional[str] = None
    is_completed: Optional[bool] = None
    notes: Optional[str] = None

class ReminderResponse(BaseModel):
    id: int
    title: str
    due_date: str
    due_date_formatted: str
    category: str
    amount: Optional[str] = None
    notes: Optional[str] = None
    is_completed: bool
    days_remaining: int
    is_urgent: bool
    created_at: str
