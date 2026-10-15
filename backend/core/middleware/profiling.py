import time
import logging

logger = logging.getLogger(__name__)


class EnterpriseProfilerMiddleware:
    """
    Globally profiles every REST API endpoint in the platform.
    Automatically logs endpoints that breach Service Level Agreement (SLA) thresholds.

    Implemented as pure ASGI middleware (not BaseHTTPMiddleware) — see
    core/middleware/security.py for why: stacking two BaseHTTPMiddleware
    subclasses on the same FastAPI app is a documented cause of requests
    hanging indefinitely under Starlette's dispatch implementation.
    """

    def __init__(self, app, slow_threshold_ms: float = 500.0):
        self.app = app
        self.slow_threshold_ms = slow_threshold_ms

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        start_time = time.time()
        method = scope.get("method", "?")
        path = scope.get("path", "?")

        async def send_with_timing(message):
            if message["type"] == "http.response.start":
                process_time_ms = (time.time() - start_time) * 1000
                message["headers"] = list(message.get("headers", [])) + [
                    (b"x-process-time-ms", str(round(process_time_ms, 2)).encode())
                ]
                if process_time_ms > self.slow_threshold_ms:
                    logger.warning(
                        f"[SLA BREACH] Endpoint {method} {path} "
                        f"took {process_time_ms:.2f}ms (Threshold: {self.slow_threshold_ms}ms)"
                    )
                else:
                    logger.debug(f"{method} {path} executed in {process_time_ms:.2f}ms")
            await send(message)

        await self.app(scope, receive, send_with_timing)
