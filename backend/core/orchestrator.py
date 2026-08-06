import logging
import json
import psutil
import os
from typing import Dict, Any, List, Type
from sqlalchemy.orm import Session
from core.repositories.database import SessionLocal
from core.models.models import WorkflowRun, PipelineStage
from core.agents.base import BaseAgent
from core.agents.pipeline_agents import (
    UploadAgent, ParserAgent, ProfilingAgent, CleaningAgent, EDAAgent, FeatureEngineeringAgent,
    TrainingAgent, EvaluationAgent, ReportAgent
)
import uuid
import time

logger = logging.getLogger("agentix_v2")

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

    def start_pipeline(self, user_id: str, dataset_id: str = None) -> str:
        """Initializes a new pipeline run."""
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

    def _get_memory_usage(self) -> float:
        process = psutil.Process(os.getpid())
        return process.memory_info().rss / (1024 * 1024)

    def execute_stage(self, run_id: str, agent: BaseAgent, input_data: Any) -> Dict[str, Any]:
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
        
        # Execute agent
        result = agent.run(input_data, job_id=run_id)
        
        # Update stage state
        stage.execution_time = result.get("execution_time_sec", 0.0)
        stage.memory_usage_mb = self._get_memory_usage()
        
        if result["status"] == "success":
            stage.status = "completed"
            stage.output_data = json.dumps(result["data"])
            self.db.commit()
            return result["data"]
        else:
            stage.status = "failed"
            error_data = result.get("error", {})
            stage.errors = json.dumps(error_data)
            self.db.commit()
            
            # Mark workflow as failed
            run = self.db.query(WorkflowRun).filter_by(id=run_id).first()
            if run:
                run.status = "failed"
                self.db.commit()
                
            raise Exception(f"Stage {agent.agent_name} failed: {error_data.get('message')}")

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
        
        stages = self.db.query(PipelineStage).filter_by(run_id=run_id).order_by(PipelineStage.step_order).all()
        
        try:
            for stage in stages:
                agent_cls = agent_registry.get(stage.agent_name)
                if not agent_cls:
                    raise ValueError(f"Agent {stage.agent_name} not registered.")
                
                agent_instance = agent_cls()
                
                # If completed, we just propagate its output to the next stage
                if stage.status == "completed":
                    if stage.output_data:
                        # Depending on pipeline design, current_input might be accumulated or replaced
                        current_input = {**current_input, **json.loads(stage.output_data)}
                    continue
                    
                # Execute missing/failed stage
                stage_output = self.execute_stage(run_id, agent_instance, current_input)
                current_input = {**current_input, **stage_output}
                
            run.status = "completed"
            self.db.commit()
            return {"status": "success", "run_id": run_id}
            
        except Exception as e:
            logger.error(f"Pipeline {run_id} halted: {str(e)}")
            return {"status": "failed", "run_id": run_id, "error": str(e)}

    def run_full_pipeline(self, run_id: str, global_input: Any):
        """
        Executes the entire pipeline synchronously (meant to be run in a background thread).
        """
        logger.info(f"Starting full pipeline execution for Run ID: {run_id}")
        return self.resume_pipeline(run_id, self.AGENT_REGISTRY, global_input)

