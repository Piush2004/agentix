import logging
import requests
from core.config import settings

logger = logging.getLogger("agentix_v2")


class LLMUnavailableError(Exception):
    """Raised when no LLM backend could actually service the request.
    Callers must surface this as an honest 'unavailable' state instead of
    fabricating a response."""
    pass


def generate(prompt: str, model: str, timeout: int = 60) -> str:
    """Calls a local Ollama model and returns its real text response."""
    try:
        resp = requests.post(
            f"{settings.OLLAMA_BASE_URL}/api/generate",
            json={"model": model, "prompt": prompt, "stream": False},
            timeout=timeout,
        )
        resp.raise_for_status()
        text = resp.json().get("response", "").strip()
        if not text:
            raise LLMUnavailableError("Ollama returned an empty response.")
        return text
    except requests.RequestException as e:
        logger.warning(f"Ollama call failed: {e}")
        raise LLMUnavailableError(str(e))
