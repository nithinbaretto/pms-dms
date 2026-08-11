import type { ReactElement } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { cn } from "../../../shared/ui/utils";
import type { EmpanelmentType } from "../types/onboarding-types";
import SupportFooter from "./SupportFooter";

type AprnFormCardProps = {
  panNumber: string;
  productLabel: string;
  value: string;
  errorMessage: string | null;
  showRiaVariant: boolean;
  empanelmentType: EmpanelmentType;
  isSubmitting?: boolean;
  onEmpanelmentTypeChange: (value: EmpanelmentType) => void;
  onChange: (nextValue: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

const AprnFormCard = ({
  panNumber,
  productLabel,
  value,
  errorMessage,
  showRiaVariant,
  empanelmentType,
  isSubmitting = false,
  onEmpanelmentTypeChange,
  onChange,
  onBack,
  onContinue,
}: AprnFormCardProps): ReactElement => {
  return (
    <section className="w-full rounded-2xl bg-[var(--color-onboarding-surface)] p-6 shadow-[-8px_-8px_40px_0px_rgba(0,0,0,0.08)] lg:p-8">
      <div className="space-y-5">
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-2 lg:gap-4">
            <h2 className="shrink-0 whitespace-nowrap text-[22px] font-medium leading-[33px] text-[var(--color-onboarding-heading)] lg:text-[32px] lg:leading-[1.2]">
              Verify APRN
            </h2>
            <div className="flex min-w-0 shrink items-center justify-end gap-2">
              <span className="truncate rounded-full bg-[var(--color-onboarding-pill-background)] px-2 py-1 text-xs font-medium text-[var(--color-onboarding-primary)]">
                <span className="lg:hidden">{panNumber}</span>
                <span className="hidden lg:inline">PAN : {panNumber}</span>
              </span>
              <span className="shrink-0 rounded-full bg-[var(--color-onboarding-pill-background)] px-2 py-1 text-xs font-medium text-[var(--color-onboarding-primary)]">
                {productLabel}
              </span>
            </div>
          </div>

          <p className="text-[15px] text-[var(--color-onboarding-heading)]">
            Verify your identity with your APRN to proceed securely.
          </p>
        </header>

        <div className="space-y-3">
          <p className="text-xs text-[var(--color-onboarding-heading-strong)]">
            Select empanelment type
          </p>

          <div className="inline-flex rounded-full bg-[#f8f8f8] p-1">
            <button
              className={cn(
                "h-7 rounded-full px-4 text-xs transition-colors",
                empanelmentType === "Distributor"
                  ? "bg-white text-[var(--color-onboarding-primary)] shadow-sm"
                  : "text-[var(--color-onboarding-heading)]",
              )}
              onClick={() => {
                onEmpanelmentTypeChange("Distributor");
              }}
              type="button"
            >
              Distributor
            </button>
            <button
              className={cn(
                "h-7 rounded-full px-4 text-xs transition-colors",
                empanelmentType === "RIA"
                  ? "bg-white text-[var(--color-onboarding-primary)] shadow-sm"
                  : "text-[var(--color-onboarding-heading)]",
              )}
              onClick={() => {
                onEmpanelmentTypeChange("RIA");
              }}
              type="button"
            >
              RIA
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-[var(--color-onboarding-heading-strong)]" htmlFor="aprn-number">
            APRN Number <span className="text-[var(--color-onboarding-danger)]">*</span>
          </label>

          <Input
            className="h-9 rounded-lg border-[#eeeeee] px-3 text-[13px]"
            id="aprn-number"
            onChange={(event) => {
              const sanitizedValue = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
              onChange(sanitizedValue);
            }}
            placeholder="APRN 102030"
            value={value}
          />

          {errorMessage ? (
            <p className="text-xs text-[var(--color-onboarding-danger)]">{errorMessage}</p>
          ) : null}
        </div>

        {showRiaVariant ? (
          <p className="text-sm text-[var(--color-onboarding-primary)] underline">
            Looking to register as an RIA?
          </p>
        ) : (
          <p className="text-sm text-[var(--color-onboarding-primary)] underline">
            Looking to register as an RIA? Click here
          </p>
        )}

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
            onClick={onContinue}
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

export default AprnFormCard;
