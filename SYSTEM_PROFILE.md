# Agentix - System Profile & Architecture Specification

**System Name:** Agentix (Agentic Data Intelligence Platform)  
**Repository Location:** `D:\Projects\Agentic Data Intelligence Platform`  
**Architecture Pattern:** Microservice-ready Monorepo (Next.js 14 Frontend + FastAPI Async Backend + Autonomous Pipeline Orchestrator + Hardware Intelligence Engine)  
**Profile Version:** 2.0  
**Generated At:** 2026-08-07  

---

## 1. System Identity & Overview

**Agentix** is an enterprise-grade AI-powered Data Science Operating System designed to automate data ingestion, profiling, cleaning, exploratory data analysis (EDA), feature engineering, machine learning model training, evaluation, and intelligence report generation.

The system enforces a strict separation of concerns between presentation, API routing, autonomous agent orchestration, hardware adaptivity, and persistent storage.

```
+-----------------------------------------------------------------------+
|                         Next.js 14 Frontend                           |
|  App Router | React Query | Zustand | Shadcn UI | Tailwind CSS       |
+-----------------------------------------------------------------------+
                                    |
                                    | REST API / JSON (v1)
                                    v
+-----------------------------------------------------------------------+
|                         FastAPI Backend                               |
|  Uvicorn | Security Middleware | OpenTelemetry | Prometheus | Sentry |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                    Pipeline Orchestrator & Agents                     |
|  Upload -> Parser -> Profile -> Clean -> EDA -> FE -> Train -> Eval -> Report  |
+-----------------------------------------------------------------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
+-----------------------+                       +-----------------------+
|  Hardware Intelligence|                       |   Storage & Database  |
|  Engine (CPU/GPU/RAM) |                       | SQLAlchemy V2 (Pg/Sqlite)
+-----------------------+                       +-----------------------+
```

---

## 2. Directory & Component Layout

```
Agentix/
│
├── frontend/                     # Next.js 14 Web Application
│   ├── src/
│   │   ├── app/                  # Next.app Router pages & navigation
│   │   │   ├── (app)/            # Authenticated application view group
│   │   │   │   ├── agent-console/# Real-time pipeline & agent interface
│   │   │   │   ├── dashboard/    # System & dataset metrics dashboard
│   │   │   │   ├── data-dock/    # Chunked dataset upload & data manager
│   │   │   │   ├── history/      # Historical workflow runs log
│   │   │   │   ├── insights/     # Automated analytics & chart viewer
│   │   │   │   ├── intelligence-reports/ # Generated report viewer
│   │   │   │   ├── knowledge-graph/     # Knowledge graph visualizations
│   │   │   │   ├── profile/      # User profile page
│   │   │   │   └── settings/     # System settings & LLM provider config
│   │   │   ├── admin/            # Administrative management UI
│   │   │   ├── login/            # User authentication page
│   │   │   ├── globals.css       # Global styles & Tailwind CSS tokens
│   │   │   └── layout.tsx        # Top-level root layout & providers
│   │   ├── components/           # Reusable UI components & SystemHealth widget
│   │   ├── lib/                  # API client bindings & utility functions
│   │   └── store/                # Zustand client state stores (platformStore)
│   ├── public/                   # Static branding & favicon assets
│   ├── Dockerfile                # Frontend container configuration
│   └── package.json              # Next.js dependencies & scripts
│
├── backend/                      # FastAPI Cognitive & Execution Backend
│   ├── core/
│   │   ├── agents/               # 9 Pipeline agents & BaseAgent framework
│   │   │   ├── base.py           # Abstract BaseAgent & validation schemas
│   │   │   ├── pipeline_agents.py# Upload, Parser, Cleaning, EDA, FE, Training, Eval, Report agents
│   │   │   └── profiling_agent.py# Data profiling & dataset metadata extractor agent
│   │   ├── api/                  # API Routers & Endpoints
│   │   │   ├── main.py           # FastAPI application instantiation & middleware setup
│   │   │   └── v1/               # API Router Version 1
│   │   │       ├── api.py        # Central Router aggregator
│   │   │       ├── routes_auth.py# Authentication & user profile endpoints
│   │   │       ├── routes_data.py# Chunked upload endpoints (/upload/init, /chunk, /complete)
│   │   │       ├── routes_jobs.py# Job management & status polling endpoints
│   │   │       ├── routes_platform.py # Pipeline trigger (/start-workflow), profile, EDA, AutoML
│   │   │       └── routes_system.py # Health, hardware metrics, and monitoring endpoints
│   │   ├── engines/              # Processing & Execution Engines
│   │   │   ├── base.py           # Abstract ProcessingEngine interface
│   │   │   └── execution.py      # ExecutionEngine dispatcher & adaptive hardware allocation
│   │   ├── hardware/             # System Resource & Hardware Intelligence Engine
│   │   │   ├── detector.py       # HardwareDetector (CPU, RAM, GPU nvidia-smi, Disk)
│   │   │   └── models.py         # Resource & Hardware metrics models
│   │   ├── middleware/           # FastAPI Request Middlewares
│   │   │   ├── profiling.py      # EnterpriseProfilerMiddleware (Performance timing)
│   │   │   └── security.py       # SecurityMiddleware (Rate limiting & header security)
│   │   ├── models/               # SQLAlchemy ORM Database Schemas
│   │   │   └── models.py         # User, UserSettings, Dataset, WorkflowRun, PipelineStage
│   │   ├── repositories/         # Database Connections & Session Managers
│   │   │   └── database.py       # SQLAlchemy engine initializer & SessionLocal
│   │   ├── schemas/              # Pydantic Request & Response Data Transfer Objects (DTOs)
│   │   │   └── api_schemas.py    # Request payloads & standardized BaseResponse DTO
│   │   ├── config.py             # App environment variables settings (Pydantic Settings)
│   │   ├── context.py            # ContextVar user context state manager
│   │   ├── exceptions.py         # PipelineException error definitions
│   │   ├── logger.py             # Structlog structured JSON logger configuration
│   │   ├── main.py               # Entrypoint re-exporter for `uvicorn core.main:app`
│   │   └── telemetry.py          # OpenTelemetry tracer configuration
│   ├── Dockerfile                # Backend container definition
│   └── requirements.txt          # Python backend dependencies
│
├── agentix/                      # Dedicated agent management sub-package / Next sub-app
├── data/                         # Persistent & temporary upload directory (`data/temp`)
├── docs/                         # Comprehensive documentation hierarchy
│   ├── api/                      # REST API endpoints reference
│   ├── architecture/             # Deep dive architecture guides
│   ├── diagrams/                 # Mermaid architecture & sequence diagrams
│   └── deployment/               # Container deployment guides
├── examples/                     # Sample API requests & dataset payloads
├── scripts/                      # System administration & database setup scripts
├── tests/                        # Integration & end-to-end test suites
├── docker-compose.yml            # Multi-container orchestration (Frontend, Backend, Postgres, Redis)
├── openapi.json                  # Exported OpenAPI 3.0 API Specification
└── SYSTEM_PROFILE.md             # Authoritative repository system profile document
```

---

## 3. Subsystem Architecture & Technology Stack

### 3.1 Tech Stack Matrix

| Tier | Technology | Purpose / Usage |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router) | Server-Side Rendering (SSR), layout routing, pages |
| **Frontend Language** | TypeScript | Type safety & strict client interfaces |
| **UI Components** | Shadcn UI, Radix, Tailwind CSS | Modern, responsive design system & dark mode |
| **Client State** | Zustand (`platformStore.ts`) | UI view states, upload progress, active dataset state |
| **Data Fetching** | React Query (@tanstack/react-query) | Server state management, auto-refetching, caching |
| **Backend Framework**| FastAPI (Python 3.11+) | Async REST API service framework |
| **ASGI Server** | Uvicorn | Async high-performance Python WSGI/ASGI web server |
| **Database ORM** | SQLAlchemy 2.0 | Async-compatible relational data access & migrations |
| **Databases** | PostgreSQL 15 / SQLite | persistent operational store (`WorkflowRun`, `PipelineStage`) |
| **Cache & Queue** | Redis 7 | State caching, session store & pub-sub dispatcher |
| **Telemetry & Logs** | OpenTelemetry, Prometheus, Structlog | End-to-end tracing, metrics scraping, JSON logs |
| **Containerization** | Docker & Docker Compose | Container runtime orchestration |

---

### 3.2 The 9-Stage Autonomous Pipeline Architecture

Agentix relies on a **strict linear async pipeline** for dataset analysis and model training. Cyclic or non-deterministic orchestrators are replaced with state-backed stage isolation.

```mermaid
graph LR
    UploadAgent --> ParserAgent
    ParserAgent --> ProfilingAgent
    ProfilingAgent --> CleaningAgent
    CleaningAgent --> EDAAgent
    EDAAgent --> FeatureEngineeringAgent
    FeatureEngineeringAgent --> TrainingAgent
    TrainingAgent --> EvaluationAgent
    EvaluationAgent --> ReportAgent
```

#### Pipeline Stage Breakdown

1. **`UploadAgent`**: Inspects uploaded file metadata, verifies checksums, and registers the file in the `data/temp` directory.
2. **`ParserAgent`**: Detects CSV delimiters, column formats, encoding (UTF-8), and initial schema types.
3. **`ProfilingAgent`**: Measures dataset shape (rows, columns), data types, null rates, cardinality, and basic column statistics.
4. **`CleaningAgent`**: Applies automated data cleaning strategies: imputing missing values, removing duplicate records, trimming whitespace, and stripping invalid characters.
5. **`EDAAgent`**: Conducts exploratory data analysis, calculates statistical distributions, skewness, and inter-column correlation matrices.
6. **`FeatureEngineeringAgent`**: Automates categorical encoding (One-Hot / Label encoding), numerical feature scaling (StandardScaler / MinMax), and interaction term creation.
7. **`TrainingAgent`**: Invokes automated machine learning (AutoML) algorithms to train baseline classification or regression models (CatBoost, LightGBM, Random Forest, Scikit-learn).
8. **`EvaluationAgent`**: Evaluates trained models using cross-validation, computing accuracy, precision, recall, F1-score, ROC-AUC, and confusion matrix data.
9. **`ReportAgent`**: Generates a unified JSON executive report compiling metrics, charts, data transformations, and model recommendations.

---

### 3.3 Hardware Intelligence Engine (`ExecutionEngine`)

The system features dynamic, adaptive execution profiling before executing data operations:

- **`HardwareDetector`**: Queries host capabilities using `psutil` and `subprocess` calls:
  - **CPU**: Physical cores, logical threads, clock speed, current usage.
  - **RAM**: Total RAM (GB), available RAM, memory pressure percentage.
  - **GPU**: NVIDIA GPU discovery via `nvidia-smi` (VRAM total, CUDA availability).
  - **Disk**: Total disk capacity, free disk space, mount usage percentage.
  - **Installed Infrastructure Binaries**: Checks for `docker`, `redis-server`, `psql`, `ollama`.
- **Adaptive Execution Dispatching**: `ExecutionEngine.get_optimal_engine(dataset_size_mb)` automatically selects processing backends (e.g. Pandas vs Polars vs DuckDB vs PySpark) based on dataset volume vs available system RAM.

---

### 3.4 Data Models & Entity Schema

The database model layer (`backend/core/models/models.py`) maintains full relational persistence for all workflow runs and pipeline stages:

- **`User`**: System accounts (`id`, `email`, `hashed_password`, `role`, `is_active`, `created_at`).
- **`UserSettings`**: User configuration preferences (`user_id`, `llm_provider`, `openai_api_key`, `theme`).
- **`Dataset`**: Registered dataset metadata (`id`, `name`, `owner_id`, `filepath`, `rows`, `columns`, `size_bytes`).
- **`WorkflowRun`**: Main orchestration run entity (`id`, `owner_id`, `dataset_id`, `status` (`running`/`completed`/`failed`), `execution_time`, `logs`).
- **`PipelineStage`**: Granular tracking per stage (`id`, `run_id`, `agent_name`, `step_order`, `status` (`pending`/`running`/`completed`/`failed`), `execution_time`, `memory_usage_mb`, `output_data` (JSON), `errors` (JSON)).

---

## 4. End-to-End Data & Control Flow

```
[ User Browser ]
       |
       | 1. POST /api/v1/upload/init (filename, chunks count, file size)
       v
[ FastAPI: routes_data.py ]
       |
       | 2. Returns upload_id
       v
[ User Browser ]
       |
       | 3. POST /api/v1/upload/chunk (binary chunk bytes, chunk index)
       v
[ Temp Storage: data/temp/{upload_id}/ ]
       |
       | 4. POST /api/v1/upload/complete
       v
[ FastAPI: routes_data.py ]
       |-- a. Reassembles chunks into single file
       |-- b. Validates UTF-8 encoding & magic numbers (blocks ELF, MZ, PDF)
       |-- c. Enforces structural limits (Max 500MB, 500 columns, 2M rows)
       |-- d. Calls `PipelineOrchestrator.start_pipeline()` -> Creates DB WorkflowRun & PipelineStages
       |-- e. Dispatches `ExecutionDispatcher.dispatch()` via FastAPI `BackgroundTasks`
       v
[ Background Execution Worker ]
       |
       | 5. Sequentially runs PIPELINE_STAGES:
       |    Upload -> Parser -> Profile -> Clean -> EDA -> FE -> Train -> Eval -> Report
       |    - Updates stage status in DB (`pending` -> `running` -> `completed`)
       |    - Persists output JSON & execution time per stage
       v
[ React Frontend Polling ]
       |
       | 6. GET /api/v1/workflow-status?run_id=...
       v
[ User UI Update ] -> Real-time status update rendered on Agent Console & Insights pages
```

---

## 5. Security & Infrastructure Controls

1. **File Upload Security & Input Sanitization**:
   - **Allowed Extensions**: `.csv`, `.xlsx`, `.json`
   - **Binary Magic Number Screening**: Immediately rejects executables (ELF, MZ) and documents (PDF).
   - **Path Traversal Guards**: Strips directory separators (`/`, `\`, `..`) from `upload_id` and filename parameters.
   - **Resource Boundaries**: Strict ceiling limits of 500 MB file size, 500 maximum columns, and 2,000,000 maximum rows.
2. **API Middleware Pipeline**:
   - **`SecurityMiddleware`**: Enforces client rate limiting (default: 200 requests/window).
   - **`EnterpriseProfilerMiddleware`**: Logs and alerts on slow queries (> 500ms execution threshold).
   - **`GZipMiddleware`**: Compresses HTTP responses exceeding 1KB.
   - **`CORSMiddleware`**: Restricts cross-origin requests to explicit frontend origins (`ALLOWED_ORIGINS`).
3. **Observability Stack**:
   - Prometheus metrics scraped from `/metrics`.
   - OpenTelemetry span collection integrated into FastAPI lifecycle.
   - Structlog formatted JSON stdout logging.

---

## 6. Container Orchestration & Deployment

The platform is fully containerized via `docker-compose.yml`:

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql://agentix:agentixpass@db:5432/agentix
      - REDIS_URL=redis://redis:6379/0
      - ENVIRONMENT=production
    depends_on:
      db: { condition: service_healthy }
      redis: { condition: service_healthy }

  db:
    image: postgres:15-alpine
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes: [redis_data:/data]
```

---

## 7. Operational & Verification Commands

- **Local Backend Development Run**:
  ```bash
  cd backend
  uvicorn core.main:app --reload --port 8000
  ```
- **Local Frontend Development Run**:
  ```bash
  cd frontend
  npm run dev
  ```
- **Full Stack Docker Run**:
  ```bash
  docker-compose up --build
  ```
- **Backend Tests Execution**:
  ```bash
  pytest backend/tests/
  ```

---

*This document serves as the authoritative system profile for Agentix. Update this specification whenever major structural, pipeline, or architectural modifications are made.*
