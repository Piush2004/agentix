"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Server, Cpu, Network, AlertTriangle } from 'lucide-react';

export default function MonitoringPage() {
  const metrics = [
    { label: 'CPU Usage', value: '48%', color: 'text-indigo-500', bar: 'bg-indigo-500', width: '48%' },
    { label: 'Memory', value: '72%', color: 'text-amber-500', bar: 'bg-amber-500', width: '72%' },
    { label: 'Storage', value: '31%', color: 'text-emerald-500', bar: 'bg-emerald-500', width: '31%' },
    { label: 'Network I/O', value: '65%', color: 'text-sky-500', bar: 'bg-sky-500', width: '65%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Monitoring</h1>
          <p className="text-slate-500 mt-1">Real-time infrastructure health and performance metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 text-sm font-medium">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          All Systems Operational
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Throughput (Requests/sec)</h2>
            <select className="text-sm bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-600 focus:outline-none">
              <option>Last 1 Hour</option>
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          
          <div className="h-72 w-full flex items-end gap-1">
            {/* Simulated wave chart */}
            {[...Array(40)].map((_, i) => {
              const height = 30 + Math.sin(i * 0.5) * 20 + Math.random() * 30;
              return (
                <div key={i} className="flex-1 bg-indigo-50 rounded-t-sm relative group hover:bg-indigo-100 transition-colors">
                  <div 
                    className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm"
                    style={{ height: `${height}%` }}
                  />
                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded pointer-events-none z-10 whitespace-nowrap">
                    {Math.round(height * 10)} req/s
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Resource Utilization</h2>
          
          <div className="space-y-5">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-slate-600">{metric.label}</span>
                  <span className={`text-sm font-bold ${metric.color}`}>{metric.value}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: metric.width }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={`h-full ${metric.bar} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-slate-400" /> Infrastructure Nodes
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-emerald-100 bg-emerald-50/50 p-3 rounded-xl flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-medium">Worker Nodes</span>
                <span className="text-xl font-bold text-slate-900">12/12</span>
              </div>
              <div className="border border-amber-100 bg-amber-50/50 p-3 rounded-xl flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-medium">GPU Nodes</span>
                <span className="text-xl font-bold text-slate-900">3/4</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
