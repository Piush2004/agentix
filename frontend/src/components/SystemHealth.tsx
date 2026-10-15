"use client";
import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Server, Thermometer, CheckCircle2, AlertCircle } from 'lucide-react';

interface HealthData {
  cpu: { usage_percent: number; cores_logical: number };
  ram: { total_gb: number; available_gb: number; usage_percent: number };
  gpu: { available: boolean; vendor: string | null; model: string | null; vram_total_mb: number };
  ollama: { online: boolean; models: { name: string }[] };
}

export function SystemHealthDashboard({ simplified = false }: { simplified?: boolean }) {
  // Real hardware/AI-runtime status from HardwareDetector.scan() via
  // /platform/system-health - this card used to hold static "Mock data"
  // (a hardcoded "Llama 3 (8B) - Active" and CPU/GPU numbers that randomly
  // drifted every 2 seconds via Math.random()) labeled "Real-time resource
  // utilization", which is exactly the fabricated-as-live pattern this
  // audit exists to remove.
  const [health, setHealth] = useState<HealthData | null>(null);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const backendBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const fetchHealth = () => {
      fetch(`${backendBase}/api/v1/platform/system-health`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(json => {
          if (!isMounted) return;
          setHealth(json?.data || null);
          setOnline(true);
        })
        .catch(() => {
          if (isMounted) setOnline(false);
        });
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  const modelName = health?.ollama?.online ? health.ollama.models?.[0]?.name : null;

  if (simplified) {
    const healthy = online && !!health;
    return (
      <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden w-full p-8 md:p-10 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl text-white shadow-lg ${healthy ? 'bg-gradient-to-br from-indigo-500 to-cyan-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
            {healthy ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 font-heading tracking-tight">Your AI Assistant</h2>
            <p className="text-gray-500 mt-1 font-medium">
              {!online ? 'Backend is unreachable right now.' : modelName ? `Running smoothly on ${modelName}.` : 'Backend is online, but no local AI model is loaded.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden w-full p-8 md:p-10 transition-all duration-300">
      <div className="flex items-center gap-4 mb-8 border-b border-gray-200/50 pb-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg">
          <Activity size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-heading tracking-tight">System Health & AI Resources</h2>
          <p className="text-gray-500 mt-1 font-medium">{online ? 'Real-time resource utilization' : 'Backend unreachable — showing last known state'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* CPU */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4 text-indigo-600">
            <Cpu size={20} />
            <span className="font-semibold text-sm">CPU Usage</span>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-800">{health ? `${health.cpu.usage_percent.toFixed(1)}%` : '—'}</div>
            <div className="w-full bg-gray-200/50 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${health?.cpu.usage_percent ?? 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* GPU */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4 text-purple-600">
            <Server size={20} />
            <span className="font-semibold text-sm">GPU</span>
          </div>
          <div>
            {/* No live utilization % is queried from nvidia-smi today - showing
                the real detected model/VRAM instead of fabricating a usage bar. */}
            <div className="text-sm font-bold text-gray-800 leading-tight">{health?.gpu.available ? health.gpu.model : (health ? 'No GPU detected' : '—')}</div>
            {health?.gpu.available && <div className="text-xs text-gray-500 mt-1">{(health.gpu.vram_total_mb / 1024).toFixed(1)} GB VRAM</div>}
          </div>
        </div>

        {/* VRAM -> repurposed as Disk-free-adjacent RAM available, still real */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4 text-cyan-600">
            <HardDrive size={20} />
            <span className="font-semibold text-sm">RAM Available</span>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-800">{health ? health.ram.available_gb : '—'} <span className="text-lg text-gray-500">/ {health ? health.ram.total_gb : '—'} GB</span></div>
            <div className="w-full bg-gray-200/50 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${health ? 100 - health.ram.usage_percent : 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* System RAM usage */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4 text-emerald-600">
            <Thermometer size={20} />
            <span className="font-semibold text-sm">RAM Usage</span>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-800">{health ? `${health.ram.usage_percent.toFixed(1)}%` : '—'}</div>
            <div className="w-full bg-gray-200/50 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${health?.ram.usage_percent ?? 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-md rounded-2xl p-5 border border-blue-100/50 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${modelName ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="font-bold text-gray-700">Active AI Model</span>
         </div>
         <span className="px-4 py-1.5 bg-white/80 backdrop-blur-sm text-indigo-700 font-bold rounded-lg text-sm shadow-sm">{modelName || (health ? 'None loaded' : '—')}</span>
      </div>
    </div>
  );
}
