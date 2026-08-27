import type { ReactElement } from "react";
import { useState } from "react";

import { Input } from "../../../../shared/ui/input";
import OnboardingStepFooter from "../../components/OnboardingStepFooter";
import { HUF_ENTITY_DETAILS_COPY, HUF_ENTITY_TYPE } from "./constants";
import AddCoparcenerModal from "./modals/AddCoparcenerModal";
import AddKartaModal from "./modals/AddKartaModal";
import AddSignatoryModal from "./modals/AddSignatoryModal";
import ViewKartaModal from "./modals/ViewKartaModal";
import ViewSignatoryModal from "./modals/ViewSignatoryModal";
import CoparcenerDetailsSection from "./sections/CoparcenerDetailsSection";
import KartaDetailsSection from "./sections/KartaDetailsSection";
import SignatoryDetailsSection from "./sections/SignatoryDetailsSection";
import type { CoparcenerDetails, KartaDetails, SignatoryDetails, SignatoryMode } from "./types";

const HufEntityDetailsStep = (): ReactElement => {
  const copy = HUF_ENTITY_DETAILS_COPY;
  const [karta, setKarta] = useState<KartaDetails | null>(null);
  const [coparceners, setCoparceners] = useState<CoparcenerDetails[]>([]);
  const [signatories, setSignatories] = useState<SignatoryDetails[]>([]);
  const [signatoryMode, setSignatoryMode] = useState<SignatoryMode>("jointly");
  const [anySignatoryCount, setAnySignatoryCount] = useState(1);
  const [addKartaOpen, setAddKartaOpen] = useState(false);
  const [viewKartaOpen, setViewKartaOpen] = useState(false);
  const [coparcenerModalOpen, setCoparcenerModalOpen] = useState(false);
  const [editingCoparcener, setEditingCoparcener] = useState<CoparcenerDetails | null>(null);
  const [signatoryModalOpen, setSignatoryModalOpen] = useState(false);
  const [editingSignatory, setEditingSignatory] = useState<SignatoryDetails | null>(null);
  const [viewingSignatory, setViewingSignatory] = useState<SignatoryDetails | null>(null);

  const canContinue = Boolean(
    karta &&
    coparceners.length > 0 &&
    signatories.length > 0 &&
    (signatoryMode === "jointly" || anySignatoryCount >= 1),
  );

  return (
    <>
      <div className="mx-auto w-full max-w-[1240px] space-y-3">
        <section className="space-y-3">
          <header className="flex flex-col gap-2">
            <h1 className="font-['Mulish',sans-serif] text-[22px] font-medium leading-none tracking-normal text-[#231F20]">
              {copy.pageTitle}
            </h1>
            <p className="font-['Mulish',sans-serif] text-[15px] font-semibold leading-[22.5px] tracking-normal text-[#435160]">
              {copy.pageSubtitle}
            </p>
          </header>

          <div className="flex items-center justify-between text-xs leading-[18px] text-[#231f20]">
            <span>{copy.stepLabel}</span>
            <span>{copy.progressPercent}%</span>
          </div>
        </section>

        <section className="overflow-hidden rounded-[16px] border border-[#eeeeee] bg-white shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)]">
          <div className="h-2 w-full bg-[#e6e7e8]">
            <div className="h-full w-[18%] rounded-r-full bg-[#37b400]" />
          </div>

          <div className="space-y-6 p-4 md:p-6">
            <section className="space-y-4">
              <div>
                <h2 className="font-['Mulish',sans-serif] text-[16px] font-medium leading-6 tracking-normal text-[#231F20]">
                  {copy.entitySectionTitle}
                </h2>
                <p className="mt-1 font-['Mulish',sans-serif] text-[12px] font-medium leading-none tracking-normal text-[#435160]">
                  {copy.entitySectionDescription}
                </p>
              </div>

              <div className="max-w-[412px] space-y-1">
                <label
                  className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]"
                  htmlFor="huf-entity-type"
                >
                  {copy.entityTypeLabel} <span className="text-[#E8402F]">*</span>
                </label>
                <Input
                  className="disabled:bg-[#F5F5F5]"
                  disabled
                  id="huf-entity-type"
                  readOnly
                  value={HUF_ENTITY_TYPE}
                />
              </div>
            </section>

            <div className="h-px bg-[#e5e5e6]" />

            <KartaDetailsSection
              karta={karta}
              onAdd={() => {
                setAddKartaOpen(true);
              }}
              onView={() => {
                setViewKartaOpen(true);
              }}
            />

            <div className="h-px bg-[#e5e5e6]" />

            <CoparcenerDetailsSection
              coparceners={coparceners}
              onAdd={() => {
                setEditingCoparcener(null);
                setCoparcenerModalOpen(true);
              }}
              onEdit={(coparcener) => {
                setEditingCoparcener(coparcener);
                setCoparcenerModalOpen(true);
              }}
              onRemove={(id) => {
                setCoparceners((current) => current.filter((item) => item.id !== id));
              }}
            />

            <div className="h-px bg-[#e5e5e6]" />

            <SignatoryDetailsSection
              anyCount={Math.min(anySignatoryCount, Math.max(signatories.length, 1))}
              mode={signatoryMode}
              onAdd={() => {
                setEditingSignatory(null);
                setSignatoryModalOpen(true);
              }}
              onAnyCountChange={setAnySignatoryCount}
              onEdit={(signatory) => {
                setEditingSignatory(signatory);
                setSignatoryModalOpen(true);
              }}
              onModeChange={setSignatoryMode}
              onRemove={(id) => {
                setSignatories((current) => {
                  const next = current.filter((item) => item.id !== id);
                  setAnySignatoryCount((count) => Math.min(count, Math.max(next.length, 1)));
                  return next;
                });
              }}
              onView={setViewingSignatory}
              signatories={signatories}
            />
          </div>
        </section>
      </div>

      <OnboardingStepFooter
        continueDisabled={!canContinue}
        nextLabel={copy.nextLabel}
        showPrevious={false}
        onContinue={() => undefined}
      />

      <AddKartaModal
        onClose={() => {
          setAddKartaOpen(false);
        }}
        onSave={(nextKarta) => {
          setKarta(nextKarta);
          setAddKartaOpen(false);
        }}
        open={addKartaOpen}
      />

      <ViewKartaModal
        karta={karta}
        onClose={() => {
          setViewKartaOpen(false);
        }}
        open={viewKartaOpen}
      />

      <AddCoparcenerModal
        editing={editingCoparcener}
        existing={coparceners}
        onClose={() => {
          setCoparcenerModalOpen(false);
          setEditingCoparcener(null);
        }}
        onSave={(nextCoparceners) => {
          setCoparceners(nextCoparceners);
          setCoparcenerModalOpen(false);
          setEditingCoparcener(null);
        }}
        open={coparcenerModalOpen}
      />

      <AddSignatoryModal
        coparceners={coparceners}
        editing={editingSignatory}
        existing={signatories}
        karta={karta}
        onClose={() => {
          setSignatoryModalOpen(false);
          setEditingSignatory(null);
        }}
        onSave={(nextSignatories) => {
          setSignatories(nextSignatories);
          setAnySignatoryCount((count) => Math.min(count, Math.max(nextSignatories.length, 1)));
        }}
        open={signatoryModalOpen}
      />

      <ViewSignatoryModal
        onClose={() => {
          setViewingSignatory(null);
        }}
        open={Boolean(viewingSignatory)}
        signatory={viewingSignatory}
      />
    </>
  );
};

export default HufEntityDetailsStep;
