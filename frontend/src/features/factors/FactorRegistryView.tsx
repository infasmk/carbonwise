import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  ShieldCheck, 
  History, 
  Search, 
  Filter, 
  Plus, 
  Scale, 
  Cpu,
  Info
} from 'lucide-react';
import { EmissionFactor, GradeConstraint, ProcessConstraint } from '../../types';
import { Badge } from '../../components/common/Badge';

interface FactorRegistryViewProps {
  factors: EmissionFactor[];
  gradeConstraints: GradeConstraint[];
  processConstraints: ProcessConstraint[];
}

export const FactorRegistryView: React.FC<FactorRegistryViewProps> = ({
  factors,
  gradeConstraints,
  processConstraints
}) => {
  const [activeTab, setActiveTab] = useState<'factors' | 'grades' | 'process'>('factors');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredFactors = factors.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.factor_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || f.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-industrial-100 font-sans tracking-tight">
              Factor Registry &amp; Operating Constraints
            </h2>
            <Badge variant="accent">VERSIONED REPOSITORY</Badge>
          </div>
          <p className="text-xs sm:text-sm text-industrial-400 mt-0.5">
            Immutable emissions factors, metallurgical grade boundaries, and process thermodynamics with version history.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-lg bg-industrial-900 p-1 border border-industrial-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('factors')}
            className={`px-3 py-1.5 rounded transition ${
              activeTab === 'factors' ? 'bg-orange-brand text-white font-semibold' : 'text-industrial-400 hover:text-industrial-200'
            }`}
          >
            Emission Factors ({factors.length})
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`px-3 py-1.5 rounded transition ${
              activeTab === 'grades' ? 'bg-orange-brand text-white font-semibold' : 'text-industrial-400 hover:text-industrial-200'
            }`}
          >
            Grade Limits ({gradeConstraints.length})
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`px-3 py-1.5 rounded transition ${
              activeTab === 'process' ? 'bg-orange-brand text-white font-semibold' : 'text-industrial-400 hover:text-industrial-200'
            }`}
          >
            Process Constraints ({processConstraints.length})
          </button>
        </div>
      </div>

      {/* TAB 1: EMISSION FACTOR REGISTRY */}
      {activeTab === 'factors' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between font-mono text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-industrial-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search factors or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-industrial-900 border border-industrial-800 rounded pl-8 pr-3 py-1.5 text-industrial-200 focus:outline-none focus:border-orange-brand"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-industrial-500">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-industrial-900 border border-industrial-800 rounded px-2 py-1.5 text-industrial-200 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Electricity">Electricity</option>
                <option value="Consumable / Route">Consumable / Route</option>
                <option value="Ferro-alloy">Ferro-alloy</option>
                <option value="Fuel">Fuel</option>
              </select>
            </div>
          </div>

          {/* Factors Table (Section 22) */}
          <div className="industrial-card border border-industrial-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-industrial-800 bg-industrial-950/80 text-industrial-400">
                    <th className="py-3 px-3">Factor ID</th>
                    <th className="py-3 px-3">Factor Name</th>
                    <th className="py-3 px-3">Value &amp; Unit</th>
                    <th className="py-3 px-3">Boundary</th>
                    <th className="py-3 px-3">Version</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Provenance / Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-industrial-850">
                  {filteredFactors.map((f) => (
                    <tr key={f.factor_id} className="hover:bg-industrial-850/50 transition">
                      <td className="py-3 px-3 font-bold text-orange-400">{f.factor_id}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-industrial-200">{f.name}</div>
                        <span className="text-[10px] text-industrial-500">{f.category}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-sm font-bold text-industrial-100">{f.value}</span>
                        <span className="text-[10px] text-industrial-400 ml-1">{f.unit}</span>
                      </td>
                      <td className="py-3 px-3 text-industrial-300 text-[11px]">{f.accounting_boundary}</td>
                      <td className="py-3 px-3 text-industrial-400">{f.version}</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            f.status === 'APPROVED' ? 'success' :
                            f.status === 'REFERENCE' ? 'info' :
                            f.status === 'PENDING VALIDATION' ? 'warning' : 'neutral'
                          }
                          size="sm"
                        >
                          {f.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-industrial-400 max-w-xs truncate" title={f.source}>
                        {f.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 rounded bg-industrial-900 border border-industrial-800 text-xs font-mono text-industrial-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-orange-brand shrink-0" />
            <span>
              <strong>Factor Immutability Rule:</strong> Never overwrite historical emission factors in-place. All production heat decisions reference the immutable factor version active at time of planning.
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: GRADE CONSTRAINTS */}
      {activeTab === 'grades' && (
        <div className="space-y-4">
          <div className="industrial-card border border-industrial-800 rounded-lg overflow-hidden">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-industrial-800 bg-industrial-950/80 text-industrial-400">
                  <th className="py-3 px-3">Grade</th>
                  <th className="py-3 px-3">Element</th>
                  <th className="py-3 px-3">Allowable Range</th>
                  <th className="py-3 px-3">Standard Spec</th>
                  <th className="py-3 px-3">Source / Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-850">
                {gradeConstraints.map((gc, i) => (
                  <tr key={i} className="hover:bg-industrial-850/50 transition">
                    <td className="py-2.5 px-3 font-bold text-orange-400">{gc.grade}</td>
                    <td className="py-2.5 px-3 text-industrial-200 font-semibold">{gc.element}</td>
                    <td className="py-2.5 px-3 text-industrial-100">
                      {gc.min_pct.toFixed(2)}% — {gc.max_pct.toFixed(2)}% {gc.unit}
                    </td>
                    <td className="py-2.5 px-3 text-industrial-400">{gc.specification_standard}</td>
                    <td className="py-2.5 px-3 text-industrial-400 text-[11px]">{gc.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROCESS CONSTRAINTS */}
      {activeTab === 'process' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processConstraints.map((pc, i) => (
              <div key={i} className="industrial-card p-4 border border-industrial-800 rounded-lg space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
                  <span className="text-industrial-100 font-bold">{pc.parameter}</span>
                  <Badge variant="neutral" size="sm">{pc.source}</Badge>
                </div>
                <div className="flex justify-between text-industrial-300">
                  <span className="text-industrial-500">Operating Unit:</span>
                  <span className="font-semibold text-industrial-200">{pc.process_unit}</span>
                </div>
                <div className="flex justify-between text-industrial-300">
                  <span className="text-industrial-500">Allowable Envelope:</span>
                  <span className="font-bold text-orange-400">
                    {pc.min_value !== undefined ? `${pc.min_value}` : 'N/A'} — {pc.max_value !== undefined ? `${pc.max_value}` : 'N/A'} {pc.unit}
                  </span>
                </div>
                <p className="text-[11px] text-industrial-400 pt-1 leading-snug">
                  {pc.operational_impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
