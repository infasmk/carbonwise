# CARBONWISE ARCHITECTURE

## 1. Architectural Philosophy

CarbonWise is engineered as a **decision layer** surrounding plant systems, rather than an invasive transactional system replacement. 

```
┌────────────────────────────────────────────────────────┐
│             Plant Enterprise Infrastructure            │
├──────────────┬──────────────┬──────────────┬───────────┤
│  JSL SAP     │   JSL MES    │ Energy SCADA │ YardMaster│
│  (Orders)    │ (Level 2/3)  │  (Tariffs)   │  (Assays) │
└──────┬───────┴──────┬───────┴──────┬───────┴─────┬─────┘
       │              │              │             │
       ▼              ▼              ▼             ▼
┌────────────────────────────────────────────────────────┐
│         CarbonWise Validated Integration Layer         │
│          (REST API / File Ingestion Pipeline)          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                  CarbonWise Platform                   │
│                                                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────┐  │
│  │ Carbon Engine   │ │ Feasibility     │ │ Scenario │  │
│  │ (3 Contributors)│ │ Engine (8 Gates)│ │ Optimizer│  │
│  └────────┬────────┘ └────────┬────────┘ └────┬─────┘  │
│           │                   │               │        │
│           └───────────────────┼───────────────┘        │
│                               ▼                        │
│                [ Operational Carbon Frontier ]         │
│                               │                        │
│                               ▼                        │
│               Lowest-Carbon Feasible Scenario          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│       Locked Production Plan (To Melt Shop Queue)      │
└────────────────────────────────────────────────────────┘
```

## 2. Component Separation

- **Presentation Layer (`src/` in TypeScript)**: Pure decoupled React components using Tailwind CSS and Recharts/SVG. No business formulas are buried inside UI widgets.
- **Service Layer (`services/api.ts`)**: Standardized API consumer with offline-resilient local execution fallback.
- **Calculation Engines (`engines/` in Python)**:
  - `carbon.py`: Computes transparent sum of Energy, Alloy additions, and Scrap route.
  - `feasibility.py`: Independent Boolean constraint verification with contextual violation diagnostics.
  - `optimizer.py`: Scenario generation and selection logic.
  - `validation.py`: Statistical validation of model estimates against physical historical heats.
- **Data Governance Layer (`ingestion/` & `repositories/`)**: Immutable factor versioning and upload preview validation.
