"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Mail,
  CheckCircle2,
  Settings2,
  User as UserIcon,
  Bell,
  Shield,
  Loader2
} from 'lucide-react';

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    aiPersona: 'Executive Analyst (Recommended)'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        <Loader2 size={36} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full relative overflow-y-auto p-4 md:p-8 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2 font-heading">My Profile</h1>
          <p className="text-text-secondary text-[15px]">Manage your personal details and AI Analyst preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-primary hover:bg-primary-hover text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-md hover:-translate-y-[1px] flex items-center gap-2 text-sm"
        >
          {saved ? <CheckCircle2 size={16} /> : <CheckCircle2 size={16} />}
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Navigation & Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{opacity: 0, y: 10}} 
            animate={{opacity: 1, y: 0}}
            className="bg-white border border-border rounded-2xl p-8 flex flex-col items-center text-center shadow-sm"
          >
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full bg-primary-light text-primary flex items-center justify-center text-4xl font-bold shadow-inner font-heading uppercase">
                {profile.firstName ? profile.firstName[0] : 'U'}
              </div>
              <button className="absolute bottom-0 right-0 bg-white border border-border p-2 rounded-full shadow-md text-text-tertiary hover:text-primary hover:border-primary-light transition-all hover:scale-105">
                <Camera size={16} />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-text-primary mb-6 font-heading">{profile.firstName} {profile.lastName}</h3>

            <div className="w-full text-left space-y-3 pt-6 border-t border-border">
              <div className="flex items-center gap-3 text-text-secondary text-[13px] font-medium">
                <Mail size={16} className="text-text-tertiary" />
                <span>{profile.email}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{opacity: 0, y: 10}} 
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.1}}
          >
            <nav className="flex flex-col gap-1">
              <button className="flex items-center gap-3 p-3.5 text-[15px] font-medium rounded-xl text-primary bg-primary-light/50 transition-colors">
                <UserIcon size={18} />
                Personal Details
              </button>
              <button className="flex items-center gap-3 p-3.5 text-[15px] font-medium rounded-xl text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors">
                <Settings2 size={18} className="text-text-tertiary" />
                AI Preferences
              </button>
              <button className="flex items-center gap-3 p-3.5 text-[15px] font-medium rounded-xl text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors">
                <Bell size={18} className="text-text-tertiary" />
                Notifications
              </button>
              <button className="flex items-center gap-3 p-3.5 text-[15px] font-medium rounded-xl text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors">
                <Shield size={18} className="text-text-tertiary" />
                Security
              </button>
            </nav>
          </motion.div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          <motion.div 
            initial={{opacity: 0, y: 10}} 
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2}}
            className="bg-white border border-border rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-lg font-bold text-text-primary mb-6 pb-4 border-b border-border font-heading">Personal Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm text-text-primary">First Name</label>
                <input 
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-[15px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
                  type="text" 
                  value={profile.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm text-text-primary">Last Name</label>
                <input 
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-[15px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
                  type="text" 
                  value={profile.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-bold text-sm text-text-primary">Email Address</label>
                <input 
                  className="bg-surface-hover border border-border rounded-xl px-4 py-3 text-[15px] text-text-secondary shadow-sm" 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{opacity: 0, y: 10}} 
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3}}
            className="bg-white border border-border rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-lg font-bold text-text-primary mb-6 pb-4 border-b border-border font-heading">AI Persona Preferences</h2>
            
            <div className="space-y-4">
              <label 
                className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all shadow-sm ${
                  profile.aiPersona === 'Executive Analyst (Recommended)' ? 'border-primary bg-primary-light/20 hover:bg-primary-light/30' : 'border-transparent bg-surface hover:border-border'
                }`}
                onClick={() => handleChange('aiPersona', 'Executive Analyst (Recommended)')}
              >
                <input 
                  type="radio" 
                  name="tone" 
                  className="mt-1 w-4 h-4 text-primary focus:ring-primary" 
                  checked={profile.aiPersona === 'Executive Analyst (Recommended)'} 
                  readOnly
                />
                <div>
                  <div className="font-bold text-text-primary text-[15px]">Executive Analyst (Recommended)</div>
                  <div className="text-[14px] text-text-secondary mt-1.5 leading-relaxed">Agentix will focus on bottom-line impact, avoiding complex math jargon and explaining statistical concepts in plain business English.</div>
                </div>
              </label>

              <label 
                className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all shadow-sm ${
                  profile.aiPersona === 'Data Scientist Mode' ? 'border-primary bg-primary-light/20 hover:bg-primary-light/30' : 'border-transparent bg-surface hover:border-border'
                }`}
                onClick={() => handleChange('aiPersona', 'Data Scientist Mode')}
              >
                <input 
                  type="radio" 
                  name="tone" 
                  className="mt-1 w-4 h-4 text-primary focus:ring-primary" 
                  checked={profile.aiPersona === 'Data Scientist Mode'} 
                  readOnly
                />
                <div>
                  <div className="font-bold text-text-primary text-[15px]">Data Scientist Mode</div>
                  <div className="text-[14px] text-text-secondary mt-1.5 leading-relaxed">Agentix will provide raw statistical outputs, including p-values, standard deviations, and detailed causal inference rationales.</div>
                </div>
              </label>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
