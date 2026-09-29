import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Sliders, 
  User, 
  Building, 
  Bell, 
  Lock, 
  Save,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const SettingsView: React.FC = () => {
  const [accountingBoundary, setAccountingBoundary] = useState<'scope1_2_loc' | 'scope1_2_mkt' | 'scope1_only'>('scope1_2_loc');
  const [energyUnits, setEnergyUnits] = useState<'mwh' | 'gj'>('mwh');
  const [demoNoticeVisible, setDemoNoticeVisible] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-industrial-100 font-sans tracking-tight">
              Settings &amp; Accounting Boundaries
            </h2>
            <Badge variant="accent">ENTERPRISE CONFIG</Badge>
          </div>
          <p className="text-xs sm:text-sm text-industrial-400 mt-0.5">
            Configure GHG accounting scopes, unit conventions, user permissions, and plant boundary definitions.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-brand hover:bg-orange-bright text-white font-mono text-xs font-semibold transition shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Preferences</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-lg bg-status-success-bg border border-status-success-border text-status-success font-mono text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>System configuration preferences updated successfully.</span>
        </div>
      )}

      {/* SECTION 1: GHG ACCOUNTING BOUNDARY (Section 63) */}
      <div className="industrial-card p-5 border border-industrial-800 rounded-lg space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
          <span className="font-bold text-industrial-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-brand" />
            <span>GHG Accounting Boundary &amp; Standard</span>
          </span>
          <Badge variant="demo">ISO 14064</Badge>
        </div>

        <p className="text-industrial-400 text-[11px] leading-relaxed">
          Define the organizational accounting boundary applied to pre-production heat scenario evaluations.
        </p>

        <div className="space-y-2.5">
          <label className="flex items-start gap-3 p-3 rounded bg-industrial-900 border border-industrial-800 cursor-pointer hover:border-industrial-700">
            <input
              type="radio"
              name="boundary"
              checked={accountingBoundary === 'scope1_2_loc'}
              onChange={() => setAccountingBoundary('scope1_2_loc')}
              className="mt-0.5 accent-orange-brand"
            />
            <div>
              <div className="font-bold text-industrial-100">
                Scope 1 + Scope 2 (Location-Based Regional Grid Factor) — Recommended
              </div>
              <div className="text-[11px] text-industrial-400 mt-0.5">
                Evaluates direct process combustion (Scope 1) plus physical regional grid emission intensity (CEA baseline 0.719 tCO2e/MWh).
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded bg-industrial-900 border border-industrial-800 cursor-pointer hover:border-industrial-700">
            <input
              type="radio"
              name="boundary"
              checked={accountingBoundary === 'scope1_2_mkt'}
              onChange={() => setAccountingBoundary('scope1_2_mkt')}
              className="mt-0.5 accent-orange-brand"
            />
            <div>
              <div className="font-bold text-industrial-100">
                Scope 1 + Scope 2 (Market-Based Contracted PPA Attributes)
              </div>
              <div className="text-[11px] text-industrial-400 mt-0.5">
                Incorporates wheeled renewable Power Purchase Agreements and energy attribute certificates (e.g. 0.065 tCO2e/MWh).
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded bg-industrial-900 border border-industrial-800 cursor-pointer hover:border-industrial-700">
            <input
              type="radio"
              name="boundary"
              checked={accountingBoundary === 'scope1_only'}
              onChange={() => setAccountingBoundary('scope1_only')}
              className="mt-0.5 accent-orange-brand"
            />
            <div>
              <div className="font-bold text-industrial-100">
                Scope 1 Direct Process Emissions Only
              </div>
              <div className="text-[11px] text-industrial-400 mt-0.5">
                Excludes electricity generation; measures only direct ladle burners, oxidation loss, and lime calcination.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* SECTION 2: UNITS & CONVENTIONS */}
      <div className="industrial-card p-5 border border-industrial-800 rounded-lg space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
          <span className="font-bold text-industrial-200 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-brand" />
            <span>Unit Conventions &amp; Display Standards</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-industrial-400 block mb-1">Energy Intensity Unit</label>
            <select
              value={energyUnits}
              onChange={(e) => setEnergyUnits(e.target.value as 'mwh' | 'gj')}
              className="w-full bg-industrial-900 border border-industrial-800 rounded px-2.5 py-1.5 text-industrial-200 focus:outline-none"
            >
              <option value="mwh">MWh / metric tonne finished steel (Standard)</option>
              <option value="gj">Gigajoules (GJ / tonne liquid steel)</option>
            </select>
          </div>

          <div>
            <label className="text-industrial-400 block mb-1">Demo Watermark &amp; Badges</label>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={demoNoticeVisible}
                onChange={(e) => setDemoNoticeVisible(e.target.checked)}
                className="accent-orange-brand"
              />
              <span className="text-industrial-300">Enforce "ILLUSTRATIVE DEMO" watermark across all screens</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: ORGANIZATIONAL ROLE */}
      <div className="industrial-card p-5 border border-industrial-800 rounded-lg space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
          <span className="font-bold text-industrial-200 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-orange-brand" />
            <span>Active Operator Profile</span>
          </span>
          <span className="text-orange-400 font-bold">Authenticated</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded bg-industrial-900 border border-industrial-800">
            <span className="text-industrial-500 text-[10px] block">NAME</span>
            <span className="text-industrial-200 font-bold">M. Sharma</span>
          </div>
          <div className="p-3 rounded bg-industrial-900 border border-industrial-800">
            <span className="text-industrial-500 text-[10px] block">ROLE</span>
            <span className="text-orange-400 font-bold">Senior Production Planner</span>
          </div>
          <div className="p-3 rounded bg-industrial-900 border border-industrial-800">
            <span className="text-industrial-500 text-[10px] block">PLANT JURISDICTION</span>
            <span className="text-industrial-200 font-bold">Melt Shop 2 (Stainless)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
