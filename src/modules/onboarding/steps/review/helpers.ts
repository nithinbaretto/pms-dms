import { GST_STATE_OPTIONS } from "../business-details/constants";
import { resolveDocumentFormat, toDisplaySrc } from "../documents/helpers";

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

/** Primary application id from createApplication `applicationId` array. */
export const primaryApplicationId = (ids: string[] | undefined | null): string => {
  if (!ids?.length) {
    return "";
  }

  return ids.map((id) => id.trim()).find(Boolean) ?? "";
};

/** Display contact as +91 XXXXXXXXXX when digits-only. */
export const formatPrimaryContact = (value: string | undefined | null): string => {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return "-";
  }

  if (trimmed.startsWith("+")) {
    return trimmed;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91 ${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2)}`;
  }

  return trimmed;
};

/** Badge label for review document cards (PNG / JPG / PDF). */
export const fileTypeLabelFromUrl = (url: string | undefined | null): string => {
  const format = resolveDocumentFormat(url?.trim() ?? "");
  if (format === "jpeg") {
    return "JPG";
  }
  return format.toUpperCase() || "PNG";
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

/** Trigger a browser download for a PDF blob URL, http(s) URL, data URI, or raw base64. */
export const triggerPdfDownload = (fileURL: string, fileName: string): void => {
  const href = toDisplaySrc(fileURL, "pdf");
  if (!href) {
    throw new Error("Unable to download form. Empty PDF payload.");
  }

  const resolvedName = fileName.trim() || "application-form.pdf";

  // Cross-origin http(s) links often ignore the download attribute — open in a new tab.
  if (href.startsWith("http://") || href.startsWith("https://")) {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }

  const link = document.createElement("a");
  link.href = href;
  link.download = resolvedName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();

  if (href.startsWith("blob:")) {
    window.setTimeout(() => {
      URL.revokeObjectURL(href);
    }, 1_000);
  }
};

