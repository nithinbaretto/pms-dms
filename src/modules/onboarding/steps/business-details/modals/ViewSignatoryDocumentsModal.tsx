import type { ReactElement } from "react";
import { X } from "lucide-react";

import { Dialog, DialogContent } from "../../../../../shared/ui/dialog";
import type { SignatoryDetails, SignatoryDocumentFile } from "../signatory/types";

type ViewSignatoryDocumentsModalProps = {
  open: boolean;
  signatory: SignatoryDetails | null;
  onClose: () => void;
};

const DocumentPreview = ({
  title,
  file,
}: {
  title: string;
  file: SignatoryDocumentFile | null;
}): ReactElement | null => {
  if (!file) {
    return null;
  }

  const isPdf = file.fileName.toLowerCase().endsWith(".pdf");

  return (
    <div className="space-y-2">
      <p className="font-['Mulish',sans-serif] text-[14px] font-medium leading-none text-[#231F20]">
        {title}
      </p>
      <div className="flex min-h-[140px] items-center justify-center rounded-[8px] border border-dashed border-[#EEEEEE] bg-white p-4">
        {isPdf ? (
          <p className="font-['Mulish',sans-serif] text-[14px] text-[#435160]">{file.fileName}</p>
        ) : (
          <img alt="" className="max-h-[180px] max-w-full object-contain" src={file.previewUrl} />
        )}
      </div>
    </div>
  );
};

const ViewSignatoryDocumentsModal = ({
  open,
  signatory,
  onClose,
}: ViewSignatoryDocumentsModalProps): ReactElement => {
  if (!signatory) {
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
            <h2 className="font-['Mulish',sans-serif] text-[20px] font-medium leading-none tracking-normal text-[#435160] md:text-[22px]">
              View Documents
            </h2>
          </div>
          <button
            aria-label="Close"
            className="absolute right-6 top-6 flex size-6 items-center justify-center text-[#435160] hover:opacity-70"
            onClick={onClose}
            type="button"
          >
            <X className="size-6" strokeWidth={1.5} />
          </button>

          <DocumentPreview file={signatory.identityDocument} title="Proof of Identity" />
          <DocumentPreview file={signatory.addressDocument} title="Proof of Address" />
          <DocumentPreview file={signatory.signatureDocument} title="Specimen Signature" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSignatoryDocumentsModal;
