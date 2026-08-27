export const BANK_DETAILS_STEP_LABEL = "Step 3 of 6";
export const BANK_DETAILS_PROGRESS_PERCENT = 50;

/** Default vendor for reverse penny drop until product configures otherwise. */
export const DEFAULT_RPD_VENDOR =
  (import.meta.env.VITE_PMS_REVERSE_PENNY_DROP_VENDOR as string | undefined)?.trim() || "hyperverge";

/** Penny-drop call fixed request fields used by DMS UAT. */
export const PENNY_DROP_DEFAULTS = {
  Golden_Master: "Y",
  Match_Percentage: "80",
  PennyDrop: "Y",
  Source: "DMS",
} as const;

export const QR_POLL_INTERVAL_MS = 4000;
export const QR_DEFAULT_EXPIRY_SECONDS = 600;

/** Backend metadata for cancelled-cheque upload-document. */
export const CANCELLED_CHEQUE_DOC_META = {
  documentName: "cancelledCheque",
  documentType: "cancelledCheque",
} as const;

export const CHEQUE_ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"] as const;
export const CHEQUE_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
