import type { ReactElement } from "react";
import { PackageOpen, Plus } from "lucide-react";

import {
  GST_DESCRIPTION,
  GST_EMPTY_DESCRIPTION,
  GST_EMPTY_TITLE,
} from "../constants";
import type { BusinessDetailsMode, GstRecord } from "../types";
import GstGridSection from "./GstGridSection";

type GstSelectionSectionProps = {
  mode: BusinessDetailsMode;
  records: GstRecord[];
  isUploading: boolean;
  onToggleRecord: (id: string) => void;
  onSelectAll: () => void;
  onOpenAddGst: () => void;
  onUploadForRecord: (id: string, file: File) => void;
};

const GstSelectionSection = ({
  mode,
  records,
  isUploading,
  onToggleRecord,
  onSelectAll,
  onOpenAddGst,
  onUploadForRecord,
}: GstSelectionSectionProps): ReactElement => {
  const selectedCount = records.filter((record) => record.selected).length;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-[860px]">
          <h2 className="text-[16px] font-medium leading-[24px] text-[#231f20]">GST Details</h2>
          <p className="mt-1 text-[14px] leading-[21px] text-[#435160]">{GST_DESCRIPTION}</p>
        </div>

        <button
          className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-[#93161e] px-[21px] py-[7px] text-[14px] leading-[21px] text-[#93161e]"
          onClick={onOpenAddGst}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Add New GST
        </button>
      </div>

      {mode === "selection" ? (
        <>
          <div className="flex items-center gap-5">
            <p className="text-[12px] leading-[18px] text-[#231f20]">
              {selectedCount} of {records.length} Item(s) Selected
            </p>
            <button
              className="h-[29px] rounded-[8px] border border-[#eeeeee] px-4 text-[13px] leading-[19.5px] text-[#435160]"
              onClick={onSelectAll}
              type="button"
            >
              Select All
            </button>
          </div>

          <GstGridSection
            isUploading={isUploading}
            onToggle={onToggleRecord}
            onUploadForRecord={onUploadForRecord}
            records={records}
          />
        </>
      ) : (
        <div className="flex min-h-[170px] flex-col items-center justify-center rounded-[8px] bg-transparent py-6 text-center">
          <span className="mb-2 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#fff5ed] text-[#b55a40]">
            <PackageOpen className="h-7 w-7" />
          </span>
          <p className="text-[36px] font-medium leading-[45px] text-[#5a6b7d]">{GST_EMPTY_TITLE}</p>
          <p className="text-[18px] leading-[30px] text-[#8ea2b8]">{GST_EMPTY_DESCRIPTION}</p>
        </div>
      )}
    </section>
  );
};

export default GstSelectionSection;
