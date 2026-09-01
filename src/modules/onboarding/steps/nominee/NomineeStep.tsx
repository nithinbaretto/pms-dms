/* eslint-disable react-hooks/set-state-in-effect */
import type { ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import OnboardingStepSkeleton from "../../components/OnboardingStepSkeleton";
import CorrespondenceAddressModal from "../personal-details/modals/CorrespondenceAddressModal";
import { NomineeDetailsScreen } from "./NomineeDetailsScreen";
import { addressFromLine, getSafeDobParts, sanitizeProofNumber } from "./helpers";
import { useNomineeFlow } from "./useNomineeFlow";

type NomineeStepProps = {
  onBack: () => void;
  onContinue: () => void;
  onGoToReview?: () => void;
  isEditMode?: boolean;
};

const NomineeStep = ({
  onBack,
  onContinue,
  onGoToReview,
  isEditMode: initialIsEditMode = false,
}: NomineeStepProps): ReactElement => {
  const {
    form,
    option,
    isLoading,
    isSaving,
    error,
    applicantPermanentAddressModel,
    isMinor,
    canProceed,
    setOption,
    updateField,
    saveNomineeAddress,
    saveGuardianAddress,
    handleGuardianSync,
    submitNominee,
  } = useNomineeFlow();

  const [isEditMode, setIsEditMode] = useState(initialIsEditMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [showNomineeAddressModal, setShowNomineeAddressModal] = useState(false);
  const [showGuardianAddressModal, setShowGuardianAddressModal] = useState(false);

  const [showDobPicker, setShowDobPicker] = useState(false);
  const [dobPickerAnimating, setDobPickerAnimating] = useState(false);
  const [selectedDay, setSelectedDay] = useState("01");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState((new Date().getFullYear() - 18).toString());

  const [showProofDropdown, setShowProofDropdown] = useState(false);
  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);
  const proofDropdownRef = useRef<HTMLDivElement>(null);
  const proofDropdownMobileRef = useRef<HTMLDivElement>(null);
  const relationshipDropdownRef = useRef<HTMLDivElement>(null);
  const relationshipDropdownMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsEditMode(initialIsEditMode);
  }, [initialIsEditMode]);

  useEffect(() => {
    const isInside = (target: Node, ...refs: Array<{ current: HTMLDivElement | null }>) =>
      refs.some((ref) => Boolean(ref.current?.contains(target)));

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (showProofDropdown && !isInside(target, proofDropdownRef, proofDropdownMobileRef)) {
        setShowProofDropdown(false);
      }

      if (
        showRelationshipDropdown &&
        !isInside(target, relationshipDropdownRef, relationshipDropdownMobileRef)
      ) {
        setShowRelationshipDropdown(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showProofDropdown, showRelationshipDropdown]);

  const handleSetNomineeOption = (next: "later" | "now") => {
    setOption(next);
  };

  const handleOpenDobPicker = () => {
    const parts = getSafeDobParts(form.dateOfBirth);
    setSelectedDay(parts.day);
    setSelectedMonth(parts.month);
    setSelectedYear(parts.year);
    setShowDobPicker(true);
    setTimeout(() => setDobPickerAnimating(true), 10);
  };

  const handleCloseDobPicker = () => {
    setDobPickerAnimating(false);
    setTimeout(() => setShowDobPicker(false), 200);
  };

  const handleSaveDob = () => {
    updateField("dateOfBirth", `${selectedDay}/${selectedMonth}/${selectedYear}`);
    handleCloseDobPicker();
  };

  const handleOpenNomineeAddressModal = () => {
    setShowNomineeAddressModal(true);
  };

  const handleOpenGuardianAddressModal = () => {
    setShowGuardianAddressModal(true);
  };

  const nomineeAddressModel = useMemo(() => {
    if (form.isNomineeAddressSameAsApplicantAddress) {
      return applicantPermanentAddressModel;
    }

    return addressFromLine(form.nomineeAddress);
  }, [
    applicantPermanentAddressModel,
    form.isNomineeAddressSameAsApplicantAddress,
    form.nomineeAddress,
  ]);

  const guardianAddressModel = useMemo(() => {
    if (form.isGuardianAddressSameAsNomineeAddress) {
      return nomineeAddressModel;
    }

    return addressFromLine(form.guardianAddress);
  }, [
    form.guardianAddress,
    form.isGuardianAddressSameAsNomineeAddress,
    nomineeAddressModel,
  ]);

  const setCurrentStep = (step: string) => {
    if (step === "bank-details") {
      onBack();
      return;
    }

    void (async () => {
      if (isSaving) {
        return;
      }

      const result = await submitNominee();
      if (!result) {
        return;
      }

      if (step === "review-confirm") {
        if (onGoToReview) {
          onGoToReview();
        } else {
          onContinue();
        }
        return;
      }

      if (step === "upload-documents") {
        if (isEditMode && onGoToReview) {
          onGoToReview();
          return;
        }
        onContinue();
      }
    })();
  };

  if (isLoading) {
    return (
      <OnboardingStepSkeleton
        nextLabel="Upload Documents"
        progressPercent={65}
        stepLabel="Step 4 of 6"
        subtitle="Add nominee details for this application."
        title="Nominee Details"
      />
    );
  }

  return (
    <>
      {error ? (
        <div className="mx-auto mb-3 w-full max-w-[1240px]">
          <p className="text-sm text-[#e2585f]">{error}</p>
        </div>
      ) : null}

      <NomineeDetailsScreen
        nomineeOption={option}
        setNomineeOption={handleSetNomineeOption}
        nomineeName={form.nomineeName}
        setNomineeName={(value) => updateField("nomineeName", value)}
        nomineeRelationship={form.relationshipWithApplicant}
        setNomineeRelationship={(value) => updateField("relationshipWithApplicant", value)}
        nomineeProofType={form.proofOfIdentityType}
        setNomineeProofType={(value) => {
          updateField("proofOfIdentityType", value);
          updateField("proofOfIdentityNumber", "");
        }}
        nomineeProofNumber={form.proofOfIdentityNumber}
        setNomineeProofNumber={(value) =>
          updateField("proofOfIdentityNumber", sanitizeProofNumber(form.proofOfIdentityType, value))
        }
        nomineeMobileCountry="+91 (IND)"
        nomineeMobile={form.mobileNumber}
        setNomineeMobile={(value) =>
          updateField("mobileNumber", value.replace(/\D/g, "").slice(0, 10))
        }
        nomineeEmail={form.emailId}
        setNomineeEmail={(value) => updateField("emailId", value.trimStart())}
        nomineeIsMinor={isMinor ? "yes" : "no"}
        nomineeDob={form.dateOfBirth}
        nomineeAddress={form.nomineeAddress}
        guardianName={form.guardianName}
        setGuardianName={(value) => updateField("guardianName", value)}
        guardianAddress={form.guardianAddress}
        sameAsNomineeAddress={form.isGuardianAddressSameAsNomineeAddress}
        onSameAsNomineeAddressChange={handleGuardianSync}
        showProofDropdown={showProofDropdown}
        setShowProofDropdown={setShowProofDropdown}
        proofDropdownRef={proofDropdownRef}
        proofDropdownMobileRef={proofDropdownMobileRef}
        showRelationshipDropdown={showRelationshipDropdown}
        setShowRelationshipDropdown={setShowRelationshipDropdown}
        relationshipDropdownRef={relationshipDropdownRef}
        relationshipDropdownMobileRef={relationshipDropdownMobileRef}
        showDobPicker={showDobPicker}
        dobPickerAnimating={dobPickerAnimating}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        handleOpenDobPicker={handleOpenDobPicker}
        handleCloseDobPicker={handleCloseDobPicker}
        handleSaveDob={handleSaveDob}
        handleOpenNomineeAddressModal={handleOpenNomineeAddressModal}
        handleOpenGuardianAddressModal={handleOpenGuardianAddressModal}
        isEditMode={isEditMode}
        isTransitioning={isTransitioning || isSaving}
        canProceed={canProceed && !isSaving}
        setIsTransitioning={setIsTransitioning}
        setCurrentStep={setCurrentStep}
        setIsEditMode={setIsEditMode}
      />

      <CorrespondenceAddressModal
        initialAddress={nomineeAddressModel}
        initialSameAsPermanent={form.isNomineeAddressSameAsApplicantAddress}
        onCancel={() => {
          setShowNomineeAddressModal(false);
        }}
        onSave={(address, sameAsApplicant) => {
          saveNomineeAddress(address, sameAsApplicant);
          setShowNomineeAddressModal(false);
        }}
        open={showNomineeAddressModal}
        permanentAddress={applicantPermanentAddressModel}
        sameAsLabel="Same as applicant's address"
        title="Nominee Address"
      />

      <CorrespondenceAddressModal
        initialAddress={guardianAddressModel}
        initialSameAsPermanent={form.isGuardianAddressSameAsNomineeAddress}
        onCancel={() => {
          setShowGuardianAddressModal(false);
        }}
        onSave={(address, sameAsNominee) => {
          saveGuardianAddress(address, sameAsNominee);
          setShowGuardianAddressModal(false);
        }}
        open={showGuardianAddressModal}
        permanentAddress={nomineeAddressModel}
        sameAsLabel="Same as nominee address"
        title="Guardian Address"
      />
    </>
  );
};

export default NomineeStep;
