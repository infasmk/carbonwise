import pytest
from app.schemas.heat import HeatInput
from app.engines.carbon import CarbonEngine
from app.engines.feasibility import FeasibilityEngine
from app.engines.optimizer import ScenarioOptimizer
from app.engines.validation import ValidationEngine
from app.ingestion.data_validator import DataValidator

def test_carbon_calculation_demo_values():
    """
    Acceptance Test 79:
    Scrap: 70.1%, Grade: 304, Grid factor: 0.719, Energy use: 1.85 MWh/t
    Energy term: 1.85 * 0.719 = 1.33 tCO2e/t
    Alloy: 0.62 tCO2e/t
    Scrap route: 0.36 tCO2e/t
    Total: ~2.31 tCO2e/t
    """
    heat = HeatInput(
        heat_id="CW-DEMO-TEST",
        grade="304",
        target_tonnage=100.0,
        scrap_mix_pct=70.1,
        electricity_intensity_mwh_per_t=1.85,
        grid_emission_factor=0.719,
        expected_yield_pct=92.4
    )
    result = CarbonEngine.calculate(heat)
    
    assert round(result.energy_co2e_per_t, 2) == 1.33
    assert round(result.alloy_co2e_per_t, 2) == 0.62
    assert round(result.scrap_route_co2e_per_t, 2) == 0.36
    assert round(result.total_co2e_per_t, 2) == 2.31
    assert "Illustrative calculation basis" in result.methodology_note
    assert len(result.calculation_steps) == 3

def test_feasibility_engine_yield_rejection():
    """
    Acceptance Test:
    Yield 79.0% violates minimum allowed 80.0% constraint.
    Result must be FAIL / REJECTED with clear explanation.
    """
    is_feasible, checks, sum_reason, detail, violated = FeasibilityEngine.evaluate(
        grade="304",
        scrap_mix_pct=83.0,
        energy_source="Grid",
        electricity_intensity_mwh_per_t=1.55,
        yield_pct=79.0,  # < 80%
        target_tonnage=100.0
    )
    assert not is_feasible
    assert any(not c.passed and "Yield" in c.name for c in checks)
    assert "Yield" in sum_reason
    assert "79.0%" in detail

def test_decision_engine_never_selects_infeasible():
    """
    Acceptance Test 80:
    Given: Current (2.31), A (2.11 feasible), B (2.03 feasible), C (1.87 lowest carbon, but INFEASIBLE).
    The engine must NOT select C. It must select B.
    """
    heat = HeatInput(
        heat_id="CW-DEMO-TEST",
        grade="304",
        target_tonnage=100.0,
        scrap_mix_pct=70.1,
        electricity_intensity_mwh_per_t=1.85,
        grid_emission_factor=0.719,
        expected_yield_pct=92.4
    )
    decision = ScenarioOptimizer.evaluate_decision(heat)
    
    assert decision.recommended_scenario_id != "SCENARIO_C"
    assert decision.recommended_scenario_id == "SCENARIO_B"
    assert round(decision.recommended_co2e_per_t, 2) == 2.03
    assert round(decision.potential_avoidance_per_t, 2) == 0.28
    assert round(decision.potential_avoidance_total_tonnes, 1) == 28.0
    assert len(decision.rejected_scenarios_summary) > 0
    assert decision.rejected_scenarios_summary[0]["scenario_id"] == "SCENARIO_C"

def test_validation_engine_honest_empty_state():
    """
    Acceptance Test 82:
    If there is no actual dataset, do NOT generate fake validation metrics.
    Must return has_data=False.
    """
    summary = ValidationEngine.calculate_metrics([])
    assert not summary.has_data
    assert "Validation data not imported" in summary.status_notice

def test_data_validator_csv_preview():
    """
    Acceptance Test 81:
    Upload CSV -> parse, validate, preview, quality score.
    """
    sample_csv = (
        "heat_id,date,grade,target_tonnage,scrap_pct,energy_mwh_per_t,yield_pct,actual_co2e_per_t\n"
        "CW-TEST-1,2026-09-01,304,100.0,70.1,1.85,92.4,2.31\n"
        "CW-TEST-2,2026-09-02,304,100.0,72.0,,91.5,2.28\n"  # missing energy!
        "CW-TEST-3,2026-09-03,304,100.0,75.0,1.75,45.0,2.15\n"  # yield < 50% physical error!
    )
    preview = DataValidator.validate_csv_content(sample_csv)
    assert preview.total_rows == 3
    assert preview.warning_rows > 0  # detected missing energy
    assert preview.error_rows > 0    # detected yield out of range
    assert preview.can_import        # valid row exists
