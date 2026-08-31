import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { Camera, Upload, X } from "lucide-react";

import imgSignGuideline1 from "../../../../../assets/images/sign_guidelines_1.png";
import imgSignGuideline2 from "../../../../../assets/images/sign_guidelines_2.png";
import imgSignGuideline3 from "../../../../../assets/images/sign_guidelines_3.png";
import imgSignGuideline4 from "../../../../../assets/images/sign_guidelines_4.png";
import trashIcon from "../../../../../assets/icons/svg/trash_icon.svg";
import { Dialog, DialogContent } from "../../../../../shared/ui/dialog";
import CameraCaptureModal from "../../../components/CameraCaptureModal";
import UploadImageGuidelines from "../../../components/UploadImageGuidelines";
import { SIGNATORY_ALLOWED_FILE_TYPES, SIGNATORY_MAX_FILE_SIZE_BYTES } from "../signatory/constants";
import type { SignatoryDocumentFile, SignatoryDocumentKind } from "../signatory/types";

type UploadSignatoryDocumentModalProps = {
  open: boolean;
  kind: SignatoryDocumentKind;
  onClose: () => void;
  onSave: (file: SignatoryDocumentFile) => void;
};

const TITLES: Record<SignatoryDocumentKind, string> = {
  identity: "Upload Proof of Identity",
  address: "Upload Proof of Address",
  signature: "Upload Specimen Signature",
};

const SignatureGuidelines = (): ReactElement => {
  const items = [
    { src: imgSignGuideline1, label: "Clear & Complete", good: true },
    { src: imgSignGuideline2, label: "Half cut / Incomplete", good: false },
    { src: imgSignGuideline3, label: "Blurry / Out of focus", good: false },
    { src: imgSignGuideline4, label: "Poor lighting / Glare", good: false },
  ];

  return (
    <div className="flex w-full flex-col gap-[11px]">
      <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-[18px] text-[#231F20]">
        Upload image guidelines
      </p>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            className={`relative flex flex-col items-center justify-center gap-2 rounded-[8px] px-2 py-3 ${
              item.good ? "bg-[#eeffe5]" : "bg-[#fff0e5]"
            }`}
            key={item.label}
          >
            <img
              alt={item.label}
              className="h-[72px] w-full max-w-[188px] object-contain"
              src={item.src}
            />
            <p
              className={`font-['Mulish',sans-serif] text-[9px] font-normal leading-[1.1] ${
                item.good ? "text-[#37b400]" : "text-[#e8402f]"
              }`}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const UploadSignatoryDocumentContent = ({
  kind,
  onClose,
  onSave,
}: Omit<UploadSignatoryDocumentModalProps, "open">): ReactElement => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState<SignatoryDocumentFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    return () => {
      if (draft?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(draft.previewUrl);
      }
    };
  }, [draft]);

  const processFile = (file: File): void => {
    const isAllowedType = SIGNATORY_ALLOWED_FILE_TYPES.includes(
      file.type as (typeof SIGNATORY_ALLOWED_FILE_TYPES)[number],
    );

    if (!isAllowedType) {
      setError("Format supported: PNG, PDF or JPEG up to 2MB.");
      return;
    }

    if (file.size > SIGNATORY_MAX_FILE_SIZE_BYTES) {
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
        open
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

            {!draft ? kind === "signature" ? <SignatureGuidelines /> : <UploadImageGuidelines /> : null}

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

const UploadSignatoryDocumentModal = ({
  open,
  kind,
  onClose,
  onSave,
}: UploadSignatoryDocumentModalProps): ReactElement => {
  if (!open) {
    return <></>;
  }

  return (
    <UploadSignatoryDocumentContent
      key={kind}
      kind={kind}
      onClose={onClose}
      onSave={onSave}
    />
  );
};

export default UploadSignatoryDocumentModal;
