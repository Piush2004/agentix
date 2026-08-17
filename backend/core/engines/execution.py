from typing import Any, Optional, Dict
from .base import ProcessingEngine, PandasEngine, ChunkedPandasEngine, DaskEngine
from ..hardware import HardwareDetector, ModelRegistry
import logging

logger = logging.getLogger("agentix_v2")

class ExecutionEngine:
    @staticmethod
    def get_optimal_engine(dataset_size_mb: float = 0.0, config_engine: Optional[str] = None) -> ProcessingEngine:
        if config_engine == "pandas":
            return PandasEngine()
        elif config_engine == "chunked":
            return ChunkedPandasEngine()
        elif config_engine == "dask":
            return DaskEngine()
            
        hardware = HardwareDetector.scan()
        ram = hardware.get("ram", {})
        available_ram_gb = ram.get("available_gb", 4.0) # Default to 4GB safe fallback

        # Convert available RAM to MB and keep a 3x overhead buffer for operations
        safe_memory_limit_mb = (available_ram_gb * 1024) / 3

        logger.info(f"[ExecutionEngine] Hardware Scan: Available RAM={available_ram_gb}GB. Dataset size={dataset_size_mb}MB.")

        # Logic for adaptive execution engine routing
        if dataset_size_mb < safe_memory_limit_mb and dataset_size_mb < 500:
            logger.info("[ExecutionEngine] Routing to PandasEngine (Fits safely in RAM)")
            return PandasEngine()
        elif dataset_size_mb < (safe_memory_limit_mb * 2):
            logger.info("[ExecutionEngine] Routing to ChunkedPandasEngine (Approaching RAM limits)")
            return ChunkedPandasEngine(chunksize=100000)
        else:
            logger.info("[ExecutionEngine] Routing to DaskEngine (Out of core processing required)")
            return DaskEngine()
            
    @staticmethod
    def select_llm_provider(task_type: str = "general") -> Dict[str, Any]:
        """Dynamically routes to Ollama if models exist, otherwise fallback to Gemini."""
        registry = ModelRegistry.get_registry()
        
        if registry.get("has_local_llm"):
            models = registry.get("local_ollama_models", [])
            # For this simple prototype, pick the first available local model
            if models:
                model_name = models[0].get("name")
                logger.info(f"[ExecutionEngine] Routing LLM to local Ollama model: {model_name}")
                return {"provider": "ollama", "model": model_name}
                
        logger.info("[ExecutionEngine] No local LLM found. Routing LLM to Gemini fallback.")
        return {"provider": "gemini", "model": "gemini-1.5-pro"}
