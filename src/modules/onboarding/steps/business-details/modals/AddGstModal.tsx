import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  ChevronDown,
  FileText,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "../../../../../shared/ui/button";
import { Dialog, DialogContent } from "../../../../../shared/ui/dialog";
import { Input } from "../../../../../shared/ui/input";
import { MAX_GST_CERTIFICATE_BYTES } from "../constants";
import { formatStateLabel } from "../helpers";
import type { ManualGstDraft, ValidateGstResult } from "../types";
import { formatGstName, isValidGstNumber } from "../validation";
import CameraCaptureModal from "../../../components/CameraCaptureModal";
import UploadImageGuidelines from "../../../components/UploadImageGuidelines";

type AddGstModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isValidatingGst: boolean;
  isUploading: boolean;
  stateOptions: string[];
  onValidateGst: (gstInNumber: string) => Promise<ValidateGstResult | null>;
  onUploadFile: (file: File) => Promise<string | null>;
  onSave: (draft: ManualGstDraft) => void;
};

const emptyDraft = (): ManualGstDraft => ({
  gstNumber: "",
  stateCode: "",
  legalName: "",
  fileURL: "",
  registrationStatus: "Unregistered",
  requiresCertificate: false,
});

const AddGstModal = ({
  open,
  onOpenChange,
  isValidatingGst,
  isUploading,
  stateOptions,
  onValidateGst,
  onUploadFile,
  onSave,
}: AddGstModalProps): ReactElement => {
  const [draft, setDraft] = useState<ManualGstDraft>(emptyDraft);
  const [formatError, setFormatError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [fieldsLocked, setFieldsLocked] = useState(false);
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

    setDraft(emptyDraft());
    setFormatError(null);
    setManualMode(false);
    setFieldsLocked(false);
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

  const handleFetch = async (): Promise<void> => {
    const gstNumber = draft.gstNumber.trim().toUpperCase();

    if (!gstNumber) {
      // Blank GST → Unregistered path (manual name/state + certificate).
      setManualMode(true);
      setFieldsLocked(false);
      setDraft((current) => ({
        ...current,
        gstNumber: "",
        registrationStatus: "Unregistered",
        requiresCertificate: true,
      }));
      setFormatError(null);
      return;
    }

    if (!isValidGstNumber(gstNumber)) {
      setFormatError("Invalid GST Format");
      setManualMode(false);
      setFieldsLocked(false);
      return;
    }

    setFormatError(null);
    const result = await onValidateGst(gstNumber);

    if (!result) {
      // Validate failed — enter details manually + certificate.
      setManualMode(true);
      setFieldsLocked(false);
      setDraft((current) => ({
        ...current,
        gstNumber,
        registrationStatus: "Registered",
        requiresCertificate: true,
      }));
      return;
    }

    if (result.isMatchFound) {
      // Validated from API — no certificate needed.
      if (localPreview?.previewUrl) {
        URL.revokeObjectURL(localPreview.previewUrl);
      }
      setLocalPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setManualMode(true);
      setFieldsLocked(true);
      setDraft((current) => ({
        ...current,
        gstNumber: result.gstInId || gstNumber,
        legalName: formatGstName(result.legalName),
        stateCode: result.state,
        fileURL: "",
        registrationStatus: "Registered",
        requiresCertificate: false,
      }));
      return;
    }

    // Not found — enter details manually + certificate.
    setManualMode(true);
    setFieldsLocked(false);
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
    if (selectedFile.size > MAX_GST_CERTIFICATE_BYTES) {
      setFormatError("File must be PNG, JPEG or PDF up to 2MB");
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
      setFormatError("Document upload failed. Please retry.");
      return;
    }

    setFormatError(null);
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

  const canSave =
    Boolean(draft.legalName.trim()) &&
    Boolean(draft.stateCode.trim()) &&
    (!draft.requiresCertificate || Boolean(draft.fileURL.trim())) &&
    (!draft.gstNumber.trim() || isValidGstNumber(draft.gstNumber));

  return (
    <>
    <Dialog
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
      }}
      open={open}
    >
      <DialogContent className="max-h-[calc(100vh-48px)] max-w-[860px] overflow-y-auto rounded-[16px] border-0 bg-[#f9f9f9] p-0 shadow-[0px_24px_60px_rgba(0,0,0,0.2)]">
        <div className="p-6">
          <h3 className="font-['Mulish',sans-serif] text-[22px] font-medium leading-none tracking-normal text-[#435160]">
            Add GST
          </h3>

          <div className="mt-5 space-y-5">
            <div className="space-y-1">
              <label className="text-[14px] leading-[21px] text-[#435160]">
                GST Number {!manualMode || draft.registrationStatus === "Registered" ? (
                  <span className="text-[#e2585f]">*</span>
                ) : null}
              </label>
              <div className="flex h-[38px] overflow-hidden rounded-[8px] border border-[#d8787d] bg-white">
                <Input
                  className="h-full flex-1 rounded-none border-0 bg-transparent px-3 uppercase shadow-none focus-visible:border-transparent focus-visible:ring-0"
                  disabled={fieldsLocked || isValidatingGst}
                  onChange={(event) => {
                    setDraft((current) => ({
                      ...current,
                      gstNumber: event.target.value.toUpperCase(),
                    }));
                    setFormatError(null);
                  }}
                  placeholder="Enter GSTIN or leave blank if unregistered"
                  value={draft.gstNumber}
                />
                <button
                  className="m-[5px] inline-flex h-[28px] items-center justify-center gap-1 rounded-[4px] bg-[#aa1722] px-3 text-[12px] leading-[18px] text-white disabled:bg-[#dce2ea] disabled:text-[#7a8796]"
                  disabled={isValidatingGst}
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
              {formatError ? <p className="text-[13px] text-[#ff5e57]">{formatError}</p> : null}
              {manualMode ? (
                <p className="text-[12px] text-[#71859b]">
                  Status: {draft.registrationStatus}
                  {draft.gstNumber.trim() ? "" : " (leave GST blank if you do not have one)"}
                </p>
              ) : null}
            </div>

            {manualMode ? (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[14px] leading-[21px] text-[#435160]">
                      State <span className="text-[#e2585f]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="h-[38px] w-full appearance-none rounded-[8px] border border-[#e5e5e6] bg-white px-3 pr-9 text-[13px] text-[#231f20] outline-none disabled:bg-[#f5f6f8]"
                        disabled={fieldsLocked}
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
                          <option value={draft.stateCode}>{formatStateLabel(draft.stateCode)}</option>
                        ) : null}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ca1b5]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[14px] leading-[21px] text-[#435160]">
                      Legal Name <span className="text-[#e2585f]">*</span>
                    </label>
                    <Input
                      disabled={fieldsLocked}
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
                      <label className="text-[14px] leading-[21px] text-[#435160]">
                        Upload GST Certificate <span className="text-[#e2585f]">*</span>
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

                      <div className="rounded-[8px] border border-dashed border-[#e5e5e6] bg-[#fbfcfd] p-4">
                        {draft.fileURL && localPreview ? (
                          <div className="relative mx-auto h-[220px] max-w-[420px] rounded-[4px] border border-[#4a90e2] bg-white p-2">
                            {localPreview.type === "application/pdf" ? (
                              <div className="flex h-full flex-col items-center justify-center gap-2 text-[#6b7d90]">
                                <FileText className="h-9 w-9 text-[#4a90e2]" />
                                <p className="max-w-[280px] truncate text-[13px]">{localPreview.name}</p>
                              </div>
                            ) : (
                              <img
                                alt="GST certificate preview"
                                className="h-full w-full rounded-[2px] object-contain"
                                src={localPreview.previewUrl}
                              />
                            )}
                            <button
                              className="absolute right-2 top-2 text-[#8ca1b5]"
                              onClick={clearPreview}
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3 text-center">
                            <Upload className="mx-auto h-5 w-5 text-[#8ca1b5]" />
                            <p className="text-[13px] text-[#8ca1b5]">
                              {isUploading
                                ? "Uploading..."
                                : "Format Supported: PNG, PDF or JPEG up to 2MB"}
                            </p>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                className="h-[34px] border border-[#e5e5e6] bg-white text-[13px] text-[#5a6b7d] hover:bg-white"
                                disabled={isUploading}
                                onClick={() => {
                                  setShowCamera(true);
                                }}
                                type="button"
                                variant="outline"
                              >
                                <Camera className="h-4 w-4" /> Capture
                              </Button>
                              <Button
                                className="h-[34px] bg-[#aa1722] text-[13px] text-white hover:bg-[#93161e]"
                                disabled={isUploading}
                                onClick={() => {
                                  fileInputRef.current?.click();
                                }}
                                type="button"
                              >
                                Upload
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <UploadImageGuidelines />
                  </>
                ) : null}

                <Button
                  className={`h-[42px] w-full rounded-[8px] text-[14px] leading-[21px] ${
                    canSave || isUploading
                      ? "bg-[#aa1722] text-white hover:bg-[#93161e]"
                      : "bg-[#d9d9d9] text-[#71859b] hover:bg-[#d9d9d9]"
                  }`}
                  disabled={!canSave || isUploading}
                  onClick={() => {
                    onSave({
                      ...draft,
                      gstNumber: draft.gstNumber.trim().toUpperCase(),
                      legalName: formatGstName(draft.legalName),
                      registrationStatus: draft.gstNumber.trim()
                        ? "Registered"
                        : "Unregistered",
                      requiresCertificate: draft.requiresCertificate,
                    });
                  }}
                  type="button"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Save & Update"
                  )}
                </Button>
              </>
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
