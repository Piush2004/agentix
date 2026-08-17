"""Generates a large, deliberately messy CSV for stress-testing the real
pipeline: missing values, duplicates, high-cardinality strings, outliers,
malformed dates, and a known noisy-but-real regression target - sized to
cross the ChunkedPandasEngine threshold (~500MB+) instead of a degenerate
all-identical-rows file."""
import os
import sys
import numpy as np
import pandas as pd

def generate(path: str, target_rows: int, seed: int = 42):
    rng = np.random.default_rng(seed)
    os.makedirs(os.path.dirname(path), exist_ok=True)

    chunk_rows = 200_000
    written = 0
    first = True

    while written < target_rows:
        n = min(chunk_rows, target_rows - written)

        numeric1 = rng.normal(50, 15, n)
        numeric2 = rng.exponential(1000, n)  # skewed
        # 15% missing independently in each numeric column
        numeric1[rng.random(n) < 0.15] = np.nan
        numeric2[rng.random(n) < 0.15] = np.nan

        categories = np.array(["A", "B", "C", "D", "E"])
        categorical = rng.choice(categories, n)
        categorical = categorical.astype(object)
        categorical[rng.random(n) < 0.1] = None

        # very high cardinality column (near-unique IDs), realistic messy data
        high_card = np.array([f"id_{v}" for v in rng.integers(0, target_rows * 3, n)])

        # a handful of malformed date strings mixed into otherwise valid ones
        dates = pd.date_range("2020-01-01", periods=n, freq="min").astype(str).to_numpy(dtype=object)
        malformed_idx = rng.random(n) < 0.01
        dates[malformed_idx] = "not-a-date"

        noise = rng.normal(0, 20, n)
        target = 3.0 * np.nan_to_num(numeric1, nan=50.0) + 0.01 * np.nan_to_num(numeric2, nan=1000.0) + noise
        # inject outliers
        outlier_idx = rng.random(n) < 0.005
        target[outlier_idx] *= 10

        df = pd.DataFrame({
            "id": np.arange(written, written + n),
            "numeric1": numeric1,
            "numeric2": numeric2,
            "categorical": categorical,
            "high_card_id": high_card,
            "event_date": dates,
            "target": target,
        })

        # inject duplicate rows (~5% of this chunk, copies of earlier rows in the chunk)
        if n > 20:
            dup_rows = df.sample(frac=0.05, random_state=seed)
            df = pd.concat([df, dup_rows], ignore_index=True)

        df.to_csv(path, mode="w" if first else "a", header=first, index=False)
        first = False
        written += n
        print(f"  wrote {written}/{target_rows} rows", flush=True)

    size_mb = os.path.getsize(path) / (1024 * 1024)
    print(f"Done: {path} ({size_mb:.1f} MB)")

if __name__ == "__main__":
    target_rows = int(sys.argv[1]) if len(sys.argv) > 1 else 3_000_000
    out_path = sys.argv[2] if len(sys.argv) > 2 else "data/temp_test/tough_large.csv"
    generate(out_path, target_rows)
