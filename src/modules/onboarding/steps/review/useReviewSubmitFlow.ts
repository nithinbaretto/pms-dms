import { useCallback, useEffect, useState } from "react";

import { onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import { REVIEW_SECTION_STEP } from "./constants";
import type { CreateApplicationResponse, ReviewDetailsResponse, ReviewSectionId } from "./types";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

type UseReviewSubmitFlowResult = {
  review: ReviewDetailsResponse | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submissionResult: CreateApplicationResponse | null;
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
  const [submissionResult, setSubmissionResult] = useState<CreateApplicationResponse | null>(null);
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
    if (!leadId || isSubmitting || !review) {
      return null;
    }

    setIsSubmitting(true);
    setError(null);
    setSubmitMessage(null);

    try {
      if (review.isSubmit) {
        const response = await onboardingApi.createApplication(leadId);
        setSubmitMessage(response.message || "Application submitted successfully");
        setSubmissionResult(response);
        setIsSubmitted(true);
        return response;
      }

      const esignPayload = {
        email: review.personal.email.trim(),
        leadId,
        mobile: review.personal.mobile.trim(),
        name: review.personal.name.trim(),
        panNumber: review.personal.panNumber.trim().toUpperCase(),
      };

      if (!esignPayload.email || !esignPayload.mobile || !esignPayload.name || !esignPayload.panNumber) {
        setError("Unable to initiate e-sign. Missing personal details.");
        return null;
      }

      const esignCreate = await onboardingApi.createEsign(esignPayload);
      if (!esignCreate.documentId) {
        setError("Unable to initiate e-sign. Missing e-sign document information.");
        return null;
      }

      if (esignCreate.signUrl) {
        window.open(esignCreate.signUrl, "_blank", "noopener,noreferrer");
      }

      const maxPollAttempts = 75;
      for (let attempt = 0; attempt < maxPollAttempts; attempt += 1) {
        await sleep(4000);

        const status = await onboardingApi.getEsignStatus({
          ...esignPayload,
          esignDocumentId: esignCreate.documentId,
        });

        if (status.signed) {
          const response = await onboardingApi.createApplication(leadId);
          setSubmitMessage(response.message || "Application submitted successfully");
          setSubmissionResult(response);
          setIsSubmitted(true);
          return response;
        }

        if (status.rejected) {
          setError("E-sign request was rejected.");
          return null;
        }

        if (status.expired) {
          setError("E-sign request has expired. Please try again.");
          return null;
        }
      }

      setError("E-sign is taking longer than expected. Please try again.");
      return null;
    } catch {
      setError("Unable to complete submission. Please try again.");
      setSubmissionResult(null);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, leadId, review]);

  useEffect(() => {
    void loadReview();
  }, [loadReview]);

  return {
    review,
    isLoading,
    isSubmitting,
    isSubmitted,
    submissionResult,
    error,
    submitMessage,
    loadReview,
    refreshAfterEdit,
    editSection,
    navigateToSection,
    submitApplication,
  };
};
