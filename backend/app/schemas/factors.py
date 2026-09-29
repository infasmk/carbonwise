from pydantic import BaseModel, Field
from typing import Optional

class EmissionFactorSchema(BaseModel):
    factor_id: str
    name: str
    category: str  # Electricity, Fuel, Direct Reduction, Ferro-alloy, Consumable, Transport
    value: float
    unit: str
    source: str
    version: str
    valid_from: str
    valid_to: Optional[str] = None
    accounting_boundary: str  # Scope 1, Scope 2 location, Scope 2 market, Scope 3
    status: str  # ILLUSTRATIVE, REFERENCE, PENDING VALIDATION, APPROVED
    approved_by: Optional[str] = None
    uncertainty_pct: Optional[float] = None
    notes: Optional[str] = None

class GradeConstraintSchema(BaseModel):
    grade: str
    element: str  # Cr, Ni, C, Si, Mn, P, S, Mo, Cu
    min_pct: float
    max_pct: float
    unit: str = "% wt"
    specification_standard: str = "ASTM A240 / EN 10088-2"
    source: str = "Standard Metallurgical Specification (Illustrative)"

class ProcessConstraintSchema(BaseModel):
    process_unit: str  # EAF, AOD, Ladle Furnace, Continuous Caster
    parameter: str
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    unit: str
    source: str = "Illustrative demo constraint"
    version: str = "demo-v1"
    operational_impact: str
