import React from 'react';
import { 
  BarChart3, 
  ExternalLink, 
  ShieldAlert, 
  Info, 
  Leaf, 
  Zap, 
  Recycle, 
  Flame, 
  Layers 
} from 'lucide-react';
import { BenchmarkMetric } from '../../types';
import { Badge } from '../../components/common/Badge';

interface BenchmarkDashboardViewProps {
  benchmarks: BenchmarkMetric[];
}

export const BenchmarkDashboardView: React.FC<BenchmarkDashboardViewProps> = ({ benchmarks }) => {
  return (
    <div className="space-y-6">
      {/* Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-industrial-100 font-sans tracking-tight">
              JSL Benchmark &amp; Reference Dashboard
            </h2>
            <Badge variant="info">PUBLIC DISCLOSURES</Badge>
          </div>
          <p className="text-xs sm:text-sm text-industrial-400 mt-0.5">
            Public sustainability disclosures and corporate Net-Zero transition benchmarks published by Jindal Stainless Limited.
          </p>
        </div>
      </div>

      {/* Mandatory Non-Negotiable Disclaimer (Section 29 & 32) */}
      <div className="p-4 rounded-xl bg-industrial-900 border border-amber-500/30 text-xs font-mono text-amber-300 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-amber-400">
          <ShieldAlert className="w-4 h-4" />
          <span>DATA HONESTY &amp; INTEGRITY PROTOCOL</span>
        </div>
        <p className="text-[11px] text-industrial-300 leading-relaxed">
          Public JSL metrics displayed below represent published historical annual corporate sustainability disclosures (FY2023-24 Integrated Report / BRSR). These figures are corporate macro benchmarks and are NOT live plant MES/SAP telemetry. CarbonWise does NOT fabricate confidential internal plant data.
        </p>
      </div>

      {/* Benchmark Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benchmarks.map((bm) => (
          <div key={bm.id} className="industrial-card p-5 border border-industrial-800 rounded-lg space-y-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
              <span className="text-[10px] text-industrial-500 uppercase">{bm.category}</span>
              <Badge variant="info" size="sm">PUBLIC BENCHMARK</Badge>
            </div>

            <div>
              <h3 className="text-xs font-bold text-industrial-200 line-clamp-1">{bm.metric}</h3>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-orange-400 font-mono">{bm.value}</span>
                <span className="text-xs text-industrial-400 font-normal">{bm.unit}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-industrial-850 space-y-1 text-[11px] text-industrial-400">
              <div className="flex justify-between">
                <span className="text-industrial-500">Period:</span>
                <span className="text-industrial-300 font-semibold">{bm.reporting_period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-industrial-500">Boundary:</span>
                <span className="text-industrial-300 truncate max-w-[160px]" title={bm.boundary}>
                  {bm.boundary}
                </span>
              </div>
              <div className="text-[10px] text-industrial-500 pt-1">
                Source: {bm.source}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Industrial Perspective: Annual Benchmark vs Pre-Production Heat Decision */}
      <div className="industrial-card p-6 border border-industrial-800 rounded-xl space-y-4">
        <h3 className="font-mono text-sm font-semibold text-industrial-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-brand" />
          <span>METHODOLOGY: ANNUAL ESG REPORTING VS PRE-MELT INTELLIGENCE</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-industrial-900 border border-industrial-800 space-y-2">
            <div className="text-industrial-200 font-bold">1. Corporate Annual Benchmarking</div>
            <p className="text-industrial-400 leading-relaxed text-[11px]">
              Aggregates emissions retrospectively across an entire fiscal year (e.g. 1.91 tCO2e/t consolidated across all plants). Helpful for corporate investor reporting, but provides zero actionable guidance to a furnace operator deciding what scrap to drop into the EAF right now.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-industrial-900 border border-orange-brand/30 space-y-2">
            <div className="text-orange-400 font-bold">2. CarbonWise Pre-Melt Decision Intelligence</div>
            <p className="text-industrial-300 leading-relaxed text-[11px]">
              Operates at the discrete heat level (100 t batch) <em>before</em> the electric arc is struck. Evaluates specific scrap quality, chemistry balance, and electricity tariffs to eliminate carbon before emissions occur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
