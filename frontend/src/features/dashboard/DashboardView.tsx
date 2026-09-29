import React from 'react';
import { 
  Flame, 
  CheckCircle2, 
  TrendingDown, 
  FileCheck, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Calendar,
  Layers
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { DecisionRecord } from '../../types';

interface DashboardViewProps {
  onNavigate: (module: string) => void;
  recentDecisions: DecisionRecord[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, recentDecisions }) => {
  return (
    <div className="space-y-6">
      {/* Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-industrial-100 font-sans tracking-tight">
            Decision Overview
          </h2>
          <p className="text-xs sm:text-sm text-industrial-400 mt-0.5">
            CarbonWise planning intelligence across current scenarios, validation data and production opportunities.
          </p>
        </div>

        {/* Action quick links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('heat-planner')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-brand hover:bg-orange-bright text-white font-mono text-xs font-semibold transition shadow-sm"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>New Heat Plan</span>
          </button>
          <button
            onClick={() => onNavigate('scenarios')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-industrial-200 font-mono text-xs transition"
          >
            <span>Scenario Lab</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Top KPI Cards (Section 7) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* KPI 1 */}
        <div className="industrial-card p-4 border border-industrial-800 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-industrial-400 font-mono text-[10px] uppercase tracking-wider">
            <span>CURRENT CARBON</span>
            <Badge variant="demo" size="sm">DEMO</Badge>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-industrial-100">2.31</span>
            <span className="text-[11px] font-mono text-industrial-400">tCO2e/t</span>
          </div>
          <div className="text-[10px] text-industrial-500 font-mono mt-1">
            Grade 304 Baseline Melt
          </div>
        </div>

        {/* KPI 2 */}
        <div className="industrial-card p-4 border border-industrial-800 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-industrial-400 font-mono text-[10px] uppercase tracking-wider">
            <span>FEASIBLE SCENARIOS</span>
            <span className="w-2 h-2 rounded-full bg-status-success inline-block" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-status-success">3 / 4</span>
          </div>
          <div className="text-[10px] text-industrial-500 font-mono mt-1">
            1 Infeasible (Yield &lt; 80%)
          </div>
        </div>

        {/* KPI 3 */}
        <div className="industrial-card p-4 border border-industrial-800 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-industrial-400 font-mono text-[10px] uppercase tracking-wider">
            <span>POTENTIAL AVOIDANCE</span>
            <span className="text-orange-400 text-xs">▼ 12%</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-orange-400">0.28</span>
            <span className="text-[11px] font-mono text-industrial-400">tCO2e/t</span>
          </div>
          <div className="text-[10px] text-orange-400/80 font-mono mt-1">
            28.0 tCO2e / 100t Heat
          </div>
        </div>

        {/* KPI 4 */}
        <div className="industrial-card p-4 border border-industrial-800 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-industrial-400 font-mono text-[10px] uppercase tracking-wider">
            <span>VALIDATED HEATS</span>
            <Badge variant="demo" size="sm">SAMPLE</Badge>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-industrial-200">250</span>
            <span className="text-[11px] font-mono text-industrial-400">heats</span>
          </div>
          <div className="text-[10px] text-industrial-500 font-mono mt-1">
            Historical Pilot Dataset
          </div>
        </div>

        {/* KPI 5 */}
        <div className="industrial-card p-4 border border-industrial-800 rounded-lg relative overflow-hidden col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-industrial-400 font-mono text-[10px] uppercase tracking-wider">
            <span>DATA CONFIDENCE</span>
            <span className="text-status-warning text-xs font-mono font-medium">MEDIUM</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-industrial-100">94%</span>
            <span className="text-[11px] font-mono text-industrial-400">quality</span>
          </div>
          <div className="text-[10px] text-industrial-500 font-mono mt-1">
            Calibrate with plant PPA
          </div>
        </div>
      </div>

      {/* Main Grid: Active Production Heat + Top Carbon Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Heat Spotlight */}
        <div className="industrial-card p-5 border border-industrial-800 rounded-lg lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-industrial-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-brand animate-pulse" />
              <h3 className="font-mono text-sm font-semibold text-industrial-100">
                ACTIVE PRODUCTION HEAT: CW-DEMO-101 (GRADE 304)
              </h3>
            </div>
            <Badge variant="accent">PENDING PRE-MELT COMMIT</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded bg-industrial-900 border border-industrial-800">
              <span className="text-industrial-500 text-[10px] block">SCRAP BLEND</span>
              <span className="text-industrial-200 font-bold text-sm">70.1%</span>
              <span className="text-[10px] text-industrial-400 block mt-0.5">Heavy Austenitic</span>
            </div>
            <div className="p-2.5 rounded bg-industrial-900 border border-industrial-800">
              <span className="text-industrial-500 text-[10px] block">ENERGY USE</span>
              <span className="text-industrial-200 font-bold text-sm">1.85 MWh/t</span>
              <span className="text-[10px] text-industrial-400 block mt-0.5">EAF + AOD Enthalpy</span>
            </div>
            <div className="p-2.5 rounded bg-industrial-900 border border-industrial-800">
              <span className="text-industrial-500 text-[10px] block">GRID FACTOR</span>
              <span className="text-industrial-200 font-bold text-sm">0.719 t/MWh</span>
              <span className="text-[10px] text-industrial-400 block mt-0.5">Regional Grid Demo</span>
            </div>
            <div className="p-2.5 rounded bg-industrial-900 border border-industrial-800">
              <span className="text-industrial-500 text-[10px] block">TARGET TONNAGE</span>
              <span className="text-industrial-200 font-bold text-sm">100.0 t</span>
              <span className="text-[10px] text-industrial-400 block mt-0.5">Yield: 92.4%</span>
            </div>
          </div>

          {/* Quick Scenario Recommendation Callout */}
          <div className="p-3.5 rounded-lg bg-orange-brand/10 border border-orange-brand/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-orange-400 uppercase">
                  CarbonWise Opportunity Detected
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-status-success text-white rounded font-bold">
                  FEASIBLE
                </span>
              </div>
              <p className="text-xs text-industrial-300 mt-1">
                Scenario B (Energy Intensity & PPA) achieves <strong className="text-industrial-100">2.03 tCO2e/t</strong> — potential avoidance of <strong className="text-orange-400">28.0 tCO2e</strong> without yield penalty.
              </p>
            </div>
            <button
              onClick={() => onNavigate('scenarios')}
              className="px-3 py-1.5 rounded bg-orange-brand hover:bg-orange-bright text-white font-mono text-xs font-semibold transition shrink-0"
            >
              Review Scenarios →
            </button>
          </div>
        </div>

        {/* Top Carbon Drivers */}
        <div className="industrial-card p-5 border border-industrial-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-industrial-800">
            <h3 className="font-mono text-sm font-semibold text-industrial-100">
              TOP CARBON DRIVERS
            </h3>
            <span className="text-[10px] font-mono text-industrial-500">Breakdown</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-industrial-300">1. Grid Electricity</span>
                <span className="text-orange-400 font-bold">1.33 tCO2e/t (58%)</span>
              </div>
              <div className="w-full bg-industrial-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[58%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-industrial-300">2. Ferro-alloys (FeCr/FeNi)</span>
                <span className="text-amber-400 font-bold">0.62 tCO2e/t (27%)</span>
              </div>
              <div className="w-full bg-industrial-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full w-[27%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-industrial-300">3. Scrap Route & Logistics</span>
                <span className="text-industrial-300 font-bold">0.36 tCO2e/t (15%)</span>
              </div>
              <div className="w-full bg-industrial-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-industrial-500 h-full w-[15%]" />
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-industrial-900/60 border border-industrial-800 text-[11px] text-industrial-400">
            <span className="text-orange-400 font-semibold font-mono">Key Lever:</span> Shifting to wheeled renewable PPA and lowering specific melting MWh/t yields the greatest immediate decarbonization.
          </div>
        </div>
      </div>

      {/* Recent Production Decisions Table */}
      <div className="industrial-card p-5 border border-industrial-800 rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-industrial-800 gap-2">
          <div>
            <h3 className="font-mono text-sm font-semibold text-industrial-100">
              RECENT PRODUCTION HEAT DECISIONS
            </h3>
            <p className="text-xs text-industrial-400">
              Decisions locked prior to melting with verified audit and factor versions.
            </p>
          </div>
          <button
            onClick={() => onNavigate('decisions')}
            className="text-xs font-mono text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-industrial-800 text-industrial-400">
                <th className="py-2.5 px-3">Heat ID</th>
                <th className="py-2.5 px-3">Grade</th>
                <th className="py-2.5 px-3">Baseline</th>
                <th className="py-2.5 px-3">Selected Plan</th>
                <th className="py-2.5 px-3">Chosen Carbon</th>
                <th className="py-2.5 px-3">Avoidance</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Planner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-850">
              {recentDecisions.map((dec) => (
                <tr key={dec.decision_id} className="hover:bg-industrial-850/50 transition">
                  <td className="py-3 px-3 font-bold text-industrial-200">{dec.heat_id}</td>
                  <td className="py-3 px-3 text-orange-400">{dec.grade}</td>
                  <td className="py-3 px-3 text-industrial-400">{dec.current_co2e_per_t.toFixed(2)} t/t</td>
                  <td className="py-3 px-3 text-industrial-200">{dec.selected_scenario_name}</td>
                  <td className="py-3 px-3 font-bold text-status-success">{dec.selected_co2e_per_t.toFixed(2)} t/t</td>
                  <td className="py-3 px-3 text-orange-400 font-semibold">
                    -{dec.potential_avoidance_per_t.toFixed(2)} t/t ({dec.potential_avoidance_total_tonnes} t)
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="success" size="sm">LOCKED</Badge>
                  </td>
                  <td className="py-3 px-3 text-industrial-400 text-[11px]">{dec.planner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
