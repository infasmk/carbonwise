# CARBONWISE API DOCUMENTATION

Base Path: `/api`  
Interactive OpenAPI UI: `http://127.0.0.1:8000/docs`

---

## 1. System Health & Heartbeat

### `GET /health`
Returns service availability, timestamp, and version.

---

## 2. Pre-Production Calculation & Optimization

### `POST /api/calculate`
Calculates transparent carbon intensity per finished tonne for a given heat input.
- **Request Body**: `HeatInput` (JSON)
- **Response**: `CarbonBreakdown` with energy, alloy, scrap terms, percentages, and calculation steps.

### `POST /api/scenarios`
Generates candidate operational scenarios (Current, Scenario A, Scenario B, Scenario C) with independent feasibility check results.
- **Request Body**: `HeatInput`
- **Response**: Array of `ScenarioItem`

### `POST /api/decision`
Core Decision Engine. Identifies the lowest-carbon **feasible** scenario, rejects infeasible candidates, and quantifies potential CO₂e avoidance.
- **Request Body**: `HeatInput`
- **Response**: `DecisionResult`

### `POST /api/sensitivity`
Evaluates "What moves carbon?" across energy intensity, scrap mix ratio, grid factor, or yield.
- **Query Params**: `variable` (`energy_intensity`, `scrap_mix`, `grid_factor`, `yield`), `min_val`, `max_val`, `steps`
- **Request Body**: `HeatInput`

---

## 3. Governance & Registries

### `GET /api/factors`
Returns all versioned emission factors from the repository.

### `GET /api/constraints/grades`
Returns metallurgical chemistry limits for Grade 304, 316, 430, etc.

### `GET /api/constraints/process`
Returns thermodynamic, furnace power, and yield operational bounds.

### `GET /api/benchmarks`
Returns published JSL corporate sustainability benchmarks (FY24 Integrated Report / BRSR).

---

## 4. Ingestion Pipeline & Validation

### `GET /api/data/template`
Downloads the official 24-field CSV validation template.

### `POST /api/data/preview`
Multipart form upload of CSV file. Parses, validates schema, flags duplicate IDs or missing values, and returns a quality score preview.

### `POST /api/data/import`
Confirms validated dataset import into the validation repository.

### `GET /api/validation/summary`
Calculates genuine MAE, RMSE, tolerance %, and feasibility agreement. Returns `has_data: false` if no dataset has been imported.

### `POST /api/validation/demo-seed`
Loads an illustrative 50-heat sample dataset for presentation and jury demonstration.

### `DELETE /api/validation/clear`
Clears imported validation heats to return to honest empty state.

---

## 5. Decisions & Audit Logs

### `GET /api/decisions`
Returns all locked heat decisions.

### `POST /api/decisions`
Commits a chosen scenario with planner identity, factor version, and timestamp.

### `GET /api/audit-logs`
Returns chronological audit trails for ISO 14064 compliance.
