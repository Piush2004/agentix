import time
import os
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import jwt
from core.config import settings

class SecurityMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, rate_limit: int = 100):
        super().__init__(app)
        self.rate_limit = rate_limit
        
    async def dispatch(self, request: Request, call_next):
        # 1. Request Size Limits (100 MB max for file uploads)
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > 100 * 1024 * 1024:
            return JSONResponse(status_code=413, content={"detail": "Payload Too Large"})

        # 2. Rate Limiting (Temporarily disabled due to redis removal)
        # client_ip = request.client.host
        # path = request.url.path

        # 3. Security Headers (Helmet Equivalent)
        response = await call_next(request)
        
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        
        return response
