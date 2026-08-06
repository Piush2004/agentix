import threading
import time
from typing import Dict, Any, Optional
from enum import Enum
import uuid


class JobStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


PIPELINE_STAGE_NAMES = [
    "Upload",
    "Parser",
    "Profiling",
    "Cleaning",
    "EDA",
    "Feature Engineering",
    "Training",
    "Evaluation",
    "Report",
]


class JobState:
    def __init__(self, job_id: str, dataset_name: str, user_id: str):
        self.job_id = job_id
        self.status: JobStatus = JobStatus.QUEUED
        self.dataset_name = dataset_name
        self.user_id = user_id
        self.current_stage = ""
        self.current_stage_index = 0
        self.total_stages = len(PIPELINE_STAGE_NAMES)
        self.progress = 0
        self.started_at = time.time()
        self.estimated_remaining = 0
        self.memory_usage = 0.0
        self.cpu_usage = 0.0
        self.rows_processed = 0
        self.rows_remaining = 0
        self.error: Optional[str] = None
        self.traceback: Optional[str] = None
        self.root_cause: Optional[str] = None
        self.suggested_fix: Optional[str] = None
        self.result: Optional[Dict[str, Any]] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "job_id": self.job_id,
            "status": self.status.value if isinstance(self.status, JobStatus) else self.status,
            "dataset_name": self.dataset_name,
            "current_stage": self.current_stage,
            "current_stage_index": self.current_stage_index,
            "total_stages": self.total_stages,
            "progress": self.progress,
            "estimated_remaining": self.estimated_remaining,
            "memory_usage": self.memory_usage,
            "cpu_usage": self.cpu_usage,
            "rows_processed": self.rows_processed,
            "rows_remaining": self.rows_remaining,
            "error": self.error,
            "traceback": self.traceback,
            "root_cause": self.root_cause,
            "suggested_fix": self.suggested_fix,
            "result": self.result,
        }


class JobManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._jobs: Dict[str, JobState] = {}
                    cls._instance._jobs_lock = threading.Lock()
        return cls._instance

    def create_job(self, dataset_name: str, user_id: str = "guest_user") -> str:
        job_id = str(uuid.uuid4())
        job = JobState(job_id=job_id, dataset_name=dataset_name, user_id=user_id)
        with self._jobs_lock:
            self._jobs[job_id] = job
        return job_id

    def get_job(self, job_id: str) -> Optional[JobState]:
        with self._jobs_lock:
            return self._jobs.get(job_id)

    def update_stage(self, job_id: str, stage_index: int, stage_name: str):
        with self._jobs_lock:
            job = self._jobs.get(job_id)
            if not job:
                return
            job.status = JobStatus.RUNNING
            job.current_stage = stage_name
            job.current_stage_index = stage_index
            job.progress = int((stage_index / job.total_stages) * 100)
            elapsed = time.time() - job.started_at
            if stage_index > 0:
                avg_per_stage = elapsed / stage_index
                remaining_stages = job.total_stages - stage_index
                job.estimated_remaining = int(avg_per_stage * remaining_stages)

    def complete_job(self, job_id: str, result: Dict[str, Any] = None):
        with self._jobs_lock:
            job = self._jobs.get(job_id)
            if not job:
                return
            job.status = JobStatus.COMPLETED
            job.progress = 100
            job.current_stage = "Complete"
            job.estimated_remaining = 0
            job.result = result

    def fail_job(self, job_id: str, error: str, traceback: str = None, root_cause: str = None, suggested_fix: str = None):
        with self._jobs_lock:
            job = self._jobs.get(job_id)
            if not job:
                return
            job.status = JobStatus.FAILED
            job.error = error
            job.traceback = traceback
            job.root_cause = root_cause
            job.suggested_fix = suggested_fix


job_manager = JobManager()
