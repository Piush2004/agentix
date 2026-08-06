"""
Re-export entry point for uvicorn compatibility.
The actual FastAPI app lives at core.api.main.
This module enables: uvicorn core.main:app
"""
from core.api.main import app  # noqa: F401
