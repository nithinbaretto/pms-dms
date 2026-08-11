/* eslint-disable react-hooks/set-state-in-effect */
import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2, Mail, Smartphone } from "lucide-react";

import { Button } from "../../../../../shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../../shared/ui/dialog";
import OtpInput from "../../../components/OtpInput";
import { OTP_LENGTH, OTP_RESEND_TIMER_SECONDS } from "../constants";
import { maskEmail, maskMobile } from "../helpers";
import type { VerificationChannel } from "../types";

type OtpVerificationModalProps = {
  open: boolean;
  channel: VerificationChannel;
  value: string;
  errorMessage?: string | null;
  isSendingOtp?: boolean;
  isVerifyingOtp?: boolean;
  onVerify: (otp: string) => Promise<boolean>;
  onResend: () => Promise<void>;
  onCancel: () => void;
};

const OtpVerificationModal = ({
  open,
  channel,
  value,
  errorMessage = null,
  isSendingOtp = false,
  isVerifyingOtp = false,
  onVerify,
  onResend,
  onCancel,
}: OtpVerificationModalProps): ReactElement => {
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(OTP_RESEND_TIMER_SECONDS);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setOtpValue("");
      setTimer(OTP_RESEND_TIMER_SECONDS);
      setLocalError(null);
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

  useEffect(() => {
    if (errorMessage) {
      setLocalError(errorMessage);
    }
  }, [errorMessage]);

  const maskedValue = useMemo(() => {
    return channel === "mobile" ? maskMobile(value) : maskEmail(value);
  }, [channel, value]);

  const isMobileChannel = channel === "mobile";
  const displayError = localError || errorMessage;

  const handleVerify = async (): Promise<void> => {
    if (otpValue.length !== OTP_LENGTH) {
      setLocalError("Please enter the 6-digit OTP.");
      return;
    }

    setLocalError(null);
    const success = await onVerify(otpValue);
    if (!success) {
      setOtpValue("");
    }
  };

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onCancel();
        }
      }}
      open={open}
    >
      <DialogContent className="max-w-[505px] gap-0 rounded-2xl border border-[#eeeeee] !bg-white opacity-100 p-6 sm:max-w-[505px] sm:p-6">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-[22px] leading-none font-medium text-[var(--color-onboarding-heading)]">
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

        <div className="mt-5 flex flex-col">
          <p className="text-[15px] leading-[22.5px] text-[var(--color-onboarding-heading)]">
            Please enter the 6-digit code below to verify.
          </p>

          <div className="mt-6">
            <OtpInput
              containerClassName="justify-center gap-3"
              inputClassName="h-10 w-10 rounded-[8px] border-[#e5e5e6] text-lg font-normal"
              onChange={(next) => {
                setOtpValue(next);

                if (localError) {
                  setLocalError(null);
                }
              }}
              value={otpValue}
            />
          </div>

          {displayError ? (
            <p className="mt-6 pt-1 text-center text-xs text-[var(--color-onboarding-danger)]">{displayError}</p>
          ) : null}

          <p className="mt-4 text-center text-[13px] text-[#5a6b7d]">
            {timer > 0 ? (
              <>
                Resend OTP in <span className="text-[var(--color-onboarding-primary)]">{timer} Sec</span>
              </>
            ) : (
              <button
                className="text-[var(--color-onboarding-primary)] disabled:text-[#5a6b7d]"
                disabled={isSendingOtp}
                onClick={() => {
                  void (async () => {
                    setOtpValue("");
                    setLocalError(null);
                    await onResend();
                    setTimer(OTP_RESEND_TIMER_SECONDS);
                  })();
                }}
                type="button"
              >
                {isSendingOtp ? "Sending..." : "Didn't get it? Resend OTP"}
              </button>
            )}
          </p>

          <Button
            className="mt-4 h-10 w-full rounded-[8px] bg-[var(--color-onboarding-primary)] text-sm text-white hover:bg-[#7f141a] disabled:bg-[#e5e5e6] disabled:text-[#5a6b7d]"
            disabled={isVerifyingOtp || otpValue.length !== OTP_LENGTH}
            onClick={() => {
              void handleVerify();
            }}
            type="button"
          >
            {isVerifyingOtp ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Continue <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationModal;
