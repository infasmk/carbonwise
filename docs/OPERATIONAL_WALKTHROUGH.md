# CARBONWISE 3-MINUTE EXECUTIVE WALKTHROUGH GUIDE

Follow this structured script when demonstrating CarbonWise to plant leadership, Jindal Stainless reviewers, engineering panels, or sustainability teams.

---

## Step 1: The Product Thesis (30 seconds)
- Open CarbonWise at `http://127.0.0.1:5173`.
- Highlight the Tagline: **"The decision is made before the melt."**
- State the Core Difference:
  > *"Traditional systems calculate carbon weeks after casting. CarbonWise is a pre-production decision layer that helps planners choose the lowest-carbon feasible scenario before the electric arc is struck."*

---

## Step 2: Heat Planner & Baseline Calculation (45 seconds)
- Navigate to **Heat Planner**.
- Review the demo heat: 100t of AISI 304 stainless steel.
- Point out the inputs: Scrap mix: 70.1%, Energy intensity: 1.85 MWh/t, Grid emission factor: 0.719 tCO₂e/MWh.
- Show the transparent result: **2.31 tCO₂e / finished tonne**.
- Expand the **Calculation Basis Drawer**:
  - Energy: 1.85 × 0.719 = 1.33 tCO₂e/t (58%)
  - Alloy additions: 0.62 tCO₂e/t (27%)
  - Scrap route: 0.36 tCO₂e/t (15%)
  - Total: 2.31 tCO₂e/t.
  - Methodology Note: Contributor terms expressed per finished tonne; no second yield adjustment applied.

---

## Step 3: Scenario Lab & Constraint Rejection (60 seconds)
- Click **"Evaluate Scenarios"** to enter the **Scenario Lab**.
- Show the 4 candidate scenarios:
  - Current baseline: 2.31 tCO₂e/t (Feasible)
  - Scenario A: 2.11 tCO₂e/t (Feasible)
  - Scenario B: 2.03 tCO₂e/t (Feasible)
  - Scenario C: 1.87 tCO₂e/t (**REJECTED**)
- **The Decisive Moment**:
  - Click on **"WHY REJECTED?"** for Scenario C.
  - Explain: *"Scenario C has the lowest carbon on paper (1.87 t/t), but its expected yield is 79.0%, which violates the plant's 80.0% minimum threshold. CarbonWise never selects an infeasible scenario."*
- Highlight the **CarbonWise Decision**:
  - Recommended: **Scenario B** (2.03 tCO₂e/t).
  - Potential reduction: **0.28 tCO₂e/t**.
  - Potential avoidance: **28.0 tCO₂e** across the 100t heat without yield penalty.

---

## Step 4: Metrology & Honesty in Validation (45 seconds)
- Navigate to the **Validation Center**.
- Note the initial honest empty state: *"Validation data not imported yet."*
- Click **"Load Demo Validation Data (50 Heats)"**.
- Show the **Predicted vs Actual Scatter Plot**:
  - Points clustered along the 1:1 parity line.
  - Genuine MAE (0.052 t/t) and RMSE (0.064 t/t).
  - Hover over a point to inspect Heat ID, Grade, Predicted, Actual, and Error.

---

## Step 5: Wrap Up & Lock (30 seconds)
- Return to **Scenario Lab** and click **"Lock Scenario B into Melt Plan"**.
- View the updated record in **Decision History** with immutable audit details.
- Conclude:
  > *"CarbonWise makes carbon visible before the plan is locked, ensuring every steel melt optimizes emissions without compromising production reality."*
