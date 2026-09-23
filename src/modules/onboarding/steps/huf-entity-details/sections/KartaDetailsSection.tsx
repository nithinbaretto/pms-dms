import type { ReactElement } from "react";
import { Plus } from "lucide-react";

import eyeIcon from "../../../../../assets/icons/svg/eye.svg";
import noKartaImg from "../../../../../assets/images/no_karta.png";
import { HUF_ENTITY_DETAILS_COPY } from "../constants";
import { formatHufPersonName } from "../helpers";
import type { KartaDetails } from "../types";
import KartaPersonAvatar from "../components/KartaPersonAvatar";

type KartaDetailsSectionProps = {
  karta: KartaDetails | null;
  onAdd: () => void;
  onView: () => void;
};

const KARTA_TILE_GRID_CLASS = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4";

const KARTA_TILE_CLASS =
  "flex w-full min-w-0 items-center gap-3 rounded-[8px] border border-[#EEEEEE] bg-white px-3 py-3";

const eyeIconMaskStyle = {
  WebkitMaskImage: `url("${eyeIcon}")`,
  maskImage: `url("${eyeIcon}")`,
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
} as const;

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
        <div className={KARTA_TILE_GRID_CLASS}>
          <div className={KARTA_TILE_CLASS}>
            <KartaPersonAvatar />
            <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
              <p className="truncate font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#435160]">
                {formatHufPersonName(karta.name)}
              </p>
              <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#5A6B7D]">
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
              <span
                aria-hidden
                className="size-[18px] shrink-0 bg-[#435160]"
                style={eyeIconMaskStyle}
              />
            </button>
          </div>
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
