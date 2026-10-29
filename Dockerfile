# Hugging Face Space (Docker SDK) build for Agentix.
#
# Agentix is two separate runtimes (Next.js frontend, FastAPI backend) that
# normally deploy as two services (Vercel + Railway/Render). A Docker Space
# only exposes one container on one port, so both run here in the same
# container: FastAPI listens internally on 8001, Next.js listens on the
# Space's public port (7860) and proxies /api/v1/* to the backend via the
# rewrite rule already defined in frontend/next.config.ts (BACKEND_URL env
# var) - this file does not duplicate that routing, only wires the two
# processes together.

# ---- Stage 1: build the frontend (needs devDependencies + prisma generate) ----
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ ./

# Baked into the client bundle at build time (NEXT_PUBLIC_* vars are not
# readable at container runtime) - must be the Space's real public origin,
# not a localhost/internal address, because platformStore.ts's client-side
# axios calls use this value directly: `${NEXT_PUBLIC_API_URL}/api/v1/...`.
# The browser then hits that public origin, and Next.js's own server-side
# rewrite (BACKEND_URL, set at runtime in start.sh) forwards it internally.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npx prisma generate
RUN npm run build

# ---- Stage 2: runtime image - needs both Node (frontend) and Python (backend) ----
FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Backend: real venv (not --break-system-packages into the system Python),
# consistent with how the backend already runs locally (backend/.venv).
COPY backend/requirements.txt ./backend/requirements.txt
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir -r backend/requirements.txt
ENV PATH="/opt/venv/bin:${PATH}"

COPY backend/ ./backend/

# Frontend: only the production-necessary output of the build stage, not
# its devDependencies or source maps.
COPY --from=frontend-build /app/frontend/.next ./frontend/.next
COPY --from=frontend-build /app/frontend/public ./frontend/public
COPY --from=frontend-build /app/frontend/node_modules ./frontend/node_modules
COPY --from=frontend-build /app/frontend/package.json ./frontend/package.json
COPY --from=frontend-build /app/frontend/next.config.ts ./frontend/next.config.ts
COPY --from=frontend-build /app/frontend/prisma ./frontend/prisma

COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# HF Spaces run the container as uid 1000, not root - the SQLite files and
# upload-staging directory both get written to at runtime and must already
# be owned by that user, or the first write fails with a permissions error
# that only shows up once a real request comes in, not at container start.
RUN useradd -m -u 1000 appuser \
    && mkdir -p /app/backend/data/temp \
    && chown -R appuser:appuser /app
USER appuser

ENV PORT=7860
EXPOSE 7860

CMD ["./start.sh"]
