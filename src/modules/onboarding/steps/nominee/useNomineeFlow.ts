import { useCallback, useEffect, useMemo, useState } from "react";

import { onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import { createEmptyNomineeForm } from "./constants";
import {
  buildSaveNomineePayload,
  cloneNomineeSnapshot,
  formatApplicantAddress,
  hasNomineeCoreData,
  mapGetNomineeDetailsToForm,
  validateAgeForMinor,
} from "./helpers";
import type { NomineeFormData, NomineeOption, NomineeSnapshot } from "./types";
import { isNomineeFormValid } from "./validation";

type SubmitResult = {
  skipped: boolean;
};

type UseNomineeFlowResult = {
  form: NomineeFormData;
  option: NomineeOption;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  applicantPermanentAddress: string;
  isMinor: boolean;
  canProceed: boolean;
  setOption: (option: NomineeOption) => void;
  updateField: <K extends keyof NomineeFormData>(key: K, value: NomineeFormData[K]) => void;
  handleAddressSync: (sameAsApplicant: boolean) => void;
  handleGuardianSync: (sameAsNominee: boolean) => void;
  validateAgeForMinor: (dob: string) => boolean;
  loadNominee: () => Promise<void>;
  addNomineeLater: () => void;
  submitNominee: () => Promise<SubmitResult | null>;
};

export const useNomineeFlow = (): UseNomineeFlowResult => {
  const { leadId, personalDetails } = useOnboardingStore();

  const applicantPermanentAddress = useMemo(
    () => formatApplicantAddress(personalDetails?.permanentAddress),
    [personalDetails?.permanentAddress],
  );

  const [form, setForm] = useState<NomineeFormData>(createEmptyNomineeForm);
  const [initialSnapshot, setInitialSnapshot] = useState<NomineeSnapshot>(createEmptyNomineeForm);
  const [option, setOptionState] = useState<NomineeOption>("now");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMinor = useMemo(() => validateAgeForMinor(form.dateOfBirth), [form.dateOfBirth]);

  const canProceed = useMemo(() => {
    if (isSaving) {
      return false;
    }

    return isNomineeFormValid(option, form, applicantPermanentAddress);
  }, [applicantPermanentAddress, form, isSaving, option]);

  const loadNominee = useCallback(async (): Promise<void> => {
    if (!leadId) {
      setError("Unable to load nominee details. Missing lead information.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await onboardingApi.getNomineeDetails(leadId);
      const mapped = mapGetNomineeDetailsToForm(response);

      if (mapped.isNomineeAddressSameAsApplicantAddress && applicantPermanentAddress) {
        mapped.nomineeAddress = applicantPermanentAddress;
      }

      if (mapped.isGuardianAddressSameAsNomineeAddress && mapped.nomineeAddress) {
        mapped.guardianAddress = mapped.nomineeAddress;
      }

      // Empty GET → Add Now blank form. Prefill only when backend already has data.
      setForm(hasNomineeCoreData(mapped) ? mapped : createEmptyNomineeForm());
      setInitialSnapshot(cloneNomineeSnapshot(mapped));
      setOptionState("now");
    } catch {
      setError("Unable to load nominee details. Please try again.");
      setForm(createEmptyNomineeForm());
      setInitialSnapshot(createEmptyNomineeForm());
    } finally {
      setIsLoading(false);
    }
  }, [applicantPermanentAddress, leadId]);

  useEffect(() => {
    void loadNominee();
  }, [loadNominee]);

  useEffect(() => {
    if (!isMinor) {
      setForm((current) => {
        if (
          !current.guardianName &&
          !current.guardianAddress &&
          !current.isGuardianAddressSameAsNomineeAddress
        ) {
          return current;
        }

        return {
          ...current,
          guardianName: "",
          guardianAddress: "",
          isGuardianAddressSameAsNomineeAddress: false,
        };
      });
    }
  }, [isMinor]);

  const updateField = useCallback(<K extends keyof NomineeFormData>(key: K, value: NomineeFormData[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }, []);

  const handleAddressSync = useCallback(
    (sameAsApplicant: boolean) => {
      setForm((current) => ({
        ...current,
        isNomineeAddressSameAsApplicantAddress: sameAsApplicant,
        nomineeAddress: sameAsApplicant
          ? applicantPermanentAddress || current.nomineeAddress
          : current.nomineeAddress,
        guardianAddress:
          current.isGuardianAddressSameAsNomineeAddress && sameAsApplicant
            ? applicantPermanentAddress || current.nomineeAddress
            : current.guardianAddress,
      }));
    },
    [applicantPermanentAddress],
  );

  const handleGuardianSync = useCallback((sameAsNominee: boolean) => {
    setForm((current) => ({
      ...current,
      isGuardianAddressSameAsNomineeAddress: sameAsNominee,
      guardianAddress: sameAsNominee ? current.nomineeAddress : current.guardianAddress,
    }));
  }, []);

  const setOption = useCallback((next: NomineeOption) => {
    setOptionState(next);
    setError(null);
  }, []);

  const addNomineeLater = useCallback(() => {
    setOptionState("later");
    setError(null);
  }, []);

  const submitNominee = useCallback(async (): Promise<SubmitResult | null> => {
    if (option === "later") {
      return { skipped: true };
    }

    if (!leadId) {
      setError("Unable to save nominee details. Missing lead information.");
      return null;
    }

    if (!isNomineeFormValid(option, form, applicantPermanentAddress)) {
      setError("Please complete the required nominee details.");
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onboardingApi.saveNomineeDetails(
        buildSaveNomineePayload(form, initialSnapshot, leadId, applicantPermanentAddress),
      );
      return { skipped: false };
    } catch {
      setError("Unable to save nominee details. Please try again.");
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [applicantPermanentAddress, form, initialSnapshot, leadId, option]);

  return {
    form,
    option,
    isLoading,
    isSaving,
    error,
    applicantPermanentAddress,
    isMinor,
    canProceed,
    setOption,
    updateField,
    handleAddressSync,
    handleGuardianSync,
    validateAgeForMinor,
    loadNominee,
    addNomineeLater,
    submitNominee,
  };
};
