"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials provided");
      login(data.data.accessToken, data.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 blur-[120px] mix-blend-screen pointer-events-none animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 blur-[120px] mix-blend-screen pointer-events-none animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-[1000px] glass-panel flex flex-col md:flex-row overflow-hidden animate-slide-up relative z-10 border border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
        
        {/* Left Side: Brand Identity */}
        <div className="flex-1 p-12 lg:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden bg-black/20">
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 mb-8 shadow-lg shadow-indigo-500/25">
              <Activity className="text-white" size={28} />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
               Welcome to <br/>
               <span className="text-gradient">C.A.N.D.Y.</span>
            </h1>
            <p className="mt-6 text-slate-400 text-lg max-w-md font-light leading-relaxed">
              The next-generation medical management portal. Secure, lightning-fast, and designed for modern healthcare professionals.
            </p>
          </div>
          
          <div className="mt-16 space-y-4 relative z-10">
            <div className="flex items-center gap-3 text-sm text-slate-300 font-medium bg-white/5 w-max px-4 py-2 border border-white/5 backdrop-blur-sm">
              <ShieldCheck size={18} className="text-emerald-400" /> Enterprise Grade Security
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300 font-medium bg-white/5 w-max px-4 py-2 border border-white/5 backdrop-blur-sm">
              <Sparkles size={18} className="text-pink-400" /> AI-Powered Analytics
            </div>
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50"></div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 p-12 lg:p-16 flex flex-col justify-center bg-black/40">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Sign in to your account</h2>
            <p className="text-slate-500 text-sm">Access your secure workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <input 
                  type="email" 
                  className="pro-input pl-12 w-full"
                  placeholder="doctor@candy.io"
                  onChange={e => setCreds({...creds, email: e.target.value})}
                  required
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <input 
                  type="password" 
                  className="pro-input pl-12 w-full"
                  placeholder="••••••••"
                  onChange={e => setCreds({...creds, password: e.target.value})}
                  required
                />
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center gap-2 animate-slide-up">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-premium w-full py-4 mt-4 flex items-center justify-center gap-3 text-[15px]">
              {loading ? (
                <div className="flex gap-2 items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> 
                  Authenticating...
                </div>
              ) : (
                <>CONTINUE TO PORTAL <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Need an account?{" "}
            <Link href="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors underline-offset-4 hover:underline">
              Request access
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
