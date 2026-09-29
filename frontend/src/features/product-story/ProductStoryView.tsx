import React from 'react';
import { 
  BookOpen, 
  Workflow, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Flame,
  Zap
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const ProductStoryView: React.FC = () => {
  return (
    <div className="space-y-10 max-w-5xl">
      {/* Title */}
      <div className="pb-4 border-b border-industrial-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-industrial-100 font-sans tracking-tight">
            Product Purpose, Architecture &amp; Roadmap
          </h2>
          <Badge variant="accent">ENTERPRISE SPECIFICATION</Badge>
        </div>
        <p className="text-xs sm:text-sm text-industrial-400 mt-0.5">
          Why CarbonWise exists, its positioning as a pre-melt decision layer, and its rigorous industrial boundary definitions.
        </p>
      </div>

      {/* Core Principle Callout */}
      <div className="industrial-card p-6 border-l-4 border-l-orange-brand border-industrial-800 bg-industrial-900 rounded-lg space-y-2">
        <div className="font-mono text-xs font-bold text-orange-400 uppercase tracking-widest">
          THE MOST IMPORTANT PRODUCT PRINCIPLE
        </div>
        <h3 className="text-lg font-bold text-industrial-100 font-serif italic">
          "Lowest carbon is not enough. It must also be feasible."
        </h3>
        <p className="text-xs text-industrial-300 leading-relaxed font-mono">
          CarbonWise does NOT simply ask: <em>"What is the lowest-carbon option?"</em><br />
          It answers: <strong>"Given the production requirement, what are the feasible ways to make this heat, what is the estimated carbon impact of each scenario, and which feasible scenario has the lowest CO₂e per finished tonne?"</strong>
        </p>
      </div>

      {/* What CarbonWise IS vs NOT (Section 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        <div className="p-5 rounded-xl bg-industrial-900 border border-status-success/30 space-y-3">
          <div className="flex items-center gap-2 text-status-success font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>WHAT CARBONWISE IS</span>
          </div>
          <ul className="space-y-2 text-industrial-300">
            <li className="flex items-start gap-2">
              <span className="text-status-success">✓</span>
              <span>A pre-production carbon decision layer wrapping existing industrial systems.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-status-success">✓</span>
              <span>An 8-constraint metallurgical feasibility gate that rejects impractical candidate scenarios.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-status-success">✓</span>
              <span>A transparent mathematical model where all emission calculations and formula steps are auditable.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-status-success">✓</span>
              <span>A historical validation engine computing honest MAE and RMSE metrics on imported heats.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-xl bg-industrial-900 border border-status-danger/30 space-y-3">
          <div className="flex items-center gap-2 text-status-danger font-bold text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>WHAT CARBONWISE IS NOT</span>
          </div>
          <ul className="space-y-2 text-industrial-300">
            <li className="flex items-start gap-2">
              <span className="text-status-danger">✕</span>
              <span>NOT an SAP or Enterprise Resource Planning (ERP) replacement.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-status-danger">✕</span>
              <span>NOT a Manufacturing Execution System (MES) or SCADA replacement.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-status-danger">✕</span>
              <span>NOT a generic AI chatbot hallucinating fabricated emission numbers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-status-danger">✕</span>
              <span>NOT a retrospective carbon calculator calculating emissions after the melt is complete.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Integration Architecture (Section 33) */}
      <div className="industrial-card p-6 border border-industrial-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-industrial-800">
          <h3 className="font-mono text-sm font-semibold text-industrial-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-orange-brand" />
            <span>SYSTEM INTEGRATION ARCHITECTURE</span>
          </h3>
          <Badge variant="demo">FUTURE INTEGRATION LAYER</Badge>
        </div>

        <p className="text-xs text-industrial-400 font-mono">
          CarbonWise interfaces cleanly with enterprise infrastructure via structured ingestion schemas:
        </p>

        <div className="p-4 rounded-lg bg-industrial-950 border border-industrial-800 font-mono text-xs text-center space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2.5 rounded bg-industrial-900 border border-industrial-800 text-industrial-300 font-bold">
              JSL SAP / ERP (Orders &amp; Stock)
            </div>
            <div className="p-2.5 rounded bg-industrial-900 border border-industrial-800 text-industrial-300 font-bold">
              JSL MES / Level 2 (Furnace State)
            </div>
            <div className="p-2.5 rounded bg-industrial-900 border border-industrial-800 text-industrial-300 font-bold">
              Energy SCADA (Real-Time Tariffs)
            </div>
            <div className="p-2.5 rounded bg-industrial-900 border border-industrial-800 text-industrial-300 font-bold">
              Scrap Yard YardMaster (Assays)
            </div>
          </div>

          <div className="text-orange-400 font-bold text-sm">↓ Validated Integration Layer (API / Data Hub) ↓</div>

          <div className="p-3 rounded-lg bg-orange-brand/10 border border-orange-brand/50 text-industrial-100 font-bold">
            CARBONWISE PRE-MELT INTELLIGENCE ENGINE
            <div className="text-[10px] text-industrial-400 font-normal mt-0.5">
              Calculation Engine • Feasibility Engine (8 Checks) • Scenario Optimizer
            </div>
          </div>

          <div className="text-orange-400 font-bold text-sm">↓ Confirmed Decision ↓</div>

          <div className="p-2.5 rounded bg-status-success-bg border border-status-success-border text-status-success font-bold text-xs">
            Locked Pre-Melt Production Schedule (Allocated into Melt Shop Queues)
          </div>
        </div>
      </div>

      {/* 5-Phase Deployment Roadmap (Section 69) */}
      <div className="space-y-4 font-mono text-xs">
        <h3 className="text-sm font-semibold text-industrial-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-brand" />
          <span>PRODUCTION VALIDATION ROADMAP</span>
        </h3>

        <div className="space-y-2.5">
          <div className="p-3.5 rounded-lg bg-industrial-900 border border-orange-brand/40 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-orange-400">PHASE 1: PROTOTYPE (Current Stage)</span>
                <span className="px-1.5 py-0.2 bg-orange-brand text-white rounded text-[10px] font-bold">ACTIVE</span>
              </div>
              <p className="text-industrial-300 text-[11px] mt-1">
                Deterministic calculation engine, 8-constraint feasibility checks, interactive scenario lab, and jury demo mode.
              </p>
            </div>
            <span className="text-status-success font-bold text-xs shrink-0">Complete</span>
          </div>

          <div className="p-3.5 rounded-lg bg-industrial-900 border border-industrial-800 flex items-start justify-between gap-4">
            <div>
              <div className="font-bold text-industrial-200">PHASE 2: HISTORICAL VALIDATION</div>
              <p className="text-industrial-400 text-[11px] mt-1">
                Import approved 250+ JSL heat logs. Compute genuine MAE/RMSE on actual tap chemistry and verified energy consumption.
              </p>
            </div>
            <span className="text-amber-400 font-semibold text-xs shrink-0">Next Step</span>
          </div>

          <div className="p-3.5 rounded-lg bg-industrial-900 border border-industrial-800 flex items-start justify-between gap-4">
            <div>
              <div className="font-bold text-industrial-200">PHASE 3: PILOT MELT SHOP TRIAL</div>
              <p className="text-industrial-400 text-[11px] mt-1">
                Run CarbonWise in parallel with active melt shop planners on 20 trial heats of Grade 304 to measure verified kg CO2e/t avoided.
              </p>
            </div>
            <span className="text-industrial-500 text-xs shrink-0">Planned</span>
          </div>

          <div className="p-3.5 rounded-lg bg-industrial-900 border border-industrial-800 flex items-start justify-between gap-4">
            <div>
              <div className="font-bold text-industrial-200">PHASE 4: SAP / MES DIRECT INTEGRATION</div>
              <p className="text-industrial-400 text-[11px] mt-1">
                Secure read-only connectors to JSL SAP ERP and melt shop MES for automated charge recipe synchronization.
              </p>
            </div>
            <span className="text-industrial-500 text-xs shrink-0">Planned</span>
          </div>

          <div className="p-3.5 rounded-lg bg-industrial-900 border border-industrial-800 flex items-start justify-between gap-4">
            <div>
              <div className="font-bold text-industrial-200">PHASE 5: ENTERPRISE PRODUCTION DEPLOYMENT</div>
              <p className="text-industrial-400 text-[11px] mt-1">
                Multi-site roll-out across Jajpur and Hisar facilities with continuous emission factor calibration and corporate ESG audit integration.
              </p>
            </div>
            <span className="text-industrial-500 text-xs shrink-0">Planned</span>
          </div>
        </div>
      </div>
    </div>
  );
};
