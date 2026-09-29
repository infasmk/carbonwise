export type GradeType = '304' | '304L' | '316' | '316L' | '430';

export interface CalculationStep {
  component: string;
  formula: string;
  value: number;
  unit: string;
  percentage: number;
}

export interface CarbonBreakdown {
  total_co2e_per_t: number;
  energy_co2e_per_t: number;
  alloy_co2e_per_t: number;
  scrap_route_co2e_per_t: number;
  energy_pct: number;
  alloy_pct: number;
  scrap_pct: number;
  methodology_note: string;
  is_demo: boolean;
  notice: string;
  calculation_steps: CalculationStep[];
}

export interface HeatInput {
  heat_id: string;
  grade: GradeType;
  target_tonnage: number;
  planning_date: string;
  scrap_mix_pct: number;
  scrap_type: string;
  scrap_quality: string;
  scrap_source: string;
  alloy_additions_pct: number;
  energy_source: string;
  electricity_intensity_mwh_per_t: number;
  grid_emission_factor: number;
  fuel_type: string;
  fuel_consumption_nm3_per_t: number;
  expected_yield_pct: number;
  eaf_tap_to_tap_min: number;
}

export interface FeasibilityCheckItem {
  name: string;
  passed: boolean;
  constraint_type: string;
  actual_value?: string;
  limit_value?: string;
  unit?: string;
  message: string;
}

export interface ScenarioItem {
  id: string;
  name: string;
  label: string;
  description: string;
  scrap_mix_pct: number;
  energy_source: string;
  electricity_intensity_mwh_per_t: number;
  grid_emission_factor: number;
  expected_yield_pct: number;
  carbon: CarbonBreakdown;
  is_feasible: boolean;
  status_label: 'FEASIBLE' | 'REJECTED';
  checks: FeasibilityCheckItem[];
  rejection_summary?: string;
  rejection_detail?: string;
  violated_constraints: string[];
  main_driver: string;
}

export interface DecisionResult {
  heat_id: string;
  planning_date: string;
  target_tonnage: number;
  current_plan: ScenarioItem;
  candidate_scenarios: ScenarioItem[];
  recommended_scenario_id: string;
  recommended_scenario_name: string;
  recommended_co2e_per_t: number;
  current_co2e_per_t: number;
  potential_avoidance_per_t: number;
  potential_avoidance_total_tonnes: number;
  decision_rationale: string;
  passed_constraints_summary: string[];
  rejected_scenarios_summary: {
    scenario_id: string;
    scenario_name: string;
    rejection_summary: string;
    carbon_intensity: string;
    why: string;
  }[];
  factor_version: string;
  accounting_boundary: string;
  data_confidence: string;
  disclaimer: string;
}

export interface EmissionFactor {
  factor_id: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  source: string;
  version: string;
  valid_from: string;
  valid_to?: string;
  accounting_boundary: string;
  status: 'ILLUSTRATIVE' | 'REFERENCE' | 'PENDING VALIDATION' | 'APPROVED';
  approved_by?: string;
  uncertainty_pct?: number;
  notes?: string;
}

export interface GradeConstraint {
  grade: string;
  element: string;
  min_pct: number;
  max_pct: number;
  unit: string;
  specification_standard: string;
  source: string;
}

export interface ProcessConstraint {
  process_unit: string;
  parameter: string;
  min_value?: number;
  max_value?: number;
  unit: string;
  source: string;
  version: string;
  operational_impact: string;
}

export interface BenchmarkMetric {
  id: string;
  metric: string;
  category: string;
  value: number;
  unit: string;
  reporting_period: string;
  source: string;
  status: string;
  boundary: string;
  notes?: string;
}

export interface ValidationHeatRecord {
  heat_id: string;
  date: string;
  grade: string;
  target_tonnage: number;
  actual_tonnage: number;
  scrap_pct: number;
  energy_intensity_mwh_per_t: number;
  yield_pct: number;
  predicted_co2e_per_t: number;
  actual_co2e_per_t: number;
  error_t: number;
  abs_error_t: number;
  error_pct: number;
  predicted_feasible: boolean;
  actual_success: boolean;
  agreement: boolean;
}

export interface ValidationSummary {
  has_data: boolean;
  dataset_name: string;
  total_heats_analyzed: number;
  grades_covered: string[];
  completeness_pct: number;
  mae_tco2e_per_t?: number;
  rmse_tco2e_per_t?: number;
  mean_bias_error?: number;
  median_error?: number;
  pct_within_tolerance_5pct?: number;
  feasibility_agreement_pct?: number;
  potential_avoided_co2e_total?: number;
  status_notice: string;
  methodology_citation: string;
}

export interface QualityIssue {
  row_number: number;
  heat_id: string;
  column: string;
  issue_type: string;
  severity: 'WARNING' | 'ERROR';
  message: string;
}

export interface ImportPreviewResult {
  total_rows: number;
  valid_rows: number;
  error_rows: number;
  warning_rows: number;
  quality_score_pct: number;
  detected_columns: string[];
  sample_preview: Record<string, any>[];
  issues: QualityIssue[];
  can_import: boolean;
  notice: string;
}

export interface DecisionRecord {
  decision_id: string;
  heat_id: string;
  planning_date: string;
  grade: string;
  target_tonnage: number;
  current_co2e_per_t: number;
  selected_scenario_id: string;
  selected_scenario_name: string;
  selected_co2e_per_t: number;
  potential_avoidance_per_t: number;
  potential_avoidance_total_tonnes: number;
  status: string;
  planner: string;
  factor_version: string;
  timestamp: string;
  rationale: string;
  accounting_boundary: string;
  data_confidence: string;
}
