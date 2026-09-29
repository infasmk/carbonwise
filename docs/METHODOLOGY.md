# CARBONWISE METALLURGICAL & CARBON CALCULATION METHODOLOGY

## 1. Accounting Boundary Definition

CarbonWise evaluates specific emissions per finished metric tonne of stainless steel ($\text{tCO}_2\text{e/t}$):

$$\text{Total Emission Intensity } (\text{tCO}_2\text{e/t}) = E_{\text{energy}} + E_{\text{alloy}} + E_{\text{scrap\_route}}$$

Where:
- $E_{\text{energy}}$: Specific electricity consumption ($\text{MWh/t}$) $\times$ Grid emission factor ($\text{tCO}_2\text{e/MWh}$) $+$ fuel preheating emissions.
- $E_{\text{alloy}}$: Direct and embodied carbon additions from ferrochrome ($\text{FeCr}$), ferronickel ($\text{FeNi}$), and ferromolybdenum ($\text{FeMo}$).
- $E_{\text{scrap\_route}}$: Life-cycle allocated carbon for recycled scrap collection, processing, shredding, and furnace charging logistics.

### Critical Methodology Note (Section 9)
> *"Illustrative calculation basis. Contributor terms are expressed per finished tonne; no second yield adjustment is applied."*

---

## 2. Multi-Physics Feasibility Formulation

Optimization Problem:
$$\min_{\mathbf{x} \in \mathcal{X}} \text{Total CO}_2\text{e}(\mathbf{x}) \quad \text{subject to: } \mathbf{g}(\mathbf{x}) \le \mathbf{0}$$

Where constraints $\mathbf{g}(\mathbf{x})$ evaluate:
1. $S_{\text{req}} \le S_{\text{avail}}$ (Scrap inventory capacity)
2. $\text{Tramp}_{\text{Cu}}(\mathbf{x}) \le 0.30\%$ (Hot-cracking boundary for Grade 304)
3. $18.0\% \le \text{Cr}(\mathbf{x}) \le 20.0\%$ and $8.0\% \le \text{Ni}(\mathbf{x}) \le 10.5\%$ (ASTM A240 Grade 304 chemistry)
4. $1.40 \le P_{\text{energy}}(\mathbf{x}) \le 2.40\text{ MWh/t}$ (Thermodynamic liquefaction enthalpy window)
5. $t_{\text{tap-to-tap}}(\mathbf{x}) \le 75\text{ minutes}$ (Continuous caster pacing window)
6. $Y(\mathbf{x}) \ge 80.0\%$ (Minimum allowable production yield threshold)
7. $60.0 \le W_{\text{tap}}(\mathbf{x}) \le 180.0\text{ tonnes}$ (Nominal ladle capacity)
8. $\text{Inclusion Index} \le 1.5$ (ASTM E45 surface cleanliness criteria)

Any candidate vector $\mathbf{x}$ violating any $g_j(\mathbf{x}) > 0$ is classified as `REJECTED` and removed from candidate ranking.
