import type { ReactElement } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

import editIcon from "../../../../assets/icons/edit_icon.png";
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
            <h2 className="font-['Mulish',sans-serif] text-[22px] font-medium leading-none tracking-normal text-[#435160]">
              Get Started
            </h2>

            <button
              aria-label="Edit PAN"
              className="inline-flex h-[26px] items-center gap-2 rounded-full bg-[rgba(147,22,30,0.06)] px-2 py-1 font-['Mulish',sans-serif] text-[12px] font-medium leading-[18px] tracking-normal text-[#93161E] transition-opacity hover:opacity-80 disabled:opacity-50"
              disabled={isSubmitting}
              onClick={onEditPan}
              type="button"
            >
              PAN : {panNumber}
              <img
                alt=""
                className="size-[11px] shrink-0"
                src={editIcon}
              />
            </button>
          </div>

          <p className="font-['Mulish',sans-serif] text-[15px] font-semibold leading-[22.5px] tracking-normal text-[#435160]">
            Join our distribution network and expand your client offerings
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <p className="mb-0 font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]">
            Select Product Category
          </p>

          <div className="flex flex-col gap-2.5">
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
            className="h-9 w-full rounded-lg bg-[var(--color-onboarding-primary)] text-sm text-white hover:bg-[#7f141a] disabled:bg-[#E5E5E6] disabled:text-[#5A6B7D] disabled:opacity-100 disabled:[&_svg]:text-[#5A6B7D] hover:disabled:bg-[#E5E5E6]"
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
                Continue <ArrowRight className="size-4 text-current" />
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
