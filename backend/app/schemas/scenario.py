from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.schemas.heat import HeatInput, CarbonBreakdown

class FeasibilityCheckItem(BaseModel):
    name: str
    passed: bool
    constraint_type: str
    actual_value: Optional[str] = None
    limit_value: Optional[str] = None
    unit: Optional[str] = None
    message: str

class ScenarioItem(BaseModel):
    id: str
    name: str
    label: str
    description: str
    
    # Core parameters
    scrap_mix_pct: float
    energy_source: str
    electricity_intensity_mwh_per_t: float
    grid_emission_factor: float
    expected_yield_pct: float
    alloy_contribution_per_t: float = 0.62
    scrap_route_contribution_per_t: float = 0.36
    
    # Calculated carbon
    carbon: CarbonBreakdown
    
    # Feasibility status
    is_feasible: bool
    status_label: str  # "FEASIBLE" or "REJECTED"
    checks: List[FeasibilityCheckItem]
    
    # Rejection explanation (if rejected)
    rejection_summary: Optional[str] = None
    rejection_detail: Optional[str] = None
    violated_constraints: List[str] = Field(default_factory=list)
    
    # Differentiator
    main_driver: str

class DecisionResult(BaseModel):
    heat_id: str
    planning_date: str
    target_tonnage: float
    
    # Scenarios evaluated
    current_plan: ScenarioItem
    candidate_scenarios: List[ScenarioItem]
    
    # Decision
    recommended_scenario_id: str
    recommended_scenario_name: str
    recommended_co2e_per_t: float
    current_co2e_per_t: float
    
    # Impact
    potential_avoidance_per_t: float
    potential_avoidance_total_tonnes: float
    
    # Explainable justification
    decision_rationale: str
    passed_constraints_summary: List[str]
    rejected_scenarios_summary: List[Dict[str, str]]
    
    # Metadata & Provenance
    factor_version: str = "CEA-v19.2"
    accounting_boundary: str = "Scope 1 + Scope 2 (Location-based)"
    data_confidence: str = "MEDIUM (Calibrate with approved plant factors)"
    disclaimer: str = "Modeled pre-production optimization under ISO 14064 accounting. Potential carbon avoidance, operational baseline."
