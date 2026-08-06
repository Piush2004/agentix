# Memory Optimization Report

## Overview
This report outlines the memory optimizations implemented in the Agentix Backend to support the processing of 10 GB datasets without exhausting server RAM. The updates focus on chunked processing, out-of-core evaluation, and lazy evaluation frameworks to prevent full dataset loads into memory.

## Key Implementations

### 1. JobManager Updates
- **Metrics Tracking:** Updated `JobState` to track `memory_usage`, `cpu_usage`, `rows_processed`, and `rows_remaining`.
- **Visibility:** This allows real-time insights into system health and job progress, crucial for handling large files over extended periods.

### 2. Chunked Parsing and Parquet Conversion
- **ParserAgent Optimization:** Implemented `pandas.read_csv` with `chunksize=100000` to process CSV files in manageable blocks.
- **Immediate Parquet Conversion:** Instead of returning massive DataFrames, data is immediately persisted to disk as Parquet files using `fastparquet`. Parquet's columnar format supports highly efficient lazy loading and compression, saving both disk space and memory.

### 3. Out-of-Core Processing with Dask
Replaced static `pandas` DataFrame loads in the core agents with `dask.dataframe`:
- **ProfilingAgent:** Computes missing values and dataset dimensions lazily, processing the Parquet file without fully loading it.
- **CleaningAgent:** Applies fill rules for numeric and categorical columns asynchronously and streams the cleaned dataset into a new Parquet file.
- **EDAAgent:** Computes the correlation matrix using random sampling (`frac=0.1`) to ensure computational tractability while maintaining statistical validity.
- **FeatureEngineeringAgent:** Implements lazy categorical feature encoding (`get_dummies`) and writes out a new engineered Parquet dataset incrementally.

### 4. Incremental Model Training
- **TrainingAgent Update:** Migrated to scikit-learn's `SGDClassifier` using the `partial_fit` API.
- **Batch Processing:** Reads the processed Parquet file using `pyarrow.parquet.ParquetFile.iter_batches(batch_size=100000)` and trains the model in batches, maintaining a constant minimal memory footprint regardless of total dataset size.

## Conclusion
By shifting from in-memory processing to out-of-core and chunked architectures, the pipeline is now fully equipped to process massive datasets sequentially. This eliminates OOM (Out-of-Memory) errors and prepares the system for highly scalable data workflows.
