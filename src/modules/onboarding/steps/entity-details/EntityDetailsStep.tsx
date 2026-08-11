import type { ReactElement } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "../../../../shared/ui/button";
import { Input } from "../../../../shared/ui/input";
import SupportFooter from "../../components/SupportFooter";

type EntityDetailsStepProps = {
  initialPan: string;
  externalError?: string | null;
  isSubmitting?: boolean;
  onPanChange?: (pan: string) => void;
  onContinue: (pan: string) => void;
};

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const EntityDetailsStep = ({
  initialPan,
  externalError,
  isSubmitting = false,
  onPanChange,
  onContinue,
}: EntityDetailsStepProps): ReactElement => {
  const [pan, setPan] = useState<string>(initialPan.trim().toUpperCase());
  const [showValidationError, setShowValidationError] = useState(false);

  const normalizedPan = useMemo(() => pan.trim().toUpperCase(), [pan]);
  const isPanValid = PAN_REGEX.test(normalizedPan);
  const shouldShowError =
    (showValidationError && normalizedPan.length > 0 && !isPanValid) || Boolean(externalError);
  const resolvedError = externalError ?? "Invalid PAN number";

  const handleContinue = (): void => {
    if (!normalizedPan) {
      return;
    }

    if (!isPanValid) {
      setShowValidationError(true);
      return;
    }

    onContinue(normalizedPan);
  };

  return (
    <section className="w-full rounded-2xl bg-[var(--color-onboarding-surface)] p-6 shadow-[-8px_-8px_40px_0px_rgba(0,0,0,0.08)] lg:p-8">
      <div className="space-y-5">
        <header className="space-y-2">
          <h2 className="text-[22px] font-medium leading-[33px] text-[var(--color-onboarding-heading)] lg:text-[32px] lg:leading-[1.2]">
            Welcome back
          </h2>

          <p className="text-[15px] text-[var(--color-onboarding-heading)]">
            Enter your PAN to securely access your distributor dashboard.
          </p>
        </header>

        <div className="space-y-1">
          <label className="text-xs text-[var(--color-onboarding-heading-strong)]" htmlFor="pan-number">
            PAN Number <span className="text-[var(--color-onboarding-danger)]">*</span>
          </label>

          <Input
            className="h-9 rounded-lg border-[#eeeeee] px-3 text-[13px]"
            disabled={isSubmitting}
            id="pan-number"
            maxLength={10}
            onChange={(event) => {
              setShowValidationError(false);
              const sanitizedValue = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
              setPan(sanitizedValue);
              onPanChange?.(sanitizedValue);
            }}
            placeholder="ABCDR1234A"
            value={pan}
          />

          {shouldShowError ? (
            <p className="text-xs text-[var(--color-onboarding-danger)]">{resolvedError}</p>
          ) : null}
        </div>

        <Button
          className="h-9 w-full rounded-lg bg-[var(--color-onboarding-primary)] text-sm text-white hover:bg-[#7f141a]"
          disabled={!normalizedPan || isSubmitting}
          onClick={handleContinue}
          type="button"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              Continue <ArrowRight className="size-4" />
            </>
          )}
        </Button>

        <SupportFooter showSecureMessage />
      </div>
    </section>
  );
};

export default EntityDetailsStep;