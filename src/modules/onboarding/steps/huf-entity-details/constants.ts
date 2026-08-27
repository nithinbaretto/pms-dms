export const HUF_ENTITY_TYPE = "HUF";

export const HUF_ENTITY_DETAILS_COPY = {
  pageTitle: "Entity Details",
  pageSubtitle:
    "Your details have been fetched from APMI. Fields shown in grey cannot be changed",
  stepLabel: "Step 2 of 6",
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
/** Mock fetch succeeds only for this PAN. Any other valid PAN opens manual entry. */
export const MOCK_KARTA_SUCCESS_PAN = "EJSPT8485H";
export const KARTA_FETCH_DELAY_MS = 600;

export const KARTA_PROOF_OPTIONS = ["PAN", "Aadhar", "Driving License", "Passport"] as const;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_PATTERN = /^\d{10}$/;

export const KARTA_ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"] as const;
export const KARTA_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export const COPARCENER_RELATIONSHIP_OPTIONS = [
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Spouse",
  "Wife",
  "Husband",
  "Brother",
  "Sister",
  "Grandfather",
  "Grandmother",
  "Grandson",
  "Granddaughter",
] as const;
