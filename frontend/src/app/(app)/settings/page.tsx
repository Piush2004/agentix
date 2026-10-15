"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database,
  Cpu,
  Palette,
  KeyRound,
  Save,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useAiPersona } from '@/hooks/useAiPersona';

const SETTINGS_TABS = [
  { id: 'llm', label: 'LLM Provider', icon: Cpu },
  { id: 'database', label: 'DB Connections', icon: Database, advanced: true },
  { id: 'theme', label: 'Appearance', icon: Palette },
  { id: 'api', label: 'API Configuration', icon: KeyRound, advanced: true },
];

export default function SettingsPage() {
  const { isExecutive } = useAiPersona();
  const visibleTabs = SETTINGS_TABS.filter(tab => !tab.advanced || !isExecutive);
  const [activeTab, setActiveTab] = useState('llm');
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    llmProvider: 'OpenAI (GPT-4o)',
    apiKey: '',
    engineUrl: '',
    webhookEndpoint: '',
    theme: 'Light Mode'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/users/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await fetch('/api/users/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        <Loader2 size={36} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 pb-16 max-w-5xl mx-auto pt-6 px-4 md:px-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2 font-heading">Settings</h1>
          <p className="text-text-secondary text-[15px]">Configure your AI Operating System preferences and integrations.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-primary hover:bg-primary-hover text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-md hover:-translate-y-[1px] flex items-center gap-2"
        >
          {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Nav */}
        <div className="lg:col-span-3">
          <nav className="flex flex-col sticky top-8 gap-1">
            {visibleTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive 
                      ? 'bg-primary-light/50 text-primary' 
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-primary" : "text-text-tertiary"} /> 
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-9">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-border rounded-2xl p-8 shadow-sm"
          >

              {/* LLM Provider Tab */}
              {activeTab === 'llm' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-1 font-heading">AI Models & Routing</h2>
                    <p className="text-sm text-text-secondary">Select the primary model used for the Brain reasoning engine.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Local (Ollama)', connected: true, note: 'Actually used by the AI Assistant today — whichever model is running locally via Ollama.' },
                      { name: 'OpenAI (GPT-4o)', connected: false, note: 'Not connected. No backend integration exists yet.' },
                      { name: 'Anthropic (Claude 3.5)', connected: false, note: 'Not connected. No backend integration exists yet.' },
                      { name: 'Google Gemini (1.5 Pro)', connected: false, note: 'Not connected. No backend integration exists yet.' },
                    ].map(({ name: model, connected, note }) => (
                      <div
                        key={model}
                        onClick={() => connected && handleChange('llmProvider', model)}
                        className={`p-4 border rounded-xl transition-all ${connected ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} ${settings.llmProvider === model ? 'border-primary bg-primary-light/20 ring-1 ring-primary/20' : 'border-border hover:border-primary-light hover:bg-surface'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-text-primary">{model}</span>
                          {connected
                            ? (settings.llmProvider === model && <span className="w-2.5 h-2.5 rounded-full bg-primary" />)
                            : <span className="text-[10px] uppercase font-bold tracking-wide text-text-tertiary bg-surface-hover px-1.5 py-0.5 rounded">Not connected</span>}
                        </div>
                        <p className="text-xs text-text-secondary">{note}</p>
                      </div>
                    ))}
                  </div>

                  {isExecutive ? (
                    <div className="pt-6 border-t border-border">
                      <p className="text-sm text-text-secondary">The AI Assistant is powered by a local model running via Ollama on this machine — there is no cloud AI subscription to manage here.</p>
                    </div>
                  ) : (
                    <div className="pt-6 border-t border-border">
                      <label className="block text-sm font-bold text-text-primary mb-2">API Key Configuration</label>
                      <input
                        type="password"
                        value={settings.apiKey}
                        onChange={(e) => handleChange('apiKey', e.target.value)}
                        placeholder="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-[15px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* DB Connections Tab */}
              {activeTab === 'database' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-text-primary mb-1 font-heading">Database Sources</h2>
                      <p className="text-sm text-text-secondary">Connect Agentix to your enterprise data warehouses.</p>
                    </div>
                    <button className="px-4 py-2 bg-surface border border-border text-text-primary rounded-lg text-sm font-medium hover:bg-surface-hover transition-all shadow-sm">
                      Add Source
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between p-5 border border-border rounded-xl bg-white shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center">
                          <Database size={24} className="text-text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-text-primary text-[15px]">Snowflake Data Warehouse</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-2 h-2 rounded-full bg-success"></span>
                            <span className="text-xs font-medium text-success">Connected</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-sm font-medium text-text-tertiary hover:text-danger transition-colors">
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Theme Tab */}
              {activeTab === 'theme' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-1 font-heading">Appearance</h2>
                    <p className="text-sm text-text-secondary">Customize the look and feel of your AI Operating System.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div 
                      onClick={() => handleChange('theme', 'Light Mode')}
                      className={`p-1 rounded-2xl border-2 transition-colors cursor-pointer ${settings.theme === 'Light Mode' ? 'border-primary' : 'border-transparent hover:border-border'}`}
                    >
                      <div className="bg-white rounded-xl h-24 shadow-sm border border-border/50 flex flex-col p-2">
                        <div className="w-full h-3 bg-slate-100 rounded mb-2"></div>
                        <div className="w-1/2 h-2 bg-slate-100 rounded"></div>
                      </div>
                      <p className={`text-center text-sm font-bold mt-2 ${settings.theme === 'Light Mode' ? 'text-primary' : 'text-text-tertiary'}`}>Light Mode</p>
                    </div>
                    
                    <div 
                      onClick={() => handleChange('theme', 'Dark Mode')}
                      className={`p-1 rounded-2xl border-2 transition-colors cursor-pointer ${settings.theme === 'Dark Mode' ? 'border-primary' : 'border-transparent hover:border-border'}`}
                    >
                      <div className="bg-slate-900 rounded-xl h-24 shadow-sm border border-slate-800 flex flex-col p-2">
                        <div className="w-full h-3 bg-slate-800 rounded mb-2"></div>
                        <div className="w-1/2 h-2 bg-slate-800 rounded"></div>
                      </div>
                      <p className={`text-center text-sm font-bold mt-2 ${settings.theme === 'Dark Mode' ? 'text-primary' : 'text-text-tertiary'}`}>Dark Mode</p>
                    </div>

                    <div 
                      onClick={() => handleChange('theme', 'System')}
                      className={`p-1 rounded-2xl border-2 transition-colors cursor-pointer ${settings.theme === 'System' ? 'border-primary' : 'border-transparent hover:border-border'}`}
                    >
                      <div className="bg-gradient-to-br from-white to-slate-900 rounded-xl h-24 shadow-sm border border-border/50 flex flex-col p-2"></div>
                      <p className={`text-center text-sm font-bold mt-2 ${settings.theme === 'System' ? 'text-primary' : 'text-text-tertiary'}`}>System</p>
                    </div>
                  </div>
                </div>
              )}

              {/* API Config Tab */}
              {activeTab === 'api' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-1 font-heading">Advanced API</h2>
                    <p className="text-sm text-text-secondary">Configure backend engine connections and webhooks.</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-text-primary mb-2">Engine URL</label>
                      <input 
                        type="text" 
                        value={settings.engineUrl}
                        onChange={(e) => handleChange('engineUrl', e.target.value)}
                        placeholder="http://localhost:8000"
                        className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-[15px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text-primary mb-2">Webhook Endpoint</label>
                      <input 
                        type="text" 
                        value={settings.webhookEndpoint}
                        onChange={(e) => handleChange('webhookEndpoint', e.target.value)}
                        placeholder="https://your-domain.com/webhook"
                        className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-[15px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
                      />
                    </div>
                  </div>
                </div>
              )}

          </motion.div>
        </div>
      </div>
    </div>
  );
}
