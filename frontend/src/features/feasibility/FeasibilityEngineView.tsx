import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  Info,
  Layers,
  Zap,
  Scale,
  Sparkles
} from 'lucide-react';
import { ScenarioItem } from '../../types';
import { Badge } from '../../components/common/Badge';

interface FeasibilityEngineViewProps {
  scenarios: ScenarioItem[];
}

export const FeasibilityEngineView: React.FC<FeasibilityEngineViewProps> = ({ scenarios }) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenarios[0]?.id || 'CURRENT');

  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  return (
    <div className="space-y-6">
      {/* Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-industrial-100 font-sans tracking-tight">
              Feasibility Engine
            </h2>
            <Badge variant="accent">8-CONSTRAINT MULTI-PHYSICS GATE</Badge>
          </div>
          <p className="text-xs sm:text-sm text-industrial-400 mt-0.5">
            Independent evaluation across scrap availability, tramp elements, chemistry balance, furnace power, and yield.
          </p>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-lg bg-industrial-900 border border-industrial-800 text-xs font-mono">
        {scenarios.map((s) => {
          const isActive = s.id === activeScenarioId;
          return (
            <button
              key={s.id}
              onClick={() => setActiveScenarioId(s.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded font-semibold transition ${
                isActive
                  ? 'bg-industrial-800 text-orange-400 border border-orange-brand/50 shadow-sm'
                  : 'text-industrial-400 hover:text-industrial-200'
              }`}
            >
              <span>{s.name}</span>
              <span className={`w-2 h-2 rounded-full ${s.is_feasible ? 'bg-status-success' : 'bg-status-danger'}`} />
            </button>
          );
        })}
      </div>

      {/* Scenario Feasibility Status Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono ${
        activeScenario.is_feasible
          ? 'bg-status-success-bg border-status-success-border text-industrial-100'
          : 'bg-status-danger-bg border-status-danger-border text-industrial-100'
      }`}>
        <div className="flex items-center gap-3">
          {activeScenario.is_feasible ? (
            <CheckCircle2 className="w-8 h-8 text-status-success shrink-0" />
          ) : (
            <XCircle className="w-8 h-8 text-status-danger shrink-0" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold">
                {activeScenario.name} — OVERALL EVALUATION: {activeScenario.status_label}
              </span>
            </div>
            <p className="text-xs text-industrial-300 mt-0.5">
              {activeScenario.is_feasible
                ? 'All 8 metallurgical and operational constraints verified. Qualified for pre-melt selection.'
                : activeScenario.rejection_summary || 'Operating constraints violated. Excluded from production plan.'}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] text-industrial-400 block uppercase">ESTIMATED CARBON</span>
          <span className="text-2xl font-bold text-orange-400">
            {activeScenario.carbon.total_co2e_per_t.toFixed(2)}{' '}
            <span className="text-xs text-industrial-400">tCO2e/t</span>
          </span>
        </div>
      </div>

      {/* 8 Independent Constraint Check Cards (Section 12) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeScenario.checks.map((check, idx) => {
          return (
            <div
              key={idx}
              className={`p-4 rounded-lg border transition ${
                check.passed
                  ? 'bg-industrial-900/60 border-industrial-800'
                  : 'bg-status-danger-bg border-status-danger/50'
              }`}
            >
              <div className="flex items-start justify-between pb-2 border-b border-industrial-800/80">
                <div className="flex items-center gap-2">
                  {check.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-status-danger shrink-0" />
                  )}
                  <div>
                    <h4 className="font-mono text-xs font-bold text-industrial-100">{check.name}</h4>
                    <span className="text-[10px] font-mono text-industrial-500">{check.constraint_type}</span>
                  </div>
                </div>
                <Badge variant={check.passed ? 'success' : 'danger'} size="sm">
                  {check.passed ? 'PASS' : 'FAIL'}
                </Badge>
              </div>

              <div className="mt-2.5 font-mono text-xs space-y-1">
                {(check.actual_value || check.limit_value) && (
                  <div className="flex justify-between text-[11px] text-industrial-400">
                    <span>Observed: <strong className="text-industrial-200">{check.actual_value || 'Compliant'}</strong></span>
                    <span>Threshold: <strong className="text-industrial-300">{check.limit_value || 'Verified'}</strong></span>
                  </div>
                )}
                <p className="text-[11px] text-industrial-300 mt-1 leading-snug">
                  {check.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Engineering Note on Constraints */}
      <div className="p-3.5 rounded-lg bg-industrial-900 border border-industrial-800 text-xs font-mono text-industrial-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-orange-brand shrink-0 mt-0.5" />
        <div>
          <strong className="text-industrial-200">Industrial Feasibility Principle:</strong> In electric arc stainless steelmaking, maximizing scrap without verifying tramp copper or minimum melting enthalpy causes un-melted skulls, bath stratification, or hot-shortness cracking during hot rolling. CarbonWise gates every scenario through plant operating limits before presenting carbon savings.
        </div>
      </div>
    </div>
  );
};
