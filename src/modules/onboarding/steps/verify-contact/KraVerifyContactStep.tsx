import type { ReactElement } from "react";
import { ArrowRight, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "../../../../shared/ui/button";
import { Input } from "../../../../shared/ui/input";
import { cn } from "../../../../shared/ui/utils";
import SupportFooter from "../../components/SupportFooter";
import { onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import { isEmailValid, isMobileValid } from "../personal-details/validation";

type KraVerifyContactStepProps = {
  panNumber: string;
  onBack: () => void;
  onContinue: () => void;
};

type ContactChannel = "mobile" | "email";

const toTenDigitMobile = (value: string): string => {
  return value.replace(/\D/g, "").slice(-10);
};

const KraVerifyContactStep = ({
  panNumber,
  onBack,
  onContinue,
}: KraVerifyContactStepProps): ReactElement => {
  const { leadId, setInputEmail, setInputMobile } = useOnboardingStore();
  const [channel, setChannel] = useState<ContactChannel>("mobile");
  const [mobileValue, setMobileValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }

    const normalizedEmail = emailValue.trim();
    const normalizedMobile = toTenDigitMobile(mobileValue);

    if (channel === "mobile" && !isMobileValid(normalizedMobile)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (channel === "email" && !isEmailValid(normalizedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!leadId || !panNumber.trim()) {
      setErrorMessage("Unable to send OTP. Please restart the onboarding flow.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const emailForRequest = channel === "email" ? normalizedEmail : "";
      const mobileForRequest = channel === "mobile" ? normalizedMobile : "";

      const validateResponse = await onboardingApi.validateInputWithKra({
        email: emailForRequest,
        leadId,
        mobile: mobileForRequest,
      });

      if (!validateResponse.isValidated) {
        setErrorMessage(
          validateResponse.errorMsg ||
            validateResponse.message ||
            "Details do not match KRA records. Please try again.",
        );
        return;
      }

      const otpResponse = await onboardingApi.sendOtp({
        email: emailForRequest,
        leadId,
        mobile: mobileForRequest,
        panNumber: panNumber.trim().toUpperCase(),
        type: "Partner Integration",
      });

      if (!otpResponse.success) {
        setErrorMessage(otpResponse.message || "Unable to send OTP. Please try again.");
        return;
      }

      setInputEmail(emailForRequest || null);
      setInputMobile(mobileForRequest || null);
      onContinue();
    } catch {
      setErrorMessage("Unable to validate contact details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full rounded-2xl bg-[var(--color-onboarding-surface)] p-6 shadow-[-8px_-8px_40px_0px_rgba(0,0,0,0.08)] lg:p-8">
      <div className="space-y-5">
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-['Mulish',sans-serif] text-[22px] font-medium leading-none tracking-normal text-[#435160]">
              Verify Contact
            </h2>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-onboarding-pill-background)] px-2 py-1 text-xs font-medium text-[var(--color-onboarding-primary)]">
                PAN : {panNumber}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-onboarding-pill-background)] px-2 py-1 text-xs font-medium text-[var(--color-onboarding-primary)]">
                AIF
              </span>
            </div>
          </div>

          <p className="font-['Mulish',sans-serif] text-[15px] font-semibold leading-[22.5px] tracking-normal text-[#435160]">
            Verify your identity with your ARN to proceed securely.
          </p>
        </header>

        <div className="flex flex-col items-start gap-3">
          <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]">
            Please enter AMFI registered Mobile or Email
          </p>

          <div className="inline-flex w-fit rounded-full bg-[#ececec] p-1">
            <button
              className={cn(
                "h-8 rounded-full px-5 font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal",
                channel === "mobile" ? "bg-white text-[#93161E] shadow-sm" : "text-[#5A6B7D]",
              )}
              disabled={isSubmitting}
              onClick={() => {
                setChannel("mobile");
                setErrorMessage(null);
              }}
              type="button"
            >
              Mobile
            </button>
            <button
              className={cn(
                "h-8 rounded-full px-5 font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal",
                channel === "email" ? "bg-white text-[#93161E] shadow-sm" : "text-[#5A6B7D]",
              )}
              disabled={isSubmitting}
              onClick={() => {
                setChannel("email");
                setErrorMessage(null);
              }}
              type="button"
            >
              Email
            </button>
          </div>
        </div>

        {channel === "mobile" ? (
          <div className="space-y-1">
            <label
              className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]"
              htmlFor="kra-verify-mobile"
            >
              Mobile Number <span className="text-[#E8402F]">*</span>
            </label>
            <div className="flex h-9 items-center overflow-hidden rounded-[8px] border border-[#eeeeee] bg-white">
              <div className="flex h-full items-center gap-1 bg-[#f5f5f5] px-2 font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#71859B]">
                <span>+91 (IND)</span>
                <ChevronDown className="size-3.5" />
              </div>
              <Input
                className="h-full flex-1 rounded-none border-0 bg-transparent px-3 shadow-none focus-visible:border-transparent focus-visible:ring-0"
                id="kra-verify-mobile"
                inputMode="numeric"
                maxLength={10}
                onChange={(event) => {
                  setMobileValue(event.target.value.replace(/\D/g, ""));
                  if (errorMessage) {
                    setErrorMessage(null);
                  }
                }}
                placeholder="9876543210"
                value={mobileValue}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <label
              className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]"
              htmlFor="kra-verify-email"
            >
              Email <span className="text-[#E8402F]">*</span>
            </label>
            <Input
              id="kra-verify-email"
              onChange={(event) => {
                setEmailValue(event.target.value);
                if (errorMessage) {
                  setErrorMessage(null);
                }
              }}
              placeholder="name@example.com"
              type="email"
              value={emailValue}
            />
          </div>
        )}

        {errorMessage ? (
          <p className="text-xs text-[var(--color-onboarding-danger)]">{errorMessage}</p>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-5">
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
            disabled={isSubmitting}
            onClick={() => {
              void handleContinue();
            }}
            type="button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Continue <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>

        <SupportFooter />
      </div>
    </section>
  );
};

export default KraVerifyContactStep;
