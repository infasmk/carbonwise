import csv
import io
from typing import List, Dict, Any, Tuple
from pydantic import BaseModel

class QualityIssue(BaseModel):
    row_number: int
    heat_id: str
    column: str
    issue_type: str  # MISSING_VALUE, RANGE_VIOLATION, INVALID_FORMAT, DUPLICATE_ID
    severity: str    # WARNING, ERROR
    message: str

class ImportPreviewResult(BaseModel):
    total_rows: int
    valid_rows: int
    error_rows: int
    warning_rows: int
    quality_score_pct: float
    detected_columns: List[str]
    sample_preview: List[Dict[str, Any]]
    issues: List[QualityIssue]
    can_import: bool
    notice: str = "Preview only. Review issues and confirm import."

class DataValidator:
    REQUIRED_COLUMNS = [
        "heat_id", "date", "grade", "target_tonnage", "scrap_pct",
        "energy_mwh_per_t", "yield_pct", "actual_co2e_per_t"
    ]
    
    ALL_TEMPLATE_COLUMNS = [
        "heat_id", "date", "grade", "target_tonnage", "actual_finished_tonnage",
        "scrap_total_t", "scrap_pct", "scrap_type", "scrap_source",
        "alloy_type", "alloy_qty_t", "electricity_mwh", "energy_mwh_per_t",
        "energy_source", "fuel_type", "fuel_qty", "yield_pct",
        "quality_pass", "rework", "reject", "actual_scope1_co2e",
        "actual_scope2_co2e", "actual_total_co2e", "actual_co2e_per_t"
    ]

    @classmethod
    def validate_csv_content(cls, content: str) -> ImportPreviewResult:
        stream = io.StringIO(content.strip())
        reader = csv.DictReader(stream)
        
        headers = reader.fieldnames or []
        rows = list(reader)
        total_rows = len(rows)
        
        issues: List[QualityIssue] = []
        seen_heat_ids = set()
        valid_rows_count = 0
        error_rows_set = set()
        
        for idx, row in enumerate(rows, start=1):
            row_has_error = False
            heat_id = row.get("heat_id", "").strip()
            
            # 1. Heat ID check
            if not heat_id:
                issues.append(QualityIssue(
                    row_number=idx,
                    heat_id=f"Row-{idx}",
                    column="heat_id",
                    issue_type="MISSING_VALUE",
                    severity="ERROR",
                    message="Missing Heat ID — record cannot be tracked."
                ))
                row_has_error = True
            elif heat_id in seen_heat_ids:
                issues.append(QualityIssue(
                    row_number=idx,
                    heat_id=heat_id,
                    column="heat_id",
                    issue_type="DUPLICATE_ID",
                    severity="ERROR",
                    message=f"Duplicate Heat ID '{heat_id}' detected."
                ))
                row_has_error = True
            else:
                seen_heat_ids.add(heat_id)
                
            # 2. Grade check
            grade = row.get("grade", "").strip()
            if not grade:
                issues.append(QualityIssue(
                    row_number=idx,
                    heat_id=heat_id,
                    column="grade",
                    issue_type="MISSING_VALUE",
                    severity="ERROR",
                    message="Missing steel grade designation."
                ))
                row_has_error = True
                
            # 3. Energy check
            energy_val = row.get("energy_mwh_per_t", "").strip()
            if not energy_val:
                issues.append(QualityIssue(
                    row_number=idx,
                    heat_id=heat_id,
                    column="energy_mwh_per_t",
                    issue_type="MISSING_VALUE",
                    severity="WARNING",
                    message="Missing energy intensity value — this heat cannot be fully validated."
                ))
            else:
                try:
                    val = float(energy_val)
                    if val < 0.5 or val > 5.0:
                        issues.append(QualityIssue(
                            row_number=idx,
                            heat_id=heat_id,
                            column="energy_mwh_per_t",
                            issue_type="RANGE_VIOLATION",
                            severity="WARNING",
                            message=f"Energy intensity {val} MWh/t is outside standard range [0.5, 5.0]."
                        ))
                except ValueError:
                    issues.append(QualityIssue(
                        row_number=idx,
                        heat_id=heat_id,
                        column="energy_mwh_per_t",
                        issue_type="INVALID_FORMAT",
                        severity="ERROR",
                        message=f"Invalid numeric format for energy intensity: '{energy_val}'."
                    ))
                    row_has_error = True

            # 4. Yield check
            yield_val = row.get("yield_pct", "").strip()
            if not yield_val:
                issues.append(QualityIssue(
                    row_number=idx,
                    heat_id=heat_id,
                    column="yield_pct",
                    issue_type="MISSING_VALUE",
                    severity="WARNING",
                    message="Missing yield value — this heat cannot be fully validated."
                ))
            else:
                try:
                    y_val = float(yield_val)
                    if y_val < 50.0 or y_val > 100.0:
                        issues.append(QualityIssue(
                            row_number=idx,
                            heat_id=heat_id,
                            column="yield_pct",
                            issue_type="RANGE_VIOLATION",
                            severity="ERROR",
                            message=f"Yield {y_val}% is outside physical boundary [50%, 100%]."
                        ))
                        row_has_error = True
                except ValueError:
                    issues.append(QualityIssue(
                        row_number=idx,
                        heat_id=heat_id,
                        column="yield_pct",
                        issue_type="INVALID_FORMAT",
                        severity="ERROR",
                        message=f"Invalid numeric format for yield: '{yield_val}'."
                    ))
                    row_has_error = True
                    
            if row_has_error:
                error_rows_set.add(idx)
            else:
                valid_rows_count += 1

        error_rows = len(error_rows_set)
        warning_rows = len(set(i.row_number for i in issues if i.severity == "WARNING"))
        quality_score = round(((total_rows - error_rows) / max(1, total_rows)) * 100, 1) if total_rows > 0 else 0.0
        
        return ImportPreviewResult(
            total_rows=total_rows,
            valid_rows=valid_rows_count,
            error_rows=error_rows,
            warning_rows=warning_rows,
            quality_score_pct=quality_score,
            detected_columns=headers,
            sample_preview=rows[:8],
            issues=issues[:25],  # Top 25 issues for review
            can_import=total_rows > 0 and valid_rows_count > 0
        )

    @classmethod
    def get_template_csv(cls) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(cls.ALL_TEMPLATE_COLUMNS)
        # Sample illustrative rows
        writer.writerow([
            "CW-VAL-TEMPLATE-01", "2026-09-01", "304", "100.0", "98.4",
            "71.5", "70.1", "SS 304 Heavy Scrap", "Certified Yard A",
            "FeCr + FeNi", "4.2", "182.0", "1.85",
            "Grid", "Natural Gas", "12.0", "92.4",
            "PASS", "0", "0", "0.36", "1.33", "2.31", "2.31"
        ])
        writer.writerow([
            "CW-VAL-TEMPLATE-02", "2026-09-02", "304", "100.0", "97.8",
            "74.0", "73.5", "SS 304 Heavy Scrap", "Certified Yard B",
            "FeCr + FeNi", "3.9", "175.0", "1.79",
            "Grid", "Natural Gas", "11.5", "91.9",
            "PASS", "0", "0", "0.38", "1.29", "2.29", "2.29"
        ])
        return output.getvalue()
