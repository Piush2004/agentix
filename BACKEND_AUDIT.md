# Backend Audit Report
**EMERGENCY RECOVERY MODE**

The following audit ensures the backend strictly adheres to the new linear async pipeline: 
`Upload -> Store -> Profile -> Clean -> EDA -> Feature Eng -> Train -> Evaluate -> Report`

Any old complex cyclic orchestrators, mock engines, and deprecated services have been flagged.

## 🟢 KEEP (Stable, required, no changes needed)
- `core/agents/base.py`: Core agent definitions and validation logic.
- `core/agents/upload_agent.py`: Handles uploads and delegates to DataService.
- `core/agents/profiling_agent.py`: Handles data profiling.
- `core/services/automl_engine.py`: Handles model training.
- `core/api/main.py`: FastAPI entry point.
- `core/api/v1/api.py` & routes (`routes_auth.py`, `routes_data.py`, `routes_jobs.py`, `routes_platform.py`, `routes_system.py`): Core API endpoints.

## 🟡 REFACTOR (Requires modifications to fit the new linear async pipeline)
- `core/orchestrator.py`: Currently includes agents not in the strict pipeline (`QualityCheckAgent`, `ModelPlanningAgent`, `ExplainabilityAgent`, `BusinessInsightsAgent`, `KnowledgeGraphAgent`). It must be stripped down to only instantiate and sequence the exact 9 agents of the strict linear pipeline.
- `core/agents/pipeline_agents.py`: Contains a mix of valid agents and deprecated/extra ones (`ChatAgent`, `KnowledgeGraphAgent`, etc.). Needs to be pruned and aligned with the strict pipeline.
- `core/services/decision_engine.py`: Complex recommendation logic using KNN and fingerprints. Needs to be simplified or refactored if it is to fit into the `Feature Eng` or `Train` steps, otherwise remove.

## 🔴 REMOVE (Dead code, mock code, deprecated execution engines, cyclic orchestrators)
- `core/services/multi_agent_collaboration.py`: Old Langgraph-based cyclic orchestrator (CEO -> Planner -> Data Engineer...). Conflicts with the new linear pipeline.
- `core/services/reasoning_engine.py`: Deprecated DAG execution planner and dynamic dependency graph resolver.
- `core/services/intent_router.py`: Contains mock routing to non-existent engines (e.g., "Pandas Statistics Engine", "Agentix Brain").
