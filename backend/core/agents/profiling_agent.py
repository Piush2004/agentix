from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from core.agents.base import BaseAgent
from core.engines.base import ProcessingEngine
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
    def validate(self, data: Any) -> ProfilingInput:
        if isinstance(data, dict):
            return ProfilingInput(**data)
        elif isinstance(data, ProfilingInput):
            return data
        raise ValueError("Invalid input format for ProfilingAgent")

    def execute(self, validated_data: ProfilingInput, engine: ProcessingEngine) -> ProfilingOutput:
        from core.services.data_service import data_service
        from core.context import current_user_id
        
        current_user_id.set(validated_data.user_id)
        
        if validated_data.file_path:
            df = engine.load_dataset(validated_data.file_path)
        else:
            dataset_info = data_service.get_dataset(validated_data.dataset_name)
            if not dataset_info or "parquet_path" not in dataset_info:
                raise ValueError(f"Dataset {validated_data.dataset_name} not found or parquet path missing")
            df = engine.load_dataset(dataset_info["parquet_path"])
            
        if df is None:
            raise ValueError(f"Dataset {validated_data.dataset_name} not found")
            
        df = engine.compute(df)
            
        missing = int(df.isna().sum().sum())
        duplicates = int(df.duplicated().sum())
        rows, cols = df.shape
        
        schema_dict = {col: str(dtype) for col, dtype in df.dtypes.items()}
        
        profile = {
            "dataset_name": validated_data.dataset_name,
            "metadata_summary": {
                "Rows": rows,
                "Columns": cols,
                "Memory usage": engine.get_memory_usage(df),
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
            outliers=0,
            data_schema=schema_dict,
            full_profile=profile
        )

    def cleanup(self) -> None:
        pass
        
    def rollback(self) -> None:
        pass
