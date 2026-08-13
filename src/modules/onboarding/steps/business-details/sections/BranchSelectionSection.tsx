import type { ReactElement } from "react";
import { Search, ChevronDown } from "lucide-react";

import type { BranchOption } from "../types";

type BranchSelectionSectionProps = {
  selectedBranch: string;
  options: BranchOption[];
  onSelectBranch: (value: string) => void;
};

const BranchSelectionSection = ({
  selectedBranch,
  options,
  onSelectBranch,
}: BranchSelectionSectionProps): ReactElement => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-[16px] font-medium leading-[24px] tracking-normal text-[#231f20]">
          Branch Details
        </h2>
        <p className="mt-1 text-[12px] font-medium leading-none tracking-normal text-[#435160]">
          Select your nearest branch for onboarding assistance and future support.
        </p>
      </div>

      <div className="max-w-[332px] space-y-1">
        <label
          className="block text-[12px] font-normal leading-none tracking-normal text-[#231f20]"
          htmlFor="business-branch"
        >
          Select Branch <span className="text-[#e8402f]">*</span>
        </label>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71859b]" />
          <select
            className="h-9 w-full appearance-none rounded-[8px] border border-[#eeeeee] bg-white pl-10 pr-9 text-[13px] leading-[19.5px] text-[#231f20] outline-none"
            id="business-branch"
            onChange={(event) => {
              onSelectBranch(event.target.value);
            }}
            value={selectedBranch}
          >
            <option value="">Search Branch</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#231f20]" />
        </div>
      </div>
    </section>
  );
};

export default BranchSelectionSection;
