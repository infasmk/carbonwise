from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class CalculationStep(BaseModel):
    component: str
    formula: str
    value: float
    unit: str = "tCO2e/t"
    percentage: float

class HeatInput(BaseModel):
    heat_id: Optional[str] = Field(default="CW-304-892", description="Heat identification tag")
    grade: str = Field(default="304", description="Stainless steel grade (e.g., 304, 316, 430)")
    target_tonnage: float = Field(default=100.0, description="Target heat tonnage in metric tonnes", ge=10.0, le=500.0)
    planning_date: Optional[str] = Field(default="2026-09-29")
    
    # Material inputs
    scrap_mix_pct: float = Field(default=70.1, description="Scrap blend percentage", ge=0.0, le=100.0)
    scrap_type: str = Field(default="SS 304 Heavy Recycled Scrap", description="Type of scrap charged")
    scrap_quality: str = Field(default="Grade A (Low Tramp Cu < 0.25%)", description="Scrap sorting and quality classification")
    scrap_source: str = Field(default="Certified Domestic Yard", description="Scrap supplier provenance")
    alloy_additions_pct: float = Field(default=4.2, description="Ferro-alloy addition percentage")
    
    # Energy inputs
    energy_source: str = Field(default="Grid", description="Primary power source (Grid, Solar PPA, Hybrid Captive)")
    electricity_intensity_mwh_per_t: float = Field(default=1.85, description="Specific electricity consumption in MWh/t", ge=0.5, le=5.0)
    grid_emission_factor: float = Field(default=0.719, description="Grid emission factor in tCO2e/MWh", ge=0.0, le=1.5)
    fuel_type: str = Field(default="Natural Gas (Ladle Preheat)", description="Secondary thermal fuel")
    fuel_consumption_nm3_per_t: float = Field(default=12.0, description="Fuel consumption per tonne")
    
    # Production constraints
    expected_yield_pct: float = Field(default=92.4, description="Expected liquid steel / finished yield percentage", ge=50.0, le=100.0)
    eaf_tap_to_tap_min: float = Field(default=68.0, description="Furnace tap-to-tap cycle time in minutes")

class CarbonBreakdown(BaseModel):
    total_co2e_per_t: float
    energy_co2e_per_t: float
    alloy_co2e_per_t: float
    scrap_route_co2e_per_t: float
    
    energy_pct: float
    alloy_pct: float
    scrap_pct: float
    
    methodology_note: str = (
        "Operational pre-melt calculation basis. Contributor terms are expressed per finished tonne; "
        "no second yield adjustment is applied."
    )
    is_demo: bool = False
    notice: str = "OPERATIONAL PRE-MELT INTELLIGENCE — CALIBRATED BASELINE"
    calculation_steps: List[CalculationStep]
