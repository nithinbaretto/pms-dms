import type { ReactElement } from "react";
import { useRef } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { cn } from "../../../shared/ui/utils";
import type { EmpanelmentType } from "../types/onboarding-types";
import SupportFooter from "./SupportFooter";

const APRN_PREFIX = "APRN";
const APRN_DIGITS_ONLY = /\D/g;

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
  const aprnInputRef = useRef<HTMLInputElement>(null);
  const hasError = Boolean(errorMessage);

  return (
    <section className="w-full rounded-2xl bg-[var(--color-onboarding-surface)] p-6 shadow-[-8px_-8px_40px_0px_rgba(0,0,0,0.08)] lg:p-8">
      <div className="space-y-5">
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-2 lg:gap-4">
            <h2 className="shrink-0 whitespace-nowrap font-['Mulish',sans-serif] text-[22px] font-medium leading-none tracking-normal text-[var(--color-onboarding-heading)]">
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

          <p className="font-['Mulish',sans-serif] text-[15px] font-semibold leading-[22.5px] tracking-normal text-[var(--color-onboarding-heading)]">
            Verify your identity with your APRN to proceed securely.
          </p>
        </header>

        <div className="space-y-3">
          <div className="flex flex-col items-start gap-2">
            <p className="text-xs text-[var(--color-onboarding-heading-strong)]">
              Select empanelment type
            </p>

            <div className="inline-flex w-fit rounded-full bg-[#f8f8f8] p-1">
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

            <div
              className={cn(
                "flex h-9 w-full min-w-0 cursor-text items-center rounded-[8px] border border-[#eeeeee] bg-white px-[14px] shadow-none transition-[color,box-shadow]",
                "focus-within:border-[var(--color-onboarding-primary)] focus-within:ring-2 focus-within:ring-[rgba(147,22,30,0.2)]",
                hasError &&
                "border-[#E8402F] focus-within:border-[#E8402F] focus-within:ring-0",
              )}
              onClick={() => {
                aprnInputRef.current?.focus();
              }}
            >
              <span
                aria-hidden="true"
                className="shrink-0 font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#7F8E9D]"
              >
                {APRN_PREFIX}
              </span>
              <Input
                aria-invalid={hasError}
                autoComplete="off"
                className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 pl-1 shadow-none aria-invalid:border-transparent aria-invalid:ring-0 focus-visible:border-transparent focus-visible:ring-0"
                id="aprn-number"
                inputMode="numeric"
                onChange={(event) => {
                  onChange(event.target.value.replace(APRN_DIGITS_ONLY, ""));
                }}
                pattern="[0-9]*"
                placeholder="102030"
                ref={aprnInputRef}
                spellCheck={false}
                value={value}
              />
            </div>

            {errorMessage ? (
              <p className="text-xs text-[var(--color-onboarding-danger)]">{errorMessage}</p>
            ) : null}
          </div>
        </div>

        {showRiaVariant ? (
          <p className="text-left font-['Mulish',sans-serif] text-[14px] font-normal leading-[18px] tracking-normal text-[#93161E] underline decoration-solid underline-offset-0">
            Looking to register as an RIA?
          </p>
        ) : (
          <p className="text-left font-['Mulish',sans-serif] text-[14px] font-normal leading-[18px] tracking-normal text-[#93161E] underline decoration-solid underline-offset-0">
            Looking to register as an RIA?
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
