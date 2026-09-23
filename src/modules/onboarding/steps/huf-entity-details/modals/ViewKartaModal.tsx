import type { ReactElement } from "react";
import { X } from "lucide-react";

import { Dialog, DialogContent } from "../../../../../shared/ui/dialog";
import KartaDetailsPreviewCard from "../components/KartaDetailsPreviewCard";
import type { KartaDetails } from "../types";

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
          <div className="flex flex-col gap-[3px] pr-8">
            <h2 className="font-['Mulish',sans-serif] text-[22px] font-medium leading-[100%] tracking-[0px] text-[#435160]">
              View Karta Details
            </h2>
            <p className="font-['Mulish',sans-serif] text-[16px] font-medium leading-6 tracking-normal text-[#71859B]">
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

          <KartaDetailsPreviewCard karta={karta} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewKartaModal;
