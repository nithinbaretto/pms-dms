import type { ReactElement, ReactNode } from "react";
import { X } from "lucide-react";

import { Dialog, DialogContent } from "../../../shared/ui/dialog";

type DocumentUploadPickerModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  saveDisabled?: boolean;
  saveLabel?: string;
  isUploading?: boolean;
  error?: string | null;
  showGuidelines?: boolean;
  guidelines?: ReactNode;
  children: ReactNode;
};

/** Same shell as UploadSignatoryDocumentModal (640px, p-6, footer grid). */
const DocumentUploadPickerModal = ({
  open,
  title,
  onClose,
  onSave,
  saveDisabled = false,
  saveLabel = "Save",
  isUploading = false,
  error,
  showGuidelines = false,
  guidelines,
  children,
}: DocumentUploadPickerModalProps): ReactElement => {
  const saveInactive = saveDisabled || isUploading;

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      open={open}
    >
      <DialogContent className="hide-scrollbar max-h-[calc(100vh-48px)] w-[calc(100%-2rem)] max-w-[640px] overflow-y-auto rounded-[16px] border-0 p-0 shadow-[0px_24px_60px_rgba(0,0,0,0.2)] [&>button.absolute]:hidden">
        <div className="relative space-y-5 bg-white p-6">
          <div className="flex items-start justify-between gap-4 pr-8">
            <h2 className="font-['Mulish',sans-serif] text-[22px] font-medium leading-[100%] tracking-[0px] text-[#435160]">
              {title}
            </h2>
            <button
              aria-label="Close"
              className="absolute right-6 top-6 flex size-6 items-center justify-center text-[#435160] hover:opacity-70"
              onClick={onClose}
              type="button"
            >
              <X className="size-6" strokeWidth={1.5} />
            </button>
          </div>

          {children}

          {error ? (
            <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#E8402F]">
              {error}
            </p>
          ) : null}

          {showGuidelines ? guidelines : null}

          <div className="grid grid-cols-2 gap-4">
            <button
              className="h-9 rounded-[8px] border border-[#EEEEEE] bg-white font-['Mulish',sans-serif] text-[14px] font-normal text-[#435160] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isUploading}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className={`h-9 rounded-[8px] font-['Mulish',sans-serif] text-[14px] font-normal ${
                saveInactive
                  ? "cursor-not-allowed bg-[#E5E5E6] text-[#5A6B7D]"
                  : "bg-[#93161E] text-white hover:bg-[#7a1319]"
              }`}
              disabled={saveInactive}
              onClick={onSave}
              type="button"
            >
              {isUploading ? "Uploading..." : saveLabel}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadPickerModal;
