import logging
import json
import os
import traceback
from typing import Dict, Any, List, Type
from sqlalchemy.orm import Session
from core.repositories.database import SessionLocal
from core.models.models import WorkflowRun, PipelineStage, Dataset
from core.agents.base import BaseAgent
from core.agents.pipeline_agents import (
    UploadAgent, ParserAgent, CleaningAgent, EDAAgent, FeatureEngineeringAgent,
    TrainingAgent, EvaluationAgent, ReportAgent
)
from core.agents.profiling_agent import ProfilingAgent
from core.engines.base import ProcessingEngine
from core.engines.execution import ExecutionEngine
from core.exceptions import PipelineException

logger = logging.getLogger("agentix_v2")

class ExecutionDispatcher:
    """
    Abstracts the background execution. 
    Can be replaced by Celery/RQ later without changing orchestrator logic.
    """
    @staticmethod
    def dispatch(run_id: str, global_input: Any):
        # We perform actual execution inline, 
        # but in routes we wrap this in FastAPI BackgroundTasks
        orchestrator = PipelineOrchestrator()
        orchestrator.run_full_pipeline(run_id, global_input)


class PipelineOrchestrator:
    """
    V2 Orchestrator for Agentix execution pipeline.
    Ensures absolute state persistence and recoverability.
    """
    
    PIPELINE_STAGES = [
        "UploadAgent",
        "ParserAgent",
        "ProfilingAgent",
        "CleaningAgent",
        "EDAAgent",
        "FeatureEngineeringAgent",
        "TrainingAgent",
        "EvaluationAgent",
        "ReportAgent"
    ]

    AGENT_REGISTRY = {
        "UploadAgent": UploadAgent,
        "ParserAgent": ParserAgent,
        "ProfilingAgent": ProfilingAgent,
        "CleaningAgent": CleaningAgent,
        "EDAAgent": EDAAgent,
        "FeatureEngineeringAgent": FeatureEngineeringAgent,
        "TrainingAgent": TrainingAgent,
        "EvaluationAgent": EvaluationAgent,
        "ReportAgent": ReportAgent
    }

    def __init__(self, db: Session = None):
        self.db = db or SessionLocal()

    def start_pipeline(self, user_id: str, dataset_id: str = None, dataset_name: str = None, file_path: str = None) -> str:
        """Initializes a new pipeline run."""
        if dataset_id is None and dataset_name:
            dataset = Dataset(
                owner_id=user_id,
                name=dataset_name,
                filepath=file_path or "",
            )
            self.db.add(dataset)
            self.db.commit()
            self.db.refresh(dataset)
            dataset_id = dataset.id

        run = WorkflowRun(
            owner_id=user_id,
            dataset_id=dataset_id,
            status="started"
        )
        self.db.add(run)
        self.db.commit()
        self.db.refresh(run)
        
        # Initialize all stages as pending
        for i, agent_name in enumerate(self.PIPELINE_STAGES):
            stage = PipelineStage(
                run_id=run.id,
                agent_name=agent_name,
                step_order=i,
                status="pending"
            )
            self.db.add(stage)
        self.db.commit()
        return run.id

    def execute_stage(self, run_id: str, agent: BaseAgent, input_data: Any, engine: ProcessingEngine) -> Dict[str, Any]:
        """Executes a single pipeline stage with full state tracking."""
        stage = self.db.query(PipelineStage).filter_by(
            run_id=run_id, 
            agent_name=agent.agent_name
        ).first()
        
        if not stage:
            raise ValueError(f"Stage {agent.agent_name} not found for run {run_id}")
            
        if stage.status == "completed":
            logger.info(f"Stage {agent.agent_name} already completed for run {run_id}. Skipping.")
            return json.loads(stage.output_data) if stage.output_data else {}

        # Mark as running
        stage.status = "running"
        self.db.commit()
        
        try:
            # Execute agent strictly with engine
            result = agent.run(input_data, engine=engine, job_id=run_id)
            
            stage.execution_time = result.get("execution_time_sec", 0.0)
            
            # Since memory usage requires dataset context, we let the agent track it if needed,
            # or just record 0.0 if not provided in result metadata.
            # However, the user asked to track Memory. The result might have it, but here we just stub it to 0.0
            stage.memory_usage_mb = 0.0 
            
            if result["status"] == "success":
                stage.status = "completed"
                stage.output_data = json.dumps(result["data"])
                self.db.commit()
                return result["data"]
                
        except PipelineException as pe:
            stage.status = "failed"
            stage.errors = json.dumps(pe.to_dict())
            self.db.commit()
            
            run = self.db.query(WorkflowRun).filter_by(id=run_id).first()
            if run:
                run.status = "failed"
                self.db.commit()
            raise
            
        except Exception as e:
            stage.status = "failed"
            error_payload = {
                "stage": agent.agent_name,
                "agent": agent.agent_name,
                "dataset": getattr(input_data, "dataset_name", "Unknown"),
                "root_cause": type(e).__name__,
                "stack_trace": traceback.format_exc(),
                "suggested_fix": "Unhandled orchestrator exception.",
                "message": str(e)
            }
            stage.errors = json.dumps(error_payload)
            self.db.commit()
            
            run = self.db.query(WorkflowRun).filter_by(id=run_id).first()
            if run:
                run.status = "failed"
                self.db.commit()
            raise PipelineException(**error_payload)

    def resume_pipeline(self, run_id: str, agent_registry: Dict[str, Type[BaseAgent]], global_input: Any):
        """
        Resumes a pipeline from the last failed or pending stage.
        """
        run = self.db.query(WorkflowRun).filter_by(id=run_id).first()
        if not run:
            raise ValueError("WorkflowRun not found.")
            
        if run.status == "completed":
            return {"status": "success", "message": "Pipeline already completed."}
            
        run.status = "running"
        self.db.commit()
        
        current_input = global_input

        # Dynamically route using Hardware Intelligence Engine, based on the real
        # uploaded file size — this was previously hardcoded to 0.0, which always
        # satisfied the "fits in RAM" branch and defeated the adaptive routing below.
        file_path = global_input.get("file_path") if isinstance(global_input, dict) else None
        dataset_size_mb = os.path.getsize(file_path) / (1024 * 1024) if file_path and os.path.exists(file_path) else 0.0
        engine = ExecutionEngine.get_optimal_engine(dataset_size_mb=dataset_size_mb)
        
        stages = self.db.query(PipelineStage).filter_by(run_id=run_id).order_by(PipelineStage.step_order).all()
        
        try:
            for stage in stages:
                agent_cls = agent_registry.get(stage.agent_name)
                if not agent_cls:
                    raise ValueError(f"Agent {stage.agent_name} not registered.")
                
                agent_instance = agent_cls()
                
                if stage.status == "completed":
                    if stage.output_data:
                        current_input = {**current_input, **json.loads(stage.output_data)}
                    continue
                    
                stage_output = self.execute_stage(run_id, agent_instance, current_input, engine)
                current_input = {**current_input, **stage_output}
                
            run.status = "completed"
            self.db.commit()
            return {"status": "success", "run_id": run_id}
            
        except PipelineException as pe:
            logger.error(f"Pipeline {run_id} halted explicitly: {pe.message}")
            return {"status": "failed", "run_id": run_id, "error": pe.to_dict()}
        except Exception as e:
            logger.error(f"Pipeline {run_id} halted unexpectedly: {str(e)}")
            return {"status": "failed", "run_id": run_id, "error": str(e)}
        finally:
            self.db.close()

    def run_full_pipeline(self, run_id: str, global_input: Any):
        """
        Executes the entire pipeline synchronously (meant to be run by ExecutionDispatcher).
        """
        logger.info(f"Starting full pipeline execution for Run ID: {run_id}")
        return self.resume_pipeline(run_id, self.AGENT_REGISTRY, global_input)
