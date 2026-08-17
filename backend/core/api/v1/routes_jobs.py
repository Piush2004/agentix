from fastapi import APIRouter, HTTPException
from core.repositories.database import SessionLocal
from core.models.models import WorkflowRun, PipelineStage, Dataset
import json

router = APIRouter()

@router.get("/{job_id}")
async def get_job_status(job_id: str):
    db = SessionLocal()
    try:
        run = db.query(WorkflowRun).filter_by(id=job_id).first()
        if not run:
            raise HTTPException(status_code=404, detail="Job not found")
            
        stages = db.query(PipelineStage).filter_by(run_id=job_id).order_by(PipelineStage.step_order).all()
        
        current_stage = "Starting..."
        current_stage_index = 0
        progress = 0
        total_stages = len(stages)
        error = None
        result = None
        
        # Calculate progress and find current stage
        completed_count = 0
        for i, stage in enumerate(stages):
            if stage.status == "completed":
                completed_count += 1
                if i == total_stages - 1:
                    current_stage = "Complete"
                    current_stage_index = total_stages
            elif stage.status == "running":
                current_stage = stage.agent_name
                current_stage_index = i
            elif stage.status == "failed":
                current_stage = stage.agent_name
                current_stage_index = i
                error = stage.errors
                
        progress = int((completed_count / max(1, total_stages)) * 100)

        if run.status == "completed":
            progress = 100
            current_stage = "Complete"
            current_stage_index = total_stages

        dataset_name = "Unknown"
        if run.dataset_id:
            dataset = db.query(Dataset).filter_by(id=run.dataset_id).first()
            if dataset:
                dataset_name = dataset.name

        if run.status == "completed":
            result = {
                stage.agent_name: json.loads(stage.output_data)
                for stage in stages
                if stage.status == "completed" and stage.output_data
            }

        return {
            "job_id": run.id,
            "status": run.status,
            "dataset_name": dataset_name,
            "current_stage": current_stage,
            "current_stage_index": current_stage_index,
            "total_stages": total_stages,
            "progress": progress,
            "estimated_remaining": (total_stages - current_stage_index) * 2, # Stub ETA
            "error": error,
            "result": result
        }
    finally:
        db.close()
