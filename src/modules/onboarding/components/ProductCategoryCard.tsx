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
        "w-full rounded-lg border-[0.8px] p-3 text-left transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] active:scale-[0.99]",
        selected
          ? "border-[rgba(147,22,30,0.09)] bg-[rgba(147,22,30,0.04)]"
          : "border-[#eeeeee] bg-white hover:border-[#c7aa7b]",
      )}
      onClick={onSelect}
      type="button"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex size-[14px] items-center justify-center rounded-[3.5px] border-2 transition-all duration-200 ease-in-out",
              selected
                ? "scale-110 border-[#93161e] bg-[#93161e]"
                : "border-[#eeeeee] bg-white",
            )}
          >
            {selected ? (
              <Check className="size-[8.75px] animate-[checkmark_0.2s_ease-in-out] text-white" />
            ) : null}
          </span>
          <span className="space-y-0.5">
            <span className="block font-['Mulish',sans-serif] text-[12px] font-medium leading-[18px] tracking-normal text-[#435160]">
              {title}
            </span>
            <span className="block font-['Mulish',sans-serif] text-[11px] font-normal leading-[16.5px] tracking-normal text-[#5A6B7D]">
              {description}
            </span>
          </span>
        </span>

        <span className="flex size-7 shrink-0 items-center justify-center rounded-[8.75px] bg-[rgba(147,22,30,0.1)] px-[7px]">
          <TrendingUp className="size-[14px] text-[#93161E]" />
        </span>
      </span>
    </button>
  );
};

export default ProductCategoryCard;
