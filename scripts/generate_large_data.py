import os
import io

def generate_csv_fast(filename, target_size_mb):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    target_bytes = target_size_mb * 1024 * 1024
    
    # create a chunk of csv data in memory
    row = b'1,' + b'a'*100 + b',' + b'b'*100 + b',' + b'c'*100 + b'\n'
    row_size = len(row)
    
    rows_per_mb = (1024 * 1024) // row_size
    chunk_data = row * rows_per_mb
    chunk_size = len(chunk_data)
    
    with open(filename, 'wb') as f:
        # write header first
        header = b'id,data1,data2,data3\n'
        f.write(header)
        written = len(header)
        while written < target_bytes:
            f.write(chunk_data)
            written += chunk_size

if __name__ == '__main__':
    sizes = [50, 100, 150, 200, 250]
    for size in sizes:
        print(f"Generating {size}MB file...")
        generate_csv_fast(f'data/temp_test/data_{size}MB.csv', size)
    print("Done generating files.")
