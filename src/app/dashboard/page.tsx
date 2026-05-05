"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Users, LogOut, FileText, UploadCloud, Ban, Trash2, CheckCircle2, RefreshCcw, Download, Activity, HeartPulse, Search, Bell, Settings, Plus, LayoutGrid, ChevronRight, ShieldAlert, User
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'users' | 'documents'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isAdmin = user?.role === 'ADMIN' || user?.rol === 'ADMIN';

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      if (activeTab === 'users' && isAdmin) {
        const res = await fetch("/api/users", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setUsers(data.data ?? []);
      } else if (activeTab === 'users' && !isAdmin) {
        setActiveTab('documents');
      }

      if (activeTab === 'documents') {
        const res = await fetch("/api/documents", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setDocuments(data.data ?? []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to sync data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, activeTab]);

  const handleUpdateStatus = async (id: number, type: 'user' | 'doc', status: string) => {
    const action = type === 'user' ? 'change status' : 'evaluate document';
    if (!confirm(`Confirm ${action} to ${status}?`)) return;
    
    const url = type === 'user' ? `/api/users/${id}` : `/api/documents/${id}`;
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ estado: status })
    });
    fetchData();
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const res = await fetch(`/api/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        setSelectedFile(null);
        fetchData();
      }
    } catch (err: any) {
      alert("Encryption error during transit");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-mesh flex p-4 lg:p-6 gap-6 relative overflow-hidden text-slate-200">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] mix-blend-screen pointer-events-none animate-pulse-glow"></div>
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 hidden md:flex flex-col glass-panel p-6 sticky top-6 h-[calc(100vh-48px)] z-20">
        
        {/* Brand */}
        <div className="flex items-center gap-4 px-2 mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white m-0 leading-tight">C.A.N.D.Y.</h1>
            <p className="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase">Enterprise</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Main Menu</p>
          
          {isAdmin && (
            <button 
              onClick={() => setActiveTab('users')} 
              className={`flex items-center gap-3 px-4 py-3.5 transition-all duration-300 group ${
                activeTab === 'users' ? 'bg-indigo-500/10 border border-indigo-500/30' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className={`p-2 transition-colors ${activeTab === 'users' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                <Users size={16} />
              </div>
              <span className={`font-semibold text-sm transition-colors ${activeTab === 'users' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                Team Directory
              </span>
              {activeTab === 'users' && <ChevronRight size={16} className="ml-auto text-indigo-400" />}
            </button>
          )}

          <button 
            onClick={() => setActiveTab('documents')} 
            className={`flex items-center gap-3 px-4 py-3.5 transition-all duration-300 group ${
              activeTab === 'documents' ? 'bg-purple-500/10 border border-purple-500/30' : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className={`p-2 transition-colors ${activeTab === 'documents' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
              <FileText size={16} />
            </div>
            <span className={`font-semibold text-sm transition-colors ${activeTab === 'documents' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
              Clinical Records
            </span>
            {activeTab === 'documents' && <ChevronRight size={16} className="ml-auto text-purple-400" />}
          </button>
        </div>

        {/* User Footer Card */}
        <div className="mt-auto bg-black/20 p-4 border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center font-black text-white shadow-inner">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user?.nombre || user?.email}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{user?.role || user?.rol || 'Physician'}</p>
                </div>
              </div>
            </div>
            <button onClick={logout} className="w-full py-2.5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 text-xs font-bold transition-colors flex items-center justify-center gap-2">
              <LogOut size={14} /> Close Session
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 h-[calc(100vh-48px)]">
        
        {/* Top Navbar */}
        <header className="glass-panel h-20 px-8 flex items-center justify-between mb-6 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-slate-500" size={24} />
            <h2 className="text-xl font-bold text-white tracking-tight">
              {activeTab === 'users' ? 'Workforce Access Management' : 'Secure Vault'}
            </h2>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-2 bg-black/40 px-4 py-2.5 border border-white/5">
              <Search size={16} className="text-slate-500" />
              <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm w-48 text-white placeholder:text-slate-600" />
            </div>
            
            <button onClick={fetchData} className="w-10 h-10 bg-white/5 hover:bg-indigo-500/20 text-slate-400 transition-colors flex items-center justify-center hover:text-indigo-400 shadow-inner group">
              <RefreshCcw size={18} className={`${loading ? 'animate-spin text-indigo-400' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>
            <button className="w-10 h-10 bg-white/5 hover:bg-white/10 text-slate-400 transition-colors flex items-center justify-center relative">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-pink-500 border-2 border-[#0f172a]"></span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar fade-up flex flex-col gap-6">
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-3 shrink-0">
               <div className="w-2 h-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> {error}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="flex flex-col xl:flex-row gap-6 shrink-0">
              {/* Pro Stat Cards */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Assets", val: documents.length, icon: FileText, color: "text-indigo-400", bg: "bg-indigo-500/10", border: 'border-indigo-500/20' },
                  { label: "Verified", val: documents.filter(d => d.estado === 'APPROVED').length, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: 'border-emerald-500/20' },
                  { label: "In Review", val: documents.filter(d => d.estado === 'PENDING').length, icon: Activity, color: "text-amber-400", bg: "bg-amber-500/10", border: 'border-amber-500/20' },
                  { label: "Issues", val: documents.filter(d => d.estado === 'REJECTED').length, icon: HeartPulse, color: "text-rose-400", bg: "bg-rose-500/10", border: 'border-rose-500/20' },
                ].map((stat, i) => (
                  <div key={i} className="glass-panel p-5 flex flex-col gap-3 relative overflow-hidden group hover:translate-y-[-2px]">
                    <div className="absolute right-[-20%] top-[-20%] w-24 h-24 blur-[30px] opacity-20 mix-blend-screen transition-opacity group-hover:opacity-40" style={{ backgroundColor: stat.color.replace('text-', '') }}></div>
                    <div className={`w-10 h-10 ${stat.bg} ${stat.color} flex items-center justify-center border ${stat.border} shadow-inner`}>
                      <stat.icon size={20} className={stat.color} />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">{stat.val}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload Action Area */}
              <div className="xl:w-80 glass-panel p-5 flex flex-col justify-center items-center text-center border-dashed border-2 hover:border-indigo-500/30 transition-colors">
                <input type="file" ref={fileInputRef} onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="hidden" />
                
                {selectedFile ? (
                  <div className="w-full flex justify-between items-center bg-indigo-500/10 border border-indigo-500/30 p-3">
                     <div className="overflow-hidden flex-1 text-left px-2">
                       <p className="text-xs text-indigo-300 font-mono truncate">{selectedFile.name}</p>
                       <p className="text-[9px] text-indigo-500 uppercase font-bold mt-1">Ready for uplink</p>
                     </div>
                     <div className="flex gap-1 shrink-0">
                       <button onClick={handleConfirmUpload} disabled={uploading} className="p-2 bg-emerald-500 text-black hover:scale-105 transition shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                         {uploading ? <RefreshCcw size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                       </button>
                       <button onClick={() => setSelectedFile(null)} className="p-2 text-rose-400 hover:bg-rose-500/10 transition">
                         <Trash2 size={16} />
                       </button>
                     </div>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-slate-800 flex items-center justify-center mb-4">
                      <UploadCloud className="text-indigo-400" size={24} />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">Upload Encrypted File</p>
                    <p className="text-[10px] text-slate-500 mb-4 max-w-[200px]">Securely transfer medical records into the core database.</p>
                    <button onClick={() => fileInputRef.current?.click()} className="btn-premium w-full py-3 text-xs tracking-wider">
                      SELECT FILE
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="glass-panel p-6 flex-1 min-h-[400px]">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-lg font-bold text-white">Database Registry</h3>
              <div className="flex gap-2">
                <button className="p-2 bg-white/5 text-slate-400 hover:text-white"><Settings size={18}/></button>
              </div>
            </div>

            {loading ? (
              <div className="h-48 flex items-center justify-center">
                 <div className="flex flex-col items-center gap-4">
                   <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-none animate-spin"></div>
                   <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest animate-pulse">Syncing nodes</p>
                 </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-pro">
                  <thead>
                    <tr>
                      <th>{activeTab === 'users' ? 'Identity & Credentials' : 'Document Reference'}</th>
                      <th>{activeTab === 'users' ? 'Authorization Level' : 'Approval Status'}</th>
                      <th className="text-right">Execution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTab === 'users' ? users.map(u => (
                      <tr key={u.id} className="group">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-white/5 group-hover:border-indigo-500/30 transition-colors">
                              {u.nombre?.[0] || 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">{u.nombre}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-wide border ${
                            u.rol === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-slate-800 text-slate-400 border-white/5'
                          }`}>
                            {u.rol === 'ADMIN' ? <ShieldAlert size={12}/> : <User size={12}/>}
                            {u.rol}
                          </span>
                        </td>
                        <td className="text-right">
                          {u.rol !== 'ADMIN' && (
                            <button onClick={() => handleUpdateStatus(u.id, 'user', u.estado === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')} 
                                    className={`p-2 border transition-all ${
                                      u.estado === 'ACTIVE' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                    }`}>
                              {u.estado === 'ACTIVE' ? <Ban size={16}/> : <CheckCircle2 size={16}/>}
                            </button>
                          )}
                        </td>
                      </tr>
                    )) : documents.map(d => (
                      <tr key={d.id} className="group">
                        <td>
                           <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-800 flex items-center justify-center text-purple-400 border border-white/5 group-hover:border-purple-500/30 transition-colors">
                              <FileText size={18}/>
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">{d.title}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{new Date(d.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-wide border ${
                            d.estado === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                            d.estado === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 
                            'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {d.estado}
                          </span>
                        </td>
                        <td className="text-right">
                           <div className="flex gap-2 justify-end">
                            {isAdmin && (
                              <button onClick={() => handleUpdateStatus(d.id, 'doc', 'APPROVED')} className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"><CheckCircle2 size={16}/></button>
                            )}
                            {d.fileUrl && (
                              <a href={d.fileUrl} download className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"><Download size={16} /></a>
                            )}
                            {isAdmin && (
                              <button onClick={() => handleUpdateStatus(d.id, 'doc', 'REJECTED')} className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"><Ban size={16}/></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
