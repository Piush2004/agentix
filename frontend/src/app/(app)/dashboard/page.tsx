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
import { useSession } from 'next-auth/react';
import { getTerm } from '@/lib/terminology';
import { SystemHealthDashboard } from '@/components/SystemHealth';
import { useAiPersona } from '@/hooks/useAiPersona';

export default function WorkspacePage() {
  const { isExecutive } = useAiPersona();
  const { data: session } = useSession();
  const displayName = session?.user?.name?.split(' ')[0] || session?.user?.email?.split('@')[0] || 'there';
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
              { id: "profiling", label: getTerm("Profiling"), status: "Completed" },
              { id: "cleaning", label: getTerm("Cleaning"), status: "In Progress" },
              { id: "feature_engineering", label: getTerm("Feature Engineering"), status: "Pending" },
              { id: "eda", label: getTerm("EDA"), status: "Pending" },
              { id: "prediction", label: getTerm("Training"), status: "Pending" },
              { id: "explainability", label: getTerm("SHAP Explain"), status: "Pending" }
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

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-800 font-sans">
      <div className="w-full flex flex-col pt-12 px-8 pb-20 max-w-6xl mx-auto gap-12 relative z-10">
        
        {/* First Impression Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6"
        >
          <div>
            <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-6 font-heading bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Welcome back, {displayName}
            </h1>
            <div className="text-[17px] text-gray-600 leading-relaxed max-w-2xl space-y-4">
              <p>Good morning. Let's build something extraordinary today.</p>
              <p>I've reviewed your recent analyses. You currently have:</p>
              <ul className="list-disc pl-5 space-y-2 font-medium text-gray-800">
                <li>{data?.recentDatasets?.length || 0} recent datasets ready for review</li>
                <li>{data?.recentReports?.length || 0} completed intelligence reports</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
              <Play size={20} className="fill-white" />
              Continue Analysis
            </button>
            <Link href="/data-dock" className="px-8 py-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white text-gray-700 font-bold hover:bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
              <UploadCloud size={20} className="text-indigo-500" />
              Upload Dataset
            </Link>
            <Link href="/intelligence-reports" className="px-8 py-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white text-gray-700 font-bold hover:bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
              <FileText size={20} className="text-purple-500" />
              View Reports
            </Link>
          </div>
        </motion.div>

        {/* System Health Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <SystemHealthDashboard simplified={isExecutive} />
        </motion.div>

        {/* Workflow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/50 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
        >
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Current Workflow Progress</h2>
          <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex items-center min-w-max gap-3 relative">
              {isLoading ? (
                 <div className="text-gray-400 text-sm flex items-center gap-2 font-medium"><Loader2 className="animate-spin text-indigo-500" size={18}/> Initializing agent workflow...</div>
              ) : workflowNodes.length === 0 ? (
                 <div className="text-gray-400 text-sm font-medium">No pipeline has been run yet. Upload a dataset to see live progress here.</div>
              ) : (
                workflowNodes.map((step, idx) => {
                  const isActive = step.status === 'In Progress';
                  const isDone = step.status === 'Completed';
                  const isFailed = step.status === 'Failed';
                  return (
                    <React.Fragment key={step.id}>
                      <div className={`flex flex-col items-center transition-all duration-500 ${isActive ? 'scale-110 z-10' : 'scale-100 opacity-90'}`}>
                        <div className={`h-12 px-6 rounded-2xl flex items-center justify-center font-bold text-[14px] border-2 transition-all duration-300 ${
                          isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-500 border-transparent text-white shadow-[0_8px_24px_rgba(99,102,241,0.4)]' :
                          isFailed ? 'bg-red-50 border-red-200 text-red-600' :
                          isDone ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' :
                          'bg-white/50 border-white/60 text-gray-400 backdrop-blur-sm'
                        }`}>
                          {getTerm(step.label)}
                        </div>
                      </div>
                      {idx < workflowNodes.length - 1 && (
                        <div className="w-8 flex items-center justify-center shrink-0">
                          <ArrowRight size={18} className={isDone ? 'text-indigo-400' : 'text-gray-300'} />
                        </div>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* The AI Brain Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden relative flex flex-col"
          >
            <div className="p-8 md:p-10 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-8 border-b border-gray-200/50 pb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-3xl ${!isComplete ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'} shadow-inner`}>
                    <BrainCircuit size={36} className={!isComplete ? 'animate-pulse' : ''} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-800 font-heading">Agentix Brain</h2>
                    <p className="text-gray-500 mt-1 font-medium text-sm">
                      {!isComplete ? 'Processing complex data pipelines...' : 'Ready. No tasks running.'}
                    </p>
                  </div>
                </div>
                {!isComplete && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
                    Active
                  </span>
                )}
              </div>

              {/* Live Activity Feed */}
              <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {isLoading ? (
                    <div className="flex items-center gap-3 p-4 text-gray-400 font-medium"><Loader2 className="animate-spin text-indigo-400" size={18}/> Syncing neural activity...</div>
                  ) : activityLogs.length > 0 ? (
                    activityLogs.map((log, idx) => {
                      return (
                        <motion.div 
                          key={log.id || idx}
                          initial={{ opacity: 0, x: -20, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: 'auto' }}
                          className="flex items-center gap-5 p-5 rounded-2xl bg-white/70 hover:bg-white border border-white transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                        >
                          <div className="shrink-0">
                             <CheckCircle2 size={24} className="text-emerald-500 drop-shadow-sm" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[15px] text-gray-800 font-bold">
                              {log.action}
                            </span>
                            <span className="text-[13px] text-gray-400 font-medium mt-0.5">
                               {new Date(log.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </motion.div>
                      )
                    })
                  ) : (
                    <div className="p-4 text-gray-400 italic font-medium bg-white/40 rounded-2xl border border-white/50 text-center py-10">Neural pathways quiet. No recent activity.</div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Decision Intelligence & Benchmark Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col"
          >
            <div className="p-8 md:p-10 flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-8 border-b border-gray-200/50 pb-6">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-fuchsia-100 to-purple-100 text-purple-600 shadow-inner">
                  <Sparkles size={36} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800 font-heading">Decision Intelligence</h2>
                  <p className="text-gray-500 mt-1 font-medium text-sm">{isExecutive ? 'Learns from every analysis to work smarter next time' : 'Meta-learning & Strategy Engine'}</p>
                </div>
              </div>

              {benchmarkStats ? (
                <div className="space-y-8 flex-1">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/70 rounded-2xl p-5 border border-white shadow-[0_4px_16px_rgba(0,0,0,0.02)] text-center hover:scale-105 transition-transform duration-300">
                      <Database size={24} className="mx-auto mb-3 text-indigo-500" />
                      <div className="text-3xl font-black text-gray-800 bg-clip-text text-transparent bg-gradient-to-br from-gray-800 to-gray-500">{benchmarkStats.total_benchmark_datasets ?? 0}</div>
                      <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-2">Datasets</div>
                    </div>
                    <div className="bg-white/70 rounded-2xl p-5 border border-white shadow-[0_4px_16px_rgba(0,0,0,0.02)] text-center hover:scale-105 transition-transform duration-300">
                      <FlaskConical size={24} className="mx-auto mb-3 text-amber-500" />
                      <div className="text-3xl font-black text-gray-800 bg-clip-text text-transparent bg-gradient-to-br from-gray-800 to-gray-500">{benchmarkStats.total_experiments ?? 0}</div>
                      <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-2">Experiments</div>
                    </div>
                    <div className="bg-white/70 rounded-2xl p-5 border border-white shadow-[0_4px_16px_rgba(0,0,0,0.02)] text-center hover:scale-105 transition-transform duration-300">
                      <Lightbulb size={24} className="mx-auto mb-3 text-emerald-500" />
                      <div className="text-3xl font-black text-gray-800 bg-clip-text text-transparent bg-gradient-to-br from-gray-800 to-gray-500">{benchmarkStats.total_strategy_reasonings ?? 0}</div>
                      <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-2">Strategies</div>
                    </div>
                  </div>

                  {/* Top Experiments Leaderboard */}
                  <div>
                    <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <TrendingUp size={16} className="text-indigo-500" /> Top Performing Strategies
                    </h3>
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white shadow-sm overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200/50 bg-white/60">
                            <th className="text-left p-4 text-gray-500 font-bold text-[11px] uppercase tracking-wider">Dataset</th>
                            <th className="text-left p-4 text-gray-500 font-bold text-[11px] uppercase tracking-wider">Model</th>
                            <th className="text-right p-4 text-gray-500 font-bold text-[11px] uppercase tracking-wider">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(benchmarkStats.top_experiments || []).length === 0 ? (
                            <tr>
                              <td colSpan={3} className="p-4 text-center text-gray-400 text-sm">
                                No completed training runs yet.
                              </td>
                            </tr>
                          ) : (
                            benchmarkStats.top_experiments.slice(0, 4).map((exp: any, i: number) => (
                              <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-white/80 transition-colors">
                                <td className="p-4 font-bold text-gray-800">{exp.dataset}</td>
                                <td className="p-4">
                                  <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 text-xs font-bold shadow-sm">{exp.model}</span>
                                </td>
                                <td className="p-4 text-right font-black text-emerald-500">{exp.cv_score?.toFixed(3)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="animate-spin text-purple-400" size={32} /> 
                  <span className="font-medium">Synthesizing benchmark intelligence...</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
