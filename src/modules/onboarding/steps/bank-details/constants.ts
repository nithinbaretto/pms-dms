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
