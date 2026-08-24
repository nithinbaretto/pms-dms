import type { ReactElement } from "react";
import { Calendar } from "lucide-react";

import { Input } from "../../../../../shared/ui/input";
import type { EntitySummary } from "../types";

type ManualIdentitySectionProps = {
  summary: EntitySummary;
  onNameChange: (value: string) => void;
  onDobChange: (value: string) => void;
};

const labelClass =
  "font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]";

const toDateInputValue = (dob: string): string => {
  const trimmed = dob.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const slashMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashMatch) {
    return `${slashMatch[3]}-${slashMatch[2]}-${slashMatch[1]}`;
  }

  return "";
};

const fromDateInputValue = (value: string): string => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return "";
  }

  return `${match[3]}/${match[2]}/${match[1]}`;
};

const ManualIdentitySection = ({
  summary,
  onNameChange,
  onDobChange,
}: ManualIdentitySectionProps): ReactElement => {
  return (
    <section className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
      <div className="space-y-1">
        <label className={labelClass} htmlFor="manual-personal-name">
          Name <span className="text-[#E8402F]">*</span>
        </label>
        <Input
          id="manual-personal-name"
          onChange={(event) => {
            onNameChange(event.target.value);
          }}
          placeholder="Enter Name"
          value={summary.name}
        />
      </div>

      <div className="space-y-1">
        <label className={labelClass} htmlFor="manual-personal-pan">
          PAN Number <span className="text-[#E8402F]">*</span>
        </label>
        <Input
          disabled
          id="manual-personal-pan"
          readOnly
          value={summary.pan}
        />
      </div>

      <div className="space-y-1">
        <label className={labelClass} htmlFor="manual-personal-dob">
          Date of Birth <span className="text-[#E8402F]">*</span>
        </label>
        <div className="relative">
          <Input
            className="pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
            id="manual-personal-dob"
            onChange={(event) => {
              onDobChange(fromDateInputValue(event.target.value));
            }}
            placeholder="Select Date of Birth"
            type="date"
            value={toDateInputValue(summary.dob)}
          />
          <Calendar
            aria-hidden
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#71859B]"
          />
        </div>
      </div>
    </section>
  );
};

export default ManualIdentitySection;
