import os
import aiofiles
import uuid
import logging
import csv
from pydantic import BaseModel
from fastapi import APIRouter, File, UploadFile, HTTPException, Form, BackgroundTasks
from core.context import current_user_id
from core.orchestrator import PipelineOrchestrator, ExecutionDispatcher

logger = logging.getLogger("agentix_v2")
router = APIRouter()

TEMP_UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../data/temp")
os.makedirs(TEMP_UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".json"}
MAX_FILE_SIZE_MB = 500
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
MAX_COLUMNS = 500
MAX_ROWS = 2000000 # 2 million rows limit

class UploadInitReq(BaseModel):
    file_name: str
    total_chunks: int
    total_size: int

class UploadCompleteReq(BaseModel):
    upload_id: str
    file_name: str

def sanitize_filename(filename: str) -> str:
    import re
    # Keep alphanumeric, dot, underscore, dash
    filename = os.path.basename(filename)
    return re.sub(r'[^a-zA-Z0-9.\-_]', '_', filename)

def validate_csv_content(file_path: str):
    # 1. Check Magic Numbers (Reject ELF, MZ, etc)
    with open(file_path, 'rb') as f:
        header_bytes = f.read(4)
        if header_bytes.startswith(b'MZ') or header_bytes.startswith(b'\x7fELF') or header_bytes.startswith(b'%PDF'):
            raise ValueError("Binary or executable files are not allowed.")

    # 2. Check Empty File
    if os.path.getsize(file_path) == 0:
        raise ValueError("File is empty.")

    # 3. Delimiter detection & UTF-8 check
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            first_line = f.readline()
            if not first_line:
                raise ValueError("File is empty.")
            
            # Simple delimiter sniff
            dialect = csv.Sniffer().sniff(first_line + f.readline())
            f.seek(0)
            
            # Header validation
            reader = csv.reader(f, dialect)
            headers = next(reader, None)
            if not headers:
                raise ValueError("No headers found in CSV.")
            
            if len(headers) > MAX_COLUMNS:
                raise ValueError(f"Exceeded maximum allowed columns ({MAX_COLUMNS}).")
                
            # Duplicate header detection
            if len(set(headers)) != len(headers):
                raise ValueError("Duplicate headers detected. All column names must be unique.")
                
            # We don't read all rows here for performance, but rely on chunked/pandas engine later for strict row count limits
            # However, we can check basic malformed lines if needed.
    except UnicodeDecodeError:
        raise ValueError("File must be valid UTF-8 encoded.")
    except csv.Error:
        raise ValueError("Malformed CSV format detected.")
    except Exception as e:
        raise ValueError(str(e))

@router.post("/upload/init")
async def upload_init(req: UploadInitReq):
    # Extension validation
    ext = os.path.splitext(req.file_name)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Invalid file extension. Allowed: {ALLOWED_EXTENSIONS}")
        
    # Size limit
    if req.total_size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum size of {MAX_FILE_SIZE_MB}MB.")
        
    upload_id = str(uuid.uuid4())
    os.makedirs(os.path.join(TEMP_UPLOAD_DIR, upload_id), exist_ok=True)
    return {"upload_id": upload_id}

@router.post("/upload/chunk")
async def upload_chunk(chunk: UploadFile = File(...), upload_id: str = Form(...), chunk_index: int = Form(...)):
    # Validate upload_id to prevent path traversal
    if ".." in upload_id or "/" in upload_id or "\\" in upload_id:
        raise HTTPException(status_code=400, detail="Invalid upload ID.")
        
    chunk_path = os.path.join(TEMP_UPLOAD_DIR, upload_id, f"chunk_{chunk_index}")
    async with aiofiles.open(chunk_path, "wb") as out_file:
        content = await chunk.read()
        await out_file.write(content)
    return {"status": "success"}

@router.post("/upload/complete")
def upload_complete(req: UploadCompleteReq, background_tasks: BackgroundTasks):
    user_id = current_user_id.get() or "guest_user"
    
    if ".." in req.upload_id or "/" in req.upload_id:
        raise HTTPException(status_code=400, detail="Invalid upload ID.")
        
    upload_dir = os.path.join(TEMP_UPLOAD_DIR, req.upload_id)
    if not os.path.exists(upload_dir):
        raise HTTPException(status_code=400, detail="Upload session not found.")
        
    safe_file_name = sanitize_filename(req.file_name)
    unique_dataset_name = f"{req.upload_id}_{safe_file_name}"
    final_file_path = os.path.join(TEMP_UPLOAD_DIR, unique_dataset_name)
    
    # re-assemble chunks
    chunks = sorted(os.listdir(upload_dir), key=lambda x: int(x.split("_")[1]))
    with open(final_file_path, "wb") as out_file:
        for chunk_name in chunks:
            chunk_path = os.path.join(upload_dir, chunk_name)
            with open(chunk_path, "rb") as in_file:
                out_file.write(in_file.read())
            os.remove(chunk_path)
    os.rmdir(upload_dir)
    
    # Validation Phase
    try:
        if safe_file_name.lower().endswith('.csv'):
            validate_csv_content(final_file_path)
    except ValueError as ve:
        if os.path.exists(final_file_path):
            os.remove(final_file_path)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        if os.path.exists(final_file_path):
            os.remove(final_file_path)
        raise HTTPException(status_code=500, detail="Internal validation error.")
    
    # Init workflow in DB
    orchestrator = PipelineOrchestrator()
    run_id = orchestrator.start_pipeline(user_id=user_id, dataset_name=unique_dataset_name, file_path=final_file_path)
    
    # Global input
    global_input = {"dataset_name": unique_dataset_name, "file_path": final_file_path, "user_id": user_id}
    
    # Dispatch execution in background task (ExecutionDispatcher wraps it safely)
    background_tasks.add_task(ExecutionDispatcher.dispatch, run_id, global_input)
    
    return {
        "job_id": run_id,
        "status": "queued",
        "dataset_name": unique_dataset_name,
        "message": "Dataset uploaded. Processing pipeline started.",
    }
