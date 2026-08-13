import type { ChangeEvent, ReactElement } from "react";
import { useRef } from "react";
import { Check, Upload } from "lucide-react";

import { abbreviateStateName } from "../helpers";
import type { GstRecord } from "../types";

type GstGridSectionProps = {
  records: GstRecord[];
  isUploading: boolean;
  onToggle: (id: string) => void;
  onUploadForRecord: (id: string, file: File) => void;
};

const GstGridSection = ({
  records,
  isUploading,
  onToggle,
  onUploadForRecord,
}: GstGridSectionProps): ReactElement => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {records.map((record) => {
        const cardClass = record.selected
          ? "border-[#d8787d] bg-[#fffaf6]"
          : "border-[#eeeeee] bg-white";
        const needsUpload =
          record.selected && record.requiresCertificate && !record.fileURL.trim();
        const stateAbbrev = abbreviateStateName(record.stateCode);

        return (
          <div
            className={`flex w-full min-w-0 flex-col rounded-[8px] border p-3 text-left transition-colors ${cardClass}`}
            key={record.id}
          >
            <button
              className="flex w-full min-w-0 items-start text-left"
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

              <span className="min-w-0 flex-1 overflow-hidden">
                <span className="flex min-w-0 items-center justify-between gap-2 text-[13px] leading-[19px] text-[#231f20]">
                  <span className="min-w-0 truncate">
                    {record.gstNumber || "Unregistered"}
                  </span>
                  {stateAbbrev ? (
                    <span className="shrink-0 whitespace-nowrap">{stateAbbrev}</span>
                  ) : null}
                </span>
                <span className="mt-1 block truncate text-[11px] leading-[16.5px] text-[#71859b]">
                  {record.legalName || "—"}
                </span>
              </span>
            </button>

            {needsUpload ? (
              <div className="mt-2 border-t border-[#f0f0f0] pt-2">
                <input
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      onUploadForRecord(record.id, file);
                    }
                    event.target.value = "";
                  }}
                  ref={(element) => {
                    inputRefs.current[record.id] = element;
                  }}
                  type="file"
                />
                <button
                  className="inline-flex h-7 items-center gap-1 rounded-[6px] border border-[#93161e] px-2 text-[11px] text-[#93161e] disabled:opacity-50"
                  disabled={isUploading}
                  onClick={() => {
                    inputRefs.current[record.id]?.click();
                  }}
                  type="button"
                >
                  <Upload className="h-3 w-3" />
                  Upload certificate
                </button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default GstGridSection;
