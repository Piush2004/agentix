# Agentix Chunked Upload Pipeline V2

To support uploading large datasets (up to 10 GB) without freezing the frontend or timing out on a single network request, Agentix uses a chunked upload architecture. 

This document outlines the API contract between the Frontend and Backend.

## API Endpoints

The backend must implement the following three endpoints under `/api/v1/dataset/upload/`.

### 1. Initialize Upload
**Endpoint:** `POST /api/v1/dataset/upload/init`

**Request Body (JSON):**
```json
{
  "file_name": "large_dataset.csv",
  "total_chunks": 2048,
  "total_size": 10737418240
}
```

**Response (JSON):**
```json
{
  "upload_id": "unique-upload-id-1234"
}
```

### 2. Upload Chunk
**Endpoint:** `POST /api/v1/dataset/upload/chunk`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `upload_id` (string): The ID received from the initialization step.
- `chunk_index` (integer): The 0-based index of the chunk being uploaded.
- `chunk` (File/Blob): The actual binary chunk data.

**Response:**
Returns a 200 OK when successful.
If an error occurs, the frontend will automatically retry up to 3 times with exponential backoff.

### 3. Complete Upload
**Endpoint:** `POST /api/v1/dataset/upload/complete`

**Request Body (JSON):**
```json
{
  "upload_id": "unique-upload-id-1234",
  "file_name": "large_dataset.csv"
}
```

**Response (JSON):**
```json
{
  "job_id": "background-job-id-5678",
  "dataset_name": "large_dataset.csv"
}
```

## Implementation Details

- **Chunk Size**: The frontend chunks files into 5 MB parts (`5 * 1024 * 1024` bytes).
- **Concurrency**: Currently, chunks are sent sequentially, with progress tracking updating on each successful chunk.
- **Retries**: The frontend automatically retries individual failed chunks up to 3 times before failing the entire upload.
- **Progress Tracking**: A new `uploadProgress` state tracks the upload phase (`(chunkIndex + 1) / totalChunks * 100`). After upload completion, standard job polling starts for pipeline execution.