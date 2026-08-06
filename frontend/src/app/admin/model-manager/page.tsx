"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Box, CheckCircle2, XCircle, AlertCircle, RefreshCw, Play } from 'lucide-react';

export default function ModelManagerPage() {
  const models = [
    { name: 'Predictive_Churn_v2', type: 'XGBoost', status: 'running', accuracy: '94.2%', latency: '42ms', requests: '1.2M' },
    { name: 'Sentiment_Analyzer_En', type: 'DistilBERT', status: 'running', accuracy: '89.5%', latency: '115ms', requests: '840k' },
    { name: 'Demand_Forecast_Q3', type: 'Prophet', status: 'failed', accuracy: '--', latency: '--', requests: '0' },
    { name: 'Fraud_Detection_RT', type: 'RandomForest', status: 'training', accuracy: '98.1%', latency: '22ms', requests: '3.1M' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Model Manager</h1>
          <p className="text-slate-500 mt-1">Deploy, monitor, and retrain custom ML models.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <Box className="w-4 h-4" />
          Deploy New Model
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {models.map((model, idx) => (
          <motion.div 
            key={model.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <Box className="w-5 h-5 text-slate-600" />
              </div>
              {model.status === 'running' && <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium"><CheckCircle2 className="w-3 h-3"/> Active</span>}
              {model.status === 'failed' && <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-full text-xs font-medium"><XCircle className="w-3 h-3"/> Failed</span>}
              {model.status === 'training' && <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-medium"><RefreshCw className="w-3 h-3 animate-spin"/> Training</span>}
            </div>
            
            <h3 className="text-base font-bold text-slate-900 truncate" title={model.name}>{model.name}</h3>
            <p className="text-xs text-slate-500 mb-4">{model.type}</p>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-auto">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Accuracy</p>
                <p className="text-sm font-medium text-slate-800">{model.accuracy}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Latency</p>
                <p className="text-sm font-medium text-slate-800">{model.latency}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Requests (30d)</p>
                <p className="text-sm font-medium text-slate-800">{model.requests}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
              <button className="flex-1 flex justify-center items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-1.5 rounded-md text-xs font-medium transition-colors">
                <Settings className="w-3 h-3" /> Config
              </button>
              {model.status !== 'training' && (
                <button className="flex-1 flex justify-center items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1.5 rounded-md text-xs font-medium transition-colors">
                  <Play className="w-3 h-3" /> Test
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Inline fallback for missing icon
function Settings(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
}
