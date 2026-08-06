"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, MessageSquare, ShieldAlert, Activity, PlayCircle, PauseCircle } from 'lucide-react';

export default function BrainConsolePage() {
  const agents = [
    { name: 'Research_Core', role: 'Data Gatherer', status: 'Active', tasks: 12, memory: '1.2GB' },
    { name: 'Code_Synthesis', role: 'DevOps', status: 'Idle', tasks: 0, memory: '400MB' },
    { name: 'Data_Analyzer', role: 'Analytics', status: 'Processing', tasks: 3, memory: '2.8GB' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Brain Console</h1>
          <p className="text-slate-500 mt-1">Central command for your autonomous AI workforce.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
            Halt All Agents
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Spawn Agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Agent Roster */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Agent Swarm Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent, idx) => (
              <motion.div 
                key={agent.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
                      <Cpu className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{agent.name}</h3>
                      <p className="text-xs text-slate-500">{agent.role}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                    {agent.status === 'Idle' ? <PlayCircle className="w-6 h-6" /> : <PauseCircle className="w-6 h-6" />}
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Status</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      agent.status === 'Active' || agent.status === 'Processing' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Active Tasks</p>
                    <p className="text-sm font-semibold text-slate-800">{agent.tasks}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Memory</p>
                    <p className="text-sm font-semibold text-slate-800">{agent.memory}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global Control & Alerts */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl shadow-sm p-6 text-white overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-indigo-400" /> Global Metrics
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1 text-slate-300">
                  <span>Swarm CPU Load</span>
                  <span className="font-mono">78%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-indigo-400 h-1.5 rounded-full w-[78%]"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1 text-slate-300">
                  <span>API Quota (Today)</span>
                  <span className="font-mono">42%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-emerald-400 h-1.5 rounded-full w-[42%]"></div></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" /> System Events
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="font-medium text-slate-800">Agent spawned successfully</p>
                  <p className="text-xs text-slate-500">Data_Analyzer initialized at 09:40</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="font-medium text-slate-800">Rate limit approaching</p>
                  <p className="text-xs text-slate-500">OpenAI GPT-4 quota at 80%</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="font-medium text-slate-800">Task completed</p>
                  <p className="text-xs text-slate-500">Research_Core finished web scraping</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
