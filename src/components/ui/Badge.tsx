import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
  const variants = {
    success: 'bg-green-500/10 text-green-400',
    danger: 'bg-red-500/10 text-red-400',
    warning: 'bg-yellow-500/10 text-yellow-400',
    info: 'bg-indigo-500/10 text-indigo-400',
    neutral: 'bg-slate-700/50 text-slate-300'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
};
