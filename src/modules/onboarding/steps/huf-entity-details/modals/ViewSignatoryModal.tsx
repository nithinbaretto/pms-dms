import type { ReactElement } from "react";
import { CheckCircle2, X } from "lucide-react";

import identityIcon from "../../../../../assets/icons/svg/identity.svg";
import { Dialog, DialogContent } from "../../../../../shared/ui/dialog";
import KartaPersonAvatar from "../components/KartaPersonAvatar";
import { formatMobileDisplay } from "../helpers";
import type { KartaDocumentFile, SignatoryDetails } from "../types";

type ViewSignatoryModalProps = {
  open: boolean;
  signatory: SignatoryDetails | null;
  onClose: () => void;
};

const roleLabel = (source: SignatoryDetails["source"]): string | null => {
  if (source === "karta") {
    return "Karta";
  }
  if (source === "coparcener") {
    return "Co-Parcener";
  }
  return null;
};

const EyeIcon = (): ReactElement => (
  <svg aria-hidden className="size-4 shrink-0" fill="none" viewBox="0 0 15 10">
    <path
      d="M7.5 0C4.375 0 1.6875 1.9375 0.625 4.75C1.6875 7.5625 4.375 9.5 7.5 9.5C10.625 9.5 13.3125 7.5625 14.375 4.75C13.3125 1.9375 10.625 0 7.5 0ZM7.5 8C5.84375 8 4.5 6.65625 4.5 5C4.5 3.34375 5.84375 2 7.5 2C9.15625 2 10.5 3.34375 10.5 5C10.5 6.65625 9.15625 8 7.5 8ZM7.5 3.25C6.53125 3.25 5.75 4.03125 5.75 5C5.75 5.96875 6.53125 6.75 7.5 6.75C8.46875 6.75 9.25 5.96875 9.25 5C9.25 4.03125 8.46875 3.25 7.5 3.25Z"
      fill="#5A6B7D"
    />
  </svg>
);

const DocumentViewRow = ({
  title,
  file,
}: {
  title: string;
  file: KartaDocumentFile | null;
}): ReactElement | null => {
  if (!file) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 rounded-[8px] border border-[#EEEEEE] bg-white px-3 py-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-[4px] bg-[#FFFAF6]">
        <img alt="" className="h-[13px] w-[11px]" src={identityIcon} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none text-[#231F20]">
          {title}
        </p>
        <p className="mt-1 inline-flex items-center gap-1 font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#37b400]">
          <CheckCircle2 className="size-3.5" />
          1 File(s) Uploaded
        </p>
      </div>
      <button
        aria-label={`View ${title}`}
        className="flex size-4 shrink-0 items-center justify-center hover:opacity-70"
        onClick={() => {
          window.open(file.previewUrl, "_blank", "noopener,noreferrer");
        }}
        type="button"
      >
        <EyeIcon />
      </button>
    </div>
  );
};

const ViewSignatoryModal = ({ open, signatory, onClose }: ViewSignatoryModalProps): ReactElement => {
  if (!signatory) {
    return <></>;
  }

  const role = roleLabel(signatory.source);

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
            <h2 className="font-['Mulish',sans-serif] text-[20px] font-medium leading-none tracking-normal text-[#435160] md:text-[22px]">
              View Authorised Signatory
            </h2>
            <p className="mt-2 font-['Mulish',sans-serif] text-[14px] font-medium leading-[21px] tracking-normal text-[#71859B] md:text-[16px] md:leading-6">
              View signatory details
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
              <div className="min-w-0 flex-1">
                <p className="font-['Mulish',sans-serif] text-[16px] font-medium leading-6 text-[#231F20]">
                  {signatory.name}
                </p>
                <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none text-[#5A6B7D]">
                  PAN: {signatory.pan}
                </p>
              </div>
              {role ? (
                <span
                  className={`rounded-full px-2 py-0.5 font-['Mulish',sans-serif] text-[11px] font-medium ${
                    signatory.source === "karta"
                      ? "bg-[#FBF3E0] text-[#C08B2E]"
                      : "bg-[#E8F1FF] text-[#2F6FED]"
                  }`}
                >
                  {role}
                </span>
              ) : null}
            </div>
            <div className="grid grid-cols-1 gap-4 bg-white px-4 py-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="font-['Mulish',sans-serif] text-[12px] font-normal text-[#71859B]">Mobile</p>
                <p className="font-['Mulish',sans-serif] text-[14px] font-normal text-[#435160]">
                  {formatMobileDisplay(signatory.mobile)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-['Mulish',sans-serif] text-[12px] font-normal text-[#71859B]">Email</p>
                <p className="break-all font-['Mulish',sans-serif] text-[14px] font-normal text-[#435160]">
                  {signatory.email}
                </p>
              </div>
            </div>
          </div>

          {signatory.identityDocument || signatory.addressDocument || signatory.signatureDocument ? (
            <div className="space-y-2">
              <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none text-[#231F20]">
                Uploaded Documents
              </p>
              <DocumentViewRow file={signatory.identityDocument} title="Proof of Identity" />
              <DocumentViewRow file={signatory.addressDocument} title="Proof of Address" />
              <DocumentViewRow file={signatory.signatureDocument} title="Specimen Signature" />
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSignatoryModal;
