"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Key, Zap, Settings, ExternalLink, ShieldCheck } from 'lucide-react';

export default function LLMManagerPage() {
  const providers = [
    { name: 'OpenAI', model: 'gpt-4o', status: 'Active', latency: '450ms', cost: '$420.50', icon: 'O' },
    { name: 'Anthropic', model: 'claude-3-opus', status: 'Active', latency: '620ms', cost: '$180.20', icon: 'A' },
    { name: 'Google', model: 'gemini-1.5-pro', status: 'Standby', latency: '--', cost: '$12.00', icon: 'G' },
    { name: 'Local (Ollama)', model: 'llama-3-70b', status: 'Offline', latency: '--', cost: '$0.00', icon: 'L' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">LLM Provider Manager</h1>
          <p className="text-slate-500 mt-1">Configure models, API keys, and routing rules.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
          Add Provider
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((provider, idx) => (
          <motion.div 
            key={provider.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                  {provider.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{provider.name}</h3>
                  <p className="text-sm text-slate-500 font-mono mt-0.5">{provider.model}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                provider.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                provider.status === 'Standby' ? 'bg-amber-100 text-amber-700' : 
                'bg-slate-100 text-slate-500'
              }`}>
                {provider.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Zap className="w-3 h-3"/> Avg Latency</p>
                <p className="text-lg font-semibold text-slate-800">{provider.latency}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> MTD Cost</p>
                <p className="text-lg font-semibold text-slate-800">{provider.cost}</p>
              </div>
            </div>

            <div className="mt-auto flex gap-2">
              <button className="flex-1 flex justify-center items-center gap-2 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Key className="w-4 h-4" /> API Keys
              </button>
              <button className="flex-1 flex justify-center items-center gap-2 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4">
        <div className="bg-indigo-100 p-3 rounded-xl shrink-0">
          <Bot className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-indigo-900">Smart Routing Enabled</h3>
          <p className="text-sm text-indigo-700 mt-1 max-w-2xl">
            The platform is currently routing complex tasks to <strong>GPT-4o</strong> and standard tasks to <strong>Claude-3-Opus</strong> to optimize for cost and performance automatically.
          </p>
          <button className="mt-3 text-sm font-medium text-indigo-600 flex items-center gap-1 hover:text-indigo-800">
            Configure Routing Rules <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
