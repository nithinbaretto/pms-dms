import { GST_STATE_OPTIONS } from "../business-details/constants";

export const displayValue = (value: string | undefined | null): string => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "-";
};

export const displayList = (values: string[] | undefined): string => {
  if (!values?.length) {
    return "-";
  }

  return values.map((item) => item.trim()).filter(Boolean).join(", ") || "-";
};

export const displayYesNo = (value: boolean): string => {
  return value ? "Uploaded" : "Pending";
};

/** Figma review cards show GST state as 2-letter code (e.g. MH). */
export const toGstStateCode = (state: string | undefined | null): string => {
  const trimmed = state?.trim() ?? "";
  if (!trimmed) {
    return "";
  }

  const byCode = GST_STATE_OPTIONS.find(
    (option) => option.code.toLowerCase() === trimmed.toLowerCase(),
  );
  if (byCode) {
    return byCode.code;
  }

  const byLabel = GST_STATE_OPTIONS.find(
    (option) => option.label.toLowerCase() === trimmed.toLowerCase(),
  );
  if (byLabel) {
    return byLabel.code;
  }

  return trimmed.toUpperCase();
};

