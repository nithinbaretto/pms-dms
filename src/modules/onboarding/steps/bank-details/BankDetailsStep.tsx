/* eslint-disable react-hooks/set-state-in-effect */
import type { ReactElement } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import OnboardingStepSkeleton from "../../components/OnboardingStepSkeleton";
import {
  extractFileNameFromUrl,
  resolveDocumentFormat,
  toDisplaySrc,
} from "../documents/helpers";
import { BankDetailsScreen } from "./BankDetailsScreen";
import { formatAccountTypeLabel, formatBranchDisplay } from "./helpers";
import type { BankDetailsModel } from "./types";
import { useBankDetailsFlow } from "./useBankDetailsFlow";

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
  const { leadId, pan, panNumber } = useOnboardingStore();
  const resolvedPan = (pan || panNumber).trim().toUpperCase();

  const {
    data,
    isLoading,
    isValidating,
    isSaving,
    isUploadingCheque,
    error,
    bankValidationStatus,
    qrSession,
    qrCaptureToken,
    isFetchingQrBankDetails,
    validateApmiBankDetails,
    validateManualPennyDrop,
    initiateQrPayment,
    checkQrPaymentStatus,
    stopQrPolling,
    uploadCancelledCheque,
    saveBankDetails,
    setBankValidationStatus,
  } = useBankDetailsFlow();

  const [isEditMode, setIsEditMode] = useState(initialIsEditMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [chequeUploaded, setChequeUploaded] = useState(initialChequeUploaded);
  const [cancelledChequeUrl, setCancelledChequeUrl] = useState("");
  const [cancelledChequeFileName, setCancelledChequeFileName] = useState("");
  const [chequeUploadError, setChequeUploadError] = useState<string | null>(null);

  const [showChequeUploadModal, setShowChequeUploadModal] = useState(false);
  const [chequeUploadModalAnimating, setChequeUploadModalAnimating] = useState(false);
  const [chequeFileSelected, setChequeFileSelected] = useState(false);
  const [showChequePreviewModal, setShowChequePreviewModal] = useState(false);
  const [chequePreviewModalAnimating, setChequePreviewModalAnimating] = useState(false);
  const [chequePreviewDisplayUrl, setChequePreviewDisplayUrl] = useState("");
  const [isLoadingChequePreview, setIsLoadingChequePreview] = useState(false);
  const [chequePreviewError, setChequePreviewError] = useState<string | null>(null);

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

  const previewRequestIdRef = useRef(0);

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

  const lastClosedQrCaptureTokenRef = useRef(0);
  const wasFetchingQrBankDetailsRef = useRef(false);

  const closeChangeBankUi = () => {
    stopQrPolling();
    setShowChangeBankScreen(false);
    setQrGenerated(false);
    setQrTimer(213);
    setManualBankValidating(false);
    setShowLoadingModal(false);
    setLoadingModalAnimating(false);
  };

  const clearChequeUploadState = useCallback(() => {
    setCancelledChequeUrl("");
    setCancelledChequeFileName("");
    setChequeUploadError(null);
    setChequePreviewDisplayUrl("");
    setChequePreviewError(null);
    setChequeUploaded(false);
    setManualErrorChequeUploaded(false);
  }, []);

  // Show "Please wait while we fetch Account Details..." after payment success
  // while reversepennydrop/fetchBankDetails is in flight.
  useEffect(() => {
    if (isFetchingQrBankDetails) {
      wasFetchingQrBankDetailsRef.current = true;
      setShowLoadingModal(true);
      const frame = window.setTimeout(() => setLoadingModalAnimating(true), 10);
      return () => window.clearTimeout(frame);
    }

    if (!wasFetchingQrBankDetailsRef.current) {
      return;
    }

    // Fetch finished without a successful capture — dismiss the loading modal.
    if (bankValidationStatus !== "success") {
      wasFetchingQrBankDetailsRef.current = false;
      setLoadingModalAnimating(false);
      const hideTimer = window.setTimeout(() => setShowLoadingModal(false), 200);
      return () => window.clearTimeout(hideTimer);
    }

    return undefined;
  }, [bankValidationStatus, isFetchingQrBankDetails]);

  // After fetchBankDetails succeeds, dismiss the modal then return to bank details main page.
  useEffect(() => {
    if (!showChangeBankScreen || qrCaptureToken <= 0) {
      return;
    }
    if (qrCaptureToken === lastClosedQrCaptureTokenRef.current) {
      return;
    }
    lastClosedQrCaptureTokenRef.current = qrCaptureToken;
    wasFetchingQrBankDetailsRef.current = false;

    setShowLoadingModal(true);
    setLoadingModalAnimating(true);

    let closeTimer: number | undefined;
    const dismissTimer = window.setTimeout(() => {
      setLoadingModalAnimating(false);
      closeTimer = window.setTimeout(() => {
        closeChangeBankUi();
      }, 200);
    }, 500);

    return () => {
      window.clearTimeout(dismissTimer);
      if (closeTimer !== undefined) {
        window.clearTimeout(closeTimer);
      }
    };
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

  const buildManualOverrideModel = (): BankDetailsModel => {
    const accountNumber =
      manualErrorReenterAccountNumber.trim() || manualAccountNumber.trim() || data.accountNumber;
    const ifscCode = manualIfscCode.trim().toUpperCase() || data.ifscCode;
    const branch = manualErrorBankBranch.trim();
    const accountType = manualErrorAccountType;

    return {
      ...data,
      accountNumber,
      ifscCode,
      accountHolderName: manualErrorAccountHolderName.trim() || data.accountHolderName,
      accountType,
      bankType: accountType === "current" ? "Current" : "Savings",
      bankAddress: branch || data.bankAddress,
      branchName: data.branchName,
      branchDisplay: formatBranchDisplay(data.branchName, branch || data.bankAddress),
      isBankVerified: false,
      hasBankData: Boolean(accountNumber || ifscCode),
    };
  };

  const handleSaveAndContinue = async () => {
    if (isSaving || isTransitioning) {
      return;
    }

    const canContinueMain = bankValidationStatus === "success";
    const canContinueOcr =
      bankValidationStatus === "failed" &&
      showManualValidationError &&
      chequeUploaded &&
      Boolean(cancelledChequeUrl.trim());

    if (!canContinueMain && !canContinueOcr) {
      return;
    }

    if (canContinueOcr && !cancelledChequeUrl.trim()) {
      setChequeUploadError("Please upload a cancelled cheque to continue.");
      return;
    }

    const detailsOverride =
      canContinueOcr || showManualValidationError ? buildManualOverrideModel() : undefined;

    const result = await saveBankDetails({
      cancelledCheque: canContinueOcr ? cancelledChequeUrl.trim() : "",
      isBankVerifiedOverride: bankValidationStatus === "success" ? true : false,
      details: detailsOverride,
    });

    if (!result) {
      return;
    }

    navigateAfterSave();
  };

  const handleUploadCancelledCheque = useCallback(
    async (file: File): Promise<boolean> => {
      setChequeUploadError(null);
      const storageUrl = await uploadCancelledCheque(file);
      if (!storageUrl) {
        setChequeUploadError("Unable to upload cancelled cheque. Please try again.");
        return false;
      }

      setCancelledChequeUrl(storageUrl);
      setCancelledChequeFileName(file.name.trim() || extractFileNameFromUrl(storageUrl, "Cheque.png"));
      setChequeUploaded(true);
      setManualErrorChequeUploaded(true);
      setChequePreviewDisplayUrl("");
      setChequePreviewError(null);
      // OCR API is on hold — keep prefills / user edits as-is.
      return true;
    },
    [uploadCancelledCheque],
  );

  const handleViewCancelledCheque = useCallback(async (): Promise<void> => {
    const downloadLink = cancelledChequeUrl.trim();
    if (!downloadLink || isLoadingChequePreview) {
      return;
    }

    setShowChequePreviewModal(true);
    setTimeout(() => setChequePreviewModalAnimating(true), 10);
    setChequePreviewDisplayUrl("");
    setChequePreviewError(null);

    if (!leadId || !resolvedPan) {
      setChequePreviewError("Unable to open cheque. Missing lead or PAN information.");
      return;
    }

    const requestId = ++previewRequestIdRef.current;
    setIsLoadingChequePreview(true);

    try {
      const fileName =
        cancelledChequeFileName.trim() || extractFileNameFromUrl(downloadLink, "Cheque.png");
      const type = resolveDocumentFormat(fileName || downloadLink);
      const response = await onboardingApi.downloadFile({
        downloadLink,
        fileName,
        leadId,
        panNumber: resolvedPan,
        type,
      });
      if (requestId !== previewRequestIdRef.current) {
        return;
      }
      const displaySrc = toDisplaySrc(response.fileURL, type);
      if (!displaySrc) {
        throw new Error("Document download returned an empty file.");
      }
      setChequePreviewDisplayUrl(displaySrc);
    } catch {
      if (requestId !== previewRequestIdRef.current) {
        return;
      }
      setChequePreviewError("Unable to load cancelled cheque. Please try again.");
    } finally {
      if (requestId === previewRequestIdRef.current) {
        setIsLoadingChequePreview(false);
      }
    }
  }, [
    cancelledChequeFileName,
    cancelledChequeUrl,
    isLoadingChequePreview,
    leadId,
    resolvedPan,
  ]);

  const handleManualValidate = async () => {
    const result = await validateManualPennyDrop(manualAccountNumber, manualIfscCode);

    if (result.success) {
      setShowManualValidationError(false);
      clearChequeUploadState();
      setManualErrorReenterAccountNumber(result.data.accountNumber);
      setManualErrorAccountHolderName(result.data.accountHolderName);
      setManualErrorBankBranch(result.data.branchDisplay || result.data.bankAddress);
      if (result.data.accountType === "current" || result.data.accountType === "saving") {
        setManualErrorAccountType(result.data.accountType);
      }
      closeChangeBankUi();
      return;
    }

    // Prefill OCR / manual override screen from penny-drop response + entered values.
    setShowManualValidationError(true);
    clearChequeUploadState();
    setManualErrorReenterAccountNumber(result.data.accountNumber || manualAccountNumber);
    setManualErrorAccountHolderName(result.data.accountHolderName || "");
    setManualErrorBankBranch(result.data.branchDisplay || result.data.bankAddress || "");
    if (result.data.accountType === "current" || result.data.accountType === "saving") {
      setManualErrorAccountType(result.data.accountType);
    }
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
    if (!qrGenerated || qrTimer <= 0 || isFetchingQrBankDetails) {
      return;
    }

    setShowLoadingModal(true);
    setTimeout(() => setLoadingModalAnimating(true), 10);

    const status = await checkQrPaymentStatus();

    // On success, keep the fetch modal up; qrCaptureToken effect returns to main page.
    if (status === "success") {
      return;
    }

    setLoadingModalAnimating(false);
    setTimeout(() => {
      setShowLoadingModal(false);
      if (status === "expired") {
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
      {error && !isUploadingCheque && !showChequeUploadModal && !showManualErrorChequeModal ? (
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
        cancelledChequeFileName={cancelledChequeFileName}
        changeBankTab={changeBankTab}
        chequeFileSelected={chequeFileSelected}
        chequePreviewDisplayUrl={chequePreviewDisplayUrl}
        chequePreviewError={chequePreviewError}
        chequePreviewModalAnimating={chequePreviewModalAnimating}
        chequeUploadError={chequeUploadError}
        chequeUploadModalAnimating={chequeUploadModalAnimating}
        chequeUploaded={chequeUploaded}
        contactPersonName={data.accountHolderName}
        ifscCode={data.ifscCode}
        isEditMode={isEditMode}
        isLoadingChequePreview={isLoadingChequePreview}
        isSaving={isSaving}
        isTransitioning={isTransitioning || isSaving}
        isUploadingCheque={isUploadingCheque}
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
        onUploadCancelledCheque={handleUploadCancelledCheque}
        onViewCancelledCheque={() => {
          void handleViewCancelledCheque();
        }}
        onClearChequeUploadError={() => setChequeUploadError(null)}
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
