import React, { useState } from 'react';
import { HeatInput } from '../../types';
import { calculateCarbonLocal } from '../../services/api';
import { Sliders, Activity, Info } from 'lucide-react';

interface SensitivityChartProps {
  currentHeat: HeatInput;
}

type VariableKey = 'energy' | 'scrap' | 'grid' | 'yield';

export const SensitivityChart: React.FC<SensitivityChartProps> = ({ currentHeat }) => {
  const [activeVar, setActiveVar] = useState<VariableKey>('energy');

  // Interactive slider value override for sensitivity probing
  const [energySlider, setEnergySlider] = useState<number>(currentHeat.electricity_intensity_mwh_per_t);
  const [scrapSlider, setScrapSlider] = useState<number>(currentHeat.scrap_mix_pct);
  const [gridSlider, setGridSlider] = useState<number>(currentHeat.grid_emission_factor);

  // Compute curve points for the active variable
  const getCurveData = () => {
    const points = [];
    if (activeVar === 'energy') {
      const steps = [1.20, 1.40, 1.60, 1.80, 1.85, 2.00, 2.20, 2.40];
      for (const val of steps) {
        const carb = calculateCarbonLocal({ ...currentHeat, electricity_intensity_mwh_per_t: val });
        points.push({
          val: val.toFixed(2),
          label: `${val.toFixed(2)} MWh/t`,
          carbon: carb.total_co2e_per_t,
          isCurrent: Math.abs(val - currentHeat.electricity_intensity_mwh_per_t) < 0.03
        });
      }
    } else if (activeVar === 'scrap') {
      const steps = [50.0, 55.0, 60.0, 65.0, 70.1, 75.0, 80.0, 85.0];
      for (const val of steps) {
        const carb = calculateCarbonLocal({ ...currentHeat, scrap_mix_pct: val });
        points.push({
          val: val.toFixed(1),
          label: `${val.toFixed(1)}%`,
          carbon: carb.total_co2e_per_t,
          isCurrent: Math.abs(val - currentHeat.scrap_mix_pct) < 0.5
        });
      }
    } else if (activeVar === 'grid') {
      const steps = [0.100, 0.250, 0.400, 0.550, 0.719, 0.850];
      for (const val of steps) {
        const carb = calculateCarbonLocal({ ...currentHeat, grid_emission_factor: val });
        points.push({
          val: val.toFixed(3),
          label: `${val.toFixed(3)} t/MWh`,
          carbon: carb.total_co2e_per_t,
          isCurrent: Math.abs(val - currentHeat.grid_emission_factor) < 0.02
        });
      }
    } else {
      const steps = [80.0, 84.0, 88.0, 92.4, 96.0];
      for (const val of steps) {
        const carb = calculateCarbonLocal({ ...currentHeat, expected_yield_pct: val });
        points.push({
          val: val.toFixed(1),
          label: `${val.toFixed(1)}%`,
          carbon: carb.total_co2e_per_t,
          isCurrent: Math.abs(val - currentHeat.expected_yield_pct) < 0.5
        });
      }
    }
    return points;
  };

  const curveData = getCurveData();
  const currentProbedCarbon = calculateCarbonLocal({
    ...currentHeat,
    electricity_intensity_mwh_per_t: activeVar === 'energy' ? energySlider : currentHeat.electricity_intensity_mwh_per_t,
    scrap_mix_pct: activeVar === 'scrap' ? scrapSlider : currentHeat.scrap_mix_pct,
    grid_emission_factor: activeVar === 'grid' ? gridSlider : currentHeat.grid_emission_factor
  });

  return (
    <div className="industrial-card p-5 border border-industrial-800 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-800 gap-3">
        <div>
          <h3 className="font-mono text-sm font-semibold text-industrial-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-brand" />
            <span>SENSITIVITY ANALYSIS: WHAT MOVES CARBON?</span>
          </h3>
          <p className="text-xs text-industrial-400 mt-0.5">
            Hold operating parameters constant and evaluate carbon elasticity across variables.
          </p>
        </div>

        {/* Variable selector tabs */}
        <div className="flex rounded bg-industrial-900 p-1 border border-industrial-800 text-xs font-mono">
          <button
            onClick={() => setActiveVar('energy')}
            className={`px-2.5 py-1 rounded transition ${
              activeVar === 'energy' ? 'bg-orange-brand text-white font-semibold' : 'text-industrial-400 hover:text-industrial-200'
            }`}
          >
            Energy MWh/t
          </button>
          <button
            onClick={() => setActiveVar('scrap')}
            className={`px-2.5 py-1 rounded transition ${
              activeVar === 'scrap' ? 'bg-orange-brand text-white font-semibold' : 'text-industrial-400 hover:text-industrial-200'
            }`}
          >
            Scrap Mix %
          </button>
          <button
            onClick={() => setActiveVar('grid')}
            className={`px-2.5 py-1 rounded transition ${
              activeVar === 'grid' ? 'bg-orange-brand text-white font-semibold' : 'text-industrial-400 hover:text-industrial-200'
            }`}
          >
            Grid Factor
          </button>
        </div>
      </div>

      {/* Interactive slider & dynamic readout */}
      <div className="mt-5 p-4 rounded-lg bg-industrial-900/80 border border-industrial-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            {activeVar === 'energy' && (
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-industrial-300">Adjust Energy Intensity:</span>
                  <span className="text-orange-400 font-bold">{energySlider.toFixed(2)} MWh/t</span>
                </div>
                <input
                  type="range"
                  min="1.20"
                  max="2.40"
                  step="0.05"
                  value={energySlider}
                  onChange={(e) => setEnergySlider(parseFloat(e.target.value))}
                  className="w-full accent-orange-brand bg-industrial-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-industrial-500 font-mono mt-1">
                  <span>1.20 MWh/t</span>
                  <span>Baseline: 1.85 MWh/t</span>
                  <span>2.40 MWh/t</span>
                </div>
              </div>
            )}

            {activeVar === 'scrap' && (
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-industrial-300">Adjust Scrap Blend:</span>
                  <span className="text-orange-400 font-bold">{scrapSlider.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="50.0"
                  max="85.0"
                  step="0.5"
                  value={scrapSlider}
                  onChange={(e) => setScrapSlider(parseFloat(e.target.value))}
                  className="w-full accent-orange-brand bg-industrial-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-industrial-500 font-mono mt-1">
                  <span>50.0%</span>
                  <span>Baseline: 70.1%</span>
                  <span>85.0%</span>
                </div>
              </div>
            )}

            {activeVar === 'grid' && (
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-industrial-300">Adjust Grid Factor:</span>
                  <span className="text-orange-400 font-bold">{gridSlider.toFixed(3)} tCO2e/MWh</span>
                </div>
                <input
                  type="range"
                  min="0.100"
                  max="0.850"
                  step="0.025"
                  value={gridSlider}
                  onChange={(e) => setGridSlider(parseFloat(e.target.value))}
                  className="w-full accent-orange-brand bg-industrial-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-industrial-500 font-mono mt-1">
                  <span>0.100 (Clean PPA)</span>
                  <span>Baseline: 0.719</span>
                  <span>0.850 (Coal Heavy)</span>
                </div>
              </div>
            )}
          </div>

          {/* Probed Outcome */}
          <div className="sm:border-l sm:border-industrial-800 sm:pl-6 text-center sm:text-right shrink-0">
            <div className="text-[10px] font-mono uppercase text-industrial-400">Projected Carbon</div>
            <div className="text-2xl font-mono font-bold text-orange-400">
              {currentProbedCarbon.total_co2e_per_t.toFixed(2)}
              <span className="text-xs font-normal text-industrial-400 ml-1">tCO2e/t</span>
            </div>
            <div className="text-[11px] font-mono text-industrial-400 mt-0.5">
              vs Baseline (2.31):{' '}
              <span className={currentProbedCarbon.total_co2e_per_t <= 2.31 ? 'text-status-success font-semibold' : 'text-status-danger font-semibold'}>
                {(currentProbedCarbon.total_co2e_per_t - 2.31) > 0 ? '+' : ''}
                {(currentProbedCarbon.total_co2e_per_t - 2.31).toFixed(2)} tCO2e/t
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Discrete Sensitivity Steps Table (As requested in Section 17) */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-industrial-800 text-industrial-400">
              <th className="py-2 px-3">Variable Step</th>
              <th className="py-2 px-3">Resulting Carbon</th>
              <th className="py-2 px-3">Variance vs Baseline</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-industrial-850">
            {curveData.map((pt, i) => {
              const diff = Number((pt.carbon - 2.31).toFixed(2));
              return (
                <tr key={i} className={pt.isCurrent ? 'bg-orange-brand/10 font-semibold text-industrial-100' : 'text-industrial-300'}>
                  <td className="py-2 px-3 flex items-center gap-2">
                    {pt.label}
                    {pt.isCurrent && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-orange-brand text-white rounded font-mono uppercase">
                        Current
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-orange-400 font-bold">{pt.carbon.toFixed(2)} tCO2e/t</td>
                  <td className={`py-2 px-3 ${diff <= 0 ? 'text-status-success' : 'text-status-danger'}`}>
                    {diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)} t/t
                  </td>
                  <td className="py-2 px-3 text-industrial-400 text-[11px]">
                    {pt.carbon < 2.05 ? 'High Impact' : pt.carbon < 2.25 ? 'Moderate' : 'Standard'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-industrial-500 font-mono">
        <Info className="w-3.5 h-3.5" />
        <span>Illustrative sensitivity model. Contributor terms evaluated at ceteris paribus standard conditions.</span>
      </div>
    </div>
  );
};
