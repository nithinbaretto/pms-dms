import type { GstRecord } from "./types";

/** Standard Indian GSTIN format. */
const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const isValidGstNumber = (gstNumber: string): boolean => {
  return GSTIN_PATTERN.test(gstNumber.trim().toUpperCase());
};

export const isDuplicateGstNumber = (gstNumber: string, existingGstNumbers: string[]): boolean => {
  const normalized = gstNumber.trim().toUpperCase();
  if (!normalized) {
    return false;
  }

  return existingGstNumbers.some((item) => item.trim().toUpperCase() === normalized);
};

/** Max characters (including spaces) for Legal Name entered in Add GST. */
export const GST_LEGAL_NAME_MAX_LENGTH = 50;

const normalizeGstLegalName = (value: string): string => {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/ {2,}/g, " ")
    .replace(/^ +/, "");
};

export const sanitizeGstLegalName = (value: string): string => {
  return normalizeGstLegalName(value).slice(0, GST_LEGAL_NAME_MAX_LENGTH);
};

export const formatGstName = (name: string): string => {
  return normalizeGstLegalName(name).trim();
};

export const requireBranchSelection = (selectedBranch: string): boolean => {
  return selectedBranch.trim().length > 0;
};

/** GST is optional when the distributor has none. Entries present must be valid if selected. */
export const requireAtLeastOneGst = (records: GstRecord[]): boolean => {
  if (records.length === 0) {
    return true;
  }

  return records.some((record) => record.selected);
};

export const isSelectedGstComplete = (record: GstRecord): boolean => {
  if (!record.selected) {
    return true;
  }

  const hasName = formatGstName(record.legalName).length > 0;
  const hasState = record.stateCode.trim().length > 0;
  const hasFile = !record.requiresCertificate || record.fileURL.trim().length > 0;

  // Unregistered (blank GST) / failed validate — certificate + name/state.
  if (!record.gstNumber.trim()) {
    return hasName && hasState && hasFile;
  }

  return isValidGstNumber(record.gstNumber) && hasName && hasState && hasFile;
};

export const isBusinessDetailsStepValid = (
  selectedBranch: string,
  records: GstRecord[],
): boolean => {
  if (!requireBranchSelection(selectedBranch)) {
    return false;
  }

  if (records.length === 0) {
    // No GST — optional step; branch alone is enough.
    return true;
  }

  if (!requireAtLeastOneGst(records)) {
    return false;
  }

  return records.filter((record) => record.selected).every(isSelectedGstComplete);
};
