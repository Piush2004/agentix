"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Network, Plus, GitBranch, Zap, MoreHorizontal } from 'lucide-react';

export default function WorkflowManagerPage() {
  const workflows = [
    { name: 'Daily Data Aggregation', type: 'Scheduled', runs: '24', successRate: '100%', active: true },
    { name: 'Email Lead Extraction', type: 'Webhook', runs: '1,492', successRate: '98.5%', active: true },
    { name: 'Customer Sentiment Alert', type: 'Trigger', runs: '84', successRate: '92.1%', active: false },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Workflow Manager</h1>
          <p className="text-slate-500 mt-1">Design and monitor agentic automations and pipelines.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Sidebar List */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-semibold text-slate-900">Active Workflows</h2>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {workflows.map((wf, idx) => (
              <div key={wf.name} className={`p-4 cursor-pointer transition-colors ${idx === 0 ? 'bg-indigo-50/50 border-l-4 border-indigo-500' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold text-sm ${idx === 0 ? 'text-indigo-900' : 'text-slate-700'}`}>{wf.name}</h3>
                  <div className={`w-2 h-2 rounded-full ${wf.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {wf.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Editor Placeholder */}
        <div className="lg:col-span-3 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative flex flex-col">
          <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 p-4 border-b border-slate-200 bg-white/80 backdrop-blur flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-slate-900">Daily Data Aggregation</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">Running</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center p-8">
            {/* Diagram Placeholder */}
            <div className="flex flex-col items-center gap-6">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-4 rounded-xl shadow-md border border-slate-200 w-64 text-center">
                <div className="bg-amber-100 text-amber-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"><Zap className="w-4 h-4" /></div>
                <h4 className="font-semibold text-sm text-slate-900">Cron Trigger</h4>
                <p className="text-xs text-slate-500">Every day at 00:00 UTC</p>
              </motion.div>
              
              <div className="w-0.5 h-8 bg-slate-300"></div>

              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-4 rounded-xl shadow-md border border-slate-200 w-64 text-center">
                <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"><Network className="w-4 h-4" /></div>
                <h4 className="font-semibold text-sm text-slate-900">Data Fetch Agent</h4>
                <p className="text-xs text-slate-500">Extract from 3 sources</p>
              </motion.div>

              <div className="w-0.5 h-8 bg-slate-300"></div>
              
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-4 rounded-xl shadow-md border border-slate-200 w-64 text-center">
                <div className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"><GitBranch className="w-4 h-4" /></div>
                <h4 className="font-semibold text-sm text-slate-900">Summary Generator</h4>
                <p className="text-xs text-slate-500">LLM Processing</p>
              </motion.div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
