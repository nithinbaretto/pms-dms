/* eslint-disable react-hooks/set-state-in-effect */
import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

import OnboardingStepSkeleton from "../../components/OnboardingStepSkeleton";
import { BankDetailsScreen } from "./BankDetailsScreen";
import { formatAccountTypeLabel } from "./helpers";
import { useBankDetailsFlow } from "./useBankDetailsFlow";
import type { BankValidationStatus } from "./types";

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
  const {
    data,
    isLoading,
    isValidating,
    isSaving,
    error,
    bankValidationStatus,
    qrSession,
    qrCaptureToken,
    validateApmiBankDetails,
    validateManualPennyDrop,
    initiateQrPayment,
    checkQrPaymentStatus,
    stopQrPolling,
    saveBankDetails,
    setBankValidationStatus,
  } = useBankDetailsFlow();

  const [isEditMode, setIsEditMode] = useState(initialIsEditMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  useEffect(() => {
    if (!data.hasBankData) {
      return;
    }

    setManualAccountNumber(data.accountNumber);
    setManualIfscCode(data.ifscCode);
    setManualErrorReenterAccountNumber(data.accountNumber);
    setManualErrorAccountHolderName(data.accountHolderName);
    setManualErrorBankBranch(data.branchDisplay || data.bankAddress || data.branchName);
    if (data.accountType === "current" || data.accountType === "saving") {
      setManualErrorAccountType(data.accountType);
    }
  }, [data]);

  useEffect(() => {
    setManualBankValidating(isValidating && changeBankTab === "manual" && showChangeBankScreen);
  }, [changeBankTab, isValidating, showChangeBankScreen]);

  const previousValidationStatusRef = useRef<BankValidationStatus>(bankValidationStatus);
  const lastClosedQrCaptureTokenRef = useRef(0);

  const closeChangeBankUi = () => {
    stopQrPolling();
    setShowChangeBankScreen(false);
    setQrGenerated(false);
    setQrTimer(213);
    setManualBankValidating(false);
    setShowLoadingModal(false);
    setLoadingModalAnimating(false);
  };

  // Close change-bank UI only when validation newly becomes success (e.g. QR poll),
  // not when opening Change Bank Account while already verified.
  useEffect(() => {
    const previousStatus = previousValidationStatusRef.current;
    previousValidationStatusRef.current = bankValidationStatus;

    if (
      showChangeBankScreen &&
      bankValidationStatus === "success" &&
      previousStatus !== "success"
    ) {
      closeChangeBankUi();
    }
  }, [bankValidationStatus, showChangeBankScreen, stopQrPolling]);

  // Always return to bank main page after a successful reverse-penny-drop capture,
  // even if validation was already "success" before opening Change Bank.
  useEffect(() => {
    if (!showChangeBankScreen || qrCaptureToken <= 0) {
      return;
    }
    if (qrCaptureToken === lastClosedQrCaptureTokenRef.current) {
      return;
    }
    lastClosedQrCaptureTokenRef.current = qrCaptureToken;
    closeChangeBankUi();
  }, [qrCaptureToken, showChangeBankScreen, stopQrPolling]);

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

  const navigateAfterSave = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (isEditMode) {
        setCurrentStep("review-confirm");
        setIsEditMode(false);
      } else {
        setCurrentStep("nominee-details");
      }
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const handleSaveAndContinue = async () => {
    if (isSaving || isTransitioning) {
      return;
    }

    const canContinue =
      bankValidationStatus === "success" || (bankValidationStatus === "failed" && chequeUploaded);
    if (!canContinue) {
      return;
    }

    const result = await saveBankDetails({
      cancelledCheque: chequeUploaded ? "uploaded" : "",
      isBankVerifiedOverride: bankValidationStatus === "success" ? true : false,
    });

    if (!result) {
      return;
    }

    navigateAfterSave();
  };

  const handleManualValidate = async () => {
    const result = await validateManualPennyDrop(manualAccountNumber, manualIfscCode);

    if (result.success) {
      setShowManualValidationError(false);
      setChequeUploaded(false);
      setManualErrorChequeUploaded(false);
      setManualErrorReenterAccountNumber(result.data.accountNumber);
      setManualErrorAccountHolderName(result.data.accountHolderName);
      setManualErrorBankBranch(result.data.branchDisplay || result.data.bankAddress);
      if (result.data.accountType === "current" || result.data.accountType === "saving") {
        setManualErrorAccountType(result.data.accountType);
      }
      closeChangeBankUi();
      return;
    }

    setShowManualValidationError(true);
    setChequeUploaded(false);
    setManualErrorChequeUploaded(false);
    setManualErrorReenterAccountNumber("");
    setManualErrorAccountHolderName(result.data.accountHolderName || "");
    setManualErrorBankBranch("");
  };

  const handleQrGenerate = async () => {
    const session = await initiateQrPayment();
    if (!session) {
      setQrGenerated(false);
      return;
    }

    setQrGenerated(true);
    setQrTimer(session.expiresInSeconds || 600);
  };

  const handleQrPayment = async () => {
    if (!qrGenerated || qrTimer <= 0) {
      return;
    }

    setShowLoadingModal(true);
    setTimeout(() => setLoadingModalAnimating(true), 10);

    const status = await checkQrPaymentStatus();

    setLoadingModalAnimating(false);
    setTimeout(() => {
      setShowLoadingModal(false);
      if (status === "success") {
        closeChangeBankUi();
      } else if (status === "expired") {
        setQrGenerated(false);
        setQrTimer(0);
      }
    }, 200);
  };

  if (isLoading) {
    return (
      <OnboardingStepSkeleton
        title="Bank Details"
        subtitle="Your details have been fetched from APMI. Fields shown in grey cannot be changed"
        stepLabel="Step 3 of 6"
        progressPercent={50}
        fieldRows={4}
        nextLabel="Nominee Details"
      />
    );
  }

  return (
    <>
      {error ? (
        <div className="mx-auto mb-3 w-full max-w-[1240px] rounded-[8px] border border-[#f0d0d0] bg-[#fff1e2] px-4 py-3">
          <p className="font-['Mulish',sans-serif] text-[13px] leading-[19.5px] text-[#93161e]">{error}</p>
        </div>
      ) : null}
      <BankDetailsScreen
        accountHolderName={data.accountHolderName}
        accountNumber={data.accountNumber}
        accountTypeLabel={formatAccountTypeLabel(data.bankType, data.accountType)}
        bankName={data.bankName}
        bankValidationStatus={bankValidationStatus}
        branchDisplay={data.branchDisplay}
        changeBankTab={changeBankTab}
        chequeFileSelected={chequeFileSelected}
        chequePreviewModalAnimating={chequePreviewModalAnimating}
        chequeUploadModalAnimating={chequeUploadModalAnimating}
        chequeUploaded={chequeUploaded}
        contactPersonName={data.accountHolderName}
        ifscCode={data.ifscCode}
        isEditMode={isEditMode}
        isSaving={isSaving}
        isTransitioning={isTransitioning || isSaving}
        loadingModalAnimating={loadingModalAnimating}
        manualAccountNumber={manualAccountNumber}
        manualBankValidating={manualBankValidating || isValidating}
        manualErrorAccountHolderName={manualErrorAccountHolderName}
        manualErrorAccountType={manualErrorAccountType}
        manualErrorBankBranch={manualErrorBankBranch}
        manualErrorChequeFileSelected={manualErrorChequeFileSelected}
        manualErrorChequeModalAnimating={manualErrorChequeModalAnimating}
        manualErrorChequeUploaded={manualErrorChequeUploaded}
        manualErrorReenterAccountNumber={manualErrorReenterAccountNumber}
        manualIfscCode={manualIfscCode}
        onApmiValidate={() => {
          void validateApmiBankDetails();
        }}
        onManualValidate={() => {
          void handleManualValidate();
        }}
        onQrGenerate={() => {
          void handleQrGenerate();
        }}
        onQrPayment={() => {
          void handleQrPayment();
        }}
        onSaveAndContinue={() => {
          void handleSaveAndContinue();
        }}
        qrGenerated={qrGenerated}
        qrImageUrl={qrSession?.qrImageUrl || ""}
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
        setShowChangeBankScreen={(value) => {
          if (!value) {
            stopQrPolling();
          }
          setShowChangeBankScreen(value);
        }}
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
    </>
  );
};

export default BankDetailsStep;
