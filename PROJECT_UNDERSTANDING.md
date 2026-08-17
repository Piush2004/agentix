# PROJECT UNDERSTANDING

## Project Purpose
Agentix is an AI-powered Agentic Data Intelligence Platform that acts as an autonomous AI Data Scientist. It orchestrates complex machine learning workflows from dataset ingestion and cleaning to feature engineering, model training, evaluation, explainability, and reporting.

## Architecture
- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS, React Query. Deployed on Vercel.
- **Backend**: FastAPI, SQLAlchemy, Pydantic, Background Workers. Deployed on Railway.
- **Database**: PostgreSQL (Prisma on frontend, SQLAlchemy on backend)
- **Cache/Queue**: Redis
- **AI Integration**: Gemini API (primary), Ollama (local/fallback)

## Folder Structure
- `frontend/`: Next.js application containing the UI, NextAuth authentication, and Prisma schema.
- `backend/`: FastAPI application containing the Agentix "Brain", Orchestrator, multi-agent framework, and API routes.
- `agentix/`: Legacy or unused Next.js frontend wrapper (appears to be a duplicate or fragmented V2 UI).

## Current Workflow & Problems
1. The user uploads a CSV dataset.
2. The orchestrator triggers an 11-stage execution pipeline.
3. **Problem**: The upload pipeline is unstable, execution frequently fails, and the frontend waits synchronously (causing timeouts). 
4. The architecture has become fragmented due to repeated refactoring, leaving dead code and disconnected modules.
