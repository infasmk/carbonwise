import React, { useState, useEffect } from 'react';
import { 
  HeatInput, 
  CarbonBreakdown, 
  ScenarioItem, 
  DecisionResult, 
  EmissionFactor, 
  GradeConstraint, 
  ProcessConstraint, 
  BenchmarkMetric, 
  ValidationSummary, 
  ValidationHeatRecord, 
  DecisionRecord 
} from './types';
import { api, calculateCarbonLocal } from './services/api';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';

// Features
import { LandingHero } from './features/landing/LandingHero';
import { DashboardView } from './features/dashboard/DashboardView';
import { HeatPlannerView } from './features/heat-planner/HeatPlannerView';
import { ScenarioLabView } from './features/scenarios/ScenarioLabView';
import { FeasibilityEngineView } from './features/feasibility/FeasibilityEngineView';
import { ValidationCenterView } from './features/validation/ValidationCenterView';
import { DataHubView } from './features/data-hub/DataHubView';
import { BenchmarkDashboardView } from './features/benchmarks/BenchmarkDashboardView';
import { DecisionHistoryView } from './features/decisions/DecisionHistoryView';
import { FactorRegistryView } from './features/factors/FactorRegistryView';
import { ReportsView } from './features/reports/ReportsView';
import { ProductStoryView } from './features/product-story/ProductStoryView';
import { SettingsView } from './features/settings/SettingsView';
import { JuryDemoTour, JURY_TOUR_STEPS } from './features/jury/JuryDemoTour';

export function App() {
  const [currentModule, setCurrentModule] = useState<string>('landing');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Default Illustrative Demo Heat (Section 9)
  const [heat, setHeat] = useState<HeatInput>({
    heat_id: "CW-DEMO-101",
    grade: "304",
    target_tonnage: 100.0,
    planning_date: "2026-09-29",
    scrap_mix_pct: 70.1,
    scrap_type: "SS 304 Heavy Recycled Scrap",
    scrap_quality: "Grade A (Low Tramp Cu < 0.25%)",
    scrap_source: "Certified Domestic Yard",
    alloy_additions_pct: 4.2,
    energy_source: "Grid",
    electricity_intensity_mwh_per_t: 1.85,
    grid_emission_factor: 0.719,
    fuel_type: "Natural Gas (Ladle Preheat)",
    fuel_consumption_nm3_per_t: 12.0,
    expected_yield_pct: 92.4,
    eaf_tap_to_tap_min: 68.0
  });

  const [carbon, setCarbon] = useState<CarbonBreakdown>(() => calculateCarbonLocal(heat));
  const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);
  const [decision, setDecision] = useState<DecisionResult | null>(null);

  // Domain records
  const [factors, setFactors] = useState<EmissionFactor[]>([]);
  const [gradeConstraints, setGradeConstraints] = useState<GradeConstraint[]>([]);
  const [processConstraints, setProcessConstraints] = useState<ProcessConstraint[]>([]);
  const [benchmarks, setBenchmarks] = useState<BenchmarkMetric[]>([]);
  const [decisionsHistory, setDecisionsHistory] = useState<DecisionRecord[]>([]);

  // Validation Store
  const [validationSummary, setValidationSummary] = useState<ValidationSummary>({
    has_data: false,
    dataset_name: "None",
    total_heats_analyzed: 0,
    grades_covered: [],
    completeness_pct: 0.0,
    status_notice: "Validation data not imported yet. Import approved historical heat data to calculate model validation metrics.",
    methodology_citation: "ISO 14064-3 / GHG Protocol Scope 1 & 2 Verification Standards"
  });
  const [validationHeats, setValidationHeats] = useState<ValidationHeatRecord[]>([]);

  // UI state
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isSavingDecision, setIsSavingDecision] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Jury Tour state
  const [isJuryTourOpen, setIsJuryTourOpen] = useState<boolean>(false);
  const [juryTourStepIndex, setJuryTourStepIndex] = useState<number>(0);

  // Initial load
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [facs, gc, pc, bm, decs, valSum, valHeats] = await Promise.all([
          api.getFactors(),
          api.getGradeConstraints(),
          api.getProcessConstraints(),
          api.getBenchmarks(),
          api.getDecisions(),
          api.getValidationSummary(),
          api.getValidationHeats()
        ]);
        setFactors(facs);
        setGradeConstraints(gc);
        setProcessConstraints(pc);
        setBenchmarks(bm);
        setDecisionsHistory(decs);
        setValidationSummary(valSum);
        setValidationHeats(valHeats);
      } catch (e) {
        console.error("Initial data load error:", e);
      }
    }
    loadInitialData();
  }, []);

  // Update carbon and scenarios whenever heat changes
  useEffect(() => {
    let isMounted = true;
    async function reevaluate() {
      setIsCalculating(true);
      try {
        const [newCarbon, newScenarios, newDecision] = await Promise.all([
          api.calculate(heat),
          api.getScenarios(heat),
          api.evaluateDecision(heat)
        ]);
        if (isMounted) {
          setCarbon(newCarbon);
          setScenarios(newScenarios);
          setDecision(newDecision);
        }
      } catch (err) {
        if (isMounted) {
          const fallbackCarbon = calculateCarbonLocal(heat);
          setCarbon(fallbackCarbon);
        }
      } finally {
        if (isMounted) setIsCalculating(false);
      }
    }
    reevaluate();
    return () => { isMounted = false; };
  }, [heat]);

  // Handle committing decision into history
  const handleCommitDecision = async (selectedScenario: ScenarioItem) => {
    setIsSavingDecision(true);
    try {
      const decisionPayload = {
        heat_id: heat.heat_id,
        planning_date: heat.planning_date,
        grade: heat.grade,
        target_tonnage: heat.target_tonnage,
        current_co2e_per_t: carbon.total_co2e_per_t,
        selected_scenario_id: selectedScenario.id,
        selected_scenario_name: selectedScenario.name,
        selected_co2e_per_t: selectedScenario.carbon.total_co2e_per_t,
        potential_avoidance_per_t: Number((carbon.total_co2e_per_t - selectedScenario.carbon.total_co2e_per_t).toFixed(2)),
        potential_avoidance_total_tonnes: Number(((carbon.total_co2e_per_t - selectedScenario.carbon.total_co2e_per_t) * heat.target_tonnage).toFixed(1)),
        rationale: `Selected ${selectedScenario.name} as the lowest-carbon feasible scenario passing all operational gates.`,
        planner: "Senior Planner (Active Session)",
        factor_version: "demo-v1.4",
        accounting_boundary: "Scope 1 + Scope 2 (Location-based)"
      };

      await api.saveDecision(decisionPayload);
      const updatedDecisions = await api.getDecisions();
      setDecisionsHistory(updatedDecisions);

      setToastMessage(`Decision locked! Heat ${heat.heat_id} committed with ${selectedScenario.name} (${selectedScenario.carbon.total_co2e_per_t.toFixed(2)} tCO2e/t).`);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingDecision(false);
    }
  };

  // Seed / Clear validation
  const handleLoadDemoValidation = async () => {
    await api.seedDemoValidation();
    const sum = await api.getValidationSummary();
    const heats = await api.getValidationHeats();
    setValidationSummary(sum);
    setValidationHeats(heats);
    setToastMessage("Illustrative demo validation dataset loaded (50 heats).");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleClearValidation = async () => {
    await api.clearValidation();
    const sum = await api.getValidationSummary();
    const heats = await api.getValidationHeats();
    setValidationSummary(sum);
    setValidationHeats(heats);
    setToastMessage("Validation data cleared. Center returned to 'No data imported' state.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Jury Demo tour navigation helper
  const handleJuryStepChange = (newIndex: number) => {
    setJuryTourStepIndex(newIndex);
    const targetModule = JURY_TOUR_STEPS[newIndex]?.module;
    if (targetModule) setCurrentModule(targetModule);
  };

  return (
    <div className="min-h-screen bg-industrial-950 flex flex-col font-sans text-industrial-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 p-3.5 rounded-lg bg-status-success text-white font-mono text-xs shadow-elevated flex items-center gap-2 animate-fade-in">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentModule={currentModule}
          onSelectModule={(mod) => setCurrentModule(mod)}
          isOpenMobile={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Content Body */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Header */}
          <Header
            currentModule={currentModule}
            onOpenJuryTour={() => {
              setIsJuryTourOpen(true);
              setJuryTourStepIndex(0);
              setCurrentModule(JURY_TOUR_STEPS[0].module);
            }}
            isJuryModeActive={isJuryTourOpen}
            onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
          />

          {/* Module Content */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            {currentModule === 'landing' && (
              <LandingHero
                onOpenPlanner={() => setCurrentModule('heat-planner')}
                onExplore={() => setCurrentModule('product-story')}
                onOpenJuryTour={() => {
                  setIsJuryTourOpen(true);
                  setJuryTourStepIndex(0);
                  setCurrentModule('heat-planner');
                }}
              />
            )}

            {currentModule === 'dashboard' && (
              <DashboardView
                onNavigate={(mod) => setCurrentModule(mod)}
                recentDecisions={decisionsHistory}
              />
            )}

            {currentModule === 'heat-planner' && (
              <HeatPlannerView
                heat={heat}
                onChangeHeat={(newHeat) => setHeat(newHeat)}
                carbon={carbon}
                onNavigateToScenarios={() => setCurrentModule('scenarios')}
                isCalculating={isCalculating}
              />
            )}

            {currentModule === 'scenarios' && decision && (
              <ScenarioLabView
                scenarios={scenarios}
                decision={decision}
                currentHeat={heat}
                onCommitDecision={handleCommitDecision}
                isSavingDecision={isSavingDecision}
              />
            )}

            {currentModule === 'feasibility' && (
              <FeasibilityEngineView scenarios={scenarios} />
            )}

            {currentModule === 'validation' && (
              <ValidationCenterView
                summary={validationSummary}
                records={validationHeats}
                onLoadDemoDataset={handleLoadDemoValidation}
                onClearDataset={handleClearValidation}
                onNavigateToDataHub={() => setCurrentModule('data-hub')}
                isLoading={false}
              />
            )}

            {currentModule === 'data-hub' && (
              <DataHubView
                onImportComplete={async () => {
                  const sum = await api.getValidationSummary();
                  const heats = await api.getValidationHeats();
                  setValidationSummary(sum);
                  setValidationHeats(heats);
                  setCurrentModule('validation');
                }}
              />
            )}

            {currentModule === 'benchmarks' && (
              <BenchmarkDashboardView benchmarks={benchmarks} />
            )}

            {currentModule === 'decisions' && (
              <DecisionHistoryView decisions={decisionsHistory} />
            )}

            {currentModule === 'factors' && (
              <FactorRegistryView
                factors={factors}
                gradeConstraints={gradeConstraints}
                processConstraints={processConstraints}
              />
            )}

            {currentModule === 'reports' && (
              <ReportsView
                decisions={decisionsHistory}
                currentHeat={heat}
                scenarios={scenarios}
              />
            )}

            {currentModule === 'product-story' && (
              <ProductStoryView />
            )}

            {currentModule === 'settings' && (
              <SettingsView />
            )}
          </main>

          {/* Footer */}
          <Footer onSelectModule={(mod) => setCurrentModule(mod)} />
        </div>
      </div>

      {/* Jury Demo Tour Guided Overlay */}
      {isJuryTourOpen && (
        <JuryDemoTour
          currentStepIndex={juryTourStepIndex}
          onNextStep={() => handleJuryStepChange(Math.min(JURY_TOUR_STEPS.length - 1, juryTourStepIndex + 1))}
          onPrevStep={() => handleJuryStepChange(Math.max(0, juryTourStepIndex - 1))}
          onCloseTour={() => setIsJuryTourOpen(false)}
          onNavigateToModule={(mod) => setCurrentModule(mod)}
        />
      )}
    </div>
  );
}

export default App;
