import React, { useState } from 'react';
import { 
  Flame, 
  Layers, 
  Zap, 
  Scale, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Info,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { HeatInput, CarbonBreakdown, GradeType } from '../../types';
import { ContributionBar } from '../../components/charts/ContributionBar';
import { Badge } from '../../components/common/Badge';

interface HeatPlannerViewProps {
  heat: HeatInput;
  onChangeHeat: (newHeat: HeatInput) => void;
  carbon: CarbonBreakdown;
  onNavigateToScenarios: () => void;
  isCalculating: boolean;
}

export const HeatPlannerView: React.FC<HeatPlannerViewProps> = ({
  heat,
  onChangeHeat,
  carbon,
  onNavigateToScenarios,
  isCalculating
}) => {
  const [showFormulaBasis, setShowFormulaBasis] = useState<boolean>(true);

  const handleFieldChange = (field: keyof HeatInput, value: any) => {
    onChangeHeat({
      ...heat,
      [field]: value
    });
  };

  const scrapTonnage = Number(((heat.target_tonnage * heat.scrap_mix_pct) / 100).toFixed(1));
  const totalMWh = Number((heat.target_tonnage * heat.electricity_intensity_mwh_per_t).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-industrial-100 font-sans tracking-tight">
              Heat Planner
            </h2>
            <Badge variant="accent">PRIMARY WORKSPACE</Badge>
          </div>
          <p className="text-xs sm:text-sm text-industrial-400 mt-0.5">
            Model a production heat before the plan is locked. Evaluate scrap recipes, energy sources, and emissions.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onNavigateToScenarios}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-brand hover:bg-orange-bright text-white font-mono text-xs font-semibold transition shadow-panel shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Evaluate Scenarios</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>

      {/* Top Metadata Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-industrial-900 border border-industrial-800 text-xs font-mono">
        <div>
          <label className="text-industrial-500 text-[10px] block uppercase">HEAT ID</label>
          <input
            type="text"
            value={heat.heat_id}
            onChange={(e) => handleFieldChange('heat_id', e.target.value)}
            className="w-full bg-industrial-950 border border-industrial-800 rounded px-2 py-1 text-industrial-100 font-bold mt-1 focus:border-orange-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="text-industrial-500 text-[10px] block uppercase">STAINLESS GRADE</label>
          <select
            value={heat.grade}
            onChange={(e) => handleFieldChange('grade', e.target.value as GradeType)}
            className="w-full bg-industrial-950 border border-industrial-800 rounded px-2 py-1 text-orange-400 font-bold mt-1 focus:border-orange-brand focus:outline-none"
          >
            <option value="304">AISI 304 (Standard Austenitic)</option>
            <option value="304L">AISI 304L (Low Carbon)</option>
            <option value="316">AISI 316 (Marine Mo-bearing)</option>
            <option value="316L">AISI 316L (Low Carbon Mo)</option>
            <option value="430">AISI 430 (Ferritic Cr-only)</option>
          </select>
        </div>
        <div>
          <label className="text-industrial-500 text-[10px] block uppercase">TARGET TONNAGE</label>
          <div className="relative mt-1">
            <input
              type="number"
              value={heat.target_tonnage}
              onChange={(e) => handleFieldChange('target_tonnage', parseFloat(e.target.value) || 100.0)}
              className="w-full bg-industrial-950 border border-industrial-800 rounded px-2 py-1 text-industrial-100 font-bold pr-7 focus:border-orange-brand focus:outline-none"
            />
            <span className="absolute right-2 top-1 text-industrial-500 text-xs">t</span>
          </div>
        </div>
        <div>
          <label className="text-industrial-500 text-[10px] block uppercase">PLANNING DATE</label>
          <input
            type="date"
            value={heat.planning_date}
            onChange={(e) => handleFieldChange('planning_date', e.target.value)}
            className="w-full bg-industrial-950 border border-industrial-800 rounded px-2 py-1 text-industrial-200 mt-1 focus:border-orange-brand focus:outline-none"
          />
        </div>
      </div>

      {/* Main Grid: Parameters Form (Left) & Real-time Carbon Calculation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Groups (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* GROUP 1: MATERIAL INPUTS */}
          <div className="industrial-card p-4 border border-industrial-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
              <span className="font-mono text-xs font-semibold text-industrial-100 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-orange-brand" />
                <span>MATERIAL & SCRAP CHARGE</span>
              </span>
              <span className="text-[11px] font-mono text-orange-400 font-bold">
                {heat.scrap_mix_pct.toFixed(1)}% Scrap ({scrapTonnage} t)
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-industrial-300 mb-1">
                  <span>Scrap Mix Ratio:</span>
                  <span className="text-orange-400 font-bold">{heat.scrap_mix_pct.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="40.0"
                  max="90.0"
                  step="0.1"
                  value={heat.scrap_mix_pct}
                  onChange={(e) => handleFieldChange('scrap_mix_pct', parseFloat(e.target.value))}
                  className="w-full accent-orange-brand bg-industrial-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-industrial-500 mt-0.5">
                  <span>Min 40%</span>
                  <span>Operational Baseline: 70.1%</span>
                  <span>Max 90%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-industrial-400 text-[11px] block">Scrap Type</label>
                  <select
                    value={heat.scrap_type}
                    onChange={(e) => handleFieldChange('scrap_type', e.target.value)}
                    className="w-full bg-industrial-900 border border-industrial-800 rounded px-2 py-1.5 text-industrial-200 mt-1 focus:outline-none"
                  >
                    <option value="SS 304 Heavy Recycled Scrap">SS 304 Heavy Recycled Scrap</option>
                    <option value="Industrial Turnings & Clippings">Industrial Turnings & Clippings</option>
                    <option value="Blended Austenitic Plate Scrap">Blended Austenitic Plate Scrap</option>
                  </select>
                </div>
                <div>
                  <label className="text-industrial-400 text-[11px] block">Scrap Quality & Sorting</label>
                  <select
                    value={heat.scrap_quality}
                    onChange={(e) => handleFieldChange('scrap_quality', e.target.value)}
                    className="w-full bg-industrial-900 border border-industrial-800 rounded px-2 py-1.5 text-industrial-200 mt-1 focus:outline-none"
                  >
                    <option value="Grade A (Low Tramp Cu < 0.25%)">Grade A (Low Tramp Cu &lt; 0.25%)</option>
                    <option value="Grade B (Tramp Cu 0.25-0.35%)">Grade B (Tramp Cu 0.25-0.35%)</option>
                    <option value="Unsorted Merchant Scrap">Unsorted Merchant Scrap (High Tramp Risk)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-industrial-400 text-[11px] block">Scrap Source / Supplier</label>
                  <input
                    type="text"
                    value={heat.scrap_source}
                    onChange={(e) => handleFieldChange('scrap_source', e.target.value)}
                    className="w-full bg-industrial-900 border border-industrial-800 rounded px-2 py-1.5 text-industrial-200 mt-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-industrial-400 text-[11px] block">Ferro-alloy Additions (% wt)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={heat.alloy_additions_pct}
                    onChange={(e) => handleFieldChange('alloy_additions_pct', parseFloat(e.target.value) || 4.2)}
                    className="w-full bg-industrial-900 border border-industrial-800 rounded px-2 py-1.5 text-industrial-200 mt-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GROUP 2: ENERGY INPUTS */}
          <div className="industrial-card p-4 border border-industrial-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
              <span className="font-mono text-xs font-semibold text-industrial-100 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-orange-brand" />
                <span>ENERGY SOURCE & POWER INTENSITY</span>
              </span>
              <span className="text-[11px] font-mono text-orange-400 font-bold">
                {totalMWh} MWh Total Electricity
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-industrial-400 text-[11px] block">Energy Source Profile</label>
                  <select
                    value={heat.energy_source}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleFieldChange('energy_source', val);
                      if (val === 'Grid') handleFieldChange('grid_emission_factor', 0.719);
                      else if (val === 'Hybrid Solar/Wind PPA') handleFieldChange('grid_emission_factor', 0.595);
                    }}
                    className="w-full bg-industrial-900 border border-industrial-800 rounded px-2 py-1.5 text-industrial-200 mt-1 focus:outline-none"
                  >
                    <option value="Grid">Regional Electrical Grid (Baseline)</option>
                    <option value="Hybrid Solar/Wind PPA">Hybrid Solar/Wind PPA (Wheeled Green)</option>
                    <option value="100% Dedicated Solar">100% Dedicated Solar (Daytime Only)</option>
                  </select>
                </div>
                <div>
                  <label className="text-industrial-400 text-[11px] block">Grid Emission Factor (tCO2e/MWh)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={heat.grid_emission_factor}
                    onChange={(e) => handleFieldChange('grid_emission_factor', parseFloat(e.target.value) || 0.719)}
                    className="w-full bg-industrial-900 border border-industrial-800 rounded px-2 py-1.5 text-industrial-200 mt-1 focus:outline-none"
                  />
                  <span className="text-[10px] text-industrial-500 block mt-0.5">CEA Grid Baseline: 0.719</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-industrial-300 mb-1">
                  <span>Specific Electricity Consumption:</span>
                  <span className="text-orange-400 font-bold">{heat.electricity_intensity_mwh_per_t.toFixed(2)} MWh/t</span>
                </div>
                <input
                  type="range"
                  min="1.30"
                  max="2.50"
                  step="0.01"
                  value={heat.electricity_intensity_mwh_per_t}
                  onChange={(e) => handleFieldChange('electricity_intensity_mwh_per_t', parseFloat(e.target.value))}
                  className="w-full accent-orange-brand bg-industrial-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-industrial-500 mt-0.5">
                  <span>1.30 MWh/t (Thermodynamic Limit)</span>
                  <span>Baseline: 1.85 MWh/t</span>
                  <span>2.50 MWh/t</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-industrial-400 text-[11px] block">Secondary Fuel (Preheating)</label>
                  <input
                    type="text"
                    value={heat.fuel_type}
                    onChange={(e) => handleFieldChange('fuel_type', e.target.value)}
                    className="w-full bg-industrial-900 border border-industrial-800 rounded px-2 py-1.5 text-industrial-200 mt-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-industrial-400 text-[11px] block">Fuel Rate (Nm³/t)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={heat.fuel_consumption_nm3_per_t}
                    onChange={(e) => handleFieldChange('fuel_consumption_nm3_per_t', parseFloat(e.target.value) || 12.0)}
                    className="w-full bg-industrial-900 border border-industrial-800 rounded px-2 py-1.5 text-industrial-200 mt-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GROUP 3: PRODUCTION & QUALITY CONSTRAINTS */}
          <div className="industrial-card p-4 border border-industrial-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
              <span className="font-mono text-xs font-semibold text-industrial-100 flex items-center gap-2">
                <Scale className="w-3.5 h-3.5 text-orange-brand" />
                <span>OPERATIONAL YIELD & PROCESS CYCLE</span>
              </span>
              <span className="text-[11px] font-mono text-status-success font-bold">
                {heat.expected_yield_pct.toFixed(1)}% Yield (Pass &ge; 80.0%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="text-industrial-400 text-[11px] block">Expected Yield (% liquid / finished)</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    step="0.1"
                    min="50.0"
                    max="100.0"
                    value={heat.expected_yield_pct}
                    onChange={(e) => handleFieldChange('expected_yield_pct', parseFloat(e.target.value) || 92.4)}
                    className="w-full bg-industrial-900 border border-industrial-800 rounded px-2 py-1.5 text-industrial-100 font-bold focus:outline-none"
                  />
                  <span className="absolute right-2 top-1.5 text-industrial-500">%</span>
                </div>
                <span className="text-[10px] text-industrial-500 block mt-0.5">Constraint: Minimum 80.0% required</span>
              </div>
              <div>
                <label className="text-industrial-400 text-[11px] block">EAF Tap-to-Tap Time (minutes)</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    value={heat.eaf_tap_to_tap_min}
                    onChange={(e) => handleFieldChange('eaf_tap_to_tap_min', parseFloat(e.target.value) || 68.0)}
                    className="w-full bg-industrial-900 border border-industrial-800 rounded px-2 py-1.5 text-industrial-100 font-bold focus:outline-none"
                  />
                  <span className="absolute right-2 top-1.5 text-industrial-500">min</span>
                </div>
                <span className="text-[10px] text-industrial-500 block mt-0.5">Pacing envelope: 45 - 75 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Carbon Impact & Formula (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Result Card (Section 10) */}
          <div className="industrial-card p-6 border border-orange-brand/40 bg-industrial-900/90 rounded-xl relative overflow-hidden shadow-panel">
            <div className="flex items-center justify-between text-xs font-mono text-industrial-400 pb-2 border-b border-industrial-800">
              <span className="uppercase tracking-wider font-semibold text-industrial-200">
                PRE-PRODUCTION CARBON IMPACT
              </span>
              <Badge variant="accent" size="sm">ACTIVE BASELINE</Badge>
            </div>

            {/* Giant Number Display */}
            <div className="my-5 text-center">
              <div className="text-5xl font-mono font-extrabold tracking-tight text-industrial-100">
                {carbon.total_co2e_per_t.toFixed(2)}
              </div>
              <div className="text-xs font-mono text-industrial-400 uppercase tracking-widest mt-1">
                tCO2e / finished tonne
              </div>
            </div>

            {/* Horizontal Contribution Breakdown Bars (Section 10) */}
            <div className="pt-2 pb-4">
              <ContributionBar carbon={carbon} />
            </div>

            {/* Methodology Note (Section 9) */}
            <div className="p-2.5 rounded bg-industrial-950 border border-industrial-800 text-[11px] text-industrial-400 font-mono leading-relaxed mt-2">
              <div className="flex items-center gap-1.5 text-orange-400 font-semibold mb-0.5">
                <Info className="w-3.5 h-3.5" />
                <span>Methodology Note:</span>
              </div>
              "{carbon.methodology_note}"
            </div>
          </div>

          {/* Transparent Formula Drawer (Section 11) */}
          <div className="industrial-card p-4 border border-industrial-800 rounded-lg space-y-3">
            <button
              onClick={() => setShowFormulaBasis(!showFormulaBasis)}
              className="w-full flex items-center justify-between text-xs font-mono text-industrial-200 font-semibold focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-brand" />
                <span>TRANSPARENT CALCULATION BASIS</span>
              </div>
              {showFormulaBasis ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showFormulaBasis && (
              <div className="pt-2 border-t border-industrial-800 font-mono text-xs space-y-2 text-industrial-300">
                <div className="p-2 rounded bg-industrial-950 border border-industrial-800">
                  <div className="text-industrial-500 text-[10px]">ENERGY CARBON</div>
                  <div className="text-industrial-200 font-bold mt-0.5">
                    = Energy intensity × Emission factor
                  </div>
                  <div className="text-orange-400 mt-0.5">
                    = {heat.electricity_intensity_mwh_per_t.toFixed(2)} × {heat.grid_emission_factor.toFixed(3)}
                    <strong className="text-industrial-100 ml-1">= {carbon.energy_co2e_per_t.toFixed(2)} tCO2e/t</strong>
                  </div>
                </div>

                <div className="p-2 rounded bg-industrial-950 border border-industrial-800">
                  <div className="text-industrial-500 text-[10px]">ALLOY ADDITIONS</div>
                  <div className="text-amber-400 mt-0.5">
                    = {carbon.alloy_co2e_per_t.toFixed(2)} tCO2e/t (FeCr &amp; FeNi Grade {heat.grade} factor)
                  </div>
                </div>

                <div className="p-2 rounded bg-industrial-950 border border-industrial-800">
                  <div className="text-industrial-500 text-[10px]">SCRAP ROUTE</div>
                  <div className="text-industrial-200 mt-0.5">
                    = {carbon.scrap_route_co2e_per_t.toFixed(2)} tCO2e/t (Preparation, handling &amp; charging)
                  </div>
                </div>

                <div className="p-2.5 rounded bg-orange-brand/10 border border-orange-brand/30 flex justify-between items-center text-industrial-100 font-bold">
                  <span>TOTAL ESTIMATED CARBON</span>
                  <span className="text-orange-400 text-sm">{carbon.total_co2e_per_t.toFixed(2)} tCO2e/t</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
