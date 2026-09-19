import aiosqlite
import os
from datetime import datetime, date, timezone
from typing import List, Optional
from app.core.config import settings
from app.schemas.reminder import ReminderCreate, ReminderResponse, ReminderUpdate

DB_PATH = settings.DATABASE_PATH
_DB_INITIALIZED = False

async def ensure_db():
    """Ensure table exists before any database query."""
    global _DB_INITIALIZED
    if not _DB_INITIALIZED:
        await init_db()
        _DB_INITIALIZED = True

async def init_db():
    """Initialize SQLite database and create reminders table if not exists."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS reminders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                due_date TEXT NOT NULL,
                due_date_formatted TEXT NOT NULL,
                category TEXT NOT NULL DEFAULT 'general',
                amount TEXT,
                notes TEXT,
                is_completed BOOLEAN NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.commit()

        # Seed initial realistic reminders if empty
        async with db.execute("SELECT COUNT(*) FROM reminders") as cursor:
            count = (await cursor.fetchone())[0]
            if count == 0:
                initial_items = [
                    (
                        "Dr. Kapoor Health & Heart Checkup",
                        (date.today().replace(day=min(date.today().day + 1, 28))).isoformat(),
                        "Tomorrow, 10:30 AM",
                        "medical",
                        None,
                        "Remember to bring fasting blood sugar report and reading glasses.",
                        0
                    ),
                    (
                        "Life Certificate (Jeevan Pramaan) Submission",
                        (date.today().replace(day=min(date.today().day + 12, 28))).isoformat(),
                        "Due in 12 days",
                        "pension",
                        None,
                        "Can be submitted via face authentication app on phone or at local bank branch.",
                        0
                    )
                ]
                await db.executemany("""
                    INSERT INTO reminders (title, due_date, due_date_formatted, category, amount, notes, is_completed)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, initial_items)
                await db.commit()

def calculate_days_remaining(due_date_str: str) -> int:
    """Calculate remaining days from date string."""
    try:
        d = datetime.strptime(due_date_str[:10], "%Y-%m-%d").date()
        delta = (d - date.today()).days
        return delta
    except Exception:
        return 5

async def get_reminders(include_completed: bool = True) -> List[ReminderResponse]:
    """Fetch reminders sorted by due status."""
    await ensure_db()
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        query = "SELECT * FROM reminders ORDER BY is_completed ASC, due_date ASC"
        if not include_completed:
            query = "SELECT * FROM reminders WHERE is_completed = 0 ORDER BY due_date ASC"
        
        async with db.execute(query) as cursor:
            rows = await cursor.fetchall()
            results = []
            for r in rows:
                days = calculate_days_remaining(r["due_date"])
                results.append(ReminderResponse(
                    id=r["id"],
                    title=r["title"],
                    due_date=r["due_date"],
                    due_date_formatted=r["due_date_formatted"],
                    category=r["category"],
                    amount=r["amount"],
                    notes=r["notes"],
                    is_completed=bool(r["is_completed"]),
                    days_remaining=days,
                    is_urgent=(days <= 5 and not r["is_completed"]),
                    created_at=r["created_at"]
                ))
            return results

async def create_reminder(item: ReminderCreate) -> ReminderResponse:
    """Create a new confirmed reminder."""
    await ensure_db()
    formatted = item.due_date_formatted or item.due_date
    due_iso = item.due_date
    try:
        if len(item.due_date) >= 10 and item.due_date[4] == '-' and item.due_date[7] == '-':
            due_iso = item.due_date[:10]
    except Exception:
        pass

    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("""
            INSERT INTO reminders (title, due_date, due_date_formatted, category, amount, notes, is_completed)
            VALUES (?, ?, ?, ?, ?, ?, 0)
        """, (item.title, due_iso, formatted, item.category, item.amount, item.notes))
        await db.commit()
        new_id = cursor.lastrowid

        days = calculate_days_remaining(due_iso)
        return ReminderResponse(
            id=new_id,
            title=item.title,
            due_date=due_iso,
            due_date_formatted=formatted,
            category=item.category,
            amount=item.amount,
            notes=item.notes,
            is_completed=False,
            days_remaining=days,
            is_urgent=(days <= 5),
            created_at=datetime.now(timezone.utc).isoformat()
        )

async def toggle_reminder(reminder_id: int) -> Optional[ReminderResponse]:
    """Toggle completed status of a reminder."""
    await ensure_db()
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT is_completed FROM reminders WHERE id = ?", (reminder_id,)) as cursor:
            row = await cursor.fetchone()
            if not row:
                return None
            new_status = 0 if row["is_completed"] else 1
        
        await db.execute("UPDATE reminders SET is_completed = ? WHERE id = ?", (new_status, reminder_id))
        await db.commit()

        async with db.execute("SELECT * FROM reminders WHERE id = ?", (reminder_id,)) as cursor:
            r = await cursor.fetchone()
            days = calculate_days_remaining(r["due_date"])
            return ReminderResponse(
                id=r["id"],
                title=r["title"],
                due_date=r["due_date"],
                due_date_formatted=r["due_date_formatted"],
                category=r["category"],
                amount=r["amount"],
                notes=r["notes"],
                is_completed=bool(r["is_completed"]),
                days_remaining=days,
                is_urgent=(days <= 5 and not r["is_completed"]),
                created_at=r["created_at"]
            )

async def delete_reminder(reminder_id: int) -> bool:
    """Delete a reminder by ID."""
    await ensure_db()
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("DELETE FROM reminders WHERE id = ?", (reminder_id,))
        await db.commit()
        return cursor.rowcount > 0
