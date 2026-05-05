"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, CheckCircle2, ShieldAlert, Sparkles, MoveRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ error: "", success: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) return setMsg({ success: "", error: "Passwords do not match." });
    
    setLoading(true);
    setMsg({ error: "", success: "" });

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setMsg({ error: "", success: "Account provisioned successfully. Redirecting..." });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setMsg({ success: "", error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] mix-blend-screen pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] mix-blend-screen pointer-events-none animate-float" style={{ animationDelay: '1.5s' }}></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="w-full max-w-[600px] glass-panel p-10 sm:p-14 animate-slide-up relative z-10 border border-white/5 shadow-2xl">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 mb-6 shadow-inner relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20"></div>
             <Sparkles className="text-indigo-400 relative z-10" size={28} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Join the <span className="text-gradient">Network</span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm font-medium">
            Register your credentials to access the secure medical infrastructure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative group">
                <input 
                  className="pro-input pl-11" 
                  placeholder="Dr. Jane Doe"
                  onChange={e => setFormData({...formData, nombre: e.target.value})}
                  required
                />
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Corporate Email</label>
              <div className="relative group">
                <input 
                  type="email" 
                  className="pro-input pl-11" 
                  placeholder="jane@candy.io"
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <input 
                  type="password" 
                  className="pro-input pl-11" 
                  placeholder="••••••••"
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Confirm Password</label>
              <div className="relative group">
                <input 
                  type="password" 
                  className="pro-input pl-11" 
                  placeholder="••••••••"
                  onChange={e => setFormData({...formData, confirm: e.target.value})}
                  required
                />
                <ShieldAlert size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            {msg.error && (
              <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center gap-3 animate-slide-up">
                 <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> {msg.error}
              </div>
            )}
            {msg.success && (
              <div className="p-4 mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium flex items-center gap-3 animate-slide-up">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div> {msg.success}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-premium w-full py-4 flex items-center justify-center gap-3 text-[15px]">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Provisioning...
                </div>
              ) : (
                <>PROVISION ACCOUNT <MoveRight size={18} /></>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already authorized?{" "}
          <Link href="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors underline-offset-4 hover:underline">
            Initiate login
          </Link>
        </p>
      </div>
    </div>
  );
}
