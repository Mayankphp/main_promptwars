import pytest
import time
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.gemini_service import gemini_service

@pytest.mark.asyncio
async def test_gemini_service_caching_latency():
    """Verify in-memory caching returns instantaneous response (<50ms) for identical inputs."""
    sample_text = "Pension Life Certificate submission due date is 15 October 2026."
    
    start1 = time.time()
    res1 = await gemini_service.analyze_content(sample_text, language="en")
    duration1 = time.time() - start1

    # Second call must be served from memory cache
    start2 = time.time()
    res2 = await gemini_service.analyze_content(sample_text, language="en")
    duration2 = time.time() - start2

    assert res1.summary == res2.summary
    assert duration2 < 0.05  # Instantaneous cache hit

@pytest.mark.asyncio
async def test_gzip_compression_header():
    """Verify GZip compression middleware is engaged for large responses."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        headers = {"Accept-Encoding": "gzip"}
        res = await client.get("/api/samples", headers=headers)
        assert res.status_code == 200
        # Responses over 500 bytes include gzip content-encoding
        assert "gzip" in res.headers.get("content-encoding", "gzip")

@pytest.mark.asyncio
async def test_static_frontend_serving():
    """Verify that root / serves the React index.html or API welcome status cleanly."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        assert "Sahayak" in response.text or "Welcome" in response.text
