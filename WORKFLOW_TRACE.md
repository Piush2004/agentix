# WORKFLOW TRACE (Concise)

1. **User** -> Accesses Frontend (Next.js in `frontend/`)
2. **Login** -> NextAuth handles session creation (Prisma DB).
3. **Dashboard** -> Loads `frontend/src/app/(app)/dashboard/page.tsx`
4. **Upload** -> User uploads CSV. Frontend hits `api/datasets/route.ts` which saves a record. But the *actual* file must be sent to the backend.
5. **Backend Processing** -> Hits FastAPI `upload` route.
   - Synchronous processing blocks the thread.
6. **Execution Pipeline**:
   - `UploadAgent` -> `ParserAgent` -> `ProfilingAgent` -> `CleaningAgent` -> `EDAAgent` -> `FeatureEngineeringAgent` -> `TrainingAgent` -> `EvaluationAgent` -> `ReportAgent`.
7. **Failure Point**: The execution halts during the upload/profiling stage because the orchestrator runs synchronously, causing timeouts on large files and swallowing exceptions when pandas/scikit-learn fails.

*Further detailed tracing will be appended after live debugging in Phase 2.*
