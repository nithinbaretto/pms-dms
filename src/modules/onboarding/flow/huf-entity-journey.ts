import { useOnboardingStore } from "../state/onboarding-store";

/** HUF Entity Details applies when personal details entity type is HUF (PMS + AIF). */
export const isHufEntityJourney = (): boolean => {
  const entityType =
    useOnboardingStore.getState().personalDetails?.personalDetails.entityType ?? "";
  return entityType.trim().toLowerCase() === "huf";
};

/** After personal details save, HUF inserts entity step before business details. */
export const resolveStepAfterPersonalDetails = (
  entityType: string,
  mappedStep: string | null,
): string | null => {
  if (entityType.trim().toLowerCase() === "huf") {
    return "huf-entity-details";
  }
  return mappedStep;
};
