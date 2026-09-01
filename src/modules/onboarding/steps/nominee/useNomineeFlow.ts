import { useCallback, useEffect, useMemo, useState } from "react";

import { onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import type { Address } from "../personal-details/types";
import { createEmptyNomineeForm } from "./constants";
import {
  buildSaveNomineePayload,
  cloneNomineeSnapshot,
  emptyAddress,
  formatApplicantAddress,
  hasNomineeCoreData,
  mapGetNomineeDetailsToForm,
  validateAgeForMinor,
  withDefaultGuardianSameAsNominee,
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
  applicantPermanentAddressModel: Address;
  isMinor: boolean;
  canProceed: boolean;
  setOption: (option: NomineeOption) => void;
  updateField: <K extends keyof NomineeFormData>(key: K, value: NomineeFormData[K]) => void;
  handleAddressSync: (sameAsApplicant: boolean) => void;
  handleGuardianSync: (sameAsNominee: boolean) => void;
  saveNomineeAddress: (address: Address, sameAsApplicant: boolean) => void;
  saveGuardianAddress: (address: Address, sameAsNominee: boolean) => void;
  validateAgeForMinor: (dob: string) => boolean;
  loadNominee: () => Promise<void>;
  addNomineeLater: () => void;
  submitNominee: () => Promise<SubmitResult | null>;
};

export const useNomineeFlow = (): UseNomineeFlowResult => {
  const { leadId, personalDetails } = useOnboardingStore();

  const applicantPermanentAddressModel = useMemo(
    () => personalDetails?.permanentAddress ?? emptyAddress(),
    [personalDetails?.permanentAddress],
  );

  const applicantPermanentAddress = useMemo(
    () => formatApplicantAddress(applicantPermanentAddressModel),
    [applicantPermanentAddressModel],
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

      const nextForm = hasNomineeCoreData(mapped) ? mapped : createEmptyNomineeForm();
      setForm(withDefaultGuardianSameAsNominee(nextForm));
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
    setForm((current) => {
      if (!isMinor) {
        if (!current.guardianName && !current.guardianAddress) {
          return current;
        }

        return {
          ...current,
          guardianName: "",
          guardianAddress: "",
          isGuardianAddressSameAsNomineeAddress: true,
        };
      }

      return withDefaultGuardianSameAsNominee(current);
    });
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
      guardianAddress: sameAsNominee ? current.nomineeAddress : "",
    }));
  }, []);

  const saveNomineeAddress = useCallback(
    (address: Address, sameAsApplicant: boolean) => {
      const formatted = sameAsApplicant
        ? formatApplicantAddress(applicantPermanentAddressModel) || formatApplicantAddress(address)
        : formatApplicantAddress(address);

      setForm((current) => ({
        ...current,
        isNomineeAddressSameAsApplicantAddress: sameAsApplicant,
        nomineeAddress: formatted,
        guardianAddress: current.isGuardianAddressSameAsNomineeAddress
          ? formatted
          : current.guardianAddress,
      }));
    },
    [applicantPermanentAddressModel],
  );

  const saveGuardianAddress = useCallback((address: Address, sameAsNominee: boolean) => {
    setForm((current) => {
      const formatted = sameAsNominee
        ? current.nomineeAddress
        : formatApplicantAddress(address);

      return {
        ...current,
        isGuardianAddressSameAsNomineeAddress: sameAsNominee,
        guardianAddress: formatted,
      };
    });
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
    applicantPermanentAddressModel,
    isMinor,
    canProceed,
    setOption,
    updateField,
    handleAddressSync,
    handleGuardianSync,
    saveNomineeAddress,
    saveGuardianAddress,
    validateAgeForMinor,
    loadNominee,
    addNomineeLater,
    submitNominee,
  };
};
