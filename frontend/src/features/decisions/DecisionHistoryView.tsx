import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Lock, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Eye, 
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { DecisionRecord } from '../../types';
import { Badge } from '../../components/common/Badge';

interface DecisionHistoryViewProps {
  decisions: DecisionRecord[];
}

export const DecisionHistoryView: React.FC<DecisionHistoryViewProps> = ({ decisions }) => {
  const [selectedDecision, setSelectedDecision] = useState<DecisionRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = decisions.filter(d => 
    d.heat_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.planner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-industrial-100 font-sans tracking-tight">
              Decision History &amp; Audit Trail
            </h2>
            <Badge variant="accent">AUDIT COMPLIANCE</Badge>
          </div>
          <p className="text-xs sm:text-sm text-industrial-400 mt-0.5">
            Immutable log of pre-production heat commitments with factor versions, timestamps, and justification rationale.
          </p>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="flex items-center gap-3 font-mono text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-industrial-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search Heat ID, Grade, or Planner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-industrial-900 border border-industrial-800 rounded pl-8 pr-3 py-1.5 text-industrial-200 focus:outline-none focus:border-orange-brand"
          />
        </div>
        <span className="text-industrial-500 text-xs hidden sm:inline">
          Showing {filtered.length} logged decisions
        </span>
      </div>

      {/* Decisions Table (Section 30) */}
      <div className="industrial-card border border-industrial-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-industrial-800 bg-industrial-950/80 text-industrial-400">
                <th className="py-3 px-3">Decision ID</th>
                <th className="py-3 px-3">Heat ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Grade</th>
                <th className="py-3 px-3">Baseline</th>
                <th className="py-3 px-3">Locked Plan</th>
                <th className="py-3 px-3">Selected CO2e</th>
                <th className="py-3 px-3">Potential Avoidance</th>
                <th className="py-3 px-3">Planner</th>
                <th className="py-3 px-3">Factor Ver</th>
                <th className="py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-850">
              {filtered.map((d) => (
                <tr key={d.decision_id} className="hover:bg-industrial-850/50 transition">
                  <td className="py-3 px-3 text-industrial-400 font-medium">{d.decision_id}</td>
                  <td className="py-3 px-3 font-bold text-industrial-100">{d.heat_id}</td>
                  <td className="py-3 px-3 text-industrial-400">{d.planning_date}</td>
                  <td className="py-3 px-3 text-orange-400 font-semibold">{d.grade}</td>
                  <td className="py-3 px-3 text-industrial-400">{d.current_co2e_per_t.toFixed(2)} t/t</td>
                  <td className="py-3 px-3 text-industrial-200 font-medium">{d.selected_scenario_name}</td>
                  <td className="py-3 px-3 font-bold text-status-success">{d.selected_co2e_per_t.toFixed(2)} t/t</td>
                  <td className="py-3 px-3 text-orange-400 font-semibold">
                    -{d.potential_avoidance_per_t.toFixed(2)} t/t ({d.potential_avoidance_total_tonnes} t)
                  </td>
                  <td className="py-3 px-3 text-industrial-300 text-[11px]">{d.planner}</td>
                  <td className="py-3 px-3 text-industrial-500">{d.factor_version}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => setSelectedDecision(d)}
                      className="px-2.5 py-1 rounded bg-industrial-800 hover:bg-industrial-700 text-industrial-200 flex items-center gap-1 transition"
                    >
                      <Eye className="w-3 h-3 text-orange-brand" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DECISION DETAIL MODAL (Section 66) */}
      {selectedDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="industrial-card p-6 max-w-2xl w-full border border-industrial-700 bg-industrial-900 rounded-xl space-y-4 shadow-elevated max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-industrial-800">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-status-success" />
                <h3 className="font-mono text-sm font-bold text-industrial-100">
                  PRODUCTION DECISION AUDIT: {selectedDecision.heat_id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDecision(null)}
                className="text-industrial-400 hover:text-industrial-100 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded bg-industrial-950 border border-industrial-800">
                <div>
                  <span className="text-industrial-500 block text-[10px]">DECISION ID</span>
                  <span className="text-industrial-200 font-bold">{selectedDecision.decision_id}</span>
                </div>
                <div>
                  <span className="text-industrial-500 block text-[10px]">HEAT ID / GRADE</span>
                  <span className="text-orange-400 font-bold">{selectedDecision.heat_id} ({selectedDecision.grade})</span>
                </div>
                <div>
                  <span className="text-industrial-500 block text-[10px]">LOCKED TONNAGE</span>
                  <span className="text-industrial-200 font-bold">{selectedDecision.target_tonnage} t</span>
                </div>
                <div>
                  <span className="text-industrial-500 block text-[10px]">FACTOR VERSION</span>
                  <span className="text-industrial-300">{selectedDecision.factor_version}</span>
                </div>
              </div>

              {/* Carbon Comparison */}
              <div className="p-4 rounded bg-industrial-950 border border-status-success/30 flex items-center justify-between">
                <div>
                  <span className="text-industrial-400 text-[10px] block uppercase">SELECTED PRODUCTION ROUTE</span>
                  <span className="text-sm font-bold text-industrial-100">{selectedDecision.selected_scenario_name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-status-success font-mono">
                    {selectedDecision.selected_co2e_per_t.toFixed(2)} tCO2e/t
                  </span>
                  <span className="text-[10px] text-orange-400 block font-semibold">
                    Avoided: {selectedDecision.potential_avoidance_total_tonnes} tCO2e vs baseline
                  </span>
                </div>
              </div>

              {/* Why this decision? */}
              <div className="space-y-1">
                <span className="font-semibold text-industrial-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-brand" />
                  <span>Why this decision? (Executive Justification)</span>
                </span>
                <div className="p-3 rounded bg-industrial-950 border border-industrial-800 text-industrial-300 leading-relaxed">
                  "{selectedDecision.rationale}"
                </div>
              </div>

              {/* Audit Provenance */}
              <div className="p-3 rounded bg-industrial-950 border border-industrial-800 text-[11px] text-industrial-400 space-y-1">
                <div className="flex justify-between">
                  <span>Authorized Planner:</span>
                  <span className="text-industrial-200 font-semibold">{selectedDecision.planner}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timestamp Locked:</span>
                  <span className="text-industrial-200">{selectedDecision.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accounting Boundary:</span>
                  <span className="text-industrial-200">{selectedDecision.accounting_boundary}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Confidence:</span>
                  <span className="text-amber-400 font-semibold">{selectedDecision.data_confidence}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-industrial-800">
              <button
                onClick={() => setSelectedDecision(null)}
                className="px-4 py-1.5 rounded bg-industrial-800 hover:bg-industrial-700 text-industrial-200 font-mono text-xs font-semibold"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
