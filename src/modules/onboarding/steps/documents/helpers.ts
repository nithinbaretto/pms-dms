/** Extract a usable file name from a blob/storage URL. */
export const extractFileNameFromUrl = (url: string, fallback = "document"): string => {
  const trimmed = url.trim();
  if (!trimmed) {
    return fallback;
  }

  try {
    const pathname = new URL(trimmed).pathname;
    const name = pathname.split("/").filter(Boolean).pop();
    if (name?.trim()) {
      return decodeURIComponent(name.trim());
    }
  } catch {
    const name = trimmed.split("/").filter(Boolean).pop();
    if (name?.trim()) {
      return name.trim();
    }
  }

  return fallback;
};

/** `%PDF` in standard base64 — used to sniff PDFs when the API omits mime/extension. */
const PDF_BASE64_MAGIC = "JVBERi";

const stripDataUriPayload = (value: string): string => {
  const commaIndex = value.indexOf(",");
  return commaIndex >= 0 ? value.slice(commaIndex + 1) : value;
};

const compactBase64 = (value: string): string => value.replace(/\s+/g, "");

/** True when a base64 / data-URI payload is a PDF (`%PDF` magic bytes). */
export const isPdfBase64 = (value: string): boolean => {
  const compact = compactBase64(value.trim());
  if (!compact) {
    return false;
  }

  const payload = compact.toLowerCase().startsWith("data:")
    ? stripDataUriPayload(compact)
    : compact;
  return payload.startsWith(PDF_BASE64_MAGIC);
};

export const isPdfFile = (file?: File | null): boolean => {
  if (!file) {
    return false;
  }

  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
};

/** True when a preview src (or optional mime) should be rendered as a PDF, not an <img>. */
export const isPdfDisplaySrc = (src: string, mimeType?: string): boolean => {
  const mime = (mimeType ?? "").trim().toLowerCase();
  if (mime === "application/pdf") {
    return true;
  }

  const trimmed = src.trim();
  if (!trimmed) {
    return false;
  }

  const lower = trimmed.toLowerCase();
  if (lower.startsWith("data:application/pdf")) {
    return true;
  }

  if (lower.startsWith("blob:")) {
    return false;
  }

  if (lower.includes(".pdf")) {
    return true;
  }

  return isPdfBase64(trimmed);
};

/** Map mime/extension to the download-file `type` (doc format). */
export const resolveDocumentFormat = (fileNameOrUrl: string, mimeType?: string): string => {
  const normalizedMime = (mimeType ?? "").trim().toLowerCase();
  if (normalizedMime === "image/png") {
    return "png";
  }
  if (normalizedMime === "image/jpeg" || normalizedMime === "image/jpg") {
    return "jpeg";
  }
  if (normalizedMime === "application/pdf") {
    return "pdf";
  }

  const extension = fileNameOrUrl.split(".").pop()?.trim().toLowerCase() ?? "";
  if (extension === "jpg" || extension === "jpeg") {
    return "jpeg";
  }
  if (extension === "png" || extension === "pdf") {
    return extension;
  }

  return "png";
};

const mimeForDisplay = (type: string, isPdf: boolean): string => {
  if (isPdf || type === "pdf" || type === "application/pdf") {
    return "application/pdf";
  }
  if (type === "jpg" || type === "jpeg") {
    return "image/jpeg";
  }
  return `image/${type || "png"}`;
};

/**
 * Convert download-file payload into a preview src.
 * Supports http(s) links, data URIs, and raw base64.
 * PDF bytes are sniffed from magic (`JVBERi`) so a missing/wrong `type` still previews.
 */
export const toDisplaySrc = (value: string, type: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("data:")) {
    const commaIndex = trimmed.indexOf(",");
    if (commaIndex < 0) {
      return trimmed;
    }

    const header = trimmed.slice(0, commaIndex);
    const payload = compactBase64(trimmed.slice(commaIndex + 1));
    if (isPdfBase64(payload) && !header.toLowerCase().includes("application/pdf")) {
      return `data:application/pdf;base64,${payload}`;
    }
    return trimmed;
  }

  // Raw base64 may include whitespace/newlines from the API payload.
  const base64 = compactBase64(trimmed);
  const isPdf = type === "pdf" || type === "application/pdf" || isPdfBase64(base64);
  return `data:${mimeForDisplay(type, isPdf)};base64,${base64}`;
};

/** Decode a PDF data URI / raw base64 into a Blob for reliable <iframe> embedding. */
export const pdfSrcToBlob = (src: string): Blob => {
  const trimmed = src.trim();
  let base64 = trimmed;
  if (trimmed.startsWith("data:")) {
    base64 = stripDataUriPayload(trimmed);
  }

  const compact = compactBase64(base64).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(compact);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: "application/pdf" });
};
