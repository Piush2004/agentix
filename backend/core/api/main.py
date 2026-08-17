from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from core.api.v1.api import api_router
from core.config import settings
from core.repositories.database import engine, Base
import structlog
import logging
import sys
import os
import sentry_sdk
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

# Error Tracking (Sentry) - only enabled when a real DSN is configured;
# a fake/placeholder DSN would silently no-op while looking configured.
_sentry_dsn = os.getenv("SENTRY_DSN")
if _sentry_dsn:
    sentry_sdk.init(
        dsn=_sentry_dsn,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )

# Structured Logs
structlog.configure(
    processors=[
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)
logger = structlog.get_logger()
logging.basicConfig(format="%(message)s", stream=sys.stdout, level=logging.INFO)

# OpenTelemetry
from core.telemetry import setup_telemetry

from core.schemas.api_schemas import BaseResponse

from core.repositories.database import engine, Base, init_db

# Create DB tables with retry logic
init_db()
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Instrument FastAPI with OpenTelemetry
setup_telemetry(app)

from fastapi.responses import JSONResponse
from fastapi import Request
import os

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    
    # Error Sanitization
    if os.getenv("ENVIRONMENT") == "production":
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal server error occurred."}
        )
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

@app.get("/metrics")
async def metrics():
    # Prometheus Metrics endpoint
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)

from core.middleware.security import SecurityMiddleware
from core.middleware.profiling import EnterpriseProfilerMiddleware
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(EnterpriseProfilerMiddleware, slow_threshold_ms=500.0)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(SecurityMiddleware, rate_limit=200)

allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001")
origins = [origin.strip() for origin in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-API-Key"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", response_model=BaseResponse)
def health_check():
    logger.info("Health check endpoint accessed")
    return BaseResponse(
        status="success",
        message="OK",
        data={"status": "ok", "project": settings.PROJECT_NAME}
    )

# Trigger reload 2
