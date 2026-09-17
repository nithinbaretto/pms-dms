import type { ReactElement } from "react";

import { ENTITY_TYPE_OPTIONS, SIGNATORY_COPY } from "../signatory/constants";
import type { BusinessEntityType } from "../signatory/types";

type EntityTypeSectionProps = {
  value: BusinessEntityType;
  onChange: (value: BusinessEntityType) => void;
};

const EntityTypeSection = ({ value, onChange }: EntityTypeSectionProps): ReactElement => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-[4px]">
        <h2 className="font-['Mulish',sans-serif] text-[16px] font-medium leading-none tracking-normal text-[#231f20]">
          {SIGNATORY_COPY.entityTitle}
        </h2>
        <p className="font-['Mulish',sans-serif] text-[12px] font-medium leading-none tracking-normal text-[#435160]">
          {SIGNATORY_COPY.entityDescription}
        </p>
      </div>

      <div className="flex flex-col gap-[8px]">
        <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231f20]">
          {SIGNATORY_COPY.entityTypeLabel} <span className="text-[#e8402f]">*</span>
        </p>
        <div className="inline-flex w-fit self-start rounded-full bg-[#F5F5F5] p-0.5">
          {ENTITY_TYPE_OPTIONS.map((option) => {
            const selected = value === option;
            return (
              <button
                className={`h-8 shrink-0 whitespace-nowrap rounded-full px-4 text-center font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal ${
                  selected ? "bg-white text-[#93161E] shadow-sm" : "bg-transparent text-[#5A6B7D]"
                }`}
                key={option}
                onClick={() => {
                  onChange(option);
                }}
                type="button"
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EntityTypeSection;
