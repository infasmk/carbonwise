import React from 'react';
import { 
  LayoutDashboard, 
  Flame, 
  FlaskConical, 
  CheckCircle2, 
  FileCheck2, 
  UploadCloud, 
  BarChart3, 
  History, 
  Database, 
  FileText, 
  Settings, 
  BookOpen, 
  X,
  Compass
} from 'lucide-react';

interface SidebarProps {
  currentModule: string;
  onSelectModule: (module: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  isOpenMobile,
  onCloseMobile
}) => {
  const primaryNav = [
    { id: 'landing', label: 'Product Intro', icon: Compass },
    { id: 'dashboard', label: 'Decision Overview', icon: LayoutDashboard },
    { id: 'heat-planner', label: 'Heat Planner', icon: Flame, badge: 'Primary' },
    { id: 'scenarios', label: 'Scenario Lab', icon: FlaskConical },
    { id: 'feasibility', label: 'Feasibility Engine', icon: CheckCircle2 },
    { id: 'validation', label: 'Validation Center', icon: FileCheck2 },
    { id: 'data-hub', label: 'Data Hub', icon: UploadCloud },
    { id: 'benchmarks', label: 'JSL Benchmarks', icon: BarChart3 },
    { id: 'decisions', label: 'Decision History', icon: History },
  ];

  const secondaryNav = [
    { id: 'factors', label: 'Factor Registry', icon: Database },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'product-story', label: 'About & Roadmap', icon: BookOpen },
    { id: 'settings', label: 'Settings / Profile', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    onSelectModule(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between p-3">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 pt-1 px-2 border-b border-industrial-800">
          <button 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            {/* Custom CW Industrial Logo Mark (SVG) */}
            <div className="w-8 h-8 rounded-lg bg-industrial-900 border border-orange-brand/50 flex items-center justify-center p-1.5 shadow-sm">
              <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
                <path 
                  d="M8 16C8 11.5817 11.5817 8 16 8C19.1 8 21.78 9.77 23.08 12.35" 
                  stroke="#e8590c" 
                  strokeWidth="3.2" 
                  strokeLinecap="round"
                />
                <path 
                  d="M24 16C24 20.4183 20.4183 24 16 24C12.9 24 10.22 22.23 8.92 19.65" 
                  stroke="#48505e" 
                  strokeWidth="3.2" 
                  strokeLinecap="round"
                />
                <circle cx="16" cy="16" r="3.5" fill="#e8590c" />
              </svg>
            </div>
            <div>
              <div className="font-mono text-sm font-bold tracking-wider text-industrial-100 flex items-center gap-1.5">
                CARBONWISE
                <span className="text-[10px] text-orange-brand px-1 py-0.2 bg-orange-brand/10 border border-orange-brand/20 rounded font-normal">v1.0</span>
              </div>
              <p className="text-[10px] text-industrial-400 font-mono tracking-tight">Pre-Melt Intelligence</p>
            </div>
          </button>

          <button 
            onClick={onCloseMobile}
            className="md:hidden text-industrial-400 hover:text-industrial-200 p-1"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="mt-4 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-industrial-500 font-medium">
            Core Modules
          </div>
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const active = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs transition font-medium ${
                  active
                    ? 'bg-industrial-800 text-orange-400 font-semibold border-l-2 border-orange-brand pl-2'
                    : 'text-industrial-300 hover:bg-industrial-850 hover:text-industrial-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-orange-brand' : 'text-industrial-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-brand/15 text-orange-400 border border-orange-brand/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="mt-5 space-y-1 pt-3 border-t border-industrial-800">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-industrial-500 font-medium">
            Governance & Registry
          </div>
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const active = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition font-medium ${
                  active
                    ? 'bg-industrial-800 text-orange-400 font-semibold border-l-2 border-orange-brand pl-2'
                    : 'text-industrial-400 hover:bg-industrial-850 hover:text-industrial-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-orange-brand' : 'text-industrial-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer: Tagline */}
      <div className="p-2.5 rounded bg-industrial-900 border border-industrial-800 text-center">
        <div className="text-[11px] font-serif italic text-industrial-300 font-medium">
          "The decision is made before the melt."
        </div>
        <div className="text-[9px] text-industrial-500 font-mono mt-0.5">
          Decision layer around SAP/MES
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-industrial-800 bg-industrial-950 shrink-0">
        {navContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={onCloseMobile}
          />
          <div className="relative flex w-64 flex-col bg-industrial-950 border-r border-industrial-800 shadow-xl z-10 animate-fade-in">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
