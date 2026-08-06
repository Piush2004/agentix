
from fastapi import APIRouter, File, UploadFile, HTTPException
from core.context import current_user_id
from core.services.job_manager import job_manager
from core.agents.pipeline_agents import (
    UploadAgent, ParserAgent, ProfilingAgent, CleaningAgent,
    EDAAgent, FeatureEngineeringAgent, TrainingAgent, EvaluationAgent, ReportAgent,
    PipelineInput
)
import os
import aiofiles
import uuid
import threading
import logging
import traceback
from pydantic import BaseModel
from fastapi import Form

logger = logging.getLogger("agentix_v2")
router = APIRouter()

TEMP_UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../data/temp")
os.makedirs(TEMP_UPLOAD_DIR, exist_ok=True)

def _run_pipeline_background(job_id: str, dataset_name: str, file_path: str, user_id: str):
    from core.context import current_user_id as ctx_user_id
    ctx_user_id.set(user_id)

    stage_runners = [
        ("Upload", UploadAgent),
        ("Parser", ParserAgent),
        ("Profiling", ProfilingAgent),
        ("Cleaning", CleaningAgent),
        ("EDA", EDAAgent),
        ("Feature Engineering", FeatureEngineeringAgent),
        ("Training", TrainingAgent),
        ("Evaluation", EvaluationAgent),
        ("Report", ReportAgent),
    ]

    accumulated = {}
    input_data = {"dataset_name": dataset_name, "file_path": file_path, "user_id": user_id}

    for idx, (stage_name, agent_cls) in enumerate(stage_runners):
        try:
            job_manager.update_stage(job_id, idx, stage_name)
            logger.info(f"[Job {job_id}] Stage: {stage_name}")

            agent = agent_cls()
            result = agent.run(input_data)

            if result["status"] == "success":
                accumulated[stage_name] = result["data"]
            else:
                error_msg = result.get("error", {}).get("message", "Unknown error")
                job_manager.fail_job(job_id, f"Stage '{stage_name}' failed: {error_msg}")
                return

        except Exception as e:
            tb = traceback.format_exc()
            logger.error(f"[Job {job_id}] Pipeline crashed at {stage_name}: {e}\n{tb}")
            job_manager.fail_job(
                job_id, 
                error=f"Exception in {stage_name}: {str(e)}", 
                traceback=tb, 
                root_cause=str(type(e).__name__), 
                suggested_fix="Check the logs for detailed stack trace."
            )
            return

    job_manager.complete_job(job_id, accumulated)
    logger.info(f"[Job {job_id}] Pipeline completed.")

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    user_id = current_user_id.get() or "guest_user"

    if not file.filename.endswith((".csv", ".xlsx", ".xls", ".parquet", ".json")):
        raise HTTPException(status_code=400, detail="Unsupported file format")

    temp_file_path = os.path.join(TEMP_UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")

    try:
        async with aiofiles.open(temp_file_path, "wb") as out_file:
            while content := await file.read(1024 * 1024):
                await out_file.write(content)

        job_id = job_manager.create_job(dataset_name=file.filename, user_id=user_id)

        pipeline_thread = threading.Thread(
            target=_run_pipeline_background,
            args=(job_id, file.filename, temp_file_path, user_id),
            daemon=True,
        )
        pipeline_thread.start()

        return {
            "job_id": job_id,
            "status": "queued",
            "dataset_name": file.filename,
            "message": "Dataset uploaded. Processing pipeline started.",
        }

    except Exception as e:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail={"error": "Upload initialization failed", "reason": str(e)})

class UploadInitReq(BaseModel):
    file_name: str
    total_chunks: int
    total_size: int

class UploadCompleteReq(BaseModel):
    upload_id: str
    file_name: str

@router.post("/upload/init")
async def upload_init(req: UploadInitReq):
    upload_id = str(uuid.uuid4())
    os.makedirs(os.path.join(TEMP_UPLOAD_DIR, upload_id), exist_ok=True)
    return {"upload_id": upload_id}

@router.post("/upload/chunk")
async def upload_chunk(chunk: UploadFile = File(...), upload_id: str = Form(...), chunk_index: int = Form(...)):
    chunk_path = os.path.join(TEMP_UPLOAD_DIR, upload_id, f"chunk_{chunk_index}")
    async with aiofiles.open(chunk_path, "wb") as out_file:
        content = await chunk.read()
        await out_file.write(content)
    return {"status": "success"}

@router.post("/upload/complete")
async def upload_complete(req: UploadCompleteReq):
    user_id = current_user_id.get() or "guest_user"
    upload_dir = os.path.join(TEMP_UPLOAD_DIR, req.upload_id)
    final_file_path = os.path.join(TEMP_UPLOAD_DIR, f"{req.upload_id}_{req.file_name}")
    
    # re-assemble chunks
    chunks = sorted(os.listdir(upload_dir), key=lambda x: int(x.split("_")[1]))
    with open(final_file_path, "wb") as out_file:
        for chunk_name in chunks:
            chunk_path = os.path.join(upload_dir, chunk_name)
            with open(chunk_path, "rb") as in_file:
                out_file.write(in_file.read())
            os.remove(chunk_path)
    os.rmdir(upload_dir)
    
    job_id = job_manager.create_job(dataset_name=req.file_name, user_id=user_id)
    pipeline_thread = threading.Thread(
        target=_run_pipeline_background,
        args=(job_id, req.file_name, final_file_path, user_id),
        daemon=True,
    )
    pipeline_thread.start()
    
    return {
        "job_id": job_id,
        "status": "queued",
        "dataset_name": req.file_name,
        "message": "Dataset uploaded. Processing pipeline started.",
    }
