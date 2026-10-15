import importlib

import pytest
from fastapi import HTTPException


def _reload_auth_with_env(monkeypatch, environment=None, jwt_secret=None):
    if environment is None:
        monkeypatch.delenv("ENVIRONMENT", raising=False)
    else:
        monkeypatch.setenv("ENVIRONMENT", environment)
    if jwt_secret is None:
        monkeypatch.delenv("JWT_SECRET_KEY", raising=False)
    else:
        monkeypatch.setenv("JWT_SECRET_KEY", jwt_secret)

    import core.auth as auth_module

    return importlib.reload(auth_module)


def test_dev_bypass_active_when_environment_unset(monkeypatch):
    """Regression test: unset ENVIRONMENT must still behave like local dev
    (backwards compatible), so get_current_user's no-token fallback runs
    instead of raising."""
    auth_module = _reload_auth_with_env(monkeypatch, environment=None)
    assert auth_module.ENVIRONMENT == "development"
    assert auth_module.SECRET_KEY == "super-secret-agentix-key-2026"


def test_no_dev_bypass_outside_development(monkeypatch):
    """Regression test: any ENVIRONMENT value other than 'development'
    (production, staging, or a typo) must require a real JWT_SECRET_KEY and
    reject unauthenticated requests, closing the previous 'anything but
    literally production' fail-open gap."""
    with pytest.raises(RuntimeError):
        _reload_auth_with_env(monkeypatch, environment="staging")

    auth_module = _reload_auth_with_env(monkeypatch, environment="production", jwt_secret="real-secret")
    assert auth_module.SECRET_KEY == "real-secret"

    class _FakeDb:
        def query(self, *a, **k):
            raise AssertionError("DB should not be queried when rejecting for missing token")

    with pytest.raises(HTTPException) as exc_info:
        auth_module.get_current_user(token=None, db=_FakeDb())
    assert exc_info.value.status_code == 401


@pytest.fixture(autouse=True)
def _restore_auth_module():
    yield
    import os

    os.environ.pop("ENVIRONMENT", None)
    os.environ.pop("JWT_SECRET_KEY", None)
    import core.auth as auth_module

    importlib.reload(auth_module)
