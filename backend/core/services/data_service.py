import json
import logging
from typing import Any, Dict, Optional

import pandas as pd

logger = logging.getLogger("agentix_v2")


def _series_to_json(value: Any) -> str:
    # y_pred in particular is a raw numpy array (label_encoder.inverse_transform()
    # return value), not a pandas Series. list(ndarray) does NOT convert its
    # elements to native Python types - it yields a list of numpy scalars
    # (e.g. numpy.int64), which json.dumps cannot serialize and raises on.
    # .tolist() exists on both pandas Series and numpy ndarray and correctly
    # converts every element to a native Python type; prefer it over a bare
    # list() cast whenever it's available.
    tolist = getattr(value, "tolist", None)
    if callable(tolist):
        return json.dumps(tolist())
    return json.dumps(list(value))


class DataService:
    """
    Pipeline intermediate state (parquet path, target column, problem type,
    held-out test predictions), keyed by dataset_name.

    Previously this was an in-process dict only - wiped on every backend
    restart. That meant any on-demand recomputation for an already fully
    processed dataset (e.g. the standalone /profile endpoint, or a crash
    between TrainingAgent and EvaluationAgent) would fail even though the
    pipeline was marked completed in the database, because the parquet path
    and target column needed to re-read the dataset were gone. The in-memory
    dict below remains as a same-process fast path - every write and every
    miss now also goes through the Dataset table, so the state survives a
    restart.
    """

    def __init__(self):
        self._datasets: Dict[str, Dict[str, Any]] = {}

    def store_dataset(self, name: str, data: Dict[str, Any], change_summary: str = ""):
        self._datasets[name] = dict(data)
        self._persist(name, data)

    def get_dataset(self, name: str) -> Optional[Dict[str, Any]]:
        if name in self._datasets:
            return self._datasets[name]
        hydrated = self._hydrate(name)
        if hydrated is not None:
            self._datasets[name] = hydrated
        return hydrated

    def _persist(self, name: str, data: Dict[str, Any]) -> None:
        from core.repositories.database import SessionLocal
        from core.models.models import Dataset

        db = SessionLocal()
        try:
            # The most recently created row for this name is always the one
            # the current pipeline run registered via start_pipeline() just
            # before this stage executed - writes should land there, not on
            # an older completed run that happens to share the same name.
            dataset = (
                db.query(Dataset)
                .filter_by(name=name)
                .order_by(Dataset.created_at.desc())
                .first()
            )
            if not dataset:
                # store_dataset() is only ever called mid-pipeline, after
                # start_pipeline() has already created this row; if it
                # genuinely doesn't exist there's nothing real to persist to.
                return
            if "parquet_path" in data:
                dataset.parquet_path = data["parquet_path"]
            if "target_column" in data:
                dataset.target_column = data["target_column"]
            if "problem_type" in data:
                dataset.problem_type = data["problem_type"]
            if "y_test" in data:
                dataset.y_test_json = _series_to_json(data["y_test"])
            if "y_pred" in data:
                dataset.y_pred_json = _series_to_json(data["y_pred"])
            db.commit()
        except Exception:
            logger.warning(f"Failed to persist pipeline state for dataset '{name}'", exc_info=True)
            db.rollback()
        finally:
            db.close()

    def _hydrate(self, name: str) -> Optional[Dict[str, Any]]:
        from core.repositories.database import SessionLocal
        from core.models.models import Dataset

        db = SessionLocal()
        try:
            # A standalone on-demand call (e.g. /profile) starts its own new
            # pipeline run first, which creates another, still-empty Dataset
            # row for this same name - the plain "most recent row" would be
            # that empty placeholder, not the completed run's real data.
            # Skip rows that haven't actually been parsed yet.
            dataset = (
                db.query(Dataset)
                .filter_by(name=name)
                .filter(Dataset.parquet_path.isnot(None))
                .order_by(Dataset.created_at.desc())
                .first()
            )
            if not dataset:
                return None
            result: Dict[str, Any] = {"parquet_path": dataset.parquet_path}
            if dataset.target_column:
                result["target_column"] = dataset.target_column
            if dataset.problem_type:
                result["problem_type"] = dataset.problem_type
            if dataset.y_test_json:
                result["y_test"] = pd.Series(json.loads(dataset.y_test_json))
            if dataset.y_pred_json:
                result["y_pred"] = pd.Series(json.loads(dataset.y_pred_json))
            return result
        except Exception:
            logger.warning(f"Failed to hydrate pipeline state for dataset '{name}'", exc_info=True)
            return None
        finally:
            db.close()


data_service = DataService()
