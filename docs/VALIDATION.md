# CARBONWISE MODEL METROLOGY & VALIDATION

## 1. Validation Philosophy

A decision-intelligence system in a heavy industrial melt shop must earn trust through statistical rigor and verifiable validation.

CarbonWise evaluates pre-production model predictions against certified post-casting actual production outcomes.

---

## 2. Statistical Metrics Formulations

Given $n$ historical heats where $y_i$ is the actual verified emissions intensity and $\hat{y}_i$ is the CarbonWise pre-melt prediction:

### 1. Mean Absolute Error (MAE)
$$\text{MAE} = \frac{1}{n} \sum_{i=1}^n |\hat{y}_i - y_i|$$
Target: $< 0.080\text{ tCO}_2\text{e/t}$.

### 2. Root Mean Squared Error (RMSE)
$$\text{RMSE} = \sqrt{\frac{1}{n} \sum_{i=1}^n (\hat{y}_i - y_i)^2}$$
Penalizes severe outliers (e.g. unpredicted furnace delays or electrode breakage).

### 3. Mean Bias Error (MBE)
$$\text{MBE} = \frac{1}{n} \sum_{i=1}^n (\hat{y}_i - y_i)$$
Indicates systemic model under-prediction or over-prediction.

### 4. Percentage Within Tolerance ($\pm 5\%$)
$$\text{Tolerance Rate} = \frac{\sum_{i=1}^n \mathbb{I}\left( \frac{|\hat{y}_i - y_i|}{y_i} \le 0.05 \right)}{n} \times 100\%$$

### 5. Feasibility Agreement
$$\text{Feasibility Agreement} = \frac{\text{Heats where Predicted Feasibility matches Actual Production Success}}{\text{Total Heats}} \times 100\%$$

---

## 3. Data Integrity Protocol

- **Never Fabricate Accuracy**: If historical heat data has not been imported, CarbonWise displays:
  > *"Validation data not imported yet. Import approved historical heat data to calculate model validation metrics."*
- **Illustrative Samples**: A demo dataset of 50 heats is provided for UI evaluation, but is always explicitly tagged with `ILLUSTRATIVE SAMPLE HEATS`.
