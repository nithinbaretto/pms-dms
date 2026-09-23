import { isSoleProprietorshipEntityType } from "../../personal-details/helpers";
import type { BusinessEntityType } from "./types";

/** PMS Individual: lock tabs and pre-select from personal details entity type. */
export const isPmsIndividualEntityTypeLocked = (currentFlow: string): boolean =>
  currentFlow === "pms-individual";

export const shouldShowAuthorizedSignatory = (
  personalEntityType: string,
  selectedEntityType: BusinessEntityType,
): boolean =>
  isSoleProprietorshipEntityType(personalEntityType) && selectedEntityType === "Sole Proprietorship";

export const ENTITY_TYPE_OPTIONS: BusinessEntityType[] = ["Individual", "Sole Proprietorship"];

export const DEFAULT_BUSINESS_ENTITY_TYPE: BusinessEntityType = "Sole Proprietorship";

export const SIGNATORY_COPY = {
  entityTitle: "Entity Details",
  entityDescription: "Choose your entity type to enable the relevant business and registration details.",
  entityTypeLabel: "Entity Type",
  entitySelectionCaption:
    "Please ensure the correct entity type is selected before proceeding.",
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
export const SIGNATORY_FILE_ERROR_MESSAGE = "File must be PNG, JPEG or PDF up to 2MB";

/** Backend documentName / documentType pairs for Sole Prop signatory save. */
export const BUSINESS_SIGNATORY_DOC_META = {
  identity: { documentName: "authSingatoryPoI", documentType: "authSingatoryPOI" },
  address: { documentName: "authSingatoryPOA", documentType: "authSingatoryPOA" },
  signature: { documentName: "authSingatorySingature", documentType: "authSingatorySingature" },
} as const;
