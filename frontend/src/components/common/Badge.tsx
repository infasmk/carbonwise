import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'accent' | 'demo';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = ''
}) => {
  const base = "inline-flex items-center font-mono font-medium rounded tracking-wide border";
  
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-0.5 text-xs"
  };

  const variants = {
    success: "bg-status-success-bg text-status-success border-status-success-border",
    danger: "bg-status-danger-bg text-status-danger border-status-danger-border",
    warning: "bg-status-warning-bg text-status-warning border-status-warning-border",
    info: "bg-status-info-bg text-status-info border-blue-500/30",
    neutral: "bg-industrial-800 text-industrial-300 border-industrial-700",
    accent: "bg-orange-brand/10 text-orange-400 border-orange-brand/30",
    demo: "bg-amber-500/10 text-amber-300 border-amber-500/30 text-[11px]"
  };

  return (
    <span className={clsx(base, sizeClasses[size], variants[variant], className)}>
      {children}
    </span>
  );
};
