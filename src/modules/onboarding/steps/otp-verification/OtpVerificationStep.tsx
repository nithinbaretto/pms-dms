import type { ReactElement } from "react";
import { Check, Loader2, Mail, Smartphone } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const digits = mobile.replace(/\D/g, "");
  if (digits.length < 4) {
    return mobile;
  }

  return `${"x".repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
};

const maskEmail = (email: string): string => {
  const [name = "", domain = ""] = email.split("@");

  if (!name || !domain) {
    return email;
  }

  return `${name.slice(0, 2)}${"x".repeat(Math.max(0, name.length - 2))}@${domain}`;
};

const OtpVerificationStep = ({
  onBack,
  onContinue,
  initialTimerSeconds = 23,
  maxAttempts = 3,
}: OtpVerificationStepProps): ReactElement => {
  const {
    onboardingMethod,
    panNumber,
    leadId,
    inputEmail,
    inputMobile,
    amfiMaskedEmail,
    amfiMaskedMobile,
    emailVerified,
    mobileVerified,
    otpAttempts,
    otpTimerSeconds,
    accountRestricted,
    setEmailVerified,
    setMobileVerified,
    setEmailVerifiedFromEntry,
    setMobileVerifiedFromEntry,
    setEmailVerifiedAt,
    setMobileVerifiedAt,
    setOtpAttempts,
    setOtpTimerSeconds,
    setAccountRestricted,
  } = useOnboardingStore();

  const aifArnFlow = onboardingMethod === "ARN";
  const hasAmfiEmail = Boolean(amfiMaskedEmail);
  const hasAmfiMobile = Boolean(amfiMaskedMobile);
  const hasEntryEmail = Boolean(inputEmail?.trim());
  const hasEntryMobile = Boolean(inputMobile?.trim());

  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(aifArnFlow ? otpTimerSeconds : initialTimerSeconds);
  const [status, setStatus] = useState<OtpStatus>("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initializedRef = useRef(false);

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

  // AIF ARN path still triggers OTP on mount. Entry (APRN) OTP is generated before navigation.
  useEffect(() => {
    if (!aifArnFlow || initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    const triggerOtp = async (): Promise<void> => {
      if (hasAmfiEmail) {
        await onboardingApi.sendAmfiOtp({ channel: "email" });
      }

      if (hasAmfiMobile) {
        await onboardingApi.sendAmfiOtp({ channel: "mobile" });
      }

      setTimer(otpTimerSeconds);
    };

    void triggerOtp();
  }, [aifArnFlow, hasAmfiEmail, hasAmfiMobile, otpTimerSeconds]);

  useEffect(() => {
    if (timer <= 0 || status === "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setTimer((current) => {
        const next = Math.max(0, current - 1);
        if (aifArnFlow) {
          setOtpTimerSeconds(next);
        }
        return next;
      });
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [aifArnFlow, setOtpTimerSeconds, status, timer]);

  const resendLabel = useMemo(() => {
    if (timer === 0) {
      return "Resend OTP";
    }

    return `Resend OTP in ${timer} Sec`;
  }, [timer]);

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

    if (aifArnFlow) {
      setIsSubmitting(true);

      try {
        let emailNowVerified = emailVerified;
        let mobileNowVerified = mobileVerified;

        if (hasAmfiEmail && !emailNowVerified) {
          const emailResponse = await onboardingApi.verifyAmfiOtp({ channel: "email", otp: otpValue });
          if (emailResponse.verified) {
            emailNowVerified = true;
            setEmailVerified(true);
            setEmailVerifiedFromEntry(true);
            setEmailVerifiedAt(new Date().toISOString());
          }
        }

        if (hasAmfiMobile && !mobileNowVerified) {
          const mobileResponse = await onboardingApi.verifyAmfiOtp({ channel: "mobile", otp: otpValue });
          if (mobileResponse.verified) {
            mobileNowVerified = true;
            setMobileVerified(true);
            setMobileVerifiedFromEntry(true);
            setMobileVerifiedAt(new Date().toISOString());
          }
        }

        if (!emailNowVerified && !mobileNowVerified) {
          const nextAttempts = otpAttempts + 1;
          setOtpAttempts(nextAttempts);
          setErrorMessage("Invalid OTP. Please try again.");

          if (nextAttempts > maxAttempts) {
            setAccountRestricted(true);
            setErrorMessage("Account restricted. Please contact support.");
          }
          return;
        }

        setErrorMessage(null);
        setStatus("success");
      } catch {
        setErrorMessage("Unable to verify OTP. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!leadId || !panNumber.trim() || !hasEntryEmail || !hasEntryMobile) {
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
        setErrorMessage(response.message || "Invalid OTP. Please try again.");
        if (nextAttempts > maxAttempts) {
          setAccountRestricted(true);
          setErrorMessage("Account restricted. Please contact support.");
        }
        return;
      }

      const verifiedAt = new Date().toISOString();
      const verifiedChannel = normalizeVerifiedSource(response.verifiedSource);

      if (verifiedChannel === "mobile") {
        setMobileVerified(true);
        setMobileVerifiedFromEntry(true);
        setMobileVerifiedAt(verifiedAt);
      } else if (verifiedChannel === "email") {
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

    if (aifArnFlow) {
      if (hasAmfiEmail && !emailVerified) {
        await onboardingApi.sendAmfiOtp({ channel: "email" });
      }

      if (hasAmfiMobile && !mobileVerified) {
        await onboardingApi.sendAmfiOtp({ channel: "mobile" });
      }

      setOtpValue("");
      setErrorMessage(null);
      setTimer(otpTimerSeconds || 30);
      return;
    }

    if (!leadId || !panNumber.trim() || !hasEntryEmail || !hasEntryMobile) {
      setErrorMessage("Unable to resend OTP. Please restart onboarding.");
      return;
    }

    try {
      const otpResponse = await onboardingApi.sendOtp({
        email: inputEmail!.trim(),
        leadId,
        mobile: inputMobile!.trim(),
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

  const visibleMobile = aifArnFlow
    ? amfiMaskedMobile
    : inputMobile
      ? maskMobile(inputMobile)
      : null;
  const visibleEmail = aifArnFlow
    ? amfiMaskedEmail
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
        <header className="space-y-2">
          <h2 className="text-[22px] font-medium text-[var(--color-onboarding-heading)] lg:text-[32px]">Verify OTP</h2>

          <p className="text-[15px] text-[var(--color-onboarding-heading)]">
            OTP has been sent to your AMFI registered contact details
          </p>

          <div className="flex min-w-0 flex-col gap-2 text-sm text-[var(--color-onboarding-primary)] sm:flex-row sm:flex-wrap sm:gap-4">
            {visibleMobile ? (
              <span className="inline-flex min-w-0 items-center gap-1 break-all">
                <Smartphone className="size-3.5 shrink-0" /> +91 {visibleMobile}
              </span>
            ) : null}
            {visibleEmail ? (
              <span className="inline-flex min-w-0 items-center gap-1 break-all">
                <Mail className="size-3.5 shrink-0" /> {visibleEmail}
              </span>
            ) : null}
          </div>

          <p className="text-[15px] text-[var(--color-onboarding-heading)]">
            Please enter the 6-digit code below to proceed.
          </p>
        </header>

        <OtpInput
          onChange={(next) => {
            setOtpValue(next);
            if (errorMessage) {
              setErrorMessage(null);
            }
          }}
          value={otpValue}
        />

        <p className="text-center text-sm text-[var(--color-onboarding-muted)]">
          <button
            className="disabled:cursor-not-allowed disabled:opacity-70"
            disabled={timer > 0 || accountRestricted}
            onClick={() => {
              void handleResend();
            }}
            type="button"
          >
            {resendLabel}
          </button>
        </p>

        {errorMessage ? (
          <p className="text-center text-xs text-[var(--color-onboarding-danger)]">{errorMessage}</p>
        ) : null}

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
