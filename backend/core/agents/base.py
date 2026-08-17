from typing import Any, Dict, Optional, Generic, TypeVar
from pydantic import BaseModel, ValidationError
import time
import logging
import uuid
import traceback
from abc import ABC, abstractmethod
from core.engines.base import ProcessingEngine
from core.exceptions import PipelineException

# Configure basic logger for agents
logger = logging.getLogger("agentix_v2")

InputType = TypeVar("InputType", bound=BaseModel)
OutputType = TypeVar("OutputType", bound=BaseModel)

class BaseAgent(ABC, Generic[InputType, OutputType]):
    """
    Base class for all Agentix V2 Execution Agents.
    Enforces strict typing, validation, error handling, and lifecycle.
    """
    def __init__(self):
        self.agent_name = self.__class__.__name__

    @abstractmethod
    def validate(self, input_data: Any) -> InputType:
        """Validates raw input data against the Input schema."""
        pass

    @abstractmethod
    def execute(self, validated_data: InputType, engine: ProcessingEngine) -> OutputType:
        """Core execution logic of the agent."""
        pass

    @abstractmethod
    def cleanup(self) -> None:
        """Clean up resources after successful execution."""
        pass

    @abstractmethod
    def rollback(self) -> None:
        """Rollback state if execution fails."""
        pass

    def run(self, data: Any, engine: ProcessingEngine, job_id: str = None) -> Dict[str, Any]:
        """
        Orchestrates the lifecycle of a single agent execution.
        """
        job_id = job_id or str(uuid.uuid4())
        start_time = time.time()
        
        logger.info(f"[{self.agent_name}] Starting execution for Job ID: {job_id}")
        
        try:
            # 1. Validation
            try:
                validated_input = self.validate(data)
            except Exception as e:
                raise PipelineException(
                    stage=self.agent_name,
                    agent=self.agent_name,
                    dataset=data.get("dataset_name", "Unknown") if isinstance(data, dict) else "Unknown",
                    root_cause="Validation Error",
                    stack_trace=traceback.format_exc(),
                    suggested_fix="Check the input schema requirements.",
                    message=str(e)
                )
            
            # 2. Execution
            try:
                output = self.execute(validated_input, engine)
            except Exception as e:
                raise PipelineException(
                    stage=self.agent_name,
                    agent=self.agent_name,
                    dataset=getattr(validated_input, "dataset_name", "Unknown"),
                    root_cause=type(e).__name__,
                    stack_trace=traceback.format_exc(),
                    suggested_fix="Review the stack trace for the exact point of failure.",
                    message=str(e)
                )
            
            # 3. Cleanup
            self.cleanup()
            
            execution_time = time.time() - start_time
            logger.info(f"[{self.agent_name}] Execution successful for Job ID: {job_id} in {execution_time:.2f}s")
            
            # 4. Output Formatting
            return {
                "status": "success",
                "agent": self.agent_name,
                "job_id": job_id,
                "execution_time_sec": execution_time,
                "data": output.model_dump() if hasattr(output, 'model_dump') else output
            }
            
        except PipelineException:
            # Rollback if an exception occurred
            try:
                self.rollback()
            except Exception as rollback_e:
                logger.error(f"[{self.agent_name}] Rollback failed: {str(rollback_e)}")
            raise
        except Exception as generic_e:
            try:
                self.rollback()
            except Exception:
                pass
            raise PipelineException(
                stage=self.agent_name,
                agent=self.agent_name,
                dataset="Unknown",
                root_cause="Unexpected Error",
                stack_trace=traceback.format_exc(),
                suggested_fix="Check backend logs.",
                message=str(generic_e)
            )

