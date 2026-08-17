import requests
import time
import json
import os
import concurrent.futures
import threading

BASE_URL = "http://127.0.0.1:8000"

endpoints_to_test = [
    ("GET", "/health", None),
    ("GET", "/api/v1/platform/system-health", None),
    ("GET", "/api/v1/platform/storage", None),
    ("GET", "/api/v1/platform/recent-activity", None),
    ("GET", "/api/v1/platform/dashboard-metrics", None),
    ("POST", "/api/v1/dataset/upload/init", {"file_name": "stress.csv", "total_chunks": 1, "total_size": 100}),
    ("POST", "/api/v1/auth/login", {"username": "admin", "password": "wrong_password"}), # Should return 401/400 but test auth overhead
]

metrics = {
    "total_requests": 0,
    "successful_requests": 0,
    "failed_requests": 0,
    "exceptions": 0,
    "total_latency_ms": 0,
    "status_codes": {},
    "errors": []
}
lock = threading.Lock()

def make_request(method, path, body):
    url = f"{BASE_URL}{path}"
    start = time.time()
    try:
        if method == "GET":
            res = requests.get(url, timeout=10)
        else:
            res = requests.post(url, json=body, timeout=10)
        
        latency = (time.time() - start) * 1000
        
        with lock:
            metrics["total_requests"] += 1
            metrics["total_latency_ms"] += latency
            status = res.status_code
            metrics["status_codes"][status] = metrics["status_codes"].get(status, 0) + 1
            if 200 <= status < 400:
                metrics["successful_requests"] += 1
            else:
                metrics["failed_requests"] += 1
                try:
                    err_msg = res.json()
                except:
                    err_msg = res.text[:100]
                metrics["errors"].append(f"{path} {status}: {err_msg}")
    except Exception as e:
        with lock:
            metrics["total_requests"] += 1
            metrics["exceptions"] += 1
            metrics["errors"].append(f"{path} EXCEPTION: {str(e)}")

def run_stress_test(concurrency=50, total_requests=1000):
    print(f"Starting stress test: {total_requests} requests at {concurrency} concurrency")
    start_time = time.time()
    
    tasks = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as executor:
        for i in range(total_requests):
            ep = endpoints_to_test[i % len(endpoints_to_test)]
            tasks.append(executor.submit(make_request, ep[0], ep[1], ep[2]))
            
        concurrent.futures.wait(tasks)
        
    duration = time.time() - start_time
    print(f"Completed in {duration:.2f} seconds")
    print(f"RPS: {total_requests / duration:.2f}")
    
    metrics["avg_latency_ms"] = metrics["total_latency_ms"] / total_requests if total_requests > 0 else 0
    metrics["duration_seconds"] = duration
    metrics["rps"] = total_requests / duration
    
    # Save results
    with open(os.path.join(os.path.dirname(__file__), "stress_results_detailed.json"), "w") as f:
        json.dump(metrics, f, indent=4)
        
    print(json.dumps(metrics, indent=2))

if __name__ == "__main__":
    run_stress_test(concurrency=50, total_requests=1000)
