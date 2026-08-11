import type { GstInItem } from "../../services/onboarding-api";
import { GST_STATE_OPTIONS } from "./constants";
import type { GstRecord, GstRegistrationStatus, ManualGstDraft } from "./types";
import { formatGstName } from "./validation";

export const mapGstInItemToRecord = (item: GstInItem, index: number): GstRecord => {
  const gstNumber = item.gstInId.trim().toUpperCase();
  const registrationStatus: GstRegistrationStatus = gstNumber ? "Registered" : "Unregistered";

  return {
    id: gstNumber || `gst-empty-${index}`,
    gstNumber,
    stateCode: item.gstInState.trim(),
    legalName: formatGstName(item.gstInName),
    selected: item.isSelected,
    fileURL: item.fileURL.trim(),
    registrationStatus,
    // Prefetched from getBusinessDetails — certificate not required.
    requiresCertificate: false,
  };
};

export const mapRecordToGstInItem = (record: GstRecord): GstInItem => {
  return {
    gstInId: record.gstNumber.trim().toUpperCase(),
    gstInName: formatGstName(record.legalName),
    gstInState: record.stateCode.trim(),
    isSelected: record.selected,
    fileURL: record.fileURL.trim(),
  };
};

export const mapDraftToRecord = (draft: ManualGstDraft): GstRecord => {
  const gstNumber = draft.gstNumber.trim().toUpperCase();

  return {
    id: gstNumber || `gst-manual-${Date.now()}`,
    gstNumber,
    stateCode: draft.stateCode.trim(),
    legalName: formatGstName(draft.legalName),
    selected: true,
    fileURL: draft.fileURL.trim(),
    registrationStatus: draft.registrationStatus,
    requiresCertificate: draft.requiresCertificate,
  };
};

export const mapNextInfoSectionToStep = (nextInfoSection: string | undefined): string | null => {
  if (!nextInfoSection?.trim()) {
    return null;
  }

  const normalized = nextInfoSection.trim().toLowerCase().replace(/\s+/g, "-");

  if (normalized.includes("bank")) {
    return "bank-details";
  }

  if (normalized.includes("nominee")) {
    return "nominee-details";
  }

  if (normalized.includes("document")) {
    return "upload-documents";
  }

  if (normalized.includes("review")) {
    return "review-confirm";
  }

  if (normalized.includes("business")) {
    return "business-details";
  }

  return normalized;
};

/** Prefer canonical API state name; fall back to legacy code/label mapping. */
export const resolveStateName = (state: string, stateOptions: string[]): string => {
  const trimmed = state.trim();
  if (!trimmed) {
    return "";
  }

  const fromApi = stateOptions.find((option) => option.toLowerCase() === trimmed.toLowerCase());
  if (fromApi) {
    return fromApi;
  }

  const byCode = GST_STATE_OPTIONS.find(
    (option) => option.code.toLowerCase() === trimmed.toLowerCase(),
  );
  if (byCode) {
    const matchedLabel = stateOptions.find(
      (option) => option.toLowerCase() === byCode.label.toLowerCase(),
    );
    return matchedLabel ?? byCode.label;
  }

  const byLabel = GST_STATE_OPTIONS.find(
    (option) => option.label.toLowerCase() === trimmed.toLowerCase(),
  );
  if (byLabel) {
    const matchedLabel = stateOptions.find(
      (option) => option.toLowerCase() === byLabel.label.toLowerCase(),
    );
    return matchedLabel ?? byLabel.label;
  }

  return trimmed;
};

/** @deprecated Use resolveStateName with API state options. */
export const resolveStateCode = (state: string): string => {
  return resolveStateName(state, GST_STATE_OPTIONS.map((option) => option.label));
};

export const formatStateLabel = (state: string): string => {
  return state
    .trim()
    .split(/\s+/)
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part))
    .join(" ");
};

export const getFallbackStateOptions = (): string[] => {
  return GST_STATE_OPTIONS.map((option) => option.label);
};

/** Prefer structured pincode; otherwise extract a 6-digit PIN from the address line. */
export const extractPincodeFromAddress = (address?: {
  pincode?: string;
  addressLine?: string;
} | null): string => {
  if (!address) {
    return "";
  }

  const direct = address.pincode?.trim() ?? "";
  if (/^\d{6}$/.test(direct)) {
    return direct;
  }

  const match = (address.addressLine ?? "").match(/\b(\d{6})\b/);
  return match?.[1] ?? "";
};
