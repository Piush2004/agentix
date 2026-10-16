import pandas as pd
import pytest

from core.repositories.database import SessionLocal
from core.models.models import Dataset
from core.services.data_service import DataService


@pytest.fixture
def real_dataset_row():
    """Creates a real Dataset row the way PipelineOrchestrator.start_pipeline()
    does, so _persist()/_hydrate() have a genuine row to write to and read
    from - a dict mock would not exercise the actual SQL being tested."""
    db = SessionLocal()
    dataset = Dataset(name="restart_persistence_test.csv", owner_id="guest_user", filepath="/tmp/x.csv")
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    dataset_id = dataset.id
    db.close()

    yield dataset.name

    db = SessionLocal()
    db.query(Dataset).filter_by(id=dataset_id).delete()
    db.commit()
    db.close()


def test_pipeline_state_survives_a_fresh_data_service_instance(real_dataset_row, tmp_path):
    """Regression test: DataService used to be an in-process dict only, wiped
    on every backend restart. A fully processed dataset's on-demand
    recomputation (e.g. /profile) would then fail with "Dataset not found"
    even though its pipeline was marked completed in the database. A fresh
    DataService() (no in-memory cache - the same state a new process starts
    with) must still be able to recover the real pipeline state from the
    Dataset row."""
    name = real_dataset_row
    parquet_path = tmp_path / "dataset.parquet"
    pd.DataFrame({"age": [20, 30, 40], "target": [0, 1, 0]}).to_parquet(parquet_path)

    writer = DataService()
    writer.store_dataset(name, {"parquet_path": str(parquet_path), "target_column": "target"})
    writer.store_dataset(name, {
        "parquet_path": str(parquet_path),
        "target_column": "target",
        "problem_type": "classification",
        # y_pred is a raw numpy array in real use (label_encoder.inverse_transform()),
        # not a pandas Series - the regression this guards against specifically.
        "y_test": pd.Series([0, 1, 1]),
        "y_pred": pd.Series([0, 1, 1]).to_numpy(),
    })

    # A brand-new instance with an empty in-memory dict - exactly what exists
    # immediately after a backend restart, before anything has been re-run.
    reader = DataService()
    hydrated = reader.get_dataset(name)

    assert hydrated is not None
    assert hydrated["parquet_path"] == str(parquet_path)
    assert hydrated["target_column"] == "target"
    assert hydrated["problem_type"] == "classification"
    assert list(hydrated["y_test"]) == [0, 1, 1]
    assert list(hydrated["y_pred"]) == [0, 1, 1]


def test_hydrate_skips_empty_placeholder_rows_from_a_later_run(real_dataset_row, tmp_path):
    """A standalone on-demand call (e.g. /profile) starts its own new pipeline
    run first via start_pipeline(), which creates another Dataset row with
    the same name and no parquet_path yet. Hydration must skip that empty
    placeholder and find the earlier, real completed data - not treat the
    newest row as authoritative regardless of whether it has real data."""
    name = real_dataset_row
    parquet_path = tmp_path / "dataset.parquet"
    pd.DataFrame({"x": [1, 2]}).to_parquet(parquet_path)

    writer = DataService()
    writer.store_dataset(name, {"parquet_path": str(parquet_path), "target_column": "x"})

    # Simulate a later on-demand call creating a new, still-empty row for the
    # same dataset name (start_pipeline() does this with dataset_id=None).
    db = SessionLocal()
    newer_empty_row = Dataset(name=name, owner_id="guest_user", filepath="/tmp/x.csv")
    db.add(newer_empty_row)
    db.commit()
    newer_id = newer_empty_row.id
    db.close()

    try:
        reader = DataService()
        hydrated = reader.get_dataset(name)
        assert hydrated is not None
        assert hydrated["parquet_path"] == str(parquet_path)
    finally:
        db = SessionLocal()
        db.query(Dataset).filter_by(id=newer_id).delete()
        db.commit()
        db.close()
