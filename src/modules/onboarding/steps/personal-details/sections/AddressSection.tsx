import type { ReactElement } from "react";

import editIcon from "../../../../../assets/icons/edit_icon.png";
import { Checkbox } from "../../../../../shared/ui/checkbox";
import type { Address } from "../types";

type AddressSectionProps = {
  permanentAddress: Address;
  correspondenceAddress: Address;
  canEditCorrespondenceAddress?: boolean;
  onEditCorrespondenceAddress: () => void;
  showSameAsPermanent?: boolean;
  sameAsPermanent?: boolean;
  onSameAsPermanentChange?: (sameAsPermanent: boolean) => void;
};

const formatAddress = (address: Address): string => {
  const parts = [address.addressLine, address.city, address.state, address.pincode]
    .map((part) => part.trim())
    .filter(Boolean);

  if (!address.city.trim() && !address.state.trim() && !address.pincode.trim()) {
    return address.addressLine.trim();
  }

  return parts.join(", ");
};

const AddressSection = ({
  permanentAddress,
  correspondenceAddress,
  canEditCorrespondenceAddress = true,
  onEditCorrespondenceAddress,
  showSameAsPermanent = false,
  sameAsPermanent = false,
  onSameAsPermanentChange,
}: AddressSectionProps): ReactElement => {
  return (
    <section className="space-y-3 border-t border-[#e6e7e8] pt-6">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-2">
          <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]">
            Permanent Address <span className="text-[#E8402F]">*</span>
          </p>
          <div className="flex min-h-[76px] items-center rounded-[10px] border border-[#E5E5E6] bg-[#F5F5F5] px-3 font-['Mulish',sans-serif] text-[13px] font-normal leading-[19.5px] tracking-normal text-[#5A6B7D]">
            <span className="line-clamp-2 whitespace-pre-wrap break-words">
              {formatAddress(permanentAddress) || "Enter Permanent Address"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]">
              Correspondence Address <span className="text-[#E8402F]">*</span>
            </p>
            <button
              className="inline-flex items-center gap-1 font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#93161E] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canEditCorrespondenceAddress}
              onClick={onEditCorrespondenceAddress}
              type="button"
            >
              <img alt="" className="h-3 w-3" src={editIcon} /> Edit
            </button>
          </div>
          <div className="flex min-h-[76px] items-center rounded-[10px] border border-[#E5E5E6] bg-[#F5F5F5] px-3 font-['Mulish',sans-serif] text-[13px] font-normal leading-[19.5px] tracking-normal text-[#5A6B7D]">
            <span className="line-clamp-2 whitespace-pre-wrap break-words">
              {formatAddress(correspondenceAddress) || "Enter Correspondence Address"}
            </span>
          </div>
          {showSameAsPermanent ? (
            <label className="flex items-center gap-2">
              <Checkbox
                checked={sameAsPermanent}
                className="border-[#eeeeee] data-[state=checked]:border-[#93161E] data-[state=checked]:bg-[#93161E] data-[state=checked]:text-white"
                disabled={!canEditCorrespondenceAddress}
                iconClassName="size-[10px]"
                onCheckedChange={(checked) => {
                  onSameAsPermanentChange?.(Boolean(checked));
                }}
              />
              <span className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#435160]">
                Same as permanent address
              </span>
            </label>
          ) : null}
        </div>

        <div aria-hidden="true" className="hidden lg:block" />
      </div>
    </section>
  );
};

export default AddressSection;
