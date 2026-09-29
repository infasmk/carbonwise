import React from 'react';
import { 
  Bell, 
  Database, 
  User, 
  HelpCircle, 
  Sparkles,
  Menu,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { Badge } from './Badge';

interface HeaderProps {
  currentModule: string;
  onOpenJuryTour: () => void;
  isJuryModeActive: boolean;
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  onOpenJuryTour,
  isJuryModeActive,
  onToggleMobileNav
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-industrial-800 bg-industrial-950/90 px-4 md:px-6 backdrop-blur">
      {/* Mobile nav trigger & Module Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileNav}
          className="md:hidden text-industrial-400 hover:text-industrial-200 p-1.5 rounded bg-industrial-850 border border-industrial-700"
          aria-label="Toggle navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-industrial-400">MODULE</span>
          <span className="text-industrial-600 font-mono text-xs">/</span>
          <h1 className="text-sm font-semibold text-industrial-100 tracking-tight capitalize">
            {currentModule.replace('-', ' ')}
          </h1>
        </div>
      </div>

      {/* Global Demo Status Banner (Section 90) */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>ILLUSTRATIVE DEMO — NOT JSL PRODUCTION DATA</span>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Jury Demo Mode CTA */}
        <button
          onClick={onOpenJuryTour}
          className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded transition border ${
            isJuryModeActive 
              ? 'bg-orange-brand/20 border-orange-brand text-orange-400 font-semibold shadow-sm'
              : 'bg-industrial-850 hover:bg-industrial-800 border-industrial-700 text-industrial-300'
          }`}
          title="Launch 3-5 minute guided demonstration"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-brand" />
          <span className="hidden sm:inline">Jury Demo Tour</span>
          <span className="sm:hidden">Demo</span>
        </button>

        {/* Data Status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-industrial-400 font-mono bg-industrial-900 border border-industrial-800 px-2 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
          <span className="text-[11px]">Engine Active</span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-industrial-800">
          <div className="w-7 h-7 rounded-full bg-industrial-800 border border-industrial-700 flex items-center justify-center text-xs font-mono text-orange-400 font-semibold">
            JS
          </div>
          <div className="hidden xl:block text-left text-xs leading-tight">
            <div className="font-medium text-industrial-200">Production Planner</div>
            <div className="text-[10px] text-industrial-500 font-mono">Stainless Melts / JSL</div>
          </div>
        </div>
      </div>
    </header>
  );
};
