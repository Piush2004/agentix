import pandas as pd
import pytest

from core.agents.pipeline_agents import PipelineInput, ReportAgent
from core.services.data_service import data_service
from core.engines.execution import ExecutionEngine


def test_report_agent_does_not_fabricate_a_pdf(tmp_path):
    """Regression test: ReportAgent previously always returned a
    /reports/{name}_report.pdf URL with no file ever generated. It must now
    report real pipeline data and be honest that no PDF exists."""
    parquet_path = tmp_path / "dataset.parquet"
    pd.DataFrame({"a": [1, 2, 3], "target": [0, 1, 0]}).to_parquet(parquet_path)

    dataset_name = "report_agent_test_dataset.csv"
    data_service.store_dataset(
        dataset_name,
        {
            "parquet_path": str(parquet_path),
            "target_column": "target",
            "problem_type": "classification",
        },
    )

    agent = ReportAgent()
    engine = ExecutionEngine.get_optimal_engine(dataset_size_mb=0.0)
    output = agent.execute(PipelineInput(dataset_name=dataset_name), engine)

    assert output.result["pdf_available"] is False
    assert output.result["pdf_url"] is None
    assert "report_url" not in output.result
    assert output.result["rows"] == 3
    assert output.result["cols"] == 2
    assert output.result["target_column"] == "target"
    assert output.result["problem_type"] == "classification"
