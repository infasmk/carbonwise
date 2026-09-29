import React from 'react';
import { ShieldCheck, FileText, Cpu, ExternalLink } from 'lucide-react';

interface FooterProps {
  onSelectModule: (module: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectModule }) => {
  return (
    <footer className="border-t border-industrial-800 bg-industrial-950 mt-12 py-8 px-4 md:px-8 text-xs text-industrial-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Identity & Tagline */}
        <div className="space-y-2.5">
          <div className="font-mono text-sm font-bold text-industrial-100 flex items-center gap-2">
            CARBONWISE
          </div>
          <p className="text-industrial-300 font-serif italic text-xs">
            "The decision is made before the melt."
          </p>
          <p className="text-[11px] text-industrial-400 leading-relaxed">
            Pre-production carbon & energy decision-intelligence platform for stainless-steelmaking. Designed as an explainable decision layer around existing industrial SAP/MES architectures.
          </p>
        </div>

        {/* Col 2: Product Modules */}
        <div>
          <h4 className="font-mono text-xs uppercase tracking-wider text-industrial-300 font-semibold mb-3">
            Core Modules
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <button onClick={() => onSelectModule('heat-planner')} className="hover:text-orange-400 transition">
                Heat Planner
              </button>
            </li>
            <li>
              <button onClick={() => onSelectModule('scenarios')} className="hover:text-orange-400 transition">
                Scenario Lab & Feasibility
              </button>
            </li>
            <li>
              <button onClick={() => onSelectModule('validation')} className="hover:text-orange-400 transition">
                Validation Center
              </button>
            </li>
            <li>
              <button onClick={() => onSelectModule('data-hub')} className="hover:text-orange-400 transition">
                Data Hub & Ingestion
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Industrial Framework & Governance */}
        <div>
          <h4 className="font-mono text-xs uppercase tracking-wider text-industrial-300 font-semibold mb-3">
            Governance & Specs
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <button onClick={() => onSelectModule('factors')} className="hover:text-orange-400 transition">
                Emission Factor Registry
              </button>
            </li>
            <li>
              <button onClick={() => onSelectModule('benchmarks')} className="hover:text-orange-400 transition">
                JSL Public Benchmark Data
              </button>
            </li>
            <li>
              <button onClick={() => onSelectModule('reports')} className="hover:text-orange-400 transition">
                Audit Trail & PDF Reports
              </button>
            </li>
            <li>
              <button onClick={() => onSelectModule('product-story')} className="hover:text-orange-400 transition">
                Methodology & Roadmap
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Mandatory Industrial Disclaimer */}
        <div className="space-y-2">
          <h4 className="font-mono text-xs uppercase tracking-wider text-amber-400/90 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Integrity & Honesty Notice
          </h4>
          <div className="p-2.5 rounded bg-industrial-900 border border-industrial-800 text-[10px] text-industrial-400 leading-normal">
            Illustrative prototype. Production deployment requires approved plant data, certified emission factors, and calibrated operating constraints. JSL public disclosures are benchmark references only.
          </div>
          <div className="text-[10px] font-mono text-industrial-500 pt-1">
            Accounting: Scope 1 + Scope 2 (Location / Market PPA)
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-industrial-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-industrial-500 font-mono">
        <div>© 2026 CARBONWISE Systems. Industrial Carbon & Energy Decision Intelligence.</div>
        <div className="flex gap-4">
          <span>Target: JSL / Stainless Steelmaking</span>
          <span>Status: Enterprise Prototype</span>
        </div>
      </div>
    </footer>
  );
};
