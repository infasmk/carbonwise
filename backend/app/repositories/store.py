from typing import List, Dict, Any, Optional
from datetime import datetime
from app.schemas.factors import EmissionFactorSchema, GradeConstraintSchema, ProcessConstraintSchema
from app.schemas.benchmark import BenchmarkMetric
from app.schemas.validation import ValidationHeatRecord
from app.schemas.scenario import DecisionResult

class InMemoryStore:
    """
    In-memory state and repository store for CarbonWise.
    Can be backed by SQLite/PostgreSQL in production.
    """
    def __init__(self):
        self.factors: List[EmissionFactorSchema] = []
        self.grade_constraints: List[GradeConstraintSchema] = []
        self.process_constraints: List[ProcessConstraintSchema] = []
        self.benchmarks: List[BenchmarkMetric] = []
        self.validation_heats: List[ValidationHeatRecord] = []
        self.decisions: List[Dict[str, Any]] = []
        self.audit_logs: List[Dict[str, Any]] = []
        
        self.seed_defaults()

    def seed_defaults(self):
        # 1. Emission Factor Registry
        self.factors = [
            EmissionFactorSchema(
                factor_id="EF-ELEC-GRID-DEMO-01",
                name="Indian Regional Grid Electricity (Illustrative)",
                category="Electricity",
                value=0.719,
                unit="tCO2e/MWh",
                source="Case study reference baseline / CEA CO2 Baseline Database v19",
                version="demo-v1.4",
                valid_from="2026-01-01",
                valid_to="2026-12-31",
                accounting_boundary="Scope 2 (Location-based)",
                status="REFERENCE",
                approved_by="Demo Environment Lead",
                uncertainty_pct=4.5,
                notes="Standard grid factor used in illustrative heat model. Must be calibrated with actual plant tariff contract."
            ),
            EmissionFactorSchema(
                factor_id="EF-ELEC-SOLAR-PPA-02",
                name="Hybrid Solar/Wind Open-Access PPA (Blended)",
                category="Electricity",
                value=0.065,
                unit="tCO2e/MWh",
                source="Renewable PPA Certification & Wheeled Power Contract",
                version="ppa-2026-v2",
                valid_from="2026-04-01",
                valid_to="2027-03-31",
                accounting_boundary="Scope 2 (Market-based)",
                status="APPROVED",
                approved_by="Chief Energy Manager",
                uncertainty_pct=2.1,
                notes="Contracted wheeled renewable power with green attributes."
            ),
            EmissionFactorSchema(
                factor_id="EF-SCRAP-RECYCLED-03",
                name="Stainless Steel Recycled Scrap Route Factor",
                category="Consumable / Route",
                value=0.360,
                unit="tCO2e/t finished",
                source="World Stainless / ISSF Life Cycle Inventory (Allocation basis)",
                version="demo-v1.0",
                valid_from="2025-01-01",
                valid_to=None,
                accounting_boundary="Scope 3 / Scope 1 Process allocation",
                status="REFERENCE",
                approved_by="Process Engineering Team",
                uncertainty_pct=8.0,
                notes="Scrap preparation, transport logistics, and furnace handling."
            ),
            EmissionFactorSchema(
                factor_id="EF-ALLOY-FECR-04",
                name="High-Carbon Ferrochrome (Charge Chrome 60% Cr)",
                category="Ferro-alloy",
                value=3.42,
                unit="tCO2e/t alloy",
                source="Submerged Arc Furnace Smelting Benchmark (IndiAlloy)",
                version="ref-2025-b",
                valid_from="2025-01-01",
                valid_to="2026-12-31",
                accounting_boundary="Scope 3 (Purchased Goods)",
                status="REFERENCE",
                approved_by="Materials Procurement",
                uncertainty_pct=6.2,
                notes="Standard charge chrome additions."
            ),
            EmissionFactorSchema(
                factor_id="EF-ALLOY-FENI-05",
                name="Ferronickel (FeNi 20-25% Ni grade)",
                category="Ferro-alloy",
                value=9.85,
                unit="tCO2e/t alloy",
                source="Nickel Institute Life Cycle Data / Smelting Route",
                version="ref-2025-n",
                valid_from="2025-01-01",
                valid_to="2026-12-31",
                accounting_boundary="Scope 3 (Purchased Goods)",
                status="REFERENCE",
                approved_by="Materials Procurement",
                uncertainty_pct=7.5,
                notes="High embodied emissions in virgin nickel extraction."
            ),
            EmissionFactorSchema(
                factor_id="EF-GAS-NATURAL-06",
                name="Natural Gas (Ladle Heating & Tundish Preheat)",
                category="Fuel",
                value=0.00202,
                unit="tCO2e/Nm3",
                source="IPCC 2006 Guidelines for National GHG Inventories",
                version="ipcc-v2.1",
                valid_from="2024-01-01",
                valid_to=None,
                accounting_boundary="Scope 1 (Direct Combustion)",
                status="APPROVED",
                approved_by="Energy Auditor",
                uncertainty_pct=1.8,
                notes="Direct fuel combustion in preheaters."
            ),
            EmissionFactorSchema(
                factor_id="EF-LIME-CALC-07",
                name="Calcined Quicklime / Dololime Slag Former",
                category="Consumable / Route",
                value=1.08,
                unit="tCO2e/t lime",
                source="Lime kiln calcination decarbonation stoichiometry",
                version="demo-v1.1",
                valid_from="2025-01-01",
                valid_to=None,
                accounting_boundary="Scope 3 (Upstream calcination)",
                status="REFERENCE",
                approved_by="Slag Metallurgy Group",
                uncertainty_pct=5.0,
                notes="EAF/AOD dephosphorization and desulfurization flux."
            )
        ]

        # 2. Grade Metallurgical Constraints
        self.grade_constraints = [
            GradeConstraintSchema(grade="304", element="Cr", min_pct=18.0, max_pct=20.0, unit="% wt", specification_standard="ASTM A240", source="Standard Austenitic Spec"),
            GradeConstraintSchema(grade="304", element="Ni", min_pct=8.0, max_pct=10.5, unit="% wt", specification_standard="ASTM A240", source="Standard Austenitic Spec"),
            GradeConstraintSchema(grade="304", element="C", min_pct=0.0, max_pct=0.08, unit="% wt", specification_standard="ASTM A240", source="Standard Austenitic Spec"),
            GradeConstraintSchema(grade="304", element="Cu (Tramp)", min_pct=0.0, max_pct=0.30, unit="% wt", specification_standard="Plant Quality Spec", source="Hot-cracking limit"),
            GradeConstraintSchema(grade="316", element="Cr", min_pct=16.0, max_pct=18.0, unit="% wt", specification_standard="ASTM A240", source="Marine Grade Spec"),
            GradeConstraintSchema(grade="316", element="Ni", min_pct=10.0, max_pct=14.0, unit="% wt", specification_standard="ASTM A240", source="Marine Grade Spec"),
            GradeConstraintSchema(grade="316", element="Mo", min_pct=2.0, max_pct=3.0, unit="% wt", specification_standard="ASTM A240", source="Marine Grade Spec"),
            GradeConstraintSchema(grade="430", element="Cr", min_pct=16.0, max_pct=18.0, unit="% wt", specification_standard="ASTM A240", source="Ferritic Spec"),
            GradeConstraintSchema(grade="430", element="Ni", min_pct=0.0, max_pct=0.75, unit="% wt", specification_standard="ASTM A240", source="Ferritic Spec")
        ]

        # 3. Process Constraints
        self.process_constraints = [
            ProcessConstraintSchema(
                process_unit="Electric Arc Furnace (EAF)",
                parameter="Minimum Melting Enthalpy",
                min_value=1.40,
                max_value=2.40,
                unit="MWh/t",
                source="Illustrative demo constraint",
                operational_impact="Specific electrical input required to ensure complete thermal liquefaction without un-melted scrap skulls."
            ),
            ProcessConstraintSchema(
                process_unit="Electric Arc Furnace (EAF)",
                parameter="Maximum Tap-to-Tap Time",
                min_value=45.0,
                max_value=75.0,
                unit="minutes",
                source="Illustrative demo constraint",
                operational_impact="Downstream caster pacing; cycle times exceeding 75 minutes cause caster turnaround bottlenecks."
            ),
            ProcessConstraintSchema(
                process_unit="Production Yield",
                parameter="Minimum Allowable Yield Threshold",
                min_value=80.0,
                max_value=100.0,
                unit="%",
                source="Illustrative demo constraint",
                operational_impact="Any candidate scenario projecting yield below 80.0% is strictly rejected due to metal oxidation and economic viability."
            ),
            ProcessConstraintSchema(
                process_unit="Ladle Refining / Casting",
                parameter="Nominal Heat Tonnage",
                min_value=60.0,
                max_value=180.0,
                unit="metric tonnes",
                source="Illustrative demo constraint",
                operational_impact="Nominal ladle refractory envelope and crane lifting tolerance."
            )
        ]

        # 4. Public JSL Benchmark Data
        # Explicitly marked as Public benchmark / reference data from published JSL Sustainability Reports
        self.benchmarks = [
            BenchmarkMetric(
                id="BM-JSL-01",
                metric="Specific GHG Emissions (Scope 1 + Scope 2)",
                category="Emissions",
                value=1.91,
                unit="tCO2e / tonne of stainless steel",
                reporting_period="FY 2023-24",
                source="Jindal Stainless Integrated Annual & Sustainability Report FY24",
                status="Public benchmark / reference data",
                boundary="Scope 1 (Direct) + Scope 2 (Indirect Grid)",
                notes="Reported consolidated specific emission intensity across major manufacturing facilities."
            ),
            BenchmarkMetric(
                id="BM-JSL-02",
                metric="Direct Scope 1 Intensity",
                category="Emissions",
                value=0.58,
                unit="tCO2e / tonne of stainless steel",
                reporting_period="FY 2023-24",
                source="JSL Sustainability Disclosures / BRSR",
                status="Public benchmark / reference data",
                boundary="Scope 1 Direct Combustion & Process Decarbonation",
                notes="Includes fuels, lime calcination, carbon oxidation in converter."
            ),
            BenchmarkMetric(
                id="BM-JSL-03",
                metric="Indirect Scope 2 Intensity",
                category="Emissions",
                value=1.33,
                unit="tCO2e / tonne of stainless steel",
                reporting_period="FY 2023-24",
                source="JSL Sustainability Disclosures / BRSR",
                status="Public benchmark / reference data",
                boundary="Scope 2 Purchased Grid Electricity",
                notes="Reflects average regional thermal/hydro grid power mix."
            ),
            BenchmarkMetric(
                id="BM-JSL-04",
                metric="Recycled Scrap Metallic Input Ratio",
                category="Circularity",
                value=68.5,
                unit="%",
                reporting_period="FY 2023-24",
                source="JSL Sustainability Report / Circularity Profile",
                status="Public benchmark / reference data",
                boundary="Total metallic charge to melting furnaces",
                notes="Reflects high circularity through certified scrap recovery programs."
            ),
            BenchmarkMetric(
                id="BM-JSL-05",
                metric="Renewable Energy Share in Power Mix",
                category="Renewable",
                value=18.4,
                unit="%",
                reporting_period="FY 2023-24 (Target 50% by 2030)",
                source="JSL Net-Zero Transition Roadmap Announcements",
                status="Public benchmark / reference data",
                boundary="Contracted RE PPA, Rooftop Solar, Wind hybrid",
                notes="Part of corporate transition toward 100 MW+ renewable capacity."
            ),
            BenchmarkMetric(
                id="BM-JSL-06",
                metric="Specific Energy Consumption",
                category="Energy",
                value=1.82,
                unit="MWh / tonne liquid steel equivalent",
                reporting_period="FY 2023-24",
                source="JSL Energy Efficiency Benchmarking Disclosure",
                status="Public benchmark / reference data",
                boundary="EAF + AOD + VOD + Ladle Station",
                notes="Primary melting and refining electrical intensity."
            )
        ]

        # 5. Pre-seed a few decision history records for demonstration
        self.decisions = [
            {
                "decision_id": "DEC-2026-1041",
                "heat_id": "CW-1041",
                "planning_date": "2026-09-28",
                "grade": "304",
                "target_tonnage": 100.0,
                "current_co2e_per_t": 2.31,
                "selected_scenario_id": "SCENARIO_B",
                "selected_scenario_name": "Scenario B: Energy Intensity & PPA",
                "selected_co2e_per_t": 2.03,
                "potential_avoidance_per_t": 0.28,
                "potential_avoidance_total_tonnes": 28.0,
                "status": "APPROVED_FOR_CASTING",
                "planner": "Senior Planner M. Sharma",
                "factor_version": "demo-v1.4",
                "timestamp": "2026-09-28T14:22:10",
                "rationale": "Selected Scenario B over Scenario C because Scenario C violated the 80.0% minimum yield threshold (expected 79.0%). Scenario B achieved 2.03 tCO2e/t with full metallurgical compliance."
            },
            {
                "decision_id": "DEC-2026-1040",
                "heat_id": "CW-1040",
                "planning_date": "2026-09-28",
                "grade": "316",
                "target_tonnage": 100.0,
                "current_co2e_per_t": 2.62,
                "selected_scenario_id": "SCENARIO_B",
                "selected_scenario_name": "Scenario B: Qualified Scrap & Low-Loss Charge",
                "selected_co2e_per_t": 2.38,
                "potential_avoidance_per_t": 0.24,
                "potential_avoidance_total_tonnes": 24.0,
                "status": "APPROVED_FOR_CASTING",
                "planner": "Senior Metallurgist K. Patel",
                "factor_version": "demo-v1.4",
                "timestamp": "2026-09-28T09:15:32",
                "rationale": "Selected Scenario B with qualified scrap sorting. Avoided 24.0 tCO2e across 100t heat while keeping molybdenum yield compliant."
            }
        ]

        # Audit logs
        self.audit_logs = [
            {
                "id": "AUD-01",
                "timestamp": "2026-09-28T14:22:10",
                "user": "Planner M. Sharma",
                "action": "Selected Scenario B",
                "heat_id": "CW-1041",
                "factor_version": "demo-v1.4",
                "reason": "Lowest-carbon feasible scenario passing yield check (>80%)"
            },
            {
                "id": "AUD-02",
                "timestamp": "2026-09-28T09:15:32",
                "user": "Metallurgist K. Patel",
                "action": "Selected Scenario B",
                "heat_id": "CW-1040",
                "factor_version": "demo-v1.4",
                "reason": "Mo chemistry compliant, 0.24 tCO2e/t avoidance"
            }
        ]

store = InMemoryStore()
