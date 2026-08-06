import { create } from 'zustand';
import axios from 'axios';

export interface DashboardMetrics {
  active_dataset: string;
  dataset_health_score: number;
  best_model: string;
  model_accuracy: number;
  active_agents: number;
  ollama_status: string;
  langgraph_status: string;
  mlops_status: string;
  workflow_state: string;
}

export interface ProfileData {
  rows: number;
  cols: number;
  missing: number;
  duplicates: number;
  outliers: number;
  schema: Record<string, string>;
}

export interface EDAData {
  correlations: Record<string, Record<string, number>>;
  histograms: Record<string, { counts: number[]; bins: number[] }>;
  boxplots: Record<string, { min: number; q1: number; median: number; q3: number; max: number }>;
  statistics: Record<string, { mean: number; std: number; skew: number }>;
}

export interface AutoMLData {
  problem_type: string;
  target: string;
  best_model: string;
  leaderboard: {
    model: string;
    r2_score: number;
    rmse: number;
    mae: number;
    cv_mean: number;
    cv_std: number;
    hyperparameters: Record<string, any>;
    feature_importances?: Record<string, number>;
  }[];
}

export interface XAIData {
  top_drivers: string[];
  bias_detected: boolean;
  leakage_alert: boolean;
  dominant_feature: string;
  importances: Record<string, number>;
  waterfall: { feature: string; start: number; end: number; impact: number }[];
  base_value: number;
  final_prediction: number;
}

export interface InsightsData {
  insights: string[];
}

export interface RecommendationsData {
  actions: string[];
}

export interface MLOpsData {
  status: string;
  drift: boolean;
  accuracy_trend: number[];
  deployments: number;
}

export interface JobStatus {
  job_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  dataset_name: string;
  current_stage: string;
  current_stage_index: number;
  total_stages: number;
  progress: number;
  estimated_remaining: number;
  error: string | null;
  result: Record<string, any> | null;
}

interface PlatformState {
  datasetName: string | null;
  isLoading: boolean;
  error: string | null;

  dashboardMetrics: DashboardMetrics | null;
  profileData: ProfileData | null;
  edaData: EDAData | null;
  automlData: AutoMLData | null;
  xaiData: XAIData | null;
  insightsData: InsightsData | null;
  recommendationsData: RecommendationsData | null;
  mlopsData: MLOpsData | null;

  currentJobId: string | null;
  jobStatus: JobStatus | null;
  uploadProgress: number;

  setDatasetName: (name: string) => void;
  fetchDashboardMetrics: () => Promise<void>;
  fetchEDA: () => Promise<void>;
  fetchAutoML: () => Promise<void>;
  fetchXAI: () => Promise<void>;
  fetchInsights: () => Promise<void>;
  fetchRecommendations: () => Promise<void>;
  fetchMLOps: () => Promise<void>;
  uploadDataset: (file: File) => Promise<{ job_id: string; dataset_name: string } | null>;
  pollJobStatus: (jobId: string) => Promise<JobStatus | null>;
  clearJob: () => void;
  startWorkflow: (datasetName: string) => Promise<void>;
  chat: (query: string) => Promise<string>;
  fetchProfile: () => Promise<void>;
  fetchReports: () => Promise<any>;
  fetchHistory: () => Promise<{ runs: any[]; activity: any[] }>;
}

const backendBase = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:8000`
  : 'http://localhost:8000';
const API_BASE = `${backendBase}/api/v1/platform`;

export const usePlatformStore = create<PlatformState>((set, get) => ({
  datasetName: null,
  isLoading: false,
  error: null,

  dashboardMetrics: null,
  profileData: null,
  edaData: null,
  automlData: null,
  xaiData: null,
  insightsData: null,
  recommendationsData: null,
  mlopsData: null,

  currentJobId: null,
  jobStatus: null,
  uploadProgress: 0,

  setDatasetName: (name: string) => set({ datasetName: name }),

  fetchDashboardMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_BASE}/dashboard-metrics`);
      set({ dashboardMetrics: res.data.data, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg, isLoading: false });
    }
  },

  fetchEDA: async () => {
    const ds = get().datasetName;
    if (!ds) return set({ error: 'No active dataset', edaData: null });
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_BASE}/eda?dataset_name=${ds}`);
      set({ edaData: res.data.data, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg, isLoading: false });
    }
  },

  fetchAutoML: async () => {
    const ds = get().datasetName;
    if (!ds) return set({ error: 'No active dataset', automlData: null });
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_BASE}/predict`, { dataset_name: ds });
      set({ automlData: res.data.data, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg, isLoading: false });
    }
  },

  fetchXAI: async () => {
    const ds = get().datasetName;
    if (!ds) return set({ error: 'No active dataset', xaiData: null });
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_BASE}/xai?dataset_name=${ds}`);
      set({ xaiData: res.data.data, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg, isLoading: false });
    }
  },

  fetchInsights: async () => {
    const ds = get().datasetName;
    if (!ds) return set({ error: 'No active dataset', insightsData: null });
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_BASE}/insights?dataset_name=${ds}`);
      set({ insightsData: res.data.data, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg, isLoading: false });
    }
  },

  fetchRecommendations: async () => {
    const ds = get().datasetName;
    if (!ds) return set({ error: 'No active dataset', recommendationsData: null });
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_BASE}/recommendations?dataset_name=${ds}`);
      set({ recommendationsData: res.data.data, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg, isLoading: false });
    }
  },

  fetchMLOps: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_BASE}/mlops`);
      set({ mlopsData: res.data.data, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg, isLoading: false });
    }
  },

  uploadDataset: async (file: File) => {
    set({ isLoading: true, error: null, currentJobId: null, jobStatus: null, uploadProgress: 0 });
    try {
      const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const MAX_RETRIES = 3;

      // Init upload
      const initRes = await axios.post(`${backendBase}/api/v1/dataset/upload/init`, {
        file_name: file.name,
        total_chunks: totalChunks,
        total_size: file.size
      });
      const uploadId = initRes.data.upload_id;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('upload_id', uploadId);
        formData.append('chunk_index', chunkIndex.toString());

        let attempt = 0;
        let success = false;
        while (attempt < MAX_RETRIES && !success) {
          try {
            await axios.post(`${backendBase}/api/v1/dataset/upload/chunk`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            success = true;
          } catch (err) {
            attempt++;
            if (attempt >= MAX_RETRIES) throw new Error(`Failed to upload chunk ${chunkIndex} after ${MAX_RETRIES} attempts`);
            await new Promise(res => setTimeout(res, 1000 * attempt)); // exponential backoff
          }
        }

        set({ uploadProgress: Math.round(((chunkIndex + 1) / totalChunks) * 100) });
      }

      // Complete upload
      const completeRes = await axios.post(`${backendBase}/api/v1/dataset/upload/complete`, {
        upload_id: uploadId,
        file_name: file.name
      });

      const { job_id, dataset_name } = completeRes.data;
      set({
        datasetName: dataset_name,
        currentJobId: job_id,
        jobStatus: {
          job_id,
          status: 'queued',
          dataset_name,
          current_stage: '',
          current_stage_index: 0,
          total_stages: 9,
          progress: 0,
          estimated_remaining: 0,
          error: null,
          result: null,
        },
        isLoading: false,
      });
      return { job_id, dataset_name };
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail || err.message || String(err);
      set({ error: typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail), isLoading: false });
      return null;
    }
  },

  pollJobStatus: async (jobId: string) => {
    try {
      const res = await axios.get(`${backendBase}/api/v1/jobs/${jobId}`);
      const status: JobStatus = res.data;
      set({ jobStatus: status });
      return status;
    } catch {
      return null;
    }
  },

  clearJob: () => set({ currentJobId: null, jobStatus: null }),

  startWorkflow: async (datasetName: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_BASE}/start-workflow`, { dataset_name: datasetName });
      set({ isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg, isLoading: false });
    }
  },

  chat: async (query: string) => {
    const ds = get().datasetName;
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_BASE}/chat`, { query, dataset_name: ds || '' });
      set({ isLoading: false });
      return res.data?.data?.response || res.data?.data || 'No response received.';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg, isLoading: false });
      return `Error: ${msg}`;
    }
  },

  fetchProfile: async () => {
    const ds = get().datasetName;
    if (!ds) return set({ error: 'No active dataset', profileData: null });
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_BASE}/profile`, { dataset_name: ds });
      set({ profileData: res.data.data, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg, isLoading: false });
    }
  },

  fetchReports: async () => {
    const ds = get().datasetName;
    if (!ds) return null;
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_BASE}/reports?dataset_name=${ds}`);
      set({ isLoading: false });
      return res.data?.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg, isLoading: false });
      return null;
    }
  },

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_BASE}/experiment-runs`);
      const activity = await axios.get(`${API_BASE}/recent-activity`);
      set({ isLoading: false });
      return { runs: res.data?.data?.runs || [], activity: activity.data?.data || [] };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg, isLoading: false });
      return { runs: [], activity: [] };
    }
  },
}));
