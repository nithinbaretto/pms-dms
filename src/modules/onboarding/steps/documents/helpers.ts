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

/**
 * Convert download-file payload into an <img>/preview src.
 * Supports http(s) links, data URIs, and raw base64.
 */
export const toDisplaySrc = (value: string, type: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  // Raw base64 may include whitespace/newlines from the API payload.
  const base64 = trimmed.replace(/\s+/g, "");
  const mime =
    type === "pdf" ? "application/pdf" : `image/${type === "jpg" ? "jpeg" : type || "png"}`;
  return `data:${mime};base64,${base64}`;
};
