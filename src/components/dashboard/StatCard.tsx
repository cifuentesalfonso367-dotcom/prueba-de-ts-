import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass = "text-indigo-400" }) => {
  return (
    <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col gap-1 transition-all duration-300 hover:bg-white/[0.05] hover:translate-y-[-4px]">
      <div className={`${colorClass} mb-1 opacity-80`}>{icon}</div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
      </div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
};
