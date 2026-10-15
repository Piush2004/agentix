import pytest
from fastapi.testclient import TestClient

from core.api.main import app
from core.api.v1 import routes_platform

client = TestClient(app)


class _FakeRun:
    id = "run-1"


def test_chat_grounds_response_in_dataset_pipeline_results(monkeypatch):
    """Regression test for the AI Chat feature: the /chat endpoint must build its
    prompt from the real, persisted pipeline results for the given dataset, and
    the model must actually be invoked with that context."""

    monkeypatch.setattr(
        routes_platform, "_latest_dataset_and_run", lambda db, name: (None, _FakeRun())
    )

    def fake_stage_result(db, run_id, agent_name):
        return {
            "EDAAgent": {"statistics": {"revenue": {"mean": 42.5}}},
            "TrainingAgent": {"problem_type": "regression", "target_column": "revenue"},
            "EvaluationAgent": {"r2_score": 0.77},
        }.get(agent_name)

    monkeypatch.setattr(routes_platform, "_stage_result", fake_stage_result)
    monkeypatch.setattr(routes_platform, "_ollama_model_or_none", lambda: "qwen2.5:3b-instruct")

    captured = {}

    def fake_llm_generate(prompt, model):
        captured["prompt"] = prompt
        captured["model"] = model
        return "Revenue averages 42.5 based on the real EDA statistics."

    monkeypatch.setattr(routes_platform, "llm_generate", fake_llm_generate)

    response = client.post(
        "/api/v1/platform/chat",
        json={"query": "What is average revenue?", "dataset_name": "sales.csv"},
    )

    assert response.status_code == 200
    data = response.json()["data"]
    assert data["model"] == "qwen2.5:3b-instruct"
    assert "42.5" in data["response"]

    # The prompt sent to the model must actually contain the dataset's real
    # pipeline output, not be dataset-agnostic boilerplate.
    assert "42.5" in captured["prompt"]
    assert "regression" in captured["prompt"]
    assert "0.77" in captured["prompt"]
    assert "What is average revenue?" in captured["prompt"]


def test_chat_is_honest_when_no_model_available(monkeypatch):
    """When no Ollama model is available, /chat must say so rather than fabricate
    an answer or silently fail."""

    monkeypatch.setattr(routes_platform, "_ollama_model_or_none", lambda: None)

    called = {"llm": False}
    monkeypatch.setattr(
        routes_platform,
        "llm_generate",
        lambda *a, **k: called.__setitem__("llm", True),
    )

    response = client.post(
        "/api/v1/platform/chat",
        json={"query": "Anything?", "dataset_name": None},
    )

    assert response.status_code == 200
    data = response.json()["data"]
    assert "unavailable" in data["response"].lower() or "no local ai model" in data["response"].lower()
    assert called["llm"] is False
