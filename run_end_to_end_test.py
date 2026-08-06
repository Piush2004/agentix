import os
import time
import requests

BASE_URL = "http://localhost:8000/api/v1"

def create_medium_csv():
    path = "test_medium.csv"
    if not os.path.exists(path):
        with open(path, "w") as f:
            f.write("id,feature1,feature2,target\n")
            for i in range(1, 1001):
                f1 = i * 1.5 if i % 10 != 0 else "NaN"
                f2 = f"cat_{i % 5}" if i % 2 == 0 else i * 0.1
                t = i % 2
                f.write(f"{i},{f1},{f2},{t}\n")
    return path

def run_test(file_path):
    print(f"Uploading {file_path}...")
    with open(file_path, "rb") as f:
        # Assuming we just upload standard multipart
        files = {"file": (os.path.basename(file_path), f, "text/csv")}
        res = requests.post(f"{BASE_URL}/dataset/upload", files=files)
    
    if res.status_code != 200:
        print(f"Upload failed! {res.status_code} {res.text}")
        return False, res.text
    
    data = res.json()
    job_id = data.get("job_id")
    print(f"Uploaded successfully. Job ID: {job_id}")
    
    # Poll job status
    print("Polling job status...")
    while True:
        job_res = requests.get(f"{BASE_URL}/jobs/{job_id}")
        if job_res.status_code != 200:
            print(f"Failed to fetch job status: {job_res.status_code}")
            return False, job_res.text
            
        job_data = job_res.json()
        status = job_data.get("status")
        stage = job_data.get("current_stage")
        print(f"Status: {status}, Stage: {stage}")
        
        if status == "completed":
            print(f"Job {job_id} completed successfully.")
            return True, job_data
        elif status == "failed":
            print(f"Job {job_id} failed!")
            print(job_data)
            return False, job_data
            
        time.sleep(3)

if __name__ == "__main__":
    create_medium_csv()
    
    print("=== Testing Small CSV ===")
    s_success, s_data = run_test("test_small.csv")
    
    print("\n=== Testing Medium CSV ===")
    m_success, m_data = run_test("test_medium.csv")
    
    if s_success and m_success:
        print("\nAll tests passed!")
    else:
        print("\nTests failed!")
