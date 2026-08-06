"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, History, ChevronRight, PenTool } from 'lucide-react';

export default function PromptManagerPage() {
  const prompts = [
    { name: 'Customer_Support_T1', version: 'v2.4', lastEdited: '2 hours ago', status: 'Production', testScore: '92%' },
    { name: 'Code_Review_Agent', version: 'v1.1', lastEdited: '1 day ago', status: 'Testing', testScore: '78%' },
    { name: 'Data_Extraction_JSON', version: 'v3.0', lastEdited: '3 days ago', status: 'Production', testScore: '99%' },
    { name: 'Sentiment_Analysis', version: 'v1.0', lastEdited: '5 days ago', status: 'Draft', testScore: '--' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Prompt Manager</h1>
          <p className="text-slate-500 mt-1">Version control and A/B testing for system prompts.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <PenTool className="w-4 h-4" />
          Create Prompt
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search prompts by name or tag..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {prompts.map((prompt, idx) => (
            <motion.div 
              key={prompt.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100/50">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{prompt.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span className="font-mono bg-slate-100 px-1.5 rounded text-xs text-slate-600">{prompt.version}</span>
                    <span className="flex items-center gap-1"><History className="w-3 h-3" /> {prompt.lastEdited}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full sm:w-auto mt-4 sm:mt-0 justify-between sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Test Score</p>
                  <p className="text-sm font-medium text-slate-800">{prompt.testScore}</p>
                </div>
                
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  prompt.status === 'Production' ? 'bg-emerald-100 text-emerald-700' : 
                  prompt.status === 'Testing' ? 'bg-amber-100 text-amber-700' : 
                  'bg-slate-100 text-slate-600'
                }`}>
                  {prompt.status}
                </span>

                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors hidden sm:block" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
