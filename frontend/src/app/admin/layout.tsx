"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  BrainCircuit,
  Wand2,
  Settings,
  Hexagon,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Back to App', href: '/dashboard', icon: ArrowLeft },
    { name: 'Your AI Team', href: '/admin/brain-console', icon: BrainCircuit },
    { name: 'Automations', href: '/admin/workflow-manager', icon: Wand2 },
    { name: 'Advanced Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 w-full h-full relative overflow-hidden flex font-sans">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:relative flex flex-col bg-slate-900 text-white w-64 h-full flex-shrink-0 z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-indigo-400 font-semibold tracking-tight text-lg">
            <Hexagon size={24} className="fill-indigo-500/20" />
            Agentix Pro
          </Link>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">
          <nav className="space-y-1">
            <div className="px-3 mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Advanced Features</div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-500/10 text-indigo-400' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-md h-16 shrink-0 flex justify-between items-center px-4 md:px-8 z-30 border-b border-slate-200 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-slate-500 hover:text-slate-700 p-2 rounded-md hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex font-semibold text-slate-900">Agentix Pro Features</div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/profile" className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-medium text-xs shadow-sm ring-2 ring-white ml-2 overflow-hidden hover:scale-105 transition-transform">
              SJ
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
