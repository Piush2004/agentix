"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Play, 
  UploadCloud, 
  FileText, 
  MessageSquare, 
  BrainCircuit,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Sparkles,
  Database,
  FlaskConical,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

export default function WorkspacePage() {
  const [data, setData] = useState<any>(null);
  const [workflowNodes, setWorkflowNodes] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [benchmarkStats, setBenchmarkStats] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = () => {
      fetch('/api/dashboard')
        .then(async res => {
          const text = await res.text();
          return text ? JSON.parse(text) : {};
        })
        .then(d => {
          if (!isMounted) return;
          const payload = d.data || d;
          setData(payload);
          if (payload?.workflow?.nodes) {
            setWorkflowNodes(payload.workflow.nodes);
          } else {
            setWorkflowNodes([
              { id: "dataset_upload", label: "Upload", status: "Completed" },
              { id: "profiling", label: "Profiling", status: "Completed" },
              { id: "cleaning", label: "Cleaning", status: "In Progress" },
              { id: "feature_engineering", label: "Feature Engineering", status: "Pending" },
              { id: "eda", label: "EDA", status: "Pending" },
              { id: "prediction", label: "Training", status: "Pending" },
              { id: "explainability", label: "SHAP Explain", status: "Pending" }
            ]);
          }
          if (payload?.activityLogs) {
             setActivityLogs(payload.activityLogs);
          }
          setIsLoading(false);
        })
        .catch(err => {
          if (!isMounted) return;
          console.error(err);
          setIsLoading(false);
        });
    };

    fetchData(); // Initial fetch
    
    // Fetch benchmark stats once
    fetch('/api/benchmark-stats')
      .then(res => res.json())
      .then(d => { if (isMounted) setBenchmarkStats(d.data || d); })
      .catch(() => {});
    
    // Poll every 3 seconds to get live workflow status
    const interval = setInterval(fetchData, 3000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const isComplete = workflowNodes.every(n => n.status === 'Completed');
  const activeIndex = workflowNodes.findIndex(n => n.status === 'In Progress');

  return (
    <div className="w-full h-full flex flex-col pt-8 px-8 pb-16 max-w-5xl mx-auto gap-12">
      
      {/* First Impression Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-4 font-heading">
            👋 Welcome back, Sarah
          </h1>
          <div className="text-lg text-text-secondary leading-relaxed max-w-2xl space-y-4">
            <p>Good morning.</p>
            <p>I've reviewed your recent analyses. You currently have:</p>
            <ul className="list-disc pl-5 space-y-2 font-medium text-text-primary">
              <li>{data?.recentDatasets?.length || 0} recent datasets</li>
              <li>{data?.recentReports?.length || 0} completed reports</li>
              <li>1 dataset that may need retraining</li>
            </ul>
            <p>Would you like me to continue where we left off?</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Play size={18} />
            Continue Previous Analysis
          </button>
          <Link href="/data-dock" className="px-6 py-3 rounded-xl bg-white border border-border text-text-primary font-medium hover:bg-surface-hover shadow-sm hover:shadow-md transition-all flex items-center gap-2">
            <UploadCloud size={18} />
            Upload New Dataset
          </Link>
          <Link href="/intelligence-reports" className="px-6 py-3 rounded-xl bg-white border border-border text-text-primary font-medium hover:bg-surface-hover shadow-sm hover:shadow-md transition-all flex items-center gap-2">
            <FileText size={18} />
            View Reports
          </Link>
          <Link href="/agent-console" className="px-6 py-3 rounded-xl bg-white border border-border text-text-primary font-medium hover:bg-surface-hover shadow-sm hover:shadow-md transition-all flex items-center gap-2">
            <MessageSquare size={18} />
            Start AI Chat
          </Link>
        </div>
      </motion.div>

      {/* Workflow Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-6">Current Workflow Progress</h2>
        <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex items-center min-w-max gap-2 relative">
            {isLoading ? (
               <div className="text-text-tertiary text-sm flex items-center gap-2"><Loader2 className="animate-spin" size={16}/> Loading workflow...</div>
            ) : (
              workflowNodes.map((step, idx) => {
                const isActive = step.status === 'In Progress';
                const isDone = step.status === 'Completed';
                return (
                  <React.Fragment key={step.id}>
                    <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${isActive ? 'scale-105' : 'scale-100 opacity-80'}`}>
                      <div className={`h-10 px-4 rounded-xl flex items-center justify-center font-bold text-[13px] border-2 transition-colors ${
                        isActive ? 'bg-primary border-primary text-white shadow-md' : 
                        isDone ? 'bg-primary-light border-primary-light text-primary' : 
                        'bg-surface border-border text-text-tertiary'
                      }`}>
                        {step.label}
                      </div>
                    </div>
                    {idx < workflowNodes.length - 1 && (
                      <div className="w-6 flex items-center justify-center text-border shrink-0">
                        <ArrowRight size={14} className={isDone ? 'text-primary' : 'text-border'} />
                      </div>
                    )}
                  </React.Fragment>
                )
              })
            )}
          </div>
        </div>
      </motion.div>

      {/* The AI Brain Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden relative w-full"
      >
        <div className="p-8 md:p-10">
          <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${!isComplete ? 'bg-primary-light text-primary ai-pulse-ring' : 'bg-surface-hover text-text-tertiary'}`}>
                <BrainCircuit size={36} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary font-heading">🧠 Agentix Brain</h2>
                <p className="text-text-secondary mt-1">
                  {!isComplete ? 'Thinking and analyzing data...' : 'Analysis complete. Ready for new tasks.'}
                </p>
              </div>
            </div>
            {!isComplete && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-primary-light text-primary border border-primary/20 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Active
              </span>
            )}
          </div>

          {/* Live Activity Feed */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
            <AnimatePresence>
              {isLoading ? (
                <div className="flex items-center gap-3 p-4 text-text-secondary"><Loader2 className="animate-spin" size={18}/> Fetching brain activity...</div>
              ) : activityLogs.length > 0 ? (
                activityLogs.map((log, idx) => {
                  return (
                    <motion.div 
                      key={log.id || idx}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-surface hover:bg-surface-hover border border-border transition-colors"
                    >
                      <div className="shrink-0">
                         <CheckCircle2 size={24} className="text-success" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[15px] text-text-primary font-bold">
                          {log.action}
                        </span>
                        <span className="text-[13px] text-text-tertiary">
                           {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <div className="p-4 text-text-secondary italic">No recent activity found.</div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Decision Intelligence & Benchmark Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden w-full"
      >
        <div className="p-8 md:p-10">
          <div className="flex items-center gap-4 mb-8 border-b border-border pb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600">
              <Sparkles size={36} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary font-heading">Decision Intelligence</h2>
              <p className="text-text-secondary mt-1">Meta-learning from {benchmarkStats?.total_benchmark_datasets || '...'} benchmark datasets &middot; {benchmarkStats?.total_experiments || '...'} experiments</p>
            </div>
          </div>

          {benchmarkStats ? (
            <div className="space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface rounded-2xl p-5 border border-border text-center">
                  <Database size={20} className="mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-text-primary">{benchmarkStats.total_benchmark_datasets}</div>
                  <div className="text-xs text-text-tertiary font-medium mt-1">Benchmark Datasets</div>
                </div>
                <div className="bg-surface rounded-2xl p-5 border border-border text-center">
                  <FlaskConical size={20} className="mx-auto mb-2 text-amber-500" />
                  <div className="text-2xl font-bold text-text-primary">{benchmarkStats.total_experiments}</div>
                  <div className="text-xs text-text-tertiary font-medium mt-1">Experiments Run</div>
                </div>
                <div className="bg-surface rounded-2xl p-5 border border-border text-center">
                  <Lightbulb size={20} className="mx-auto mb-2 text-emerald-500" />
                  <div className="text-2xl font-bold text-text-primary">{benchmarkStats.total_strategy_reasonings}</div>
                  <div className="text-xs text-text-tertiary font-medium mt-1">Strategy Reasonings</div>
                </div>
              </div>

              {/* Top Experiments Leaderboard */}
              <div>
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingUp size={14} /> Top Performing Strategies
                </h3>
                <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface-hover">
                        <th className="text-left p-3 text-text-tertiary font-bold text-xs uppercase">Dataset</th>
                        <th className="text-left p-3 text-text-tertiary font-bold text-xs uppercase">Model</th>
                        <th className="text-left p-3 text-text-tertiary font-bold text-xs uppercase">Imputation</th>
                        <th className="text-left p-3 text-text-tertiary font-bold text-xs uppercase">Scaling</th>
                        <th className="text-right p-3 text-text-tertiary font-bold text-xs uppercase">CV Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(benchmarkStats.top_experiments || []).slice(0, 5).map((exp: any, i: number) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                          <td className="p-3 font-medium text-text-primary">{exp.dataset}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded-lg bg-primary-light text-primary text-xs font-bold">{exp.model}</span>
                          </td>
                          <td className="p-3 text-text-secondary">{exp.imputation}</td>
                          <td className="p-3 text-text-secondary">{exp.scaling}</td>
                          <td className="p-3 text-right font-bold text-emerald-600">{exp.cv_score?.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-xs text-text-tertiary italic">
                When you upload a new dataset, Agentix will compare it against these benchmarks and recommend the optimal preprocessing and model strategy.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 text-text-secondary">
              <Loader2 className="animate-spin" size={18} /> Loading benchmark intelligence...
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
}
