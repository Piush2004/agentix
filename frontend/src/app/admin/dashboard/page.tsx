"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Database, 
  Zap, 
  ArrowUpRight,
  BrainCircuit,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { name: 'Total Users', value: '12,483', change: '+14%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Active Agents', value: '842', change: '+5%', icon: BrainCircuit, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: 'Queries / hr', value: '45.2k', change: '+22%', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Database Load', value: '42%', change: '-4%', icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Platform overview and real-time metrics.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.name}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-900">System Activity</h2>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View Details</button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {/* Placeholder Chart */}
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-full bg-slate-100 rounded-t-md relative group">
                <div 
                  className="absolute bottom-0 w-full bg-indigo-500 rounded-t-md transition-all duration-500 group-hover:bg-indigo-400"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-4">
            <span>00:00</span>
            <span>12:00</span>
            <span>24:00</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Recent Alerts</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="bg-amber-50 p-2 rounded-full mt-1 shrink-0">
                  <Activity className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900">High API Latency</h4>
                  <p className="text-xs text-slate-500 mt-1">OpenAI endpoint took &gt;2s for 15 requests.</p>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                    <Clock className="w-3 h-3" />
                    <span>{i * 10} mins ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
