# CARBONWISE SECURITY & PERMISSIONS ARCHITECTURE

## 1. Enterprise Security Standards

CarbonWise is engineered to operate in enterprise industrial networks with strict data sovereignty and intellectual property boundaries.

---

## 2. Role-Based Access Control (RBAC)

| Role | Permissions |
|---|---|
| **Production Planner** | Create and calculate heats, explore scenarios, commit melt decisions, view factor registry. |
| **Process Engineer / Metallurgist** | Calibrate operating constraints, adjust chemistry envelopes, validate feasibility gates. |
| **Sustainability / ESG Auditor** | Export compliance dossiers, review validation metrics, view factor provenance, download CSV reports. |
| **Data Administrator** | Manage CSV/XLSX imports in Data Hub, manage user roles, certify emission factors. |
| **Plant Management / Executive** | Read-only executive dashboard, aggregate opportunity analysis, macro benchmarking. |

---

## 3. Data Confidentiality & Protection

- **No Public Telemetry Exposure**: Uploaded customer datasets are never exposed via unauthenticated endpoints.
- **In-Memory Streaming Validation**: File uploads are processed in memory with strict MIME type checking (`text/csv`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).
- **Anonymized Identifiers**: Public demos use synthetic heat tags (e.g. `CW-DEMO-101`) to protect proprietary plant scheduling.
- **Audit Logging**: Every locked production decision is logged with operator identity, factor version, and timestamp for ISO 14064 verification.
