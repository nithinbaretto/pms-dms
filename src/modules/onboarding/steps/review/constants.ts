import type { Step } from "../../types/onboarding-types";
import type { ReviewSectionId } from "./types";

export const REVIEW_SECTION_LABELS: Record<ReviewSectionId, string> = {
  personal: "Personal Information",
  business: "Business Details",
  bank: "Bank Details",
  nominee: "Nominee Details",
  documents: "Uploaded Documents",
};

export const REVIEW_SECTION_STEP: Record<ReviewSectionId, Step> = {
  personal: "personal-details",
  business: "business-details",
  bank: "bank-details",
  nominee: "nominee-details",
  documents: "upload-documents",
};
