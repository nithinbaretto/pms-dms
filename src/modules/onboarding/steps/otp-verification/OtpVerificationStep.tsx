import type { ReactElement } from "react";
import { Check, Mail, Smartphone } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "../../../../shared/ui/button";
import { useOnboardingStore } from "../../state/onboarding-store";
import OtpInput from "../../components/OtpInput";
import SupportFooter from "../../components/SupportFooter";
import { onboardingApi } from "../../services/onboarding-api";

type OtpStatus = "pending" | "success";

type OtpVerificationStepProps = {
  onBack: () => void;
  onContinue: () => void;
  initialTimerSeconds?: number;
  maxAttempts?: number;
};

const OtpVerificationStep = ({
  onBack,
  onContinue,
  initialTimerSeconds = 23,
  maxAttempts = 3,
}: OtpVerificationStepProps): ReactElement => {
  const {
    onboardingMethod,
    amfiMaskedEmail,
    amfiMaskedMobile,
    emailVerified,
    mobileVerified,
    otpAttempts,
    otpTimerSeconds,
    accountRestricted,
    setEmailVerified,
    setMobileVerified,
    setEmailVerifiedAt,
    setMobileVerifiedAt,
    setOtpAttempts,
    setOtpTimerSeconds,
    setAccountRestricted,
  } = useOnboardingStore();

  const aifArnFlow = onboardingMethod === "ARN";
  const hasEmail = Boolean(amfiMaskedEmail);
  const hasMobile = Boolean(amfiMaskedMobile);

  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(aifArnFlow ? otpTimerSeconds : initialTimerSeconds);
  const [status, setStatus] = useState<OtpStatus>("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [legacyMaskedContact, setLegacyMaskedContact] = useState<{ mobile: string; email: string } | null>(null);
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

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    const triggerOtp = async (): Promise<void> => {
      if (aifArnFlow) {
        if (hasEmail) {
          await onboardingApi.sendAmfiOtp({ channel: "email" });
        }

        if (hasMobile) {
          await onboardingApi.sendAmfiOtp({ channel: "mobile" });
        }

        setTimer(otpTimerSeconds);
        return;
      }

      const response = await onboardingApi.sendOtp({ panNumber: "ABCDR1234A", channel: "mobile" });
      setLegacyMaskedContact({ mobile: response.maskedMobile, email: response.maskedEmail });
      setTimer(response.expiresInSeconds);
    };

    void triggerOtp();
  }, [aifArnFlow, hasEmail, hasMobile, otpTimerSeconds]);

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
    if (otpValue.length !== 6) {
      setErrorMessage("Please enter the 6-digit OTP");
      return;
    }

    if (accountRestricted) {
      setErrorMessage("Account restricted. Please contact support.");
      return;
    }

    if (aifArnFlow) {
      let emailNowVerified = emailVerified;
      let mobileNowVerified = mobileVerified;

      if (hasEmail && !emailNowVerified) {
        const emailResponse = await onboardingApi.verifyAmfiOtp({ channel: "email", otp: otpValue });
        if (emailResponse.verified) {
          emailNowVerified = true;
          setEmailVerified(true);
          setEmailVerifiedAt(new Date().toISOString());
        }
      }

      if (hasMobile && !mobileNowVerified) {
        const mobileResponse = await onboardingApi.verifyAmfiOtp({ channel: "mobile", otp: otpValue });
        if (mobileResponse.verified) {
          mobileNowVerified = true;
          setMobileVerified(true);
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
      return;
    }

    const response = await onboardingApi.verifyOtp({ otp: otpValue });

    if (!response.verified) {
      const nextAttempts = otpAttempts + 1;
      setOtpAttempts(nextAttempts);
      setErrorMessage("Invalid OTP. Please try again.");
      if (nextAttempts > maxAttempts) {
        setAccountRestricted(true);
      }
      return;
    }

    setErrorMessage(null);
    setStatus("success");
  };

  const handleResend = async (): Promise<void> => {
    if (timer > 0 || accountRestricted) {
      return;
    }

    if (aifArnFlow) {
      if (hasEmail && !emailVerified) {
        await onboardingApi.sendAmfiOtp({ channel: "email" });
      }

      if (hasMobile && !mobileVerified) {
        await onboardingApi.sendAmfiOtp({ channel: "mobile" });
      }

      setOtpValue("");
      setErrorMessage(null);
      setTimer(otpTimerSeconds || 30);
      return;
    }

    const response = await onboardingApi.sendOtp({ panNumber: "ABCDR1234A", channel: "mobile" });
    setLegacyMaskedContact({ mobile: response.maskedMobile, email: response.maskedEmail });
    setOtpValue("");
    setErrorMessage(null);
    setTimer(response.expiresInSeconds);
  };

  const visibleMobile = aifArnFlow ? amfiMaskedMobile : legacyMaskedContact?.mobile ?? "+91 9xxxxxxx23";
  const visibleEmail = aifArnFlow ? amfiMaskedEmail : legacyMaskedContact?.email ?? "rixxxxx@xxxxx.com";

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
    <section className="w-full rounded-2xl bg-[var(--color-onboarding-surface)] p-8 shadow-[-8px_-8px_40px_0px_rgba(0,0,0,0.08)]">
      <div className="space-y-5">
        <header className="space-y-2">
          <h2 className="text-[32px] font-medium text-[var(--color-onboarding-heading)]">Verify OTP</h2>

          <p className="text-[15px] text-[var(--color-onboarding-heading)]">
            OTP has been sent to your AMFI registered contact details
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-[var(--color-onboarding-primary)]">
            {visibleMobile ? (
              <span className="inline-flex items-center gap-1">
                <Smartphone className="size-3.5" /> +91 {visibleMobile}
              </span>
            ) : null}
            {visibleEmail ? (
              <span className="inline-flex items-center gap-1">
                <Mail className="size-3.5" /> {visibleEmail}
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

        <div className="mt-4 grid grid-cols-2 gap-5">
          <Button
            className="h-9 rounded-[8.75px] border border-[#eeeeee] bg-white text-sm text-[var(--color-onboarding-heading)] hover:bg-[#f8f8f8]"
            onClick={onBack}
            type="button"
            variant="outline"
          >
            Back
          </Button>

          <Button
            className="h-9 rounded-[8.75px] bg-[var(--color-onboarding-primary)] text-sm text-white hover:bg-[#7f141a]"
            disabled={accountRestricted}
            onClick={() => {
              void handleContinue();
            }}
            type="button"
          >
            Continue
          </Button>
        </div>

        <SupportFooter />
      </div>
    </section>
  );
};

export default OtpVerificationStep;
