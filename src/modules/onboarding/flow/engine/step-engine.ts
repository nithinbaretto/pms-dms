import { STEPS } from "../config/steps";
import { isHufEntityJourney } from "../huf-entity-journey";
import type { Step } from "../../types/onboarding-types";

const skipHufStepIfNotApplicable = (step: Step): Step => {
  if (step === "huf-entity-details" && !isHufEntityJourney()) {
    const index = STEPS.indexOf(step);
    return STEPS[index + 1] || step;
  }
  return step;
};

/**
 * Get next step (basic)
 */
export const getNextStep = (currentStep: Step): Step => {
  const index = STEPS.indexOf(currentStep);

  if (index === -1) return STEPS[0];

  const next = STEPS[index + 1] || currentStep;
  return skipHufStepIfNotApplicable(next);
};

/**
 * Get previous step
 */
export const getPrevStep = (currentStep: Step): Step => {
  const index = STEPS.indexOf(currentStep);

  if (index === -1) return STEPS[0];

  let prev = STEPS[index - 1] || currentStep;
  if (prev === "huf-entity-details" && !isHufEntityJourney()) {
    prev = STEPS[index - 2] || currentStep;
  }
  return prev;
};

export const getNextStepWithRules = (currentStep: Step): Step => {
  if (currentStep === "personal-details" && isHufEntityJourney()) {
    return "huf-entity-details";
  }
  return getNextStep(currentStep);
};
