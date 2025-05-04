import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/ui/button";
import { cva } from "class-variance-authority";

const stepItemVariants = cva("transition-all", {
  variants: {
    variant: {
      dots: "rounded-full w-3 h-3",
      numbers:
        "flex items-center justify-center rounded-full w-8 h-8 text-sm font-medium",
      labels: "flex items-center px-3 py-1 rounded-md text-sm font-medium",
    },
    state: {
      active: "",
      completed: "",
      previous: "",
      default: "",
    },
  },
  compoundVariants: [
    {
      variant: ["dots", "numbers", "labels"],
      state: "active",
      className: "bg-primary text-primary-foreground",
    },
    {
      variant: ["dots", "numbers", "labels"],
      state: "completed",
      className: "bg-primary/20 text-primary",
    },
    {
      variant: ["dots", "numbers", "labels"],
      state: "previous",
      className: "bg-secondary text-secondary-foreground",
    },
    {
      variant: ["dots", "numbers", "labels"],
      state: "default",
      className: "bg-muted text-muted-foreground",
    },
  ],
  defaultVariants: {
    variant: "dots",
    state: "default",
  },
});

interface StepFlowContextType {
  activeStep: number;
  setActiveStep: (step: number) => void;
  totalSteps: number;
  goNext: () => void;
  goBack: () => void;
  markComplete: (step: number) => void;
  completedSteps: Set<number>;
  canGoToNext: boolean;
  steps: Array<{ value: string | number; label?: string; canGoNext?: boolean }>;
  indicatorVariant?: "dots" | "numbers" | "labels";
  setIndicatorVariant: (variant: "dots" | "numbers" | "labels") => void;
}

const StepFlowContext = React.createContext<StepFlowContextType>({
  activeStep: 0,
  setActiveStep: () => undefined,
  totalSteps: 0,
  goNext: () => undefined,
  goBack: () => undefined,
  markComplete: () => undefined,
  completedSteps: new Set<number>(),
  canGoToNext: true,
  steps: [],
  setIndicatorVariant: () => undefined,
});

interface StepFlowProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  indicatorVariant?: "dots" | "numbers" | "labels";
  showIndicator?: boolean;
  allowNavigation?: boolean;
  children: React.ReactNode;
}

export function StepFlow({
  defaultStep = 0,
  onStepChange,
  indicatorVariant = "dots",
  showIndicator = true,
  allowNavigation = false,
  children,
  className,
  ...props
}: StepFlowProps) {
  const [activeStep, setActiveStep] = React.useState<number>(defaultStep || 0);
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(
    new Set()
  );
  const [variant, setVariant] = React.useState(indicatorVariant);

  const steps = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<StepFlowItemProps> =>
        React.isValidElement(child) && child.type === StepFlowItem
    )
    .map((child) => ({
      value: child.props.value,
      label: child.props.label,
      canGoNext: child.props.canGoNext,
    }));

  const totalSteps = steps.length;

  const goNext = () => {
    if (activeStep < totalSteps - 1) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const goBack = () => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  const markComplete = (step: number) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      newSet.add(step);
      return newSet;
    });
  };

  const contextValue = {
    activeStep,
    setActiveStep: (step: number) => {
      setActiveStep(step);
      onStepChange?.(step);
    },
    totalSteps,
    goNext,
    goBack,
    markComplete,
    completedSteps,
    canGoToNext: steps[activeStep]?.canGoNext ?? true,
    steps,
    indicatorVariant: variant,
    setIndicatorVariant: setVariant,
  };

  return (
    <StepFlowContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        {showIndicator && (
          <StepFlowIndicator
            variant={variant}
            allowNavigation={allowNavigation}
          />
        )}
        {children}
      </div>
    </StepFlowContext.Provider>
  );
}

interface StepFlowNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  showBackOnFirst?: boolean;
  showNextOnLast?: boolean;
  backButtonLabel?: string;
  nextButtonLabel?: string;
  lastStepLabel?: string;
  onComplete?: () => void;
}

export function StepFlowNavigation({
  className,
  showBackOnFirst = false,
  showNextOnLast = true,
  backButtonLabel = "Précédent",
  nextButtonLabel = "Suivant",
  lastStepLabel = "Terminer",
  onComplete,
  ...props
}: StepFlowNavigationProps) {
  const { activeStep, totalSteps, goNext, goBack, canGoToNext } =
    React.useContext(StepFlowContext);

  const isLastStep = activeStep === totalSteps - 1;
  const isFirstStep = activeStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
    } else {
      goNext();
    }
  };

  return (
    <div className={cn("flex justify-between mt-4", className)} {...props}>
      {(showBackOnFirst || !isFirstStep) && (
        <Button variant="outline" onClick={goBack} disabled={isFirstStep}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          {backButtonLabel}
        </Button>
      )}

      {(showNextOnLast || !isLastStep) && (
        <Button
          onClick={handleNext}
          className="ml-auto"
          disabled={!canGoToNext}
        >
          {isLastStep ? lastStepLabel : nextButtonLabel}
          {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}

interface StepFlowIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "dots" | "numbers" | "labels";
  allowNavigation?: boolean;
}

export function StepFlowIndicator({
  className,
  variant,
  allowNavigation = false,
  ...props
}: StepFlowIndicatorProps) {
  const { activeStep, setActiveStep, completedSteps, steps, indicatorVariant } =
    React.useContext(StepFlowContext);
  const finalVariant = variant || indicatorVariant || "dots";

  const canNavigateToStep = (idx: number) => {
    if (!allowNavigation) return false;
    return idx < activeStep; // Permet seulement de naviguer vers les étapes précédentes
  };

  const renderIndicator = () => {
    const items = steps.map((step, idx) => {
      const isActive = idx === activeStep;
      const isCompleted = completedSteps.has(idx);
      const isPrevious = idx < activeStep;
      const state = isActive
        ? "active"
        : isCompleted
          ? "completed"
          : isPrevious
            ? "previous"
            : "default";
      const isNavigable = canNavigateToStep(idx);

      const content = (() => {
        switch (finalVariant) {
          case "numbers":
            return isCompleted ? <Check className="h-4 w-4" /> : idx + 1;
          case "labels":
            return (
              <>
                {isCompleted && <Check className="h-4 w-4 mr-1" />}
                {step.label || `Étape ${idx + 1}`}
              </>
            );
          case "dots":
          default:
            return null;
        }
      })();

      return (
        <div
          key={idx}
          onClick={() => isNavigable && setActiveStep(idx)}
          className={cn(
            stepItemVariants({ variant: finalVariant, state }),
            isNavigable &&
              "cursor-pointer hover:bg-primary/90 hover:text-primary-foreground"
          )}
        >
          {content}
        </div>
      );
    });

    return (
      <div className="flex items-center justify-center space-x-2">{items}</div>
    );
  };

  return (
    <div className={cn("flex justify-center my-4", className)} {...props}>
      {renderIndicator()}
    </div>
  );
}

interface StepFlowItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label?: string;
  canGoNext?: boolean;
}

export function StepFlowItem({
  value,
  children,
  className,
  ...props
}: StepFlowItemProps) {
  const { activeStep, steps } = React.useContext(StepFlowContext);
  const currentIndex = steps.findIndex((step) => step.value === value);

  if (currentIndex === -1 || currentIndex !== activeStep) return null;

  return (
    <div className={cn("outline-none transition-all", className)} {...props}>
      {children}
    </div>
  );
}

export function useStepFlow() {
  const context = React.useContext(StepFlowContext);

  if (!context) {
    throw new Error("useStepFlow must be used within a StepFlow component");
  }

  return context;
}
