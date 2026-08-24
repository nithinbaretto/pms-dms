import { useCallback, useEffect, useMemo, useState } from "react";

import type { UploadedDocumentItem } from "../../services/onboarding-api";
import { onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import { DOCUMENT_META } from "./constants";
import { extractFileNameFromUrl, resolveDocumentFormat, toDisplaySrc } from "./helpers";
import type { DocumentKind } from "./types";

type UseDocumentsFlowOptions = {
  requiresPhoto?: boolean;
  requiresSignature?: boolean;
  requiresProofDocs?: boolean;
};

type UseDocumentsFlowResult = {
  /** Storage/blob URL persisted via saveUploadedDocuments. */
  photoUrl: string;
  signatureUrl: string;
  identityUrl: string;
  addressUrl: string;
  /** Viewable URL from download-file for Specimen Signature / Photo previews. */
  photoDisplayUrl: string;
  signatureDisplayUrl: string;
  identityDisplayUrl: string;
  addressDisplayUrl: string;
  photoUploaded: boolean;
  signatureUploaded: boolean;
  identityUploaded: boolean;
  addressUploaded: boolean;
  isLoading: boolean;
  isUploadingPhoto: boolean;
  isUploadingSignature: boolean;
  isUploadingIdentity: boolean;
  isUploadingAddress: boolean;
  isSaving: boolean;
  error: string | null;
  canContinue: boolean;
  loadDocuments: () => Promise<void>;
  uploadPhoto: (file: File) => Promise<boolean>;
  uploadSignature: (file: File) => Promise<boolean>;
  uploadIdentity: (file: File) => Promise<boolean>;
  uploadAddress: (file: File) => Promise<boolean>;
  clearPhoto: () => void;
  clearSignature: () => void;
  clearIdentity: () => void;
  clearAddress: () => void;
  saveDocuments: () => Promise<boolean>;
};

const KIND_LABEL: Record<DocumentKind, string> = {
  photo: "Photo",
  signature: "Signature",
  identity: "Proof of Identity",
  address: "Proof of Address",
};

export const useDocumentsFlow = ({
  requiresPhoto = true,
  requiresSignature = true,
  requiresProofDocs = false,
}: UseDocumentsFlowOptions = {}): UseDocumentsFlowResult => {
  const {
    leadId,
    pan,
    panNumber,
    applicationIds,
    setPhotoUploaded,
    setSignatureUploaded,
  } = useOnboardingStore();

  const resolvedPan = (pan || panNumber).trim().toUpperCase();
  const photoRequired = requiresPhoto;
  const signatureRequired = requiresSignature;
  const proofRequired = requiresProofDocs;

  const [photoUrl, setPhotoUrl] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [identityUrl, setIdentityUrl] = useState("");
  const [addressUrl, setAddressUrl] = useState("");
  const [photoDisplayUrl, setPhotoDisplayUrl] = useState("");
  const [signatureDisplayUrl, setSignatureDisplayUrl] = useState("");
  const [identityDisplayUrl, setIdentityDisplayUrl] = useState("");
  const [addressDisplayUrl, setAddressDisplayUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingKind, setUploadingKind] = useState<DocumentKind | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const photoUploaded = Boolean(photoUrl.trim());
  const signatureUploaded = Boolean(signatureUrl.trim());
  const identityUploaded = Boolean(identityUrl.trim());
  const addressUploaded = Boolean(addressUrl.trim());
  const isUploadingPhoto = uploadingKind === "photo";
  const isUploadingSignature = uploadingKind === "signature";
  const isUploadingIdentity = uploadingKind === "identity";
  const isUploadingAddress = uploadingKind === "address";

  const canContinue = useMemo(() => {
    if (isSaving || uploadingKind) {
      return false;
    }

    const photoOk = !photoRequired || photoUploaded;
    const signatureOk = !signatureRequired || signatureUploaded;
    const proofOk = !proofRequired || (identityUploaded && addressUploaded);
    return photoOk && signatureOk && proofOk;
  }, [
    addressUploaded,
    identityUploaded,
    isSaving,
    photoUploaded,
    photoRequired,
    proofRequired,
    signatureRequired,
    signatureUploaded,
    uploadingKind,
  ]);

  /** Always resolves display src via download-file — never uses the storage/blob URL as img src. */
  const resolveDisplayUrl = useCallback(
    async (storageUrl: string, file?: File): Promise<string> => {
      const downloadLink = storageUrl.trim();
      if (!downloadLink) {
        throw new Error("Missing document download link.");
      }
      if (!leadId || !resolvedPan) {
        throw new Error("Missing lead or PAN information for document download.");
      }

      const fileName = file?.name?.trim() || extractFileNameFromUrl(downloadLink);
      const type = resolveDocumentFormat(fileName || downloadLink, file?.type);

      const response = await onboardingApi.downloadFile({
        downloadLink,
        fileName,
        leadId,
        panNumber: resolvedPan,
        type,
      });

      const displaySrc = toDisplaySrc(response.fileURL, type);
      if (!displaySrc) {
        throw new Error("Document download returned an empty file URL.");
      }

      return displaySrc;
    },
    [leadId, resolvedPan],
  );

  const loadDocuments = useCallback(async (): Promise<void> => {
    if (!leadId) {
      setError("Unable to load documents. Missing lead information.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await onboardingApi.getUploadDocuments(leadId);
      const nextPhoto = response.uploadedPhoto.trim();
      const nextSignature = response.uploadedSignature.trim();
      const nextIdentity = response.uploadedProofOfIdentity.trim();
      const nextAddress = response.uploadedProofOfAddress.trim();

      setPhotoUrl(nextPhoto);
      setSignatureUrl(nextSignature);
      setIdentityUrl(nextIdentity);
      setAddressUrl(nextAddress);
      setPhotoUploaded(Boolean(nextPhoto));
      setSignatureUploaded(Boolean(nextSignature));

      const [nextPhotoDisplay, nextSignatureDisplay, nextIdentityDisplay, nextAddressDisplay] =
        await Promise.all([
          nextPhoto ? resolveDisplayUrl(nextPhoto) : Promise.resolve(""),
          nextSignature ? resolveDisplayUrl(nextSignature) : Promise.resolve(""),
          nextIdentity ? resolveDisplayUrl(nextIdentity) : Promise.resolve(""),
          nextAddress ? resolveDisplayUrl(nextAddress) : Promise.resolve(""),
        ]);

      setPhotoDisplayUrl(nextPhotoDisplay);
      setSignatureDisplayUrl(nextSignatureDisplay);
      setIdentityDisplayUrl(nextIdentityDisplay);
      setAddressDisplayUrl(nextAddressDisplay);
    } catch {
      setError("Unable to load uploaded documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [leadId, resolveDisplayUrl, setPhotoUploaded, setSignatureUploaded]);

  useEffect(() => {
    void loadDocuments();
  }, [loadDocuments]);

  const uploadKind = useCallback(
    async (kind: DocumentKind, file: File): Promise<boolean> => {
      const label = KIND_LABEL[kind];
      if (!leadId || !resolvedPan) {
        setError(`Unable to upload ${label.toLowerCase()}. Missing lead or PAN information.`);
        return false;
      }

      setUploadingKind(kind);
      setError(null);

      try {
        const response = await onboardingApi.uploadDocument({
          file,
          payload: {
            leadId,
            panNumber: resolvedPan,
            applicationId: applicationIds,
            documentName: DOCUMENT_META[kind].documentName,
            documentType: DOCUMENT_META[kind].documentType,
            metadata: {},
          },
        });
        const storageUrl = response.fileURL.trim();
        if (!storageUrl) {
          setError(`${label} upload failed. Empty file URL returned.`);
          return false;
        }

        try {
          const displayUrl = await resolveDisplayUrl(storageUrl, file);
          if (kind === "photo") {
            setPhotoUrl(storageUrl);
            setPhotoDisplayUrl(displayUrl);
            setPhotoUploaded(true);
          } else if (kind === "signature") {
            setSignatureUrl(storageUrl);
            setSignatureDisplayUrl(displayUrl);
            setSignatureUploaded(true);
          } else if (kind === "identity") {
            setIdentityUrl(storageUrl);
            setIdentityDisplayUrl(displayUrl);
          } else {
            setAddressUrl(storageUrl);
            setAddressDisplayUrl(displayUrl);
          }
          return true;
        } catch {
          setError(`${label} uploaded, but preview download failed. Please try again.`);
          return false;
        }
      } catch {
        setError(`Unable to upload ${label.toLowerCase()}. Please try again.`);
        return false;
      } finally {
        setUploadingKind(null);
      }
    },
    [applicationIds, leadId, resolveDisplayUrl, resolvedPan, setPhotoUploaded, setSignatureUploaded],
  );

  const uploadPhoto = useCallback((file: File) => uploadKind("photo", file), [uploadKind]);
  const uploadSignature = useCallback((file: File) => uploadKind("signature", file), [uploadKind]);
  const uploadIdentity = useCallback((file: File) => uploadKind("identity", file), [uploadKind]);
  const uploadAddress = useCallback((file: File) => uploadKind("address", file), [uploadKind]);

  const clearPhoto = useCallback(() => {
    setPhotoUrl("");
    setPhotoDisplayUrl("");
    setPhotoUploaded(false);
  }, [setPhotoUploaded]);

  const clearSignature = useCallback(() => {
    setSignatureUrl("");
    setSignatureDisplayUrl("");
    setSignatureUploaded(false);
  }, [setSignatureUploaded]);

  const clearIdentity = useCallback(() => {
    setIdentityUrl("");
    setIdentityDisplayUrl("");
  }, []);

  const clearAddress = useCallback(() => {
    setAddressUrl("");
    setAddressDisplayUrl("");
  }, []);

  const saveDocuments = useCallback(async (): Promise<boolean> => {
    if (!leadId) {
      setError("Unable to save documents. Missing lead information.");
      return false;
    }

    if (!canContinue) {
      setError("Please upload the required documents before continuing.");
      return false;
    }

    const documents: UploadedDocumentItem[] = [];

    if (photoUrl.trim()) {
      documents.push({
        documentName: DOCUMENT_META.photo.documentName,
        documentType: DOCUMENT_META.photo.documentType,
        documentUrl: photoUrl.trim(),
      });
    }

    if (signatureUrl.trim()) {
      documents.push({
        documentName: DOCUMENT_META.signature.documentName,
        documentType: DOCUMENT_META.signature.documentType,
        documentUrl: signatureUrl.trim(),
      });
    }

    if (identityUrl.trim()) {
      documents.push({
        documentName: DOCUMENT_META.identity.documentName,
        documentType: DOCUMENT_META.identity.documentType,
        documentUrl: identityUrl.trim(),
      });
    }

    if (addressUrl.trim()) {
      documents.push({
        documentName: DOCUMENT_META.address.documentName,
        documentType: DOCUMENT_META.address.documentType,
        documentUrl: addressUrl.trim(),
      });
    }

    if (documents.length === 0) {
      setError("Please upload the required documents before continuing.");
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onboardingApi.saveUploadedDocuments({
        leadId,
        documents,
      });
      setPhotoUploaded(Boolean(photoUrl.trim()));
      setSignatureUploaded(Boolean(signatureUrl.trim()));
      return true;
    } catch {
      setError("Unable to save documents. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    addressUrl,
    canContinue,
    identityUrl,
    leadId,
    photoUrl,
    setPhotoUploaded,
    setSignatureUploaded,
    signatureUrl,
  ]);

  return {
    photoUrl,
    signatureUrl,
    identityUrl,
    addressUrl,
    photoDisplayUrl,
    signatureDisplayUrl,
    identityDisplayUrl,
    addressDisplayUrl,
    photoUploaded,
    signatureUploaded,
    identityUploaded,
    addressUploaded,
    isLoading,
    isUploadingPhoto,
    isUploadingSignature,
    isUploadingIdentity,
    isUploadingAddress,
    isSaving,
    error,
    canContinue,
    loadDocuments,
    uploadPhoto,
    uploadSignature,
    uploadIdentity,
    uploadAddress,
    clearPhoto,
    clearSignature,
    clearIdentity,
    clearAddress,
    saveDocuments,
  };
};
