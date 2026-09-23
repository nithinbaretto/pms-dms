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
import {
  isKnownBusinessEntityType,
  mapAuthSignatoryDataToSave,
  mapAuthSignatoryDetailsFromApi,
  toBusinessEntityType,
} from "./signatory/api-mappers";
import {
  BUSINESS_SIGNATORY_DOC_META,
  DEFAULT_BUSINESS_ENTITY_TYPE,
  isPmsIndividualEntityTypeLocked,
  shouldShowAuthorizedSignatory,
} from "./signatory/constants";
import type {
  BusinessEntityType,
  SignatoryDetails,
  SignatoryDocumentFile,
  SignatoryDocumentKind,
  SignatoryMode,
} from "./signatory/types";
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
  entityType: BusinessEntityType;
  signatories: SignatoryDetails[];
  signatoryMode: SignatoryMode;
  anySignatoryCount: number;
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
  setEntityType: (value: BusinessEntityType) => void;
  setSignatories: (value: SignatoryDetails[] | ((current: SignatoryDetails[]) => SignatoryDetails[])) => void;
  setSignatoryMode: (value: SignatoryMode) => void;
  setAnySignatoryCount: (value: number | ((current: number) => number)) => void;
  toggleGstSelection: (id: string) => void;
  selectAllGst: () => void;
  removeGstEntry: (id: string) => void;
  addManualGst: (drafts: ManualGstDraft[]) => void;
  validateGstNumber: (gstInNumber: string) => Promise<ValidateGstResult | null>;
  uploadGstDocument: (file: File) => Promise<string | null>;
  uploadGstDocumentForRecord: (id: string, file: File) => Promise<boolean>;
  uploadSignatoryDocument: (
    file: File,
    kind: SignatoryDocumentKind,
  ) => Promise<SignatoryDocumentFile | null>;
  saveBusinessDetails: () => Promise<SaveBusinessDetailsResult | null>;
};

export const useBusinessDetailsFlow = (): UseBusinessDetailsFlowResult => {
  const {
    leadId,
    pan,
    panNumber,
    applicationIds,
    personalDetails,
    onboardingMethod,
    kraDataSource,
    currentFlow,
  } = useOnboardingStore();
  const resolvedPan = (pan || panNumber).trim().toUpperCase();
  const permanentPincode = extractPincodeFromAddress(personalDetails?.permanentAddress);
  const personalEntityType = personalDetails?.personalDetails.entityType ?? "";
  const lockEntityTypeFromPersonal = isPmsIndividualEntityTypeLocked(currentFlow);

  const [records, setRecords] = useState<GstRecord[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branchOptions, setBranchOptions] = useState<BranchOption[]>(BRANCH_OPTIONS);
  const [stateOptions, setStateOptions] = useState<string[]>(getFallbackStateOptions);
  const [entityType, setEntityType] = useState<BusinessEntityType>(() =>
    lockEntityTypeFromPersonal && isKnownBusinessEntityType(personalEntityType)
      ? toBusinessEntityType(personalEntityType)
      : DEFAULT_BUSINESS_ENTITY_TYPE,
  );
  const [signatories, setSignatories] = useState<SignatoryDetails[]>([]);
  const [signatoryMode, setSignatoryMode] = useState<SignatoryMode>("jointly");
  const [anySignatoryCount, setAnySignatoryCount] = useState(1);
  const [riaNumber, setRiaNumber] = useState("");
  const [isRia, setIsRia] = useState(false);
  const [dataSource, setDataSource] = useState("");
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

      const apiEntityType = response.entityType.trim();
      if (isPmsIndividualEntityTypeLocked(currentFlow)) {
        setEntityType(
          isKnownBusinessEntityType(personalEntityType)
            ? toBusinessEntityType(personalEntityType)
            : DEFAULT_BUSINESS_ENTITY_TYPE,
        );
      } else if (isKnownBusinessEntityType(apiEntityType)) {
        setEntityType(toBusinessEntityType(apiEntityType));
      } else if (isKnownBusinessEntityType(personalEntityType)) {
        setEntityType(toBusinessEntityType(personalEntityType));
      } else {
        setEntityType(DEFAULT_BUSINESS_ENTITY_TYPE);
      }

      const mappedSignatory = mapAuthSignatoryDetailsFromApi(response.authSignatoryData);
      setSignatories(mappedSignatory.signatories);
      setSignatoryMode(mappedSignatory.signatoryMode);
      setAnySignatoryCount(mappedSignatory.anySignatoryCount);
      setRiaNumber(response.riaNumber.trim());
      setIsRia(response.isRia);
      setDataSource(response.dataSource.trim());

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
      setSignatories([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentFlow, leadId, personalEntityType]);

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
    setRecords((current) => {
      const allSelected = current.length > 0 && current.every((record) => record.selected);
      return current.map((record) => ({ ...record, selected: !allSelected }));
    });
  }, []);

  const removeGstEntry = useCallback((id: string): void => {
    setRecords((current) => current.filter((record) => record.id !== id));
  }, []);

  const addManualGst = useCallback((drafts: ManualGstDraft[]): void => {
    setRecords((current) => {
      let next = [...current];
      drafts.forEach((draft) => {
        const mapped = mapDraftToRecord(draft);
        next = next.filter(
          (record) =>
            !(mapped.gstNumber && record.gstNumber && record.gstNumber === mapped.gstNumber),
        );
        next.push(mapped);
      });
      return next;
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
          isValidated: response.isValidated,
          gstInId: response.gstInId || normalized,
          legalName: response.legalName,
          state: resolveStateName(response.state, stateOptions),
        };
      } catch {
        setError("Unable to validate GST number. Enter details manually.");
        return {
          isValidated: false,
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

  const uploadSignatoryDocument = useCallback(
    async (file: File, kind: SignatoryDocumentKind): Promise<SignatoryDocumentFile | null> => {
      if (!leadId || !resolvedPan) {
        setError("Document upload failed. Missing lead or PAN information.");
        return null;
      }

      const meta = BUSINESS_SIGNATORY_DOC_META[kind];
      setIsUploading(true);
      setError(null);

      try {
        const response = await onboardingApi.uploadDocument({
          file,
          payload: {
            leadId,
            panNumber: resolvedPan,
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
    [applicationIds, leadId, resolvedPan],
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

    const includeSignatories = shouldShowAuthorizedSignatory(personalEntityType, entityType);
    const entityTypeForSave = entityType;
    const resolvedDataSource =
      dataSource.trim() ||
      kraDataSource?.trim() ||
      (onboardingMethod === "MANUAL" ? "MANUAL" : onboardingMethod === "KRA" ? "KRA" : "APMI");

    setIsSaving(true);
    setError(null);

    try {
      const response = await onboardingApi.saveGstDetails({
        leadId,
        selectedBranch,
        gstInDetails: records.map(mapRecordToGstInItem),
        entityType: entityTypeForSave,
        riaNumber,
        dataSource: resolvedDataSource,
        isRia,
        authSignatoryData: mapAuthSignatoryDataToSave(
          signatories,
          signatoryMode,
          anySignatoryCount,
          includeSignatories,
        ),
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
  }, [
    anySignatoryCount,
    dataSource,
    entityType,
    isRia,
    kraDataSource,
    leadId,
    onboardingMethod,
    personalEntityType,
    records,
    riaNumber,
    selectedBranch,
    signatories,
    signatoryMode,
  ]);

  const handleSetEntityType = useCallback(
    (value: BusinessEntityType): void => {
      if (lockEntityTypeFromPersonal) {
        return;
      }
      setEntityType(value);
    },
    [lockEntityTypeFromPersonal],
  );

  return {
    records,
    selectedBranch,
    branchOptions,
    stateOptions,
    entityType,
    signatories,
    signatoryMode,
    anySignatoryCount,
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
    setEntityType: handleSetEntityType,
    setSignatories,
    setSignatoryMode,
    setAnySignatoryCount,
    toggleGstSelection,
    selectAllGst,
    removeGstEntry,
    addManualGst,
    validateGstNumber,
    uploadGstDocument,
    uploadGstDocumentForRecord,
    uploadSignatoryDocument,
    saveBusinessDetails,
  };
};
