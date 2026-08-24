import type { ReactElement } from "react";

import { cn } from "../../../../../shared/ui/utils";
import type { Address } from "../types";

type ManualAddressSectionProps = {
  permanentAddress: Address;
  correspondenceAddress: Address;
  onEditPermanentAddress: () => void;
  onEditCorrespondenceAddress: () => void;
};

const formatSingleLineAddress = (address: Address): string => {
  const parts = [address.addressLine, address.city, address.state, address.pincode]
    .map((part) => part.trim())
    .filter(Boolean);

  if (!address.city.trim() && !address.state.trim() && !address.pincode.trim()) {
    return address.addressLine.trim();
  }

  return parts.join(", ");
};

const AddressDisplayField = ({
  id,
  label,
  placeholder,
  address,
  onEdit,
}: {
  id: string;
  label: string;
  placeholder: string;
  address: Address;
  onEdit: () => void;
}): ReactElement => {
  const value = formatSingleLineAddress(address);
  const hasValue = value.length > 0;

  return (
    <div className="space-y-1">
      <label className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]" htmlFor={id}>
        {label} <span className="text-[#E8402F]">*</span>
      </label>
      <button
        className={cn(
          "w-full text-left font-['Mulish',sans-serif] text-[14px] font-normal tracking-normal",
          hasValue
            ? "flex min-h-[76px] items-start rounded-[10px] border border-[#E5E5E6] bg-[#F5F5F5] p-3 leading-[21px] text-[#231F20]"
            : "flex h-9 items-center overflow-hidden rounded-[8px] border border-[#eeeeee] bg-white px-[14px] leading-none text-[#71859B]",
        )}
        id={id}
        onClick={onEdit}
        type="button"
      >
        <span className={hasValue ? "line-clamp-2 whitespace-pre-wrap break-words" : "block w-full truncate"}>
          {hasValue ? value : placeholder}
        </span>
      </button>
    </div>
  );
};

const ManualAddressSection = ({
  permanentAddress,
  correspondenceAddress,
  onEditPermanentAddress,
  onEditCorrespondenceAddress,
}: ManualAddressSectionProps): ReactElement => {
  return (
    <section className="grid w-full max-w-[860px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
      <AddressDisplayField
        address={permanentAddress}
        id="manual-permanent-address"
        label="Permanent Address"
        onEdit={onEditPermanentAddress}
        placeholder="Enter Permanent Address"
      />
      <AddressDisplayField
        address={correspondenceAddress}
        id="manual-correspondence-address"
        label="Correspondence Address"
        onEdit={onEditCorrespondenceAddress}
        placeholder="Enter Correspondence Address"
      />
    </section>
  );
};

export default ManualAddressSection;
