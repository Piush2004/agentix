#!/bin/bash
# Runs both Agentix processes in this one Space container: FastAPI on an
# internal-only port, Next.js on the Space's public port. Next.js's own
# rewrite rule (frontend/next.config.ts, driven by BACKEND_URL below)
# forwards /api/v1/* from the public port to the internal one - this script
# only starts the two processes and keeps the container alive while either
# is running.
set -euo pipefail

BACKEND_PORT=8001
PUBLIC_PORT="${PORT:-7860}"

# Backend and frontend each use their own SQLite file, scoped to their own
# working directory - DATABASE_URL has a different meaning (and a different
# literal value) to each process, so it's set per-process here rather than
# once for the whole container.
cd /app/backend
DATABASE_URL="sqlite:///./agentix.db" \
  python -m uvicorn core.api.main:app --host 127.0.0.1 --port "$BACKEND_PORT" &
BACKEND_PID=$!

cd /app/frontend
# This container starts with no existing dev.db - create the schema before
# Next.js (and anything that queries it) comes up. --accept-data-loss is
# safe here specifically because the database is freshly created every
# time this container starts; it is not a standing database being migrated.
DATABASE_URL="file:./dev.db" npx prisma db push --skip-generate --accept-data-loss

BACKEND_URL="http://127.0.0.1:${BACKEND_PORT}" \
  npx next start -p "$PUBLIC_PORT" &
FRONTEND_PID=$!

# If either process dies, the container should exit (not limp along with
# only half the app working) so the Space's own restart policy kicks in.
wait -n "$BACKEND_PID" "$FRONTEND_PID"
exit_code=$?
echo "A process exited (code $exit_code) - stopping the other and exiting."
kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
exit "$exit_code"
