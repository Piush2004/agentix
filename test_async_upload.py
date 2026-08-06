import requests
import time
import json
import os

BASE_URL = "http://localhost:8000/api/v1"

def test_async_upload():
    print("Testing async upload pipeline...")
    
    # Create a dummy dataset
    test_file = "test_async_data.csv"
    with open(test_file, "w") as f:
        f.write("id,name,value\n1,Alice,100\n2,Bob,200\n3,Charlie,300\n")
    
    try:
        # Upload
        print(f"Uploading {test_file}...")
        with open(test_file, "rb") as f:
            files = {"file": (test_file, f, "text/csv")}
            response = requests.post(f"{BASE_URL}/dataset/upload", files=files)
        
        if response.status_code != 200:
            print(f"Upload failed: {response.status_code} - {response.text}")
            return
            
        data = response.json()
        print(f"Upload successful. Response: {json.dumps(data, indent=2)}")
        
        job_id = data.get("job_id")
        if not job_id:
            print("Error: No job_id returned.")
            return
            
        # Poll
        print(f"Polling job status for {job_id}...")
        max_attempts = 30
        for i in range(max_attempts):
            res = requests.get(f"{BASE_URL}/jobs/{job_id}")
            if res.status_code != 200:
                print(f"Polling failed: {res.status_code} - {res.text}")
                break
                
            status_data = res.json()
            status = status_data.get("status")
            progress = status_data.get("progress")
            stage = status_data.get("current_stage")
            
            print(f"Attempt {i+1}: Status={status}, Stage={stage}, Progress={progress}%")
            
            if status == "completed":
                print("Job completed successfully!")
                break
            elif status == "failed":
                print(f"Job failed: {status_data.get('error')}")
                break
                
            time.sleep(2)
            
        if status not in ["completed", "failed"]:
            print("Job timed out.")
            
    finally:
        if os.path.exists(test_file):
            os.remove(test_file)

if __name__ == "__main__":
    test_async_upload()
