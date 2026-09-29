import React, { useState } from 'react';
import { ValidationHeatRecord } from '../../types';
import { Target, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface ScatterValidationChartProps {
  records: ValidationHeatRecord[];
}

export const ScatterValidationChart: React.FC<ScatterValidationChartProps> = ({ records }) => {
  const [hoveredPoint, setHoveredPoint] = useState<ValidationHeatRecord | null>(null);

  if (!records || records.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-industrial-800 rounded-lg bg-industrial-900/40">
        <Target className="w-10 h-10 text-industrial-600 mx-auto mb-2" />
        <p className="text-sm font-mono text-industrial-300">No validated records to plot.</p>
        <p className="text-xs text-industrial-500 mt-1">Import approved production data to render model accuracy scatter.</p>
      </div>
    );
  }

  // Calculate axis bounds with 10% padding
  const allPredicted = records.map(r => r.predicted_co2e_per_t);
  const allActual = records.map(r => r.actual_co2e_per_t);
  const minVal = Math.min(...allPredicted, ...allActual) - 0.15;
  const maxVal = Math.max(...allPredicted, ...allActual) + 0.15;
  const range = maxVal - minVal || 1;

  // Viewbox coordinates
  const width = 600;
  const height = 400;
  const padLeft = 60;
  const padBottom = 50;
  const padRight = 30;
  const padTop = 30;

  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const scaleX = (val: number) => padLeft + ((val - minVal) / range) * plotWidth;
  const scaleY = (val: number) => padTop + (1 - (val - minVal) / range) * plotHeight;

  return (
    <div className="industrial-card p-5 border border-industrial-800 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-industrial-800 gap-2">
        <div>
          <h3 className="font-mono text-sm font-semibold text-industrial-100 flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-brand" />
            <span>PREDICTED VS ACTUAL SCATTER PLOT</span>
          </h3>
          <p className="text-xs text-industrial-400 mt-0.5">
            Pre-production model estimate vs certified post-casting actual outcome ({records.length} heats).
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-industrial-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-orange-400/80 inline-block" />
            <span>1:1 Parity Line (Ideal)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-brand inline-block" />
            <span>Heat Record</span>
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        {/* SVG Scatter Chart */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[420px] select-none">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const val = minVal + ratio * range;
              const y = scaleY(val);
              const x = scaleX(val);
              return (
                <g key={i}>
                  {/* Horizontal grid */}
                  <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#272c35" strokeDasharray="3 3" />
                  <text x={padLeft - 8} y={y + 4} fill="#8b96a5" fontSize="10" fontFamily="monospace" textAnchor="end">
                    {val.toFixed(2)}
                  </text>
                  {/* Vertical grid */}
                  <line x1={x} y1={padTop} x2={x} y2={height - padBottom} stroke="#272c35" strokeDasharray="3 3" />
                  <text x={x} y={height - padBottom + 16} fill="#8b96a5" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    {val.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Diagonal Reference Line (Predicted = Actual) */}
            <line
              x1={scaleX(minVal)}
              y1={scaleY(minVal)}
              x2={scaleX(maxVal)}
              y2={scaleY(maxVal)}
              stroke="#f76707"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.85"
            />

            {/* Scatter Points */}
            {records.map((r, i) => {
              const cx = scaleX(r.predicted_co2e_per_t);
              const cy = scaleY(r.actual_co2e_per_t);
              const isHovered = hoveredPoint?.heat_id === r.heat_id;
              const hasHighError = r.error_pct > 5.0;

              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 4}
                  fill={hasHighError ? '#fa5252' : '#e8590c'}
                  stroke={isHovered ? '#ffffff' : '#0c0e11'}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all duration-150 hover:opacity-100"
                  opacity={isHovered ? 1 : 0.8}
                  onMouseEnter={() => setHoveredPoint(r)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            })}

            {/* Axis Titles */}
            <text
              x={padLeft + plotWidth / 2}
              y={height - 8}
              fill="#b8c0cc"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="600"
              textAnchor="middle"
            >
              PREDICTED EMISSIONS (tCO2e / finished tonne) →
            </text>
            <text
              transform={`rotate(-90) translate(-${padTop + plotHeight / 2}, 16)`}
              fill="#b8c0cc"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="600"
              textAnchor="middle"
            >
              ACTUAL OBSERVED (tCO2e / tonne) →
            </text>
          </svg>
        </div>

        {/* Hover Inspection Card (As specified in Section 26) */}
        {hoveredPoint ? (
          <div className="mt-3 p-3 rounded bg-industrial-900 border border-orange-brand/50 text-xs font-mono grid grid-cols-2 sm:grid-cols-6 gap-2">
            <div>
              <span className="text-industrial-500 block text-[10px]">HEAT ID</span>
              <span className="text-industrial-100 font-bold">{hoveredPoint.heat_id}</span>
            </div>
            <div>
              <span className="text-industrial-500 block text-[10px]">GRADE</span>
              <span className="text-orange-400 font-bold">{hoveredPoint.grade}</span>
            </div>
            <div>
              <span className="text-industrial-500 block text-[10px]">PREDICTED</span>
              <span className="text-industrial-200">{hoveredPoint.predicted_co2e_per_t.toFixed(3)} t/t</span>
            </div>
            <div>
              <span className="text-industrial-500 block text-[10px]">ACTUAL</span>
              <span className="text-industrial-200">{hoveredPoint.actual_co2e_per_t.toFixed(3)} t/t</span>
            </div>
            <div>
              <span className="text-industrial-500 block text-[10px]">VARIANCE (ERROR)</span>
              <span className={hoveredPoint.error_pct <= 5.0 ? 'text-status-success font-semibold' : 'text-status-danger font-semibold'}>
                {hoveredPoint.error_t > 0 ? '+' : ''}{hoveredPoint.error_t.toFixed(3)} ({hoveredPoint.error_pct}%)
              </span>
            </div>
            <div>
              <span className="text-industrial-500 block text-[10px]">DATE</span>
              <span className="text-industrial-400">{hoveredPoint.date}</span>
            </div>
          </div>
        ) : (
          <div className="mt-3 p-2.5 rounded bg-industrial-900/50 border border-industrial-800 text-[11px] font-mono text-industrial-400 text-center">
            Hover over any scatter point to inspect Heat ID, Grade, Predicted, Actual, and Error metrics.
          </div>
        )}
      </div>
    </div>
  );
};
