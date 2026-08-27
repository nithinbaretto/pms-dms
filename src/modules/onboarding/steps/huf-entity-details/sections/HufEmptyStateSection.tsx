import type { ReactElement } from "react";
import { Plus } from "lucide-react";

type HufEmptyStateSectionProps = {
  title: string;
  description: string;
  addLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  imageSrc: string;
  imageAlt: string;
  onAdd?: () => void;
};

const HufEmptyStateSection = ({
  title,
  description,
  addLabel,
  emptyTitle,
  emptyDescription,
  imageSrc,
  imageAlt,
  onAdd,
}: HufEmptyStateSectionProps): ReactElement => {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[860px]">
          <h2 className="font-['Mulish',sans-serif] text-[16px] font-medium leading-6 tracking-normal text-[#231F20]">
            {title}
          </h2>
          <p className="mt-1 font-['Mulish',sans-serif] text-[12px] font-medium leading-none tracking-normal text-[#435160]">
            {description}
          </p>
        </div>

        <button
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[8px] border border-[#93161E] px-[21px] py-[7px] font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#93161E]"
          onClick={onAdd}
          type="button"
        >
          <Plus className="size-4" strokeWidth={2.25} />
          {addLabel}
        </button>
      </div>

      <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 py-8 text-center">
        <img alt={imageAlt} className="h-[66px] w-[108px] object-contain" src={imageSrc} />
        <div className="space-y-1.5">
          <p className="font-['Mulish',sans-serif] text-[16px] font-medium leading-6 text-[#231F20]">
            {emptyTitle}
          </p>
          <p className="max-w-[440px] font-['Mulish',sans-serif] text-[13px] font-normal leading-[19.5px] text-[#71859B]">
            {emptyDescription}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HufEmptyStateSection;
