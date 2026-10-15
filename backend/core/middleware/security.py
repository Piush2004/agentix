import json

SECURITY_HEADERS = [
    (b"x-content-type-options", b"nosniff"),
    (b"x-frame-options", b"DENY"),
    (b"x-xss-protection", b"1; mode=block"),
    (b"strict-transport-security", b"max-age=31536000; includeSubDomains"),
    (b"content-security-policy", b"default-src 'self'"),
]


class SecurityMiddleware:
    """Pure ASGI middleware (not BaseHTTPMiddleware) to avoid the documented
    Starlette hang that occurs when multiple BaseHTTPMiddleware subclasses are
    stacked on the same app — see core/middleware/profiling.py for the same fix."""

    def __init__(self, app, rate_limit: int = 100):
        self.app = app
        self.rate_limit = rate_limit

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        # 1. Request Size Limits (100 MB max for file uploads)
        headers = dict(scope.get("headers") or [])
        content_length = headers.get(b"content-length")
        if content_length and int(content_length) > 100 * 1024 * 1024:
            body = json.dumps({"detail": "Payload Too Large"}).encode()
            await send({
                "type": "http.response.start",
                "status": 413,
                "headers": [(b"content-type", b"application/json")],
            })
            await send({"type": "http.response.body", "body": body})
            return

        # 2. Rate Limiting (Temporarily disabled due to redis removal)

        async def send_with_security_headers(message):
            if message["type"] == "http.response.start":
                message["headers"] = list(message.get("headers", [])) + SECURITY_HEADERS
            await send(message)

        await self.app(scope, receive, send_with_security_headers)
