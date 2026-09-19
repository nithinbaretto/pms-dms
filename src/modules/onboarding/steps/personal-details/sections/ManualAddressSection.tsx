import type { ReactElement } from "react";

import editIcon from "../../../../../assets/icons/edit_icon.png";
import { Checkbox } from "../../../../../shared/ui/checkbox";
import { cn } from "../../../../../shared/ui/utils";
import { hasAddressValue } from "../helpers";
import type { Address } from "../types";

type ManualAddressSectionProps = {
  permanentAddress: Address;
  correspondenceAddress: Address;
  onEditPermanentAddress: () => void;
  onEditCorrespondenceAddress: () => void;
  sameAsPermanent?: boolean;
  onSameAsPermanentChange?: (sameAsPermanent: boolean) => void;
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
      <div className="flex items-center justify-between">
        <label className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]" htmlFor={id}>
          {label} <span className="text-[#E8402F]">*</span>
        </label>
        {hasValue ? (
          <button
            className="inline-flex items-center gap-1 font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#93161E]"
            onClick={onEdit}
            type="button"
          >
            <img alt="" className="h-3 w-3" src={editIcon} /> Edit
          </button>
        ) : null}
      </div>
      <button
        className={cn(
          "w-full text-left font-['Mulish',sans-serif] text-[14px] font-normal tracking-normal",
          hasValue
            ? "flex min-h-[76px] items-center rounded-[10px] border border-[#E5E5E6] bg-transparent px-3 text-[13px] leading-[19.5px] text-[#5A6B7D]"
            : "flex h-9 items-center overflow-hidden rounded-[8px] border border-[#eeeeee] bg-white px-[14px] leading-none text-[#71859B]",
        )}
        id={id}
        onClick={onEdit}
        type="button"
      >
        <span className={hasValue ? "whitespace-pre-wrap break-words" : "block w-full truncate"}>
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
  sameAsPermanent = false,
  onSameAsPermanentChange,
}: ManualAddressSectionProps): ReactElement => {
  const canCopyPermanentAddress = hasAddressValue(permanentAddress);

  return (
    <section className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      <AddressDisplayField
        address={permanentAddress}
        id="manual-permanent-address"
        label="Permanent Address"
        onEdit={onEditPermanentAddress}
        placeholder="Enter Permanent Address"
      />
      <div className="space-y-2">
        <AddressDisplayField
          address={correspondenceAddress}
          id="manual-correspondence-address"
          label="Correspondence Address"
          onEdit={onEditCorrespondenceAddress}
          placeholder="Enter Correspondence Address"
        />
        <label
          className={cn(
            "flex items-center gap-2",
            canCopyPermanentAddress ? "cursor-pointer" : "cursor-not-allowed opacity-50",
          )}
        >
          <Checkbox
            checked={canCopyPermanentAddress && sameAsPermanent}
            className="border-[#eeeeee] data-[state=checked]:border-[#93161E] data-[state=checked]:bg-[#93161E] data-[state=checked]:text-white"
            disabled={!canCopyPermanentAddress}
            iconClassName="size-[10px]"
            onCheckedChange={(checked) => {
              if (!canCopyPermanentAddress) {
                return;
              }

              onSameAsPermanentChange?.(Boolean(checked));
            }}
          />
          <span className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#435160]">
            Same as permanent address
          </span>
        </label>
      </div>
      <div aria-hidden="true" className="hidden lg:block" />
    </section>
  );
};

export default ManualAddressSection;
