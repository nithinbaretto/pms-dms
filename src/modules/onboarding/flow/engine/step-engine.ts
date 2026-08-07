import { STEPS } from "../config/steps";
import type { Step } from "../../types/onboarding-types";

/**
 * Get next step (basic)
 */
export const getNextStep = (currentStep: Step): Step => {
  const index = STEPS.indexOf(currentStep);

  if (index === -1) return STEPS[0];

  return STEPS[index + 1] || currentStep;
};

/**
 * Get previous step
 */
export const getPrevStep = (currentStep: Step): Step => {
  const index = STEPS.indexOf(currentStep);

  if (index === -1) return STEPS[0];

  return STEPS[index - 1] || currentStep;
};

export const getNextStepWithRules = (currentStep: Step): Step => {
  return getNextStep(currentStep);
};