import platform
import psutil
import subprocess
import shutil
import sys
import os
from typing import Dict, Any

class HardwareDetector:
    @staticmethod
    def get_cpu_info() -> Dict[str, Any]:
        info = {
            "cores_physical": psutil.cpu_count(logical=False) or 0,
            "cores_logical": psutil.cpu_count(logical=True) or 0,
            "usage_percent": psutil.cpu_percent(interval=0.1),
        }
        try:
            freq = psutil.cpu_freq()
            if freq:
                info["clock_speed_mhz"] = freq.current
                info["max_clock_speed_mhz"] = freq.max
        except Exception:
            pass
        return info

    @staticmethod
    def get_ram_info() -> Dict[str, Any]:
        vm = psutil.virtual_memory()
        return {
            "total_gb": round(vm.total / (1024**3), 2),
            "available_gb": round(vm.available / (1024**3), 2),
            "usage_percent": vm.percent
        }

    @staticmethod
    def get_gpu_info() -> Dict[str, Any]:
        # Try using nvidia-smi if available
        gpu_info = {"available": False, "vendor": None, "model": None, "vram_total_mb": 0, "cuda_available": False}
        if shutil.which("nvidia-smi"):
            try:
                # Get GPU name
                name_result = subprocess.run(["nvidia-smi", "--query-gpu=name", "--format=csv,noheader"], capture_output=True, text=True, check=True)
                # Get Memory
                mem_result = subprocess.run(["nvidia-smi", "--query-gpu=memory.total", "--format=csv,noheader,nounits"], capture_output=True, text=True, check=True)
                
                names = name_result.stdout.strip().split('\n')
                mems = mem_result.stdout.strip().split('\n')
                
                if names and mems:
                    gpu_info["available"] = True
                    gpu_info["vendor"] = "NVIDIA"
                    gpu_info["model"] = names[0]
                    gpu_info["vram_total_mb"] = int(mems[0])
                    gpu_info["cuda_available"] = True
            except Exception:
                pass
        return gpu_info

    @staticmethod
    def get_disk_info() -> Dict[str, Any]:
        disk = psutil.disk_usage('/')
        return {
            "total_gb": round(disk.total / (1024**3), 2),
            "free_gb": round(disk.free / (1024**3), 2),
            "usage_percent": disk.percent
        }

    @staticmethod
    def get_system_info() -> Dict[str, Any]:
        return {
            "os": platform.system(),
            "os_release": platform.release(),
            "python_version": sys.version.split(' ')[0],
            "machine": platform.machine()
        }
        
    @staticmethod
    def get_installed_binaries() -> Dict[str, bool]:
        return {
            "docker": shutil.which("docker") is not None,
            "redis-server": shutil.which("redis-server") is not None,
            "psql": shutil.which("psql") is not None,
            "ollama": shutil.which("ollama") is not None
        }

    @classmethod
    def scan(cls) -> Dict[str, Any]:
        return {
            "system": cls.get_system_info(),
            "cpu": cls.get_cpu_info(),
            "ram": cls.get_ram_info(),
            "gpu": cls.get_gpu_info(),
            "disk": cls.get_disk_info(),
            "binaries": cls.get_installed_binaries()
        }
