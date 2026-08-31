import { EMAIL_PATTERN, MOBILE_PATTERN, NAME_PATTERN, PAN_REGEX } from "./constants";
import type { SignatoryDetails } from "./types";

export const createSignatoryId = (): string =>
  `signatory-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createEmptySignatory = (): SignatoryDetails => ({
  id: createSignatoryId(),
  name: "",
  pan: "",
  mobile: "",
  email: "",
  selected: true,
  identityDocument: null,
  addressDocument: null,
  signatureDocument: null,
});

export const isValidPan = (value: string): boolean => PAN_REGEX.test(value.trim().toUpperCase());

export const isValidSignatoryName = (value: string): boolean => NAME_PATTERN.test(value.trim());

export const formatMobileDisplay = (mobile: string): string => {
  const digits = mobile.replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  return `+91 ${digits}`;
};

export const isSignatoryFormValid = (
  draft: SignatoryDetails,
  existing: SignatoryDetails[],
): boolean => {
  const pan = draft.pan.trim().toUpperCase();
  const duplicatePan = existing.some((item) => item.pan === pan && item.id !== draft.id);

  return Boolean(
    isValidSignatoryName(draft.name) &&
    isValidPan(pan) &&
    !duplicatePan &&
    MOBILE_PATTERN.test(draft.mobile) &&
    EMAIL_PATTERN.test(draft.email.trim()) &&
    draft.identityDocument &&
    draft.addressDocument &&
    draft.signatureDocument,
  );
};

export const getPanError = (pan: string, draftId: string, existing: SignatoryDetails[]): string | null => {
  const normalized = pan.trim().toUpperCase();
  if (normalized.length !== 10) {
    return null;
  }

  if (existing.some((item) => item.pan === normalized && item.id !== draftId)) {
    return "This PAN is already added";
  }

  if (!isValidPan(normalized)) {
    return "Entered PAN is invalid";
  }

  return null;
};

export const isSignatoryStepComplete = (
  signatories: SignatoryDetails[],
  mode: "jointly" | "any",
  anyCount: number,
): boolean => {
  if (signatories.length === 0) {
    return false;
  }

  if (mode === "jointly") {
    return signatories.length >= 1;
  }

  const selectedCount = signatories.filter((item) => item.selected).length;
  return selectedCount >= 1 && anyCount >= 1 && anyCount <= selectedCount;
};
