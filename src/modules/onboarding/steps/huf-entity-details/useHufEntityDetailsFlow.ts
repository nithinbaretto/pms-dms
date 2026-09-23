import { useCallback, useEffect, useMemo, useState } from "react";

import { onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import {
  mapEntityDetailsResponseToState,
  mapEntityStateToSaveRequest,
} from "./entity-api-mappers";
import { createEmptyManualKarta, mapValidateKarthaToFetchedKarta } from "./helpers";
import { HUF_ENTITY_DOC_META } from "./constants";
import type {
  CoparcenerDetails,
  KartaDetails,
  KartaDocumentFile,
  SignatoryDetails,
  SignatoryMode,
  ValidateKarthaPanResult,
} from "./types";

export type HufDocumentUploadMeta = {
  documentName: string;
  documentType: string;
};

export const useHufEntityDetailsFlow = (): {
  karta: KartaDetails | null;
  setKarta: (value: KartaDetails | null) => void;
  coparceners: CoparcenerDetails[];
  setCoparceners: (value: CoparcenerDetails[]) => void;
  signatories: SignatoryDetails[];
  setSignatories: (value: SignatoryDetails[]) => void;
  signatoryMode: SignatoryMode;
  setSignatoryMode: (value: SignatoryMode) => void;
  anySignatoryCount: number;
  setAnySignatoryCount: (value: number) => void;
  isLoading: boolean;
  isSaving: boolean;
  isUploading: boolean;
  isValidatingKartha: boolean;
  error: string | null;
  canContinue: boolean;
  uploadEntityDocument: (file: File, meta: HufDocumentUploadMeta) => Promise<KartaDocumentFile | null>;
  validateKarthaPan: (pan: string) => Promise<ValidateKarthaPanResult | null>;
  saveEntityDetails: () => Promise<boolean>;
} => {
  const leadId = useOnboardingStore((state) => state.leadId);
  const panNumber = useOnboardingStore((state) => state.panNumber || state.pan);
  const applicationIds = useOnboardingStore((state) => state.applicationIds);
  const aprnNumber = useOnboardingStore((state) => state.aprnNumber);

  const [karta, setKarta] = useState<KartaDetails | null>(null);
  const [coparceners, setCoparceners] = useState<CoparcenerDetails[]>([]);
  const [signatories, setSignatories] = useState<SignatoryDetails[]>([]);
  const [signatoryMode, setSignatoryMode] = useState<SignatoryMode>("jointly");
  const [anySignatoryCount, setAnySignatoryCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidatingKartha, setIsValidatingKartha] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!leadId) {
      setError("Unable to load entity details. Missing lead information.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await onboardingApi.getEntityDetails(leadId);
        if (cancelled) {
          return;
        }
        const mapped = mapEntityDetailsResponseToState(response);
        setKarta(mapped.karta);
        setCoparceners(mapped.coparceners);
        setSignatories(mapped.signatories);
        setSignatoryMode(mapped.signatoryMode);
        setAnySignatoryCount(mapped.anySignatoryCount);
      } catch {
        if (!cancelled) {
          setError("Unable to load entity details. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [leadId]);

  const canContinue = useMemo(
    () =>
      Boolean(
        karta &&
          coparceners.length > 0 &&
          signatories.length > 0 &&
          (signatoryMode === "jointly" || anySignatoryCount >= 1),
      ),
    [anySignatoryCount, coparceners.length, karta, signatories.length, signatoryMode],
  );

  const uploadEntityDocument = useCallback(
    async (file: File, meta: HufDocumentUploadMeta): Promise<KartaDocumentFile | null> => {
      if (!leadId || !panNumber.trim()) {
        setError("Document upload failed. Missing lead or PAN information.");
        return null;
      }

      setIsUploading(true);
      setError(null);

      try {
        const response = await onboardingApi.uploadDocument({
          file,
          payload: {
            leadId,
            panNumber: panNumber.trim().toUpperCase(),
            applicationId: applicationIds,
            documentName: meta.documentName,
            documentType: meta.documentType,
            metadata: {},
          },
        });

        if (!response.fileURL.trim()) {
          setError("Document upload failed. Please retry.");
          return null;
        }

        return {
          fileName: file.name,
          previewUrl: response.fileURL,
          documentUrl: response.fileURL,
        };
      } catch {
        setError("Document upload failed. Please retry.");
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [applicationIds, leadId, panNumber],
  );

  const validateKarthaPan = useCallback(
    async (pan: string): Promise<ValidateKarthaPanResult | null> => {
      const normalizedPan = pan.trim().toUpperCase();

      if (!leadId) {
        setError("Unable to validate Karta PAN. Missing lead information.");
        return null;
      }

      setIsValidatingKartha(true);
      setError(null);

      try {
        const response = await onboardingApi.validateKarthaPanByAPMI({
          leadId,
          panNumber: normalizedPan,
          aprnNumber: aprnNumber?.trim() ?? "",
        });

        if (response.isValidated) {
          return {
            isValidated: true,
            karta: mapValidateKarthaToFetchedKarta(normalizedPan, response),
          };
        }

        return {
          isValidated: false,
          karta: createEmptyManualKarta(normalizedPan),
          apiFailed: false,
        };
      } catch {
        return {
          isValidated: false,
          karta: createEmptyManualKarta(normalizedPan),
          apiFailed: true,
        };
      } finally {
        setIsValidatingKartha(false);
      }
    },
    [aprnNumber, leadId],
  );

  const saveEntityDetails = useCallback(async (): Promise<boolean> => {
    if (!leadId || !karta || !canContinue) {
      setError("Please complete all required entity details before continuing.");
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = mapEntityStateToSaveRequest(
        leadId,
        karta,
        coparceners,
        signatories,
        signatoryMode,
        anySignatoryCount,
      );
      await onboardingApi.saveEntityDetails(payload);
      return true;
    } catch {
      setError("Unable to save entity details. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [anySignatoryCount, canContinue, coparceners, karta, leadId, signatories, signatoryMode]);

  return {
    karta,
    setKarta,
    coparceners,
    setCoparceners,
    signatories,
    setSignatories,
    signatoryMode,
    setSignatoryMode,
    anySignatoryCount,
    setAnySignatoryCount,
    isLoading,
    isSaving,
    isUploading,
    isValidatingKartha,
    error,
    canContinue,
    uploadEntityDocument,
    validateKarthaPan,
    saveEntityDetails,
  };
};

export const HUF_KARTA_UPLOAD_META = {
  identity: HUF_ENTITY_DOC_META.karthaPoi,
  address: HUF_ENTITY_DOC_META.karthaPoa,
} as const;

export const HUF_SIGNATORY_UPLOAD_META = {
  identity: HUF_ENTITY_DOC_META.authSignatoryPoi,
  address: HUF_ENTITY_DOC_META.authSignatoryPoa,
  signature: HUF_ENTITY_DOC_META.authSignatorySignature,
} as const;
