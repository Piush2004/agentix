"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Table as TableIcon, Plus, Play, Code2, RefreshCcw } from 'lucide-react';

export default function DatabaseManagerPage() {
  const tables = [
    { name: 'users', rows: '12,483', size: '45 MB', status: 'Healthy' },
    { name: 'conversations', rows: '142,091', size: '1.2 GB', status: 'Healthy' },
    { name: 'agent_logs', rows: '2.4M', size: '18.4 GB', status: 'Optimizing' },
    { name: 'workflows', rows: '842', size: '2 MB', status: 'Healthy' },
    { name: 'api_keys', rows: '4,102', size: '1 MB', status: 'Healthy' },
  ];

  const [query, setQuery] = useState('SELECT * FROM users LIMIT 10;');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Database Manager</h1>
          <p className="text-slate-500 mt-1">Manage schemas, view tables, and execute raw SQL queries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SQL Console */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                <Code2 className="w-4 h-4" /> SQL Query
              </div>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-medium transition-colors">
                <Play className="w-3 h-3 fill-current" /> Run Query
              </button>
            </div>
            <textarea 
              className="w-full h-40 bg-slate-900 text-emerald-400 font-mono p-4 focus:outline-none resize-none text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck="false"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 text-sm font-semibold text-slate-700">
              Query Results
            </div>
            <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
              <TableIcon className="w-8 h-8 text-slate-200" />
              Run a query to see results here.
            </div>
          </div>
        </motion.div>

        {/* Schema Explorer */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col"
        >
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-500" /> Tables
            </h2>
            <button className="text-slate-400 hover:text-slate-900">
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-slate-50">
              {tables.map((table) => (
                <li key={table.name} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{table.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      table.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {table.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{table.rows} rows</span>
                    <span>{table.size}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 border-t border-slate-100">
            <button className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all">
              <Plus className="w-4 h-4" /> New Table
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
