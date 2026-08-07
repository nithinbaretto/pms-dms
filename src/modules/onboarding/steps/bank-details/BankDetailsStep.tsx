/* eslint-disable react-hooks/set-state-in-effect */
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { BankDetailsScreen } from "./BankDetailsScreen";

type BankDetailsStepProps = {
  onBack: () => void;
  onContinue: () => void;
  isEditMode?: boolean;
  onGoToReview?: () => void;
  chequeUploaded?: boolean;
  onChequeUploadedChange?: (value: boolean) => void;
};

const BankDetailsStep = ({
  onBack,
  onContinue,
  isEditMode: initialIsEditMode = false,
  onGoToReview,
  chequeUploaded: initialChequeUploaded = false,
  onChequeUploadedChange,
}: BankDetailsStepProps): ReactElement => {
  const [isEditMode, setIsEditMode] = useState(initialIsEditMode);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bankValidationStatus, setBankValidationStatus] = useState<
    "pending" | "validating" | "success" | "failed"
  >("pending");

  const [chequeUploaded, setChequeUploaded] = useState(initialChequeUploaded);
  const [showChequeUploadModal, setShowChequeUploadModal] = useState(false);
  const [chequeUploadModalAnimating, setChequeUploadModalAnimating] = useState(false);
  const [chequeFileSelected, setChequeFileSelected] = useState(false);
  const [showChequePreviewModal, setShowChequePreviewModal] = useState(false);
  const [chequePreviewModalAnimating, setChequePreviewModalAnimating] = useState(false);

  const [showChangeBankScreen, setShowChangeBankScreen] = useState(false);
  const [changeBankTab, setChangeBankTab] = useState<"qr" | "manual">("qr");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrTimer, setQrTimer] = useState(213);

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingModalAnimating, setLoadingModalAnimating] = useState(false);

  const [manualAccountNumber, setManualAccountNumber] = useState("");
  const [manualIfscCode, setManualIfscCode] = useState("");
  const [manualBankValidating, setManualBankValidating] = useState(false);
  const [showManualValidationError, setShowManualValidationError] = useState(false);

  const [manualErrorReenterAccountNumber, setManualErrorReenterAccountNumber] = useState("");
  const [manualErrorAccountHolderName, setManualErrorAccountHolderName] = useState("");
  const [manualErrorAccountType, setManualErrorAccountType] = useState<"saving" | "current">(
    "saving",
  );
  const [manualErrorBankBranch, setManualErrorBankBranch] = useState("");

  const [manualErrorChequeUploaded, setManualErrorChequeUploaded] = useState(false);
  const [showManualErrorChequeModal, setShowManualErrorChequeModal] = useState(false);
  const [manualErrorChequeModalAnimating, setManualErrorChequeModalAnimating] = useState(false);
  const [manualErrorChequeFileSelected, setManualErrorChequeFileSelected] = useState(false);

  useEffect(() => {
    setIsEditMode(initialIsEditMode);
  }, [initialIsEditMode]);

  useEffect(() => {
    setChequeUploaded(initialChequeUploaded);
  }, [initialChequeUploaded]);

  useEffect(() => {
    onChequeUploadedChange?.(chequeUploaded);
  }, [chequeUploaded, onChequeUploadedChange]);

  const setCurrentStep = (step: string) => {
    if (step === "business-details") {
      onBack();
      return;
    }

    if (step === "review-confirm" && isEditMode && onGoToReview) {
      onGoToReview();
      return;
    }

    if (step === "nominee-details" || step === "review-confirm") {
      onContinue();
    }
  };

  return (
    <BankDetailsScreen
      bankValidationStatus={bankValidationStatus}
      changeBankTab={changeBankTab}
      chequeFileSelected={chequeFileSelected}
      chequePreviewModalAnimating={chequePreviewModalAnimating}
      chequeUploadModalAnimating={chequeUploadModalAnimating}
      chequeUploaded={chequeUploaded}
      contactPersonName="Rajesh Gupta"
      isEditMode={isEditMode}
      isTransitioning={isTransitioning}
      loadingModalAnimating={loadingModalAnimating}
      manualAccountNumber={manualAccountNumber}
      manualBankValidating={manualBankValidating}
      manualErrorAccountHolderName={manualErrorAccountHolderName}
      manualErrorAccountType={manualErrorAccountType}
      manualErrorBankBranch={manualErrorBankBranch}
      manualErrorChequeFileSelected={manualErrorChequeFileSelected}
      manualErrorChequeModalAnimating={manualErrorChequeModalAnimating}
      manualErrorChequeUploaded={manualErrorChequeUploaded}
      manualErrorReenterAccountNumber={manualErrorReenterAccountNumber}
      manualIfscCode={manualIfscCode}
      qrGenerated={qrGenerated}
      qrTimer={qrTimer}
      setBankValidationStatus={setBankValidationStatus}
      setChangeBankTab={setChangeBankTab}
      setChequeFileSelected={setChequeFileSelected}
      setChequePreviewModalAnimating={setChequePreviewModalAnimating}
      setChequeUploadModalAnimating={setChequeUploadModalAnimating}
      setChequeUploaded={setChequeUploaded}
      setCurrentStep={setCurrentStep}
      setIsEditMode={setIsEditMode}
      setIsTransitioning={setIsTransitioning}
      setLoadingModalAnimating={setLoadingModalAnimating}
      setManualAccountNumber={setManualAccountNumber}
      setManualBankValidating={setManualBankValidating}
      setManualErrorAccountHolderName={setManualErrorAccountHolderName}
      setManualErrorAccountType={setManualErrorAccountType}
      setManualErrorBankBranch={setManualErrorBankBranch}
      setManualErrorChequeFileSelected={setManualErrorChequeFileSelected}
      setManualErrorChequeModalAnimating={setManualErrorChequeModalAnimating}
      setManualErrorChequeUploaded={setManualErrorChequeUploaded}
      setManualErrorReenterAccountNumber={setManualErrorReenterAccountNumber}
      setManualIfscCode={setManualIfscCode}
      setQrGenerated={setQrGenerated}
      setQrTimer={setQrTimer}
      setShowChangeBankScreen={setShowChangeBankScreen}
      setShowChequePreviewModal={setShowChequePreviewModal}
      setShowChequeUploadModal={setShowChequeUploadModal}
      setShowLoadingModal={setShowLoadingModal}
      setShowManualErrorChequeModal={setShowManualErrorChequeModal}
      setShowManualValidationError={setShowManualValidationError}
      showChangeBankScreen={showChangeBankScreen}
      showChequePreviewModal={showChequePreviewModal}
      showChequeUploadModal={showChequeUploadModal}
      showLoadingModal={showLoadingModal}
      showManualErrorChequeModal={showManualErrorChequeModal}
      showManualValidationError={showManualValidationError}
    />
  );
};

export default BankDetailsStep;
