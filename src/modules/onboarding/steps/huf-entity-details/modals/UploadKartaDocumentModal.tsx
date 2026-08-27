import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { Camera, Upload, X } from "lucide-react";

import trashIcon from "../../../../../assets/icons/svg/trash_icon.svg";
import { Dialog, DialogContent } from "../../../../../shared/ui/dialog";
import CameraCaptureModal from "../../../components/CameraCaptureModal";
import UploadImageGuidelines from "../../../components/UploadImageGuidelines";
import {
  KARTA_ALLOWED_FILE_TYPES,
  KARTA_MAX_FILE_SIZE_BYTES,
} from "../constants";
import type { KartaDocumentFile, KartaDocumentKind } from "../types";

type UploadKartaDocumentModalProps = {
  open: boolean;
  kind: KartaDocumentKind;
  onClose: () => void;
  onSave: (file: KartaDocumentFile) => void;
};

const TITLES: Record<KartaDocumentKind, string> = {
  identity: "Upload Proof of Identity",
  address: "Upload Proof of Address",
  signature: "Upload Specimen Signature",
};

const UploadKartaDocumentModal = ({
  open,
  kind,
  onClose,
  onSave,
}: UploadKartaDocumentModalProps): ReactElement => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState<KartaDocumentFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDraft(null);
    setError(null);
    setShowCamera(false);
  }, [open]);

  useEffect(() => {
    return () => {
      if (draft?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(draft.previewUrl);
      }
    };
  }, [draft]);

  const processFile = (file: File): void => {
    const isAllowedType = KARTA_ALLOWED_FILE_TYPES.includes(
      file.type as (typeof KARTA_ALLOWED_FILE_TYPES)[number],
    );

    if (!isAllowedType) {
      setError("Format supported: PNG, PDF or JPEG up to 2MB.");
      return;
    }

    if (file.size > KARTA_MAX_FILE_SIZE_BYTES) {
      setError("File must be 2MB or smaller.");
      return;
    }

    if (draft?.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(draft.previewUrl);
    }

    setError(null);
    setDraft({
      fileName: file.name,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    event.target.value = "";
  };

  return (
    <>
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
            <div className="flex items-start justify-between gap-4 pr-8">
              <h2 className="font-['Mulish',sans-serif] text-[22px] font-medium leading-none tracking-normal text-[#435160]">
                {TITLES[kind]}
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

            <input
              accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
              type="file"
            />

            <div className="relative rounded-[8px] border border-dashed border-[#EEEEEE] bg-white p-4">
              {draft ? (
                <>
                  <button
                    aria-label="Remove file"
                    className="absolute right-3 top-3 flex size-4 items-center justify-center hover:opacity-70"
                    onClick={() => {
                      if (draft.previewUrl.startsWith("blob:")) {
                        URL.revokeObjectURL(draft.previewUrl);
                      }
                      setDraft(null);
                    }}
                    type="button"
                  >
                    <img alt="" className="size-4" src={trashIcon} />
                  </button>
                  <div className="flex min-h-[160px] items-center justify-center">
                    {draft.fileName.toLowerCase().endsWith(".pdf") ? (
                      <p className="font-['Mulish',sans-serif] text-[14px] text-[#435160]">
                        {draft.fileName}
                      </p>
                    ) : (
                      <img
                        alt=""
                        className="max-h-[180px] max-w-full object-contain"
                        src={draft.previewUrl}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <Upload className="size-6 text-[#71859B]" strokeWidth={1.75} />
                  <p className="font-['Mulish',sans-serif] text-[13px] font-normal leading-[19.5px] text-[#71859B]">
                    Format Supported: PNG, PDF or JPEG up to 2MB
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#EEEEEE] bg-white px-[21px] font-['Mulish',sans-serif] text-[14px] font-normal text-[#435160]"
                      onClick={() => {
                        setShowCamera(true);
                      }}
                      type="button"
                    >
                      <Camera className="size-4" strokeWidth={1.75} />
                      Capture
                    </button>
                    <button
                      className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#93161E] px-[21px] font-['Mulish',sans-serif] text-[14px] font-normal text-white hover:bg-[#7a1319]"
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                      type="button"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              )}
            </div>

            {error ? (
              <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#E8402F]">
                {error}
              </p>
            ) : null}

            {!draft && kind !== "signature" ? <UploadImageGuidelines /> : null}

            <div className="grid grid-cols-2 gap-4">
              <button
                className="h-9 rounded-[8px] border border-[#EEEEEE] bg-white font-['Mulish',sans-serif] text-[14px] font-normal text-[#435160]"
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
              <button
                className={`h-9 rounded-[8px] font-['Mulish',sans-serif] text-[14px] font-normal ${
                  draft
                    ? "bg-[#93161E] text-white hover:bg-[#7a1319]"
                    : "cursor-not-allowed bg-[#E5E5E6] text-[#5A6B7D]"
                }`}
                disabled={!draft}
                onClick={() => {
                  if (!draft) {
                    return;
                  }
                  onSave(draft);
                }}
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showCamera ? (
        <CameraCaptureModal
          onCancel={() => {
            setShowCamera(false);
          }}
          onSave={(file) => {
            processFile(file);
            setShowCamera(false);
          }}
          title={TITLES[kind]}
        />
      ) : null}
    </>
  );
};

export default UploadKartaDocumentModal;
