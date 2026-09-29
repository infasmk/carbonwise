# CARBONWISE DATA MODEL SPECIFICATION

## 1. Domain Entities & Database Schema

In a production PostgreSQL deployment, CarbonWise defines the following 14 primary entities:

### `heats`
Represents the target melt batch to be scheduled.
- `id`: UUID (Primary Key)
- `heat_id`: VARCHAR(64) (e.g. `CW-1042`, unique per campaign)
- `grade`: VARCHAR(16) (`304`, `304L`, `316`, `316L`, `430`)
- `target_tonnage`: NUMERIC(8, 2) (Nominal tap weight, e.g. 100.0 t)
- `planning_date`: DATE
- `scrap_mix_pct`: NUMERIC(5, 2) (0.0 to 100.0%)
- `scrap_type`: VARCHAR(128)
- `scrap_quality`: VARCHAR(128)
- `scrap_source`: VARCHAR(128)
- `alloy_additions_pct`: NUMERIC(5, 2)
- `energy_source`: VARCHAR(64)
- `electricity_intensity_mwh_per_t`: NUMERIC(5, 3) (MWh/t)
- `grid_emission_factor`: NUMERIC(6, 4) (tCO2e/MWh)
- `fuel_type`: VARCHAR(64)
- `fuel_consumption_nm3_per_t`: NUMERIC(6, 2)
- `expected_yield_pct`: NUMERIC(5, 2)
- `created_at`: TIMESTAMPTZ

### `emission_factors`
Versioned factor registry. Immutable; factors are never overwritten.
- `id`: UUID (Primary Key)
- `factor_id`: VARCHAR(64) (e.g. `EF-ELEC-GRID-DEMO-01`)
- `name`: VARCHAR(255)
- `category`: VARCHAR(64) (`Electricity`, `Fuel`, `Consumable / Route`, `Ferro-alloy`)
- `value`: NUMERIC(10, 4)
- `unit`: VARCHAR(32) (e.g. `tCO2e/MWh`, `tCO2e/t`)
- `source`: TEXT (Citations, e.g. CEA Database, ISSF)
- `version`: VARCHAR(32) (e.g. `demo-v1.4`)
- `valid_from`: DATE
- `valid_to`: DATE (NULL if active)
- `accounting_boundary`: VARCHAR(64) (`Scope 1`, `Scope 2 Location`, `Scope 2 Market`)
- `status`: VARCHAR(32) (`ILLUSTRATIVE`, `REFERENCE`, `PENDING_VALIDATION`, `APPROVED`)
- `approved_by`: VARCHAR(128)
- `uncertainty_pct`: NUMERIC(4, 2)

### `scenarios`
Candidate operational configurations generated for a heat.
- `id`: UUID
- `heat_id`: UUID (Foreign Key -> `heats.id`)
- `scenario_key`: VARCHAR(32) (`CURRENT`, `SCENARIO_A`, `SCENARIO_B`, `SCENARIO_C`)
- `total_co2e_per_t`: NUMERIC(6, 4)
- `energy_co2e_per_t`: NUMERIC(6, 4)
- `alloy_co2e_per_t`: NUMERIC(6, 4)
- `scrap_route_co2e_per_t`: NUMERIC(6, 4)
- `is_feasible`: BOOLEAN
- `status_label`: VARCHAR(16) (`FEASIBLE`, `REJECTED`)
- `rejection_summary`: TEXT
- `rejection_detail`: TEXT

### `scenario_checks`
Individual results for the 8 feasibility checks on a scenario.
- `id`: UUID
- `scenario_id`: UUID (Foreign Key -> `scenarios.id`)
- `check_name`: VARCHAR(64)
- `passed`: BOOLEAN
- `constraint_type`: VARCHAR(64)
- `actual_value`: VARCHAR(64)
- `limit_value`: VARCHAR(64)
- `message`: TEXT

### `decisions`
Locked pre-melt decisions recorded with operator identity and audit trail.
- `id`: UUID
- `decision_id`: VARCHAR(64)
- `heat_id`: VARCHAR(64)
- `selected_scenario_id`: VARCHAR(32)
- `current_co2e_per_t`: NUMERIC(6, 4)
- `selected_co2e_per_t`: NUMERIC(6, 4)
- `potential_avoidance_per_t`: NUMERIC(6, 4)
- `potential_avoidance_total_tonnes`: NUMERIC(10, 2)
- `status`: VARCHAR(32) (`LOCKED_FOR_MELTING`, `APPROVED_FOR_CASTING`)
- `planner`: VARCHAR(128)
- `factor_version`: VARCHAR(32)
- `timestamp`: TIMESTAMPTZ
- `rationale`: TEXT

### `validation_heats`
Records imported from certified plant production logs for model calibration.
- `heat_id`: VARCHAR(64)
- `date`: DATE
- `grade`: VARCHAR(16)
- `predicted_co2e_per_t`: NUMERIC(6, 4)
- `actual_co2e_per_t`: NUMERIC(6, 4)
- `error_t`: NUMERIC(6, 4)
- `error_pct`: NUMERIC(5, 2)
- `predicted_feasible`: BOOLEAN
- `actual_success`: BOOLEAN
