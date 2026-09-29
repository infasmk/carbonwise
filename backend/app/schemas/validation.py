from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ValidationHeatRecord(BaseModel):
    heat_id: str
    date: str
    grade: str
    target_tonnage: float
    actual_tonnage: float
    scrap_pct: float
    energy_intensity_mwh_per_t: float
    yield_pct: float
    predicted_co2e_per_t: float
    actual_co2e_per_t: float
    error_t: float
    abs_error_t: float
    error_pct: float
    predicted_feasible: bool
    actual_success: bool
    agreement: bool

class ValidationSummary(BaseModel):
    has_data: bool
    dataset_name: str
    total_heats_analyzed: int
    grades_covered: List[str]
    completeness_pct: float
    mae_tco2e_per_t: Optional[float] = None
    rmse_tco2e_per_t: Optional[float] = None
    mean_bias_error: Optional[float] = None
    median_error: Optional[float] = None
    pct_within_tolerance_5pct: Optional[float] = None
    feasibility_agreement_pct: Optional[float] = None
    potential_avoided_co2e_total: Optional[float] = None
    status_notice: str
    methodology_citation: str
