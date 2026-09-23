import type {
  EntityAuthSignatoryData,
  EntityDetailsResponse,
  SaveEntityDetailsRequest,
} from "../../services/onboarding-api";
import { formatAddressForApi } from "../personal-details/helpers";
import { AUTH_SIGNATORY_TYPE, HUF_ENTITY_DOC_META, HUF_ENTITY_TYPE } from "./constants";
import {
  createEmptyManualKarta,
  createSignatoryId,
  documentFileFromUrl,
  emptyAddress,
  formatHufPersonName,
} from "./helpers";
import type {
  CoparcenerDetails,
  KartaDetails,
  KartaDocumentFile,
  SignatoryDetails,
  SignatoryMode,
} from "./types";

type EntityDocumentItem = {
  documentName: string;
  documentType: string;
  documentUrl: string;
};

const docUrl = (file: KartaDocumentFile | null): string =>
  (file?.documentUrl || file?.previewUrl || "").trim();

const buildKartaDocuments = (karta: KartaDetails): EntityDocumentItem[] => {
  if (karta.source === "fetched") {
    return [];
  }
  const docs: EntityDocumentItem[] = [];
  const poi = docUrl(karta.identityDocument);
  const poa = docUrl(karta.addressDocument);
  if (poi) {
    docs.push({ ...HUF_ENTITY_DOC_META.karthaPoi, documentUrl: poi });
  }
  if (poa) {
    docs.push({ ...HUF_ENTITY_DOC_META.karthaPoa, documentUrl: poa });
  }
  return docs;
};

const buildSignatoryDocuments = (signatory: SignatoryDetails): EntityDocumentItem[] => {
  const docs: EntityDocumentItem[] = [];
  const poi = docUrl(signatory.identityDocument);
  const poa = docUrl(signatory.addressDocument);
  const signature = docUrl(signatory.signatureDocument);
  if (poi) {
    docs.push({ ...HUF_ENTITY_DOC_META.authSignatoryPoi, documentUrl: poi });
  }
  if (poa) {
    docs.push({ ...HUF_ENTITY_DOC_META.authSignatoryPoa, documentUrl: poa });
  }
  if (signature) {
    docs.push({ ...HUF_ENTITY_DOC_META.authSignatorySignature, documentUrl: signature });
  }
  return docs;
};

const authSignatoryTypeFromSource = (source: SignatoryDetails["source"]): string => {
  if (source === "karta") {
    return AUTH_SIGNATORY_TYPE.karta;
  }
  if (source === "coparcener") {
    return AUTH_SIGNATORY_TYPE.coparcener;
  }
  return AUTH_SIGNATORY_TYPE.manual;
};

export const mapEntityStateToSaveRequest = (
  leadId: string,
  karta: KartaDetails,
  coparceners: CoparcenerDetails[],
  signatories: SignatoryDetails[],
  signatoryMode: SignatoryMode,
  anySignatoryCount: number,
): SaveEntityDetailsRequest => ({
  leadId,
  entityType: HUF_ENTITY_TYPE,
  karthaDetails: {
    name: karta.name.trim(),
    panNumber: karta.pan.trim().toUpperCase(),
    email: karta.email.trim(),
    mobileNumber: karta.mobile.replace(/\D/g, "").slice(-10) || karta.mobile.trim(),
    permanentAddress: formatAddressForApi(karta.permanentAddress),
    correspondenceAddress: formatAddressForApi(karta.correspondenceAddress),
    poiType: karta.proofOfIdentityType.trim() || "PAN",
    poiNumber: karta.proofOfIdentityNumber.trim().toUpperCase() || karta.pan.trim().toUpperCase(),
    isApmiVerified: karta.source === "fetched",
    isKarthaPAddressSameAsApplicant: karta.sameAsApplicantAddress,
    isKarthaCAddressSameAsPermanent: karta.sameAsPermanentAddress,
    isPermanentAddressModified: karta.source === "manual",
    isKartaCorrespondanceAddressModified: karta.source === "manual",
    documents: buildKartaDocuments(karta),
  },
  coPercenerDetails: coparceners.map((item) => ({
    coPercenerName: item.name.trim(),
    coPercenerPan: item.pan.trim().toUpperCase(),
    relationshipWithKartha: item.relationship.trim(),
  })),
  authSignatoryData: {
    modeOfOperation: signatoryMode === "any" ? "any" : "jointly",
    selectedNoOfSignatory: signatoryMode === "any" ? anySignatoryCount : 0,
    authSignatoryDetails: signatories.map((signatory) => ({
      authSignatoryName: signatory.name.trim(),
      authSignatoryPan: signatory.pan.trim().toUpperCase(),
      authSignatoryContact: signatory.mobile.replace(/\D/g, "").slice(-10) || signatory.mobile.trim(),
      authSignatoryEmail: signatory.email.trim(),
      authSignatoryType: authSignatoryTypeFromSource(signatory.source),
      authSignatoryIsOpted: true,
      authSignatoryIsSelected: true,
      documents: buildSignatoryDocuments(signatory),
    })),
  },
});

const findDocument = (
  documents: EntityDocumentItem[] | undefined,
  type: string,
): KartaDocumentFile | null => {
  if (!documents?.length) {
    return null;
  }
  const normalized = type.toLowerCase();
  const match = documents.find(
    (item) =>
      item.documentType.toLowerCase() === normalized ||
      item.documentName.toLowerCase() === normalized,
  );
  return match ? documentFileFromUrl(match.documentUrl, match.documentName) : null;
};

const mapKarthaFromApi = (kartha: EntityDetailsResponse["karthaDetails"]): KartaDetails | null => {
  if (!kartha || !kartha.panNumber.trim()) {
    return null;
  }

  const isFetched = Boolean(kartha.isApmiVerified);
  const manualBase = createEmptyManualKarta(kartha.panNumber);

  return {
    ...manualBase,
    name: formatHufPersonName(kartha.name),
    pan: kartha.panNumber.trim().toUpperCase(),
    mobile: kartha.mobileNumber.replace(/\D/g, "").slice(-10) || kartha.mobileNumber.trim(),
    email: kartha.email.trim(),
    permanentAddress: {
      ...emptyAddress(),
      addressLine: kartha.permanentAddress.trim(),
    },
    correspondenceAddress: {
      ...emptyAddress(),
      addressLine: kartha.correspondenceAddress.trim(),
    },
    proofOfIdentityType: kartha.poiType || "PAN",
    proofOfIdentityNumber: kartha.poiNumber || kartha.panNumber,
    identityDocument: findDocument(kartha.documents, "KarthaPOI"),
    addressDocument: findDocument(kartha.documents, "KarthaPOA"),
    sameAsApplicantAddress: Boolean(kartha.isKarthaPAddressSameAsApplicant),
    sameAsPermanentAddress: Boolean(kartha.isKarthaCAddressSameAsPermanent),
    source: isFetched ? "fetched" : "manual",
  };
};

const mapSignatorySourceFromType = (
  type: string,
  pan: string,
  coparceners: CoparcenerDetails[],
): SignatoryDetails["source"] => {
  const normalized = type.trim().toLowerCase();
  if (normalized === "kartha") {
    return "karta";
  }
  if (normalized === "co-parcener" || normalized === "coparcener") {
    return "coparcener";
  }
  if (normalized === "manual") {
    return "other";
  }
  if (coparceners.some((item) => item.pan === pan)) {
    return "coparcener";
  }
  return "other";
};

export const mapEntityDetailsResponseToState = (
  response: EntityDetailsResponse,
): {
  karta: KartaDetails | null;
  coparceners: CoparcenerDetails[];
  signatories: SignatoryDetails[];
  signatoryMode: SignatoryMode;
  anySignatoryCount: number;
} => {
  const coparceners: CoparcenerDetails[] = (response.coPercenerDetails ?? []).map((item, index) => ({
    id: `coparcener-${item.coPercenerPan}-${index}`,
    name: formatHufPersonName(item.coPercenerName),
    pan: item.coPercenerPan.trim().toUpperCase(),
    relationship: item.relationshipWithKartha,
  }));

  const authData: EntityAuthSignatoryData | undefined = response.authSignatoryData;
  const modeRaw = (authData?.modeOfOperation ?? "jointly").trim().toLowerCase();
  const signatoryMode: SignatoryMode = modeRaw === "any" ? "any" : "jointly";
  const anySignatoryCount =
    signatoryMode === "any" && authData?.selectedNoOfSignatory
      ? authData.selectedNoOfSignatory
      : 1;

  const signatories: SignatoryDetails[] = (authData?.authSignatoryDetails ?? []).map((item) => {
    const pan = item.authSignatoryPan.trim().toUpperCase();
    const source = mapSignatorySourceFromType(item.authSignatoryType, pan, coparceners);
    return {
      id: createSignatoryId(),
      source,
      sourceId: pan,
      name: formatHufPersonName(item.authSignatoryName),
      pan,
      mobile: item.authSignatoryContact.replace(/\D/g, "").slice(-10) || item.authSignatoryContact,
      email: item.authSignatoryEmail.trim(),
      identityDocument: findDocument(item.documents, "AuthSignatoryPOI"),
      addressDocument: findDocument(item.documents, "AuthSignatoryPOA"),
      signatureDocument: findDocument(item.documents, "AuthSignatorySpecimenSignature"),
    };
  });

  return {
    karta: mapKarthaFromApi(response.karthaDetails),
    coparceners,
    signatories,
    signatoryMode,
    anySignatoryCount,
  };
};
