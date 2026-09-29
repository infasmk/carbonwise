import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Flame, 
  FlaskConical, 
  AlertTriangle, 
  Scale, 
  Target 
} from 'lucide-react';

export interface TourStep {
  step: number;
  title: string;
  module: string;
  script: string;
  actionLabel?: string;
  targetExplanation: string;
}

interface JuryDemoTourProps {
  currentStepIndex: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onCloseTour: () => void;
  onNavigateToModule: (module: string) => void;
}

export const JURY_TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: "1. Baseline Heat Model (2.31 tCO2e/t)",
    module: "heat-planner",
    script: "Welcome to CarbonWise. We begin with a scheduled 100t heat of Grade 304: 70.1% scrap, 1.85 MWh/t energy intensity, 0.719 grid factor. Notice the transparent calculation: 1.85 × 0.719 (1.33) + 0.62 alloy + 0.36 scrap = 2.31 tCO2e/finished tonne.",
    actionLabel: "View Heat Planner",
    targetExplanation: "Contributor terms are already per finished tonne; no second yield adjustment applied by default."
  },
  {
    step: 2,
    title: "2. Real-Time Sensitivity Dynamics",
    module: "heat-planner",
    script: "Adjusting scrap blend or electricity intensity updates carbon immediately. What moves carbon? In the Sensitivity Analysis section, moving energy intensity from 1.85 down to 1.75 cuts emissions substantially.",
    actionLabel: "Explore Sensitivity",
    targetExplanation: "Dynamic reactivity before the production schedule is committed."
  },
  {
    step: 3,
    title: "3. Generate Candidate Scenarios",
    module: "scenarios",
    script: "Now we open Scenario Lab to generate candidate melt configurations: Current baseline (2.31), Scenario A (2.11), Scenario B (2.03), and Scenario C (1.87). Scenario C has the lowest mathematical emissions.",
    actionLabel: "Go to Scenario Lab",
    targetExplanation: "Candidate scenarios represent alternative operational configurations."
  },
  {
    step: 4,
    title: "4. Constraint Rejection: Rejecting Scenario C",
    module: "scenarios",
    script: "CRITICAL MOMENT: Notice that Scenario C is REJECTED! Its expected yield is 79.0%, violating the minimum allowed plant threshold of 80.0%. Lowest carbon is NOT enough — it must also be feasible.",
    actionLabel: "Inspect Why Rejected",
    targetExplanation: "Explainable rejection explicitly states yield 79.0% < min 80.0%."
  },
  {
    step: 5,
    title: "5. Select Lowest-Carbon Feasible (Scenario B)",
    module: "scenarios",
    script: "The CarbonWise Decision Engine filters out rejected candidates and selects Scenario B: 2.03 tCO2e/t. Potential carbon avoidance: 0.28 tCO2e/t, or 28.0 tCO2e avoided for this 100t heat, with zero yield penalty.",
    actionLabel: "Lock Decision",
    targetExplanation: "Potential carbon avoidance (not guaranteed savings) until verified in post-casting."
  },
  {
    step: 6,
    title: "6. Honest Metrology & Validation",
    module: "validation",
    script: "Finally, we visit the Validation Center. Without real imported heats, CarbonWise honestly displays 'Validation data not imported yet'. When historical records are imported, genuine MAE, RMSE, and scatter plots are computed.",
    actionLabel: "View Validation Center",
    targetExplanation: "Never fabricate validation metrics or live JSL claims."
  }
];

export const JuryDemoTour: React.FC<JuryDemoTourProps> = ({
  currentStepIndex,
  onNextStep,
  onPrevStep,
  onCloseTour,
  onNavigateToModule
}) => {
  const currentStep = JURY_TOUR_STEPS[currentStepIndex] || JURY_TOUR_STEPS[0];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === JURY_TOUR_STEPS.length - 1;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-[480px] z-50 animate-fade-in">
      <div className="industrial-card p-5 border-2 border-orange-brand bg-industrial-900/95 backdrop-blur-md rounded-xl shadow-elevated space-y-3 font-mono">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-industrial-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-brand animate-ping" />
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JURY DEMO SCRIPT ({currentStepIndex + 1}/{JURY_TOUR_STEPS.length})</span>
            </span>
          </div>

          <button
            onClick={onCloseTour}
            className="text-industrial-400 hover:text-industrial-100 p-1 text-xs"
            title="Exit Jury Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Title & Content */}
        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-industrial-100 font-sans">
            {currentStep.title}
          </h4>
          <p className="text-xs text-industrial-300 leading-relaxed font-sans">
            {currentStep.script}
          </p>
          <div className="p-2 rounded bg-industrial-950 border border-industrial-800 text-[11px] text-orange-300/90 italic">
            <strong>Key Principle:</strong> {currentStep.targetExplanation}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-industrial-950 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-orange-brand h-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / JURY_TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Navigation CTAs */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => onNavigateToModule(currentStep.module)}
            className="text-[11px] text-orange-400 hover:text-orange-300 underline font-semibold"
          >
            Jump to screen →
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrevStep}
              disabled={isFirst}
              className={`p-1.5 rounded border text-xs ${
                isFirst
                  ? 'border-industrial-800 text-industrial-600 cursor-not-allowed'
                  : 'border-industrial-700 bg-industrial-850 hover:bg-industrial-800 text-industrial-200'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={isLast ? onCloseTour : onNextStep}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-orange-brand hover:bg-orange-bright text-white text-xs font-semibold shadow-sm"
            >
              <span>{isLast ? 'Finish Tour' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
