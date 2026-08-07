import type { ReactElement } from "react";
import { ArrowRight, BadgeCheck, Building2, FileText, Landmark, UserCog } from "lucide-react";

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
};

type MethodOption = {
  value: OnboardingMethod;
  title: string;
  subtitle: string;
  Icon: typeof Landmark;
};

const METHOD_OPTIONS: MethodOption[] = [
  {
    value: "ARN",
    title: "ARN",
    subtitle: "Auto-fill via AMFI + Fastest",
    Icon: BadgeCheck,
  },
  {
    value: "KRA",
    title: "KRA",
    subtitle: "Fetch from KYC records",
    Icon: Building2,
  },
  {
    value: "DIGILOCKER",
    title: "Digilocker",
    subtitle: "Verify by govt. documents",
    Icon: FileText,
  },
  {
    value: "MANUAL",
    title: "Manual",
    subtitle: "Enter details yourself",
    Icon: UserCog,
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
}: OnboardingMethodStepProps): ReactElement => {
  return (
    <section className="w-full rounded-2xl bg-[var(--color-onboarding-surface)] p-6 shadow-[-8px_-8px_40px_0px_rgba(0,0,0,0.08)] lg:p-8">
      <div className="space-y-5">
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[22px] font-medium leading-[33px] text-[var(--color-onboarding-heading)] lg:text-[32px] lg:leading-[1.2]">
              Get Started
            </h2>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-onboarding-pill-background)] px-2 py-1 text-xs font-medium text-[var(--color-onboarding-primary)]">
                PAN : {panNumber}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-onboarding-pill-background)] px-2 py-1 text-xs font-medium text-[var(--color-onboarding-primary)]">
                AF
              </span>
            </div>
          </div>

          <p className="text-[15px] text-[var(--color-onboarding-heading)]">
            Join our distribution network and expand your client offerings
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

        <div className="space-y-3">
          <p className="text-xs text-[var(--color-onboarding-heading-strong)]">
            Choose your onboarding method
          </p>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {METHOD_OPTIONS.map(({ value, title, subtitle, Icon }) => (
              <button
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-colors",
                  onboardingMethod === value
                    ? "border-[var(--color-onboarding-product-selected-border)] bg-[var(--color-onboarding-product-selected)]"
                    : "border-[#eeeeee] bg-[var(--color-onboarding-surface)]",
                )}
                key={value}
                onClick={() => {
                  onMethodChange(value);
                }}
                type="button"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="space-y-0.5">
                    <span className="block text-xs font-medium text-[var(--color-onboarding-heading)]">
                      {title}
                    </span>
                    <span className="block text-[11px] text-[#5a6b7d]">{subtitle}</span>
                  </span>

                  <span className="flex size-7 items-center justify-center rounded-[8px] bg-[rgba(147,22,30,0.1)]">
                    <Icon className="size-[14px] text-[var(--color-onboarding-primary)]" />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-5">
          <Button
            className="h-9 rounded-[8px] border border-[#eeeeee] bg-white text-sm text-[var(--color-onboarding-heading)] hover:bg-[#f8f8f8] lg:rounded-[8.75px]"
            onClick={onBack}
            type="button"
            variant="outline"
          >
            Back
          </Button>

          <Button
            className="h-9 rounded-[8px] bg-[var(--color-onboarding-primary)] text-sm text-white hover:bg-[#7f141a] lg:rounded-[8.75px]"
            disabled={!onboardingMethod}
            onClick={onContinue}
            type="button"
          >
            Continue <ArrowRight className="size-4" />
          </Button>
        </div>

        <SupportFooter showSecureMessage />
      </div>
    </section>
  );
};

export default OnboardingMethodStep;
