import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { DecisionRecord, HeatInput, ScenarioItem } from '../../types';
import { Badge } from '../../components/common/Badge';

interface ReportsViewProps {
  decisions: DecisionRecord[];
  currentHeat: HeatInput;
  scenarios: ScenarioItem[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  decisions,
  currentHeat,
  scenarios
}) => {
  const [activeReportType, setActiveReportType] = useState<'heat' | 'scenario' | 'opportunity'>('heat');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    // Generate CSV string
    const headers = ["Decision_ID", "Heat_ID", "Grade", "Tonnage", "Baseline_CO2e", "Selected_Plan", "Selected_CO2e", "Avoidance_t", "Avoidance_Total", "Planner", "Timestamp"];
    const rows = decisions.map(d => [
      d.decision_id, d.heat_id, d.grade, d.target_tonnage, d.current_co2e_per_t,
      `"${d.selected_scenario_name}"`, d.selected_co2e_per_t, d.potential_avoidance_per_t,
      d.potential_avoidance_total_tonnes, `"${d.planner}"`, d.timestamp
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `carbonwise_decisions_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-industrial-100 font-sans tracking-tight">
              Reports &amp; Auditable Exports
            </h2>
            <Badge variant="accent">GOVERNANCE &amp; PDF READY</Badge>
          </div>
          <p className="text-xs sm:text-sm text-industrial-400 mt-0.5">
            Export certified heat decision dossiers, scenario comparison summaries, and ESG opportunity analyses.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-industrial-200 font-mono text-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-orange-brand" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-brand hover:bg-orange-bright text-white font-mono text-xs font-semibold transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex rounded-lg bg-industrial-900 p-1 border border-industrial-800 text-xs font-mono w-fit">
        <button
          onClick={() => setActiveReportType('heat')}
          className={`px-3 py-1.5 rounded transition ${
            activeReportType === 'heat' ? 'bg-orange-brand text-white font-semibold' : 'text-industrial-400 hover:text-industrial-200'
          }`}
        >
          Heat Decision Dossier
        </button>
        <button
          onClick={() => setActiveReportType('scenario')}
          className={`px-3 py-1.5 rounded transition ${
            activeReportType === 'scenario' ? 'bg-orange-brand text-white font-semibold' : 'text-industrial-400 hover:text-industrial-200'
          }`}
        >
          Scenario Comparison Matrix
        </button>
        <button
          onClick={() => setActiveReportType('opportunity')}
          className={`px-3 py-1.5 rounded transition ${
            activeReportType === 'opportunity' ? 'bg-orange-brand text-white font-semibold' : 'text-industrial-400 hover:text-industrial-200'
          }`}
        >
          Carbon Opportunity Analysis
        </button>
      </div>

      {/* Styled Printable Report Container */}
      <div className="industrial-card p-8 border border-industrial-700 bg-industrial-950 rounded-xl space-y-6 text-industrial-100 font-sans shadow-elevated">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-industrial-800 gap-4">
          <div>
            <div className="font-mono text-base font-bold text-orange-400 flex items-center gap-2">
              CARBONWISE INDUSTRIAL INTELLIGENCE
            </div>
            <div className="text-xl font-bold text-industrial-100 mt-1">
              PRE-PRODUCTION HEAT DECISION DOSSIER
            </div>
            <p className="text-xs text-industrial-400 font-mono mt-0.5">
              Heat Reference: {currentHeat.heat_id} • Grade: AISI {currentHeat.grade} • Target: {currentHeat.target_tonnage} t
            </p>
          </div>

          <div className="text-right font-mono text-xs text-industrial-400 shrink-0">
            <div>Generated: {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC</div>
            <div>Factor Set: <span className="text-orange-400 font-semibold">demo-v1.4</span></div>
            <div>Classification: <span className="text-status-warning font-semibold">ILLUSTRATIVE DEMO</span></div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3 font-mono text-xs">
          <div className="text-xs font-bold text-industrial-300 uppercase tracking-wider">
            1. EXECUTIVE DECISION SUMMARY
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded bg-industrial-900 border border-industrial-800">
              <span className="text-industrial-500 block text-[10px]">BASELINE SCHEDULE</span>
              <span className="text-xl font-bold text-industrial-200">2.31 tCO2e/t</span>
              <span className="text-[10px] text-industrial-400 block mt-0.5">100% Grid &amp; Standard Charge</span>
            </div>
            <div className="p-3 rounded bg-industrial-900 border border-status-success/30">
              <span className="text-industrial-500 block text-[10px]">RECOMMENDED ROUTE</span>
              <span className="text-xl font-bold text-status-success">2.03 tCO2e/t</span>
              <span className="text-[10px] text-industrial-300 block mt-0.5">Scenario B (Energy &amp; PPA)</span>
            </div>
            <div className="p-3 rounded bg-industrial-900 border border-orange-brand/30">
              <span className="text-orange-400 block text-[10px] font-bold">POTENTIAL AVOIDANCE</span>
              <span className="text-xl font-bold text-orange-400">28.0 tCO2e</span>
              <span className="text-[10px] text-industrial-400 block mt-0.5">0.28 tCO2e / finished tonne</span>
            </div>
          </div>
        </div>

        {/* Section 2: Scenario Comparison Table */}
        <div className="space-y-3 font-mono text-xs">
          <div className="text-xs font-bold text-industrial-300 uppercase tracking-wider">
            2. CANDIDATE SCENARIO EVALUATION
          </div>
          <table className="w-full text-left font-mono text-xs border border-industrial-800 rounded">
            <thead>
              <tr className="bg-industrial-900 text-industrial-400 border-b border-industrial-800">
                <th className="py-2 px-3">Scenario</th>
                <th className="py-2 px-3">Scrap %</th>
                <th className="py-2 px-3">Energy MWh/t</th>
                <th className="py-2 px-3">Yield %</th>
                <th className="py-2 px-3">Carbon (t/t)</th>
                <th className="py-2 px-3">Feasibility</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-850">
              {scenarios.map((s) => (
                <tr key={s.id}>
                  <td className="py-2.5 px-3 font-bold text-industrial-200">{s.name}</td>
                  <td className="py-2.5 px-3">{s.scrap_mix_pct.toFixed(1)}%</td>
                  <td className="py-2.5 px-3">{s.electricity_intensity_mwh_per_t.toFixed(2)}</td>
                  <td className={`py-2.5 px-3 ${s.expected_yield_pct < 80.0 ? 'text-status-danger font-bold' : ''}`}>
                    {s.expected_yield_pct.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 font-bold text-orange-400">{s.carbon.total_co2e_per_t.toFixed(2)}</td>
                  <td className="py-2.5 px-3">
                    <span className={s.is_feasible ? 'text-status-success font-semibold' : 'text-status-danger font-semibold'}>
                      {s.status_label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-industrial-400 text-[11px]">
                    {s.id === 'SCENARIO_B' ? 'SELECTED' : s.id === 'SCENARIO_C' ? 'REJECTED (Yield)' : 'ALTERNATIVE'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Data Integrity Disclaimer (Section 31 & 32) */}
        <div className="pt-4 border-t border-industrial-800 font-mono text-[11px] text-industrial-400 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Data Integrity Classification Notice:</span>
          </div>
          <p className="leading-relaxed">
            This document was generated by CarbonWise decision-intelligence system. Baseline factors are reference values (Grid: 0.719 tCO2e/MWh). Potential carbon avoidance represents modeled pre-melt operational optimization, not retrospective compliance certification.
          </p>
        </div>
      </div>
    </div>
  );
};
