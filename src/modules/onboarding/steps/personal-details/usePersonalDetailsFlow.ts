import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { onboardingApi, type PartnerOtpType } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import {
  buildSavePayload,
  createEmptyPersonalDetails,
  mapGetPersonalDetailsToModel,
  mapNextInfoSectionToStep,
  normalizeEmailForCompare,
  normalizeMobileForCompare,
  normalizeVerifiedSource,
} from "./helpers";
import type { Address, PersonalDetailsModel, VerificationChannel } from "./types";
import { isEmailValid, isMobileValid, isPersonalDetailsStepValid } from "./validation";

type SaveResult = {
  data: PersonalDetailsModel;
  nextStep: string | null;
};

type UsePersonalDetailsFlowResult = {
  data: PersonalDetailsModel | null;
  isLoading: boolean;
  isSaving: boolean;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  error: string | null;
  otpChannel: VerificationChannel | null;
  otpModalOpen: boolean;
  canSave: boolean;
  isManualFlow: boolean;
  isArnFlow: boolean;
  isKraFlow: boolean;
  /** Contact fields stay locked until both email and mobile are verified. */
  emailLockedFromEntry: boolean;
  mobileLockedFromEntry: boolean;
  fetchDetails: () => Promise<void>;
  setNameValue: (value: string) => void;
  setDobValue: (value: string) => void;
  setEmailValue: (value: string) => void;
  setMobileValue: (value: string) => void;
  startOtpForChannel: (channel: VerificationChannel) => Promise<void>;
  resendOtp: () => Promise<void>;
  verifyOtpForChannel: (otp: string) => Promise<boolean>;
  closeOtpModal: () => void;
  savePermanentAddress: (address: Address) => void;
  saveCorrespondenceAddress: (address: Address, sameAsPermanent: boolean) => void;
  saveDetails: () => Promise<SaveResult | null>;
};

export const usePersonalDetailsFlow = (): UsePersonalDetailsFlowResult => {
  const {
    currentFlow,
    leadId,
    panNumber,
    onboardingMethod,
    kraDataSource,
    arn,
    emailVerifiedFromEntry,
    mobileVerifiedFromEntry,
    setEmailVerified,
    setMobileVerified,
    setEmailVerifiedAt,
    setMobileVerifiedAt,
    setInputEmail,
    setInputMobile,
    setPersonalDetails,
  } = useOnboardingStore();
  const isManualFlow = currentFlow === "aif-individual" && onboardingMethod === "MANUAL";
  const isArnFlow = currentFlow === "aif-individual" && onboardingMethod === "ARN";
  const isKraFlow = currentFlow === "aif-individual" && onboardingMethod === "KRA";

  const [data, setData] = useState<PersonalDetailsModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpChannel, setOtpChannel] = useState<VerificationChannel | null>(null);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [contactFieldsUnlocked, setContactFieldsUnlocked] = useState(false);
  /** Last successfully verified values — editing away from these requires re-verify. */
  const verifiedEmailBaselineRef = useRef<string | null>(null);
  const verifiedMobileBaselineRef = useRef<string | null>(null);
  /** True after channel was verified on this step (not entry) — next OTP uses type Primary. */
  const emailVerifiedOnceOnPdRef = useRef(false);
  const mobileVerifiedOnceOnPdRef = useRef(false);

  const resolveOtpType = useCallback((channel: VerificationChannel): PartnerOtpType => {
    if (isManualFlow) {
      return "Primary";
    }

    const verifiedOnceOnPd =
      channel === "email" ? emailVerifiedOnceOnPdRef.current : mobileVerifiedOnceOnPdRef.current;
    return verifiedOnceOnPd ? "Primary" : "Partner Integration";
  }, [isManualFlow]);

  const fetchDetails = useCallback(async (): Promise<void> => {
    if (!leadId) {
      setError("Unable to load personal details. Missing lead information.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Read verification flags at fetch time so later OTP updates do not re-trigger load.
      const { emailVerified, mobileVerified, emailVerifiedFromEntry, mobileVerifiedFromEntry } =
        useOnboardingStore.getState();
      const response = await onboardingApi.getPersonalDetails(leadId);
      const mapped = mapGetPersonalDetailsToModel(response, {
        emailVerified,
        mobileVerified,
      });

      if (isManualFlow && !mapped.personalDetails.pan.trim()) {
        mapped.personalDetails.pan = panNumber.trim().toUpperCase();
      }

      if (!mapped.personalDetails.arn.trim() && arn?.trim() && !isKraFlow) {
        mapped.personalDetails.arn = arn.trim().toUpperCase();
      }

      if (isKraFlow) {
        mapped.personalDetails.aprn = "";
        mapped.personalDetails.arn = "";
        if (!mapped.personalDetails.entityType) {
          mapped.personalDetails.entityType = "Individual";
        }
      }

      verifiedEmailBaselineRef.current = mapped.email.verified
        ? normalizeEmailForCompare(mapped.email.value)
        : null;
      verifiedMobileBaselineRef.current = mapped.mobile.verified
        ? normalizeMobileForCompare(mapped.mobile.value)
        : null;
      // Entry-verified channels stay Partner Integration if ever re-opened; PD-verified use Primary.
      emailVerifiedOnceOnPdRef.current = emailVerified && !emailVerifiedFromEntry;
      mobileVerifiedOnceOnPdRef.current = mobileVerified && !mobileVerifiedFromEntry;
      setData(mapped);
      setPersonalDetails(mapped);
      setInputEmail(mapped.email.value);
      setInputMobile(mapped.mobile.value);
    } catch {
      if (isManualFlow) {
        const emptyModel = createEmptyPersonalDetails(panNumber);
        setData(emptyModel);
        setPersonalDetails(emptyModel);
        setInputEmail(emptyModel.email.value);
        setInputMobile(emptyModel.mobile.value);
        setError(null);
      } else {
        setError("Unable to load personal details. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [arn, isKraFlow, isManualFlow, leadId, panNumber, setInputEmail, setInputMobile, setPersonalDetails]);

  useEffect(() => {
    void fetchDetails();
  }, [fetchDetails]);

  useEffect(() => {
    if (isManualFlow || (data?.email.verified && data?.mobile.verified)) {
      setContactFieldsUnlocked(true);
    }
  }, [data?.email.verified, data?.mobile.verified, isManualFlow]);

  const canSave = useMemo(() => {
    if (!data) {
      return false;
    }

    return isPersonalDetailsStepValid(data, { isManual: isManualFlow });
  }, [data, isManualFlow]);

  const setNameValue = useCallback((value: string): void => {
    setData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        personalDetails: {
          ...current.personalDetails,
          name: value,
        },
      };
    });
  }, []);

  const setDobValue = useCallback((value: string): void => {
    setData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        personalDetails: {
          ...current.personalDetails,
          dob: value,
        },
      };
    });
  }, []);

  const setEmailValue = useCallback(
    (value: string): void => {
      if (!isManualFlow && !contactFieldsUnlocked) {
        return;
      }

      const matchesBaseline =
        verifiedEmailBaselineRef.current !== null &&
        normalizeEmailForCompare(value) === verifiedEmailBaselineRef.current;

      setEmailVerified(matchesBaseline);
      setData((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          email: {
            value,
            verified: matchesBaseline,
          },
        };
      });
    },
    [contactFieldsUnlocked, isManualFlow, setEmailVerified],
  );

  const setMobileValue = useCallback(
    (value: string): void => {
      if (!isManualFlow && !contactFieldsUnlocked) {
        return;
      }

      const digits = value.replace(/\D/g, "").slice(0, 10);
      const matchesBaseline =
        verifiedMobileBaselineRef.current !== null &&
        normalizeMobileForCompare(digits) === verifiedMobileBaselineRef.current;

      setMobileVerified(matchesBaseline);
      setData((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          mobile: {
            value: digits,
            verified: matchesBaseline,
          },
        };
      });
    },
    [contactFieldsUnlocked, isManualFlow, setMobileVerified],
  );

  const sendChannelOtp = useCallback(
    async (channel: VerificationChannel, model: PersonalDetailsModel): Promise<boolean> => {
      if (!leadId || !panNumber.trim()) {
        setError("Unable to send OTP. Please restart onboarding.");
        return false;
      }

      const email = model.email.value.trim();
      const mobile = model.mobile.value.trim();

      if (channel === "email" && !isEmailValid(email)) {
        setError("Please enter a valid email before verifying.");
        return false;
      }

      if (channel === "mobile" && !isMobileValid(mobile)) {
        setError("Please enter a valid 10-digit mobile before verifying.");
        return false;
      }

      setIsSendingOtp(true);
      setError(null);

      try {
        // Channel-specific send: active channel value + empty string for the other.
        const response = await onboardingApi.sendOtp({
          email: channel === "email" ? email : "",
          mobile: channel === "mobile" ? mobile : "",
          leadId,
          panNumber: panNumber.trim().toUpperCase(),
          type: resolveOtpType(channel),
        });

        if (!response.success) {
          setError(response.message || "Unable to send OTP. Please try again.");
          return false;
        }

        return true;
      } catch {
        setError("Unable to send OTP. Please try again.");
        return false;
      } finally {
        setIsSendingOtp(false);
      }
    },
    [leadId, panNumber, resolveOtpType],
  );

  const startOtpForChannel = useCallback(
    async (channel: VerificationChannel): Promise<void> => {
      if (!data) {
        return;
      }

      if (channel === "email" && data.email.verified) {
        return;
      }

      if (channel === "mobile" && data.mobile.verified) {
        return;
      }

      const sent = await sendChannelOtp(channel, data);
      if (!sent) {
        return;
      }

      setOtpChannel(channel);
      setOtpModalOpen(true);
    },
    [data, sendChannelOtp],
  );

  const resendOtp = useCallback(async (): Promise<void> => {
    if (!data || !otpChannel) {
      return;
    }

    await sendChannelOtp(otpChannel, data);
  }, [data, otpChannel, sendChannelOtp]);

  const verifyOtpForChannel = useCallback(
    async (otp: string): Promise<boolean> => {
      if (!data || !otpChannel || !leadId || !panNumber.trim()) {
        setError("Unable to verify OTP. Please try again.");
        return false;
      }

      const otpNumber = Number(otp);
      if (!Number.isFinite(otpNumber)) {
        setError("Please enter a valid OTP.");
        return false;
      }

      setIsVerifyingOtp(true);
      setError(null);

      try {
        const response = await onboardingApi.verifyOtp({
          leadId,
          otp: otpNumber,
          panNumber: panNumber.trim().toUpperCase(),
          type: resolveOtpType(otpChannel),
        });

        if (!response.verified) {
          setError("Please enter a valid OTP.");
          return false;
        }

        const verifiedAt = new Date().toISOString();
        const source = normalizeVerifiedSource(response.verifiedSource) ?? otpChannel;

        setData((current) => {
          if (!current) {
            return current;
          }

          if (source === "mobile") {
            verifiedMobileBaselineRef.current = normalizeMobileForCompare(current.mobile.value);
            mobileVerifiedOnceOnPdRef.current = true;
            return {
              ...current,
              mobile: {
                ...current.mobile,
                verified: true,
              },
            };
          }

          verifiedEmailBaselineRef.current = normalizeEmailForCompare(current.email.value);
          emailVerifiedOnceOnPdRef.current = true;
          return {
            ...current,
            email: {
              ...current.email,
              verified: true,
            },
          };
        });

        if (source === "mobile") {
          setMobileVerified(true);
          setMobileVerifiedAt(verifiedAt);
        } else {
          setEmailVerified(true);
          setEmailVerifiedAt(verifiedAt);
        }

        setOtpModalOpen(false);
        setOtpChannel(null);
        return true;
      } catch {
        setError("Unable to verify OTP. Please try again.");
        return false;
      } finally {
        setIsVerifyingOtp(false);
      }
    },
    [
      data,
      leadId,
      otpChannel,
      panNumber,
      resolveOtpType,
      setEmailVerified,
      setEmailVerifiedAt,
      setMobileVerified,
      setMobileVerifiedAt,
    ],
  );

  const closeOtpModal = useCallback((): void => {
    setOtpModalOpen(false);
    setOtpChannel(null);
  }, []);

  const savePermanentAddress = useCallback((address: Address): void => {
    setData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        permanentAddress: address,
        correspondenceAddress: current.isCorrespoingSameAsPermanent
          ? { ...address }
          : current.correspondenceAddress,
      };
    });
  }, []);

  const saveCorrespondenceAddress = useCallback((address: Address, sameAsPermanent: boolean): void => {
    setData((current) => {
      if (!current) {
        return current;
      }

      if (!isManualFlow && (!current.email.verified || !current.mobile.verified)) {
        return current;
      }

      return {
        ...current,
        isCorrespoingSameAsPermanent: sameAsPermanent,
        correspondenceAddress: sameAsPermanent ? { ...current.permanentAddress } : address,
      };
    });
  }, [isManualFlow]);

  const saveDetails = useCallback(async (): Promise<SaveResult | null> => {
    if (!data || !leadId || !canSave) {
      setError("Please complete required fields before continuing.");
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = buildSavePayload(
        data,
        leadId,
        isManualFlow
          ? "MANUAL"
          : kraDataSource ?? (onboardingMethod === "KRA" ? "KRA" : "APMI"),
      );
      const response = await onboardingApi.savePersonalDetails(payload);
      const nextFromSave = response.nextInfoSection ?? data.nextInfoSection;
      const nextModel: PersonalDetailsModel = {
        ...data,
        applicationStatus: response.Application_status || data.applicationStatus,
        nextInfoSection: nextFromSave || data.nextInfoSection,
      };

      setData(nextModel);
      setPersonalDetails(nextModel);
      setInputEmail(nextModel.email.value);
      setInputMobile(nextModel.mobile.value);

      return {
        data: nextModel,
        nextStep: mapNextInfoSectionToStep(nextFromSave),
      };
    } catch {
      setError("Unable to save personal details. Please try again.");
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [
    canSave,
    data,
    isManualFlow,
    kraDataSource,
    leadId,
    onboardingMethod,
    setInputEmail,
    setInputMobile,
    setPersonalDetails,
  ]);

  return {
    data,
    isLoading,
    isSaving,
    isSendingOtp,
    isVerifyingOtp,
    error,
    otpChannel,
    otpModalOpen,
    canSave,
    isManualFlow,
    isArnFlow,
    isKraFlow,
    emailLockedFromEntry: isManualFlow ? false : !contactFieldsUnlocked,
    mobileLockedFromEntry: isManualFlow ? false : !contactFieldsUnlocked,
    fetchDetails,
    setNameValue,
    setDobValue,
    setEmailValue,
    setMobileValue,
    startOtpForChannel,
    resendOtp,
    verifyOtpForChannel,
    closeOtpModal,
    savePermanentAddress,
    saveCorrespondenceAddress,
    saveDetails,
  };
};
