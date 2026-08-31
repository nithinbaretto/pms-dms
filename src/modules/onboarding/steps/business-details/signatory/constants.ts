import type { BusinessEntityType } from "./types";

/**
 * Proprietorship Entity Type + Authorized Signatory on Business Details.
 * Hidden until backend returns the journey type. Map that type here when APIs are ready.
 */
export const SHOW_PROPRIETORSHIP_SIGNATORY = false;

export const ENTITY_TYPE_OPTIONS: BusinessEntityType[] = ["Individual", "Sole Proprietorship"];

export const DEFAULT_BUSINESS_ENTITY_TYPE: BusinessEntityType = "Sole Proprietorship";

export const SIGNATORY_COPY = {
  entityTitle: "Entity Details",
  entityDescription: "Choose your entity type to enable the relevant business and registration details.",
  entityTypeLabel: "Entity Type",
  title: "Authorized Signatory",
  description:
    "Add the individuals authorized to sign on behalf of this entity. Each signatory's details will be verified before your onboarding is approved.",
  addLabel: "Add Signatory",
  emptyTitle: "No signatories added yet",
  emptyDescription: "Add at least one authorized signatory to proceed to the next step.",
  jointlyHint: "All the authorized signatories will be automatically selected",
  anyHint: "Choose any one or multiple authorized signatories",
} as const;

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_PATTERN = /^\d{10}$/;
export const NAME_PATTERN = /^[A-Za-z]+(?:[ .'][A-Za-z]+)*$/;

export const SIGNATORY_ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"] as const;
export const SIGNATORY_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
