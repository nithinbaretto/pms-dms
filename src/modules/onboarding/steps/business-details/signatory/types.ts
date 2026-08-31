export type BusinessEntityType = "Individual" | "Sole Proprietorship";

export type SignatoryMode = "jointly" | "any";

export type SignatoryDocumentKind = "identity" | "address" | "signature";

export type SignatoryDocumentFile = {
  fileName: string;
  previewUrl: string;
};

export type SignatoryDetails = {
  id: string;
  name: string;
  pan: string;
  mobile: string;
  email: string;
  selected: boolean;
  identityDocument: SignatoryDocumentFile | null;
  addressDocument: SignatoryDocumentFile | null;
  signatureDocument: SignatoryDocumentFile | null;
};
