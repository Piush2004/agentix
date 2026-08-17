# REPOSITORY AUDIT

## Directory Classification

- `frontend/` -> **KEEP** (Contains the active Next.js UI, Prisma schema, and NextAuth implementation)
- `backend/` -> **KEEP/REFACTOR** (Contains the FastAPI implementation; components of the execution pipeline will be refactored/rebuilt)
- `agentix/` -> **REMOVE** (Legacy/Duplicate Next.js application that causes fragmentation)
- `docs/` -> **KEEP** (Documentation assets)
- `data/` -> **UNKNOWN** (Check for essential seed data vs disposable test data)
- `scripts/` -> **REFACTOR** (Keep only actively used CI/CD and deployment scripts)

## High-Level Assessment
The codebase has significant duplication (e.g., two Next.js folders). We must immediately prune `agentix/` if it is confirmed unused, and focus all frontend efforts on `frontend/`. The `backend/core/` folder contains many agents that need to be rewired into an asynchronous orchestrator.
