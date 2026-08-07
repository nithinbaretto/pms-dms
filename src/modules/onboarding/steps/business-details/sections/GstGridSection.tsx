import type { ReactElement } from "react";
import { Check } from "lucide-react";

import type { GstRecord } from "../types";

type GstGridSectionProps = {
  records: GstRecord[];
  onToggle: (id: string) => void;
};

const GstGridSection = ({ records, onToggle }: GstGridSectionProps): ReactElement => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {records.map((record) => {
        const cardClass = record.selected
          ? "border-[#d8787d] bg-[#fffaf6]"
          : "border-[#eeeeee] bg-white";

        return (
          <button
            className={`flex w-full items-start rounded-[8px] border p-3 text-left transition-colors ${cardClass}`}
            key={record.id}
            onClick={() => {
              onToggle(record.id);
            }}
            type="button"
          >
            <span
              className={`mt-0.5 mr-2 flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[3.5px] border-[2px] ${
                record.selected ? "border-[#93161e] bg-[#93161e]" : "border-[#eeeeee] bg-white"
              }`}
            >
              {record.selected ? <Check className="h-[9px] w-[9px] text-white" /> : null}
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-3 text-[13px] leading-[19px] text-[#231f20]">
                <span className="truncate">{record.gstNumber}</span>
                <span>{record.stateCode}</span>
              </span>
              <span className="mt-1 block text-[11px] leading-[16.5px] text-[#71859b]">{record.legalName}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default GstGridSection;
