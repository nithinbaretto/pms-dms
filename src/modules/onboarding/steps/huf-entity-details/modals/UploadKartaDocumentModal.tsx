import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

import imgSignGuideline1 from "../../../../../assets/images/sign_guidelines_1.png";
import imgSignGuideline2 from "../../../../../assets/images/sign_guidelines_2.png";
import imgSignGuideline3 from "../../../../../assets/images/sign_guidelines_3.png";
import imgSignGuideline4 from "../../../../../assets/images/sign_guidelines_4.png";
import uploadFileIcon from "../../../../../assets/icons/svg/upload_file.svg";
import CameraCaptureModal from "../../../components/CameraCaptureModal";
import DocumentUploadPickerModal from "../../../components/DocumentUploadPickerModal";
import UploadImageGuidelines from "../../../components/UploadImageGuidelines";
import {
  KARTA_ALLOWED_FILE_TYPES,
  KARTA_FILE_ERROR_MESSAGE,
  KARTA_MAX_FILE_SIZE_BYTES,
} from "../constants";
import type { KartaDocumentFile, KartaDocumentKind } from "../types";

type UploadKartaDocumentModalProps = {
  open: boolean;
  kind: KartaDocumentKind;
  onClose: () => void;
  onSave: (file: KartaDocumentFile) => void;
  uploadFile?: (file: File) => Promise<KartaDocumentFile | null>;
  isUploading?: boolean;
};

const TITLES: Record<KartaDocumentKind, string> = {
  identity: "Upload Proof of Identity",
  address: "Upload Proof of Address",
  signature: "Upload Specimen Signature",
};

const SIGNATURE_GUIDELINE_ITEMS = [
  { src: imgSignGuideline1, label: "Clear & Complete", good: true },
  { src: imgSignGuideline2, label: "Half cut / Incomplete", good: false },
  { src: imgSignGuideline3, label: "Blurry / Out of focus", good: false },
  { src: imgSignGuideline4, label: "Poor lighting / Glare", good: false },
] as const;

const UploadKartaDocumentModal = ({
  open,
  kind,
  onClose,
  onSave,
  uploadFile,
  isUploading = false,
}: UploadKartaDocumentModalProps): ReactElement => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState<KartaDocumentFile | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDraft(null);
    setPendingFile(null);
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
    const mime = (file.type || "").trim().toLowerCase();
    const extension = file.name.split(".").pop()?.trim().toLowerCase() ?? "";
    const isAllowedType =
      KARTA_ALLOWED_FILE_TYPES.includes(mime as (typeof KARTA_ALLOWED_FILE_TYPES)[number]) ||
      mime === "image/jpg" ||
      ["png", "jpg", "jpeg", "pdf"].includes(extension);

    if (!isAllowedType || file.size > KARTA_MAX_FILE_SIZE_BYTES) {
      setError(KARTA_FILE_ERROR_MESSAGE);
      return;
    }

    if (draft?.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(draft.previewUrl);
    }

    setError(null);
    setPendingFile(file);
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

  const handleSave = (): void => {
    void (async () => {
      if (!draft) {
        return;
      }

      if (uploadFile && pendingFile) {
        const uploaded = await uploadFile(pendingFile);
        if (!uploaded) {
          return;
        }
        onSave(uploaded);
        return;
      }

      onSave(draft);
    })();
  };

  const guidelines =
    kind === "signature" ? (
      <UploadImageGuidelines items={[...SIGNATURE_GUIDELINE_ITEMS]} />
    ) : (
      <UploadImageGuidelines />
    );

  return (
    <>
      <DocumentUploadPickerModal
        error={error}
        isUploading={isUploading}
        onClose={onClose}
        onSave={handleSave}
        open={open}
        saveDisabled={!draft}
        showGuidelines={!draft}
        guidelines={guidelines}
        title={TITLES[kind]}
      >
        <input
          accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
          type="file"
        />

        <div
          className={`relative shrink-0 rounded-[8px] border-2 border-dotted bg-white p-4 ${
            error ? "border-[#d8787d]" : "border-[#EEEEEE]"
          }`}
        >
          {draft ? (
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
          ) : (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <img alt="" className="size-6" src={uploadFileIcon} />
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
      </DocumentUploadPickerModal>

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
