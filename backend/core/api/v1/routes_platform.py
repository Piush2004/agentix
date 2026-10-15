import json
import logging
import os
import shutil
from typing import Optional, Any, Dict

from fastapi import APIRouter, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from core.schemas.api_schemas import DatasetRequest, ChatRequest, BaseResponse, PredictRequest
from core.agents.profiling_agent import ProfilingAgent, ProfilingInput
from core.orchestrator import PipelineOrchestrator
from core.context import current_user_id
from core.repositories.database import SessionLocal
from core.models.models import WorkflowRun, PipelineStage, Dataset
from core.hardware.detector import HardwareDetector
from core.hardware.models import ModelRegistry
from core.engines.execution import ExecutionEngine
from core.services.llm_service import generate as llm_generate, LLMUnavailableError

logger = logging.getLogger("agentix_v2")
router = APIRouter()
orchestrator = PipelineOrchestrator()


# ---------------------------------------------------------------------------
# Shared helpers: pull real, persisted pipeline results out of the DB instead
# of fabricating data. A dataset can have multiple WorkflowRuns (reprocessed,
# retried); we always read the most recent one.
# ---------------------------------------------------------------------------

def _latest_dataset_and_run(db: Session, dataset_name: str):
    dataset = (
        db.query(Dataset)
        .filter_by(name=dataset_name)
        .order_by(Dataset.created_at.desc())
        .first()
    )
    if not dataset:
        return None, None
    run = (
        db.query(WorkflowRun)
        .filter_by(dataset_id=dataset.id)
        .order_by(WorkflowRun.created_at.desc())
        .first()
    )
    return dataset, run


def _stage_result(db: Session, run_id: str, agent_name: str) -> Optional[Dict[str, Any]]:
    if not run_id:
        return None
    stage = (
        db.query(PipelineStage)
        .filter_by(run_id=run_id, agent_name=agent_name, status="completed")
        .first()
    )
    if not stage or not stage.output_data:
        return None
    payload = json.loads(stage.output_data)
    return payload.get("result", payload)


@router.post("/profile", response_model=BaseResponse)
async def profile_endpoint(req: DatasetRequest):
    # Bug fix: this endpoint used to unconditionally call orchestrator.start_pipeline()
    # + re-run ProfilingAgent live against data_service's in-memory dict, every time it
    # was hit. Two real problems resulted: (1) data_service is keyed only by dataset_name,
    # so once the full pipeline had run past Profiling (Cleaning/FeatureEngineering
    # overwrite the same key), a live re-profile after that point returned stats for the
    # *transformed* data (e.g. one-hot-encoded column count, post-imputation zero missing)
    # rather than the raw upload — while still being displayed as the dataset's raw
    # Overview. (2) start_pipeline() created a brand new WorkflowRun with no dataset_id
    # every single call, which was never marked completed/failed — the source of the
    # orphaned WorkflowRun rows stuck at status="started" found in the database.
    # Fix: prefer the already-persisted ProfilingAgent result from the dataset's latest
    # completed run (same pattern as /eda, /xai, /insights below), and only fall back to
    # a live single-stage profile when no pipeline has been run for this dataset yet.
    db = SessionLocal()
    try:
        _, run = _latest_dataset_and_run(db, req.dataset_name)
        persisted = _stage_result(db, run.id if run else None, "ProfilingAgent")
        if persisted is not None:
            return BaseResponse(status="success", message="OK", data=persisted)
    finally:
        db.close()

    user_id = current_user_id.get() or "guest_user"
    try:
        run_id = orchestrator.start_pipeline(user_id=user_id)
        agent = ProfilingAgent()
        input_data = ProfilingInput(dataset_name=req.dataset_name, user_id=user_id)
        engine = ExecutionEngine.get_optimal_engine(dataset_size_mb=0.0)
        output = orchestrator.execute_stage(run_id, agent, input_data, engine)
        return BaseResponse(status="success", message="OK", data=output)
    except Exception as e:
        logger.error(f"Error in profile: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))


# `/clean` and `/feature-engineering` used to be no-op stubs that claimed
# "success" without doing anything. Real cleaning/feature-engineering already
# runs as part of the full 9-stage pipeline (`POST /start-workflow`); these
# standalone endpoints have no frontend caller and would need their own
# parquet/session bookkeeping to run a single stage in isolation safely, so
# rather than fake success we say plainly that they're not available.
@router.post("/clean", response_model=BaseResponse)
async def clean_endpoint(req: DatasetRequest):
    raise HTTPException(
        status_code=501,
        detail="Standalone cleaning is not available; cleaning runs automatically as part of the full pipeline (start-workflow).",
    )


@router.post("/feature-engineering", response_model=BaseResponse)
async def fe_endpoint(req: DatasetRequest):
    raise HTTPException(
        status_code=501,
        detail="Standalone feature engineering is not available; it runs automatically as part of the full pipeline (start-workflow).",
    )


@router.get("/eda", response_model=BaseResponse)
async def eda_endpoint(dataset_name: str):
    db = SessionLocal()
    try:
        _, run = _latest_dataset_and_run(db, dataset_name)
        result = _stage_result(db, run.id if run else None, "EDAAgent")
        if result is None:
            return BaseResponse(status="success", message="No completed EDA run found for this dataset.", data=None)
        return BaseResponse(status="success", message="OK", data=result)
    finally:
        db.close()


def _leaderboard_from_stages(db: Session, run_id: Optional[str]) -> Optional[Dict[str, Any]]:
    training = _stage_result(db, run_id, "TrainingAgent")
    evaluation = _stage_result(db, run_id, "EvaluationAgent")
    if training is None:
        return None

    problem_type = training.get("problem_type")
    metrics = evaluation or {}
    if problem_type == "regression":
        score = metrics.get("r2")
    else:
        score = metrics.get("accuracy")

    leaderboard_row = {
        "model": training.get("model_type", training.get("model_id", "Model")),
        "score": score,
        **metrics,
        "feature_importances": training.get("feature_importances", {}),
    }

    return {
        "problem_type": problem_type,
        "target": training.get("target"),
        "best_model": training.get("model_type", training.get("model_id")),
        "leaderboard": [leaderboard_row],
    }


@router.post("/predict", response_model=BaseResponse)
async def predict_endpoint(req: PredictRequest):
    dataset_name = getattr(req, "dataset_name", None)
    db = SessionLocal()
    try:
        _, run = _latest_dataset_and_run(db, dataset_name) if dataset_name else (None, None)
        data = _leaderboard_from_stages(db, run.id if run else None)
        if data is None:
            return BaseResponse(status="success", message="No trained model found for this dataset yet.", data=None)
        return BaseResponse(status="success", message="OK", data=data)
    finally:
        db.close()


@router.get("/automl", response_model=BaseResponse)
async def automl_endpoint(dataset_name: str):
    # AutoML today trains a single real model (SGDClassifier/SGDRegressor) via
    # the pipeline rather than searching multiple candidates, so this reuses
    # the same real training/evaluation result instead of returning a fake
    # multi-model leaderboard.
    db = SessionLocal()
    try:
        _, run = _latest_dataset_and_run(db, dataset_name)
        data = _leaderboard_from_stages(db, run.id if run else None)
        if data is None:
            return BaseResponse(status="success", message="No trained model found for this dataset yet.", data={"leaderboard": []})
        return BaseResponse(status="success", message="OK", data=data)
    finally:
        db.close()


@router.get("/xai", response_model=BaseResponse)
async def xai_endpoint(dataset_name: str):
    db = SessionLocal()
    try:
        _, run = _latest_dataset_and_run(db, dataset_name)
        training = _stage_result(db, run.id if run else None, "TrainingAgent")
        if training is None:
            return BaseResponse(status="success", message="No trained model found for this dataset yet.", data=None)

        importances: Dict[str, float] = training.get("feature_importances", {})
        top_drivers = list(importances.keys())[:5]
        dominant_feature = top_drivers[0] if top_drivers else None

        data = {
            # Real linear-model coefficient magnitudes, not a SHAP waterfall -
            # this project has no SHAP/explainability library installed, so we
            # surface what's actually computable (coefficients) rather than
            # fabricate SHAP-shaped output.
            "method": "linear_model_coefficients",
            "top_drivers": top_drivers,
            "dominant_feature": dominant_feature,
            "importances": importances,
        }
        return BaseResponse(status="success", message="OK", data=data)
    finally:
        db.close()


def _ollama_model_or_none() -> Optional[str]:
    provider = ExecutionEngine.select_llm_provider()
    if provider.get("provider") == "ollama":
        return provider.get("model")
    return None


@router.get("/insights", response_model=BaseResponse)
async def insights_endpoint(dataset_name: str):
    db = SessionLocal()
    try:
        _, run = _latest_dataset_and_run(db, dataset_name)
        eda = _stage_result(db, run.id if run else None, "EDAAgent") or {}
        training = _stage_result(db, run.id if run else None, "TrainingAgent") or {}
        evaluation = _stage_result(db, run.id if run else None, "EvaluationAgent") or {}

        if not eda and not evaluation:
            return BaseResponse(status="success", message="No completed analysis found for this dataset yet.", data=None)

        model = _ollama_model_or_none()
        if model:
            context = {"eda_statistics": eda.get("statistics", {}), "training": training, "evaluation": evaluation}
            prompt = (
                f"You are a data analyst. Based on this real pipeline output for dataset '{dataset_name}', "
                f"write 3 short, concrete insight bullet points (no more than 20 words each), grounded only in "
                f"the numbers given, no invented statistics:\n{json.dumps(context, default=str)}"
            )
            try:
                text = llm_generate(prompt, model)
                insights = [line.strip("-* ").strip() for line in text.splitlines() if line.strip()][:5]
                return BaseResponse(status="success", message="OK", data={"insights": insights, "source": "ollama", "model": model})
            except LLMUnavailableError as e:
                logger.warning(f"Insights LLM call failed, falling back to rule-based: {e}")

        # Deterministic fallback grounded in real numbers, no LLM required.
        insights = []
        stats = eda.get("statistics", {})
        if stats:
            col, s = max(stats.items(), key=lambda kv: abs(kv[1].get("skew", 0)))
            insights.append(f"'{col}' is the most skewed numeric column (skew={s.get('skew'):.2f}).")
        if evaluation.get("accuracy") is not None:
            insights.append(f"The trained {training.get('model_type', 'model')} reached {evaluation['accuracy']*100:.1f}% accuracy on held-out data.")
        if evaluation.get("r2") is not None:
            insights.append(f"The trained {training.get('model_type', 'model')} reached an R² of {evaluation['r2']:.3f} on held-out data.")
        if not insights:
            insights.append("Not enough completed pipeline data yet to generate insights.")
        return BaseResponse(status="success", message="OK", data={"insights": insights, "source": "rule-based"})
    finally:
        db.close()


@router.get("/recommendations", response_model=BaseResponse)
async def recommendations_endpoint(dataset_name: str):
    db = SessionLocal()
    try:
        _, run = _latest_dataset_and_run(db, dataset_name)
        evaluation = _stage_result(db, run.id if run else None, "EvaluationAgent")
        cleaning = _stage_result(db, run.id if run else None, "CleaningAgent")

        if evaluation is None and cleaning is None:
            return BaseResponse(status="success", message="No completed analysis found for this dataset yet.", data=None)

        actions = []
        if cleaning and cleaning.get("imputation"):
            n_imputed = len(cleaning["imputation"])
            actions.append(f"{n_imputed} column(s) had missing values imputed; verify the imputation reasons match domain expectations.")
        if evaluation and evaluation.get("accuracy") is not None and evaluation["accuracy"] < 0.7:
            actions.append("Model accuracy is below 70% — consider adding more informative features or collecting more data.")
        if evaluation and evaluation.get("r2") is not None and evaluation["r2"] < 0.3:
            actions.append("R² is low — the current features may not explain much of the target's variance.")
        if not actions:
            actions.append("No specific issues detected from the completed pipeline run.")
        return BaseResponse(status="success", message="OK", data={"actions": actions})
    finally:
        db.close()


@router.get("/reports", response_model=BaseResponse)
async def reports_endpoint(dataset_name: str):
    db = SessionLocal()
    try:
        _, run = _latest_dataset_and_run(db, dataset_name)
        result = _stage_result(db, run.id if run else None, "ReportAgent")
        if result is None:
            return BaseResponse(status="success", message="No completed report found for this dataset yet.", data=None)
        return BaseResponse(status="success", message="OK", data=result)
    finally:
        db.close()


@router.post("/chat", response_model=BaseResponse)
async def chat_endpoint(req: ChatRequest):
    query = getattr(req, "query", "")
    dataset_name = getattr(req, "dataset_name", None)

    context_blob = ""
    if dataset_name:
        db = SessionLocal()
        try:
            _, run = _latest_dataset_and_run(db, dataset_name)
            if run:
                eda = _stage_result(db, run.id, "EDAAgent") or {}
                evaluation = _stage_result(db, run.id, "EvaluationAgent") or {}
                training = _stage_result(db, run.id, "TrainingAgent") or {}
                context_blob = json.dumps(
                    {"eda_statistics": eda.get("statistics", {}), "training": training, "evaluation": evaluation},
                    default=str,
                )
        finally:
            db.close()

    model = _ollama_model_or_none()
    if not model:
        return BaseResponse(
            status="success",
            message="AI chat unavailable",
            data={"response": "No local AI model is currently available. Start Ollama with a pulled model to enable chat."},
        )

    prompt = (
        "You are Agentix's data analyst assistant. Answer the user's question using ONLY the real pipeline "
        f"data given below; if the data doesn't cover the question, say so honestly instead of guessing.\n"
        f"Dataset context: {context_blob or 'No pipeline results available for this dataset yet.'}\n"
        f"User question: {query}"
    )
    try:
        text = llm_generate(prompt, model)
        return BaseResponse(status="success", message="OK", data={"response": text, "model": model})
    except LLMUnavailableError as e:
        return BaseResponse(
            status="success",
            message="AI chat unavailable",
            data={"response": f"The local AI model is unavailable right now ({e})."},
        )


@router.get("/mlops", response_model=BaseResponse)
async def mlops_endpoint():
    # No real experiment-tracking/drift-detection/deployment system exists in
    # this codebase yet - returning fake "Healthy"/drift numbers here would be
    # exactly the fabricated-success pattern this audit is meant to remove.
    raise HTTPException(status_code=501, detail="MLOps monitoring (drift detection, deployment tracking) is not implemented yet.")


@router.post("/start-workflow", response_model=BaseResponse)
async def start_workflow_endpoint(req: DatasetRequest, background_tasks: BackgroundTasks):
    user_id = current_user_id.get() or "guest_user"
    try:
        run_id = orchestrator.start_pipeline(user_id=user_id)
        global_input = {"dataset_name": req.dataset_name}
        background_tasks.add_task(orchestrator.run_full_pipeline, run_id, global_input)
        return BaseResponse(status="success", message="Workflow started in background.", data={"run_id": run_id})
    except Exception as e:
        logger.error(f"Error starting workflow: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/workflow-status", response_model=BaseResponse)
async def workflow_status(run_id: str):
    db = SessionLocal()
    try:
        run = db.query(WorkflowRun).filter_by(id=run_id).first()
        if not run:
            raise HTTPException(status_code=404, detail="Run not found")

        stages = db.query(PipelineStage).filter_by(run_id=run_id).order_by(PipelineStage.step_order).all()
        stages_data = [
            {
                "agent_name": stage.agent_name,
                "status": stage.status,
                "execution_time_sec": stage.execution_time,
                "memory_usage_mb": stage.memory_usage_mb,
                "errors": stage.errors,
                "step_order": stage.step_order,
            }
            for stage in stages
        ]
        data = {
            "run_id": run.id,
            "overall_status": run.status,
            "execution_time_total": run.execution_time,
            "stages": stages_data,
        }
        return BaseResponse(status="success", message="OK", data=data)
    finally:
        db.close()


@router.get("/dashboard-metrics", response_model=BaseResponse)
async def dashboard_metrics_endpoint():
    db = SessionLocal()
    try:
        latest_run = db.query(WorkflowRun).order_by(WorkflowRun.created_at.desc()).first()
        active_dataset = None
        best_model = None
        model_accuracy = None
        workflow_state = "Idle"

        if latest_run:
            workflow_state = {
                "completed": "Completed",
                "failed": "Failed",
                "running": "Processing",
                "started": "Processing",
            }.get(latest_run.status, latest_run.status)

            if latest_run.dataset_id:
                dataset = db.query(Dataset).filter_by(id=latest_run.dataset_id).first()
                active_dataset = dataset.name if dataset else None

            training = _stage_result(db, latest_run.id, "TrainingAgent")
            evaluation = _stage_result(db, latest_run.id, "EvaluationAgent")
            if training:
                best_model = training.get("model_type") or training.get("model_id")
            if evaluation:
                model_accuracy = evaluation.get("accuracy", evaluation.get("r2"))

        registry = ModelRegistry.get_registry()

        # Real per-stage progress for the latest run, so the dashboard's
        # "Current Workflow Progress" bar reflects the actual pipeline instead
        # of the previously-hardcoded all-"Completed" fallback the frontend
        # fell back to on every load (the old /workflow-status call required a
        # run_id the frontend never had, so it 422'd and silently kept the
        # fake data every single time).
        stages_out = []
        if latest_run:
            stages = (
                db.query(PipelineStage)
                .filter_by(run_id=latest_run.id)
                .order_by(PipelineStage.step_order)
                .all()
            )
            stages_out = [
                {
                    "agent_name": stage.agent_name,
                    "status": stage.status,
                    "duration": stage.execution_time,
                }
                for stage in stages
            ]

        data = {
            "active_dataset": active_dataset,
            "best_model": best_model,
            "model_accuracy": model_accuracy,
            "workflow_state": workflow_state,
            "stages": stages_out,
            "ollama_status": "Online" if registry["has_local_llm"] else "Offline",
            "gemini_status": "Online" if registry["gemini_available"] else "Offline",
        }
        return BaseResponse(status="success", message="OK", data=data)
    finally:
        db.close()


@router.post("/demo/load", response_model=BaseResponse)
async def load_demo_endpoint(dataset_type: str):
    raise HTTPException(status_code=501, detail="No bundled demo dataset is available yet.")


@router.get("/system-health", response_model=BaseResponse)
async def system_health_endpoint():
    hardware = HardwareDetector.scan()
    registry = ModelRegistry.get_registry()
    data = {
        **hardware,
        "ollama": {
            "online": registry["has_local_llm"],
            "models": registry["local_ollama_models"],
        },
        "gemini_configured": registry["gemini_available"],
    }
    return BaseResponse(status="success", message="OK", data=data)


@router.get("/storage", response_model=BaseResponse)
async def storage_endpoint():
    """Real disk usage for the uploaded-dataset directory and the volume it
    lives on. Replaces a frontend call to an endpoint that never existed."""
    upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../data/temp")
    used_by_datasets_bytes = 0
    if os.path.isdir(upload_dir):
        for root, _dirs, files in os.walk(upload_dir):
            for name in files:
                try:
                    used_by_datasets_bytes += os.path.getsize(os.path.join(root, name))
                except OSError:
                    pass
    disk_total, _disk_used, disk_free = shutil.disk_usage(upload_dir if os.path.isdir(upload_dir) else ".")
    return BaseResponse(
        status="success",
        message="OK",
        data={
            "used_gb": round(used_by_datasets_bytes / (1024 ** 3), 2),
            "total_gb": round(disk_total / (1024 ** 3), 2),
            "free_gb": round(disk_free / (1024 ** 3), 2),
        },
    )


@router.get("/model-registry", response_model=BaseResponse)
async def model_registry_endpoint():
    return BaseResponse(status="success", message="OK", data=ModelRegistry.get_registry())


@router.get("/experiment-runs", response_model=BaseResponse)
async def experiment_runs_endpoint(dataset_name: Optional[str] = None):
    db = SessionLocal()
    try:
        query = db.query(WorkflowRun)
        if dataset_name:
            dataset = db.query(Dataset).filter_by(name=dataset_name).order_by(Dataset.created_at.desc()).first()
            if not dataset:
                return BaseResponse(status="success", message="OK", data=[])
            query = query.filter_by(dataset_id=dataset.id)
        runs = query.order_by(WorkflowRun.created_at.desc()).limit(50).all()

        data = []
        for run in runs:
            evaluation = _stage_result(db, run.id, "EvaluationAgent")
            data.append({
                "run_id": run.id,
                "status": run.status,
                "created_at": run.created_at.isoformat(),
                "execution_time": run.execution_time,
                "metrics": evaluation,
            })
        return BaseResponse(status="success", message="OK", data=data)
    finally:
        db.close()


@router.get("/dataset-versions", response_model=BaseResponse)
async def dataset_versions_endpoint(dataset_name: str):
    # There is no dataset-versioning system in this codebase - each pipeline
    # run overwrites the same parquet path rather than keeping history, so
    # there is nothing real to report here yet.
    raise HTTPException(status_code=501, detail="Dataset versioning is not implemented yet.")


@router.post("/dataset-versions/rollback", response_model=BaseResponse)
async def rollback_dataset_version_endpoint(req: DatasetRequest, version: int):
    raise HTTPException(status_code=501, detail="Dataset versioning is not implemented yet.")


@router.get("/benchmark-stats", response_model=BaseResponse)
async def benchmark_stats_endpoint():
    # Real counts from the database - the frontend previously showed a
    # hardcoded 142/4890/892 whenever this call failed (it always failed:
    # the route didn't exist here at all, and the frontend proxy pointed at
    # the wrong port). "strategy_reasonings" has no dedicated concept in
    # this codebase yet, so it's mapped to completed pipeline stages (each
    # one is a real executed processing/reasoning step) rather than invented.
    db = SessionLocal()
    try:
        total_datasets = db.query(Dataset).count()
        total_experiments = db.query(WorkflowRun).count()
        total_strategy_reasonings = db.query(PipelineStage).filter_by(status="completed").count()

        top_runs = (
            db.query(WorkflowRun)
            .filter(WorkflowRun.status == "completed")
            .order_by(WorkflowRun.created_at.desc())
            .limit(20)
            .all()
        )
        scored = []
        for run in top_runs:
            training = _stage_result(db, run.id, "TrainingAgent")
            evaluation = _stage_result(db, run.id, "EvaluationAgent")
            if not training or not evaluation:
                continue
            score = evaluation.get("accuracy", evaluation.get("r2"))
            if score is None:
                continue
            dataset = db.query(Dataset).filter_by(id=run.dataset_id).first() if run.dataset_id else None
            scored.append({
                "dataset": dataset.name if dataset else "dataset",
                "model": training.get("model_type", "Model"),
                "cv_score": score,
            })
        top_experiments = sorted(scored, key=lambda e: e["cv_score"], reverse=True)[:4]

        data = {
            "total_benchmark_datasets": total_datasets,
            "total_experiments": total_experiments,
            "total_strategy_reasonings": total_strategy_reasonings,
            "top_experiments": top_experiments,
        }
        return BaseResponse(status="success", message="OK", data=data)
    finally:
        db.close()


@router.get("/recent-activity", response_model=BaseResponse)
async def recent_activity_endpoint():
    db = SessionLocal()
    try:
        runs = db.query(WorkflowRun).order_by(WorkflowRun.created_at.desc()).limit(10).all()
        data = []
        for run in runs:
            dataset = db.query(Dataset).filter_by(id=run.dataset_id).first() if run.dataset_id else None
            name = dataset.name if dataset else "dataset"
            if run.status == "completed":
                action = f"Finished processing '{name}'"
            elif run.status == "failed":
                action = f"Failed while processing '{name}'"
            else:
                action = f"Started processing '{name}'"
            data.append({"id": run.id, "action": action, "createdAt": run.created_at.isoformat()})
        return BaseResponse(status="success", message="OK", data=data)
    finally:
        db.close()
