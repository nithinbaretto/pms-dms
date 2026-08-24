import type { ReactElement } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import arnIcon from "../../../../assets/icons/svg/ARN.svg";
import digilockerIcon from "../../../../assets/icons/svg/digilocker.svg";
import kraIcon from "../../../../assets/icons/svg/kra.svg";
import manualIcon from "../../../../assets/icons/svg/manual.svg";
import { Button } from "../../../../shared/ui/button";
import { cn } from "../../../../shared/ui/utils";
import SupportFooter from "../../components/SupportFooter";
import type { EmpanelmentType, OnboardingMethod } from "../../types/onboarding-types";

type OnboardingMethodStepProps = {
  panNumber: string;
  empanelmentType: EmpanelmentType;
  onboardingMethod: OnboardingMethod | null;
  onEmpanelmentTypeChange: (value: EmpanelmentType) => void;
  onMethodChange: (value: OnboardingMethod) => void;
  onBack: () => void;
  onContinue: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

type MethodOption = {
  value: OnboardingMethod;
  title: string;
  subtitle: string;
  icon: string;
  recommended?: boolean;
};

const METHOD_OPTIONS: MethodOption[] = [
  {
    value: "ARN",
    title: "ARN",
    subtitle: "Auto-fill via AMFI - Fastest",
    icon: arnIcon,
    recommended: true,
  },
  {
    value: "KRA",
    title: "KRA",
    subtitle: "Fetch from KYC records",
    icon: kraIcon,
  },
  {
    value: "DIGILOCKER",
    title: "Digilocker",
    subtitle: "Verify govt. documents",
    icon: digilockerIcon,
  },
  {
    value: "MANUAL",
    title: "Manual",
    subtitle: "Fetch from KYC records",
    icon: manualIcon,
  },
];

const OnboardingMethodStep = ({
  panNumber,
  empanelmentType,
  onboardingMethod,
  onEmpanelmentTypeChange,
  onMethodChange,
  onBack,
  onContinue,
  isSubmitting = false,
  errorMessage = null,
}: OnboardingMethodStepProps): ReactElement => {
  return (
    <section className="w-full rounded-2xl bg-[var(--color-onboarding-surface)] p-6 shadow-[-8px_-8px_40px_0px_rgba(0,0,0,0.08)] lg:p-8">
      <div className="space-y-5">
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-['Mulish',sans-serif] text-[22px] font-medium leading-none tracking-normal text-[#435160]">
              Get Started
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

          <p className="text-[15px] text-[var(--color-onboarding-heading)]">
            Join our distribution network and expand your client offerings
          </p>
        </header>

        <div className="flex flex-col gap-2">
          <p className="text-xs text-[var(--color-onboarding-heading-strong)]">
            Select empanelment type
          </p>

          <div className="inline-flex w-fit rounded-full bg-[#f8f8f8] p-1">
            <button
              className={cn(
                "h-7 rounded-full px-4 text-xs transition-colors",
                empanelmentType === "Distributor"
                  ? "bg-[#fceee7] text-[var(--color-onboarding-primary)]"
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
                  ? "bg-[#fceee7] text-[var(--color-onboarding-primary)]"
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

        <div className="flex flex-col gap-2">
          <p className="text-xs text-[var(--color-onboarding-heading-strong)]">
            Choose your onboarding method
          </p>

          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
            {METHOD_OPTIONS.map(({ value, title, subtitle, icon, recommended }) => {
              const selected = onboardingMethod === value;

              return (
                <button
                  aria-checked={selected}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg border px-2 py-2 text-left transition-colors",
                    selected
                      ? "border-[#93161E] bg-[#93161E0A]"
                      : "border-[#EEEEEE] bg-white",
                  )}
                  key={value}
                  onClick={() => {
                    if (isSubmitting) {
                      return;
                    }
                    onMethodChange(value);
                  }}
                  role="radio"
                  type="button"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center overflow-clip rounded-lg bg-[rgba(147,22,30,0.08)]">
                    <img alt="" className="size-4" src={icon} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="shrink-0 font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#435160]">
                        {title}
                      </span>
                      {recommended ? (
                        <span className="inline-flex shrink-0 items-center rounded-full bg-[#3669BA]/10 px-1.5 font-['Mulish',sans-serif] text-[10px] font-normal leading-[16.5px] tracking-normal text-[#3669BA] align-middle">
                          Recommended
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block whitespace-nowrap font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#5A6B7D]">
                      {subtitle}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border-2 bg-[#FFFFFF]",
                      selected ? "border-[#93161E]" : "border-[#EEEEEE]",
                    )}
                  >
                    {selected ? <span className="size-2 rounded-full bg-[#93161E]" /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {errorMessage ? (
          <p className="text-xs text-[var(--color-onboarding-primary)]">{errorMessage}</p>
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
            disabled={!onboardingMethod || isSubmitting}
            onClick={onContinue}
            type="button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>

        <SupportFooter showSecureMessage />
      </div>
    </section>
  );
};

export default OnboardingMethodStep;
