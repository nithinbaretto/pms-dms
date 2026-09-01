import type { ReactElement } from "react";
import { useState } from "react";

import OnboardingStepFooter from "../../components/OnboardingStepFooter";
import OnboardingStepSkeleton from "../../components/OnboardingStepSkeleton";
import AddGstModal from "./modals/AddGstModal";
import AddSignatoryModal from "./modals/AddSignatoryModal";
import ViewSignatoryDocumentsModal from "./modals/ViewSignatoryDocumentsModal";
import AuthorizedSignatorySection from "./sections/AuthorizedSignatorySection";
import BranchSelectionSection from "./sections/BranchSelectionSection";
import EntityTypeSection from "./sections/EntityTypeSection";
import GstSelectionSection from "./sections/GstSelectionSection";
import {
  DEFAULT_BUSINESS_ENTITY_TYPE,
  SHOW_PROPRIETORSHIP_SIGNATORY,
} from "./signatory/constants";
import { isSignatoryStepComplete } from "./signatory/helpers";
import type { BusinessEntityType, SignatoryDetails, SignatoryMode } from "./signatory/types";
import { useBusinessDetailsFlow } from "./useBusinessDetailsFlow";

type BusinessDetailsStepProps = {
  onBack: () => void;
  onContinue: (nextStep?: string | null) => void;
};

const BusinessDetailsStep = ({
  onBack,
  onContinue,
}: BusinessDetailsStepProps): ReactElement => {
  const {
    records,
    selectedBranch,
    branchOptions,
    stateOptions,
    isLoading,
    isSaving,
    isValidatingGst,
    isUploading,
    error,
    canContinue,
    addGstModalOpen,
    openAddGstModal,
    closeAddGstModal,
    selectBranch,
    toggleGstSelection,
    selectAllGst,
    addManualGst,
    validateGstNumber,
    uploadGstDocument,
    uploadGstDocumentForRecord,
    saveBusinessDetails,
  } = useBusinessDetailsFlow();

  const [entityType, setEntityType] = useState<BusinessEntityType>(DEFAULT_BUSINESS_ENTITY_TYPE);
  const [signatories, setSignatories] = useState<SignatoryDetails[]>([]);
  const [signatoryMode, setSignatoryMode] = useState<SignatoryMode>("jointly");
  const [anySignatoryCount, setAnySignatoryCount] = useState(1);
  const [signatoryModalOpen, setSignatoryModalOpen] = useState(false);
  const [editingSignatory, setEditingSignatory] = useState<SignatoryDetails | null>(null);
  const [viewingSignatory, setViewingSignatory] = useState<SignatoryDetails | null>(null);

  const canContinueWithSignatory = SHOW_PROPRIETORSHIP_SIGNATORY
    ? !isLoading &&
      canContinue &&
      isSignatoryStepComplete(signatories, signatoryMode, anySignatoryCount)
    : canContinue;

  if (!SHOW_PROPRIETORSHIP_SIGNATORY && isLoading) {
    return (
      <OnboardingStepSkeleton
        nextLabel="Bank Details"
        progressPercent={20}
        stepLabel="Step 2 of 6"
        subtitle="Your details have been fetched from APMI. Fields shown in grey cannot be changed"
        title="Business Details"
      />
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1240px] space-y-3">
        <section className="space-y-3">
          <header className="space-y-1">
            <h1 className="text-[22px] font-semibold leading-[33px] text-[#231f20]">
              Business Details
            </h1>
            {SHOW_PROPRIETORSHIP_SIGNATORY || records.length > 0 ? (
              <p className="text-[15px] leading-[22.5px] text-[#435160]">
                Your details have been fetched from APMI. Fields shown in grey cannot be changed
              </p>
            ) : null}
          </header>

          <div className="flex items-center justify-between text-xs leading-[18px] text-[#231f20]">
            <span>Step 2 of 6</span>
            <span>20%</span>
          </div>
        </section>

        <section className="overflow-hidden rounded-[16px] bg-white shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)]">
          <div className="h-2 w-full bg-[#e6e7e8]">
            <div className="h-full w-[20%] rounded-r-full bg-[#37b400]" />
          </div>

          <div className="space-y-5 px-4 pb-4 pt-6 md:px-6 md:pb-6">
            {SHOW_PROPRIETORSHIP_SIGNATORY ? (
              <>
                <EntityTypeSection onChange={setEntityType} value={entityType} />

                <div className="h-px bg-[#e5e5e6]" />

                <AuthorizedSignatorySection
                  anyCount={anySignatoryCount}
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
                  onModeChange={(nextMode) => {
                    setSignatoryMode(nextMode);
                    if (nextMode === "jointly") {
                      setSignatories((current) => current.map((item) => ({ ...item, selected: true })));
                    }
                  }}
                  onRemove={(id) => {
                    setSignatories((current) => {
                      const next = current.filter((item) => item.id !== id);
                      setAnySignatoryCount((count) => Math.min(count, Math.max(next.length, 1)));
                      return next;
                    });
                  }}
                  onToggleSelected={(id) => {
                    if (signatoryMode === "jointly") {
                      return;
                    }
                    setSignatories((current) => {
                      const next = current.map((item) =>
                        item.id === id ? { ...item, selected: !item.selected } : item,
                      );
                      const selectedCount = next.filter((item) => item.selected).length;
                      setAnySignatoryCount((count) => Math.min(count, Math.max(selectedCount, 1)));
                      return next;
                    });
                  }}
                  onView={setViewingSignatory}
                  signatories={signatories}
                />

                <div className="h-px bg-[#e5e5e6]" />
              </>
            ) : null}

            <GstSelectionSection
              isUploading={isUploading}
              mode={records.length > 0 ? "selection" : "empty"}
              onOpenAddGst={openAddGstModal}
              onSelectAll={selectAllGst}
              onToggleRecord={toggleGstSelection}
              onUploadForRecord={(id, file) => {
                void uploadGstDocumentForRecord(id, file);
              }}
              records={records}
            />

            <div className="h-px bg-[#e5e5e6]" />

            <BranchSelectionSection
              onSelectBranch={selectBranch}
              options={branchOptions}
              selectedBranch={selectedBranch}
            />

            {error ? <p className="text-sm text-[#e2585f]">{error}</p> : null}
          </div>
        </section>
      </div>

      <OnboardingStepFooter
        nextLabel="Bank Details"
        onPrevious={onBack}
        previousDisabled={isSaving}
        continueDisabled={!canContinueWithSignatory}
        isLoading={isSaving}
        loadingLabel="Saving..."
        onContinue={() => {
          void (async () => {
            const result = await saveBusinessDetails();
            if (!result) {
              return;
            }
            onContinue(result.nextStep);
          })();
        }}
      />

      <AddGstModal
        isUploading={isUploading}
        isValidatingGst={isValidatingGst}
        onOpenChange={(open) => {
          if (open) {
            openAddGstModal();
            return;
          }
          closeAddGstModal();
        }}
        onSave={addManualGst}
        onUploadFile={uploadGstDocument}
        onValidateGst={validateGstNumber}
        existingGstNumbers={records.map((record) => record.gstNumber)}
        open={addGstModalOpen}
        stateOptions={stateOptions}
      />

      {SHOW_PROPRIETORSHIP_SIGNATORY ? (
        <>
          <AddSignatoryModal
            editing={editingSignatory}
            existing={signatories}
            onClose={() => {
              setSignatoryModalOpen(false);
              setEditingSignatory(null);
            }}
            onSave={(signatory) => {
              setSignatories((current) => {
                const exists = current.some((item) => item.id === signatory.id);
                if (exists) {
                  return current.map((item) => (item.id === signatory.id ? signatory : item));
                }
                return [
                  ...current,
                  {
                    ...signatory,
                    selected: signatoryMode === "jointly" ? true : signatory.selected,
                  },
                ];
              });
              setSignatoryModalOpen(false);
              setEditingSignatory(null);
            }}
            open={signatoryModalOpen}
          />

          <ViewSignatoryDocumentsModal
            onClose={() => {
              setViewingSignatory(null);
            }}
            open={Boolean(viewingSignatory)}
            signatory={viewingSignatory}
          />
        </>
      ) : null}
    </>
  );
};

export default BusinessDetailsStep;
