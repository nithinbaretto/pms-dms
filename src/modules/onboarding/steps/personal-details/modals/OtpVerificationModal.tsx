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
      setLocalError("Please enter a valid OTP.");
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
      <DialogContent className="max-w-[505px] gap-0 rounded-2xl border border-[#eeeeee] !bg-white opacity-100 p-12 sm:max-w-[505px] sm:p-8">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-[22px] leading-none font-medium text-[var(--color-onboarding-heading)]">
            Verify OTP
          </DialogTitle>
          <DialogDescription asChild>
            <div className="text-[15px] leading-[22.5px] text-[var(--color-onboarding-heading)]">
              <p className="inline-flex min-w-0 flex-wrap items-center gap-1">
                <span>A verification code has been sent to</span>
                <span className="inline-flex min-w-0 items-center gap-1 break-all font-['Mulish',sans-serif] text-[14px] font-medium leading-[18px] tracking-normal text-[#93161E]">
                  {isMobileChannel ? (
                    <Smartphone className="size-3.5 shrink-0" />
                  ) : (
                    <Mail className="size-3.5 shrink-0" />
                  )}{" "}
                  {maskedValue}
                </span>
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 flex flex-col gap-6">
          <p className="text-[15px] leading-[22.5px] text-[var(--color-onboarding-heading)]">
            Please enter the 6-digit code below to verify.
          </p>

          <div className="flex flex-col items-center gap-10">
            <div className="flex w-full flex-col items-center gap-3">
              <OtpInput
                containerClassName="justify-center gap-3"
                hasError={Boolean(displayError)}
                inputClassName="h-10 w-10 rounded-[8px] text-lg font-normal"
                onChange={(next) => {
                  setOtpValue(next);

                  if (localError) {
                    setLocalError(null);
                  }
                }}
                value={otpValue}
              />

              {displayError ? (
                <p className="text-center font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#E8402F]">
                  {displayError}
                </p>
              ) : null}
            </div>

            <p className="text-center font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#5a6b7d]">
              {timer > 0 ? (
                <>
                  Resend OTP in{" "}
                  <span className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#93161E]">
                    {timer} Sec
                  </span>
                </>
              ) : (
                <button
                  className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#5a6b7d] disabled:opacity-70"
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
                  {isSendingOtp ? (
                    "Sending..."
                  ) : (
                    <>
                      Didn&apos;t get it?{" "}
                      <span className="text-[#93161E]">Resend OTP</span>
                    </>
                  )}
                </button>
              )}
            </p>
          </div>

          <Button
            className="h-10 w-full rounded-[8px] bg-[var(--color-onboarding-primary)] font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-white hover:bg-[#7f141a] disabled:bg-[#e5e5e6] disabled:text-[#5A6B7D]"
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
                Continue <ArrowRight className="size-4 text-current" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationModal;
