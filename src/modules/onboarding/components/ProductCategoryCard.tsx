import type { ReactElement } from "react";
import { Check, TrendingUp } from "lucide-react";

import { cn } from "../../../shared/ui/utils";

type ProductCategoryCardProps = {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
};

const ProductCategoryCard = ({
  title,
  description,
  selected,
  onSelect,
}: ProductCategoryCardProps): ReactElement => {
  return (
    <button
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-colors",
        selected
          ? "border-[var(--color-onboarding-product-selected-border)] bg-[var(--color-onboarding-product-selected)]"
          : "border-[#eeeeee] bg-[var(--color-onboarding-surface)]",
      )}
      onClick={onSelect}
      type="button"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex size-[14px] items-center justify-center rounded-[3.5px] border-2",
              selected
                ? "border-[var(--color-onboarding-primary)] bg-[var(--color-onboarding-primary)]"
                : "border-[#eeeeee] bg-white",
            )}
          >
            {selected ? <Check className="size-2.5 text-white" /> : null}
          </span>
          <span className="space-y-0.5">
            <span className="block text-xs font-medium text-[var(--color-onboarding-heading)]">
              {title}
            </span>
            <span className="block text-[11px] text-[#5a6b7d]">{description}</span>
          </span>
        </span>

        <span className="flex size-7 items-center justify-center rounded-[8px] bg-[rgba(147,22,30,0.1)]">
          <TrendingUp className="size-[14px] text-[var(--color-onboarding-primary)]" />
        </span>
      </span>
    </button>
  );
};

export default ProductCategoryCard;
