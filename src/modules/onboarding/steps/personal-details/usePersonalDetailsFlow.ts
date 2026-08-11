import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import {
  buildSavePayload,
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
  /** Entry-OTP verified channels stay locked on this step. */
  emailLockedFromEntry: boolean;
  mobileLockedFromEntry: boolean;
  fetchDetails: () => Promise<void>;
  setEmailValue: (value: string) => void;
  setMobileValue: (value: string) => void;
  startOtpForChannel: (channel: VerificationChannel) => Promise<void>;
  resendOtp: () => Promise<void>;
  verifyOtpForChannel: (otp: string) => Promise<boolean>;
  closeOtpModal: () => void;
  saveCorrespondenceAddress: (address: Address, sameAsPermanent: boolean) => void;
  saveDetails: () => Promise<SaveResult | null>;
};

export const usePersonalDetailsFlow = (): UsePersonalDetailsFlowResult => {
  const {
    leadId,
    panNumber,
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

  const [data, setData] = useState<PersonalDetailsModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpChannel, setOtpChannel] = useState<VerificationChannel | null>(null);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  /** Last successfully verified values — editing away from these requires re-verify. */
  const verifiedEmailBaselineRef = useRef<string | null>(null);
  const verifiedMobileBaselineRef = useRef<string | null>(null);

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
      const { emailVerified, mobileVerified } = useOnboardingStore.getState();
      const response = await onboardingApi.getPersonalDetails(leadId);
      const mapped = mapGetPersonalDetailsToModel(response, {
        emailVerified,
        mobileVerified,
      });
      verifiedEmailBaselineRef.current = mapped.email.verified
        ? normalizeEmailForCompare(mapped.email.value)
        : null;
      verifiedMobileBaselineRef.current = mapped.mobile.verified
        ? normalizeMobileForCompare(mapped.mobile.value)
        : null;
      setData(mapped);
      setPersonalDetails(mapped);
      setInputEmail(mapped.email.value);
      setInputMobile(mapped.mobile.value);
    } catch {
      setError("Unable to load personal details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [leadId, setInputEmail, setInputMobile, setPersonalDetails]);

  useEffect(() => {
    void fetchDetails();
  }, [fetchDetails]);

  const canSave = useMemo(() => {
    if (!data) {
      return false;
    }

    return isPersonalDetailsStepValid(data);
  }, [data]);

  const setEmailValue = useCallback(
    (value: string): void => {
      // Entry-verified email stays locked — only personal-details channel is editable.
      if (emailVerifiedFromEntry) {
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
    [emailVerifiedFromEntry, setEmailVerified],
  );

  const setMobileValue = useCallback(
    (value: string): void => {
      // Entry-verified mobile stays locked — only personal-details channel is editable.
      if (mobileVerifiedFromEntry) {
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
    [mobileVerifiedFromEntry, setMobileVerified],
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
          type: "Partner Integration",
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
    [leadId, panNumber],
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
          type: "Partner Integration",
        });

        if (!response.verified) {
          setError(response.message || "Invalid OTP. Please try again.");
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
            return {
              ...current,
              mobile: {
                ...current.mobile,
                verified: true,
              },
            };
          }

          verifiedEmailBaselineRef.current = normalizeEmailForCompare(current.email.value);
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

  const saveCorrespondenceAddress = useCallback((address: Address, sameAsPermanent: boolean): void => {
    setData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        isCorrespoingSameAsPermanent: sameAsPermanent,
        correspondenceAddress: sameAsPermanent ? { ...current.permanentAddress } : address,
      };
    });
  }, []);

  const saveDetails = useCallback(async (): Promise<SaveResult | null> => {
    if (!data || !leadId || !canSave) {
      setError("Please complete required fields before continuing.");
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = buildSavePayload(data, leadId);
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
  }, [canSave, data, leadId, setInputEmail, setInputMobile, setPersonalDetails]);

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
    emailLockedFromEntry: emailVerifiedFromEntry,
    mobileLockedFromEntry: mobileVerifiedFromEntry,
    fetchDetails,
    setEmailValue,
    setMobileValue,
    startOtpForChannel,
    resendOtp,
    verifyOtpForChannel,
    closeOtpModal,
    saveCorrespondenceAddress,
    saveDetails,
  };
};
