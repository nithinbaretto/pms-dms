import { useCallback, useEffect, useMemo, useState } from "react";

import { onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import { BRANCH_OPTIONS, GST_CERTIFICATE_DOC_META } from "./constants";
import {
  extractPincodeFromAddress,
  getFallbackStateOptions,
  mapDraftToRecord,
  mapGstInItemToRecord,
  mapNextInfoSectionToStep,
  mapRecordToGstInItem,
  resolveStateName,
} from "./helpers";
import type {
  BranchOption,
  GstRecord,
  ManualGstDraft,
  SaveBusinessDetailsResult,
  ValidateGstResult,
} from "./types";
import { isBusinessDetailsStepValid, isValidGstNumber } from "./validation";

type UseBusinessDetailsFlowResult = {
  records: GstRecord[];
  selectedBranch: string;
  branchOptions: BranchOption[];
  stateOptions: string[];
  isLoading: boolean;
  isSaving: boolean;
  isValidatingGst: boolean;
  isUploading: boolean;
  error: string | null;
  canContinue: boolean;
  addGstModalOpen: boolean;
  openAddGstModal: () => void;
  closeAddGstModal: () => void;
  loadBusinessDetails: () => Promise<void>;
  selectBranch: (branch: string) => void;
  toggleGstSelection: (id: string) => void;
  selectAllGst: () => void;
  removeGstEntry: (id: string) => void;
  addManualGst: (draft: ManualGstDraft) => void;
  validateGstNumber: (gstInNumber: string) => Promise<ValidateGstResult | null>;
  uploadGstDocument: (file: File) => Promise<string | null>;
  uploadGstDocumentForRecord: (id: string, file: File) => Promise<boolean>;
  saveBusinessDetails: () => Promise<SaveBusinessDetailsResult | null>;
};

export const useBusinessDetailsFlow = (): UseBusinessDetailsFlowResult => {
  const { leadId, pan, panNumber, applicationIds, personalDetails } = useOnboardingStore();
  const resolvedPan = (pan || panNumber).trim().toUpperCase();
  const permanentPincode = extractPincodeFromAddress(personalDetails?.permanentAddress);

  const [records, setRecords] = useState<GstRecord[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branchOptions, setBranchOptions] = useState<BranchOption[]>(BRANCH_OPTIONS);
  const [stateOptions, setStateOptions] = useState<string[]>(getFallbackStateOptions);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidatingGst, setIsValidatingGst] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addGstModalOpen, setAddGstModalOpen] = useState(false);

  const loadStates = useCallback(async (): Promise<void> => {
    try {
      const states = await onboardingApi.getStates();
      if (states.length > 0) {
        setStateOptions(states);
      } else {
        setStateOptions(getFallbackStateOptions());
      }
    } catch {
      setStateOptions(getFallbackStateOptions());
    }
  }, []);

  const loadBranches = useCallback(async (): Promise<void> => {
    if (!permanentPincode) {
      setBranchOptions(BRANCH_OPTIONS);
      return;
    }

    try {
      const list = await onboardingApi.getBranchList(permanentPincode);
      if (list.length === 0) {
        setBranchOptions(BRANCH_OPTIONS);
        return;
      }

      setBranchOptions(
        list.map((item) => ({
          id: item.BranchName,
          label: item.BranchName,
        })),
      );
    } catch {
      setBranchOptions(BRANCH_OPTIONS);
    }
  }, [permanentPincode]);

  const loadBusinessDetails = useCallback(async (): Promise<void> => {
    if (!leadId) {
      setError("Unable to load business details. Missing lead information.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await onboardingApi.getBusinessDetails(leadId);
      const mapped = response.gstInDetails.map(mapGstInItemToRecord);
      setRecords(mapped);

      const branch = response.selectedBranch.trim();
      setSelectedBranch(branch);

      if (branch) {
        setBranchOptions((current) => {
          if (current.some((option) => option.id === branch || option.label === branch)) {
            return current;
          }
          return [{ id: branch, label: branch }, ...current];
        });
      }
    } catch {
      setError("Unable to load business details. Please try again.");
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    void loadBusinessDetails();
  }, [loadBusinessDetails]);

  useEffect(() => {
    void loadStates();
  }, [loadStates]);

  useEffect(() => {
    void loadBranches();
  }, [loadBranches]);

  useEffect(() => {
    if (!selectedBranch.trim()) {
      return;
    }

    setBranchOptions((current) => {
      if (current.some((option) => option.id === selectedBranch || option.label === selectedBranch)) {
        return current;
      }
      return [{ id: selectedBranch, label: selectedBranch }, ...current];
    });
  }, [selectedBranch]);

  const canContinue = useMemo(() => {
    return isBusinessDetailsStepValid(selectedBranch, records);
  }, [selectedBranch, records]);

  const selectBranch = useCallback((branch: string): void => {
    setSelectedBranch(branch);
  }, []);

  const toggleGstSelection = useCallback((id: string): void => {
    setRecords((current) =>
      current.map((record) =>
        record.id === id ? { ...record, selected: !record.selected } : record,
      ),
    );
  }, []);

  const selectAllGst = useCallback((): void => {
    setRecords((current) => current.map((record) => ({ ...record, selected: true })));
  }, []);

  const removeGstEntry = useCallback((id: string): void => {
    setRecords((current) => current.filter((record) => record.id !== id));
  }, []);

  const addManualGst = useCallback((draft: ManualGstDraft): void => {
    const next = mapDraftToRecord(draft);
    setRecords((current) => {
      const withoutDuplicate = current.filter(
        (record) =>
          !(next.gstNumber && record.gstNumber && record.gstNumber === next.gstNumber),
      );
      return [...withoutDuplicate, next];
    });
    setAddGstModalOpen(false);
  }, []);

  const validateGstNumber = useCallback(
    async (gstInNumber: string): Promise<ValidateGstResult | null> => {
      const normalized = gstInNumber.trim().toUpperCase();

      if (!leadId) {
        setError("Unable to validate GST number. Missing lead information.");
        return null;
      }

      if (!isValidGstNumber(normalized)) {
        setError("Invalid GST format.");
        return null;
      }

      setIsValidatingGst(true);
      setError(null);

      try {
        const response = await onboardingApi.validateGstIn({
          leadId,
          gstInNumber: normalized,
        });
        return {
          isMatchFound: response.isMatchFound,
          gstInId: response.gstInId || normalized,
          legalName: response.legalName,
          state: resolveStateName(response.state, stateOptions),
        };
      } catch {
        setError("Unable to validate GST number. Enter details manually.");
        return {
          isMatchFound: false,
          gstInId: normalized,
          legalName: "",
          state: "",
        };
      } finally {
        setIsValidatingGst(false);
      }
    },
    [leadId, stateOptions],
  );

  const uploadGstDocument = useCallback(async (file: File): Promise<string | null> => {
    if (!leadId || !resolvedPan) {
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
          panNumber: resolvedPan,
          applicationId: applicationIds,
          documentName: GST_CERTIFICATE_DOC_META.documentName,
          documentType: GST_CERTIFICATE_DOC_META.documentType,
          metadata: {},
        },
      });
      if (!response.fileURL) {
        setError("Document upload failed. Please retry.");
        return null;
      }
      return response.fileURL;
    } catch {
      setError("Document upload failed. Please retry.");
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [applicationIds, leadId, resolvedPan]);

  const uploadGstDocumentForRecord = useCallback(
    async (id: string, file: File): Promise<boolean> => {
      const fileURL = await uploadGstDocument(file);
      if (!fileURL) {
        return false;
      }

      setRecords((current) =>
        current.map((record) => (record.id === id ? { ...record, fileURL } : record)),
      );
      return true;
    },
    [uploadGstDocument],
  );

  const saveBusinessDetails = useCallback(async (): Promise<SaveBusinessDetailsResult | null> => {
    if (!leadId) {
      setError("Unable to save business details. Missing lead information.");
      return null;
    }

    if (!isBusinessDetailsStepValid(selectedBranch, records)) {
      setError("Please select a branch and complete GST details before continuing.");
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await onboardingApi.saveGstDetails({
        leadId,
        selectedBranch,
        gstInDetails: records.map(mapRecordToGstInItem),
      });

      return {
        nextStep: mapNextInfoSectionToStep(response.nextInfoSection) ?? "bank-details",
      };
    } catch {
      setError("Unable to save business details. Please try again.");
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [leadId, records, selectedBranch]);

  return {
    records,
    selectedBranch,
    branchOptions,
    stateOptions,
    isLoading,
    isSaving,
    isValidatingGst,
    isUploading,
    error,
    canContinue,
    addGstModalOpen,
    openAddGstModal: () => {
      setAddGstModalOpen(true);
    },
    closeAddGstModal: () => {
      setAddGstModalOpen(false);
    },
    loadBusinessDetails,
    selectBranch,
    toggleGstSelection,
    selectAllGst,
    removeGstEntry,
    addManualGst,
    validateGstNumber,
    uploadGstDocument,
    uploadGstDocumentForRecord,
    saveBusinessDetails,
  };
};
