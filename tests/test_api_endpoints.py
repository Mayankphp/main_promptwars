import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_check_endpoint():
    """Verify health endpoint returns status 200, healthy status, and model metadata."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "healthy"
        assert "gemini" in data["data"]["model"]

@pytest.mark.asyncio
async def test_input_validation_empty_content():
    """Verify empty or whitespace-only input produces safe 400/422 rejection."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/analyze", json={"content": "   "})
        assert response.status_code in [400, 422]
        data = response.json()
        assert data["success"] is False

@pytest.mark.asyncio
async def test_oversized_payload_rejection():
    """Verify text exceeding 15KB max length is rejected safely with 413 or 422."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        oversized = "A" * 20000
        response = await client.post("/api/analyze", json={"content": oversized})
        assert response.status_code in [413, 422]
        data = response.json()
        assert data["success"] is False

@pytest.mark.asyncio
async def test_upload_valid_text_document():
    """Verify document upload extracts text from valid plain text files."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        files = {"file": ("bill.txt", b"Electricity bill amount is Rs 2100 due on 30 Sept.", "text/plain")}
        res = await client.post("/api/upload", files=files)
        assert res.status_code == 200
        data = res.json()["data"]
        assert "bill.txt" in data["filename"]
        assert "Rs 2100" in data["text"]

@pytest.mark.asyncio
async def test_upload_unsupported_extension():
    """Verify uploading executable or unsupported files is rejected with 400."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        files = {"file": ("malware.exe", b"malicious binary", "application/x-msdownload")}
        res = await client.post("/api/upload", files=files)
        assert res.status_code == 400
        assert "not supported" in res.json()["error"].lower()

@pytest.mark.asyncio
async def test_safety_check_endpoint_threat():
    """Verify safety-check endpoint processes threat text and returns structured flags."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "content": "Immediate disconnection warning! Pay ₹3,400 to mobile number 9876543210 or power will be cut tonight.",
            "language": "en"
        }
        res = await client.post("/api/safety-check", json=payload)
        assert res.status_code == 200
        data = res.json()["data"]
        assert data["risk_level"] in ["caution", "high_risk"]
        assert len(data["warnings"]) > 0
        assert len(data["actions"]) > 0

@pytest.mark.asyncio
async def test_samples_endpoint():
    """Verify sample scenarios endpoint returns valid preset documents for senior testing."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/samples")
        assert res.status_code == 200
        data = res.json()["data"]
        assert len(data) >= 3
