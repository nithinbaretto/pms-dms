import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Eye,
  Loader2,
  Trash2,
  XIcon,
} from "lucide-react";

import uploadFileIcon from "../../../../../assets/icons/svg/upload_file.svg";
import gstGuideline1 from "../../../../../assets/images/guidlines_img_1.png";
import gstGuideline2 from "../../../../../assets/images/guidlines_img_2.png";
import gstGuideline3 from "../../../../../assets/images/guidlines_img_3.png";
import gstGuideline4 from "../../../../../assets/images/guidlines_img_4.png";
import { Button } from "../../../../../shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../../../shared/ui/dialog";
import { Input } from "../../../../../shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../shared/ui/select";
import { MAX_GST_CERTIFICATE_BYTES } from "../constants";
import { abbreviateStateName, formatStateLabel } from "../helpers";
import type { ManualGstDraft, ValidateGstResult } from "../types";
import {
  formatGstName,
  isDuplicateGstNumber,
  isValidGstNumber,
  sanitizeGstLegalName,
} from "../validation";
import CameraCaptureModal from "../../../components/CameraCaptureModal";
import UploadImageGuidelines from "../../../components/UploadImageGuidelines";
import { onboardingApi } from "../../../services/onboarding-api";
import { useOnboardingStore } from "../../../state/onboarding-store";
import {
  extractFileNameFromUrl,
  isPdfDisplaySrc,
  resolveDocumentFormat,
  toDisplaySrc,
} from "../../documents/helpers";

const SELECT_MENU_CLASS =
  "z-[70] max-h-[200px] overflow-y-scroll rounded-[8px] border border-[#eee] bg-white p-0 shadow-[4px_4px_20px_0px_rgba(0,0,0,0.12)] [scrollbar-width:thin] [scrollbar-color:#c5cdd6_transparent] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c5cdd6] [&_[data-slot=select-scroll-up-button]]:hidden [&_[data-slot=select-scroll-down-button]]:hidden [&_[data-radix-select-viewport]]:h-auto [&_[data-radix-select-viewport]]:max-h-none";

const isPdfPreview = (name: string, type: string): boolean =>
  type === "application/pdf" || name.toLowerCase().endsWith(".pdf");

const withPdfViewerParams = (src: string): string =>
  `${src}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-width`;

const revokeBlobUrl = (url?: string): void => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const GST_GUIDELINE_ITEMS = [
  { src: gstGuideline4, label: "Clear & Complete", good: true },
  { src: gstGuideline1, label: "Poor lighting / Glare", good: false },
  { src: gstGuideline2, label: "Half cut / Incomplete", good: false },
  { src: gstGuideline3, label: "Blurry / Out of focus", good: false },
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
  const previewRequestIdRef = useRef(0);
  const [showCamera, setShowCamera] = useState(false);
  const [certificatePreviewOpen, setCertificatePreviewOpen] = useState(false);
  const [certificatePreviewSrc, setCertificatePreviewSrc] = useState("");
  const [certificatePreviewType, setCertificatePreviewType] = useState("");
  const [isLoadingCertificatePreview, setIsLoadingCertificatePreview] = useState(false);
  const [certificatePreviewError, setCertificatePreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setView("fetch");
      setIsAddingAnother(false);
      setDraft(emptyDraft());
      setFormatError(null);
      setFileError(null);
      setShowCamera(false);
      setCertificatePreviewOpen(false);
      setCertificatePreviewSrc("");
      setCertificatePreviewType("");
      setCertificatePreviewError(null);
      setIsLoadingCertificatePreview(false);
      return;
    }

    setLocalPreview((prev) => {
      revokeBlobUrl(prev?.previewUrl);
      return null;
    });
    setPendingDrafts((current) => {
      current.forEach((item) => {
        revokeBlobUrl(item.previewUrl);
      });
      return [];
    });
    setCertificatePreviewOpen(false);
    setCertificatePreviewSrc("");
  }, [open]);

  const knownGstNumbers = [
    ...existingGstNumbers,
    ...pendingDrafts.map((item) => item.gstNumber),
  ];

  const closeCertificatePreview = (): void => {
    setCertificatePreviewOpen(false);
    setCertificatePreviewSrc("");
    setCertificatePreviewType("");
    setCertificatePreviewError(null);
    setIsLoadingCertificatePreview(false);
  };

  const openCertificatePreview = async (item: ManualGstDraft): Promise<void> => {
    const localSrc = item.previewUrl?.trim() || "";
    const downloadLink = item.fileURL.trim();
    if (!localSrc && !downloadLink) {
      return;
    }

    setCertificatePreviewOpen(true);
    setCertificatePreviewSrc("");
    setCertificatePreviewType(item.previewType?.trim() || "");
    setCertificatePreviewError(null);

    if (localSrc) {
      setCertificatePreviewSrc(localSrc);
      return;
    }

    const { leadId, pan, panNumber } = useOnboardingStore.getState();
    const resolvedPan = (pan || panNumber).trim().toUpperCase();
    if (!leadId || !resolvedPan) {
      setCertificatePreviewError("Unable to open document. Missing lead or PAN information.");
      return;
    }

    const requestId = ++previewRequestIdRef.current;
    setIsLoadingCertificatePreview(true);

    try {
      const fileName =
        item.previewName?.trim() ||
        extractFileNameFromUrl(downloadLink, "GST Certificate");
      const type = resolveDocumentFormat(fileName || downloadLink, item.previewType);
      const response = await onboardingApi.downloadFile({
        downloadLink,
        fileName,
        leadId,
        panNumber: resolvedPan,
        type,
      });
      if (requestId !== previewRequestIdRef.current) {
        return;
      }
      const displaySrc = toDisplaySrc(response.fileURL, type);
      if (!displaySrc) {
        throw new Error("Document download returned an empty file.");
      }
      setCertificatePreviewSrc(displaySrc);
      setCertificatePreviewType(type);
    } catch {
      if (requestId !== previewRequestIdRef.current) {
        return;
      }
      setCertificatePreviewError("Unable to load GST certificate. Please try again.");
    } finally {
      if (requestId === previewRequestIdRef.current) {
        setIsLoadingCertificatePreview(false);
      }
    }
  };

  const resetCurrentDraft = (): void => {
    revokeBlobUrl(localPreview?.previewUrl);
    setLocalPreview(null);
    setDraft(emptyDraft());
    setFormatError(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearPreview = (): void => {
    revokeBlobUrl(localPreview?.previewUrl);
    setLocalPreview(null);
    setDraft((current) => ({ ...current, fileURL: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addDraftToPending = (next: ManualGstDraft): void => {
    const transferredPreview = localPreview;
    setPendingDrafts((current) => [
      ...current,
      toCompletedDraft({
        ...next,
        previewUrl: transferredPreview?.previewUrl ?? next.previewUrl,
        previewName: transferredPreview?.name ?? next.previewName,
        previewType: transferredPreview?.type ?? next.previewType,
      }),
    ]);
    setLocalPreview(null);
    setDraft(emptyDraft());
    setFormatError(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

    if (result?.isValidated) {
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

    revokeBlobUrl(localPreview?.previewUrl);

    const isPdf = isPdfPreview(selectedFile.name, selectedFile.type);
    setLocalPreview({
      name: selectedFile.name,
      type: isPdf ? "application/pdf" : selectedFile.type,
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

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
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

  const returnToGstFetch = (nextGst: string): void => {
    revokeBlobUrl(localPreview?.previewUrl);
    setLocalPreview(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (view === "manual") {
      setView("fetch");
    }
    setDraft({
      ...emptyDraft(),
      gstNumber: nextGst,
    });
  };

  const isDuplicate = isDuplicateGstNumber(draft.gstNumber, knownGstNumbers);
  const canContinue =
    Boolean(draft.legalName.trim()) &&
    Boolean(draft.stateCode.trim()) &&
    isValidGstNumber(draft.gstNumber) &&
    !isDuplicate &&
    (!draft.requiresCertificate || Boolean(draft.fileURL.trim()));
  const canFetch = draft.gstNumber.trim().length === 15 && !isDuplicate;
  const gstNumberLocked = isValidatingGst;

  const gstNumberField = (
    <div
      className={`${pendingDrafts.length > 0 ? "w-1/2" : "w-full"} space-y-1`}
    >
      <label className="font-['Mulish',sans-serif] text-[12px] font-normal leading-[100%] tracking-[0px] text-[#231F20]">
        GST Number <span className="text-[#E8402F]">*</span>
      </label>
      <div
        className={`flex h-[38px] overflow-hidden rounded-[8px] bg-white ${
          formatError ? "border border-[#d8787d]" : "border border-[#e5e5e6]"
        }`}
      >
        <Input
          className="h-full flex-1 rounded-none border-0 bg-transparent px-3 uppercase shadow-none focus-visible:border-transparent focus-visible:ring-0 disabled:bg-transparent"
          disabled={gstNumberLocked}
          onChange={(event) => {
            const nextGst = event.target.value.toUpperCase();
            if (draft.requiresCertificate || view === "manual") {
              returnToGstFetch(nextGst);
            } else {
              setDraft((current) => ({
                ...current,
                gstNumber: nextGst,
              }));
            }
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

  const manualDetailsFields = (
    <>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="w-full space-y-1">
            <label className="font-['Mulish',sans-serif] text-[12px] font-normal leading-[100%] tracking-[0px] text-[#231F20]">
              State <span className="text-[#E8402F]">*</span>
            </label>
            <Select
              onValueChange={(value) => {
                setDraft((current) => ({
                  ...current,
                  stateCode: value,
                }));
              }}
              value={draft.stateCode || undefined}
            >
              <SelectTrigger className="h-[38px] w-full rounded-[8px] border border-[#e5e5e6] bg-white px-3 font-['Mulish',sans-serif] text-[13px] font-normal text-[#231f20] shadow-none outline-none focus-visible:border-[var(--color-onboarding-primary)] focus-visible:ring-0 data-[placeholder]:text-[#71859b] [&_svg]:size-4 [&_svg]:opacity-100 [&_svg]:text-[#8ca1b5]">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent position="popper" className={SELECT_MENU_CLASS}>
                {stateOptions.map((state) => (
                  <SelectItem
                    key={state}
                    value={state}
                    className="cursor-pointer py-2 font-['Mulish',sans-serif] text-[13px] text-[#231f20] focus:bg-[#f5f5f5] focus:text-[#231f20]"
                  >
                    {formatStateLabel(state)}
                  </SelectItem>
                ))}
                {draft.stateCode &&
                !stateOptions.some(
                  (state) =>
                    state.toLowerCase() === draft.stateCode.toLowerCase(),
                ) ? (
                  <SelectItem
                    value={draft.stateCode}
                    className="cursor-pointer py-2 font-['Mulish',sans-serif] text-[13px] text-[#231f20] focus:bg-[#f5f5f5] focus:text-[#231f20]"
                  >
                    {formatStateLabel(draft.stateCode)}
                  </SelectItem>
                ) : null}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full space-y-1">
            <label className="font-['Mulish',sans-serif] text-[12px] font-normal leading-[100%] tracking-[0px] text-[#231F20]">
              Legal Name <span className="text-[#E8402F]">*</span>
            </label>
            <Input
              className="h-[38px] min-w-0 w-full bg-white disabled:bg-white [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#ffffff]"
              onChange={(event) => {
                setDraft((current) => ({
                  ...current,
                  legalName: sanitizeGstLegalName(event.target.value),
                }));
              }}
              placeholder="Enter Legal Name"
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
                className={`rounded-[8px] border-2 border-dotted bg-white p-4 ${
                  fileError ? "border-[#d8787d]" : "border-[#EEEEEE]"
                }`}
              >
                {draft.fileURL && localPreview ? (
                  <div className="flex w-full items-start gap-4">
                    <div className="relative h-[220px] min-w-0 flex-1 overflow-hidden bg-white">
                      {isPdfPreview(localPreview.name, localPreview.type) ? (
                        <iframe
                          className="h-full w-full border-0 bg-white"
                          src={withPdfViewerParams(localPreview.previewUrl)}
                          title="GST certificate preview"
                        />
                      ) : (
                        <img
                          alt="GST certificate preview"
                          className="h-full w-full object-contain"
                          src={localPreview.previewUrl}
                        />
                      )}
                    </div>
                    <button
                      aria-label="Remove GST certificate"
                      className="mt-1 size-6 shrink-0 text-[#71859B] hover:opacity-70"
                      onClick={clearPreview}
                      type="button"
                    >
                      <Trash2 className="size-full" strokeWidth={1.75} />
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
        className={`h-[42px] w-full rounded-[8px] text-[14px] leading-[21px] ${
          canContinue || isUploading
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
          if (!nextOpen && (certificatePreviewOpen || showCamera)) {
            return;
          }
          if (!nextOpen && !showCamera) {
            onOpenChange(nextOpen);
          }
        }}
        open={open && !showCamera}
      >
        <DialogContent
          className="flex h-auto max-h-[min(784px,calc(100vh-48px))] w-[calc(100%-2rem)] max-w-[589px] flex-col gap-0 overflow-hidden rounded-[16px] border-0 bg-white p-0 shadow-[0px_24px_60px_rgba(0,0,0,0.2)] sm:w-[589px] sm:max-w-[589px]"
          hideClose
          onInteractOutside={(event) => {
            if (certificatePreviewOpen) {
              event.preventDefault();
            }
          }}
          onPointerDownOutside={(event) => {
            if (certificatePreviewOpen) {
              event.preventDefault();
            }
          }}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 px-6 pt-6">
            <DialogTitle className="font-['Mulish',sans-serif] text-[22px] font-medium leading-[100%] tracking-[0px] !text-[#435160]">
              Add GST
            </DialogTitle>
            <button
              aria-label="Close"
              className="inline-flex size-[24px] shrink-0 items-center justify-center text-[#435160] hover:opacity-70 focus:outline-hidden"
              onClick={() => {
                onOpenChange(false);
              }}
              type="button"
            >
              <XIcon className="size-[24px]" strokeWidth={1.5} />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-4">
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
                          <Check
                            className="h-[9px] w-[9px] text-white"
                            strokeWidth={3}
                          />
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
                            <button
                              aria-label="Preview GST certificate"
                              className="flex items-center justify-center text-[#231F20] hover:opacity-70 disabled:opacity-40"
                              disabled={!item.fileURL.trim() && !item.previewUrl?.trim()}
                              onClick={() => {
                                void openCertificatePreview(item);
                              }}
                              type="button"
                            >
                              <Eye className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                          ) : null}
                          <button
                            aria-label="Remove GST"
                            className="flex items-center justify-center text-[#93161E] hover:opacity-70"
                            onClick={() => {
                              revokeBlobUrl(item.previewUrl);
                              const next = pendingDrafts.filter(
                                (entry) => entry.gstNumber !== item.gstNumber,
                              );
                              setPendingDrafts(next);
                              if (next.length === 0) {
                                setIsAddingAnother(false);
                                setView(
                                  isAddingAnother && draft.requiresCertificate
                                    ? "manual"
                                    : "fetch",
                                );
                              }
                            }}
                            type="button"
                          >
                            <Trash2
                              className="h-[13px] w-[12px]"
                              strokeWidth={1.75}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isAddingAnother ? (
                  <>
                    <div className="h-px bg-[#EEEEEE]" />
                    {gstNumberField}
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
      <Dialog
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeCertificatePreview();
          }
        }}
        open={certificatePreviewOpen}
      >
        <DialogContent
          className="z-[80] flex w-[calc(100%-48px)] max-w-[679.5px] flex-col gap-[16px] rounded-[16px] border-0 bg-white p-[20px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.12)] sm:max-w-[679.5px] md:p-[32px]"
          hideClose
          onCloseAutoFocus={(event) => {
            event.preventDefault();
          }}
          onInteractOutside={(event) => {
            event.preventDefault();
            closeCertificatePreview();
          }}
          onPointerDownOutside={(event) => {
            event.preventDefault();
            closeCertificatePreview();
          }}
        >
          <div className="flex h-[33px] w-full shrink-0 items-center justify-between">
            <DialogTitle className="font-['Mulish',sans-serif] text-[22px] font-medium leading-[33px] !text-[#435160]">
              GST Certificate
            </DialogTitle>
            <button
              aria-label="Close"
              className="inline-flex size-[24px] shrink-0 items-center justify-center text-[#435160] hover:opacity-70 focus:outline-hidden"
              onClick={closeCertificatePreview}
              type="button"
            >
              <XIcon className="size-[24px]" strokeWidth={1.5} />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="relative w-full overflow-hidden rounded-[8px] border border-dashed border-[#eee]">
            <div className="relative flex h-[211px] w-full items-center justify-center p-[12px]">
              {isLoadingCertificatePreview ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="size-6 animate-spin text-[#93161e]" />
                  <p className="font-['Mulish',sans-serif] text-[13px] text-[#435160]">
                    Loading...
                  </p>
                </div>
              ) : certificatePreviewError ? (
                <p className="px-2 text-center font-['Mulish',sans-serif] text-[13px] text-[#93161e]">
                  {certificatePreviewError}
                </p>
              ) : certificatePreviewSrc ? (
                isPdfDisplaySrc(certificatePreviewSrc, certificatePreviewType) ||
                isPdfPreview(certificatePreviewType, certificatePreviewType) ? (
                  <iframe
                    className="h-full w-full border-0 bg-white"
                    src={withPdfViewerParams(certificatePreviewSrc)}
                    title="GST certificate preview"
                  />
                ) : (
                  <img
                    alt="GST certificate preview"
                    className="max-h-full max-w-full object-contain"
                    src={certificatePreviewSrc}
                  />
                )
              ) : (
                <p className="text-center font-['Mulish',sans-serif] text-[13px] text-[#71859b]">
                  No preview available.
                </p>
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
