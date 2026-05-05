import React from 'react';
import { Heart, FileText, Users, LogOut, LucideIcon, Activity } from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  visible?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  activeId: string;
  onItemClick: (id: string) => void;
  user: any;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, activeId, onItemClick, user, onLogout }) => {
  const displayName = user?.nombre || user?.email || "Médico Responsable";
  const displayRole = user?.rol || user?.role || "USER";

  return (
    <aside className="w-64 flex flex-col py-8 px-6 gap-6" style={{ background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
      {/* Branding C.A.N.D.Y */}
      <div className="flex items-center gap-3 px-2 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Activity className="text-white" size={24} />
        </div>
        <div>
          <span className="text-2xl font-black text-white tracking-tighter gradient-text">C.A.N.D.Y</span>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Medical Pro</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {items.filter(item => item.visible !== false).map((item) => (
          <button 
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
              activeId === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={19} className={activeId === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} /> 
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
         <div className="glass-card p-4 rounded-2xl mb-4 border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Usuario Activo</p>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                 {displayName[0].toUpperCase()}
               </div>
               <div className="overflow-hidden">
                 <p className="text-sm font-bold text-white truncate">{displayName}</p>
                 <p className="text-[10px] text-indigo-400 font-mono">{displayRole}</p>
               </div>
            </div>
         </div>
         <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors group">
           <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
           <span className="text-sm font-bold">Cerrar Sesión</span>
         </button>
      </div>

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(to right, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </aside>
  );
};
