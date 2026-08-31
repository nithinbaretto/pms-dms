import type { ReactElement } from "react";
import { useState } from "react";
import { CheckCircle2, ChevronDown, Upload, X } from "lucide-react";

import identityIcon from "../../../../../assets/icons/svg/identity.svg";
import trashIcon from "../../../../../assets/icons/svg/trash_icon.svg";
import { Dialog, DialogContent } from "../../../../../shared/ui/dialog";
import { Input } from "../../../../../shared/ui/input";
import { createEmptySignatory, getPanError, isSignatoryFormValid } from "../signatory/helpers";
import type { SignatoryDetails, SignatoryDocumentFile, SignatoryDocumentKind } from "../signatory/types";
import UploadSignatoryDocumentModal from "./UploadSignatoryDocumentModal";

type AddSignatoryModalProps = {
  open: boolean;
  existing: SignatoryDetails[];
  editing: SignatoryDetails | null;
  onClose: () => void;
  onSave: (signatory: SignatoryDetails) => void;
};

const labelClass =
  "font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]";

const compositeFieldClass =
  "flex h-9 items-center rounded-[8px] border border-[#eeeeee] bg-white transition-[color,box-shadow] focus-within:border-[var(--color-onboarding-primary)] focus-within:ring-2 focus-within:ring-[rgba(147,22,30,0.2)]";

const compositeInputClass =
  "h-full flex-1 rounded-none border-0 bg-transparent px-[14px] font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#231f20] shadow-none outline-none placeholder:text-[#71859b] focus-visible:border-transparent focus-visible:ring-0";

const prefixClass =
  "flex h-full shrink-0 items-center rounded-l-[7px] bg-[#f5f5f5] px-2 font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#71859B]";

const SignatureIcon = (): ReactElement => (
  <svg aria-hidden className="size-4 text-[#93161E]" fill="none" viewBox="0 0 16 16">
    <path
      d="M2 12.5c1.2-1.8 2.2-4.6 3.4-4.6 1.1 0 .7 2.6 1.6 2.6.8 0 1.1-2.8 2.1-2.8.9 0 1.1 2.2 2 2.2.7 0 1.2-1.3 2.9-3.4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.4"
    />
  </svg>
);

const EyeIcon = (): ReactElement => (
  <svg aria-hidden className="size-4 shrink-0" fill="none" viewBox="0 0 15 10">
    <path
      d="M7.5 0C4.375 0 1.6875 1.9375 0.625 4.75C1.6875 7.5625 4.375 9.5 7.5 9.5C10.625 9.5 13.3125 7.5625 14.375 4.75C13.3125 1.9375 10.625 0 7.5 0ZM7.5 8C5.84375 8 4.5 6.65625 4.5 5C4.5 3.34375 5.84375 2 7.5 2C9.15625 2 10.5 3.34375 10.5 5C10.5 6.65625 9.15625 8 7.5 8ZM7.5 3.25C6.53125 3.25 5.75 4.03125 5.75 5C5.75 5.96875 6.53125 6.75 7.5 6.75C8.46875 6.75 9.25 5.96875 9.25 5C9.25 4.03125 8.46875 3.25 7.5 3.25Z"
      fill="#5A6B7D"
    />
  </svg>
);

const FileRow = ({
  title,
  file,
  icon,
  onUpload,
  onRemove,
}: {
  title: string;
  file: SignatoryDocumentFile | null;
  icon: ReactElement;
  onUpload: () => void;
  onRemove: () => void;
}): ReactElement => {
  return (
    <div className="flex items-center gap-3 rounded-[8px] border border-[#EEEEEE] bg-white px-3 py-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-[4px] bg-[#FFFAF6]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none text-[#231F20]">
          {title}
        </p>
        {file ? (
          <p className="mt-1 inline-flex items-center gap-1 font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#37b400]">
            <CheckCircle2 className="size-3.5" />
            1 File(s) Uploaded
          </p>
        ) : (
          <p className="mt-1 font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#71859B]">
            Format Supported: PNG, PDF or JPEG up to 2MB
          </p>
        )}
      </div>
      {file ? (
        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-label={`View ${title}`}
            className="flex size-4 items-center justify-center hover:opacity-70"
            onClick={() => {
              window.open(file.previewUrl, "_blank", "noopener,noreferrer");
            }}
            type="button"
          >
            <EyeIcon />
          </button>
          <button
            aria-label={`Remove ${title}`}
            className="flex size-4 items-center justify-center hover:opacity-70"
            onClick={onRemove}
            type="button"
          >
            <img alt="" className="size-4" src={trashIcon} />
          </button>
        </div>
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

const IdentityFileIcon = (): ReactElement => (
  <img alt="" className="h-[13px] w-[11px]" src={identityIcon} />
);

const AddSignatoryForm = ({
  existing,
  editing,
  onClose,
  onSave,
}: Omit<AddSignatoryModalProps, "open">): ReactElement => {
  const [draft, setDraft] = useState<SignatoryDetails>(
    editing ? { ...editing } : createEmptySignatory(),
  );
  const [uploadKind, setUploadKind] = useState<SignatoryDocumentKind | null>(null);

  const isSubflowOpen = Boolean(uploadKind);
  const others = existing.filter((item) => item.id !== draft.id);
  const panError = getPanError(draft.pan, draft.id, others);
  const formValid = isSignatoryFormValid(draft, others);

  const updateDraft = (patch: Partial<SignatoryDetails>): void => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  return (
    <>
      <Dialog
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !isSubflowOpen) {
            onClose();
          }
        }}
        open={!isSubflowOpen}
      >
        <DialogContent className="max-h-[calc(100vh-48px)] w-[calc(100%-2rem)] max-w-[760px] overflow-y-auto rounded-[16px] border-0 p-0 shadow-[0px_24px_60px_rgba(0,0,0,0.2)] [&>button.absolute]:hidden">
          <div className="relative space-y-6 bg-white p-6 md:p-8">
            <div className="pr-8">
              <h2 className="font-['Mulish',sans-serif] text-[20px] font-medium leading-none tracking-normal text-[#435160] md:text-[22px]">
                {editing ? "Edit Authorised Signatory" : "Add Authorised Signatory"}
              </h2>
            </div>
            <button
              aria-label="Close"
              className="absolute right-6 top-6 flex size-6 items-center justify-center text-[#435160] hover:opacity-70 md:right-8 md:top-8"
              onClick={onClose}
              type="button"
            >
              <X className="size-6" strokeWidth={1.5} />
            </button>

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
              <div className="space-y-1">
                <label className={labelClass}>
                  PAN Number <span className="text-[#E8402F]">*</span>
                </label>
                <Input
                  className="uppercase"
                  maxLength={10}
                  onChange={(event) => {
                    updateDraft({
                      pan: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10),
                    });
                  }}
                  placeholder="Enter PAN Number"
                  value={draft.pan}
                />
                {panError ? (
                  <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none text-[#E8402F]">
                    {panError}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1">
                <label className={labelClass}>
                  Mobile Number <span className="text-[#E8402F]">*</span>
                </label>
                <div className={compositeFieldClass}>
                  <span className={`${prefixClass} gap-1`}>
                    +91 (IND)
                    <ChevronDown className="size-3 text-[#5A6B7D]" strokeWidth={2} />
                  </span>
                  <Input
                    className={compositeInputClass}
                    maxLength={10}
                    onChange={(event) => {
                      updateDraft({
                        mobile: event.target.value.replace(/\D/g, "").slice(0, 10),
                      });
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

            <div className="flex flex-col gap-4">
              <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none text-[#231F20]">
                Upload Documents <span className="text-[#E8402F]">*</span>
              </p>
              <div className="space-y-2">
                <FileRow
                  file={draft.identityDocument}
                  icon={<IdentityFileIcon />}
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
                  icon={<IdentityFileIcon />}
                  onRemove={() => {
                    updateDraft({ addressDocument: null });
                  }}
                  onUpload={() => {
                    setUploadKind("address");
                  }}
                  title="Proof of Address"
                />
                <FileRow
                  file={draft.signatureDocument}
                  icon={<SignatureIcon />}
                  onRemove={() => {
                    updateDraft({ signatureDocument: null });
                  }}
                  onUpload={() => {
                    setUploadKind("signature");
                  }}
                  title="Specimen Signature"
                />
              </div>
            </div>

            <button
              className={`h-9 w-full rounded-[8px] font-['Mulish',sans-serif] text-[14px] font-normal ${
                formValid
                  ? "bg-[#93161E] text-white hover:bg-[#7a1319]"
                  : "cursor-not-allowed bg-[#E5E5E6] text-[#5A6B7D]"
              }`}
              disabled={!formValid}
              onClick={() => {
                if (!formValid) {
                  return;
                }
                onSave({
                  ...draft,
                  name: draft.name.trim(),
                  pan: draft.pan.trim().toUpperCase(),
                  email: draft.email.trim(),
                });
              }}
              type="button"
            >
              {editing ? "Save & Update" : "Continue"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {uploadKind ? (
        <UploadSignatoryDocumentModal
          kind={uploadKind}
          onClose={() => {
            setUploadKind(null);
          }}
          onSave={(file) => {
            if (uploadKind === "identity") {
              updateDraft({ identityDocument: file });
            } else if (uploadKind === "address") {
              updateDraft({ addressDocument: file });
            } else {
              updateDraft({ signatureDocument: file });
            }
            setUploadKind(null);
          }}
          open
        />
      ) : null}
    </>
  );
};

const AddSignatoryModal = ({
  open,
  existing,
  editing,
  onClose,
  onSave,
}: AddSignatoryModalProps): ReactElement => {
  if (!open) {
    return <></>;
  }

  return (
    <AddSignatoryForm
      editing={editing}
      existing={existing}
      key={editing?.id ?? "new"}
      onClose={onClose}
      onSave={onSave}
    />
  );
};

export default AddSignatoryModal;
