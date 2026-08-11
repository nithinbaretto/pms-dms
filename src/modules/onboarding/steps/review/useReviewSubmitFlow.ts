import { useCallback, useEffect, useState } from "react";

import { onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import { REVIEW_SECTION_STEP } from "./constants";
import type { CreateApplicationResponse, ReviewDetailsResponse, ReviewSectionId } from "./types";

type UseReviewSubmitFlowResult = {
  review: ReviewDetailsResponse | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  submitMessage: string | null;
  loadReview: () => Promise<void>;
  refreshAfterEdit: () => Promise<void>;
  editSection: (sectionId: ReviewSectionId) => void;
  navigateToSection: (sectionId: ReviewSectionId) => void;
  submitApplication: () => Promise<CreateApplicationResponse | null>;
};

export const useReviewSubmitFlow = (
  onEditSection?: (sectionId: ReviewSectionId) => void,
): UseReviewSubmitFlowResult => {
  const leadId = useOnboardingStore((state) => state.leadId);
  const setStep = useOnboardingStore((state) => state.setStep);
  const setIsEditMode = useOnboardingStore((state) => state.setIsEditMode);

  const [review, setReview] = useState<ReviewDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const loadReview = useCallback(async (): Promise<void> => {
    if (!leadId) {
      setError("Unable to load review details. Missing lead information.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await onboardingApi.getApplicationReviewDetails(leadId);
      setReview(response);
    } catch {
      setError("Unable to load application review details. Please try again.");
      setReview(null);
    } finally {
      setIsLoading(false);
    }
  }, [leadId]);

  const refreshAfterEdit = useCallback(async (): Promise<void> => {
    await loadReview();
  }, [loadReview]);

  const navigateToSection = useCallback(
    (sectionId: ReviewSectionId): void => {
      setIsEditMode(true);
      setStep(REVIEW_SECTION_STEP[sectionId]);
    },
    [setIsEditMode, setStep],
  );

  const editSection = useCallback(
    (sectionId: ReviewSectionId): void => {
      if (onEditSection) {
        onEditSection(sectionId);
        return;
      }

      navigateToSection(sectionId);
    },
    [navigateToSection, onEditSection],
  );

  const submitApplication = useCallback(async (): Promise<CreateApplicationResponse | null> => {
    if (!leadId || isSubmitting) {
      return null;
    }

    setIsSubmitting(true);
    setError(null);
    setSubmitMessage(null);

    try {
      const response = await onboardingApi.createApplication(leadId);
      setSubmitMessage(response.message || "Application submitted successfully");
      setIsSubmitted(true);
      return response;
    } catch {
      setError("Unable to submit application. Please try again.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, leadId]);

  useEffect(() => {
    void loadReview();
  }, [loadReview]);

  return {
    review,
    isLoading,
    isSubmitting,
    isSubmitted,
    error,
    submitMessage,
    loadReview,
    refreshAfterEdit,
    editSection,
    navigateToSection,
    submitApplication,
  };
};
