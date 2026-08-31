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
      <div>
        <h2 className="text-[16px] font-medium leading-[24px] tracking-normal text-[#231f20]">
          {SIGNATORY_COPY.entityTitle}
        </h2>
        <p className="mt-1 text-[12px] font-medium leading-none tracking-normal text-[#435160]">
          {SIGNATORY_COPY.entityDescription}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-normal leading-none tracking-normal text-[#231f20]">
          {SIGNATORY_COPY.entityTypeLabel} <span className="text-[#e8402f]">*</span>
        </p>
        <div className="inline-flex rounded-full border border-[#eeeeee] bg-white p-0.5">
          {ENTITY_TYPE_OPTIONS.map((option) => {
            const selected = value === option;
            return (
              <button
                className={`h-8 rounded-full px-4 text-[13px] font-medium leading-none ${
                  selected
                    ? "border border-[#93161e] bg-white text-[#93161e]"
                    : "border border-transparent text-[#5a6b7d]"
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
