# Large Dataset Architecture (10 GB)

## 1. Frontend Upload Chunking Strategy
- **Library**: `tus-js-client` (Tus protocol) or Uppy for chunked, resumable uploads.
- **Approach**: Slice the file in the browser using the HTML5 File API (`File.slice()`). Upload chunks sequentially (e.g., 10MB to 50MB chunks).
- **Benefits**: Resumable if the network fails. Low memory footprint on the client side since only a small chunk is in memory at a time.

## 2. Backend File Storage Strategy
- **Receiving Uploads**: FastAPI endpoints supporting `tus` or custom chunked uploads. Save chunks directly to disk using `aiofiles` for non-blocking I/O.
- **Format Conversion**: Once the full dataset is uploaded, use Polars to stream the CSV and write it immediately to Parquet using streaming mode (`pl.scan_csv("data.csv").sink_parquet("data.parquet")`).
- **Benefits**: Parquet is highly compressed, columnar, and supports fast out-of-core memory access, minimizing memory usage for subsequent steps.

## 3. Backend Processing Strategy
- **Library**: Polars (LazyFrames) and PyArrow.
- **Approach**: For 10GB files, a single machine might run out of RAM if read entirely into memory (like standard Pandas). Polars `LazyFrame` processes data out-of-core, meaning it only loads necessary chunks into memory during computation and query execution. 
- **Dask vs Polars**: Polars is preferable for single-node performance due to its heavily optimized multithreaded Rust backend. Dask is better for distributed clusters, but Polars `LazyFrame` handles 10GB efficiently on a single machine.

## 4. Machine Learning Strategy
- **Library**: Scikit-Learn.
- **Approach**: 
  - **Mini-batch/Incremental Learning**: Use models that support the `partial_fit` API (e.g., `SGDClassifier`, `SGDRegressor`, `MiniBatchKMeans`, `PassiveAggressiveClassifier`). 
  - **Data Loading**: Yield batches of data using PyArrow/Polars batched readers and feed them sequentially into `partial_fit`.
  - **Sampling**: If full dataset training is not strictly required or if standard non-incremental models must be used, use Polars to randomly sample a representative subset (e.g., 1GB-2GB) to train standard models.

## 5. Memory Management
- **Garbage Collection**: Explicitly call `del` on large intermediate Python objects (e.g., lists, arrays, PyArrow tables), and invoke `gc.collect()` at the end of large operations.
- **Chunk Sizes**: Keep processing batch sizes bounded (e.g., 100,000 rows or ~100MB-500MB) depending on the available system RAM.
- **Temp File Cleanup**: Use context managers or background task schedulers (e.g., Celery/APScheduler) to ensure temporary CSV chunks and intermediate Parquet files are securely deleted upon failure or completion.

## 6. Extended Job Status Tracking
- **Enhancement to `JobManager`**:
  - Add tracking fields: `rows_processed`, `total_rows`, `memory_usage_mb`, `cpu_usage_percent`.
  - Use `psutil` in Python to capture real-time memory and CPU utilization of the background worker process.
  - Update jobs periodically (e.g., after each batch processed).
  - Expose a Server-Sent Events (SSE) or WebSocket endpoint in FastAPI to stream rich progress updates (like a progress bar, memory gauge) back to the Next.js frontend in real-time.
