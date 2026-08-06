from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from core.agents.base import BaseAgent
import pandas as pd
import numpy as np

class ProfilingInput(BaseModel):
    dataset_name: str
    file_path: Optional[str] = None
    user_id: Optional[str] = "guest_user"

class ProfilingOutput(BaseModel):
    rows: int
    cols: int
    missing: int
    duplicates: int
    outliers: int
    data_schema: Dict[str, str]
    full_profile: Dict[str, Any]

class ProfilingAgent(BaseAgent[ProfilingInput, ProfilingOutput]):
    def validate_input(self, data: Any) -> ProfilingInput:
        if isinstance(data, dict):
            return ProfilingInput(**data)
        elif isinstance(data, ProfilingInput):
            return data
        raise ValueError("Invalid input format for ProfilingAgent")

    def execute(self, validated_data: ProfilingInput) -> ProfilingOutput:
        from core.services.data_service import data_service
        from core.context import current_user_id
        
        current_user_id.set(validated_data.user_id)
        
        # In V2, we might pass file_path directly from UploadAgent in the pipeline state
        # But for backward compatibility with standalone calls, we use data_service.
        if validated_data.file_path:
            df = data_service.load_df_from_disk(validated_data.file_path)
        else:
            df = data_service.get_dataset(validated_data.dataset_name)
            
        if df is None:
            raise ValueError(f"Dataset {validated_data.dataset_name} not found")
            
        # Simplified memory-efficient profiling
        # Full EDA Agent handles deep correlations
        missing = int(df.isna().sum().sum())
        duplicates = int(df.duplicated().sum())
        rows, cols = df.shape
        
        # Schema detection
        schema_dict = {col: str(dtype) for col, dtype in df.dtypes.items()}
        
        # Basic profile payload
        profile = {
            "dataset_name": validated_data.dataset_name,
            "metadata_summary": {
                "Rows": rows,
                "Columns": cols,
                "Memory usage": int(df.memory_usage(deep=True).sum()),
                "Column names": list(df.columns),
                "Data types": schema_dict,
                "Null count": {col: int(val) for col, val in df.isna().sum().items()},
                "Duplicate count": duplicates,
                "Numeric columns": list(df.select_dtypes(include=[np.number]).columns),
                "Categorical columns": list(df.select_dtypes(exclude=[np.number]).columns)
            }
        }
        
        return ProfilingOutput(
            rows=rows,
            cols=cols,
            missing=missing,
            duplicates=duplicates,
            outliers=0, # Deeper analysis deferred to EDAAgent
            data_schema=schema_dict,
            full_profile=profile
        )
