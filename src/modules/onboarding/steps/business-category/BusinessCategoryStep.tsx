import type { ReactElement } from "react";
import { ArrowRight, Loader2, Pencil } from "lucide-react";
import { useState } from "react";

import { Button } from "../../../../shared/ui/button";
import ProductCategoryCard from "../../components/ProductCategoryCard";
import SupportFooter from "../../components/SupportFooter";
import type { ProductCategory } from "../../types/onboarding-types";

type BusinessCategoryStepProps = {
  panNumber: string;
  initialCategories: ProductCategory[];
  externalError?: string | null;
  isSubmitting?: boolean;
  onContinue: (categories: ProductCategory[]) => void;
  onEditPan?: () => void;
};

const BusinessCategoryStep = ({
  panNumber,
  initialCategories,
  externalError,
  isSubmitting = false,
  onContinue,
  onEditPan,
}: BusinessCategoryStepProps): ReactElement => {
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(
    initialCategories,
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const isContinueDisabled = selectedCategories.length === 0;

  const toggleCategory = (category: ProductCategory): void => {
    setValidationError(null);
    setSelectedCategories((previous) => {
      if (previous.includes(category)) {
        return previous.filter((value) => value !== category);
      }

      return [...previous, category];
    });
  };

  const handleContinue = (): void => {
    if (isContinueDisabled) {
      setValidationError("Please select at least one product category.");
      return;
    }

    onContinue(selectedCategories);
  };

  return (
    <section className="w-full rounded-2xl bg-[var(--color-onboarding-surface)] p-6 shadow-[-8px_-8px_40px_0px_rgba(0,0,0,0.08)] lg:p-8">
      <div className="space-y-5">
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[22px] font-medium leading-[33px] text-[var(--color-onboarding-heading)] lg:text-[32px] lg:leading-[1.2]">
              Get Started
            </h2>

            <button
              aria-label="Edit PAN"
              className="inline-flex items-center gap-1 rounded-full bg-[var(--color-onboarding-pill-background)] px-2 py-1 text-xs font-medium text-[var(--color-onboarding-primary)] transition-opacity hover:opacity-80 disabled:opacity-50"
              disabled={isSubmitting}
              onClick={onEditPan}
              type="button"
            >
              PAN : {panNumber}
              <Pencil className="size-3" />
            </button>
          </div>

          <p className="text-[15px] text-[var(--color-onboarding-heading)]">
            Join our distribution network and expand your client offerings
          </p>
        </header>

        <div className="space-y-3">
          <p className="text-xs text-[var(--color-onboarding-heading-strong)]">
            Select Product Category
          </p>

          <div className="space-y-2.5">
            <ProductCategoryCard
              description="Portfolio Management Services"
              onSelect={() => {
                toggleCategory("PMS");
              }}
              selected={selectedCategories.includes("PMS")}
              title="PMS"
            />

            <ProductCategoryCard
              description="Alternative Investment Funds"
              onSelect={() => {
                toggleCategory("AIF");
              }}
              selected={selectedCategories.includes("AIF")}
              title="AIF"
            />

            {validationError || externalError ? (
              <p className="text-xs text-[var(--color-onboarding-primary)]">{validationError ?? externalError}</p>
            ) : null}
          </div>
        </div>

        <div
          onPointerDown={() => {
            if (isContinueDisabled) {
              setValidationError("Please select at least one product category.");
            }
          }}
        >
          <Button
            className="h-9 w-full rounded-lg bg-[var(--color-onboarding-primary)] text-sm text-white hover:bg-[#7f141a]"
            disabled={isContinueDisabled || isSubmitting}
            onClick={handleContinue}
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

export default BusinessCategoryStep;
