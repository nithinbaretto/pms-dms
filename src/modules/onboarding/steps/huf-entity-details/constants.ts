export const HUF_ENTITY_TYPE = "HUF";

export const HUF_ENTITY_DETAILS_COPY = {
  pageTitle: "Entity Details",
  pageSubtitle:
    "Your details have been fetched from APMI. Fields shown in grey cannot be changed",
  stepLabel: "Step 2 of 7",
  progressPercent: 18,
  nextLabel: "Business Details",
  entitySectionTitle: "Entity Details",
  entitySectionDescription:
    "Choose your entity type to enable the relevant business and registration details.",
  entityTypeLabel: "Entity Type",
  karta: {
    title: "Karta Details",
    description:
      "The Karta is the authorized representative of the HUF. Enter the Karta's details to proceed with the empanelment process.",
    addLabel: "Add Karta",
    editLabel: "Edit Karta",
    emptyTitle: "No Karta Details Found",
    emptyDescription: "Add details of the Karta to proceed with HUF empanelment",
  },
  coparcener: {
    title: "Co-Parcener Details",
    description:
      "Co-parceners are family members who jointly hold rights in the HUF. Enter their details to proceed with the empanelment.",
    addLabel: "Add Co-Parcener",
    emptyTitle: "No Co-Parcener Details Found",
    emptyDescription: "Add co-parceners details to proceed with the HUF empanelment.",
  },
  signatory: {
    title: "Authorized Signatory",
    description:
      "Add the individuals authorized to sign on behalf of this entity. Each signatory's details will be verified before your onboarding is approved.",
    addLabel: "Add Signatory",
    emptyTitle: "No signatories added yet",
    emptyDescription: "Add at least one authorized signatory to proceed to the next step.",
  },
} as const;

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const KARTA_PROOF_OPTIONS = ["PAN", "Aadhar", "Driving License", "Passport"] as const;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_PATTERN = /^\d{10}$/;

export const KARTA_ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"] as const;
export const KARTA_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
export const KARTA_FILE_ERROR_MESSAGE = "File must be PNG, JPEG or PDF up to 2MB";

export const COPARCENER_RELATIONSHIP_OPTIONS = [
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Spouse",
  "Brother",
  "Sister",
  "Grandfather",
  "Grandmother",
  "Grandson",
  "Granddaughter",
] as const;

/** Backend documentName / documentType pairs for entity save. */
export const HUF_ENTITY_DOC_META = {
  karthaPoi: { documentName: "KarthaPOI", documentType: "KarthaPOI" },
  karthaPoa: { documentName: "KarthaPOA", documentType: "KarthaPOA" },
  authSignatoryPoi: { documentName: "AuthSignatoryPOI", documentType: "AuthSignatoryPOI" },
  authSignatoryPoa: { documentName: "AuthSignatoryPOA", documentType: "AuthSignatoryPOA" },
  authSignatorySignature: {
    documentName: "AuthSignatorySpecimenSignature",
    documentType: "AuthSignatorySpecimenSignature",
  },
} as const;

export const AUTH_SIGNATORY_TYPE = {
  karta: "Kartha",
  coparcener: "co-parcener",
  manual: "manual",
} as const;

export const KARTA_PAN_NOT_FOUND_MESSAGE =
  "PAN not found in records. Please enter details manually below.";
