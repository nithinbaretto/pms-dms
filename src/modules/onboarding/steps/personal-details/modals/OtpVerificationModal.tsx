/* eslint-disable react-hooks/set-state-in-effect */
import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Mail, Smartphone } from "lucide-react";

import { Button } from "../../../../../shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../../shared/ui/dialog";
import OtpInput from "../../../components/OtpInput";
import {
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_TIMER_SECONDS,
} from "../constants";
import type { VerificationChannel } from "../types";

type OtpVerificationModalProps = {
  open: boolean;
  channel: VerificationChannel;
  value: string;
  onVerify: () => void;
  onCancel: () => void;
};

const maskMobile = (mobile: string): string => {
  if (mobile.length < 4) {
    return mobile;
  }

  return `+91 ${"x".repeat(6)}${mobile.slice(-4)}`;
};

const maskEmail = (email: string): string => {
  const [name = "", domain = ""] = email.split("@");

  if (!name || !domain) {
    return email;
  }

  return `${name.slice(0, 2)}${"x".repeat(Math.max(0, name.length - 2))}@${domain}`;
};

const OtpVerificationModal = ({
  open,
  channel,
  value,
  onVerify,
  onCancel,
}: OtpVerificationModalProps): ReactElement => {
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(OTP_RESEND_TIMER_SECONDS);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setOtpValue("");
      setTimer(OTP_RESEND_TIMER_SECONDS);
      setAttempts(0);
      setError(null);
      return;
    }

    if (timer === 0) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setTimer((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [open, timer]);

  const maskedValue = useMemo(() => {
    return channel === "mobile" ? maskMobile(value) : maskEmail(value);
  }, [channel, value]);

  const isLocked = attempts >= OTP_MAX_ATTEMPTS;
  const isMobileChannel = channel === "mobile";

  const handleVerify = (): void => {
    if (otpValue.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (otpValue !== "123456") {
      setAttempts((current) => current + 1);
      setError("Please enter a valid OTP.");
      return;
    }

    setError(null);
    onVerify();
  };

  return (
    <Dialog onOpenChange={onCancel} open={open}>
      <DialogContent className="max-w-[380px] gap-0 rounded-2xl border border-[#eeeeee] !bg-white opacity-100 p-6 sm:max-w-[380px] sm:p-6">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-[36px] leading-[33px] font-medium text-[var(--color-onboarding-heading)]">
            Verify OTP
          </DialogTitle>
          <DialogDescription className="text-[15px] leading-[22.5px] text-[var(--color-onboarding-heading)]">
            <p className="inline-flex flex-wrap items-center gap-1">
              <span>A verification code has been sent to</span>
              <span className="inline-flex items-center gap-1 text-[var(--color-onboarding-primary)]">
                {isMobileChannel ? <Smartphone className="size-3.5" /> : <Mail className="size-3.5" />} {maskedValue}
              </span>
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 space-y-4">
          <p className="text-[15px] leading-[22.5px] text-[var(--color-onboarding-heading)]">
            Please enter the 6-digit code below to verify.
          </p>

          <OtpInput
            containerClassName="justify-start gap-3"
            inputClassName="h-10 w-10 rounded-[8px] border-[#e5e5e6] text-lg font-normal"
            onChange={(next) => {
              setOtpValue(next);

              if (error) {
                setError(null);
              }
            }}
            value={otpValue}
          />

          {error ? (
            <p className="text-center text-xs text-[var(--color-onboarding-danger)]">{error}</p>
          ) : null}

          {isLocked ? (
            <p className="text-center text-xs text-[var(--color-onboarding-danger)]">
              Too many invalid attempts. Please resend OTP.
            </p>
          ) : null}

          <p className="text-center text-[13px] text-[#5a6b7d]">
            {timer > 0 ? (
              <>
                Resend OTP in <span className="text-[var(--color-onboarding-primary)]">{timer} Sec</span>
              </>
            ) : (
              <button
                className="text-[var(--color-onboarding-primary)]"
                onClick={() => {
                  setOtpValue("");
                  setError(null);
                  setAttempts(0);
                  setTimer(OTP_RESEND_TIMER_SECONDS);
                }}
                type="button"
              >
                Didn&apos;t get it? Resend OTP
              </button>
            )}
          </p>

          <Button
            className="h-10 w-full rounded-[8px] bg-[var(--color-onboarding-primary)] text-sm text-white hover:bg-[#7f141a] disabled:bg-[#e5e5e6] disabled:text-[#5a6b7d]"
            disabled={isLocked}
            onClick={handleVerify}
            type="button"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationModal;
