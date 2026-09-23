import type {
  EntityAuthSignatoryData,
  EntityDocumentPayload,
  SaveEntityAuthSignatoryItem,
} from "../../../services/onboarding-api";
import { BUSINESS_SIGNATORY_DOC_META, DEFAULT_BUSINESS_ENTITY_TYPE } from "./constants";
import {
  createSignatoryId,
  documentFileFromUrl,
  signatoryDocumentUrl,
} from "./helpers";
import type {
  BusinessEntityType,
  SignatoryDetails,
  SignatoryDocumentFile,
  SignatoryMode,
} from "./types";

type EntityDocumentItem = {
  documentName: string;
  documentType: string;
  documentUrl: string;
};

export const toBusinessEntityType = (value: string): BusinessEntityType => {
  const normalized = value.trim().toLowerCase();
  if (normalized === "individual") {
    return "Individual";
  }
  if (normalized === "sole proprietorship" || normalized === "proprietorship") {
    return "Sole Proprietorship";
  }
  return DEFAULT_BUSINESS_ENTITY_TYPE;
};

export const isKnownBusinessEntityType = (value: string): boolean => {
  const normalized = value.trim().toLowerCase();
  return (
    normalized === "individual" ||
    normalized === "sole proprietorship" ||
    normalized === "proprietorship"
  );
};

export const mapModeFromApi = (value: string | null | undefined): SignatoryMode => {
  const normalized = (value ?? "").trim().toLowerCase();
  return normalized === "any" ? "any" : "jointly";
};

export const mapModeToApi = (mode: SignatoryMode): string =>
  mode === "any" ? "Any" : "Jointly";

const documentMatches = (item: EntityDocumentItem, aliases: readonly string[]): boolean => {
  const name = item.documentName.trim().toLowerCase();
  const type = item.documentType.trim().toLowerCase();
  return aliases.some((alias) => {
    const needle = alias.toLowerCase();
    return name === needle || type === needle || name.includes(needle) || type.includes(needle);
  });
};

const findDocument = (
  documents: EntityDocumentItem[] | undefined,
  aliases: readonly string[],
  label: string,
): SignatoryDocumentFile | null => {
  if (!documents?.length) {
    return null;
  }
  const match = documents.find((item) => documentMatches(item, aliases));
  return match ? documentFileFromUrl(match.documentUrl, match.documentName || label) : null;
};

const IDENTITY_DOC_ALIASES = ["authsingatorypoi", "authsignatorypoi", "poi"] as const;
const ADDRESS_DOC_ALIASES = ["authsingatorypoa", "authsignatorypoa", "poa"] as const;
const SIGNATURE_DOC_ALIASES = [
  "authsingatorysingature",
  "authsignatoryspecimensignature",
  "singature",
  "signature",
] as const;

const buildSignatoryDocuments = (signatory: SignatoryDetails): EntityDocumentPayload[] => {
  const docs: EntityDocumentPayload[] = [];
  const poi = signatoryDocumentUrl(signatory.identityDocument);
  const poa = signatoryDocumentUrl(signatory.addressDocument);
  const signature = signatoryDocumentUrl(signatory.signatureDocument);

  if (poi) {
    docs.push({ ...BUSINESS_SIGNATORY_DOC_META.identity, documentUrl: poi });
  }
  if (poa) {
    docs.push({ ...BUSINESS_SIGNATORY_DOC_META.address, documentUrl: poa });
  }
  if (signature) {
    docs.push({ ...BUSINESS_SIGNATORY_DOC_META.signature, documentUrl: signature });
  }
  return docs;
};

export const mapAuthSignatoryDetailsFromApi = (
  authData: EntityAuthSignatoryData | undefined,
): {
  signatories: SignatoryDetails[];
  signatoryMode: SignatoryMode;
  anySignatoryCount: number;
} => {
  const signatoryMode = mapModeFromApi(authData?.modeOfOperation);
  const selectedCount = authData?.selectedNoOfSignatory ?? 0;
  const anySignatoryCount =
    signatoryMode === "any" && selectedCount > 0 ? selectedCount : 1;

  const signatories: SignatoryDetails[] = (authData?.authSignatoryDetails ?? []).map((item) => ({
    id: createSignatoryId(),
    name: item.authSignatoryName.trim(),
    pan: item.authSignatoryPan.trim().toUpperCase(),
    mobile: item.authSignatoryContact.replace(/\D/g, "").slice(-10) || item.authSignatoryContact.trim(),
    email: item.authSignatoryEmail.trim(),
    selected: item.authSignatoryIsOpted || item.authSignatoryIsSelected,
    identityDocument: findDocument(item.documents, IDENTITY_DOC_ALIASES, "Proof of Identity"),
    addressDocument: findDocument(item.documents, ADDRESS_DOC_ALIASES, "Proof of Address"),
    signatureDocument: findDocument(item.documents, SIGNATURE_DOC_ALIASES, "Specimen Signature"),
  }));

  return { signatories, signatoryMode, anySignatoryCount };
};

export const mapAuthSignatoryDataToSave = (
  signatories: SignatoryDetails[],
  mode: SignatoryMode,
  anySignatoryCount: number,
  includeSignatories: boolean,
): {
  modeOfOperation: string;
  selectedNoOfSignatory: number;
  authSignatoryDetails: SaveEntityAuthSignatoryItem[];
} => {
  if (!includeSignatories) {
    return {
      modeOfOperation: "Jointly",
      selectedNoOfSignatory: 1,
      authSignatoryDetails: [],
    };
  }

  return {
    modeOfOperation: mapModeToApi(mode),
    selectedNoOfSignatory: mode === "any" ? anySignatoryCount : Math.max(signatories.length, 1),
    authSignatoryDetails: signatories.map((signatory) => {
      const opted = mode === "jointly" ? true : signatory.selected;
      return {
        authSignatoryName: signatory.name.trim(),
        authSignatoryPan: signatory.pan.trim().toUpperCase(),
        authSignatoryType: "",
        authSignatoryEmail: signatory.email.trim(),
        authSignatoryContact: signatory.mobile.replace(/\D/g, "").slice(-10) || signatory.mobile.trim(),
        authSignatoryIsOpted: opted,
        authSignatoryIsSelected: opted,
        documents: buildSignatoryDocuments(signatory),
      };
    }),
  };
};
