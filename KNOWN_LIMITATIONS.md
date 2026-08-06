# Known Limitations
**EMERGENCY RECOVERY MODE**

The application is fully functional for a live demonstration, but the aggressive rebuilding of the backend introduced some temporary limitations that should be addressed in the next phase.

### 1. In-Memory Job Storage
- **Limitation**: The `JobManager` currently stores job state, progress, and results in memory (`_jobs` dict).
- **Impact**: If the FastAPI server restarts, all currently running jobs and completed job results are lost. 
- **Next Steps**: Migrate `JobManager` state to a persistent store (e.g., Redis or PostgreSQL).

### 2. Single-Threaded Pipeline Execution
- **Limitation**: The pipeline runs in a background thread `threading.Thread`.
- **Impact**: Heavy machine learning tasks (e.g., Training) are bound by the Global Interpreter Lock (GIL) or local CPU resources. This is fine for demo purposes on small/medium datasets, but it won't scale.
- **Next Steps**: Offload pipeline execution to a dedicated message queue and worker pool (e.g., Celery + RabbitMQ).

### 3. File Storage
- **Limitation**: Uploaded datasets are stored locally in the `data/temp` directory.
- **Impact**: This won't work in a distributed environment (e.g., if the backend scales horizontally across multiple pods).
- **Next Steps**: Integrate cloud storage (e.g., AWS S3 or Google Cloud Storage) for dataset persistence.

### 4. Progress Estimation
- **Limitation**: `estimated_remaining` is calculated via a simple average of elapsed time divided by completed stages.
- **Impact**: Stages like "Training" take much longer than "Profiling", so the ETA might jump around during execution.
- **Next Steps**: Hardcode expected weights per stage or use historical averages for better ETA calculations.
