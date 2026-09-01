import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  ChevronDown,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";

import documentIcon from "../../../../../assets/icons/document.png";
import uploadFileIcon from "../../../../../assets/icons/svg/upload_file.svg";
import gstGuideline1 from "../../../../../assets/images/guidlines_img_1.png";
import gstGuideline2 from "../../../../../assets/images/guidlines_img_2.png";
import gstGuideline3 from "../../../../../assets/images/guidlines_img_3.png";
import gstGuideline4 from "../../../../../assets/images/guidlines_img_4.png";
import { Button } from "../../../../../shared/ui/button";
import { Dialog, DialogContent, DialogTitle } from "../../../../../shared/ui/dialog";
import { Input } from "../../../../../shared/ui/input";
import { MAX_GST_CERTIFICATE_BYTES } from "../constants";
import { abbreviateStateName, formatStateLabel } from "../helpers";
import type { ManualGstDraft, ValidateGstResult } from "../types";
import { formatGstName, isDuplicateGstNumber, isValidGstNumber } from "../validation";
import CameraCaptureModal from "../../../components/CameraCaptureModal";
import UploadImageGuidelines from "../../../components/UploadImageGuidelines";

const GST_GUIDELINE_ITEMS = [
  { src: gstGuideline4, label: "Clear & Complete", good: true },
  { src: gstGuideline3, label: "Blurry / Out of focus", good: false },
  { src: gstGuideline2, label: "Half cut / Incomplete", good: false },
  { src: gstGuideline1, label: "Poor lighting / Glare", good: false },
];

type GstModalView = "fetch" | "manual" | "list";

type AddGstModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isValidatingGst: boolean;
  isUploading: boolean;
  stateOptions: string[];
  existingGstNumbers?: string[];
  onValidateGst: (gstInNumber: string) => Promise<ValidateGstResult | null>;
  onUploadFile: (file: File) => Promise<string | null>;
  onSave: (drafts: ManualGstDraft[]) => void;
};

const emptyDraft = (): ManualGstDraft => ({
  gstNumber: "",
  stateCode: "",
  legalName: "",
  fileURL: "",
  registrationStatus: "Unregistered",
  requiresCertificate: false,
});

const toCompletedDraft = (draft: ManualGstDraft): ManualGstDraft => ({
  ...draft,
  gstNumber: draft.gstNumber.trim().toUpperCase(),
  legalName: formatGstName(draft.legalName),
  registrationStatus: "Registered",
  requiresCertificate: draft.requiresCertificate,
});

const AddGstModal = ({
  open,
  onOpenChange,
  isValidatingGst,
  isUploading,
  stateOptions,
  existingGstNumbers = [],
  onValidateGst,
  onUploadFile,
  onSave,
}: AddGstModalProps): ReactElement => {
  const [view, setView] = useState<GstModalView>("fetch");
  const [isAddingAnother, setIsAddingAnother] = useState(false);
  const [draft, setDraft] = useState<ManualGstDraft>(emptyDraft);
  const [pendingDrafts, setPendingDrafts] = useState<ManualGstDraft[]>([]);
  const [formatError, setFormatError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<{
    name: string;
    type: string;
    previewUrl: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setView("fetch");
    setIsAddingAnother(false);
    setDraft(emptyDraft());
    setPendingDrafts([]);
    setFormatError(null);
    setFileError(null);
    setLocalPreview(null);
    setShowCamera(false);
  }, [open]);

  useEffect(() => {
    return () => {
      if (localPreview?.previewUrl) {
        URL.revokeObjectURL(localPreview.previewUrl);
      }
    };
  }, [localPreview]);

  const knownGstNumbers = [
    ...existingGstNumbers,
    ...pendingDrafts.map((item) => item.gstNumber),
  ];

  const resetCurrentDraft = (): void => {
    if (localPreview?.previewUrl) {
      URL.revokeObjectURL(localPreview.previewUrl);
    }
    setLocalPreview(null);
    setDraft(emptyDraft());
    setFormatError(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearPreview = (): void => {
    if (localPreview?.previewUrl) {
      URL.revokeObjectURL(localPreview.previewUrl);
    }
    setLocalPreview(null);
    setDraft((current) => ({ ...current, fileURL: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addDraftToPending = (next: ManualGstDraft): void => {
    setPendingDrafts((current) => [...current, toCompletedDraft(next)]);
    resetCurrentDraft();
    setIsAddingAnother(false);
    setView("list");
  };

  const handleFetch = async (): Promise<void> => {
    const gstNumber = draft.gstNumber.trim().toUpperCase();

    if (isDuplicateGstNumber(gstNumber, knownGstNumbers)) {
      setFormatError("This GST number is already added");
      return;
    }

    if (!isValidGstNumber(gstNumber)) {
      setFormatError("Invalid GST Format");
      return;
    }

    setFormatError(null);
    const result = await onValidateGst(gstNumber);

    if (result?.isMatchFound) {
      addDraftToPending({
        gstNumber: result.gstInId || gstNumber,
        legalName: formatGstName(result.legalName),
        stateCode: result.state,
        fileURL: "",
        registrationStatus: "Registered",
        requiresCertificate: false,
      });
      return;
    }

    if (pendingDrafts.length > 0) {
      setIsAddingAnother(true);
      setView("list");
    } else {
      setView("manual");
    }
    setFormatError("Something went wrong. Enter details manually");
    setDraft((current) => ({
      ...current,
      gstNumber,
      legalName: "",
      stateCode: "",
      registrationStatus: "Registered",
      requiresCertificate: true,
    }));
  };

  const processSelectedFile = async (selectedFile: File): Promise<void> => {
    setFileError(null);

    if (selectedFile.size > MAX_GST_CERTIFICATE_BYTES) {
      setFileError("File must be PNG, JPEG or PDF up to 2MB");
      return;
    }

    if (localPreview?.previewUrl) {
      URL.revokeObjectURL(localPreview.previewUrl);
    }

    setLocalPreview({
      name: selectedFile.name,
      type: selectedFile.type,
      previewUrl: URL.createObjectURL(selectedFile),
    });

    const fileURL = await onUploadFile(selectedFile);
    if (!fileURL) {
      clearPreview();
      setFileError("Document upload failed. Please retry.");
      return;
    }

    setFileError(null);
    setDraft((current) => ({ ...current, fileURL }));
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    await processSelectedFile(selectedFile);
    event.target.value = "";
  };

  const handleCameraSave = async (file: File): Promise<void> => {
    await processSelectedFile(file);
    setShowCamera(false);
  };

  const isDuplicate = isDuplicateGstNumber(draft.gstNumber, knownGstNumbers);
  const canContinue =
    Boolean(draft.legalName.trim()) &&
    Boolean(draft.stateCode.trim()) &&
    isValidGstNumber(draft.gstNumber) &&
    !isDuplicate &&
    (!draft.requiresCertificate || Boolean(draft.fileURL.trim()));
  const canFetch = draft.gstNumber.trim().length === 15 && !isDuplicate;
  const gstNumberLocked = draft.requiresCertificate || isValidatingGst;

  const gstNumberField = (
    <div className="space-y-1">
      <label className="font-['Mulish',sans-serif] text-[12px] font-normal leading-[100%] tracking-[0px] text-[#231F20]">
        GST Number <span className="text-[#E8402F]">*</span>
      </label>
      <div className={`flex h-[38px] overflow-hidden rounded-[8px] bg-white ${formatError ? "border border-[#d8787d]" : "border border-[#e5e5e6]"
        }`}>
        <Input
          className="h-full flex-1 rounded-none border-0 bg-transparent px-3 uppercase shadow-none focus-visible:border-transparent focus-visible:ring-0 disabled:bg-transparent"
          disabled={gstNumberLocked}
          onChange={(event) => {
            const nextGst = event.target.value.toUpperCase();
            setDraft((current) => ({
              ...current,
              gstNumber: nextGst,
            }));
            if (isDuplicateGstNumber(nextGst, knownGstNumbers)) {
              setFormatError("This GST number is already added");
              return;
            }
            setFormatError(null);
          }}
          maxLength={15}
          placeholder="Enter GSTIN"
          value={draft.gstNumber}
        />
        <button
          className="m-[5px] inline-flex h-[28px] items-center justify-center gap-1 rounded-[4px] bg-[#aa1722] px-3 text-[12px] leading-[18px] text-white disabled:bg-[#dce2ea] disabled:text-[#7a8796]"
          disabled={!canFetch || isValidatingGst || draft.requiresCertificate}
          onClick={() => {
            void handleFetch();
          }}
          type="button"
        >
          {isValidatingGst ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Fetching...
            </>
          ) : (
            "Fetch"
          )}
        </button>
      </div>
      {formatError ? (
        <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-[100%] tracking-[0px] text-[#E8402F]">
          {formatError}
        </p>
      ) : null}
    </div>
  );

  const isSideBySideFields = isAddingAnother;
  const fieldColClass = isSideBySideFields
    ? "min-w-0 w-1/2 space-y-1"
    : "w-full space-y-1";
  const manualDetailsFields = (
    <>
      <div className="flex flex-col gap-3">
        <div
          className={
            isSideBySideFields ? "flex w-full flex-nowrap gap-3" : "contents"
          }
        >
        <div className={fieldColClass}>
          <label className="font-['Mulish',sans-serif] text-[12px] font-normal leading-[100%] tracking-[0px] text-[#231F20]">
            State <span className="text-[#E8402F]">*</span>
          </label>
          <div className="relative">
            <select
              className="h-[38px] w-full appearance-none rounded-[8px] border border-[#e5e5e6] bg-white px-3 pr-9 text-[13px] text-[#231f20] outline-none"
              onChange={(event) => {
                setDraft((current) => ({
                  ...current,
                  stateCode: event.target.value,
                }));
              }}
              value={draft.stateCode}
            >
              <option value="">Select state</option>
              {stateOptions.map((state) => (
                <option key={state} value={state}>
                  {formatStateLabel(state)}
                </option>
              ))}
              {draft.stateCode &&
                !stateOptions.some(
                  (state) => state.toLowerCase() === draft.stateCode.toLowerCase(),
                ) ? (
                <option value={draft.stateCode}>
                  {formatStateLabel(draft.stateCode)}
                </option>
              ) : null}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ca1b5]" />
          </div>
        </div>

        <div className={fieldColClass}>
          <label className="font-['Mulish',sans-serif] text-[12px] font-normal leading-[100%] tracking-[0px] text-[#231F20]">
            Legal Name <span className="text-[#E8402F]">*</span>
          </label>
          <Input
            className="h-[38px] min-w-0 w-full bg-white disabled:bg-white [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#ffffff]"
            onChange={(event) => {
              setDraft((current) => ({
                ...current,
                legalName: event.target.value,
              }));
            }}
            value={draft.legalName}
          />
        </div>
      </div>

      {draft.requiresCertificate ? (
        <>
          <div className="space-y-2">
            <label className="font-['Mulish',sans-serif] text-[12px] font-normal leading-[100%] tracking-[0px] text-[#231F20]">
              Upload GST Certificate <span className="text-[#E8402F]">*</span>
            </label>

            <input
              accept=".png,.jpg,.jpeg,.pdf"
              className="hidden"
              onChange={(event) => {
                void handleFileChange(event);
              }}
              ref={fileInputRef}
              type="file"
            />

            <div
              className={`rounded-[8px] border-2 border-dotted bg-[#f9f9f9] p-4 ${
                fileError ? "border-[#d8787d]" : "border-[#EEEEEE]"
              }`}
            >
              {draft.fileURL && localPreview ? (
                <div className="relative mx-auto h-[220px] max-w-[420px] rounded-[4px] bg-white p-2">
                  {localPreview.type === "application/pdf" ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-[#71859B]">
                      <FileText className="h-9 w-9 text-[#71859B]" />
                      <p className="max-w-[280px] truncate text-[13px]">
                        {localPreview.name}
                      </p>
                    </div>
                  ) : (
                    <img
                      alt="GST certificate preview"
                      className="h-full w-full rounded-[2px] object-contain"
                      src={localPreview.previewUrl}
                    />
                  )}
                  <button
                    className="absolute right-2 top-2 text-[#71859B]"
                    onClick={clearPreview}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <img alt="" className="size-6" src={uploadFileIcon} />
                  <p className="text-center font-['Mulish',sans-serif] text-[14px] font-normal leading-[100%] tracking-[0px] text-[#71859B]">
                    {isUploading
                      ? "Uploading..."
                      : "Format Supported: PNG, PDF or JPEG up to 2MB"}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#EEEEEE] bg-white px-[21px] font-['Mulish',sans-serif] text-[14px] font-normal text-[#435160] hover:border-[#c7aa7b] disabled:opacity-60"
                      disabled={isUploading}
                      onClick={() => {
                        setShowCamera(true);
                      }}
                      type="button"
                    >
                      <Camera className="size-4" strokeWidth={1.75} />
                      Capture
                    </button>
                    <button
                      className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#93161E] px-[21px] font-['Mulish',sans-serif] text-[14px] font-normal text-white hover:bg-[#7a1319] disabled:opacity-60"
                      disabled={isUploading}
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
            {fileError ? (
              <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-[100%] tracking-[0px] text-[#E8402F]">
                {fileError}
              </p>
            ) : null}
          </div>
        </>
      ) : null}
      </div>

      {draft.requiresCertificate ? (
        <UploadImageGuidelines items={GST_GUIDELINE_ITEMS} layout="row" />
      ) : null}

      <Button
        className={`h-[42px] w-full rounded-[8px] text-[14px] leading-[21px] ${canContinue || isUploading
          ? "bg-[#aa1722] text-white hover:bg-[#93161e]"
          : "bg-[#d9d9d9] text-[#71859b] hover:bg-[#d9d9d9]"
          }`}
        disabled={!canContinue || isUploading}
        onClick={() => {
          addDraftToPending(draft);
        }}
        type="button"
      >
        {isUploading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </>
  );

  return (
    <>
      <Dialog
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !showCamera) {
            onOpenChange(nextOpen);
          }
        }}
        open={open && !showCamera}
      >
        <DialogContent className="h-auto max-h-[min(784px,calc(100vh-48px))] w-[calc(100%-2rem)] max-w-[589px] gap-0 overflow-y-auto rounded-[16px] border-0 bg-white p-0 shadow-[0px_24px_60px_rgba(0,0,0,0.2)] sm:w-[589px] sm:max-w-[589px]">
          <div className="p-6">
            <div className="mb-4">
              <DialogTitle className="pr-8 font-['Mulish',sans-serif] text-[22px] font-medium leading-[100%] tracking-[0px] !text-[#435160]">
                Add GST
              </DialogTitle>
            </div>
            {view === "list" ? (
              <div className="space-y-5">
                <div className="space-y-3">
                  {pendingDrafts.map((item) => {
                    const stateAbbrev = abbreviateStateName(item.stateCode);
                    return (
                      <div
                        className="flex items-start rounded-[8px] border border-[#93161E] bg-[#FFF6F6] px-4 py-3"
                        key={item.gstNumber}
                      >
                        <span className="mt-0.5 mr-2 flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[3.5px] bg-[#93161E]">
                          <Check className="h-[9px] w-[9px] text-white" strokeWidth={3} />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <p className="truncate font-['Mulish',sans-serif] text-[14px] font-medium leading-[100%] tracking-[0px] text-[#231F20]">
                            {item.gstNumber}
                            {stateAbbrev ? ` | ${stateAbbrev}` : ""}
                          </p>
                          <p className="truncate font-['Mulish',sans-serif] text-[12px] font-normal leading-[100%] tracking-[0px] text-[#71859B]">
                            {item.legalName || "—"}
                          </p>
                        </div>
                        <div className="ml-3 flex shrink-0 items-center gap-2 self-center">
                          {item.requiresCertificate ? (
                            <img alt="" className="h-[11px] w-[11px]" src={documentIcon} />
                          ) : null}
                          <button
                            aria-label="Remove GST"
                            className="flex items-center justify-center text-[#93161E] hover:opacity-70"
                            onClick={() => {
                              const next = pendingDrafts.filter(
                                (entry) => entry.gstNumber !== item.gstNumber,
                              );
                              setPendingDrafts(next);
                              if (next.length === 0) {
                                setIsAddingAnother(false);
                                setView("fetch");
                              }
                            }}
                            type="button"
                          >
                            <Trash2 className="h-[13px] w-[12px]" strokeWidth={1.75} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isAddingAnother ? (
                  <>
                    <div className="h-px bg-[#EEEEEE]" />
                    <div className="w-1/2">{gstNumberField}</div>
                    {draft.requiresCertificate ? (
                      manualDetailsFields
                    ) : (
                      <Button
                        className="h-[42px] w-full rounded-[8px] bg-[#d9d9d9] text-[14px] leading-[21px] text-[#71859b] hover:bg-[#d9d9d9]"
                        disabled
                        type="button"
                      >
                        Save & Update
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="flex gap-3">
                    <button
                      className="h-[42px] flex-1 rounded-[8px] border border-[#EEEEEE] bg-white font-['Mulish',sans-serif] text-[14px] font-normal text-[#71859B]"
                      onClick={() => {
                        resetCurrentDraft();
                        setIsAddingAnother(true);
                      }}
                      type="button"
                    >
                      + Add Another GST
                    </button>
                    <Button
                      className="h-[42px] flex-1 rounded-[8px] bg-[#93161E] text-[14px] text-white hover:bg-[#7a1319]"
                      onClick={() => {
                        onSave(pendingDrafts);
                      }}
                      type="button"
                    >
                      Save & Update
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {gstNumberField}

                {view === "manual" ? (
                  manualDetailsFields
                ) : (
                  <Button
                    className="h-[42px] w-full rounded-[8px] bg-[#d9d9d9] text-[14px] leading-[21px] text-[#71859b] hover:bg-[#d9d9d9]"
                    disabled
                    type="button"
                  >
                    Save & Update
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {showCamera ? (
        <CameraCaptureModal
          title="Capture GST Certificate"
          onCancel={() => setShowCamera(false)}
          onSave={handleCameraSave}
        />
      ) : null}
    </>
  );
};

export default AddGstModal;
