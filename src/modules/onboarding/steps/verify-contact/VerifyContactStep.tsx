import type { ReactElement } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "../../../../shared/ui/button";
import { Input } from "../../../../shared/ui/input";
import SupportFooter from "../../components/SupportFooter";

type VerifyContactStepProps = {
  panNumber: string;
  arn: string | null;
  email: string | null;
  mobile: string | null;
  errorMessage?: string | null;
  showFailureActions?: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onRetry?: () => void;
  onManualJourney?: () => void;
  onContinue: (payload: { arn: string | null; email: string | null; mobile: string | null }) => void;
};

type FormErrors = {
  arn?: string;
  email?: string;
  mobile?: string;
  contact?: string;
};

const ARN_FORMAT = /^(?:ARN-?)?\d{4,10}$/i;
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_FORMAT = /^[6-9]\d{9}$/;

const VerifyContactStep = ({
  panNumber,
  arn,
  email,
  mobile,
  errorMessage,
  showFailureActions = false,
  isSubmitting = false,
  onBack,
  onRetry,
  onManualJourney,
  onContinue,
}: VerifyContactStepProps): ReactElement => {
  const [arnValue, setArnValue] = useState(arn ?? "");
  const [emailValue, setEmailValue] = useState(email ?? "");
  const [mobileValue, setMobileValue] = useState(mobile ?? "");
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    const normalizedArn = arnValue.trim();
    const normalizedEmail = emailValue.trim();
    const normalizedMobile = mobileValue.trim();

    if (!normalizedEmail && !normalizedMobile) {
      errors.contact = "Please enter Email or Mobile";
    }

    if (normalizedArn && !ARN_FORMAT.test(normalizedArn)) {
      errors.arn = "Please enter a valid ARN";
    }

    if (normalizedEmail && !EMAIL_FORMAT.test(normalizedEmail)) {
      errors.email = "Please enter a valid email address";
    }

    if (normalizedMobile && !MOBILE_FORMAT.test(normalizedMobile)) {
      errors.mobile = "Please enter a valid 10-digit mobile number";
    }

    return errors;
  };

  const handleContinue = (): void => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    onContinue({
      arn: arnValue.trim() ? arnValue.trim().toUpperCase() : null,
      email: emailValue.trim() ? emailValue.trim() : null,
      mobile: mobileValue.trim() ? mobileValue.trim() : null,
    });
  };

  return (
    <section className="w-full rounded-2xl bg-[var(--color-onboarding-surface)] p-6 shadow-[-8px_-8px_40px_0px_rgba(0,0,0,0.08)] lg:p-8">
      <div className="space-y-5">
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[22px] font-medium leading-[33px] text-[var(--color-onboarding-heading)] lg:text-[32px] lg:leading-[1.2]">
              Verify ARN
            </h2>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[var(--color-onboarding-pill-background)] px-2 py-1 text-xs font-medium text-[var(--color-onboarding-primary)]">
                PAN : {panNumber}
              </span>
              <span className="rounded-full bg-[var(--color-onboarding-pill-background)] px-2 py-1 text-xs font-medium text-[var(--color-onboarding-primary)]">
                AF
              </span>
            </div>
          </div>

          <p className="text-[15px] text-[var(--color-onboarding-heading)]">
            Verify your identity with your ARN to proceed securely.
          </p>
        </header>

        <div className="space-y-1">
          <label className="text-xs text-[var(--color-onboarding-heading-strong)]" htmlFor="verify-arn-number">
            ARN Number*
          </label>

          <Input
            id="verify-arn-number"
            onChange={(event) => {
              setArnValue(event.target.value);
              if (validationErrors.arn) {
                setValidationErrors((current) => ({ ...current, arn: undefined }));
              }
            }}
            placeholder="ARN 102030"
            value={arnValue}
          />
          {validationErrors.arn ? (
            <p className="text-xs text-[var(--color-onboarding-danger)]">{validationErrors.arn}</p>
          ) : null}
        </div>

        <p className="text-xs text-[var(--color-onboarding-heading-strong)]">
          Please enter AMFI registered Mobile or Email
        </p>

        <div className="inline-flex rounded-full bg-[#f8f8f8] p-1 text-xs">
          <span className="rounded-full bg-[#fceee7] px-4 py-1 text-[var(--color-onboarding-primary)]">Mobile</span>
          <span className="px-4 py-1 text-[var(--color-onboarding-heading)]">Email</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-[var(--color-onboarding-heading-strong)]" htmlFor="verify-mobile-number">
            Mobile Number*
          </label>
          <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-2">
            <Input className="px-2 text-xs" disabled value="+91 [IND]" />
            <Input
              id="verify-mobile-number"
              inputMode="numeric"
              maxLength={10}
              onChange={(event) => {
                const sanitized = event.target.value.replace(/\D/g, "");
                setMobileValue(sanitized);
                if (validationErrors.mobile || validationErrors.contact) {
                  setValidationErrors((current) => ({ ...current, mobile: undefined, contact: undefined }));
                }
              }}
              placeholder="9876543210"
              value={mobileValue}
            />
          </div>
          {validationErrors.mobile ? (
            <p className="text-xs text-[var(--color-onboarding-danger)]">{validationErrors.mobile}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label className="text-xs text-[var(--color-onboarding-heading-strong)]" htmlFor="verify-email-address">
            Email Address
          </label>
          <Input
            id="verify-email-address"
            onChange={(event) => {
              setEmailValue(event.target.value);
              if (validationErrors.email || validationErrors.contact) {
                setValidationErrors((current) => ({ ...current, email: undefined, contact: undefined }));
              }
            }}
            placeholder="name@example.com"
            value={emailValue}
          />
          {validationErrors.email ? (
            <p className="text-xs text-[var(--color-onboarding-danger)]">{validationErrors.email}</p>
          ) : null}
        </div>

        {validationErrors.contact ? (
          <p className="text-xs text-[var(--color-onboarding-danger)]">{validationErrors.contact}</p>
        ) : null}

        {errorMessage ? (
          <div className="space-y-3 rounded-lg border border-[var(--color-onboarding-danger)] bg-[#fff5f4] p-3 text-xs text-[var(--color-onboarding-danger)]">
            <p>{errorMessage}</p>
            {showFailureActions ? (
              <div className="flex gap-3">
                <button
                  className="rounded-md border border-[#eeeeee] bg-white px-3 py-1.5 text-xs text-[var(--color-onboarding-heading)]"
                  onClick={onRetry}
                  type="button"
                >
                  Retry
                </button>
                <button
                  className="rounded-md border border-[#eeeeee] bg-white px-3 py-1.5 text-xs text-[var(--color-onboarding-heading)]"
                  onClick={onManualJourney}
                  type="button"
                >
                  Manual Journey
                </button>
              </div>
            ) : null}
          </div>
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
            onClick={handleContinue}
            type="button"
          >
            {isSubmitting ? (
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

        <SupportFooter />
      </div>
    </section>
  );
};

export default VerifyContactStep;
