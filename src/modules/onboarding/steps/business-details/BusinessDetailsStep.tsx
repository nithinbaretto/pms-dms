import type { ReactElement } from "react";
import { useState } from "react";

import OnboardingStepFooter from "../../components/OnboardingStepFooter";
import OnboardingStepSkeleton from "../../components/OnboardingStepSkeleton";
import { useOnboardingStore } from "../../state/onboarding-store";
import AddGstModal from "./modals/AddGstModal";
import AddSignatoryModal from "./modals/AddSignatoryModal";
import ViewSignatoryDocumentsModal from "./modals/ViewSignatoryDocumentsModal";
import AuthorizedSignatorySection from "./sections/AuthorizedSignatorySection";
import BranchSelectionSection from "./sections/BranchSelectionSection";
import EntityTypeSection from "./sections/EntityTypeSection";
import GstSelectionSection from "./sections/GstSelectionSection";
import {
  isPmsIndividualEntityTypeLocked,
  shouldShowAuthorizedSignatory,
} from "./signatory/constants";
import { isSignatoryStepComplete } from "./signatory/helpers";
import type { SignatoryDetails } from "./signatory/types";
import { useBusinessDetailsFlow } from "./useBusinessDetailsFlow";

type BusinessDetailsStepProps = {
  onBack: () => void;
  onContinue: (nextStep?: string | null) => void;
  isEditMode?: boolean;
};

const BusinessDetailsStep = ({
  onBack,
  onContinue,
  isEditMode = false,
}: BusinessDetailsStepProps): ReactElement => {
  const setStep = useOnboardingStore((state) => state.setStep);
  const currentFlow = useOnboardingStore((state) => state.currentFlow);
  const onboardingMethod = useOnboardingStore((state) => state.onboardingMethod);
  const personalEntityType =
    useOnboardingStore((state) => state.personalDetails?.personalDetails.entityType) ?? "";
  const isAifManualFlow = currentFlow === "aif-individual" && onboardingMethod === "MANUAL";
  const isAmfiFetchedFlow =
    currentFlow === "aif-individual" &&
    (onboardingMethod === "ARN" || onboardingMethod === "KRA");
  const isEntityTypeLocked = isPmsIndividualEntityTypeLocked(currentFlow);
  const subtitle = isAifManualFlow
    ? "Please enter the details below to continue"
    : `Your details have been fetched from ${isAmfiFetchedFlow ? "AMFI" : "APMI"}. Fields shown in grey cannot be changed`;

  const {
    records,
    selectedBranch,
    branchOptions,
    stateOptions,
    entityType,
    signatories,
    signatoryMode,
    anySignatoryCount,
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
    setEntityType,
    setSignatories,
    setSignatoryMode,
    setAnySignatoryCount,
    toggleGstSelection,
    selectAllGst,
    addManualGst,
    validateGstNumber,
    uploadGstDocument,
    uploadGstDocumentForRecord,
    uploadSignatoryDocument,
    saveBusinessDetails,
  } = useBusinessDetailsFlow();

  const [signatoryModalOpen, setSignatoryModalOpen] = useState(false);
  const [editingSignatory, setEditingSignatory] = useState<SignatoryDetails | null>(null);
  const [viewingSignatory, setViewingSignatory] = useState<SignatoryDetails | null>(null);

  const showSignatory = shouldShowAuthorizedSignatory(personalEntityType, entityType);
  const canContinueWithSignatory = showSignatory
    ? !isLoading &&
    canContinue &&
    isSignatoryStepComplete(signatories, signatoryMode, anySignatoryCount)
    : canContinue;

  if (!showSignatory && isLoading) {
    return (
      <OnboardingStepSkeleton
        nextLabel="Bank Details"
        progressPercent={20}
        stepLabel="Step 2 of 6"
        subtitle={subtitle}
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
            {(showSignatory || records.length >= 0) ? (
              <p className="text-[15px] leading-[22.5px] text-[#435160]">
                {subtitle}
              </p>
            ) : null}
          </header>

          <div className="flex items-center justify-between text-xs leading-[18px] text-[#231f20]">
            <span>Step 2 of 6</span>
            <span>20%</span>
          </div>
        </section>

        <section
          className={`overflow-hidden rounded-[16px] bg-white shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] ${
            records.length === 0 ? "mb-10" : ""
          }`}
        >
          <div className="h-2 w-full bg-[#e6e7e8]">
            <div className="h-full w-[20%] rounded-r-full bg-[#37b400]" />
          </div>

          <div className="px-4 pb-4 pt-6 md:px-6 md:pb-6">
            <div className="space-y-5">
              <>
                <EntityTypeSection
                  disabled={isEntityTypeLocked}
                  onChange={setEntityType}
                  showSelectionCaption={!isEntityTypeLocked}
                  value={entityType}
                />
                <div className="h-px bg-[#e5e5e6]" />
              </>

              {showSignatory ? (
                <>
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
            </div>

            {error ? <p className="mt-2 text-[13px] leading-[18px] text-[#e2585f]">{error}</p> : null}
          </div>
        </section>
      </div>

      <OnboardingStepFooter
        nextLabel="Bank Details"
        nextClickable={isEditMode}
        onNextClick={() => {
          setStep("bank-details");
        }}
        onPrevious={onBack}
        previousDisabled={isSaving}
        continueLabel={isEditMode ? "Go to Review" : "Continue"}
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

      {showSignatory ? (
        <>
          <AddSignatoryModal
            editing={editingSignatory}
            existing={signatories}
            isUploading={isUploading}
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
            uploadAddressFile={(file) => uploadSignatoryDocument(file, "address")}
            uploadIdentityFile={(file) => uploadSignatoryDocument(file, "identity")}
            uploadSignatureFile={(file) => uploadSignatoryDocument(file, "signature")}
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
