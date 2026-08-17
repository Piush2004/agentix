# API AUDIT (Initial)

## Frontend (Next.js API Routes)
- `/api/auth/[...nextauth]` - **KEEP**: Standard NextAuth configuration.
- `/api/datasets` - **REFACTOR**: Currently writes to DB, but needs to orchestrate the async handoff to the FastAPI backend.
- `/api/users/profile` - **KEEP**: User profile management.

## Backend (FastAPI Routes)
- `/api/v1/health` - **KEEP**: Health checks.
- `/api/v1/data/upload` - **REBUILD**: Needs to be refactored to support async chunked upload, returning a Job ID immediately.
- `/api/v1/jobs/{job_id}/status` - **NEW**: Needs to be created or fixed to poll execution status.

*Further endpoint verification will occur during Phase 2 live execution.*
