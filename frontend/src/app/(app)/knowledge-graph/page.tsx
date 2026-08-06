"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Network, Loader2, UploadCloud, Database, Cpu, TrendingUp, FlaskConical, Sparkles } from 'lucide-react';
import { usePlatformStore } from '@/store/platformStore';
import Link from 'next/link';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function KnowledgeGraphPage() {
  const datasetName = usePlatformStore(state => state.datasetName);
  const fetchHistory = usePlatformStore(state => state.fetchHistory);
  const automlData = usePlatformStore(state => state.automlData);
  const profileData = usePlatformStore(state => state.profileData);
  const fetchAutoML = usePlatformStore(state => state.fetchAutoML);
  const fetchProfile = usePlatformStore(state => state.fetchProfile);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const buildGraph = useCallback(async () => {
    setIsLoading(true);
    const historyData = await fetchHistory();
    
    // If we have a dataset, also fetch profile and automl data
    if (datasetName) {
      await fetchProfile();
      try { await fetchAutoML(); } catch { /* ok if no model trained yet */ }
    }

    const graphNodes: Node[] = [];
    const graphEdges: Edge[] = [];

    // Central dataset node
    if (datasetName) {
      graphNodes.push({
        id: 'dataset',
        position: { x: 400, y: 50 },
        data: { label: `📊 ${datasetName}` },
        style: { 
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
          color: 'white', 
          padding: '16px 24px', 
          borderRadius: '16px', 
          fontSize: '14px', 
          fontWeight: 700,
          border: 'none',
          boxShadow: '0 4px 20px rgba(99,102,241,0.3)'
        }
      });
    }

    // Profile stats node
    if (profileData) {
      graphNodes.push({
        id: 'profile',
        position: { x: 100, y: 200 },
        data: { label: `📋 Profile\n${profileData.rows?.toLocaleString()} rows × ${profileData.cols} cols` },
        style: { background: '#f0fdf4', border: '2px solid #86efac', padding: '12px 18px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, whiteSpace: 'pre-line' as any }
      });
      graphEdges.push({ id: 'e-ds-profile', source: 'dataset', target: 'profile', animated: true, style: { stroke: '#86efac' }, markerEnd: { type: MarkerType.ArrowClosed } });
    }

    // AutoML nodes
    if (automlData) {
      graphNodes.push({
        id: 'automl',
        position: { x: 700, y: 200 },
        data: { label: `🤖 ${automlData.problem_type || 'ML'}\nTarget: ${automlData.target || 'auto'}` },
        style: { background: '#fef3c7', border: '2px solid #fbbf24', padding: '12px 18px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, whiteSpace: 'pre-line' as any }
      });
      graphEdges.push({ id: 'e-ds-automl', source: 'dataset', target: 'automl', animated: true, style: { stroke: '#fbbf24' }, markerEnd: { type: MarkerType.ArrowClosed } });

      // Leaderboard models
      (automlData.leaderboard || []).slice(0, 4).forEach((model: any, i: number) => {
        const nodeId = `model-${i}`;
        graphNodes.push({
          id: nodeId,
          position: { x: 550 + i * 180, y: 380 },
          data: { label: `🏆 ${model.model}\nScore: ${(model.cv_mean || model.r2_score || 0).toFixed(3)}` },
          style: { 
            background: i === 0 ? '#ede9fe' : '#f8fafc', 
            border: `2px solid ${i === 0 ? '#a78bfa' : '#e2e8f0'}`, 
            padding: '10px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, whiteSpace: 'pre-line' as any
          }
        });
        graphEdges.push({ id: `e-automl-${nodeId}`, source: 'automl', target: nodeId, style: { stroke: '#a78bfa' }, markerEnd: { type: MarkerType.ArrowClosed } });
      });
    }

    // Experiment run nodes from history
    const runs = historyData?.runs || [];
    runs.slice(0, 6).forEach((run: any, i: number) => {
      const nodeId = `run-${i}`;
      graphNodes.push({
        id: nodeId,
        position: { x: 50 + i * 150, y: 420 },
        data: { label: `🧪 ${run.dataset || run.name || `Run #${i + 1}`}\n${run.model || ''}` },
        style: { background: '#f0f9ff', border: '2px solid #7dd3fc', padding: '10px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: 500, whiteSpace: 'pre-line' as any }
      });
      if (datasetName) {
        graphEdges.push({ id: `e-ds-${nodeId}`, source: 'dataset', target: nodeId, style: { stroke: '#7dd3fc', strokeDasharray: '5 5' } });
      }
    });

    // Decision Intelligence node
    graphNodes.push({
      id: 'decision-intel',
      position: { x: 350, y: 550 },
      data: { label: '✨ Decision Intelligence\nMeta-Learning Engine' },
      style: { 
        background: 'linear-gradient(135deg, #f0abfc, #c084fc)', 
        color: 'white', 
        padding: '14px 20px', borderRadius: '14px', fontSize: '12px', fontWeight: 700, 
        border: 'none', boxShadow: '0 4px 16px rgba(192,132,252,0.3)', whiteSpace: 'pre-line' as any
      }
    });
    if (datasetName) {
      graphEdges.push({ id: 'e-ds-di', source: 'dataset', target: 'decision-intel', animated: true, style: { stroke: '#c084fc' }, markerEnd: { type: MarkerType.ArrowClosed } });
    }

    setNodes(graphNodes);
    setEdges(graphEdges);
    setIsLoading(false);
  }, [datasetName, fetchHistory, fetchProfile, fetchAutoML, profileData, automlData]);

  useEffect(() => {
    buildGraph();
  }, [buildGraph]);

  return (
    <div className="w-full flex flex-col gap-8 pb-12 max-w-6xl mx-auto pt-4 px-4 md:px-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary font-heading">Knowledge Graph</h1>
        <p className="text-text-secondary max-w-2xl text-[15px]">Interactive visualization of datasets, models, experiments, and their relationships.</p>
      </div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[500px]"
        >
          <Loader2 size={36} className="text-primary animate-spin mb-4" />
          <p className="text-text-secondary">Building knowledge graph...</p>
        </motion.div>
      ) : nodes.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]"
        >
          <div className="w-20 h-20 rounded-full bg-surface-hover text-text-tertiary flex items-center justify-center mb-6">
            <Network size={36} />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-2 font-heading">Graph Empty</h3>
          <p className="text-text-secondary text-[15px] max-w-[280px] mb-6">
            Upload a dataset and run workflows to populate the knowledge graph.
          </p>
          <Link href="/data-dock" className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all flex items-center gap-2">
            <UploadCloud size={18} /> Upload Dataset
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
          style={{ height: 650 }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            attributionPosition="bottom-left"
            style={{ width: '100%', height: '100%' }}
          >
            <Background />
            <Controls />
            <MiniMap 
              style={{ background: '#f8fafc' }}
              nodeColor={(node) => {
                if (node.id === 'dataset') return '#6366f1';
                if (node.id === 'decision-intel') return '#c084fc';
                if (node.id === 'automl') return '#fbbf24';
                if (node.id === 'profile') return '#86efac';
                return '#7dd3fc';
              }}
            />
          </ReactFlow>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-xs text-text-secondary">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500" /> Dataset</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400" /> Profile</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400" /> AutoML</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-400" /> Decision Intelligence</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-sky-400" /> Experiments</div>
      </div>
    </div>
  );
}
