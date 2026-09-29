# CARBONWISE DATA HUB & INGESTION PIPELINE

## 1. 7-Stage Governance Pipeline

```
UPLOAD ──► PARSE ──► VALIDATE ──► FLAG ERRORS ──► PREVIEW ──► CONFIRM ──► STORE ──► USE
```

1. **Upload**: User drops CSV, XLSX, or JSON file via the Data Hub drag-and-drop interface.
2. **Parse**: Streamed safely into memory without persistent filesystem writes or arbitrary code execution.
3. **Validate**: Checked against required columns, data types, physical numeric boundaries, and unique constraints.
4. **Flag Errors**: Rows with missing energy intensity, out-of-range yields, or duplicate IDs are flagged.
5. **Preview**: A modal displays total rows, valid rows, error count, and computed Data Quality Score (e.g. 94.2%).
6. **Confirm Import**: The user confirms import of *valid records only*.
7. **Store**: Clean records enter the validation repository.
8. **Use in Engine**: Live MAE, RMSE, and scatter plots update immediately.

---

## 2. Standardized 24-Field Schema

| Field Name | Type | Description |
|---|---|---|
| `heat_id` | String | Unique melt identifier (e.g. `CW-VAL-2026-1001`) |
| `date` | Date | Tap date (`YYYY-MM-DD`) |
| `grade` | String | Standard stainless grade (`304`, `316`, `430`) |
| `target_tonnage` | Float | Target ladle weight in metric tonnes |
| `actual_finished_tonnage` | Float | Certified finished cast billet/slab tonnage |
| `scrap_total_t` | Float | Metric tonnes of scrap charged |
| `scrap_pct` | Float | Scrap ratio percentage |
| `scrap_type` | String | Scrap classification (heavy, turnings, plate) |
| `scrap_source` | String | Supplier provenance |
| `alloy_type` | String | Trim additions (FeCr, FeNi, FeMo) |
| `alloy_qty_t` | Float | Total ferro-alloy addition tonnes |
| `electricity_mwh` | Float | Total EAF + AOD electrical energy consumed |
| `energy_mwh_per_t` | Float | Specific energy intensity |
| `energy_source` | String | Grid, Solar PPA, Hybrid |
| `fuel_type` | String | Ladle preheat fuel (Natural Gas, Oxy-fuel) |
| `fuel_qty` | Float | Secondary fuel volume |
| `yield_pct` | Float | Metallic recovery percentage |
| `quality_pass` | String | Quality inspection status (`PASS`, `FAIL`) |
| `rework` | Integer | Rework count |
| `reject` | Integer | Scrap reject count |
| `actual_scope1_co2e` | Float | Direct combustion emissions |
| `actual_scope2_co2e` | Float | Indirect electrical grid emissions |
| `actual_total_co2e` | Float | Total heat emissions |
| `actual_co2e_per_t` | Float | Specific emission intensity per finished tonne |

Template file is downloadable in Data Hub or at `/api/data/template`.
