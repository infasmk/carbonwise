import React, { useState } from 'react';
import { 
  FileCheck2, 
  Target, 
  ShieldAlert, 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Trash2,
  Sparkles,
  Info,
  Scale,
  TrendingDown
} from 'lucide-react';
import { ValidationSummary, ValidationHeatRecord } from '../../types';
import { ScatterValidationChart } from '../../components/charts/ScatterValidationChart';
import { Badge } from '../../components/common/Badge';

interface ValidationCenterViewProps {
  summary: ValidationSummary;
  records: ValidationHeatRecord[];
  onLoadDemoDataset: () => void;
  onClearDataset: () => void;
  onNavigateToDataHub: () => void;
  isLoading: boolean;
}

export const ValidationCenterView: React.FC<ValidationCenterViewProps> = ({
  summary,
  records,
  onLoadDemoDataset,
  onClearDataset,
  onNavigateToDataHub,
  isLoading
}) => {
  return (
    <div className="space-y-6">
      {/* Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-industrial-100 font-sans tracking-tight">
              Validation Center
            </h2>
            <Badge variant="accent">MODEL ACCURACY & METROLOGY</Badge>
          </div>
          <p className="text-xs sm:text-sm text-industrial-400 mt-0.5">
            Compare CarbonWise pre-melt predictions against certified post-casting actual production outcomes.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!summary.has_data ? (
            <button
              onClick={onLoadDemoDataset}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-brand hover:bg-orange-bright text-white font-mono text-xs font-semibold transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Demo Validation Data (50 Heats)</span>
            </button>
          ) : (
            <button
              onClick={onClearDataset}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-industrial-300 font-mono text-xs transition"
            >
              <Trash2 className="w-3.5 h-3.5 text-industrial-500" />
              <span>Clear Validation Store</span>
            </button>
          )}

          <button
            onClick={onNavigateToDataHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-industrial-200 font-mono text-xs transition"
          >
            <UploadCloud className="w-3.5 h-3.5 text-orange-brand" />
            <span>Import Plant CSV</span>
          </button>
        </div>
      </div>

      {/* HONEST EMPTY STATE (Section 25 & 32 Acceptance Test) */}
      {!summary.has_data ? (
        <div className="industrial-card p-12 text-center border border-dashed border-industrial-800 rounded-xl space-y-4 max-w-2xl mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-industrial-900 border border-industrial-800 flex items-center justify-center mx-auto text-industrial-500">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold font-mono text-industrial-100">
              Validation data not imported yet.
            </h3>
            <p className="text-xs text-industrial-400 max-w-md mx-auto leading-relaxed">
              Import approved historical heat data to calculate genuine model validation metrics (MAE, RMSE, Feasibility agreement). CarbonWise never fabricates validation results.
            </p>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onLoadDemoDataset}
              className="px-4 py-2 rounded-lg bg-orange-brand hover:bg-orange-bright text-white font-mono text-xs font-semibold transition"
            >
              Load Illustrative Demo Dataset (50 heats)
            </button>
            <button
              onClick={onNavigateToDataHub}
              className="px-4 py-2 rounded-lg bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-industrial-300 font-mono text-xs transition"
            >
              Go to Data Hub & Upload CSV
            </button>
          </div>
        </div>
      ) : (
        /* VALIDATION DASHBOARD WITH REAL METRICS */
        <div className="space-y-6">
          {/* Data Provenance Badge */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-industrial-900 border border-industrial-800 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-success" />
              <span className="text-industrial-300">
                ACTIVE DATASET: <strong className="text-industrial-100">{summary.dataset_name}</strong> ({summary.total_heats_analyzed} heats analyzed)
              </span>
            </div>
            <Badge variant="demo">ILLUSTRATIVE SAMPLE HEATS</Badge>
          </div>

          {/* Validation Metrics Grid (Section 25) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="industrial-card p-3.5 border border-industrial-800 rounded-lg">
              <span className="text-[10px] font-mono text-industrial-500 uppercase block">MAE (MEAN ABS ERROR)</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-industrial-100">
                  {summary.mae_tco2e_per_t?.toFixed(3)}
                </span>
                <span className="text-[10px] font-mono text-industrial-400">t/t</span>
              </div>
              <span className="text-[10px] text-industrial-500 font-mono mt-0.5 block">Target: &lt; 0.08 t/t</span>
            </div>

            <div className="industrial-card p-3.5 border border-industrial-800 rounded-lg">
              <span className="text-[10px] font-mono text-industrial-500 uppercase block">RMSE ACCURACY</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-orange-400">
                  {summary.rmse_tco2e_per_t?.toFixed(3)}
                </span>
                <span className="text-[10px] font-mono text-industrial-400">t/t</span>
              </div>
              <span className="text-[10px] text-industrial-500 font-mono mt-0.5 block">Residual variance</span>
            </div>

            <div className="industrial-card p-3.5 border border-industrial-800 rounded-lg">
              <span className="text-[10px] font-mono text-industrial-500 uppercase block">WITHIN ±5% TOLERANCE</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-status-success">
                  {summary.pct_within_tolerance_5pct?.toFixed(1)}%
                </span>
              </div>
              <span className="text-[10px] text-industrial-500 font-mono mt-0.5 block">High precision heats</span>
            </div>

            <div className="industrial-card p-3.5 border border-industrial-800 rounded-lg">
              <span className="text-[10px] font-mono text-industrial-500 uppercase block">FEASIBILITY AGREEMENT</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-status-success">
                  {summary.feasibility_agreement_pct?.toFixed(1)}%
                </span>
              </div>
              <span className="text-[10px] text-industrial-500 font-mono mt-0.5 block">Constraint match</span>
            </div>

            <div className="industrial-card p-3.5 border border-industrial-800 rounded-lg">
              <span className="text-[10px] font-mono text-industrial-500 uppercase block">GRADES COVERED</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-mono font-bold text-industrial-200">
                  {summary.grades_covered.length}
                </span>
                <span className="text-[10px] font-mono text-industrial-400">grades</span>
              </div>
              <span className="text-[10px] text-industrial-500 font-mono mt-0.5 block">
                {summary.grades_covered.join(', ')}
              </span>
            </div>

            <div className="industrial-card p-3.5 border border-industrial-800 rounded-lg">
              <span className="text-[10px] font-mono text-industrial-500 uppercase block">AVOIDED CO2E AGGREGATE</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-mono font-bold text-orange-400">
                  {summary.potential_avoided_co2e_total?.toFixed(0)}
                </span>
                <span className="text-[10px] font-mono text-industrial-400">tCO2e</span>
              </div>
              <span className="text-[10px] text-industrial-500 font-mono mt-0.5 block">Validated heats</span>
            </div>
          </div>

          {/* Scatter Plot */}
          <ScatterValidationChart records={records} />

          {/* Data Confidence & Calibration Matrix (Section 28) */}
          <div className="industrial-card p-5 border border-industrial-800 rounded-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-industrial-800">
              <h3 className="font-mono text-sm font-semibold text-industrial-100 flex items-center gap-2">
                <Scale className="w-4 h-4 text-orange-brand" />
                <span>DATA CONFIDENCE & CALIBRATION ASSESSMENT</span>
              </h3>
              <Badge variant="demo">METHODOLOGY</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 rounded bg-industrial-900 border border-industrial-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-industrial-200">1. Energy Emission Factor</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px]">
                    MEDIUM
                  </span>
                </div>
                <p className="text-[11px] text-industrial-400 leading-snug pt-1">
                  Reference/demo factor (0.719 t/MWh). Replace with approved site/supplier electricity invoice and PPA certificate.
                </p>
              </div>

              <div className="p-3 rounded bg-industrial-900 border border-industrial-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-industrial-200">2. Operating Constraints</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px]">
                    HIGH
                  </span>
                </div>
                <p className="text-[11px] text-industrial-400 leading-snug pt-1">
                  ASTM A240 chemistry tolerances and EAF cycle limits calibrated against nominal 100t melt shop parameters.
                </p>
              </div>

              <div className="p-3 rounded bg-industrial-900 border border-industrial-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-industrial-200">3. Scrap Route Accounting</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px]">
                    MEDIUM
                  </span>
                </div>
                <p className="text-[11px] text-industrial-400 leading-snug pt-1">
                  ISSF Life Cycle standard allocation (0.36 t/t). Calibrate against scrap yard sorting electricity and diesel handling logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
