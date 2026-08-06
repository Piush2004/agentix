# Agentix V2 Codebase Audit

## 1. Directory Structure

```
backend/
├── core/
│   ├── agents/ (Old agents to be purged)
│   ├── api/ (Contains routes, some of which are dead or duplicate)
│   ├── auth/ 
│   ├── brain/ (Contains mock LLM and reasoning engines)
│   ├── engines/ (Contains deprecated decision engines)
│   ├── jobs/ (Legacy background jobs)
│   ├── memory/ (Legacy context/memory structures)
│   ├── middleware/ (Auth/CORS)
│   ├── mlops/ (Legacy tracking)
│   ├── models/ (Database models, some unused)
│   ├── monitoring/ (Duplicate or mock logging)
│   ├── reports/ (Legacy static reports)
│   ├── repositories/ (Database setup)
│   ├── schemas/ (API Schemas)
│   ├── services/ (Massive PlatformService, duplicate dataset_processor, etc.)
│   ├── tasks/ (Unused celery/rq tasks)
│   ├── utils/ (Duplicate utilities)
│   ├── workflows/ (Unused or mock workflows)
│   ├── config.py
│   ├── context.py
│   ├── langgraph_engine.py
│   ├── logger.py
│   ├── main.py
│   └── redis_client.py
```

## 2. Architecture Diagram (Current - Deprecated)

```mermaid
graph TD
    UI[Frontend] --> API[FastAPI Routes]
    API --> PlatformService[PlatformService (God Object)]
    PlatformService --> DatasetProcessor[DatasetProcessor]
    PlatformService --> DecisionEngine[DecisionEngine]
    PlatformService --> Database[SQLite]
    PlatformService --> Redis[Redis]
```

## 3. Dependencies

- **Used:** FastAPI, pandas, scikit-learn, SQLAlchemy, pydantic, uvicorn
- **Unused/Mocked:** rq (used improperly, blocked), celery (if present), fakeredis (used for mocking), unittest.mock (used across prod code in brain logic)

## 4. Unused Modules & Dead Code

- `backend/core/brain/`: Completely mocked, non-functional LLM logic.
- `backend/core/engines/`: Multiple outdated decision engines.
- `backend/core/tasks/` & `backend/core/jobs/`: Failed implementations of asynchronous queue logic.
- `backend/core/workflows/`: Legacy AI pipeline steps that were bypassed.

## 5. Duplicate Code & Legacy Services

- `PlatformService` contains massive amounts of duplicated logic that overlaps with `DatasetProcessor` and `DataService`.
- Multiple implementations of EDA, cleaning, and model evaluation inside individual routes vs services.

## 6. Circular Imports

- Observed in `services` module where `dataset_processor` imports `PlatformService` activity logs or models, creating brittle execution chains.

## 7. Mock Code & Temporary Fixes

- `PlatformService.activity_logs`: Hardcoded mock initializations.
- `routes_auth.py`: Mocked Google OAuth token exchange.
- `test_brain.py` & `brain/` modules: Heavily reliant on `MagicMock` acting as real runtime engines.
- Frontend `platformStore.ts`: Temporary bypasses and "Upload Failed" unhandled exceptions.

## 8. Unused Database Tables

- Database models that were initialized but never populated due to synchronous workflow constraints.
- Multi-tenant structures `user_id` mocking (e.g. `current_user_id.get()` returning dummy keys).

## 9. Next Steps for Phase 2 (Cleanup)

- Delete `backend/core/brain/`
- Delete `backend/core/engines/`
- Delete `backend/core/jobs/`
- Delete `backend/core/tasks/`
- Delete `backend/core/workflows/`
- Refactor `backend/core/services/` to remove `PlatformService` entirely.
- Clean up unused API routes in `backend/core/api/v1/`.
