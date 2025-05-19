import { ReactElement, useState, useEffect } from "react";

export function useMultiStepForm(steps: ReactElement[], formId: string) {
  // Function to get step index from URL
  const getStepFromUrl = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const stepParam = urlParams.get(`step-${formId}`);
      if (stepParam !== null) {
        const stepIndex = parseInt(stepParam, 10);
        if (!isNaN(stepIndex) && stepIndex >= 0 && stepIndex < steps.length) {
          return stepIndex;
        }
      }
    }
    return 0;
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Update the step from URL when component is mounted
  useEffect(() => {
    const urlStep = getStepFromUrl();
    if (urlStep !== currentStepIndex) {
      setCurrentStepIndex(urlStep);
    }
  }, []);

  // Update URL when step changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set(`step-${formId}`, currentStepIndex.toString());
      window.history.replaceState({}, "", url.toString());
    }
  }, [currentStepIndex, formId]);

  function next() {
    setDirection(1);
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  }

  function back() {
    setDirection(-1);
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  }

  function goTo(index: number) {
    if (index >= 0 && index < steps.length) {
      setDirection(index > currentStepIndex ? 1 : -1);
      setCurrentStepIndex(index);
    }
  }

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    goTo,
    next,
    back,
    direction,
  };
}
