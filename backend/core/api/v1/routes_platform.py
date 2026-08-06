from fastapi import APIRouter, HTTPException
from typing import Optional
from core.schemas.api_schemas import DatasetRequest, ChatRequest, BaseResponse, PredictRequest
from core.agents.profiling_agent import ProfilingAgent, ProfilingInput
from core.orchestrator import PipelineOrchestrator
from core.context import current_user_id
import logging

logger = logging.getLogger("agentix_v2")
router = APIRouter()
orchestrator = PipelineOrchestrator()

@router.post("/profile", response_model=BaseResponse)
async def profile_endpoint(req: DatasetRequest):
    user_id = current_user_id.get() or "guest_user"
    try:
        run_id = orchestrator.start_pipeline(user_id=user_id)
        agent = ProfilingAgent()
        input_data = ProfilingInput(dataset_name=req.dataset_name, user_id=user_id)
        
        output = orchestrator.execute_stage(run_id, agent, input_data)
        
        return BaseResponse(status="success", message="OK", data=output)
    except Exception as e:
        logger.error(f"Error in profile: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))

# STUBS for other endpoints to prevent 404s while refactoring
@router.post("/clean", response_model=BaseResponse)
async def clean_endpoint(req: DatasetRequest): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.post("/feature-engineering", response_model=BaseResponse)
async def fe_endpoint(req: DatasetRequest): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.get("/eda", response_model=BaseResponse)
async def eda_endpoint(dataset_name: str): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.post("/predict", response_model=BaseResponse)
async def predict_endpoint(req: PredictRequest): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.get("/xai", response_model=BaseResponse)
async def xai_endpoint(dataset_name: str): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.get("/insights", response_model=BaseResponse)
async def insights_endpoint(dataset_name: str): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.get("/recommendations", response_model=BaseResponse)
async def recommendations_endpoint(dataset_name: str): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.get("/reports", response_model=BaseResponse)
async def reports_endpoint(dataset_name: str): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.post("/chat", response_model=BaseResponse)
async def chat_endpoint(req: ChatRequest): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.get("/mlops", response_model=BaseResponse)
async def mlops_endpoint(): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

from fastapi import BackgroundTasks

@router.post("/start-workflow", response_model=BaseResponse)
async def start_workflow_endpoint(req: DatasetRequest, background_tasks: BackgroundTasks): 
    user_id = current_user_id.get() or "guest_user"
    try:
        run_id = orchestrator.start_pipeline(user_id=user_id)
        # Mark UploadAgent and ProfilingAgent as already done if starting from middle
        # But for full workflow, we just run the pipeline. 
        # Pass the dataset name as input
        global_input = {"dataset_name": req.dataset_name}
        
        background_tasks.add_task(orchestrator.run_full_pipeline, run_id, global_input)
        
        return BaseResponse(status="success", message="Workflow started in background.", data={"run_id": run_id})
    except Exception as e:
        logger.error(f"Error starting workflow: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/workflow-status", response_model=BaseResponse)
async def workflow_status(run_id: str):
    from core.repositories.database import SessionLocal
    from core.models.models import WorkflowRun, PipelineStage
    db = SessionLocal()
    try:
        run = db.query(WorkflowRun).filter_by(id=run_id).first()
        if not run:
            raise HTTPException(status_code=404, detail="Run not found")
            
        stages = db.query(PipelineStage).filter_by(run_id=run_id).order_by(PipelineStage.step_order).all()
        
        stages_data = []
        for stage in stages:
            stages_data.append({
                "agent_name": stage.agent_name,
                "status": stage.status,
                "execution_time_sec": stage.execution_time,
                "memory_usage_mb": stage.memory_usage_mb,
                "errors": stage.errors,
                "step_order": stage.step_order
            })
            
        data = {
            "run_id": run.id,
            "overall_status": run.status,
            "execution_time_total": run.execution_time,
            "stages": stages_data
        }
        return BaseResponse(status="success", message="OK", data=data)
    finally:
        db.close()

@router.get("/dashboard-metrics", response_model=BaseResponse)
async def dashboard_metrics_endpoint(): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.post("/demo/load", response_model=BaseResponse)
async def load_demo_endpoint(dataset_type: str):
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.get("/system-health", response_model=BaseResponse)
async def system_health_endpoint(): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.get("/model-registry", response_model=BaseResponse)
async def model_registry_endpoint(): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.get("/experiment-runs", response_model=BaseResponse)
async def experiment_runs_endpoint(dataset_name: Optional[str] = None): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.get("/dataset-versions", response_model=BaseResponse)
async def dataset_versions_endpoint(dataset_name: str): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.post("/dataset-versions/rollback", response_model=BaseResponse)
async def rollback_dataset_version_endpoint(req: DatasetRequest, version: int): 
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={})

@router.get("/automl", response_model=BaseResponse)
async def automl_endpoint(dataset_name: str):
    return BaseResponse(status="success", message="Not Implemented Yet V2", data={"leaderboard": []})

@router.get("/recent-activity", response_model=BaseResponse)
async def recent_activity_endpoint():
    return BaseResponse(status="success", message="Not Implemented Yet V2", data=[])

