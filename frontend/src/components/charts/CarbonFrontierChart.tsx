import React from 'react';
import { ScenarioItem } from '../../types';
import { CheckCircle2, XCircle, AlertTriangle, ArrowDown } from 'lucide-react';

interface CarbonFrontierChartProps {
  scenarios: ScenarioItem[];
  selectedScenarioId: string;
  onSelectScenario?: (id: string) => void;
}

export const CarbonFrontierChart: React.FC<CarbonFrontierChartProps> = ({
  scenarios,
  selectedScenarioId,
  onSelectScenario
}) => {
  // Find min and max carbon to scale properly
  const carbonValues = scenarios.map(s => s.carbon.total_co2e_per_t);
  const minCarbon = Math.min(...carbonValues, 1.70);
  const maxCarbon = Math.max(...carbonValues, 2.45);
  const carbonRange = maxCarbon - minCarbon || 1;

  return (
    <div className="industrial-card p-5 border border-industrial-800 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-800 gap-2">
        <div>
          <h3 className="font-mono text-sm font-semibold text-industrial-100 flex items-center gap-2">
            <span>OPERATIONAL CARBON FRONTIER</span>
          </h3>
          <p className="text-xs text-industrial-400 mt-0.5">
            Plotting carbon intensity vs real-world operational feasibility states.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-status-success">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Feasible Candidates</span>
          </div>
          <div className="flex items-center gap-1.5 text-status-danger">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected (Constraint Violated)</span>
          </div>
        </div>
      </div>

      {/* Frontier Matrix Visualization */}
      <div className="mt-6 relative">
        {/* Two distinct operational zones: FEASIBLE vs INFEASIBLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Zone 1: Operationally Feasible */}
          <div className="p-4 rounded-lg bg-industrial-900/60 border border-status-success/30 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-status-success font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                FEASIBLE REGION (All 8 Constraints Met)
              </span>
              <span className="text-[10px] font-mono text-industrial-500">Eligible for Selection</span>
            </div>

            <div className="space-y-3">
              {scenarios.filter(s => s.is_feasible).map((s) => {
                const isSelected = s.id === selectedScenarioId;
                return (
                  <div
                    key={s.id}
                    onClick={() => onSelectScenario && onSelectScenario(s.id)}
                    className={`p-3 rounded border transition cursor-pointer ${
                      isSelected
                        ? 'bg-orange-brand/10 border-orange-brand shadow-sm ring-1 ring-orange-brand/40'
                        : 'bg-industrial-850 hover:bg-industrial-800 border-industrial-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-industrial-100">{s.name}</span>
                        {isSelected && (
                          <span className="px-1.5 py-0.5 rounded bg-orange-brand text-white text-[10px] font-mono font-semibold uppercase">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-sm font-bold text-orange-400">
                        {s.carbon.total_co2e_per_t.toFixed(2)} <span className="text-[10px] text-industrial-400 font-normal">tCO2e/t</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-industrial-400 font-mono">
                      <span>Scrap: {s.scrap_mix_pct.toFixed(1)}% | Energy: {s.electricity_intensity_mwh_per_t.toFixed(2)} MWh/t</span>
                      <span className="text-status-success">✓ 8/8 Passed</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Zone 2: Operationally Infeasible / Rejected */}
          <div className="p-4 rounded-lg bg-industrial-900/60 border border-status-danger/30 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-status-danger font-semibold flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                REJECTED REGION (Constraint Violated)
              </span>
              <span className="text-[10px] font-mono text-status-danger font-medium">Excluded from Melt</span>
            </div>

            <div className="space-y-3">
              {scenarios.filter(s => !s.is_feasible).map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectScenario && onSelectScenario(s.id)}
                  className="p-3 rounded border bg-status-danger-bg border-status-danger/40 transition cursor-pointer hover:border-status-danger"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-industrial-100">{s.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-status-danger/20 text-status-danger text-[10px] font-mono font-bold">
                        REJECTED
                      </span>
                    </div>
                    <div className="font-mono text-sm font-bold text-industrial-400 line-through decoration-status-danger">
                      {s.carbon.total_co2e_per_t.toFixed(2)} <span className="text-[10px] font-normal">tCO2e/t</span>
                    </div>
                  </div>
                  <div className="mt-2 p-2 rounded bg-black/30 border border-status-danger/30 text-xs text-status-danger font-mono">
                    <div className="font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {s.rejection_summary || 'Operating constraint violation'}
                    </div>
                    <p className="text-[11px] text-industrial-300 mt-1">
                      Yield {s.expected_yield_pct.toFixed(1)}% &lt; min allowable 80.0%. Lowest carbon is excluded because it cannot be safely manufactured.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frontier Principle Caption */}
        <div className="mt-4 p-3 rounded bg-industrial-900 border border-industrial-800 flex items-center justify-between text-xs text-industrial-300">
          <div className="flex items-center gap-2">
            <span className="font-mono text-orange-brand font-semibold">FRONTIER PRINCIPLE:</span>
            <span>Mathematical minimization alone leads to unfeasible solutions. CarbonWise enforces operational feasibility boundaries.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
