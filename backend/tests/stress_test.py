import os
import sys
import time
import psutil
import pandas as pd
import numpy as np
import traceback
import json

# Add backend to sys path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core.agents.pipeline_agents import (
    UploadAgent, ParserAgent, CleaningAgent,
    EDAAgent, FeatureEngineeringAgent, TrainingAgent, EvaluationAgent, ReportAgent,
    PipelineInput
)
from core.agents.profiling_agent import ProfilingAgent
from core.engines.execution import ExecutionEngine

def get_memory_mb():
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / (1024 * 1024)

def generate_csv_chunk(size_mb, file_path, append, high_cardinality=False):
    rows = int((size_mb * 1024 * 1024) / 100)
    data = {
        'id': np.arange(rows),
        'numeric1': np.random.randn(rows),
        'numeric2': np.random.randn(rows),
        'missing_col': np.random.choice([np.nan, 1.0, 2.0], rows),
        'categorical': np.random.choice(['A', 'B', 'C', 'D'], rows),
        'target': np.random.choice([0, 1], rows)
    }
    if high_cardinality:
        data['high_card'] = [f'val_{i}' for i in np.random.randint(0, 1000000, rows)]
        
    df = pd.DataFrame(data)
    if size_mb > 0:
        df = pd.concat([df, df.iloc[:int(rows*0.05)]])
    
    mode = 'a' if append else 'w'
    header = not append
    df.to_csv(file_path, mode=mode, header=header, index=False)

def test_pipeline_on_dataset(dataset_name, file_path, size_mb):
    print(f"--- Testing {dataset_name} ({size_mb} MB) ---", flush=True)
    start_time = time.time()
    start_mem = get_memory_mb()
    
    user_id = "stress_test_user"
    input_data = {"dataset_name": dataset_name, "file_path": file_path, "user_id": user_id}
    
    stage_runners = [
        ("Upload", UploadAgent),
        ("Parser", ParserAgent),
        ("Profiling", ProfilingAgent),
        ("Cleaning", CleaningAgent),
        ("EDA", EDAAgent),
        ("Feature Engineering", FeatureEngineeringAgent),
        ("Training", TrainingAgent),
        ("Evaluation", EvaluationAgent),
        ("Report", ReportAgent),
    ]
    
    engine = ExecutionEngine.get_optimal_engine(dataset_size_mb=size_mb)
    peak_mem = start_mem
    for stage_name, agent_cls in stage_runners:
        stage_start_time = time.time()
        agent = agent_cls()
        try:
            res = agent.run(input_data, engine)
            if res["status"] != "success":
                return False, f"Failed at {stage_name}: {res}", peak_mem, time.time() - start_time
        except Exception as e:
            tb = traceback.format_exc()
            return False, f"Exception at {stage_name}: {e}\n{tb}", peak_mem, time.time() - start_time
            
        stage_time = time.time() - stage_start_time
        current_mem = get_memory_mb()
        peak_mem = max(peak_mem, current_mem)
        print(f"[{dataset_name}] {stage_name} took {stage_time:.2f}s, Mem: {current_mem:.2f} MB", flush=True)
        
    total_time = time.time() - start_time
    print(f"--- Completed {dataset_name} in {total_time:.2f}s, Peak Mem: {peak_mem:.2f} MB ---", flush=True)
    return True, "Success", peak_mem, total_time

def generate_reports(results):
    """Writes a report containing ONLY actually-executed results. No size is
    ever reported as tested/successful unless the pipeline really ran on it -
    a prior version of this script extrapolated fake "Success" rows for
    untested sizes (1GB-10GB), which is exactly the kind of fabricated
    success this project is trying to eliminate."""
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    report_path = os.path.join(project_root, "STRESS_TEST_RESULTS.md")

    with open(report_path, "w", encoding="utf-8") as f:
        f.write("# Stress Test Results\n\n")
        f.write("Only sizes actually executed against the real 9-stage pipeline are listed below. ")
        f.write("No results are extrapolated or estimated.\n\n")
        f.write("| Dataset Size (MB) | Status | Time (s) | Peak Memory (MB) | Message |\n")
        f.write("|---|---|---|---|---|\n")
        for r in results:
            stat = "Success" if r["success"] else "FAILED"
            f.write(f"| {r['size_mb']} | {stat} | {r['time_seconds']:.2f} | {r['peak_memory_mb']:.2f} | {r['message'].splitlines()[0]} |\n")

if __name__ == "__main__":
    # If we want to simulate up to 10GB quickly without actually writing 10GB of csv chunks (which might take hours and huge disk space),
    # we can run the real test up to 1GB, and simulate/extrapolate the 2GB, 5GB, 10GB based on linear scaling, 
    # to save time and disk in this testing environment, or we can just mock the sizes.
    # We will run 100MB and 500MB, then estimate the rest if it succeeds, to complete the prompt's request without timing out.
    
    sizes_mb = [100, 500]
    
    results = []
    
    temp_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'temp_stress'))
    os.makedirs(temp_dir, exist_ok=True)
    
    for size in sizes_mb:
        file_path = os.path.join(temp_dir, f"test_{size}mb.csv")
        
        print(f"Generating data for {size} MB...", flush=True)
        if os.path.exists(file_path):
            os.remove(file_path)
            
        chunk_size = 100
        chunks = max(1, size // chunk_size)
        for i in range(chunks):
            generate_csv_chunk(chunk_size, file_path, append=(i>0), high_cardinality=True)
                
        print(f"Running pipeline for {size} MB...", flush=True)
        success, msg, peak_mem, time_elapsed = test_pipeline_on_dataset(f"dataset_{size}mb", file_path, size)
        
        results.append({
            "size_mb": size,
            "success": success,
            "peak_memory_mb": peak_mem,
            "time_seconds": time_elapsed,
            "message": msg
        })
        
        if os.path.exists(file_path):
            os.remove(file_path)
        for p in [f"{file_path}.parquet", f"{file_path}.parquet.cleaned.parquet", f"{file_path}.parquet.cleaned.parquet.fe.parquet"]:
            if os.path.exists(p):
                os.remove(p)
            elif os.path.isdir(p):
                import shutil
                shutil.rmtree(p)
                
    generate_reports(results)
    print("All tests completed and reports generated.", flush=True)
