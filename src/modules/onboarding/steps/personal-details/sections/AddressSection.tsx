import type { ReactElement } from "react";

import editIcon from "../../../../../assets/icons/edit_icon.png";
import type { Address } from "../types";

type AddressSectionProps = {
  permanentAddress: Address;
  correspondenceAddress: Address;
  canEditCorrespondenceAddress?: boolean;
  onEditCorrespondenceAddress: () => void;
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
}: AddressSectionProps): ReactElement => {
  return (
    <section className="space-y-3 border-t border-[#e6e7e8] pt-6">
      <div className="grid w-full max-w-[860px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
        <div className="flex flex-col gap-2">
          <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]">
            Permanent Address <span className="text-[#E8402F]">*</span>
          </p>
          <div className="min-h-[76px] rounded-[10px] border border-[#E5E5E6] bg-[#F5F5F5] p-3 font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#231F20]">
            {formatAddress(permanentAddress)}
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
              title={
                canEditCorrespondenceAddress
                  ? undefined
                  : "Verify mobile number and email to edit address"
              }
              type="button"
            >
              <img alt="" className="h-3 w-3" src={editIcon} /> Edit
            </button>
          </div>
          <div className="min-h-[76px] rounded-[10px] border border-[#E5E5E6] bg-[#F5F5F5] p-3 font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#231F20]">
            {formatAddress(correspondenceAddress)}
          </div>
          {!canEditCorrespondenceAddress ? (
            <p className="font-['Mulish',sans-serif] text-[11px] font-normal leading-[16px] tracking-normal text-[#71859B]">
              Verify your mobile number and email to edit address
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default AddressSection;
