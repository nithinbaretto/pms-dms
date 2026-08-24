export const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"] as const;
export const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

/** Backend metadata labels for upload-document + saveUploadedDocuments. */
export const DOCUMENT_META = {
  photo: {
    documentName: "photo",
    documentType: "Photo",
  },
  signature: {
    documentName: "signature",
    documentType: "Signature",
  },
  identity: {
    documentName: "proofOfIdentity",
    documentType: "Proof Of Identity",
  },
  address: {
    documentName: "proofOfAddress",
    documentType: "Proof Of Address",
  },
} as const;
