'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Database,
  FileText,
  MessageSquare,
  Settings,
  Menu,
  Search,
  Bell,
  Hexagon,
  Network,
  History,
  Shield,
  Activity,
  Lightbulb,
  CheckCircle2,
  Server,
  ChevronDown
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

function initialsFrom(name?: string | null, email?: string | null): string {
  const source = name?.trim() || email?.trim() || '';
  if (!source) return '?';
  const parts = source.includes('@') ? [source.split('@')[0]] : source.split(/\s+/);
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('') || '?';
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isRightPanelOpen, setRightPanelOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);

  const [systemHealth, setSystemHealth] = useState<{ online: boolean; pingMs: number | null; ollamaOnline: boolean }>({ online: false, pingMs: null, ollamaOnline: false });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/workspaces')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!isMounted || !data) return;
        const list = Array.isArray(data) ? data : data.workspaces;
        if (list && list.length > 0) setWorkspaceName(list[0].name);
      })
      .catch(() => {});

    // Real, recent activity - same source the Workspace page's own
    // Activity Log uses - instead of hardcoded "Processing Q3_Sales_Data" /
    // "Customer_Churn_Model" cards that never reflected any real run.
    fetch('/api/dashboard')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (!isMounted) return;
        const logs = (json?.data || json)?.activityLogs;
        if (Array.isArray(logs)) setRecentActivity(logs.slice(0, 2));
      })
      .catch(() => {});

    const checkHealth = () => {
      const backendBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const start = performance.now();
      fetch(`${backendBase}/api/v1/platform/system-health`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(json => {
          if (!isMounted) return;
          setSystemHealth({
            online: true,
            pingMs: Math.round(performance.now() - start),
            ollamaOnline: !!json?.data?.ollama?.online,
          });
        })
        .catch(() => {
          if (isMounted) setSystemHealth({ online: false, pingMs: null, ollamaOnline: false });
        });
    };
    checkHealth();
    const healthInterval = setInterval(checkHealth, 15000);

    return () => { isMounted = false; clearInterval(healthInterval); };
  }, []);

  const userInitials = initialsFrom(session?.user?.name, session?.user?.email);

  const navItems = [
    { name: 'Workspace', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Datasets', href: '/data-dock', icon: Database },
    { name: 'Analysis', href: '/insights', icon: Lightbulb },
    { name: 'Reports', href: '/intelligence-reports', icon: FileText },
    { name: 'AI Assistant', href: '/agent-console', icon: MessageSquare },
    { name: 'History', href: '/history', icon: History },
    { name: 'Knowledge Graph', href: '/knowledge-graph', icon: Network },
  ];

  const bottomNavItems = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Admin', href: '/admin/brain-console', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary w-full h-full relative overflow-hidden flex flex-col font-sans">
      
      {/* Top Navigation */}
      <header className="bg-white/90 backdrop-blur-md h-16 shrink-0 flex justify-between items-center px-4 md:px-6 z-40 border-b border-border sticky top-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden text-text-secondary hover:text-text-primary p-2 rounded-md hover:bg-surface-hover transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 text-primary font-bold tracking-tight text-xl">
            <Hexagon size={26} className="fill-primary-light" />
            Agentix
          </Link>
          
          <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1.5 rounded-md hover:bg-surface-hover cursor-pointer border border-transparent hover:border-border transition-colors">
            <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">{(workspaceName || '?')[0]}</div>
            <span className="text-sm font-medium">{workspaceName || 'Loading...'}</span>
            <ChevronDown size={14} className="text-text-tertiary" />
          </div>
        </div>

        <div className="hidden md:flex items-center relative flex-1 max-w-xl mx-8">
          <Search size={16} className="absolute left-3 text-text-tertiary" />
          <input 
            className="w-full pl-9 pr-4 py-2 bg-surface hover:bg-white border border-border rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
            placeholder="Ask AI or search (Cmd+K)..." 
            type="text"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="text-text-secondary hover:text-text-primary hover:bg-surface-hover p-2 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
          </button>
          
          <Link
            href="/profile"
            title={session?.user?.email || undefined}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-medium text-xs shadow-sm ring-2 ring-white ml-1 overflow-hidden hover:scale-105 transition-transform"
          >
            {userInitials}
          </Link>

          <button 
            className="xl:hidden text-text-secondary hover:text-text-primary p-2 ml-1 rounded-md hover:bg-surface-hover transition-colors"
            onClick={() => setRightPanelOpen(!isRightPanelOpen)}
          >
            <Activity size={20} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Left Sidebar */}
        <motion.aside 
          className={`fixed lg:relative flex flex-col bg-surface border-r border-border w-64 h-full flex-shrink-0 z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[15px] font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-light/50 text-primary' 
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-primary' : 'text-text-tertiary'} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-border">
            <nav className="space-y-1">
              {bottomNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[15px] font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-light/50 text-primary' 
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-primary' : 'text-text-tertiary'} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </motion.aside>
        
        {/* Main Center Content */}
        <main className="flex-1 overflow-y-auto bg-background relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Right Panel (Current Activity, Recommendations, System Health) */}
        <aside 
          className={`fixed xl:relative right-0 flex flex-col bg-surface border-l border-border w-80 h-full flex-shrink-0 z-40 transition-transform duration-300 ease-in-out shadow-xl xl:shadow-none ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}`}
        >
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-8">
            
            {/* Current Activity */}
            <div>
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity size={14} className="text-primary" />
                Current Activity
              </h4>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((log, idx) => {
                    const failed = typeof log.action === 'string' && log.action.toLowerCase().startsWith('failed');
                    return (
                      <div className="flex gap-3" key={log.id || idx}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${failed ? 'bg-red-50 text-danger' : 'bg-emerald-50 text-success'}`}>
                          {failed ? <Database size={14} /> : <CheckCircle2 size={14} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary leading-tight">{log.action}</p>
                          {log.createdAt && (
                            <p className="text-xs text-text-tertiary mt-1">{new Date(log.createdAt).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-text-tertiary">No recent activity yet.</p>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lightbulb size={14} className="text-warning" />
                AI Suggestions
              </h4>
              <div className="space-y-3">
                <p className="text-xs text-text-tertiary">
                  Automated suggestions are not available yet in this build.
                </p>
              </div>
            </div>

            {/* System Health */}
            <div className="mt-auto">
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <Server size={14} className="text-text-tertiary" />
                System Health
              </h4>
              <div className="flex items-center justify-between p-3 bg-surface-hover rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${systemHealth.online ? 'bg-success animate-pulse' : 'bg-danger'}`}></span>
                  <span className="text-sm font-medium text-text-primary">
                    {systemHealth.online
                      ? (systemHealth.ollamaOnline ? 'All Systems Nominal' : 'Backend Online, AI Model Offline')
                      : 'Backend Unreachable'}
                  </span>
                </div>
                <span className="text-xs text-text-tertiary">
                  {systemHealth.pingMs !== null ? `${systemHealth.pingMs}ms ping` : '—'}
                </span>
              </div>
            </div>
            
          </div>
        </aside>

      </div>
    </div>
  );
}
