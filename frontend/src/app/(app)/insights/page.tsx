"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Database, 
  Wand2, 
  BarChart2, 
  BrainCircuit,
  Target,
  SearchCode,
  Lightbulb,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePlatformStore } from '@/store/platformStore';
import { getTerm } from '@/lib/terminology';

const SECTIONS = [
  { id: 'overview', title: 'Overview', icon: Database, color: 'text-primary' },
  { id: 'cleaning', title: getTerm('Cleaning'), icon: Wand2, color: 'text-accent' },
  { id: 'eda', title: getTerm('Exploratory Data Analysis'), icon: BarChart2, color: 'text-primary' },
  { id: 'modeling', title: getTerm('Model Planning'), icon: BrainCircuit, color: 'text-accent' },
  { id: 'evaluation', title: 'Evaluation', icon: Target, color: 'text-primary' },
  { id: 'explainability', title: getTerm('Explainability'), icon: SearchCode, color: 'text-accent' },
  { id: 'insights', title: 'Business Insights', icon: Lightbulb, color: 'text-warning' },
  { id: 'recommendations', title: 'Recommendations', icon: CheckCircle2, color: 'text-success' },
];

export default function AnalysisPage() {
  const [expandedSection, setExpandedSection] = useState<string>('overview');

  const { 
    datasetName, 
    edaData, 
    xaiData, 
    insightsData, 
    recommendationsData, 
    profileData, 
    automlData, 
    isLoading, 
    error, 
    fetchEDA, 
    fetchXAI, 
    fetchInsights, 
    fetchRecommendations, 
    fetchProfile, 
    fetchAutoML 
  } = usePlatformStore();

  useEffect(() => {
    if (datasetName) {
      fetchProfile();
      fetchEDA();
      fetchAutoML();
      fetchXAI();
      fetchInsights();
      fetchRecommendations();
    }
  }, [datasetName, fetchProfile, fetchEDA, fetchAutoML, fetchXAI, fetchInsights, fetchRecommendations]);

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? '' : id);
  };

  if (!datasetName) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Database size={48} className="text-text-tertiary" />
        <h2 className="text-xl font-bold text-text-primary">No Dataset Active</h2>
        <p className="text-text-secondary text-center max-w-md">
          Please upload or select a dataset first to view its insights and analysis.
        </p>
        <Link href="/data-dock" className="mt-4 bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors">
          Go to Datasets
        </Link>
      </div>
    );
  }

  if (isLoading && !profileData && !insightsData) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="text-primary animate-spin" />
        <p className="text-text-secondary">Analyzing dataset and generating insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-red-500 p-4 bg-red-500/10 rounded-full">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Analysis Failed</h2>
        <p className="text-text-secondary text-center max-w-md">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 pb-16 max-w-4xl mx-auto pt-6 px-4 md:px-0">
      
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2 font-heading">Analysis: {datasetName}</h1>
        <p className="text-text-secondary text-[15px]">Deep dive into your dataset processing, models, and findings.</p>
      </div>

      {/* Expandable Sections */}
      <div className="flex flex-col gap-4">
        {SECTIONS.map((section) => {
          const isExpanded = expandedSection === section.id;
          const Icon = section.icon;

          return (
            <motion.div 
              key={section.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${isExpanded ? 'border-primary/30 shadow-md ring-1 ring-primary/10' : 'border-border shadow-sm hover:border-primary/20 hover:bg-surface'}`}
            >
              <button 
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-5 flex items-center justify-between outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-surface-hover border border-border/50 ${section.color}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary font-heading">{section.title}</h3>
                </div>
                <div className="text-text-tertiary">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border/50"
                  >
                    <div className="p-6 md:p-8 bg-surface-hover/30">
                      
                      {section.id === 'overview' && (
                        profileData ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                              <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-1">Rows</p>
                              <p className="text-2xl font-bold text-text-primary">{profileData.rows || 0}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                              <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-1">Columns</p>
                              <p className="text-2xl font-bold text-text-primary">{profileData.columns || 0}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                              <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-1">Missing</p>
                              <p className="text-2xl font-bold text-warning">{profileData.missing_cells || 0}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                              <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-1">Duplicates</p>
                              <p className="text-2xl font-bold text-primary mt-1">{profileData.duplicate_rows || 0}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-text-tertiary text-sm font-medium">No profile data available.</p>
                        )
                      )}

                      {section.id === 'cleaning' && (
                        <div className="space-y-4">
                          <p className="text-text-secondary text-[15px] leading-relaxed mb-4">Agentix automatically resolved data quality issues before training.</p>
                          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
                            <CheckCircle2 className="text-success shrink-0" size={18} />
                            <span className="text-sm font-medium text-text-primary">Imputed missing values automatically.</span>
                          </div>
                          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-border shadow-sm">
                            <CheckCircle2 className="text-success shrink-0" size={18} />
                            <span className="text-sm font-medium text-text-primary">Standardized date formats and encodings.</span>
                          </div>
                        </div>
                      )}

                      {section.id === 'eda' && (
                        <div className="space-y-4">
                          {edaData ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {edaData.statistics && Object.entries(edaData.statistics).slice(0, 4).map(([key, value]: [string, any]) => (
                                <div key={key} className="bg-white p-4 rounded-xl border border-border shadow-sm">
                                  <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-1">{key}</p>
                                  <p className="text-sm font-medium text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </p>
                                </div>
                              ))}
                              {(!edaData.statistics || Object.keys(edaData.statistics).length === 0) && (
                                <p className="text-text-secondary text-sm">EDA statistics loaded.</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-text-tertiary text-sm font-medium">No EDA data available.</p>
                          )}
                        </div>
                      )}

                      {section.id === 'modeling' && (
                        <div className="space-y-4">
                          {automlData ? (
                            <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                              <p className="text-sm font-medium text-text-primary mb-2">Best Model: <span className="font-bold text-primary">{automlData.best_model || 'N/A'}</span></p>
                              <p className="text-sm text-text-secondary mb-2">Target Variable: {automlData.target || 'N/A'} | Problem Type: {automlData.problem_type || 'N/A'}</p>
                            </div>
                          ) : (
                            <p className="text-text-tertiary text-sm font-medium">No modeling data available.</p>
                          )}
                        </div>
                      )}

                      {section.id === 'evaluation' && (
                        <div className="space-y-4">
                          {automlData?.leaderboard && automlData.leaderboard.length > 0 ? (
                            <div className="bg-white p-4 rounded-xl border border-border shadow-sm overflow-x-auto">
                              <table className="w-full text-sm text-left">
                                <thead className="text-xs text-text-tertiary uppercase bg-surface">
                                  <tr>
                                    <th className="px-4 py-2 rounded-tl-lg">Model</th>
                                    <th className="px-4 py-2 rounded-tr-lg">Score</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {automlData.leaderboard.map((model: any, idx: number) => (
                                    <tr key={idx} className="border-b border-border/50 last:border-0">
                                      <td className="px-4 py-2 font-medium text-text-primary">{model.model || model.name || `Model ${idx+1}`}</td>
                                      <td className="px-4 py-2 text-text-secondary">{model.score || model.accuracy || model.rmse || '-'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-text-tertiary text-sm font-medium">No evaluation leaderboard available.</p>
                          )}
                        </div>
                      )}

                      {section.id === 'explainability' && (
                        <div className="space-y-4">
                          {xaiData && xaiData.top_drivers && xaiData.top_drivers.length > 0 ? (
                            <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                              <h4 className="font-bold text-text-primary mb-3">Top Drivers</h4>
                              <div className="space-y-2">
                                {xaiData.top_drivers.map((driver: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <SearchCode size={16} className="text-accent" />
                                    <span className="text-sm text-text-secondary">{driver}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-text-tertiary text-sm font-medium">No explainability drivers available.</p>
                          )}
                        </div>
                      )}

                      {section.id === 'insights' && (
                        <div className="space-y-4">
                          {insightsData?.insights && insightsData.insights.length > 0 ? (
                            insightsData.insights.map((insight: string, idx: number) => (
                              <div key={idx} className="bg-primary-light/40 border border-primary-light p-5 rounded-xl flex items-start gap-4">
                                <Lightbulb size={24} className="text-warning mt-0.5 shrink-0" />
                                <div>
                                  <h4 className="font-bold text-text-primary mb-1">Insight {idx + 1}</h4>
                                  <p className="text-[15px] text-text-secondary leading-relaxed">
                                    {insight}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-text-tertiary text-sm font-medium">No business insights available.</p>
                          )}
                        </div>
                      )}

                      {section.id === 'recommendations' && (
                        <div className="space-y-4">
                          {recommendationsData?.actions && recommendationsData.actions.length > 0 ? (
                            recommendationsData.actions.map((action: string, idx: number) => (
                              <div key={idx} className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-start gap-3">
                                <CheckCircle2 className="text-success shrink-0 mt-0.5" size={18} />
                                <span className="text-sm font-medium text-text-primary leading-relaxed">{action}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-text-tertiary text-sm font-medium">No recommendations available.</p>
                          )}
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
