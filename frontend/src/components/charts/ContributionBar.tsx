import React from 'react';
import { CarbonBreakdown } from '../../types';

interface ContributionBarProps {
  carbon: CarbonBreakdown;
  compact?: boolean;
}

export const ContributionBar: React.FC<ContributionBarProps> = ({ carbon, compact = false }) => {
  return (
    <div className="space-y-4">
      {/* Stacked visualization bar */}
      <div className="w-full h-4 bg-industrial-900 rounded-full overflow-hidden flex border border-industrial-800">
        <div 
          style={{ width: `${carbon.energy_pct}%` }} 
          className="bg-orange-500 hover:brightness-110 transition-all duration-300 relative group cursor-pointer"
          title={`Energy: ${carbon.energy_co2e_per_t} tCO2e/t (${carbon.energy_pct}%)`}
        />
        <div 
          style={{ width: `${carbon.alloy_pct}%` }} 
          className="bg-amber-600 hover:brightness-110 transition-all duration-300 relative group cursor-pointer"
          title={`Alloy: ${carbon.alloy_co2e_per_t} tCO2e/t (${carbon.alloy_pct}%)`}
        />
        <div 
          style={{ width: `${carbon.scrap_pct}%` }} 
          className="bg-industrial-500 hover:brightness-110 transition-all duration-300 relative group cursor-pointer"
          title={`Scrap Route: ${carbon.scrap_route_co2e_per_t} tCO2e/t (${carbon.scrap_pct}%)`}
        />
      </div>

      {/* Detailed Horizontal Contribution Bars (as specified in Section 10) */}
      <div className="space-y-3 pt-1">
        {/* Energy Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1 font-mono">
            <span className="text-industrial-300 flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 inline-block" />
              ENERGY (Electricity & Fuel)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-orange-400 font-semibold">{carbon.energy_co2e_per_t.toFixed(2)} tCO2e/t</span>
              <span className="text-industrial-500">({carbon.energy_pct}%)</span>
            </div>
          </div>
          <div className="w-full bg-industrial-900 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-orange-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${carbon.energy_pct}%` }} 
            />
          </div>
        </div>

        {/* Alloy Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1 font-mono">
            <span className="text-industrial-300 flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-600 inline-block" />
              ALLOY (FeCr, FeNi, Additions)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-semibold">{carbon.alloy_co2e_per_t.toFixed(2)} tCO2e/t</span>
              <span className="text-industrial-500">({carbon.alloy_pct}%)</span>
            </div>
          </div>
          <div className="w-full bg-industrial-900 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-amber-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${carbon.alloy_pct}%` }} 
            />
          </div>
        </div>

        {/* Scrap Route Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1 font-mono">
            <span className="text-industrial-300 flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-industrial-500 inline-block" />
              SCRAP ROUTE (Prep & Handling)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-industrial-300 font-semibold">{carbon.scrap_route_co2e_per_t.toFixed(2)} tCO2e/t</span>
              <span className="text-industrial-500">({carbon.scrap_pct}%)</span>
            </div>
          </div>
          <div className="w-full bg-industrial-900 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-industrial-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${carbon.scrap_pct}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
