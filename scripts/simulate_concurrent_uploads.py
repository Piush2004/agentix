import os
import requests
import concurrent.futures
import time

BASE_URL = 'http://localhost:8000/api/v1'

def upload_file(file_path):
    filename = os.path.basename(file_path)
    file_size = os.path.getsize(file_path)
    print(f"[{filename}] Starting upload. Size: {file_size}")
    
    # Init
    try:
        chunk_size = 5 * 1024 * 1024
        total_chunks = (file_size + chunk_size - 1) // chunk_size
        init_res = requests.post(f'{BASE_URL}/dataset/upload/init', json={
            "file_name": filename,
            "total_size": file_size,
            "total_chunks": total_chunks
        })
        init_res.raise_for_status()
        upload_id = init_res.json()['upload_id']
    except Exception as e:
        print(f"[{filename}] Init failed: {e}")
        return
    
    # Chunk
    chunk_size = 5 * 1024 * 1024
    with open(file_path, 'rb') as f:
        chunk_index = 0
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            
            files = {'chunk': (filename, chunk)}
            data = {'upload_id': upload_id, 'chunk_index': chunk_index}
            try:
                chunk_res = requests.post(f'{BASE_URL}/dataset/upload/chunk', files=files, data=data)
                chunk_res.raise_for_status()
            except Exception as e:
                print(f"[{filename}] Chunk {chunk_index} failed: {e}")
                return
            chunk_index += 1
            if chunk_index % 10 == 0:
                print(f"[{filename}] Uploaded chunk {chunk_index}")
            
    # Complete
    try:
        comp_res = requests.post(f'{BASE_URL}/dataset/upload/complete', json={
            "upload_id": upload_id,
            "file_name": filename
        })
        comp_res.raise_for_status()
        res_data = comp_res.json()
        print(f"[{filename}] Completed! Job ID: {res_data.get('job_id')}, Dataset Name: {res_data.get('dataset_name')}")
        return res_data
    except Exception as e:
        print(f"[{filename}] Complete failed: {e}")
        return

if __name__ == '__main__':
    sizes = [50, 100, 150, 200, 250]
    files = [f'data/temp_test/data_{size}MB.csv' for size in sizes]
    
    start_time = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(upload_file, f): f for f in files}
        for future in concurrent.futures.as_completed(futures):
            try:
                res = future.result()
                print("Result:", res)
            except Exception as exc:
                print(f"Exception: {exc}")
                
    print(f"Total time: {time.time() - start_time} seconds")
