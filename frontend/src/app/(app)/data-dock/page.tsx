"use client";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  Cpu,
} from 'lucide-react';
import { usePlatformStore } from '@/store/platformStore';
import { useRouter } from 'next/navigation';

const STAGE_ICONS: Record<string, string> = {
  'Profiling': '\ud83d\udcca',
  'Data Quality': '\u2705',
  'Cleaning': '\ud83e\uddf9',
  'EDA': '\ud83d\udd0d',
  'Feature Engineering': '\u2699\ufe0f',
  'Model Planning': '\ud83d\udcd0',
  'Training': '\ud83e\udd16',
  'Explainability': '\ud83d\udca1',
  'Report Generation': '\ud83d\udcdd',
  'Complete': '\ud83c\udf89',
};

const ALL_STAGES = [
  'Profiling',
  'Data Quality',
  'Cleaning',
  'EDA',
  'Feature Engineering',
  'Model Planning',
  'Training',
  'Explainability',
  'Report Generation',
];

export default function DatasetsPage() {
  const router = useRouter();
  const { uploadDataset, pollJobStatus, jobStatus, clearJob, setDatasetName, uploadProgress } = usePlatformStore();
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => {
    if (!jobStatus) return;
    if (jobStatus.status === 'completed') {
      setPhase('completed');
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      const timer = setTimeout(() => {
        router.push('/insights');
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (jobStatus.status === 'failed') {
      setPhase('error');
      setUploadError(jobStatus.error || 'Pipeline processing failed.');
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
  }, [jobStatus, router]);

  const startPolling = useCallback((jobId: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      const status = await pollJobStatus(jobId);
      if (status && (status.status === 'completed' || status.status === 'failed')) {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      }
    }, 3000);
  }, [pollJobStatus]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setPhase('uploading');
    setUploadError(null);
    clearJob();

    try {
      const result = await uploadDataset(selectedFile);
      if (result) {
        setDatasetName(result.dataset_name);
        setPhase('processing');
        startPolling(result.job_id);
      } else {
        setUploadError('Upload failed. Please try again.');
        setPhase('error');
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed');
      setPhase('error');
    }
  }, [uploadDataset, setDatasetName, clearJob, startPolling]);

  const handleRetry = () => {
    setFile(null);
    setPhase('idle');
    setUploadError(null);
    clearJob();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
  });

  const progress = jobStatus?.progress ?? 0;
  const currentStageIndex = jobStatus?.current_stage_index ?? 0;
  const estimatedRemaining = jobStatus?.estimated_remaining ?? 0;

  const formatETA = (seconds: number) => {
    if (seconds <= 0) return 'Calculating...';
    if (seconds < 60) return `${seconds}s remaining`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s remaining`;
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-12 max-w-6xl mx-auto pt-4 px-4 md:px-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary font-heading">Datasets</h1>
        <p className="text-text-secondary max-w-2xl text-[15px]">
          Upload your structured data. Agentix will intelligently profile and prepare it for analysis.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[400px] ${
                isDragActive
                  ? 'border-primary bg-primary-light/30 scale-[1.02]'
                  : 'border-border bg-white hover:border-primary-light hover:bg-surface shadow-sm'
              }`}
            >
              <input {...getInputProps()} />
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                  isDragActive ? 'bg-primary text-white shadow-lg scale-110' : 'bg-surface-hover text-text-tertiary'
                }`}
              >
                <UploadCloud size={36} />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2 font-heading">
                {isDragActive ? 'Drop dataset here' : 'Select or drop a dataset'}
              </h3>
              <p className="text-text-secondary text-[15px] max-w-[280px]">
                Supports CSV, Excel, and JSON files up to 500MB.
              </p>
            </div>
          </motion.div>
        )}

        {phase === 'uploading' && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-white shadow-sm min-h-[400px]"
          >
            <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-6">
              <Loader2 size={36} className="text-primary animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2 font-heading">
              Uploading {file?.name}...
            </h3>
            <p className="text-text-secondary text-[15px] mb-6">Sending file to Agentix backend.</p>
            
            <div className="w-full max-w-md">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-text-secondary">Progress</span>
                <span className="text-sm font-bold text-primary">{uploadProgress}%</span>
              </div>
              <div className="w-full h-3 bg-surface-hover rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <Cpu size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Processing {file?.name}</h2>
                  <p className="text-text-secondary text-sm flex items-center gap-2 mt-1">
                    <Clock size={14} />
                    {formatETA(estimatedRemaining)}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-3xl font-bold text-primary">{progress}%</div>
                  <div className="text-xs text-text-tertiary font-medium">
                    Stage {currentStageIndex + 1} of {jobStatus?.total_stages || 9}
                  </div>
                </div>
              </div>

              <div className="w-full h-3 bg-surface-hover rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-2">
                {ALL_STAGES.map((stage, idx) => {
                  const isDone = idx < currentStageIndex;
                  const isActive = idx === currentStageIndex;
                  const isPending = idx > currentStageIndex;
                  const icon = STAGE_ICONS[stage] || '';

                  return (
                    <div
                      key={stage}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-primary-light/50 border border-primary/20'
                          : isDone
                          ? 'bg-surface'
                          : 'opacity-40'
                      }`}
                    >
                      <span className="text-lg w-8 text-center">{icon}</span>
                      <span
                        className={`text-sm font-medium flex-1 ${
                          isActive ? 'text-primary font-bold' : isDone ? 'text-text-primary' : 'text-text-tertiary'
                        }`}
                      >
                        {stage}
                      </span>
                      {isDone && <CheckCircle2 size={16} className="text-success" />}
                      {isActive && <Loader2 size={16} className="text-primary animate-spin" />}
                      {isPending && <div className="w-4 h-4 rounded-full border-2 border-border" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-emerald-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-emerald-50 shadow-sm min-h-[400px]"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2 font-heading">Pipeline Complete!</h3>
            <p className="text-text-secondary text-[15px] max-w-[300px] mb-4">
              All 9 stages finished successfully. Redirecting to Analysis...
            </p>
            <div className="flex items-center gap-2 text-primary font-medium">
              <Loader2 size={16} className="animate-spin" />
              Redirecting
              <ArrowRight size={16} />
            </div>
          </motion.div>
        )}

        {phase === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-red-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-red-50 shadow-sm min-h-[400px]"
          >
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <AlertCircle size={36} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2 font-heading">Processing Failed</h3>
            <p className="text-text-secondary text-[15px] max-w-[400px] mb-6">{uploadError}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
