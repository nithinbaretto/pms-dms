import type { ReactElement } from "react";
import { Check, Loader2, Mail, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../../../../shared/ui/button";
import { useOnboardingStore } from "../../state/onboarding-store";
import OtpInput from "../../components/OtpInput";
import SupportFooter from "../../components/SupportFooter";
import { onboardingApi } from "../../services/onboarding-api";
import { normalizeVerifiedSource } from "../personal-details/helpers";

type OtpStatus = "pending" | "success";

type OtpVerificationStepProps = {
  onBack: () => void;
  onContinue: () => void;
  initialTimerSeconds?: number;
  maxAttempts?: number;
};

const maskMobile = (mobile: string): string => {
  const digits = mobile.replace(/\D/g, "").slice(-10);
  if (digits.length < 4) {
    return digits || mobile;
  }

  return `${digits[0]}${"x".repeat(digits.length - 4)}${digits.slice(-1)}`;
};

const maskEmail = (email: string): string => {
  const [name = "", domain = ""] = email.split("@");

  if (!name || !domain) {
    return email;
  }

  return `${name.slice(0, 2).toLocaleLowerCase()}${"x".repeat(Math.max(0, name.length - 2))}@${domain.toLocaleLowerCase()}`;
};

const maskKraMobile = (mobile: string): string => {
  const digits = mobile.replace(/\D/g, "").slice(-10);
  if (digits.length < 2) {
    return digits || mobile;
  }

  return `${digits[0]}${"x".repeat(digits.length - 2)}${digits.slice(-1)}`;
};

const OtpVerificationStep = ({
  onBack,
  onContinue,
  initialTimerSeconds = 23,
  maxAttempts = 3,
}: OtpVerificationStepProps): ReactElement => {
  const {
    currentFlow,
    onboardingMethod,
    panNumber,
    leadId,
    inputEmail,
    inputMobile,
    kraRegisteredEmail,
    kraRegisteredMobile,
    otpAttempts,
    accountRestricted,
    setEmailVerified,
    setMobileVerified,
    setEmailVerifiedFromEntry,
    setMobileVerifiedFromEntry,
    setEmailVerifiedAt,
    setMobileVerifiedAt,
    setOtpAttempts,
    setAccountRestricted,
  } = useOnboardingStore();

  const aifArnFlow = currentFlow === "aif-individual" && onboardingMethod === "ARN";
  const aifKraFlow = currentFlow === "aif-individual" && onboardingMethod === "KRA";
  const aifPartnerOtpFlow = aifArnFlow || aifKraFlow;
  const hasEntryEmail = Boolean(inputEmail?.trim());
  const hasEntryMobile = Boolean(inputMobile?.trim());
  const hasRequiredContact = aifPartnerOtpFlow
    ? hasEntryEmail || hasEntryMobile
    : hasEntryEmail && hasEntryMobile;

  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(initialTimerSeconds);
  const [status, setStatus] = useState<OtpStatus>("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onContinue();
    }, 1400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onContinue, status]);

  useEffect(() => {
    if (timer <= 0 || status === "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setTimer((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [status, timer]);

  const handleContinue = async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }

    if (otpValue.length !== 6) {
      setErrorMessage("Please enter the 6-digit OTP");
      return;
    }

    if (accountRestricted) {
      setErrorMessage("Account restricted. Please contact support.");
      return;
    }

    if (!leadId || !panNumber.trim() || !hasRequiredContact) {
      setErrorMessage("Unable to verify OTP. Please restart onboarding.");
      return;
    }

    const otpNumber = Number(otpValue);
    if (!Number.isFinite(otpNumber)) {
      setErrorMessage("Please enter a valid OTP.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await onboardingApi.verifyOtp({
        leadId,
        otp: otpNumber,
        panNumber: panNumber.trim().toUpperCase(),
        type: "Partner Integration",
      });

      if (!response.verified) {
        const nextAttempts = otpAttempts + 1;
        setOtpAttempts(nextAttempts);
        setErrorMessage("Please enter a valid OTP.");
        if (nextAttempts > maxAttempts) {
          setAccountRestricted(true);
          setErrorMessage("Account restricted. Please contact support.");
        }
        return;
      }

      const verifiedAt = new Date().toISOString();
      const verifiedChannel = normalizeVerifiedSource(response.verifiedSource);

      if (verifiedChannel === "mobile" || (aifPartnerOtpFlow && hasEntryMobile && !hasEntryEmail)) {
        setMobileVerified(true);
        setMobileVerifiedFromEntry(true);
        setMobileVerifiedAt(verifiedAt);
      } else if (verifiedChannel === "email" || (aifPartnerOtpFlow && hasEntryEmail && !hasEntryMobile)) {
        setEmailVerified(true);
        setEmailVerifiedFromEntry(true);
        setEmailVerifiedAt(verifiedAt);
      } else {
        // Backend did not indicate channel — keep prior behavior as safe fallback.
        setEmailVerified(true);
        setMobileVerified(true);
        setEmailVerifiedFromEntry(true);
        setMobileVerifiedFromEntry(true);
        setEmailVerifiedAt(verifiedAt);
        setMobileVerifiedAt(verifiedAt);
      }

      setErrorMessage(null);
      setStatus("success");
    } catch {
      setErrorMessage("Unable to verify OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async (): Promise<void> => {
    if (timer > 0 || accountRestricted) {
      return;
    }

    if (!leadId || !panNumber.trim() || !hasRequiredContact) {
      setErrorMessage("Unable to resend OTP. Please restart onboarding.");
      return;
    }

    try {
      const otpResponse = await onboardingApi.sendOtp({
        email: inputEmail?.trim() || "",
        leadId,
        mobile: inputMobile?.trim() || "",
        panNumber: panNumber.trim().toUpperCase(),
        type: "Partner Integration",
      });

      if (!otpResponse.success) {
        setErrorMessage(otpResponse.message || "Unable to resend OTP. Please try again.");
        return;
      }

      setOtpValue("");
      setErrorMessage(null);
      setTimer(initialTimerSeconds);
    } catch {
      setErrorMessage("Unable to resend OTP. Please try again.");
    }
  };

  const visibleMobile = aifPartnerOtpFlow
    ? kraRegisteredMobile
      ? maskKraMobile(kraRegisteredMobile)
      : inputMobile
        ? maskMobile(inputMobile)
        : null
    : inputMobile
      ? maskMobile(inputMobile)
      : null;
  const visibleEmail = aifPartnerOtpFlow
    ? kraRegisteredEmail
      ? maskEmail(kraRegisteredEmail)
      : inputEmail
        ? maskEmail(inputEmail)
        : null
    : inputEmail
      ? maskEmail(inputEmail)
      : null;

  if (status === "success") {
    return (
      <section className="w-full rounded-2xl bg-[var(--color-onboarding-surface)] p-8 text-center shadow-[-8px_-8px_40px_0px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-3 py-6">
          <span className="flex size-14 items-center justify-center rounded-full bg-[#37b24d]">
            <Check className="size-8 text-white" strokeWidth={3} />
          </span>
          <h2 className="text-[36px] font-medium text-[var(--color-onboarding-heading)]">OTP Verified!</h2>
          <p className="text-base text-[var(--color-onboarding-heading)]">Taking you to the next step...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-full min-w-0 overflow-hidden rounded-2xl bg-[var(--color-onboarding-surface)] p-6 shadow-[-8px_-8px_40px_0px_rgba(0,0,0,0.08)] lg:p-8">
      <div className="min-w-0 space-y-5">
        <header className="space-y-8">
          <div className="flex flex-col gap-2">
            <h2 className="font-['Mulish',sans-serif] text-[22px] font-medium leading-none tracking-normal text-[#435160]">
              Verify OTP
            </h2>

            <p className="font-['Mulish',sans-serif] text-[15px] font-semibold leading-[22.5px] tracking-normal text-[#435160]">
              {aifKraFlow
                ? "OTP has been sent to your registered contact details"
                : "OTP has been sent to your APMI registered contact details"}
            </p>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
              {visibleMobile ? (
                <span className="inline-flex min-w-0 items-center gap-1 break-all font-['Mulish',sans-serif] text-[14px] font-medium leading-[18px] tracking-normal text-[#93161E]">
                  <Smartphone className="size-3.5 shrink-0" /> +91 {visibleMobile}
                </span>
              ) : null}
              {visibleEmail ? (
                <span className="inline-flex min-w-0 items-center gap-1 break-all font-['Mulish',sans-serif] text-[14px] font-medium leading-[18px] tracking-normal text-[#93161E]">
                  <Mail className="size-3.5 shrink-0" /> {visibleEmail}
                </span>
              ) : null}
            </div>
          </div>

          <p className="font-['Mulish',sans-serif] text-[15px] font-semibold leading-[22.5px] tracking-normal text-[#435160]">
            Please enter the 6-digit code below to proceed.
          </p>
        </header>

        <div className="flex flex-col items-center">
          <OtpInput
            onChange={(next) => {
              setOtpValue(next);
              if (errorMessage) {
                setErrorMessage(null);
              }
            }}
            value={otpValue}
          />

          <div className="mt-2 flex w-full flex-col items-center gap-5">
            {errorMessage ? (
              <p className="text-center font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[var(--color-onboarding-danger)]">
                {errorMessage}
              </p>
            ) : null}

            <p className="text-center font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[var(--color-onboarding-muted)]">
              {timer > 0 ? (
                <>
                  Resend OTP in{" "}
                  <span className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal">
                    {timer} Sec
                  </span>
                </>
              ) : (
                <button
                  className="mt-3 font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={accountRestricted}
                  onClick={() => {
                    void handleResend();
                  }}
                  type="button"
                >
                  Resend OTP
                </button>
              )}
            </p>
          </div>
        </div>

        {accountRestricted ? (
          <p className="text-center text-xs text-[var(--color-onboarding-danger)]">
            Account restricted after {maxAttempts} invalid attempts.
          </p>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-3 lg:gap-5">
          <Button
            className="h-9 rounded-[8px] border border-[#eeeeee] bg-white text-sm text-[var(--color-onboarding-heading)] hover:bg-[#f8f8f8] lg:rounded-[8.75px]"
            disabled={isSubmitting}
            onClick={onBack}
            type="button"
            variant="outline"
          >
            Back
          </Button>

          <Button
            className="h-9 rounded-[8px] bg-[var(--color-onboarding-primary)] text-sm text-white hover:bg-[#7f141a] lg:rounded-[8.75px]"
            disabled={accountRestricted || isSubmitting}
            onClick={() => {
              void handleContinue();
            }}
            type="button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>

        <SupportFooter />
      </div>
    </section>
  );
};

export default OtpVerificationStep;
