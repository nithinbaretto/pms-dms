import type { Address } from "../personal-details/types";

export type KartaSource = "fetched" | "manual";

export type KartaDocumentFile = {
  fileName: string;
  previewUrl: string;
};

export type KartaDetails = {
  name: string;
  pan: string;
  mobile: string;
  email: string;
  permanentAddress: Address;
  correspondenceAddress: Address;
  source: KartaSource;
  proofOfIdentityType: string;
  proofOfIdentityNumber: string;
  identityDocument: KartaDocumentFile | null;
  addressDocument: KartaDocumentFile | null;
  sameAsApplicantAddress: boolean;
  sameAsPermanentAddress: boolean;
};

export type KartaDocumentKind = "identity" | "address" | "signature";

export type CoparcenerDetails = {
  id: string;
  name: string;
  pan: string;
  relationship: string;
};

export type SignatorySource = "karta" | "coparcener" | "other";

export type SignatoryMode = "jointly" | "any";

export type SignatoryDetails = {
  id: string;
  source: SignatorySource;
  sourceId: string;
  name: string;
  pan: string;
  mobile: string;
  email: string;
  identityDocument: KartaDocumentFile | null;
  addressDocument: KartaDocumentFile | null;
  signatureDocument: KartaDocumentFile | null;
};
