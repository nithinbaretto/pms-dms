import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, Loader2, Upload, X } from "lucide-react";

import editIcon from "../../../../../assets/icons/edit_icon.png";
import identityIcon from "../../../../../assets/icons/svg/identity.svg";
import trashIcon from "../../../../../assets/icons/svg/trash_icon.svg";
import { Checkbox } from "../../../../../shared/ui/checkbox";
import { Dialog, DialogContent } from "../../../../../shared/ui/dialog";
import { Input } from "../../../../../shared/ui/input";
import { cn } from "../../../../../shared/ui/utils";
import CorrespondenceAddressModal from "../../personal-details/modals/CorrespondenceAddressModal";
import type { Address } from "../../personal-details/types";
import {
  EMAIL_PATTERN,
  KARTA_FETCH_DELAY_MS,
  KARTA_PROOF_OPTIONS,
  MOBILE_PATTERN,
} from "../constants";
import {
  createEmptyManualKarta,
  createFetchedKarta,
  formatAddressLine,
  formatMobileDisplay,
  getApplicantAddress,
  isValidPan,
  shouldMockFetchSucceed,
} from "../helpers";
import type { KartaDetails, KartaDocumentFile, KartaDocumentKind } from "../types";
import KartaPersonAvatar from "../components/KartaPersonAvatar";
import UploadKartaDocumentModal from "./UploadKartaDocumentModal";

type AddKartaModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (karta: KartaDetails) => void;
};

const labelClass =
  "font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]";

const compositeFieldClass =
  "flex h-9 items-center rounded-[8px] border border-[#eeeeee] bg-white transition-[color,box-shadow] focus-within:border-[var(--color-onboarding-primary)] focus-within:ring-2 focus-within:ring-[rgba(147,22,30,0.2)]";

const compositeInputClass =
  "h-full flex-1 rounded-none border-0 bg-transparent px-[14px] font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#231f20] shadow-none outline-none placeholder:text-[#71859b] focus-visible:border-transparent focus-visible:ring-0";

const prefixClass =
  "flex h-full shrink-0 items-center bg-[#f5f5f5] px-2 font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#71859B]";

const FileRow = ({
  title,
  file,
  onUpload,
  onRemove,
}: {
  title: string;
  file: KartaDocumentFile | null;
  onUpload: () => void;
  onRemove: () => void;
}): ReactElement => {
  return (
    <div className="flex items-center gap-3 rounded-[8px] border border-[#EEEEEE] bg-white px-3 py-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-[4px] bg-[#FFFAF6]">
        <img alt="" className="h-[13px] w-[11px]" src={identityIcon} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none text-[#231F20]">
          {title}
        </p>
        {file ? (
          <p className="mt-1 inline-flex items-center gap-1 font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#37b400]">
            1 File(s) Uploaded
            <CheckCircle2 className="size-3.5" />
          </p>
        ) : (
          <p className="mt-1 font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#71859B]">
            Format Supported: PNG, PDF or JPEG up to 2MB
          </p>
        )}
      </div>
      {file ? (
        <button
          aria-label={`Remove ${title}`}
          className="size-6 shrink-0 hover:opacity-70"
          onClick={onRemove}
          type="button"
        >
          <img alt="" className="size-6" src={trashIcon} />
        </button>
      ) : (
        <button
          className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#EEEEEE] px-3 font-['Mulish',sans-serif] text-[14px] font-normal text-[#231F20]"
          onClick={onUpload}
          type="button"
        >
          Upload
          <Upload className="size-3.5" />
        </button>
      )}
    </div>
  );
};

const AddKartaModal = ({ open, onClose, onSave }: AddKartaModalProps): ReactElement => {
  const applicantAddress = getApplicantAddress();
  const [pan, setPan] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [draft, setDraft] = useState<KartaDetails | null>(null);
  const [addressEditTarget, setAddressEditTarget] = useState<"permanent" | "correspondence" | null>(
    null,
  );
  const [uploadKind, setUploadKind] = useState<KartaDocumentKind | null>(null);
  const [showProofDropdown, setShowProofDropdown] = useState(false);
  const proofDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setPan("");
    setIsFetching(false);
    setFetchError(null);
    setDraft(null);
    setAddressEditTarget(null);
    setUploadKind(null);
    setShowProofDropdown(false);
  }, [open]);

  useEffect(() => {
    if (!showProofDropdown) {
      return;
    }

    const handlePointerDown = (event: MouseEvent): void => {
      if (!proofDropdownRef.current?.contains(event.target as Node)) {
        setShowProofDropdown(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [showProofDropdown]);

  const handleFetch = async (): Promise<void> => {
    const normalizedPan = pan.trim().toUpperCase();

    if (!isValidPan(normalizedPan)) {
      setFetchError("Invalid PAN number");
      setDraft(null);
      return;
    }

    setIsFetching(true);
    setFetchError(null);

    await new Promise((resolve) => {
      window.setTimeout(resolve, KARTA_FETCH_DELAY_MS);
    });

    if (shouldMockFetchSucceed(normalizedPan)) {
      setDraft(createFetchedKarta(normalizedPan));
      setFetchError(null);
    } else {
      setDraft(createEmptyManualKarta(normalizedPan));
      setFetchError("PAN not found in records. Please enter details manually below.");
    }

    setIsFetching(false);
  };

  const updateDraft = (patch: Partial<KartaDetails>): void => {
    setDraft((current) => (current ? { ...current, ...patch } : current));
  };

  const canSaveFetched = Boolean(
    draft?.source === "fetched" &&
    draft.name.trim() &&
    draft.pan.trim() &&
    formatAddressLine(draft.permanentAddress) &&
    formatAddressLine(draft.correspondenceAddress),
  );

  const canSaveManual = Boolean(
    draft?.source === "manual" &&
    draft.name.trim() &&
    isValidPan(draft.pan) &&
    draft.proofOfIdentityType.trim() &&
    draft.proofOfIdentityNumber.trim() &&
    MOBILE_PATTERN.test(draft.mobile) &&
    EMAIL_PATTERN.test(draft.email) &&
    formatAddressLine(draft.permanentAddress) &&
    formatAddressLine(draft.correspondenceAddress) &&
    draft.identityDocument &&
    draft.addressDocument,
  );

  const canSave = draft?.source === "fetched" ? canSaveFetched : canSaveManual;
  const panHasError = Boolean(fetchError);
  const isSubflowOpen = Boolean(uploadKind) || Boolean(addressEditTarget);

  return (
    <>
      <Dialog
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !isSubflowOpen) {
            onClose();
          }
        }}
        open={open && !isSubflowOpen}
      >
        <DialogContent className="max-h-[calc(100vh-48px)] w-[calc(100%-2rem)] max-w-[760px] overflow-y-auto rounded-[16px] border-0 p-0 shadow-[0px_24px_60px_rgba(0,0,0,0.2)] [&>button.absolute]:hidden">
          <div className="relative space-y-5 bg-white p-6">
            <div className="pr-8">
              <h2 className="font-['Mulish',sans-serif] text-[20px] font-medium leading-none tracking-normal text-[#435160] md:text-[22px]">
                Add Karta
              </h2>
              <p className="mt-2 font-['Mulish',sans-serif] text-[14px] font-medium leading-[21px] tracking-normal text-[#71859B] md:text-[16px] md:leading-6">
                Enter PAN to auto-fill details or add manually
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

            <div className="space-y-1">
              <label className={labelClass} htmlFor="add-karta-pan">
                Enter PAN <span className="text-[#E8402F]">*</span>
              </label>
              <div className="relative">
                <Input
                  aria-invalid={panHasError}
                  autoComplete="off"
                  className="uppercase pr-[72px]"
                  id="add-karta-pan"
                  maxLength={10}
                  onChange={(event) => {
                    setPan(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10));
                    setFetchError(null);
                    if (draft) {
                      setDraft(null);
                    }
                  }}
                  placeholder="Enter PAN"
                  value={pan}
                />
                <button
                  className="absolute right-1 top-1/2 inline-flex h-6 -translate-y-1/2 items-center justify-center rounded-[4px] bg-[#93161E] px-3 font-['Mulish',sans-serif] text-[11px] font-normal text-white disabled:bg-[#e5e5e6] disabled:text-[#5a6b7d]"
                  disabled={isFetching || pan.trim().length < 10}
                  onClick={() => {
                    void handleFetch();
                  }}
                  type="button"
                >
                  {isFetching ? <Loader2 className="size-3 animate-spin" /> : "Fetch"}
                </button>
              </div>
              {fetchError ? (
                <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#E8402F]">
                  {fetchError}
                </p>
              ) : null}
            </div>

            {draft?.source === "fetched" ? (
              <div className="space-y-4 rounded-[8px] bg-[#FFF4F4] p-4">
                <div className="flex items-center gap-3">
                  <KartaPersonAvatar />
                  <div>
                    <p className="font-['Mulish',sans-serif] text-[16px] font-medium leading-6 text-[#231F20]">
                      {draft.name}
                    </p>
                    <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none text-[#5A6B7D]">
                      PAN: {draft.pan}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#71859B]">
                      Mobile
                    </p>
                    <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none text-[#435160]">
                      {formatMobileDisplay(draft.mobile)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#71859B]">
                      Email
                    </p>
                    <p className="break-all font-['Mulish',sans-serif] text-[14px] font-normal leading-none text-[#435160]">
                      {draft.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#71859B]">
                    Permanent Address
                  </p>
                  <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-[21px] text-[#435160]">
                    {formatAddressLine(draft.permanentAddress)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#71859B]">
                      Correspondent Address
                    </p>
                    <button
                      className="inline-flex items-center gap-1 font-['Mulish',sans-serif] text-[12px] font-normal text-[#93161E]"
                      onClick={() => {
                        setAddressEditTarget("correspondence");
                      }}
                      type="button"
                    >
                      <img alt="" className="h-3 w-3" src={editIcon} /> Edit
                    </button>
                  </div>
                  <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-[21px] text-[#435160]">
                    {formatAddressLine(draft.correspondenceAddress)}
                  </p>
                </div>
              </div>
            ) : null}

            {draft?.source === "manual" ? (
              <div className="flex flex-col gap-3">
                <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]">
                  Enter Karta details manually
                </p>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className={labelClass}>
                        Name <span className="text-[#E8402F]">*</span>
                      </label>
                      <Input
                        onChange={(event) => {
                          updateDraft({ name: event.target.value });
                        }}
                        placeholder="Enter Name"
                        value={draft.name}
                      />
                    </div>

                    <div className="relative space-y-1" ref={proofDropdownRef}>
                      <label className={labelClass}>
                        Proof of Identity <span className="text-[#E8402F]">*</span>
                      </label>
                      <div className={compositeFieldClass}>
                        <button
                          className="flex h-full shrink-0 items-center gap-1 rounded-l-[7px] bg-[#f5f5f5] px-1.5 hover:bg-[#e8e8e8]"
                          onClick={() => {
                            setShowProofDropdown((current) => !current);
                          }}
                          type="button"
                        >
                          <span className="font-['Mulish',sans-serif] text-[13px] font-normal leading-none tracking-normal text-[#71859B]">
                            {draft.proofOfIdentityType}
                          </span>
                          <ChevronDown className="size-3 text-[#5A6B7D]" strokeWidth={1.75} />
                        </button>
                        <Input
                          className={cn(compositeInputClass, "uppercase")}
                          onChange={(event) => {
                            updateDraft({
                              proofOfIdentityNumber: event.target.value.toUpperCase(),
                            });
                          }}
                          placeholder="Enter Proof Number"
                          value={draft.proofOfIdentityNumber}
                        />
                      </div>
                      {showProofDropdown ? (
                        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-[60] overflow-hidden rounded-[8px] border border-[#e5e5e6] bg-white shadow-lg">
                          {KARTA_PROOF_OPTIONS.map((option) => (
                            <button
                              className="flex h-9 w-full items-center px-3 font-['Mulish',sans-serif] text-[13px] font-normal text-[#231f20] hover:bg-[#f5f5f5]"
                              key={option}
                              onClick={() => {
                                updateDraft({ proofOfIdentityType: option });
                                setShowProofDropdown(false);
                              }}
                              type="button"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>
                        Mobile Number <span className="text-[#E8402F]">*</span>
                      </label>
                      <div className={compositeFieldClass}>
                        <span className={`${prefixClass} rounded-l-[7px]`}>+91 (IND)</span>
                        <Input
                          className={compositeInputClass}
                          maxLength={10}
                          onChange={(event) => {
                            updateDraft({ mobile: event.target.value.replace(/\D/g, "").slice(0, 10) });
                          }}
                          placeholder="Enter Mobile Number"
                          value={draft.mobile}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={labelClass}>
                        Email <span className="text-[#E8402F]">*</span>
                      </label>
                      <Input
                        onChange={(event) => {
                          updateDraft({ email: event.target.value });
                        }}
                        placeholder="Enter Email"
                        type="email"
                        value={draft.email}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className={labelClass}>
                          Permanent Address <span className="text-[#E8402F]">*</span>
                        </p>
                        <button
                          className="inline-flex items-center gap-1 font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#93161E]"
                          onClick={() => {
                            setAddressEditTarget("permanent");
                          }}
                          type="button"
                        >
                          <img alt="" className="h-3 w-3" src={editIcon} /> Edit
                        </button>
                      </div>
                      <button
                        className={cn(
                          "w-full text-left font-['Mulish',sans-serif] text-[14px] font-normal tracking-normal outline-none transition-[color,box-shadow] focus-visible:border-[var(--color-onboarding-primary)] focus-visible:ring-2 focus-visible:ring-[rgba(147,22,30,0.2)]",
                          formatAddressLine(draft.permanentAddress)
                            ? "flex min-h-[76px] items-start rounded-[10px] border border-[#E5E5E6] bg-[#F5F5F5] p-3 leading-[21px] text-[#231F20]"
                            : "flex h-9 items-center overflow-hidden rounded-[8px] border border-[#eeeeee] bg-white px-[14px] leading-none text-[#71859B]",
                        )}
                        onClick={() => {
                          setAddressEditTarget("permanent");
                        }}
                        type="button"
                      >
                        {formatAddressLine(draft.permanentAddress) || "Enter Permanent Address"}
                      </button>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={draft.sameAsApplicantAddress}
                          className="border-[#eeeeee] data-[state=checked]:border-[#93161E] data-[state=checked]:bg-[#93161E]"
                          onCheckedChange={(checked) => {
                            const isChecked = Boolean(checked);
                            updateDraft({
                              sameAsApplicantAddress: isChecked,
                              permanentAddress: isChecked
                                ? applicantAddress
                                : draft.permanentAddress,
                              correspondenceAddress:
                                isChecked && draft.sameAsPermanentAddress
                                  ? applicantAddress
                                  : draft.correspondenceAddress,
                            });
                          }}
                        />
                        <span className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#435160]">
                          Same as applicants address
                        </span>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className={labelClass}>
                          Correspondence Address <span className="text-[#E8402F]">*</span>
                        </p>
                        <button
                          className="inline-flex items-center gap-1 font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#93161E]"
                          onClick={() => {
                            setAddressEditTarget("correspondence");
                          }}
                          type="button"
                        >
                          <img alt="" className="h-3 w-3" src={editIcon} /> Edit
                        </button>
                      </div>
                      <button
                        className={cn(
                          "w-full text-left font-['Mulish',sans-serif] text-[14px] font-normal tracking-normal outline-none transition-[color,box-shadow] focus-visible:border-[var(--color-onboarding-primary)] focus-visible:ring-2 focus-visible:ring-[rgba(147,22,30,0.2)]",
                          formatAddressLine(draft.correspondenceAddress)
                            ? "flex min-h-[76px] items-start rounded-[10px] border border-[#E5E5E6] bg-[#F5F5F5] p-3 leading-[21px] text-[#231F20]"
                            : "flex h-9 items-center overflow-hidden rounded-[8px] border border-[#eeeeee] bg-white px-[14px] leading-none text-[#71859B]",
                        )}
                        onClick={() => {
                          setAddressEditTarget("correspondence");
                        }}
                        type="button"
                      >
                        {formatAddressLine(draft.correspondenceAddress) || "Enter Correspondence Address"}
                      </button>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={draft.sameAsPermanentAddress}
                          className="border-[#eeeeee] data-[state=checked]:border-[#93161E] data-[state=checked]:bg-[#93161E]"
                          onCheckedChange={(checked) => {
                            const isChecked = Boolean(checked);
                            updateDraft({
                              sameAsPermanentAddress: isChecked,
                              correspondenceAddress: isChecked
                                ? draft.permanentAddress
                                : draft.correspondenceAddress,
                            });
                          }}
                        />
                        <span className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#435160]">
                          Same as permanent address
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none text-[#231F20]">
                      Upload Documents <span className="text-[#E8402F]">*</span>
                    </p>
                    <div className="space-y-2">
                      <FileRow
                        file={draft.identityDocument}
                        onRemove={() => {
                          updateDraft({ identityDocument: null });
                        }}
                        onUpload={() => {
                          setUploadKind("identity");
                        }}
                        title="Proof of Identity"
                      />
                      <FileRow
                        file={draft.addressDocument}
                        onRemove={() => {
                          updateDraft({ addressDocument: null });
                        }}
                        onUpload={() => {
                          setUploadKind("address");
                        }}
                        title="Proof of Address"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <button
              className={`h-9 w-full rounded-[8px] font-['Mulish',sans-serif] text-[14px] font-normal leading-none ${canSave
                ? "bg-[#93161E] text-white hover:bg-[#7a1319]"
                : "cursor-not-allowed bg-[#E5E5E6] text-[#5A6B7D]"
                }`}
              disabled={!canSave}
              onClick={() => {
                if (!draft || !canSave) {
                  return;
                }
                onSave(draft);
              }}
              type="button"
            >
              Save & Update
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {draft ? (
        <CorrespondenceAddressModal
          initialAddress={
            addressEditTarget === "permanent" ? draft.permanentAddress : draft.correspondenceAddress
          }
          initialSameAsPermanent={draft.sameAsPermanentAddress}
          mode={addressEditTarget === "permanent" ? "permanent" : "correspondence"}
          onCancel={() => {
            setAddressEditTarget(null);
          }}
          onSave={(address: Address, sameAsPermanent: boolean) => {
            if (addressEditTarget === "permanent") {
              updateDraft({
                permanentAddress: address,
                sameAsApplicantAddress: false,
                correspondenceAddress: draft.sameAsPermanentAddress
                  ? address
                  : draft.correspondenceAddress,
              });
            } else {
              updateDraft({
                correspondenceAddress: address,
                sameAsPermanentAddress: sameAsPermanent,
              });
            }
            setAddressEditTarget(null);
          }}
          open={Boolean(addressEditTarget)}
          permanentAddress={draft.permanentAddress}
        />
      ) : null}

      {uploadKind ? (
        <UploadKartaDocumentModal
          kind={uploadKind}
          onClose={() => {
            setUploadKind(null);
          }}
          onSave={(file) => {
            if (uploadKind === "identity") {
              updateDraft({ identityDocument: file });
            } else {
              updateDraft({ addressDocument: file });
            }
            setUploadKind(null);
          }}
          open
        />
      ) : null}
    </>
  );
};

export default AddKartaModal;
