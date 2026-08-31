import type { ReactElement } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";

import editIcon from "../../../../../assets/icons/edit_icon.png";
import trashIcon from "../../../../../assets/icons/svg/trash_icon.svg";
import noSignatoryImg from "../../../../../assets/images/no_gst_found.png";
import { SIGNATORY_COPY } from "../signatory/constants";
import { formatMobileDisplay } from "../signatory/helpers";
import type { SignatoryDetails, SignatoryMode } from "../signatory/types";

type AuthorizedSignatorySectionProps = {
  signatories: SignatoryDetails[];
  mode: SignatoryMode;
  anyCount: number;
  onModeChange: (mode: SignatoryMode) => void;
  onAnyCountChange: (count: number) => void;
  onToggleSelected: (id: string) => void;
  onAdd: () => void;
  onEdit: (signatory: SignatoryDetails) => void;
  onRemove: (id: string) => void;
  onView: (signatory: SignatoryDetails) => void;
};

const EyeIcon = (): ReactElement => (
  <svg aria-hidden className="size-4 shrink-0" fill="none" viewBox="0 0 15 10">
    <path
      d="M7.5 0C4.375 0 1.6875 1.9375 0.625 4.75C1.6875 7.5625 4.375 9.5 7.5 9.5C10.625 9.5 13.3125 7.5625 14.375 4.75C13.3125 1.9375 10.625 0 7.5 0ZM7.5 8C5.84375 8 4.5 6.65625 4.5 5C4.5 3.34375 5.84375 2 7.5 2C9.15625 2 10.5 3.34375 10.5 5C10.5 6.65625 9.15625 8 7.5 8ZM7.5 3.25C6.53125 3.25 5.75 4.03125 5.75 5C5.75 5.96875 6.53125 6.75 7.5 6.75C8.46875 6.75 9.25 5.96875 9.25 5C9.25 4.03125 8.46875 3.25 7.5 3.25Z"
      fill="#93161E"
    />
  </svg>
);

const AuthorizedSignatorySection = ({
  signatories,
  mode,
  anyCount,
  onModeChange,
  onAnyCountChange,
  onToggleSelected,
  onAdd,
  onEdit,
  onRemove,
  onView,
}: AuthorizedSignatorySectionProps): ReactElement => {
  const selectedCount = signatories.filter((item) => item.selected).length;
  const countOptions = Array.from({ length: Math.max(selectedCount, 1) }, (_, index) => index + 1);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[860px]">
          <h2 className="text-[16px] font-medium leading-6 tracking-normal text-[#231f20]">
            {SIGNATORY_COPY.title}
          </h2>
          <p className="mt-1 text-[12px] font-medium leading-none tracking-normal text-[#435160]">
            {SIGNATORY_COPY.description}
          </p>
        </div>

        <button
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[8px] border border-[#93161e] px-[21px] py-[7px] text-[14px] font-normal leading-none tracking-normal text-[#93161e]"
          onClick={onAdd}
          type="button"
        >
          <Plus className="size-4" strokeWidth={2.25} />
          {SIGNATORY_COPY.addLabel}
        </button>
      </div>

      {signatories.length > 0 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-[12px] font-normal leading-none tracking-normal text-[#231f20]">
              Select Mode of Operation <span className="text-[#e8402f]">*</span>
            </p>
            <div className="inline-flex rounded-full border border-[#eeeeee] bg-white p-0.5">
              {(["jointly", "any"] as const).map((option) => {
                const selected = mode === option;
                return (
                  <button
                    className={`h-8 rounded-full px-4 text-[13px] font-medium leading-none ${
                      selected
                        ? "border border-[#93161e] bg-[#fff4f4] text-[#93161e]"
                        : "border border-transparent text-[#5a6b7d]"
                    }`}
                    key={option}
                    onClick={() => {
                      onModeChange(option);
                    }}
                    type="button"
                  >
                    {option === "jointly" ? "Jointly" : "Any"}
                  </button>
                );
              })}
            </div>
            <p className="text-[12px] font-normal leading-[18px] text-[#71859b]">
              {mode === "jointly" ? SIGNATORY_COPY.jointlyHint : SIGNATORY_COPY.anyHint}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {signatories.map((signatory) => {
              const isSelected = mode === "jointly" || signatory.selected;
              return (
                <div
                  className={`w-full max-w-[360px] rounded-[8px] border bg-white ${
                    isSelected ? "border-[#93161e]" : "border-[#eeeeee]"
                  }`}
                  key={signatory.id}
                >
                  <div className="space-y-2 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-1 items-start gap-2">
                        <button
                          aria-label={isSelected ? `Deselect ${signatory.name}` : `Select ${signatory.name}`}
                          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] ${
                            isSelected ? "bg-[#93161e]" : "border border-[#d9d9d9] bg-white"
                          }`}
                          disabled={mode === "jointly"}
                          onClick={() => {
                            onToggleSelected(signatory.id);
                          }}
                          type="button"
                        >
                          {isSelected ? <Check className="size-3 text-white" strokeWidth={3} /> : null}
                        </button>
                        <p className="min-w-0 flex-1 text-[14px] font-medium leading-none text-[#231f20]">
                          {signatory.name}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          aria-label={`View ${signatory.name}`}
                          className="flex size-4 items-center justify-center hover:opacity-70"
                          onClick={() => {
                            onView(signatory);
                          }}
                          type="button"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          aria-label={`Edit ${signatory.name}`}
                          className="flex size-4 items-center justify-center hover:opacity-70"
                          onClick={() => {
                            onEdit(signatory);
                          }}
                          type="button"
                        >
                          <img alt="" className="size-4" src={editIcon} />
                        </button>
                        <button
                          aria-label={`Remove ${signatory.name}`}
                          className="flex size-4 items-center justify-center hover:opacity-70"
                          onClick={() => {
                            onRemove(signatory.id);
                          }}
                          type="button"
                        >
                          <img alt="" className="size-4" src={trashIcon} />
                        </button>
                      </div>
                    </div>
                    <p className="pl-6 text-[12px] font-normal leading-none text-[#5a6b7d]">
                      PAN: {signatory.pan}
                    </p>
                  </div>
                  <div className="space-y-2 border-t border-[#eeeeee] px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[12px] font-normal text-[#71859b]">Mobile Number</p>
                      <p className="text-[12px] font-normal text-[#231f20]">
                        {formatMobileDisplay(signatory.mobile)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[12px] font-normal text-[#71859b]">Email</p>
                      <p className="break-all text-right text-[12px] font-normal text-[#231f20]">
                        {signatory.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {mode === "any" ? (
            <div className="max-w-full space-y-1">
              <p className="text-[12px] font-normal leading-none text-[#231f20]">
                Number of Signatory <span className="text-[#e8402f]">*</span>
              </p>
              <div className="relative">
                <select
                  className="h-9 w-full appearance-none rounded-[8px] border border-[#eeeeee] bg-white px-[14px] text-[14px] font-normal text-[#231f20] outline-none focus-visible:border-[var(--color-onboarding-primary)] focus-visible:ring-2 focus-visible:ring-[rgba(147,22,30,0.2)]"
                  onChange={(event) => {
                    onAnyCountChange(Number(event.target.value));
                  }}
                  value={Math.min(anyCount, Math.max(selectedCount, 1))}
                >
                  {countOptions.map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#5a6b7d]" />
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 py-8 text-center">
          <img alt="" className="h-[66px] w-[108px] object-contain" src={noSignatoryImg} />
          <div className="space-y-1.5">
            <p className="text-[16px] font-medium leading-6 text-[#231f20]">{SIGNATORY_COPY.emptyTitle}</p>
            <p className="max-w-[440px] text-[13px] font-normal leading-[19.5px] text-[#71859b]">
              {SIGNATORY_COPY.emptyDescription}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default AuthorizedSignatorySection;
