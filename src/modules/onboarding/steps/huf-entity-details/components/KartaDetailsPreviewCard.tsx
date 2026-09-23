import type { ReactElement } from "react";

import editIcon from "../../../../../assets/icons/svg/edit.svg";
import { formatAddressLine, formatHufPersonName, formatMobileDisplay } from "../helpers";
import type { KartaDetails } from "../types";
import KartaPersonAvatar from "./KartaPersonAvatar";

type KartaDetailsPreviewCardProps = {
  karta: KartaDetails;
  onEditCorrespondence?: () => void;
};

const KartaDetailsPreviewCard = ({
  karta,
  onEditCorrespondence,
}: KartaDetailsPreviewCardProps): ReactElement => {
  const correspondenceLabel = onEditCorrespondence ? "Correspondent Address" : "Correspondence Address";

  return (
    <div className="overflow-hidden rounded-[8px] border border-[#93161E]">
      <div className="flex items-center gap-3 bg-[#FFF4F4] px-4 py-3">
        <KartaPersonAvatar />
        <div className="flex flex-col gap-[4px]">
          <p className="font-['Mulish',sans-serif] text-[16px] font-medium leading-6 tracking-normal text-[#231F20]">
            {formatHufPersonName(karta.name)}
          </p>
          <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#5A6B7D]">
            PAN: {karta.pan}
          </p>
        </div>
      </div>

      <div className="space-y-0 bg-white px-4">
        <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#71859B]">
              Mobile
            </p>
            <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none text-[#435160]">
              {formatMobileDisplay(karta.mobile)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#71859B]">
              Email
            </p>
            <p className="break-all font-['Mulish',sans-serif] text-[14px] font-normal leading-none text-[#435160]">
              {karta.email}
            </p>
          </div>
        </div>

        <div className="border-t border-[#EEEEEE] py-4">
          <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#71859B]">
            Permanent Address
          </p>
          <p className="mt-1 font-['Mulish',sans-serif] text-[14px] font-normal leading-[21px] text-[#435160]">
            {formatAddressLine(karta.permanentAddress)}
          </p>
        </div>

        <div className="border-t border-[#EEEEEE] py-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#71859B]">
              {correspondenceLabel}
            </p>
            {onEditCorrespondence ? (
              <button
                className="inline-flex shrink-0 items-center gap-1 font-['Mulish',sans-serif] text-[12px] font-normal text-[#93161E]"
                onClick={onEditCorrespondence}
                type="button"
              >
                <img alt="" className="h-3 w-3" src={editIcon} /> Edit
              </button>
            ) : null}
          </div>
          <p className="mt-1 font-['Mulish',sans-serif] text-[14px] font-normal leading-[21px] text-[#435160]">
            {formatAddressLine(karta.correspondenceAddress)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KartaDetailsPreviewCard;
