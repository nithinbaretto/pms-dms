import type { ReactElement } from "react";
import { Pencil } from "lucide-react";

import type { Address } from "../types";

type AddressSectionProps = {
  permanentAddress: Address;
  correspondenceAddress: Address;
  onEditCorrespondenceAddress: () => void;
};

const formatAddress = (address: Address): string => {
  return `${address.addressLine}, ${address.city}, ${address.state} ${address.pincode}`;
};

const AddressSection = ({
  permanentAddress,
  correspondenceAddress,
  onEditCorrespondenceAddress,
}: AddressSectionProps): ReactElement => {
  return (
    <section className="space-y-3 border-t border-[#e6e7e8] pt-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
        <div className="space-y-1">
          <p className="text-xs text-[#231f20]">Permanent Address *</p>
          <div className="min-h-[76px] rounded-[10px] border border-[#efefef] bg-[#f5f5f5] p-3 text-[13px] leading-[19px] text-[#5a6b7d]">
            {formatAddress(permanentAddress)}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#231f20]">Correspondence Address *</p>
            <button
              className="inline-flex items-center gap-1 text-xs text-[var(--color-onboarding-primary)]"
              onClick={onEditCorrespondenceAddress}
              type="button"
            >
              <Pencil className="h-3 w-3" /> Edit
            </button>
          </div>
          <div className="min-h-[76px] rounded-[10px] border border-[#efefef] bg-[#f5f5f5] p-3 text-[13px] leading-[19px] text-[#5a6b7d]">
            {formatAddress(correspondenceAddress)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddressSection;
