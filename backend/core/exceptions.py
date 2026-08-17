from typing import Optional, Dict, Any

class PipelineException(Exception):
    def __init__(self, stage: str, agent: str, dataset: str, root_cause: str, stack_trace: str, suggested_fix: str, message: str = ""):
        self.stage = stage
        self.agent = agent
        self.dataset = dataset
        self.root_cause = root_cause
        self.stack_trace = stack_trace
        self.suggested_fix = suggested_fix
        self.message = message
        super().__init__(self.message)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "stage": self.stage,
            "agent": self.agent,
            "dataset": self.dataset,
            "root_cause": self.root_cause,
            "stack_trace": self.stack_trace,
            "suggested_fix": self.suggested_fix,
            "message": self.message
        }
