import type { ReactElement } from "react";
import { Plus } from "lucide-react";

import noKartaImg from "../../../../../assets/images/no_karta.png";
import { HUF_ENTITY_DETAILS_COPY } from "../constants";
import type { KartaDetails } from "../types";
import KartaPersonAvatar from "../components/KartaPersonAvatar";

type KartaDetailsSectionProps = {
  karta: KartaDetails | null;
  onAdd: () => void;
  onView: () => void;
};

const EyeIcon = (): ReactElement => (
  <svg aria-hidden className="size-[18px] shrink-0" fill="none" viewBox="0 0 15 10">
    <path
      d="M7.5 0C4.375 0 1.6875 1.9375 0.625 4.75C1.6875 7.5625 4.375 9.5 7.5 9.5C10.625 9.5 13.3125 7.5625 14.375 4.75C13.3125 1.9375 10.625 0 7.5 0ZM7.5 8C5.84375 8 4.5 6.65625 4.5 5C4.5 3.34375 5.84375 2 7.5 2C9.15625 2 10.5 3.34375 10.5 5C10.5 6.65625 9.15625 8 7.5 8ZM7.5 3.25C6.53125 3.25 5.75 4.03125 5.75 5C5.75 5.96875 6.53125 6.75 7.5 6.75C8.46875 6.75 9.25 5.96875 9.25 5C9.25 4.03125 8.46875 3.25 7.5 3.25Z"
      fill="#93161E"
    />
  </svg>
);

const KartaDetailsSection = ({
  karta,
  onAdd,
  onView,
}: KartaDetailsSectionProps): ReactElement => {
  const copy = HUF_ENTITY_DETAILS_COPY.karta;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[860px]">
          <h2 className="font-['Mulish',sans-serif] text-[16px] font-medium leading-6 tracking-normal text-[#231F20]">
            {copy.title}
          </h2>
          <p className="mt-1 font-['Mulish',sans-serif] text-[12px] font-medium leading-none tracking-normal text-[#435160]">
            {copy.description}
          </p>
        </div>

        {karta ? null : (
          <button
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[8px] border border-[#93161E] px-[21px] py-[7px] font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#93161E]"
            onClick={onAdd}
            type="button"
          >
            <Plus className="size-4" strokeWidth={2.25} />
            {copy.addLabel}
          </button>
        )}
      </div>

      {karta ? (
        <div className="flex items-center gap-3 rounded-[8px] border border-[#EEEEEE] bg-white px-3 py-3">
          <KartaPersonAvatar />
          <div className="min-w-0 flex-1">
            <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#435160]">
              {karta.name}
            </p>
            <p className="mt-1 font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#5A6B7D]">
              {karta.pan}
            </p>
          </div>
          <button
            aria-label="View Karta details"
            className="flex size-6 shrink-0 items-center justify-center hover:opacity-70"
            onClick={onView}
            title="View Karta details"
            type="button"
          >
            <EyeIcon />
          </button>
        </div>
      ) : (
        <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 py-8 text-center">
          <img alt="" className="h-[66px] w-[108px] object-contain" src={noKartaImg} />
          <div className="space-y-1.5">
            <p className="font-['Mulish',sans-serif] text-[16px] font-medium leading-6 text-[#231F20]">
              {copy.emptyTitle}
            </p>
            <p className="max-w-[440px] font-['Mulish',sans-serif] text-[13px] font-normal leading-[19.5px] text-[#71859B]">
              {copy.emptyDescription}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default KartaDetailsSection;
