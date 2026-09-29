import React from 'react';
import { 
  ArrowRight, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  BarChart2, 
  Workflow, 
  Sparkles,
  Layers,
  Zap,
  Clock,
  FileCheck
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

interface LandingHeroProps {
  onOpenPlanner: () => void;
  onExplore: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenPlanner,
  onExplore
}) => {
  return (
    <div className="space-y-16 py-6 max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-brand/10 border border-orange-brand/30 text-orange-400 text-xs font-mono font-medium tracking-wider uppercase">
          <Zap className="w-3.5 h-3.5 text-orange-brand" />
          <span>CARBON & ENERGY DECISION INTELLIGENCE</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-industrial-100 max-w-4xl mx-auto leading-tight">
          Make carbon visible <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400">
            before the production plan is locked.
          </span>
        </h1>

        {/* Tagline */}
        <p className="font-serif italic text-lg sm:text-xl text-industrial-300">
          "The decision is made before the melt."
        </p>

        {/* Supporting Copy */}
        <p className="text-sm sm:text-base text-industrial-400 max-w-2xl mx-auto leading-relaxed">
          CarbonWise evaluates pre-production melt scenarios, validates real-world operational feasibility, and identifies the lowest-carbon feasible option before allocating scrap, alloy, and energy.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenPlanner}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-brand hover:bg-orange-bright text-white font-mono text-sm font-semibold transition shadow-panel"
          >
            <Flame className="w-4 h-4" />
            <span>Open Heat Planner</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onExplore}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-industrial-200 font-mono text-sm font-medium transition"
          >
            <Cpu className="w-4 h-4 text-orange-brand" />
            <span>System Architecture</span>
          </button>
        </div>
      </section>

      {/* Industrial Intelligence Workflow Diagram (Section 6) */}
      <section className="industrial-card p-6 border border-industrial-800 rounded-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-industrial-800">
          <div className="flex items-center gap-2 font-mono text-xs text-industrial-300 uppercase tracking-wider font-semibold">
            <Workflow className="w-4 h-4 text-orange-brand" />
            <span>Pre-Production Industrial Decision Pipeline</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-industrial-800 border border-industrial-700 text-industrial-300">OPERATIONAL PIPELINE</span>
        </div>

        {/* 5-Step Pipeline Graphic */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-6">
          {/* Step 1 */}
          <div className="p-3.5 rounded bg-industrial-900 border border-industrial-800 text-left relative group">
            <div className="text-[10px] font-mono text-industrial-500 uppercase tracking-wider">01 / STAGE</div>
            <div className="font-mono text-sm font-bold text-industrial-100 mt-1">INPUT</div>
            <p className="text-[11px] text-industrial-400 mt-1.5 leading-snug">
              Scrap mix ratio, grade chemistry, specific energy intensity, and grid tariff factors.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded bg-industrial-900 border border-industrial-800 text-left relative group">
            <div className="text-[10px] font-mono text-industrial-500 uppercase tracking-wider">02 / STAGE</div>
            <div className="font-mono text-sm font-bold text-industrial-100 mt-1">CALCULATE</div>
            <p className="text-[11px] text-industrial-400 mt-1.5 leading-snug">
              Transparent contributor summation: Energy + Alloy + Scrap Route = 2.31 tCO2e/t.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded bg-industrial-900 border border-status-danger/40 text-left relative group">
            <div className="text-[10px] font-mono text-status-danger uppercase tracking-wider font-bold">03 / GATE</div>
            <div className="font-mono text-sm font-bold text-industrial-100 mt-1 flex items-center justify-between">
              <span>CHECK</span>
              <span className="text-[10px] font-mono text-status-danger">8 Checks</span>
            </div>
            <p className="text-[11px] text-industrial-400 mt-1.5 leading-snug">
              Rigorous feasibility checks. If yield &lt; 80% or chemistry fails, scenario is strictly rejected.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded bg-industrial-900 border border-industrial-800 text-left relative group">
            <div className="text-[10px] font-mono text-industrial-500 uppercase tracking-wider">04 / STAGE</div>
            <div className="font-mono text-sm font-bold text-industrial-100 mt-1">COMPARE</div>
            <p className="text-[11px] text-industrial-400 mt-1.5 leading-snug">
              Compare ONLY surviving feasible candidates along the operational carbon frontier.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-3.5 rounded bg-orange-brand/10 border border-orange-brand/50 text-left relative group">
            <div className="text-[10px] font-mono text-orange-400 uppercase tracking-wider font-bold">05 / OUTCOME</div>
            <div className="font-mono text-sm font-bold text-orange-400 mt-1">DECISION</div>
            <p className="text-[11px] text-industrial-300 mt-1.5 leading-snug">
              Lock lowest-carbon feasible scenario with audit trail before production begins.
            </p>
          </div>
        </div>
      </section>

      {/* Traditional vs CarbonWise Paradigm Shift */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional Workflow */}
        <div className="p-6 rounded-xl bg-industrial-900/60 border border-industrial-800">
          <div className="flex items-center gap-2 font-mono text-xs text-industrial-400 uppercase tracking-wider mb-3">
            <Clock className="w-4 h-4 text-industrial-500" />
            <span>Traditional Workflow (Reactive Carbon)</span>
          </div>
          <div className="space-y-2 text-xs font-mono text-industrial-400">
            <div className="p-2.5 rounded bg-industrial-950 border border-industrial-800">
              1. Production plan locked based purely on throughput & immediate inventory
            </div>
            <div className="p-2.5 rounded bg-industrial-950 border border-industrial-800">
              2. Heat melted, refined in AOD, and continuously cast
            </div>
            <div className="p-2.5 rounded bg-industrial-950 border border-industrial-800 text-status-danger">
              3. Carbon emissions calculated weeks later in retrospective ESG reports
            </div>
          </div>
          <p className="text-xs text-industrial-500 mt-4 italic">
            "Carbon emissions become an unchangeable historical fact after the tap."
          </p>
        </div>

        {/* CarbonWise Workflow */}
        <div className="p-6 rounded-xl bg-orange-brand/5 border border-orange-brand/30">
          <div className="flex items-center gap-2 font-mono text-xs text-orange-400 uppercase tracking-wider mb-3 font-semibold">
            <Sparkles className="w-4 h-4 text-orange-brand" />
            <span>CarbonWise Workflow (Pre-Melt Intelligence)</span>
          </div>
          <div className="space-y-2 text-xs font-mono text-industrial-200">
            <div className="p-2.5 rounded bg-industrial-950 border border-industrial-800">
              1. Generate candidate scenarios (scrap mix, energy source, charge recipes)
            </div>
            <div className="p-2.5 rounded bg-industrial-950 border border-status-success/30 text-status-success">
              2. Filter out infeasible options & select lowest-carbon feasible scenario
            </div>
            <div className="p-2.5 rounded bg-industrial-950 border border-orange-brand/30 text-orange-300 font-semibold">
              3. Optimize carbon without ignoring metallurgical or yield constraints
            </div>
          </div>
          <p className="text-xs text-orange-400/90 mt-4 italic font-medium">
            "Lowest carbon is not enough. It must also be feasible."
          </p>
        </div>
      </section>

      {/* Production Validation Roadmap (Section 34) */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-1">
          <h2 className="font-mono text-xs uppercase tracking-widest text-orange-brand font-semibold">
            INDUSTRIAL VALIDATION ROADMAP
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold text-industrial-100">
            PILOT → VALIDATE → CONNECT → USE
          </h3>
          <p className="text-xs text-industrial-400 max-w-xl mx-auto">
            Disciplined enterprise deployment path without disrupting active plant operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-industrial-900 border border-industrial-800">
            <div className="font-mono text-xs font-bold text-orange-400">PHASE 1: PILOT</div>
            <h4 className="text-sm font-semibold text-industrial-200 mt-1">Historical Calibration</h4>
            <p className="text-xs text-industrial-400 mt-1">
              Import 200+ historical heats. Compare predicted vs actual carbon to determine baseline MAE and RMSE.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-industrial-900 border border-industrial-800">
            <div className="font-mono text-xs font-bold text-orange-400">PHASE 2: VALIDATE</div>
            <h4 className="text-sm font-semibold text-industrial-200 mt-1">Constraint Calibration</h4>
            <p className="text-xs text-industrial-400 mt-1">
              Verify 8-constraint PASS/FAIL agreement against real ladle turnaround, yield, and chemistry specs.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-industrial-900 border border-industrial-800">
            <div className="font-mono text-xs font-bold text-orange-400">PHASE 3: CONNECT</div>
            <h4 className="text-sm font-semibold text-industrial-200 mt-1">Validated Layer</h4>
            <p className="text-xs text-industrial-400 mt-1">
              Connect to JSL SAP ERP and MES through validated read-only decision integration service.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-industrial-900 border border-industrial-800">
            <div className="font-mono text-xs font-bold text-orange-400">PHASE 4: USE</div>
            <h4 className="text-sm font-semibold text-industrial-200 mt-1">Pre-Melt Production</h4>
            <p className="text-xs text-industrial-400 mt-1">
              Planners select lowest-carbon feasible scenario for every active heat with verified avoidance metrics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
