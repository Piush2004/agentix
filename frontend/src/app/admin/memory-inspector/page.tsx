"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Database, HardDrive, Cpu, Filter, MoreVertical } from 'lucide-react';

export default function MemoryInspectorPage() {
  const [search, setSearch] = useState('');

  const memoryBlocks = [
    { id: 'mem-892', agent: 'SupportBot', type: 'Vector', tokens: '4,200', lastAccessed: '2 mins ago', status: 'Active' },
    { id: 'mem-893', agent: 'SalesAssist', type: 'Relational', tokens: '1,050', lastAccessed: '15 mins ago', status: 'Active' },
    { id: 'mem-894', agent: 'CodeCopilot', type: 'Context Window', tokens: '124,000', lastAccessed: '1 hr ago', status: 'Archived' },
    { id: 'mem-895', agent: 'DataAnalyzer', type: 'Vector', tokens: '89,100', lastAccessed: '3 hrs ago', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Memory Inspector</h1>
          <p className="text-slate-500 mt-1">View and manage agent memory contexts and vector embeddings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-purple-50 p-3 rounded-xl">
            <Database className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Vector Storage</p>
            <p className="text-2xl font-bold text-slate-900">42.5 GB</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-sky-50 p-3 rounded-xl">
            <HardDrive className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Relational Cache</p>
            <p className="text-2xl font-bold text-slate-900">12.1 GB</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-rose-50 p-3 rounded-xl">
            <Cpu className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Contexts</p>
            <p className="text-2xl font-bold text-slate-900">1,204</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search memory IDs or agents..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Memory ID</th>
                <th className="px-6 py-4">Agent</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Tokens</th>
                <th className="px-6 py-4">Last Accessed</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {memoryBlocks.map((block, idx) => (
                <motion.tr 
                  key={block.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 font-mono text-indigo-600">{block.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{block.agent}</td>
                  <td className="px-6 py-4 text-slate-600">{block.type}</td>
                  <td className="px-6 py-4 text-slate-600">{block.tokens}</td>
                  <td className="px-6 py-4 text-slate-500">{block.lastAccessed}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      block.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {block.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-900 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>Showing 1 to 4 of 4 results</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
