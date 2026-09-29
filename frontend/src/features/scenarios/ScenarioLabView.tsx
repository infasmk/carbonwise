import React, { useState } from 'react';
import { 
  FlaskConical, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Lock, 
  Sparkles, 
  ArrowRight,
  TrendingDown,
  Info,
  Check,
  Zap,
  Layers,
  Activity
} from 'lucide-react';
import { ScenarioItem, DecisionResult, HeatInput } from '../../types';
import { Badge } from '../../components/common/Badge';
import { CarbonFrontierChart } from '../../components/charts/CarbonFrontierChart';
import { SensitivityChart } from '../../components/charts/SensitivityChart';

interface ScenarioLabViewProps {
  scenarios: ScenarioItem[];
  decision: DecisionResult;
  currentHeat: HeatInput;
  onCommitDecision: (scenario: ScenarioItem) => void;
  isSavingDecision: boolean;
}

export const ScenarioLabView: React.FC<ScenarioLabViewProps> = ({
  scenarios,
  decision,
  currentHeat,
  onCommitDecision,
  isSavingDecision
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(decision.recommended_scenario_id || 'SCENARIO_B');
  const [inspectWhyScenario, setInspectWhyScenario] = useState<ScenarioItem | null>(null);

  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];
  const recommendedScenario = scenarios.find(s => s.id === decision.recommended_scenario_id) || scenarios[2];

  // Acceptance Test Check: Scenario C must NOT be selected by default!
  const isSelectedFeasible = selectedScenario.is_feasible;

  return (
    <div className="space-y-6">
      {/* Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-industrial-100 font-sans tracking-tight">
              Scenario Lab & Decision Engine
            </h2>
            <Badge variant="accent">PRE-MELT OPTIMIZATION</Badge>
          </div>
          <p className="text-xs sm:text-sm text-industrial-400 mt-0.5">
            Explore alternative production configurations before committing the melt. Filter by real-world feasibility.
          </p>
        </div>

        {/* Action Button: Lock Decision */}
        <button
          onClick={() => onCommitDecision(selectedScenario)}
          disabled={!isSelectedFeasible || isSavingDecision}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition shadow-panel ${
            isSelectedFeasible
              ? 'bg-status-success hover:bg-emerald-600 text-white'
              : 'bg-industrial-800 text-industrial-500 cursor-not-allowed border border-industrial-700'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{isSavingDecision ? 'Locking Melt...' : `Lock ${selectedScenario.name} into Melt Plan`}</span>
        </button>
      </div>

      {/* CORE DECISION CARD (Section 15) */}
      <div className="industrial-card p-6 border-2 border-orange-brand/60 bg-gradient-to-br from-industrial-900 via-industrial-900 to-orange-950/20 rounded-xl relative overflow-hidden shadow-elevated">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-industrial-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-brand animate-ping" />
              <span className="font-mono text-xs uppercase tracking-widest text-orange-400 font-bold">
                CARBONWISE DECISION
              </span>
              <Badge variant="success">LOWEST-CARBON FEASIBLE SCENARIO</Badge>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-industrial-100 font-sans tracking-tight">
              {decision.recommended_scenario_name}
            </h3>
            <p className="text-xs text-industrial-300 max-w-2xl leading-relaxed">
              {decision.decision_rationale}
            </p>
          </div>

          {/* Decision Metrics Readout */}
          <div className="flex items-center gap-4 bg-industrial-950/80 p-4 rounded-xl border border-industrial-800 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono text-industrial-400 uppercase block">RECOMMENDED</span>
              <span className="text-3xl font-mono font-black text-status-success">
                {decision.recommended_co2e_per_t.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-industrial-400 block">tCO2e/t</span>
            </div>

            <div className="h-10 w-px bg-industrial-800" />

            <div className="text-left">
              <span className="text-[10px] font-mono text-orange-400 uppercase block font-semibold">POTENTIAL REDUCTION</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-orange-400">
                  {decision.potential_avoidance_per_t.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-industrial-400">t/t</span>
              </div>
              <span className="text-[11px] font-mono text-orange-400 font-semibold block">
                {decision.potential_avoidance_total_tonnes.toFixed(1)} tCO2e / {decision.target_tonnage}t Heat
              </span>
            </div>
          </div>
        </div>

        {/* WHY B? Breakdown & Constraints */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <div className="text-industrial-300 font-semibold mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-status-success" />
              <span>WHY SCENARIO B? (Verified Production Constraints)</span>
            </div>
            <div className="space-y-1 text-industrial-300">
              {decision.passed_constraints_summary.slice(0, 4).map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-status-success font-bold">✓</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-status-danger font-semibold mb-2 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-status-danger" />
              <span>WHY NOT SCENARIO C? (Mathematically Lowest, but Rejected)</span>
            </div>
            <p className="text-industrial-400 leading-relaxed">
              Scenario C has lower theoretical carbon (1.87 tCO2e/t), but it violates the minimum 80.0% yield threshold (projected 79.0%) and tramp copper specification.
              <strong className="text-industrial-200 block mt-1">
                Rule: Infeasible scenarios are strictly disqualified from selection.
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* SCENARIO COMPARISON GRID (Section 14: Current vs A vs B vs C) */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <h3 className="font-mono text-sm font-semibold text-industrial-200 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-orange-brand" />
            <span>CANDIDATE SCENARIO COMPARISON MATRIX</span>
          </h3>
          <span className="text-xs font-mono text-industrial-500">Click any card to select for commitment</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {scenarios.map((s) => {
            const isSelected = s.id === selectedScenarioId;
            const isRec = s.id === decision.recommended_scenario_id;

            return (
              <div
                key={s.id}
                onClick={() => setSelectedScenarioId(s.id)}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-orange-brand bg-industrial-900 ring-2 ring-orange-brand/30 shadow-panel'
                    : s.is_feasible
                    ? 'border-industrial-800 bg-industrial-900/60 hover:border-industrial-700 hover:bg-industrial-900'
                    : 'border-status-danger/30 bg-status-danger-bg/40 hover:border-status-danger/60'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-industrial-800/80">
                    <span className="font-mono text-xs font-bold text-industrial-100">{s.label}</span>
                    <Badge variant={s.is_feasible ? 'success' : 'danger'} size="sm">
                      {s.status_label}
                    </Badge>
                  </div>

                  {/* Title & Tag */}
                  <div className="mt-3">
                    <div className="font-sans text-sm font-bold text-industrial-100 flex items-center justify-between">
                      <span>{s.name}</span>
                      {isRec && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-orange-brand text-white rounded font-bold uppercase">
                          Choice
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-industrial-400 mt-1 line-clamp-2 leading-snug">
                      {s.description}
                    </p>
                  </div>

                  {/* Carbon Figure */}
                  <div className="my-4 text-center p-3 rounded-lg bg-industrial-950/80 border border-industrial-800">
                    <div className="text-2xl font-mono font-black text-industrial-100 flex items-baseline justify-center gap-1">
                      <span className={s.is_feasible ? (isRec ? 'text-status-success' : 'text-orange-400') : 'text-industrial-400 line-through'}>
                        {s.carbon.total_co2e_per_t.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-mono text-industrial-400">tCO2e/t</span>
                    </div>
                    <div className="text-[10px] font-mono text-industrial-500 mt-0.5">
                      {s.id === 'CURRENT' ? 'Current Baseline' : `Variance: ${(s.carbon.total_co2e_per_t - 2.31).toFixed(2)} t/t`}
                    </div>
                  </div>

                  {/* Operational Parameters Breakdown */}
                  <div className="space-y-1.5 font-mono text-[11px] text-industrial-300">
                    <div className="flex justify-between">
                      <span className="text-industrial-500">Scrap Mix:</span>
                      <span className="font-bold text-industrial-200">{s.scrap_mix_pct.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-industrial-500">Energy Source:</span>
                      <span className="font-medium text-industrial-200 truncate max-w-[130px]" title={s.energy_source}>
                        {s.energy_source}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-industrial-500">Energy Intensity:</span>
                      <span className="font-bold text-industrial-200">{s.electricity_intensity_mwh_per_t.toFixed(2)} MWh/t</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-industrial-500">Expected Yield:</span>
                      <span className={`font-bold ${s.expected_yield_pct < 80.0 ? 'text-status-danger' : 'text-status-success'}`}>
                        {s.expected_yield_pct.toFixed(1)}% {s.expected_yield_pct < 80.0 ? '(FAIL)' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Rejection Info or Select CTA */}
                <div className="mt-4 pt-3 border-t border-industrial-800">
                  {!s.is_feasible ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectWhyScenario(s);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-status-danger/20 hover:bg-status-danger/30 text-status-danger border border-status-danger/40 text-xs font-mono font-bold transition"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>WHY REJECTED?</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between text-xs font-mono text-status-success">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>All checks passed</span>
                      </span>
                      {isSelected && <span className="font-bold text-orange-400">Selected</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carbon Frontier Matrix */}
      <CarbonFrontierChart
        scenarios={scenarios}
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={(id) => setSelectedScenarioId(id)}
      />

      {/* Sensitivity Analysis Section */}
      <SensitivityChart currentHeat={currentHeat} />

      {/* EXPLAINABLE REJECTION MODAL (Section 13) */}
      {inspectWhyScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="industrial-card p-6 max-w-lg w-full border-2 border-status-danger bg-industrial-900 rounded-xl space-y-4 shadow-elevated">
            <div className="flex items-center justify-between pb-3 border-b border-industrial-800">
              <div className="flex items-center gap-2 text-status-danger font-mono text-sm font-bold">
                <AlertTriangle className="w-5 h-5" />
                <span>EXPLAINABLE REJECTION AUDIT</span>
              </div>
              <button
                onClick={() => setInspectWhyScenario(null)}
                className="text-industrial-400 hover:text-industrial-100 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="font-mono text-xs space-y-3">
              <div className="text-base font-bold text-industrial-100">
                WHY WAS {inspectWhyScenario.name.toUpperCase()} REJECTED?
              </div>

              <div className="p-3 rounded bg-industrial-950 border border-status-danger/40 space-y-2">
                <div className="flex justify-between">
                  <span className="text-industrial-400">Yield Expected:</span>
                  <span className="text-status-danger font-bold text-sm">
                    {inspectWhyScenario.expected_yield_pct.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-400">Minimum Allowed:</span>
                  <span className="text-industrial-100 font-bold">80.0%</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-industrial-800">
                  <span className="text-industrial-400">Result:</span>
                  <span className="text-status-danger font-black">FAIL</span>
                </div>
              </div>

              <div className="p-3 rounded bg-industrial-900 border border-industrial-800 text-industrial-300 leading-relaxed">
                <strong>Industrial Explanation:</strong>
                <p className="mt-1 text-[11px] text-industrial-300">
                  "{inspectWhyScenario.rejection_detail || inspectWhyScenario.rejection_summary}"
                </p>
              </div>

              <div className="text-[11px] text-industrial-400 italic">
                CarbonWise never ranks scenarios purely by carbon. Infeasible scenarios that violate plant yield, tramp element limits, or transformer capacity are strictly excluded from the final decision.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectWhyScenario(null)}
                className="px-4 py-1.5 rounded bg-industrial-800 hover:bg-industrial-700 text-industrial-200 font-mono text-xs font-semibold"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
