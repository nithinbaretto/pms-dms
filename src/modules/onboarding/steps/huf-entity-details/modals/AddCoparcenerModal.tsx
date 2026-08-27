import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Plus, X } from "lucide-react";

import { Dialog, DialogContent } from "../../../../../shared/ui/dialog";
import { Input } from "../../../../../shared/ui/input";
import KartaPersonAvatar from "../components/KartaPersonAvatar";
import { COPARCENER_RELATIONSHIP_OPTIONS } from "../constants";
import { isValidIndividualPan } from "../helpers";
import type { CoparcenerDetails } from "../types";

type AddCoparcenerModalProps = {
  open: boolean;
  existing: CoparcenerDetails[];
  editing: CoparcenerDetails | null;
  onClose: () => void;
  onSave: (coparceners: CoparcenerDetails[]) => void;
};

const labelClass =
  "font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]";

const emptyForm = (): { name: string; pan: string; relationship: string } => ({
  name: "",
  pan: "",
  relationship: "",
});

const createCoparcener = (form: {
  name: string;
  pan: string;
  relationship: string;
}): CoparcenerDetails => ({
  id: `coparcener-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: form.name.trim(),
  pan: form.pan.trim().toUpperCase(),
  relationship: form.relationship,
});

const CoparcenerCard = ({ coparcener }: { coparcener: CoparcenerDetails }): ReactElement => {
  return (
    <div className="flex items-center gap-3 rounded-[8px] border border-[#93161E] bg-white px-3 py-3">
      <KartaPersonAvatar />
      <div className="min-w-0 flex-1">
        <p className="font-['Mulish',sans-serif] text-[14px] font-medium leading-none tracking-normal text-[#231F20]">
          {coparcener.name}
        </p>
        <p className="mt-1 font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#5A6B7D]">
          {coparcener.pan} | {coparcener.relationship}
        </p>
      </div>
      <span className="flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-[#93161E]">
        <Check className="size-3 text-white" strokeWidth={3} />
      </span>
    </div>
  );
};

const AddCoparcenerModal = ({
  open,
  existing,
  editing,
  onClose,
  onSave,
}: AddCoparcenerModalProps): ReactElement => {
  const [items, setItems] = useState<CoparcenerDetails[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [showPanError, setShowPanError] = useState(false);
  const [duplicatePanError, setDuplicatePanError] = useState(false);
  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);
  const relationshipDropdownRef = useRef<HTMLDivElement | null>(null);

  const isEditMode = Boolean(editing);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editing) {
      setItems(existing);
      setShowForm(true);
      setForm({
        name: editing.name,
        pan: editing.pan,
        relationship: editing.relationship,
      });
    } else {
      setItems(existing);
      setShowForm(existing.length === 0);
      setForm(emptyForm());
    }

    setShowPanError(false);
    setDuplicatePanError(false);
    setShowRelationshipDropdown(false);
  }, [open, editing, existing]);

  useEffect(() => {
    if (!showRelationshipDropdown) {
      return;
    }

    const handlePointerDown = (event: MouseEvent): void => {
      if (!relationshipDropdownRef.current?.contains(event.target as Node)) {
        setShowRelationshipDropdown(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [showRelationshipDropdown]);

  const panValue = form.pan.trim().toUpperCase();
  const panLooksComplete = panValue.length === 10;
  const panIsValid = isValidIndividualPan(panValue);
  const duplicatePan = items.some(
    (item) => item.pan === panValue && item.id !== editing?.id,
  );
  const panErrorMessage = duplicatePan
    ? "This PAN is already added"
    : "Entered PAN is invalid";
  const showError = (showPanError || panLooksComplete) && panValue.length > 0 && (!panIsValid || duplicatePan);

  const canSaveForm = Boolean(
    form.name.trim() &&
    panIsValid &&
    !duplicatePan &&
    form.relationship.trim(),
  );

  const title = isEditMode ? "Edit Co-Parcener" : "Add Co-Parcener";
  const addAnotherLabel = items.length <= 1 ? "Add Another Co-Parcener" : "Add Co-Parcener";

  const handleSaveForm = (): void => {
    if (!panIsValid || duplicatePan) {
      setShowPanError(true);
      setDuplicatePanError(duplicatePan);
      return;
    }

    if (!canSaveForm) {
      return;
    }

    if (editing) {
      onSave(
        existing.map((item) =>
          item.id === editing.id
            ? {
                ...item,
                name: form.name.trim(),
                pan: panValue,
                relationship: form.relationship,
              }
            : item,
        ),
      );
      return;
    }

    setItems((current) => [...current, createCoparcener(form)]);
    setForm(emptyForm());
    setShowForm(false);
    setShowPanError(false);
    setDuplicatePanError(false);
  };

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      open={open}
    >
      <DialogContent className="max-h-[calc(100vh-48px)] w-[calc(100%-2rem)] max-w-[760px] overflow-y-auto rounded-[16px] border-0 p-0 shadow-[0px_24px_60px_rgba(0,0,0,0.2)] [&>button.absolute]:hidden">
        <div className="relative space-y-5 bg-white p-6">
          <div className="pr-8">
            <h2 className="font-['Mulish',sans-serif] text-[20px] font-medium leading-none tracking-normal text-[#435160] md:text-[22px]">
              {title}
            </h2>
            <p className="mt-2 font-['Mulish',sans-serif] text-[14px] font-medium leading-[21px] tracking-normal text-[#71859B] md:text-[16px] md:leading-6">
              Enter Co-Parcener details
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

          {items.length > 0 && !isEditMode ? (
            <div className="space-y-3">
              {items.map((item) => (
                <CoparcenerCard coparcener={item} key={item.id} />
              ))}
            </div>
          ) : null}

          {showForm ? (
            <div className="space-y-4">
              {items.length > 0 && !isEditMode ? (
                <p className="font-['Mulish',sans-serif] text-[14px] font-medium leading-none tracking-normal text-[#231F20]">
                  Add Another Co-Parcener
                </p>
              ) : null}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className={labelClass} htmlFor="coparcener-name">
                    Name <span className="text-[#E8402F]">*</span>
                  </label>
                  <Input
                    autoComplete="off"
                    id="coparcener-name"
                    onChange={(event) => {
                      setForm((current) => ({ ...current, name: event.target.value }));
                    }}
                    placeholder="Enter Name"
                    value={form.name}
                  />
                </div>

                <div className="space-y-1">
                  <label className={labelClass} htmlFor="coparcener-pan">
                    PAN <span className="text-[#E8402F]">*</span>
                  </label>
                  <Input
                    aria-invalid={showError || duplicatePanError}
                    autoComplete="off"
                    className="uppercase"
                    id="coparcener-pan"
                    maxLength={10}
                    onChange={(event) => {
                      const nextPan = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
                      setForm((current) => ({ ...current, pan: nextPan }));
                      setShowPanError(false);
                      setDuplicatePanError(false);
                    }}
                    placeholder="Enter PAN"
                    value={form.pan}
                  />
                  {showError ? (
                    <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#E8402F]">
                      {panErrorMessage}
                    </p>
                  ) : null}
                </div>

                <div className="relative space-y-1" ref={relationshipDropdownRef}>
                  <label className={labelClass}>
                    Relationship with Karta <span className="text-[#E8402F]">*</span>
                  </label>
                  <button
                    className="flex h-9 w-full items-center justify-between rounded-[8px] border border-[#eeeeee] bg-white px-[14px] outline-none transition-[color,box-shadow] hover:border-[#c7aa7b] focus-visible:border-[var(--color-onboarding-primary)] focus-visible:ring-2 focus-visible:ring-[rgba(147,22,30,0.2)]"
                    onClick={() => {
                      setShowRelationshipDropdown((current) => !current);
                    }}
                    type="button"
                  >
                    <span
                      className={`font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal ${
                        form.relationship ? "text-[#231F20]" : "text-[#71859B]"
                      }`}
                    >
                      {form.relationship || "Select Relationship"}
                    </span>
                    <ChevronDown className="size-3.5 text-[#5A6B7D]" strokeWidth={1.75} />
                  </button>
                  {showRelationshipDropdown ? (
                    <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-[60] max-h-[240px] overflow-y-auto rounded-[8px] border border-[#e5e5e6] bg-white shadow-lg">
                      {COPARCENER_RELATIONSHIP_OPTIONS.map((option) => (
                        <button
                          className="flex h-9 w-full items-center px-3 font-['Mulish',sans-serif] text-[13px] font-normal text-[#231f20] hover:bg-[#f5f5f5]"
                          key={option}
                          onClick={() => {
                            setForm((current) => ({ ...current, relationship: option }));
                            setShowRelationshipDropdown(false);
                          }}
                          type="button"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {showForm ? (
            <button
              className={`h-9 w-full rounded-[8px] font-['Mulish',sans-serif] text-[14px] font-normal leading-none ${
                canSaveForm
                  ? "bg-[#93161E] text-white hover:bg-[#7a1319]"
                  : "cursor-not-allowed bg-[#E5E5E6] text-[#5A6B7D]"
              }`}
              disabled={!canSaveForm}
              onClick={handleSaveForm}
              type="button"
            >
              Save & Update
            </button>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#93161E] font-['Mulish',sans-serif] text-[14px] font-normal leading-none text-[#93161E]"
                onClick={() => {
                  setForm(emptyForm());
                  setShowForm(true);
                  setShowPanError(false);
                }}
                type="button"
              >
                <Plus className="size-4" strokeWidth={2.25} />
                {addAnotherLabel}
              </button>
              <button
                className={`h-9 rounded-[8px] font-['Mulish',sans-serif] text-[14px] font-normal leading-none ${
                  items.length > 0
                    ? "bg-[#93161E] text-white hover:bg-[#7a1319]"
                    : "cursor-not-allowed bg-[#E5E5E6] text-[#5A6B7D]"
                }`}
                disabled={items.length === 0}
                onClick={() => {
                  onSave(items);
                }}
                type="button"
              >
                Save & Update
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoparcenerModal;
