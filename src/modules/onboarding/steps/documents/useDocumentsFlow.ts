import { useCallback, useEffect, useMemo, useState } from "react";

import type { UploadedDocumentItem } from "../../services/onboarding-api";
import { onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import { DOCUMENT_META } from "./constants";
import { extractFileNameFromUrl, resolveDocumentFormat, toDisplaySrc } from "./helpers";

type UseDocumentsFlowOptions = {
  requiresPhoto?: boolean;
  requiresSignature?: boolean;
};

type UseDocumentsFlowResult = {
  /** Storage/blob URL persisted via saveUploadedDocuments. */
  photoUrl: string;
  signatureUrl: string;
  /** Viewable URL from download-file for Specimen Signature / Photo previews. */
  photoDisplayUrl: string;
  signatureDisplayUrl: string;
  photoUploaded: boolean;
  signatureUploaded: boolean;
  isLoading: boolean;
  isUploadingPhoto: boolean;
  isUploadingSignature: boolean;
  isSaving: boolean;
  error: string | null;
  canContinue: boolean;
  loadDocuments: () => Promise<void>;
  uploadPhoto: (file: File) => Promise<boolean>;
  uploadSignature: (file: File) => Promise<boolean>;
  clearPhoto: () => void;
  clearSignature: () => void;
  saveDocuments: () => Promise<boolean>;
};

export const useDocumentsFlow = ({
  requiresPhoto = true,
  requiresSignature = true,
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

  const [photoUrl, setPhotoUrl] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [photoDisplayUrl, setPhotoDisplayUrl] = useState("");
  const [signatureDisplayUrl, setSignatureDisplayUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const photoUploaded = Boolean(photoUrl.trim());
  const signatureUploaded = Boolean(signatureUrl.trim());

  const canContinue = useMemo(() => {
    if (isSaving || isUploadingPhoto || isUploadingSignature) {
      return false;
    }

    const photoOk = !photoRequired || photoUploaded;
    const signatureOk = !signatureRequired || signatureUploaded;
    return photoOk && signatureOk;
  }, [
    isSaving,
    isUploadingPhoto,
    isUploadingSignature,
    photoUploaded,
    photoRequired,
    signatureRequired,
    signatureUploaded,
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

      setPhotoUrl(nextPhoto);
      setSignatureUrl(nextSignature);
      setPhotoUploaded(Boolean(nextPhoto));
      setSignatureUploaded(Boolean(nextSignature));

      const [nextPhotoDisplay, nextSignatureDisplay] = await Promise.all([
        nextPhoto ? resolveDisplayUrl(nextPhoto) : Promise.resolve(""),
        nextSignature ? resolveDisplayUrl(nextSignature) : Promise.resolve(""),
      ]);

      setPhotoDisplayUrl(nextPhotoDisplay);
      setSignatureDisplayUrl(nextSignatureDisplay);
    } catch {
      setError("Unable to load uploaded documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [leadId, resolveDisplayUrl, setPhotoUploaded, setSignatureUploaded]);

  useEffect(() => {
    void loadDocuments();
  }, [loadDocuments]);

  const uploadPhoto = useCallback(
    async (file: File): Promise<boolean> => {
      if (!leadId || !resolvedPan) {
        setError("Unable to upload photo. Missing lead or PAN information.");
        return false;
      }

      setIsUploadingPhoto(true);
      setError(null);

      try {
        const response = await onboardingApi.uploadDocument({
          file,
          payload: {
            leadId,
            panNumber: resolvedPan,
            applicationId: applicationIds,
            documentName: DOCUMENT_META.photo.documentName,
            documentType: DOCUMENT_META.photo.documentType,
            metadata: {},
          },
        });
        const storageUrl = response.fileURL.trim();
        if (!storageUrl) {
          setError("Photo upload failed. Empty file URL returned.");
          return false;
        }

        // Persist storage URL, but preview must come from download-file only.
        try {
          const displayUrl = await resolveDisplayUrl(storageUrl, file);
          setPhotoUrl(storageUrl);
          setPhotoDisplayUrl(displayUrl);
          setPhotoUploaded(true);
          return true;
        } catch {
          setError("Photo uploaded, but preview download failed. Please try again.");
          return false;
        }
      } catch {
        setError("Unable to upload photo. Please try again.");
        return false;
      } finally {
        setIsUploadingPhoto(false);
      }
    },
    [applicationIds, leadId, resolveDisplayUrl, resolvedPan, setPhotoUploaded],
  );

  const uploadSignature = useCallback(
    async (file: File): Promise<boolean> => {
      if (!leadId || !resolvedPan) {
        setError("Unable to upload signature. Missing lead or PAN information.");
        return false;
      }

      setIsUploadingSignature(true);
      setError(null);

      try {
        const response = await onboardingApi.uploadDocument({
          file,
          payload: {
            leadId,
            panNumber: resolvedPan,
            applicationId: applicationIds,
            documentName: DOCUMENT_META.signature.documentName,
            documentType: DOCUMENT_META.signature.documentType,
            metadata: {},
          },
        });
        const storageUrl = response.fileURL.trim();
        if (!storageUrl) {
          setError("Signature upload failed. Empty file URL returned.");
          return false;
        }

        try {
          const displayUrl = await resolveDisplayUrl(storageUrl, file);
          setSignatureUrl(storageUrl);
          setSignatureDisplayUrl(displayUrl);
          setSignatureUploaded(true);
          return true;
        } catch {
          setError("Signature uploaded, but preview download failed. Please try again.");
          return false;
        }
      } catch {
        setError("Unable to upload signature. Please try again.");
        return false;
      } finally {
        setIsUploadingSignature(false);
      }
    },
    [applicationIds, leadId, resolveDisplayUrl, resolvedPan, setSignatureUploaded],
  );

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
    canContinue,
    leadId,
    photoUrl,
    setPhotoUploaded,
    setSignatureUploaded,
    signatureUrl,
  ]);

  return {
    photoUrl,
    signatureUrl,
    photoDisplayUrl,
    signatureDisplayUrl,
    photoUploaded,
    signatureUploaded,
    isLoading,
    isUploadingPhoto,
    isUploadingSignature,
    isSaving,
    error,
    canContinue,
    loadDocuments,
    uploadPhoto,
    uploadSignature,
    clearPhoto,
    clearSignature,
    saveDocuments,
  };
};
