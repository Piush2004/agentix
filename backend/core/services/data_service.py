import pandas as pd
from typing import Optional

class DataService:
    def __init__(self):
        self._datasets = {}

    def store_dataset(self, name: str, df: pd.DataFrame, change_summary: str = ""):
        self._datasets[name] = df.copy()

    def get_dataset(self, name: str) -> Optional[pd.DataFrame]:
        return self._datasets.get(name)

data_service = DataService()
