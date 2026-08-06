"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Clock, Cpu, FlaskConical, TrendingUp, Loader2, UploadCloud } from 'lucide-react';
import { usePlatformStore } from '@/store/platformStore';
import Link from 'next/link';

export default function HistoryPage() {
  const fetchHistory = usePlatformStore(state => state.fetchHistory);
  const [runs, setRuns] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await fetchHistory();
      setRuns(data.runs || []);
      setActivity(data.activity || []);
      setIsLoading(false);
    };
    load();
  }, [fetchHistory]);

  const hasData = runs.length > 0 || activity.length > 0;

  return (
    <div className="w-full flex flex-col gap-8 pb-12 max-w-6xl mx-auto pt-4 px-4 md:px-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary font-heading">History</h1>
        <p className="text-text-secondary max-w-2xl text-[15px]">View your past workflows, experiments, and activity logs.</p>
      </div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]"
        >
          <Loader2 size={36} className="text-primary animate-spin mb-4" />
          <p className="text-text-secondary">Loading history...</p>
        </motion.div>
      ) : !hasData ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]"
        >
          <div className="w-20 h-20 rounded-full bg-surface-hover text-text-tertiary flex items-center justify-center mb-6">
            <History size={36} />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-2 font-heading">
            No history found
          </h3>
          <p className="text-text-secondary text-[15px] max-w-[280px] mb-6">
            Upload a dataset and run a workflow to populate your history.
          </p>
          <Link href="/data-dock" className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all flex items-center gap-2">
            <UploadCloud size={18} /> Upload Dataset
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Experiment Runs */}
          {runs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2 font-heading">
                  <FlaskConical size={20} className="text-primary" /> Experiment Runs
                </h2>
              </div>
              <div className="divide-y divide-border">
                {runs.map((run: any, i: number) => (
                  <div key={i} className="p-5 hover:bg-surface transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                        <Cpu size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{run.dataset || run.name || `Experiment #${i + 1}`}</p>
                        <p className="text-sm text-text-tertiary">{run.model || run.algorithm || 'Unknown model'} &bull; {run.created_at ? new Date(run.created_at).toLocaleDateString() : 'Recent'}</p>
                      </div>
                    </div>
                    {run.score !== undefined && (
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-emerald-500" />
                        <span className="text-sm font-bold text-emerald-600">{typeof run.score === 'number' ? run.score.toFixed(4) : run.score}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Activity Log */}
          {activity.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2 font-heading">
                  <Clock size={20} className="text-accent" /> Activity Log
                </h2>
              </div>
              <div className="divide-y divide-border">
                {activity.slice(0, 20).map((item: any, i: number) => (
                  <div key={i} className="p-4 hover:bg-surface transition-colors flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-text-primary">{item.action || item.type || item.message || 'Activity'}</p>
                      <p className="text-xs text-text-tertiary">{item.created_at ? new Date(item.created_at).toLocaleString() : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
