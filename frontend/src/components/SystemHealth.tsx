"use client";
import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Server, Thermometer, CheckCircle2 } from 'lucide-react';

export function SystemHealthDashboard({ simplified = false }: { simplified?: boolean }) {
  // Mock data
  const [metrics, setMetrics] = useState({
    cpu: 45,
    gpu: 72,
    vram: 8.4, // out of 16 GB
    ram: 14.2, // out of 32 GB
    disk: 64, // percentage
    model: 'Llama 3 (8B) - Active'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(10, Math.min(100, prev.cpu + (Math.random() * 10 - 5))),
        gpu: Math.max(20, Math.min(100, prev.gpu + (Math.random() * 15 - 7))),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (simplified) {
    return (
      <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden w-full p-8 md:p-10 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 font-heading tracking-tight">Your AI Assistant</h2>
            <p className="text-gray-500 mt-1 font-medium">Running smoothly — no action needed from you.</p>
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
          <p className="text-gray-500 mt-1 font-medium">Real-time resource utilization</p>
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
            <div className="text-3xl font-black text-gray-800">{metrics.cpu.toFixed(1)}%</div>
            <div className="w-full bg-gray-200/50 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${metrics.cpu}%` }}></div>
            </div>
          </div>
        </div>

        {/* GPU */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4 text-purple-600">
            <Server size={20} />
            <span className="font-semibold text-sm">GPU Usage</span>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-800">{metrics.gpu.toFixed(1)}%</div>
            <div className="w-full bg-gray-200/50 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-purple-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${metrics.gpu}%` }}></div>
            </div>
          </div>
        </div>

        {/* VRAM */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4 text-cyan-600">
            <HardDrive size={20} />
            <span className="font-semibold text-sm">VRAM</span>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-800">{metrics.vram} <span className="text-lg text-gray-500">/ 16 GB</span></div>
            <div className="w-full bg-gray-200/50 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${(metrics.vram/16)*100}%` }}></div>
            </div>
          </div>
        </div>

        {/* System RAM */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4 text-emerald-600">
            <Thermometer size={20} />
            <span className="font-semibold text-sm">System RAM</span>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-800">{metrics.ram} <span className="text-lg text-gray-500">/ 32 GB</span></div>
            <div className="w-full bg-gray-200/50 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(metrics.ram/32)*100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-md rounded-2xl p-5 border border-blue-100/50 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-bold text-gray-700">Active AI Model</span>
         </div>
         <span className="px-4 py-1.5 bg-white/80 backdrop-blur-sm text-indigo-700 font-bold rounded-lg text-sm shadow-sm">{metrics.model}</span>
      </div>
    </div>
  );
}
