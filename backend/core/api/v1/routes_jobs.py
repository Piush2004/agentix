from fastapi import APIRouter, HTTPException
from core.services.job_manager import job_manager

router = APIRouter()


@router.get("/{job_id}")
async def get_job_status(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job.to_dict()
