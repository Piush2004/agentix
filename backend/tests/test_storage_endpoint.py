from fastapi.testclient import TestClient

from core.api.main import app

client = TestClient(app)


def test_storage_endpoint_returns_real_disk_usage():
    """Regression test: /platform/storage must exist and return real,
    internally-consistent numbers (previously the frontend called this
    endpoint and it 404'd, leaving storage_used/storage_total stuck at
    hardcoded values)."""
    response = client.get("/api/v1/platform/storage")
    assert response.status_code == 200
    data = response.json()["data"]
    assert set(data.keys()) == {"used_gb", "total_gb", "free_gb"}
    assert data["used_gb"] >= 0
    assert data["total_gb"] > 0
    assert data["free_gb"] >= 0
    assert data["free_gb"] <= data["total_gb"]
