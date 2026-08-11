/* eslint-disable react-hooks/set-state-in-effect */
import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

import OnboardingStepSkeleton from "../../components/OnboardingStepSkeleton";
import { NomineeDetailsScreen } from "./NomineeDetailsScreen";
import { formatDate, getAge, getSafeDobParts } from "./helpers";
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
    applicantPermanentAddress,
    isMinor,
    canProceed,
    setOption,
    updateField,
    handleAddressSync,
    handleGuardianSync,
    submitNominee,
  } = useNomineeFlow();

  const [isEditMode, setIsEditMode] = useState(initialIsEditMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [showNomineeAddressModal, setShowNomineeAddressModal] = useState(false);
  const [showGuardianAddressModal, setShowGuardianAddressModal] = useState(false);
  const [nomineeAddressModalAnimating, setNomineeAddressModalAnimating] = useState(false);
  const [guardianAddressModalAnimating, setGuardianAddressModalAnimating] = useState(false);

  const [showDobPicker, setShowDobPicker] = useState(false);
  const [dobPickerAnimating, setDobPickerAnimating] = useState(false);
  const [selectedDay, setSelectedDay] = useState("01");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState((new Date().getFullYear() - 18).toString());

  const [showProofDropdown, setShowProofDropdown] = useState(false);
  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);
  const proofDropdownRef = useRef<HTMLDivElement>(null);
  const relationshipDropdownRef = useRef<HTMLDivElement>(null);

  const [nomineeAddressSearch, setNomineeAddressSearch] = useState("");
  const [nomineeAddressDetails, setNomineeAddressDetails] = useState("");
  const [guardianAddressSearch, setGuardianAddressSearch] = useState("");
  const [guardianAddressDetails, setGuardianAddressDetails] = useState("");

  useEffect(() => {
    setIsEditMode(initialIsEditMode);
  }, [initialIsEditMode]);

  useEffect(() => {
    setNomineeAddressDetails(form.nomineeAddress);
  }, [form.nomineeAddress]);

  useEffect(() => {
    setGuardianAddressDetails(form.guardianAddress);
  }, [form.guardianAddress]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        showProofDropdown &&
        proofDropdownRef.current &&
        !proofDropdownRef.current.contains(target)
      ) {
        setShowProofDropdown(false);
      }

      if (
        showRelationshipDropdown &&
        relationshipDropdownRef.current &&
        !relationshipDropdownRef.current.contains(target)
      ) {
        setShowRelationshipDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showProofDropdown, showRelationshipDropdown]);

  const handleSetNomineeOption = (next: "later" | "now") => {
    setOption(next);
  };

  const handleSetNomineeIsMinor = (value: "yes" | "no") => {
    const now = new Date();

    if (value === "yes") {
      const currentAge = getAge(form.dateOfBirth);
      if (currentAge === null || currentAge >= 18) {
        const forcedMinorDate = new Date(now.getFullYear() - 17, 0, 1);
        updateField("dateOfBirth", formatDate(forcedMinorDate));
        setSelectedDay("01");
        setSelectedMonth("01");
        setSelectedYear((now.getFullYear() - 17).toString());
      }
      return;
    }

    const currentAge = getAge(form.dateOfBirth);
    if (currentAge === null || currentAge < 18) {
      const forcedAdultDate = new Date(now.getFullYear() - 18, 0, 1);
      updateField("dateOfBirth", formatDate(forcedAdultDate));
      setSelectedDay("01");
      setSelectedMonth("01");
      setSelectedYear((now.getFullYear() - 18).toString());
    }
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
    setNomineeAddressSearch("");
    setNomineeAddressDetails(
      form.nomineeAddress || applicantPermanentAddress,
    );
    setShowNomineeAddressModal(true);
    setTimeout(() => setNomineeAddressModalAnimating(true), 10);
  };

  const handleCloseNomineeAddressModal = () => {
    setNomineeAddressModalAnimating(false);
    setTimeout(() => setShowNomineeAddressModal(false), 200);
  };

  const handleSaveNomineeAddress = () => {
    const resolved = form.isNomineeAddressSameAsApplicantAddress
      ? applicantPermanentAddress
      : nomineeAddressDetails.trim() || nomineeAddressSearch.trim() || form.nomineeAddress;

    if (resolved.trim()) {
      updateField("nomineeAddress", resolved.trim());
      setNomineeAddressDetails(resolved.trim());

      if (form.isGuardianAddressSameAsNomineeAddress && isMinor) {
        updateField("guardianAddress", resolved.trim());
        setGuardianAddressDetails(resolved.trim());
      }
    }

    handleCloseNomineeAddressModal();
  };

  const handleOpenGuardianAddressModal = () => {
    setGuardianAddressSearch("");
    setGuardianAddressDetails(
      form.guardianAddress || form.nomineeAddress || applicantPermanentAddress,
    );
    setShowGuardianAddressModal(true);
    setTimeout(() => setGuardianAddressModalAnimating(true), 10);
  };

  const handleCloseGuardianAddressModal = () => {
    setGuardianAddressModalAnimating(false);
    setTimeout(() => setShowGuardianAddressModal(false), 200);
  };

  const handleSaveGuardianAddress = () => {
    const resolved = form.isGuardianAddressSameAsNomineeAddress
      ? form.nomineeAddress
      : guardianAddressDetails.trim() || guardianAddressSearch.trim() || form.guardianAddress;

    if (resolved.trim()) {
      updateField("guardianAddress", resolved.trim());
      setGuardianAddressDetails(resolved.trim());
    }

    handleCloseGuardianAddressModal();
  };

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
        setNomineeProofType={(value) => updateField("proofOfIdentityType", value)}
        nomineeProofNumber={form.proofOfIdentityNumber}
        setNomineeProofNumber={(value) => updateField("proofOfIdentityNumber", value)}
        nomineeMobileCountry="+91 (IND)"
        nomineeMobile={form.mobileNumber}
        setNomineeMobile={(value) =>
          updateField("mobileNumber", value.replace(/\D/g, "").slice(0, 10))
        }
        nomineeEmail={form.emailId}
        setNomineeEmail={(value) => updateField("emailId", value.trimStart())}
        nomineeIsMinor={isMinor ? "yes" : "no"}
        setNomineeIsMinor={handleSetNomineeIsMinor}
        nomineeDob={form.dateOfBirth}
        nomineeAddress={form.nomineeAddress}
        guardianName={form.guardianName}
        setGuardianName={(value) => updateField("guardianName", value)}
        guardianAddress={form.guardianAddress}
        showProofDropdown={showProofDropdown}
        setShowProofDropdown={setShowProofDropdown}
        proofDropdownRef={proofDropdownRef}
        showRelationshipDropdown={showRelationshipDropdown}
        setShowRelationshipDropdown={setShowRelationshipDropdown}
        relationshipDropdownRef={relationshipDropdownRef}
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
        showNomineeAddressModal={showNomineeAddressModal}
        nomineeAddressModalAnimating={nomineeAddressModalAnimating}
        sameAsApplicant={form.isNomineeAddressSameAsApplicantAddress}
        setSameAsApplicant={handleAddressSync}
        nomineeAddressSearch={nomineeAddressSearch}
        setNomineeAddressSearch={setNomineeAddressSearch}
        nomineeAddressDetails={nomineeAddressDetails}
        setNomineeAddressDetails={setNomineeAddressDetails}
        permanentAddress={applicantPermanentAddress || "Applicant permanent address not available"}
        handleOpenNomineeAddressModal={handleOpenNomineeAddressModal}
        handleCloseNomineeAddressModal={handleCloseNomineeAddressModal}
        handleSaveNomineeAddress={handleSaveNomineeAddress}
        showGuardianAddressModal={showGuardianAddressModal}
        guardianAddressModalAnimating={guardianAddressModalAnimating}
        sameAsNominee={form.isGuardianAddressSameAsNomineeAddress}
        setSameAsNominee={handleGuardianSync}
        guardianAddressSearch={guardianAddressSearch}
        setGuardianAddressSearch={setGuardianAddressSearch}
        guardianAddressDetails={guardianAddressDetails}
        setGuardianAddressDetails={setGuardianAddressDetails}
        handleOpenGuardianAddressModal={handleOpenGuardianAddressModal}
        handleCloseGuardianAddressModal={handleCloseGuardianAddressModal}
        handleSaveGuardianAddress={handleSaveGuardianAddress}
        isEditMode={isEditMode}
        isTransitioning={isTransitioning || isSaving}
        canProceed={canProceed && !isSaving}
        setIsTransitioning={setIsTransitioning}
        setCurrentStep={setCurrentStep}
        setIsEditMode={setIsEditMode}
      />
    </>
  );
};

export default NomineeStep;
