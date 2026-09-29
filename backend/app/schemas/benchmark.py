from pydantic import BaseModel
from typing import Optional

class BenchmarkMetric(BaseModel):
    id: str
    metric: str
    category: str  # Emissions, Energy, Circularity, Renewable
    value: float
    unit: str
    reporting_period: str
    source: str
    status: str = "Public benchmark / reference data"
    boundary: str
    notes: Optional[str] = None
