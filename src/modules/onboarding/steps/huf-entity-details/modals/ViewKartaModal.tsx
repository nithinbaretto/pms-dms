import type { ReactElement } from "react";
import { X } from "lucide-react";

import { Dialog, DialogContent } from "../../../../../shared/ui/dialog";
import { formatAddressLine, formatMobileDisplay } from "../helpers";
import type { KartaDetails } from "../types";
import KartaPersonAvatar from "../components/KartaPersonAvatar";

type ViewKartaModalProps = {
  open: boolean;
  karta: KartaDetails | null;
  onClose: () => void;
};

const ViewKartaModal = ({ open, karta, onClose }: ViewKartaModalProps): ReactElement => {
  if (!karta) {
    return <></>;
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      open={open}
    >
      <DialogContent className="max-h-[calc(100vh-48px)] w-[calc(100%-2rem)] max-w-[640px] overflow-y-auto rounded-[16px] border-0 p-0 shadow-[0px_24px_60px_rgba(0,0,0,0.2)] [&>button.absolute]:hidden">
        <div className="relative space-y-5 bg-white p-6">
          <div className="pr-8">
            <h2 className="font-['Mulish',sans-serif] text-[22px] font-medium leading-none tracking-normal text-[#435160]">
              View Karta Details
            </h2>
            <p className="mt-2 font-['Mulish',sans-serif] text-[15px] font-medium leading-[22.5px] tracking-normal text-[#435160]">
              View your karta details
            </p>
          </div>
          <button
            aria-label="Close"
            className="absolute right-6 top-6 flex size-6 items-center justify-center text-[#435160] hover:opacity-70"
            onClick={onClose}
            type="button"
          >
            <X className="size-6" strokeWidth={1.5} />
          </button>

          <div className="overflow-hidden rounded-[8px] border border-[#93161E]">
            <div className="flex items-center gap-3 bg-[#FFF4F4] px-4 py-3">
              <KartaPersonAvatar />
              <div>
                <p className="font-['Mulish',sans-serif] text-[16px] font-medium leading-6 tracking-normal text-[#231F20]">
                  {karta.name}
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
                <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#71859B]">
                  Correspondent Address
                </p>
                <p className="mt-1 font-['Mulish',sans-serif] text-[14px] font-normal leading-[21px] text-[#435160]">
                  {formatAddressLine(karta.correspondenceAddress)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewKartaModal;
