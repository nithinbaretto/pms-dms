export type DocumentKind = "photo" | "signature" | "identity" | "address";

export type DocumentUploadState = {
  photoUrl: string;
  signatureUrl: string;
  photoUploaded: boolean;
  signatureUploaded: boolean;
};
