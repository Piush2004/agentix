import os
import subprocess
import json
from typing import Dict, List, Any

class ModelRegistry:
    @staticmethod
    def get_ollama_models() -> List[Dict[str, Any]]:
        """Query local Ollama instance for installed models."""
        models = []
        try:
            # ollama list output parsing or using ollama CLI
            result = subprocess.run(["ollama", "list"], capture_output=True, text=True, check=True)
            lines = result.stdout.strip().split('\n')[1:] # Skip header
            for line in lines:
                if line:
                    parts = line.split()
                    name = parts[0]
                    model_id = parts[1]
                    size = parts[2]
                    modified = " ".join(parts[3:])
                    models.append({
                        "name": name,
                        "id": model_id,
                        "size": size,
                        "modified": modified
                    })
        except Exception as e:
            # Ollama not installed or not running
            pass
        return models

    @classmethod
    def get_registry(cls) -> Dict[str, Any]:
        """Returns the full model registry including Ollama models and available external models."""
        ollama_models = cls.get_ollama_models()
        return {
            "local_ollama_models": ollama_models,
            "has_local_llm": len(ollama_models) > 0,
            # Real check instead of assuming standard configuration has Gemini keys
            "gemini_available": bool(os.getenv("GEMINI_API_KEY"))
        }
