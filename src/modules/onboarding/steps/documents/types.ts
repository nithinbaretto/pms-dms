export type DocumentKind = "photo" | "signature";

export type DocumentUploadState = {
  photoUrl: string;
  signatureUrl: string;
  photoUploaded: boolean;
  signatureUploaded: boolean;
};
