import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_reminders_crud_lifecycle():
    """Verify creating, listing, toggling, and deleting a reminder."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create reminder
        new_item = {
            "title": "Heart Specialist Appointment",
            "due_date": "2026-09-25",
            "due_date_formatted": "25 September 2026",
            "category": "medical",
            "amount": None,
            "notes": "Bring ECG test records"
        }
        res_create = await client.post("/api/reminders", json=new_item)
        assert res_create.status_code == 201
        created = res_create.json()["data"]
        reminder_id = created["id"]
        assert created["title"] == "Heart Specialist Appointment"

        # List reminders
        res_list = await client.get("/api/reminders")
        assert res_list.status_code == 200
        reminders = res_list.json()["data"]
        assert any(r["id"] == reminder_id for r in reminders)

        # Toggle status
        res_toggle = await client.patch(f"/api/reminders/{reminder_id}/toggle")
        assert res_toggle.status_code == 200
        assert res_toggle.json()["data"]["is_completed"] is True

        # Delete reminder
        res_delete = await client.delete(f"/api/reminders/{reminder_id}")
        assert res_delete.status_code == 200
        assert res_delete.json()["data"]["deleted"] is True

@pytest.mark.asyncio
async def test_reminder_not_found_handlers():
    """Verify 404 response for operations on nonexistent reminder IDs."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res_toggle = await client.patch("/api/reminders/9999999/toggle")
        assert res_toggle.status_code == 404
        res_delete = await client.delete("/api/reminders/9999999")
        assert res_delete.status_code == 404
