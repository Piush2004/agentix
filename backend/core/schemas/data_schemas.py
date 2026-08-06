from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class UploadResponse(BaseModel):
    message: str
    dataset_name: str
    dataset_id: str
    rows: int
    columns: int
    status: str

class ProcessRequest(BaseModel):
    dataset_name: str
