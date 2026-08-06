from typing import Any, Dict, Optional, Generic, TypeVar
from pydantic import BaseModel, ValidationError
import time
import logging
import uuid
import traceback
from abc import ABC, abstractmethod

# Configure basic logger for agents
logger = logging.getLogger("agentix_v2")

InputType = TypeVar("InputType", bound=BaseModel)
OutputType = TypeVar("OutputType", bound=BaseModel)

class BaseAgent(ABC, Generic[InputType, OutputType]):
    """
    Base class for all Agentix V2 Execution Agents.
    Enforces strict typing, validation, error handling, and logging.
    """
    def __init__(self):
        self.agent_name = self.__class__.__name__

    @abstractmethod
    def validate_input(self, data: Any) -> InputType:
        """Validates raw input data against the Input schema."""
        pass

    @abstractmethod
    def execute(self, validated_data: InputType) -> OutputType:
        """Core execution logic of the agent."""
        pass

    def run(self, data: Any, job_id: str = None) -> Dict[str, Any]:
        """
        Orchestrates the lifecycle of a single agent execution.
        """
        job_id = job_id or str(uuid.uuid4())
        start_time = time.time()
        
        logger.info(f"[{self.agent_name}] Starting execution for Job ID: {job_id}")
        
        try:
            # 1. Validation
            validated_input = self.validate_input(data)
            
            # 2. Execution
            output = self.execute(validated_input)
            
            execution_time = time.time() - start_time
            logger.info(f"[{self.agent_name}] Execution successful for Job ID: {job_id} in {execution_time:.2f}s")
            
            # 3. Output Formatting
            return {
                "status": "success",
                "agent": self.agent_name,
                "job_id": job_id,
                "execution_time_sec": execution_time,
                "data": output.model_dump()
            }
            
        except ValidationError as ve:
            # Pydantic validation error handling
            execution_time = time.time() - start_time
            logger.error(f"[{self.agent_name}] Validation failed for Job ID: {job_id}")
            return self._handle_error("validation_error", str(ve), execution_time, job_id)
            
        except Exception as e:
            # General execution error handling
            execution_time = time.time() - start_time
            logger.error(f"[{self.agent_name}] Execution failed for Job ID: {job_id}. Error: {str(e)}")
            return self._handle_error("execution_error", str(e), execution_time, job_id, traceback.format_exc())

    def _handle_error(self, error_type: str, message: str, execution_time: float, job_id: str, stack_trace: str = None) -> Dict[str, Any]:
        """Formats the error response adhering to Phase 7 Error System."""
        import sys
        exc_type, exc_obj, exc_tb = sys.exc_info()
        file_name = exc_tb.tb_frame.f_code.co_filename if exc_tb else "Unknown"
        line_number = exc_tb.tb_lineno if exc_tb else -1
        function_name = exc_tb.tb_frame.f_code.co_name if exc_tb else "Unknown"
        
        error_payload = {
            "status": "error",
            "agent": self.agent_name,
            "job_id": job_id,
            "execution_time_sec": execution_time,
            "error": {
                "type": error_type,
                "message": message,
                "source_agent": self.agent_name,
                "file": file_name,
                "function": function_name,
                "line_number": line_number,
                "root_cause": message,
                "suggested_fix": "Check logs and validate inputs. Verify dependencies are running."
            }
        }
        if stack_trace:
            error_payload["error"]["stack_trace"] = stack_trace
            
        return error_payload
