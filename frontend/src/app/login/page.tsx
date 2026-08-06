import React from 'react';
import { signIn } from '@/auth';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const error = params?.error;
  
  const handleLogin = async (formData: FormData) => {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/dashboard"
      });
    } catch (error: any) {
      const errorString = String(error.type) + String(error.name) + String(error.message);
      if (errorString.includes("CredentialsSignin")) {
        const { redirect } = await import("next/navigation");
        redirect("/login?error=InvalidCredentials");
      }
      throw error; // Rethrows the redirect error for success
    }
  };

  const handleGoogleLogin = async () => {
    "use server";
    await signIn("google", { redirectTo: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 w-full flex flex-col md:flex-row relative font-sans">
      
      {/* Left Branding Panel */}
      <div className="hidden md:flex flex-col w-1/2 bg-white border-r border-slate-200 p-12 lg:p-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-50/50 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col h-full justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="text-indigo-600" size={32} />
            <span className="text-2xl font-bold tracking-tight">Agentix</span>
          </Link>
          
          <div className="flex-1 flex flex-col justify-center gap-6 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-700 text-xs font-semibold w-fit">
              Agentix 2.0
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-slate-900">
              The AI Operating System for your data.
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed font-light">
              Connect your databases or upload spreadsheets. Agentix automatically cleans, analyzes, and explains your data in seconds.
            </p>
          </div>
          
          <div className="text-sm text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} Agentix AI. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-slate-50">
        <div className="w-full max-w-[400px] flex flex-col">
          
          <div className="flex md:hidden items-center gap-2 mb-12 justify-center">
            <Sparkles className="text-indigo-600" size={28} />
            <span className="text-2xl font-bold tracking-tight">Agentix</span>
          </div>
          
          <div className="flex flex-col text-left gap-2 mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500 font-medium">Log in to continue to your workspace</p>
          </div>

          <div className="flex flex-col gap-6">
            <form action={handleGoogleLogin}>
              <button className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-slate-700 shadow-sm text-sm" type="submit">
                <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Continue with Google
              </button>
            </form>

            <div className="flex items-center w-full gap-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Or email</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            {error === "InvalidCredentials" && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                <AlertCircle size={16} />
                Invalid email or password.
              </div>
            )}

            <form action={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">Email address</label>
                <input name="email" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm" id="email" placeholder="name@company.com" required type="email"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                  <a className="text-xs text-indigo-600 hover:text-indigo-800 font-medium" href="#">Forgot password?</a>
                </div>
                <input name="password" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm" id="password" placeholder="••••••••" required type="password"/>
              </div>
              
              <div className="text-xs text-slate-500 text-center bg-slate-100 border border-slate-200 rounded-md p-3 mt-2">
                Use <strong>admin@agentix.com</strong> / <strong>admin</strong> to demo
              </div>
              
              <button className="w-full mt-2 py-2.5 px-4 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 hover:shadow-md transition-all flex items-center justify-center gap-2 shadow-sm" type="submit">
                Sign In
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account? 
              <a className="font-medium text-indigo-600 hover:text-indigo-800 ml-1.5" href="#">Request access</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
