from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
import pandas as pd
import logging

logger = logging.getLogger("agentix_v2")

class ProcessingEngine(ABC):
    @abstractmethod
    def load_dataset(self, source_path: str) -> Any:
        pass

    @abstractmethod
    def save_dataset(self, data: Any, dest_path: str) -> None:
        pass

    @abstractmethod
    def compute(self, data: Any) -> Any:
        """Force evaluation/computation if the engine uses lazy evaluation."""
        pass

    @abstractmethod
    def get_memory_usage(self, data: Any) -> float:
        """Return memory usage of the dataset in MB"""
        pass

class PandasEngine(ProcessingEngine):
    def load_dataset(self, source_path: str) -> pd.DataFrame:
        if source_path.endswith('.csv'):
            return pd.read_csv(source_path)
        elif source_path.endswith('.parquet'):
            return pd.read_parquet(source_path, engine='fastparquet')
        raise ValueError(f"Unsupported file format for PandasEngine: {source_path}")

    def save_dataset(self, df: pd.DataFrame, dest_path: str) -> None:
        if dest_path.endswith('.csv'):
            df.to_csv(dest_path, index=False)
        elif dest_path.endswith('.parquet'):
            df.to_parquet(dest_path, engine='fastparquet', index=False)
        else:
            raise ValueError(f"Unsupported save format for PandasEngine: {dest_path}")

    def compute(self, data: pd.DataFrame) -> pd.DataFrame:
        return data

    def get_memory_usage(self, data: pd.DataFrame) -> float:
        return data.memory_usage(deep=True).sum() / (1024 * 1024)

class ChunkedPandasEngine(ProcessingEngine):
    def __init__(self, chunksize: int = 100000):
        self.chunksize = chunksize

    def load_dataset(self, source_path: str) -> Any:
        if source_path.endswith('.csv'):
            return pd.read_csv(source_path, chunksize=self.chunksize)
        raise ValueError(f"Chunked loading only supported for CSV in this engine: {source_path}")

    def save_dataset(self, data: Any, dest_path: str) -> None:
        first = True
        for chunk in data:
            if dest_path.endswith('.csv'):
                chunk.to_csv(dest_path, mode='a' if not first else 'w', header=first, index=False)
            elif dest_path.endswith('.parquet'):
                chunk.to_parquet(dest_path, engine='fastparquet', append=not first, index=False)
            first = False

    def compute(self, data: Any) -> Any:
        return pd.concat(data, ignore_index=True)

    def get_memory_usage(self, data: Any) -> float:
        # Cannot easily estimate memory for iterator without exhaustion
        return 0.0

class DaskEngine(ProcessingEngine):
    def load_dataset(self, source_path: str) -> Any:
        import dask.dataframe as dd
        if source_path.endswith('.csv'):
            return dd.read_csv(source_path)
        elif source_path.endswith('.parquet'):
            return dd.read_parquet(source_path, engine='fastparquet')
        raise ValueError(f"Unsupported format for DaskEngine: {source_path}")

    def save_dataset(self, data: Any, dest_path: str) -> None:
        if dest_path.endswith('.csv'):
            data.to_csv(dest_path, single_file=True, index=False)
        elif dest_path.endswith('.parquet'):
            data.to_parquet(dest_path, engine='fastparquet', write_index=False)
        else:
            raise ValueError(f"Unsupported save format for DaskEngine: {dest_path}")

    def compute(self, data: Any) -> pd.DataFrame:
        return data.compute()

    def get_memory_usage(self, data: Any) -> float:
        return data.memory_usage(deep=True).sum().compute() / (1024 * 1024)

class EngineFactory:
    @staticmethod
    def get_engine(dataset_size_mb: float = 0.0, config_engine: Optional[str] = None) -> ProcessingEngine:
        if config_engine == "pandas":
            return PandasEngine()
        elif config_engine == "chunked":
            return ChunkedPandasEngine()
        elif config_engine == "dask":
            return DaskEngine()
            
        if dataset_size_mb < 500:
            return PandasEngine()
        elif dataset_size_mb < 2000:
            return ChunkedPandasEngine()
        else:
            return DaskEngine()
