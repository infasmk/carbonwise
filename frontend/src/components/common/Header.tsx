import React from 'react';
import { 
  Menu,
  Activity,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  currentModule: string;
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
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
          <span className="font-mono text-xs uppercase tracking-wider text-industrial-500">MODULE</span>
          <span className="text-industrial-700 font-mono text-xs">/</span>
          <h1 className="text-sm font-semibold text-industrial-100 tracking-tight capitalize">
            {currentModule.replace('-', ' ')}
          </h1>
        </div>
      </div>

      {/* Enterprise Plant Context */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-industrial-900 border border-industrial-800 text-industrial-300 text-xs font-mono font-medium">
          <Layers className="w-3.5 h-3.5 text-orange-brand" />
          <span>Stainless Melt Shop • Primary EAF-AOD Route</span>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Real-time Engine Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-industrial-300 font-mono bg-industrial-900 border border-industrial-800 px-2.5 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
          <span className="text-[11px] font-medium">Pre-Melt Engine Online</span>
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-industrial-800">
          <div className="w-7 h-7 rounded-full bg-industrial-850 border border-industrial-700 flex items-center justify-center text-xs font-mono text-orange-400 font-semibold shadow-inner">
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
