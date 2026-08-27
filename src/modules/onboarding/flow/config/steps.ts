import type { Step } from "../../types/onboarding-types";
import { SHOW_HUF_ENTITY_DETAILS } from "../huf-entity-journey";

export const STEPS: Step[] = [
  ...(SHOW_HUF_ENTITY_DETAILS ? (["huf-entity-details"] as const) : []),
  "entity-details",
  "business-category",
  "onboarding-method",
  "verify-contact",
  "aprn-verification",
  "otp-verification",
  "personal-details",
  "business-details",
  "bank-details",
  "nominee-details",
  "upload-documents",
  "review-confirm",
];