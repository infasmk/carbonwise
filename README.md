# CARBONWISE

> **"The decision is made before the melt."**
> 
> *Pre-production carbon & energy decision-intelligence platform for stainless-steelmaking.*

---

## 1. Executive Overview

**CarbonWise** is a specialized pre-production decision layer built around existing industrial enterprise architectures (SAP, ERP, MES, and SCADA systems). Rather than retrospectively reporting carbon emissions weeks after casting, CarbonWise answers the critical pre-production question:

> *"Given the production requirement, what are the feasible ways to make this heat, what is the estimated carbon impact of each scenario, and which feasible scenario has the lowest CO₂e per finished tonne?"*

### The Core Industrial Principle
**Lowest carbon is NOT enough. It must also be feasible.**

Mathematical minimization alone produces disastrous industrial recommendations (e.g. charging ultra-low grade scrap that unbalances converter chemistry or cutting thermal energy below melting enthalpy). 

CarbonWise enforces an **8-Constraint Multi-Physics Feasibility Gate**:
1. **Scrap Availability Check** (inventory and logistics limits)
2. **Scrap Quality Check** (tramp elements: Cu, Sn, Pb hot-cracking specs)
3. **Chemistry Compliance** (ASTM A240 element ranges: Cr, Ni, Mo, C)
4. **Furnace / Process Limits** (EAF transformer window & cycle pacing)
5. **Energy Availability** (Firm power supply vs intermittent green power)
6. **Yield Threshold** (Minimum 80.0% liquid/finished yield threshold)
7. **Production / Tonnage Check** (Ladle capacity envelope: 60–180 t)
8. **Surface Cleanliness & Inclusion Risk** (ASTM E45 rating)

---

## 2. Decision Workflow

```
[ INPUT ]
Scrap mix %, Grade, Energy source, Specific MWh/t, Grid factor, Target tonnage
   │
   ▼
[ CALCULATE ]
Energy Term (1.85 × 0.719 = 1.33) + Alloy Term (0.62) + Scrap Route (0.36) = ~2.31 tCO2e/t
   │
   ▼
[ CHECK ]
Evaluate 8 physical & metallurgical constraints independently
   │
   ▼
[ REJECT / FILTER ]
Disqualify infeasible scenarios (e.g. Scenario C: Yield 79.0% < min 80.0% -> REJECTED)
   │
   ▼
[ COMPARE & DECIDE ]
Compare surviving feasible candidates along the Operational Carbon Frontier
   │
   ▼
[ COMMIT ]
Lock Lowest-Carbon Feasible Scenario (Scenario B: 2.03 tCO2e/t, 28.0 tCO2e avoided for 100t heat)
```

---

## 3. Technology Stack

- **Frontend**: React 18, TypeScript (Strict Mode), Vite, Tailwind CSS, Lucide Icons, Custom High-DPI Charts.
- **Backend**: Python 3.12, FastAPI, Pydantic v2, Uvicorn, SQLAlchemy.
- **Engines**:
  - `engines/carbon.py`: Deterministic transparent contributor calculation.
  - `engines/feasibility.py`: 8-constraint metallurgical evaluation engine.
  - `engines/optimizer.py`: Scenario generator and feasible frontier selector.
  - `engines/validation.py`: Metrology engine (MAE, RMSE, tolerance, parity scatter).
  - `ingestion/data_validator.py`: 7-stage CSV/XLSX pipeline with error flagging.

---

## 4. Quick Start

### Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation available at: `http://127.0.0.1:8000/docs`

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Application accessible at: `http://127.0.0.1:5173`

### Run Test Suite
```bash
cd backend
python -m pytest tests/test_engines.py
```

---

## 5. Industrial Honesty & Data Integrity

CarbonWise strictly adheres to enterprise data integrity:
- **No Fabricated Production Data**: Illustrative baseline figures are explicitly marked with `ILLUSTRATIVE DEMO — NOT JSL PRODUCTION DATA`.
- **Validation Honesty**: If no historical heats have been imported, the Validation Center displays an honest empty state (`Validation data not imported yet`).
- **Public Benchmark Distinction**: Published JSL sustainability disclosures (FY24 Integrated Report) are categorized as public macro benchmarks, distinct from heat-level telemetry.
- **Terminology**: Potential carbon avoidance is reported as *"Potential avoidance"*, never *"Guaranteed savings"*.

---

## 6. Documentation Index

- [Architecture & Integration Layer](docs/ARCHITECTURE.md)
- [Data Models & Schema](docs/DATA_MODEL.md)
- [REST API Specifications](docs/API.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)
- [Model Metrology & Validation](docs/VALIDATION.md)
- [Data Hub & Ingestion Pipeline](docs/DATA_IMPORT.md)
- [Enterprise Security & Roles](docs/SECURITY.md)
- [Jury Demonstration Guide](docs/JURY_DEMO.md)
- [Metallurgical Calculation Methodology](docs/METHODOLOGY.md)
