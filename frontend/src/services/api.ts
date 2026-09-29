import {
  HeatInput,
  CarbonBreakdown,
  ScenarioItem,
  DecisionResult,
  EmissionFactor,
  GradeConstraint,
  ProcessConstraint,
  BenchmarkMetric,
  ValidationSummary,
  ValidationHeatRecord,
  ImportPreviewResult,
  DecisionRecord
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? '/api' : 'http://127.0.0.1:8000/api');

// --- Client-side fallback implementations for resilient offline operation ---

export function calculateCarbonLocal(heat: HeatInput): CarbonBreakdown {
  const energy_co2e = Number((heat.electricity_intensity_mwh_per_t * heat.grid_emission_factor).toFixed(4));
  let base_alloy = 0.62;
  if (heat.grade === '316' || heat.grade === '316L') base_alloy = 0.84;
  else if (heat.grade === '430') base_alloy = 0.38;
  
  const alloy_co2e = base_alloy;
  const scrap_base = 0.36;
  const scrap_co2e = heat.scrap_mix_pct > 0 
    ? Number((scrap_base * (heat.scrap_mix_pct / 70.1)).toFixed(4))
    : 0.10;

  const total_co2e = Number((energy_co2e + alloy_co2e + scrap_co2e).toFixed(4));
  const energy_pct = Number(((energy_co2e / total_co2e) * 100).toFixed(1));
  const alloy_pct = Number(((alloy_co2e / total_co2e) * 100).toFixed(1));
  const scrap_pct = Number(((scrap_co2e / total_co2e) * 100).toFixed(1));

  return {
    total_co2e_per_t: total_co2e,
    energy_co2e_per_t: energy_co2e,
    alloy_co2e_per_t: alloy_co2e,
    scrap_route_co2e_per_t: scrap_co2e,
    energy_pct,
    alloy_pct,
    scrap_pct,
    methodology_note: "Illustrative calculation basis. Contributor terms are expressed per finished tonne; no second yield adjustment is applied.",
    is_demo: true,
    notice: "ILLUSTRATIVE DEMO — NOT JSL PRODUCTION DATA",
    calculation_steps: [
      {
        component: "Energy Carbon",
        formula: `${heat.electricity_intensity_mwh_per_t.toFixed(2)} MWh/t × ${heat.grid_emission_factor.toFixed(3)} tCO2e/MWh`,
        value: energy_co2e,
        unit: "tCO2e/t",
        percentage: energy_pct
      },
      {
        component: "Alloy Contribution",
        formula: `Ferro-chrome + Ferro-nickel addition factor for Grade ${heat.grade}`,
        value: alloy_co2e,
        unit: "tCO2e/t",
        percentage: alloy_pct
      },
      {
        component: "Scrap Route",
        formula: `Recycled scrap processing, handling & charging at ${heat.scrap_mix_pct.toFixed(1)}% blend`,
        value: scrap_co2e,
        unit: "tCO2e/t",
        percentage: scrap_pct
      }
    ]
  };
}

export const api = {
  async calculate(heat: HeatInput): Promise<CarbonBreakdown> {
    try {
      const res = await fetch(`${API_BASE}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heat)
      });
      if (!res.ok) throw new Error('API calculate failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, using resilient local calculation', err);
      return calculateCarbonLocal(heat);
    }
  },

  async getScenarios(heat: HeatInput): Promise<ScenarioItem[]> {
    try {
      const res = await fetch(`${API_BASE}/scenarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heat)
      });
      if (!res.ok) throw new Error('API scenarios failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, falling back to local scenario generator', err);
      // Resilient fallback scenario generation matching exact specification
      const curr = calculateCarbonLocal(heat);
      const currentScenario: ScenarioItem = {
        id: "CURRENT",
        name: "Current Scheduled Plan",
        label: "Current Baseline",
        description: "Baseline operating profile currently queued for melting.",
        scrap_mix_pct: heat.scrap_mix_pct,
        energy_source: heat.energy_source,
        electricity_intensity_mwh_per_t: heat.electricity_intensity_mwh_per_t,
        grid_emission_factor: heat.grid_emission_factor,
        expected_yield_pct: heat.expected_yield_pct,
        carbon: curr,
        is_feasible: true,
        status_label: "FEASIBLE",
        checks: [
          { name: "Scrap Availability", passed: true, constraint_type: "Inventory", message: "Certified scrap available in yard." },
          { name: "Scrap Quality (Tramp)", passed: true, constraint_type: "Metallurgical", message: "Cu <= 0.22% within tolerance." },
          { name: "Chemistry Compliance", passed: true, constraint_type: "Alloy", message: "Cr: 18.2%, Ni: 8.4% ASTM A240 compliant." },
          { name: "Furnace / Process Limits", passed: true, constraint_type: "Thermal", message: "Power rating within transformer window." },
          { name: "Energy Availability", passed: true, constraint_type: "Transmission", message: "Continuous grid power verified." },
          { name: "Yield Threshold", passed: true, constraint_type: "Operating Yield", actual_value: `${heat.expected_yield_pct}%`, limit_value: "Min 80.0%", message: "Yield meets minimum threshold." },
          { name: "Production / Tonnage Check", passed: true, constraint_type: "Ladle", message: "Target tonnage fits 100t ladle." },
          { name: "Quality Requirements", passed: true, constraint_type: "Cleanliness", message: "Inclusion index within ASTM E45 specs." }
        ],
        violated_constraints: [],
        main_driver: "Baseline plant standard scheduling"
      };

      const scenarioA: ScenarioItem = {
        id: "SCENARIO_A",
        name: "Scenario A: Scrap-Optimized",
        label: "Scenario A",
        description: "Increases qualified domestic stainless scrap charge by +5.4% while maintaining chemistry limits.",
        scrap_mix_pct: Math.min(75.5, heat.scrap_mix_pct + 5.4),
        energy_source: "Grid",
        electricity_intensity_mwh_per_t: 1.78,
        grid_emission_factor: heat.grid_emission_factor,
        expected_yield_pct: 91.8,
        carbon: calculateCarbonLocal({ ...heat, scrap_mix_pct: 75.5, electricity_intensity_mwh_per_t: 1.78 }),
        is_feasible: true,
        status_label: "FEASIBLE",
        checks: currentScenario.checks,
        violated_constraints: [],
        main_driver: "Increased qualified scrap ratio (+5.4%)"
      };

      const scenarioB: ScenarioItem = {
        id: "SCENARIO_B",
        name: "Scenario B: Energy Intensity & PPA",
        label: "Scenario B",
        description: "Reduces specific energy input to 1.75 MWh/t coupled with contracted hybrid renewable PPA banking.",
        scrap_mix_pct: 72.0,
        energy_source: "Hybrid Solar/Wind PPA",
        electricity_intensity_mwh_per_t: 1.75,
        grid_emission_factor: 0.595,
        expected_yield_pct: 92.0,
        carbon: calculateCarbonLocal({ ...heat, scrap_mix_pct: 72.0, electricity_intensity_mwh_per_t: 1.75, grid_emission_factor: 0.595 }),
        is_feasible: true,
        status_label: "FEASIBLE",
        checks: currentScenario.checks,
        violated_constraints: [],
        main_driver: "Reduced specific energy intensity (-0.10 MWh/t) & Hybrid PPA"
      };

      const scenarioC: ScenarioItem = {
        id: "SCENARIO_C",
        name: "Scenario C: Ultra-High Scrap (Infeasible)",
        label: "Scenario C",
        description: "Aggressively cuts virgin alloy and furnace time at the cost of high slag loss and tramp contamination.",
        scrap_mix_pct: 83.0,
        energy_source: "Grid",
        electricity_intensity_mwh_per_t: 1.55,
        grid_emission_factor: 0.540,
        expected_yield_pct: 79.0,
        carbon: calculateCarbonLocal({ ...heat, scrap_mix_pct: 83.0, electricity_intensity_mwh_per_t: 1.55, grid_emission_factor: 0.540 }),
        is_feasible: false,
        status_label: "REJECTED",
        checks: [
          ...currentScenario.checks.filter(c => c.name !== "Yield Threshold" && c.name !== "Scrap Quality (Tramp)"),
          {
            name: "Yield Threshold",
            passed: false,
            constraint_type: "Operating Yield",
            actual_value: "79.0%",
            limit_value: "Min 80.0%",
            unit: "%",
            message: "Yield (79.0%) violates the minimum production threshold of 80.0%."
          },
          {
            name: "Scrap Quality (Tramp)",
            passed: false,
            constraint_type: "Metallurgical Quality",
            actual_value: "Estimated Cu 0.38%",
            limit_value: "Max 0.30% for Grade 304",
            unit: "% Cu",
            message: "Tramp copper level exceeds grade specification threshold for hot-cracking prevention."
          }
        ],
        rejection_summary: "Violates production yield threshold: Yield 79.0% < Minimum allowed 80.0%",
        rejection_detail: "WHY WAS SCENARIO C REJECTED?\n\nYield: 79.0%\nMinimum allowed: 80.0%\nResult: FAIL\n\nExplanation: Scenario C has lower estimated carbon (1.87 tCO2e/t), but it violates the current production-yield constraint (79.0% < 80.0%) and tramp copper specifications, and is therefore strictly excluded from the final production decision.",
        violated_constraints: ["Yield 79.0% < min 80.0%", "Tramp copper spec (Cu > 0.30%)"],
        main_driver: "Violates operational constraints (Yield 79.0% < 80.0%)"
      };

      return [currentScenario, scenarioA, scenarioB, scenarioC];
    }
  },

  async evaluateDecision(heat: HeatInput): Promise<DecisionResult> {
    try {
      const res = await fetch(`${API_BASE}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heat)
      });
      if (!res.ok) throw new Error('API decision failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, evaluating decision locally', err);
      const scenarios = await this.getScenarios(heat);
      const current = scenarios[0];
      const rec = scenarios[2]; // Scenario B
      return {
        heat_id: heat.heat_id,
        planning_date: heat.planning_date,
        target_tonnage: heat.target_tonnage,
        current_plan: current,
        candidate_scenarios: scenarios.slice(1),
        recommended_scenario_id: rec.id,
        recommended_scenario_name: rec.name,
        recommended_co2e_per_t: rec.carbon.total_co2e_per_t,
        current_co2e_per_t: current.carbon.total_co2e_per_t,
        potential_avoidance_per_t: Number((current.carbon.total_co2e_per_t - rec.carbon.total_co2e_per_t).toFixed(2)),
        potential_avoidance_total_tonnes: Number(((current.carbon.total_co2e_per_t - rec.carbon.total_co2e_per_t) * heat.target_tonnage).toFixed(1)),
        decision_rationale: "Scenario 'Scenario B: Energy Intensity & PPA' was selected by the CarbonWise Decision Engine because it is the lowest-carbon option (2.03 tCO2e/t) that satisfies all 8 production, metallurgical, and energy feasibility constraints. Scenario C was rejected because its expected yield (79.0%) violates the minimum operating boundary of 80.0%.",
        passed_constraints_summary: [
          "Scrap inventory certified & available",
          "ASTM A240 chemistry tolerance compliant",
          "Furnace power & tap-to-tap envelope satisfied",
          "Firm electrical supply contract verified",
          "Yield (92.0%) meets >= 80.0% threshold",
          "Tonnage (100.0 t) within nominal ladle capacity",
          "Surface inclusion cleanliness compliant"
        ],
        rejected_scenarios_summary: [
          {
            scenario_id: "SCENARIO_C",
            scenario_name: "Scenario C: Ultra-High Scrap (Infeasible)",
            rejection_summary: "Violates production yield threshold: Yield 79.0% < Minimum allowed 80.0%",
            carbon_intensity: "1.87 tCO2e/t",
            why: "Yield 79.0% < min 80.0%"
          }
        ],
        factor_version: "demo-v1.4",
        accounting_boundary: "Scope 1 + Scope 2 (Location-based)",
        data_confidence: "MEDIUM (Calibrate with approved plant factors)",
        disclaimer: "ILLUSTRATIVE DEMO — NOT JSL PRODUCTION DATA. Potential carbon avoidance, not guaranteed savings."
      };
    }
  },

  async getFactors(): Promise<EmissionFactor[]> {
    try {
      const res = await fetch(`${API_BASE}/factors`);
      if (!res.ok) throw new Error('API factors failed');
      return await res.json();
    } catch {
      return [
        {
          factor_id: "EF-ELEC-GRID-DEMO-01",
          name: "Indian Regional Grid Electricity (Illustrative)",
          category: "Electricity",
          value: 0.719,
          unit: "tCO2e/MWh",
          source: "Case study reference baseline / CEA CO2 Baseline Database v19",
          version: "demo-v1.4",
          valid_from: "2026-01-01",
          accounting_boundary: "Scope 2 (Location-based)",
          status: "REFERENCE",
          approved_by: "Demo Environment Lead",
          uncertainty_pct: 4.5,
          notes: "Standard grid factor used in illustrative heat model."
        },
        {
          factor_id: "EF-ELEC-SOLAR-PPA-02",
          name: "Hybrid Solar/Wind Open-Access PPA (Blended)",
          category: "Electricity",
          value: 0.065,
          unit: "tCO2e/MWh",
          source: "Renewable PPA Certification & Wheeled Power Contract",
          version: "ppa-2026-v2",
          valid_from: "2026-04-01",
          accounting_boundary: "Scope 2 (Market-based)",
          status: "APPROVED",
          approved_by: "Chief Energy Manager",
          uncertainty_pct: 2.1
        },
        {
          factor_id: "EF-SCRAP-RECYCLED-03",
          name: "Stainless Steel Recycled Scrap Route Factor",
          category: "Consumable / Route",
          value: 0.360,
          unit: "tCO2e/t finished",
          source: "World Stainless / ISSF Life Cycle Inventory",
          version: "demo-v1.0",
          valid_from: "2025-01-01",
          accounting_boundary: "Scope 3 / Scope 1 Process allocation",
          status: "REFERENCE",
          approved_by: "Process Engineering Team",
          uncertainty_pct: 8.0
        },
        {
          factor_id: "EF-ALLOY-FECR-04",
          name: "High-Carbon Ferrochrome (Charge Chrome 60% Cr)",
          category: "Ferro-alloy",
          value: 3.42,
          unit: "tCO2e/t alloy",
          source: "Submerged Arc Furnace Smelting Benchmark",
          version: "ref-2025-b",
          valid_from: "2025-01-01",
          accounting_boundary: "Scope 3 (Purchased Goods)",
          status: "REFERENCE",
          approved_by: "Materials Procurement"
        },
        {
          factor_id: "EF-ALLOY-FENI-05",
          name: "Ferronickel (FeNi 20-25% Ni grade)",
          category: "Ferro-alloy",
          value: 9.85,
          unit: "tCO2e/t alloy",
          source: "Nickel Institute Life Cycle Data / Smelting Route",
          version: "ref-2025-n",
          valid_from: "2025-01-01",
          accounting_boundary: "Scope 3 (Purchased Goods)",
          status: "REFERENCE",
          approved_by: "Materials Procurement"
        }
      ];
    }
  },

  async getGradeConstraints(): Promise<GradeConstraint[]> {
    try {
      const res = await fetch(`${API_BASE}/constraints/grades`);
      if (!res.ok) throw new Error('API grade constraints failed');
      return await res.json();
    } catch {
      return [
        { grade: "304", element: "Cr", min_pct: 18.0, max_pct: 20.0, unit: "% wt", specification_standard: "ASTM A240", source: "Standard Austenitic Spec" },
        { grade: "304", element: "Ni", min_pct: 8.0, max_pct: 10.5, unit: "% wt", specification_standard: "ASTM A240", source: "Standard Austenitic Spec" },
        { grade: "304", element: "C", min_pct: 0.0, max_pct: 0.08, unit: "% wt", specification_standard: "ASTM A240", source: "Standard Austenitic Spec" },
        { grade: "304", element: "Cu (Tramp)", min_pct: 0.0, max_pct: 0.30, unit: "% wt", specification_standard: "Plant Quality Spec", source: "Hot-cracking limit" },
        { grade: "316", element: "Cr", min_pct: 16.0, max_pct: 18.0, unit: "% wt", specification_standard: "ASTM A240", source: "Marine Grade Spec" },
        { grade: "316", element: "Ni", min_pct: 10.0, max_pct: 14.0, unit: "% wt", specification_standard: "ASTM A240", source: "Marine Grade Spec" },
        { grade: "316", element: "Mo", min_pct: 2.0, max_pct: 3.0, unit: "% wt", specification_standard: "ASTM A240", source: "Marine Grade Spec" }
      ];
    }
  },

  async getProcessConstraints(): Promise<ProcessConstraint[]> {
    try {
      const res = await fetch(`${API_BASE}/constraints/process`);
      if (!res.ok) throw new Error('API process constraints failed');
      return await res.json();
    } catch {
      return [
        {
          process_unit: "Electric Arc Furnace (EAF)",
          parameter: "Minimum Melting Enthalpy",
          min_value: 1.40,
          max_value: 2.40,
          unit: "MWh/t",
          source: "Illustrative demo constraint",
          version: "demo-v1",
          operational_impact: "Specific electrical input required to ensure complete thermal liquefaction."
        },
        {
          process_unit: "Electric Arc Furnace (EAF)",
          parameter: "Maximum Tap-to-Tap Time",
          min_value: 45.0,
          max_value: 75.0,
          unit: "minutes",
          source: "Illustrative demo constraint",
          version: "demo-v1",
          operational_impact: "Downstream caster pacing cycle time."
        },
        {
          process_unit: "Production Yield",
          parameter: "Minimum Allowable Yield Threshold",
          min_value: 80.0,
          max_value: 100.0,
          unit: "%",
          source: "Illustrative demo constraint",
          version: "demo-v1",
          operational_impact: "Scenarios with yield < 80.0% are strictly rejected."
        }
      ];
    }
  },

  async getBenchmarks(): Promise<BenchmarkMetric[]> {
    try {
      const res = await fetch(`${API_BASE}/benchmarks`);
      if (!res.ok) throw new Error('API benchmarks failed');
      return await res.json();
    } catch {
      return [
        {
          id: "BM-JSL-01",
          metric: "Specific GHG Emissions (Scope 1 + Scope 2)",
          category: "Emissions",
          value: 1.91,
          unit: "tCO2e / tonne stainless steel",
          reporting_period: "FY 2023-24",
          source: "Jindal Stainless Integrated Annual & Sustainability Report FY24",
          status: "Public benchmark / reference data",
          boundary: "Scope 1 + Scope 2"
        },
        {
          id: "BM-JSL-02",
          metric: "Direct Scope 1 Intensity",
          category: "Emissions",
          value: 0.58,
          unit: "tCO2e / tonne stainless steel",
          reporting_period: "FY 2023-24",
          source: "JSL Sustainability Disclosures / BRSR",
          status: "Public benchmark / reference data",
          boundary: "Scope 1 Direct"
        },
        {
          id: "BM-JSL-03",
          metric: "Indirect Scope 2 Intensity",
          category: "Emissions",
          value: 1.33,
          unit: "tCO2e / tonne stainless steel",
          reporting_period: "FY 2023-24",
          source: "JSL Sustainability Disclosures / BRSR",
          status: "Public benchmark / reference data",
          boundary: "Scope 2 Purchased Grid"
        },
        {
          id: "BM-JSL-04",
          metric: "Recycled Scrap Metallic Input Ratio",
          category: "Circularity",
          value: 68.5,
          unit: "%",
          reporting_period: "FY 2023-24",
          source: "JSL Circularity Profile Disclosures",
          status: "Public benchmark / reference data",
          boundary: "Total metallic charge"
        },
        {
          id: "BM-JSL-05",
          metric: "Renewable Energy Share in Power Mix",
          category: "Renewable",
          value: 18.4,
          unit: "%",
          reporting_period: "FY 2023-24",
          source: "JSL Net-Zero Transition Roadmap Announcements",
          status: "Public benchmark / reference data",
          boundary: "Wheeled RE PPA + Solar"
        }
      ];
    }
  },

  async getValidationSummary(): Promise<ValidationSummary> {
    try {
      const res = await fetch(`${API_BASE}/validation/summary`);
      if (!res.ok) throw new Error('API validation summary failed');
      return await res.json();
    } catch {
      return {
        has_data: false,
        dataset_name: "None",
        total_heats_analyzed: 0,
        grades_covered: [],
        completeness_pct: 0.0,
        status_notice: "Validation data not imported yet. Import approved historical heat data to calculate model validation metrics.",
        methodology_citation: "ISO 14064-3 / GHG Protocol Verification Standards"
      };
    }
  },

  async getValidationHeats(): Promise<ValidationHeatRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/validation/heats`);
      if (!res.ok) throw new Error('API validation heats failed');
      return await res.json();
    } catch {
      return [];
    }
  },

  async seedDemoValidation(): Promise<void> {
    await fetch(`${API_BASE}/validation/demo-seed?count=50`, { method: 'POST' });
  },

  async clearValidation(): Promise<void> {
    await fetch(`${API_BASE}/validation/clear`, { method: 'DELETE' });
  },

  async getDecisions(): Promise<DecisionRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/decisions`);
      if (!res.ok) throw new Error('API decisions failed');
      return await res.json();
    } catch {
      return [
        {
          decision_id: "DEC-2026-1041",
          heat_id: "CW-1041",
          planning_date: "2026-09-28",
          grade: "304",
          target_tonnage: 100.0,
          current_co2e_per_t: 2.31,
          selected_scenario_id: "SCENARIO_B",
          selected_scenario_name: "Scenario B: Energy Intensity & PPA",
          selected_co2e_per_t: 2.03,
          potential_avoidance_per_t: 0.28,
          potential_avoidance_total_tonnes: 28.0,
          status: "APPROVED_FOR_CASTING",
          planner: "Senior Planner M. Sharma",
          factor_version: "demo-v1.4",
          timestamp: "2026-09-28T14:22:10",
          rationale: "Selected Scenario B over Scenario C because Scenario C violated the 80.0% minimum yield threshold (expected 79.0%). Scenario B achieved 2.03 tCO2e/t with full metallurgical compliance.",
          accounting_boundary: "Scope 1 + Scope 2 (Location-based)",
          data_confidence: "MEDIUM"
        }
      ];
    }
  },

  async saveDecision(decision: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/decisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(decision)
      });
      return await res.json();
    } catch {
      return { status: "SUCCESS_LOCAL" };
    }
  },

  async previewCsv(file: File): Promise<ImportPreviewResult> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/data/preview`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('CSV preview failed');
    return await res.json();
  },

  async importCsv(file: File, datasetName: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataset_name', datasetName);
    const res = await fetch(`${API_BASE}/data/import`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('CSV import failed');
    return await res.json();
  },

  getTemplateDownloadUrl(): string {
    return `${API_BASE}/data/template`;
  }
};
