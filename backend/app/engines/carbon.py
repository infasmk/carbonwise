from app.schemas.heat import HeatInput, CarbonBreakdown, CalculationStep

class CarbonEngine:
    @staticmethod
    def calculate(heat: HeatInput) -> CarbonBreakdown:
        """
        Calculates carbon intensity per finished tonne for a stainless steel heat.
        Formula:
          Total CO2e/t = (Energy Intensity MWh/t * Grid Factor tCO2e/MWh) + Alloy Term + Scrap Route Term
        
        Methodology Note:
          Contributor terms are expressed per finished tonne; no second yield adjustment is applied.
        """
        # 1. Energy contribution
        energy_co2e = round(heat.electricity_intensity_mwh_per_t * heat.grid_emission_factor, 4)
        
        # 2. Alloy contribution (default 0.62 for 304, scaled slightly if custom grade)
        base_alloy = 0.62
        if heat.grade == "316":
            base_alloy = 0.84  # higher alloy content (Mo + extra Ni)
        elif heat.grade == "430":
            base_alloy = 0.38  # ferritic (no Ni)
            
        alloy_co2e = round(base_alloy, 4)
        
        # 3. Scrap-route contribution (scrap preparation, processing, logistics, and tramp handling)
        # Default 0.36 for 70.1% scrap, scales smoothly with scrap blend
        scrap_base = 0.36
        if heat.scrap_mix_pct > 0:
            # Slight adjustment based on scrap ratio relative to 70.1% baseline
            scrap_co2e = round(scrap_base * (heat.scrap_mix_pct / 70.1), 4)
        else:
            scrap_co2e = 0.10  # virgin pig iron / DRI handling baseline
            
        total_co2e = round(energy_co2e + alloy_co2e + scrap_co2e, 4)
        
        # Calculate percentages
        if total_co2e > 0:
            energy_pct = round((energy_co2e / total_co2e) * 100, 1)
            alloy_pct = round((alloy_co2e / total_co2e) * 100, 1)
            scrap_pct = round((scrap_co2e / total_co2e) * 100, 1)
        else:
            energy_pct, alloy_pct, scrap_pct = 0.0, 0.0, 0.0
            
        steps = [
            CalculationStep(
                component="Energy Carbon",
                formula=f"{heat.electricity_intensity_mwh_per_t:.2f} MWh/t × {heat.grid_emission_factor:.3f} tCO2e/MWh",
                value=energy_co2e,
                percentage=energy_pct
            ),
            CalculationStep(
                component="Alloy Contribution",
                formula=f"Ferro-chrome + Ferro-nickel addition factor for Grade {heat.grade}",
                value=alloy_co2e,
                percentage=alloy_pct
            ),
            CalculationStep(
                component="Scrap Route",
                formula=f"Recycled scrap processing, handling & charging at {heat.scrap_mix_pct:.1f}% blend",
                value=scrap_co2e,
                percentage=scrap_pct
            ),
        ]
        
        return CarbonBreakdown(
            total_co2e_per_t=total_co2e,
            energy_co2e_per_t=energy_co2e,
            alloy_co2e_per_t=alloy_co2e,
            scrap_route_co2e_per_t=scrap_co2e,
            energy_pct=energy_pct,
            alloy_pct=alloy_pct,
            scrap_pct=scrap_pct,
            methodology_note="Operational pre-melt calculation basis. Contributor terms are expressed per finished tonne; no second yield adjustment is applied.",
            is_demo=False,
            notice="OPERATIONAL PRE-MELT INTELLIGENCE — CALIBRATED BASELINE",
            calculation_steps=steps
        )
