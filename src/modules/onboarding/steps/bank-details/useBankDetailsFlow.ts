import { useCallback, useEffect, useRef, useState } from "react";

import { extractErrorMessage, onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import {
  CANCELLED_CHEQUE_DOC_META,
  CHEQUE_ALLOWED_FILE_TYPES,
  CHEQUE_MAX_FILE_SIZE_BYTES,
  DEFAULT_RPD_VENDOR,
  PENNY_DROP_DEFAULTS,
  QR_DEFAULT_EXPIRY_SECONDS,
  QR_POLL_INTERVAL_MS,
} from "./constants";
import {
  createEmptyBankDetails,
  enrichBankDetailsFromIfsc,
  isAllowedChequeFile,
  mapGetBankDetailsToModel,
  mapPennyDropResponseToModel,
  normalizeBankVerificationType,
  resolveInitialValidationStatus,
  resolveValidationStatus,
} from "./helpers";
import type {
  BankDetailsModel,
  BankValidationStatus,
  BankVerificationType,
  ChequeUploadOutcome,
  ManualPennyDropResult,
  QrSessionState,
  SaveBankResult,
} from "./types";

type UseBankDetailsFlowResult = {
  data: BankDetailsModel;
  isLoading: boolean;
  isValidating: boolean;
  isSaving: boolean;
  error: string | null;
  bankValidationStatus: BankValidationStatus;
  verificationType: BankVerificationType;
  isBankModified: boolean;
  qrSession: QrSessionState | null;
  qrPolling: boolean;
  /** Increments when reverse-penny-drop QR flow successfully applies bank details. */
  qrCaptureToken: number;
  /** True while fetchBankDetails runs after a successful reverse-penny-drop payment. */
  isFetchingQrBankDetails: boolean;
  loadBankDetails: () => Promise<void>;
  validateApmiBankDetails: () => Promise<void>;
  validateManualPennyDrop: (accountNumber: string, ifscCode: string) => Promise<ManualPennyDropResult>;
  initiateQrPayment: () => Promise<QrSessionState | null>;
  checkQrPaymentStatus: () => Promise<"pending" | "success" | "failed" | "expired">;
  stopQrPolling: () => void;
  isUploadingCheque: boolean;
  uploadCancelledCheque: (file: File) => Promise<ChequeUploadOutcome>;
  saveBankDetails: (options?: {
    cancelledCheque?: string;
    isBankVerifiedOverride?: boolean;
    details?: BankDetailsModel;
    verificationTypeOverride?: BankVerificationType;
  }) => Promise<SaveBankResult | null>;
  setBankValidationStatus: (status: BankValidationStatus) => void;
  applyLocalBankUpdate: (model: BankDetailsModel, verificationType: BankVerificationType) => void;
};

export const useBankDetailsFlow = (): UseBankDetailsFlowResult => {
  const { leadId, pan, panNumber, applicationIds, personalDetails } = useOnboardingStore();
  const resolvedPan = (pan || panNumber || personalDetails?.personalDetails.pan || "").trim().toUpperCase();
  const investorName = (personalDetails?.personalDetails.name || "").trim();

  const [data, setData] = useState<BankDetailsModel>(createEmptyBankDetails);
  const [initialSnapshot, setInitialSnapshot] = useState<BankDetailsModel>(createEmptyBankDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCheque, setIsUploadingCheque] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bankValidationStatus, setBankValidationStatus] = useState<BankValidationStatus>("pending");
  const [verificationType, setVerificationType] = useState<BankVerificationType>("");
  const [initialVerificationType, setInitialVerificationType] = useState<BankVerificationType>("");
  const [qrSession, setQrSession] = useState<QrSessionState | null>(null);
  const [qrPolling, setQrPolling] = useState(false);
  const [qrCaptureToken, setQrCaptureToken] = useState(0);
  const [isFetchingQrBankDetails, setIsFetchingQrBankDetails] = useState(false);

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const qrSessionRef = useRef<QrSessionState | null>(null);
  const loadRequestIdRef = useRef(0);
  const checkQrStatusRef = useRef<(() => Promise<"pending" | "success" | "failed" | "expired">) | null>(
    null,
  );

  const stopQrPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    setQrPolling(false);
  }, []);

  useEffect(() => {
    qrSessionRef.current = qrSession;
  }, [qrSession]);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, []);

  const applyLocalBankUpdate = useCallback(
    (model: BankDetailsModel, nextVerificationType: BankVerificationType) => {
      setData(model);
      setVerificationType(nextVerificationType);
      setBankValidationStatus(resolveValidationStatus(model));
    },
    [],
  );

  const loadBankDetails = useCallback(async (): Promise<void> => {
    const requestId = ++loadRequestIdRef.current;

    if (!leadId) {
      if (requestId !== loadRequestIdRef.current) {
        return;
      }
      setError("Unable to load bank details. Missing lead information.");
      setData(createEmptyBankDetails());
      setInitialSnapshot(createEmptyBankDetails());
      setVerificationType("");
      setInitialVerificationType("");
      setBankValidationStatus("pending");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await onboardingApi.getBankDetails(leadId);
      // Ignore stale responses (e.g. initial load finishing after QR capture).
      if (requestId !== loadRequestIdRef.current) {
        return;
      }
      const mapped = mapGetBankDetailsToModel(response);
      const loadedVerificationType = normalizeBankVerificationType(response.verificationType);
      setData(mapped);
      setInitialSnapshot(mapped);
      setVerificationType(loadedVerificationType);
      setInitialVerificationType(loadedVerificationType);
      setBankValidationStatus(resolveInitialValidationStatus(mapped));
    } catch {
      if (requestId !== loadRequestIdRef.current) {
        return;
      }
      setError("Unable to load bank details. Please try again.");
      setData(createEmptyBankDetails());
      setInitialSnapshot(createEmptyBankDetails());
      setVerificationType("");
      setInitialVerificationType("");
      setBankValidationStatus("pending");
    } finally {
      if (requestId === loadRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [leadId]);

  const validateApmiBankDetails = useCallback(async (): Promise<void> => {
    if (isValidating) {
      return;
    }

    const accountNumber = data.accountNumber.trim();
    const ifscCode = data.ifscCode.trim().toUpperCase();

    if (!accountNumber || !ifscCode) {
      setError("Unable to validate. Account number or IFSC is missing.");
      return;
    }

    if (!resolvedPan) {
      setError("Unable to validate bank details. Missing PAN.");
      return;
    }

    setIsValidating(true);
    setBankValidationStatus("validating");
    setError(null);

    try {
      const response = await onboardingApi.pennyDropCall({
        Account_Number: accountNumber,
        IFSC_Code: ifscCode,
        Investor_Name: investorName || data.accountHolderName || "",
        PAN: resolvedPan,
        Golden_Master: PENNY_DROP_DEFAULTS.Golden_Master,
        Match_Percentage: PENNY_DROP_DEFAULTS.Match_Percentage,
        PennyDrop: PENNY_DROP_DEFAULTS.PennyDrop,
        Source: PENNY_DROP_DEFAULTS.Source,
      });

      const mapped = mapPennyDropResponseToModel(response, {
        accountNumber,
        ifscCode,
      });

      // Envelope-only success has no account payload — keep APMI-fetched fields.
      setData({
        ...data,
        accountHolderName: mapped.data.accountHolderName || data.accountHolderName,
        bankName: mapped.data.bankName || data.bankName,
        bankType: mapped.data.bankType || data.bankType,
        accountType: mapped.data.accountType || data.accountType,
        accountNumber: mapped.data.accountNumber || data.accountNumber,
        ifscCode: mapped.data.ifscCode || data.ifscCode,
        branchName: mapped.data.branchName || data.branchName,
        bankAddress: mapped.data.bankAddress || data.bankAddress,
        branchDisplay: mapped.data.branchDisplay || data.branchDisplay,
        isBankVerified: mapped.success,
        hasBankData: true,
      });
      setVerificationType(mapped.success ? "Penny drop" : "");
      setBankValidationStatus(mapped.success ? "success" : "failed");
      // Expected failure uses the in-card cheque banner; avoid duplicate top error.
      if (!mapped.success) {
        setError(null);
      }
    } catch {
      setError("Unable to validate bank details. Please try again.");
      setBankValidationStatus("failed");
      setVerificationType("");
      setData((current) => ({
        ...current,
        isBankVerified: false,
        hasBankData: Boolean(current.accountNumber || current.ifscCode),
      }));
    } finally {
      setIsValidating(false);
    }
  }, [data, investorName, isValidating, resolvedPan]);

  const validateManualPennyDrop = useCallback(
    async (accountNumber: string, ifscCode: string): Promise<ManualPennyDropResult> => {
      const trimmedAccount = accountNumber.trim();
      const trimmedIfsc = ifscCode.trim().toUpperCase();

      if (!trimmedAccount || !trimmedIfsc) {
        return {
          success: false,
          data: createEmptyBankDetails(),
          message: "Account number and IFSC are required.",
        };
      }

      if (!resolvedPan) {
        return {
          success: false,
          data: createEmptyBankDetails(),
          message: "Unable to validate bank details. Missing PAN.",
        };
      }

      setIsValidating(true);
      setBankValidationStatus("validating");
      setError(null);

      try {
        const response = await onboardingApi.pennyDropCall({
          Account_Number: trimmedAccount,
          IFSC_Code: trimmedIfsc,
          Investor_Name: investorName || data.accountHolderName || "",
          PAN: resolvedPan,
          Golden_Master: PENNY_DROP_DEFAULTS.Golden_Master,
          Match_Percentage: PENNY_DROP_DEFAULTS.Match_Percentage,
          PennyDrop: PENNY_DROP_DEFAULTS.PennyDrop,
          Source: PENNY_DROP_DEFAULTS.Source,
        });

        const mapped = mapPennyDropResponseToModel(response, {
          accountNumber: trimmedAccount,
          ifscCode: trimmedIfsc,
        });

        setData(mapped.data);
        setVerificationType(mapped.success ? "Penny drop" : "Manual");
        setBankValidationStatus(mapped.success ? "success" : "failed");
        // Manual failure opens the cheque-upload screen; avoid a duplicate top banner.
        setError(null);

        return mapped;
      } catch {
        const failed = createEmptyBankDetails();
        const withInput = {
          ...failed,
          accountNumber: trimmedAccount,
          ifscCode: trimmedIfsc,
          hasBankData: true,
          isBankVerified: false,
        };
        setData(withInput);
        setVerificationType("Manual");
        setBankValidationStatus("failed");
        setError(null);
        return {
          success: false,
          data: withInput,
          message: "Unable to validate bank account. Please try again.",
        };
      } finally {
        setIsValidating(false);
      }
    },
    [data.accountHolderName, investorName, resolvedPan],
  );

  const completeQrSuccess = useCallback(
    async (session: QrSessionState): Promise<boolean> => {
      if (!resolvedPan) {
        setError("Unable to fetch bank details from UPI. Missing PAN.");
        setBankValidationStatus("failed");
        return false;
      }

      try {
        const fetched = await onboardingApi.fetchReversePennyDropBankDetails({
          panNumber: resolvedPan,
          rpdVendor: DEFAULT_RPD_VENDOR,
          verificationId: session.verificationId || session.reversePennyDropId,
        });
        const mapped = mapGetBankDetailsToModel(fetched);
        // HyperVerge omits bankName/branch/address — derive bankName from IFSC for save + UI.
        const verifiedModel = enrichBankDetailsFromIfsc({
          ...mapped,
          isBankVerified: mapped.isBankVerified || mapped.hasBankData,
        });

        if (!verifiedModel.hasBankData) {
          setError(fetched.message || "Bank details missing from reverse penny drop response.");
          setBankValidationStatus("failed");
          return false;
        }

        // Invalidate any in-flight getBankDetails so it cannot overwrite this capture.
        loadRequestIdRef.current += 1;
        setIsLoading(false);
        setError(null);
        setData(verifiedModel);
        setVerificationType("Reverse Penny Drop");
        setBankValidationStatus("success");
        setQrCaptureToken((token) => token + 1);
        return true;
      } catch {
        setError("Payment received but bank details could not be fetched. Please try again.");
        setBankValidationStatus("failed");
        return false;
      }
    },
    [resolvedPan],
  );

  const checkQrPaymentStatus = useCallback(async (): Promise<"pending" | "success" | "failed" | "expired"> => {
    const session = qrSessionRef.current;
    if (!leadId || !session?.reversePennyDropId) {
      return "pending";
    }

    try {
      const statusResponse = await onboardingApi.getReversePennyDropValidationStatus(
        leadId,
        session.reversePennyDropId,
      );

      if (statusResponse.verificationId && statusResponse.verificationId !== session.verificationId) {
        const nextSession = { ...session, verificationId: statusResponse.verificationId };
        qrSessionRef.current = nextSession;
        setQrSession(nextSession);
      }

      if (statusResponse.status === "SUCCESS") {
        stopQrPolling();
        setIsFetchingQrBankDetails(true);
        try {
          const ok = await completeQrSuccess(qrSessionRef.current ?? session);
          return ok ? "success" : "failed";
        } finally {
          setIsFetchingQrBankDetails(false);
        }
      }

      if (statusResponse.status === "FAILURE") {
        stopQrPolling();
        setBankValidationStatus("failed");
        setError(statusResponse.message || "UPI bank validation failed.");
        return "failed";
      }

      if (statusResponse.status === "EXPIRED") {
        stopQrPolling();
        setError(statusResponse.message || "QR payment request expired. Please regenerate.");
        return "expired";
      }

      return "pending";
    } catch {
      return "pending";
    }
  }, [completeQrSuccess, leadId, stopQrPolling]);

  useEffect(() => {
    checkQrStatusRef.current = checkQrPaymentStatus;
  }, [checkQrPaymentStatus]);

  const initiateQrPayment = useCallback(async (): Promise<QrSessionState | null> => {
    if (!resolvedPan) {
      setError("Unable to generate QR. Missing PAN.");
      return null;
    }

    stopQrPolling();
    setError(null);
    setIsValidating(true);

    try {
      const response = await onboardingApi.initiateReversePennyDropPayment({
        panNumber: resolvedPan,
        name: investorName || data.accountHolderName || resolvedPan,
        rpdVendor: DEFAULT_RPD_VENDOR,
      });

      const session: QrSessionState = {
        reversePennyDropId: response.reversePennyDropId || response.verificationId,
        verificationId: response.verificationId || response.reversePennyDropId,
        qrImageUrl: response.qrImageUrl,
        upiLink: response.upiLink,
        expiresInSeconds: response.expiresInSeconds || QR_DEFAULT_EXPIRY_SECONDS,
      };

      if (!session.reversePennyDropId) {
        setError(response.message || "Unable to generate QR. Missing reverse penny drop id.");
        return null;
      }

      if (!session.qrImageUrl) {
        setError(response.message || "Unable to generate QR. QR image missing from response.");
        return null;
      }

      qrSessionRef.current = session;
      setQrSession(session);
      setQrPolling(true);

      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
      pollTimerRef.current = setInterval(() => {
        void checkQrStatusRef.current?.();
      }, QR_POLL_INTERVAL_MS);

      return session;
    } catch {
      setError("Unable to generate QR code. Please try again.");
      return null;
    } finally {
      setIsValidating(false);
    }
  }, [data.accountHolderName, investorName, resolvedPan, stopQrPolling]);

  // Treat as modified only when core fields or verification method change vs loaded snapshot.
  // Do not flag merely because getBankDetails already had a verificationType.
  const isBankModified =
    data.accountNumber !== initialSnapshot.accountNumber ||
    data.ifscCode !== initialSnapshot.ifscCode ||
    data.accountHolderName !== initialSnapshot.accountHolderName ||
    data.bankName !== initialSnapshot.bankName ||
    verificationType !== initialVerificationType;

  const saveBankDetails = useCallback(
    async (options?: {
      cancelledCheque?: string;
      isBankVerifiedOverride?: boolean;
      details?: BankDetailsModel;
      verificationTypeOverride?: BankVerificationType;
    }): Promise<SaveBankResult | null> => {
      if (!leadId) {
        setError("Unable to save bank details. Missing lead information.");
        return null;
      }

      const sourceModel = options?.details ?? data;

      if (!sourceModel.hasBankData && options?.isBankVerifiedOverride !== true) {
        setError("Please validate bank details before continuing.");
        return null;
      }

      setIsSaving(true);
      setError(null);

      try {
        const isVerified =
          options?.isBankVerifiedOverride ??
          (sourceModel.isBankVerified || bankValidationStatus === "success");

        const resolvedVerificationType = options?.verificationTypeOverride || verificationType;

        // Only pass method when actually verified via that path; Manual cheque screen always sends "Manual".
        const saveVerificationType: BankVerificationType =
          resolvedVerificationType === "Manual"
            ? "Manual"
            : isVerified && resolvedVerificationType === "Penny drop"
              ? "Penny drop"
              : isVerified && resolvedVerificationType === "Reverse Penny Drop"
                ? "Reverse Penny Drop"
                : "";

        const saveModel = enrichBankDetailsFromIfsc(sourceModel);
        if (saveModel.bankName !== data.bankName || options?.details) {
          setData(saveModel);
        }

        const effectiveIsBankModified =
          saveModel.accountNumber !== initialSnapshot.accountNumber ||
          saveModel.ifscCode !== initialSnapshot.ifscCode ||
          saveModel.accountHolderName !== initialSnapshot.accountHolderName ||
          saveModel.bankName !== initialSnapshot.bankName ||
          resolvedVerificationType !== initialVerificationType;

        const response = await onboardingApi.saveBankDetails({
          leadId,
          bankDetails: {
            accountNumber: saveModel.accountNumber,
            bankAddress: saveModel.bankAddress || saveModel.branchDisplay,
            bankName: saveModel.bankName,
            bankType:
              saveModel.bankType ||
              (saveModel.accountType === "current" ? "Current" : "Savings"),
            branchName: saveModel.branchName,
            ifscCode: saveModel.ifscCode,
            name: saveModel.accountHolderName,
          },
          cancelledCheque: options?.cancelledCheque ?? "",
          isBankModified: effectiveIsBankModified,
          isBankVerified: isVerified,
          verificationType: saveVerificationType,
        });

        setInitialSnapshot(saveModel);
        setInitialVerificationType(saveVerificationType);
        return {
          message: response.message,
          applicationStatus: response.applicationStatus,
        };
      } catch {
        setError("Unable to save bank details. Please try again.");
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [bankValidationStatus, data, initialSnapshot, initialVerificationType, leadId, verificationType],
  );

  const uploadCancelledCheque = useCallback(
    async (file: File): Promise<ChequeUploadOutcome> => {
      if (!leadId || !resolvedPan) {
        const message = "Unable to upload cancelled cheque. Missing lead or PAN information.";
        setError(message);
        return { ok: false, message };
      }

      if (!isAllowedChequeFile(file, CHEQUE_ALLOWED_FILE_TYPES)) {
        const message = "Cancelled cheque must be PNG, JPEG, or PDF.";
        setError(message);
        return { ok: false, message };
      }
      if (file.size > CHEQUE_MAX_FILE_SIZE_BYTES) {
        const message = "Cancelled cheque must be 2MB or smaller.";
        setError(message);
        return { ok: false, message };
      }

      setIsUploadingCheque(true);
      setError(null);

      try {
        const response = await onboardingApi.uploadDocument({
          file,
          payload: {
            leadId,
            panNumber: resolvedPan,
            applicationId: applicationIds,
            documentName: CANCELLED_CHEQUE_DOC_META.documentName,
            documentType: CANCELLED_CHEQUE_DOC_META.documentType,
            metadata: {},
          },
        });
        const storageUrl = response.fileURL.trim();
        if (!storageUrl) {
          const message = "Cancelled cheque upload failed. Empty file URL returned.";
          setError(message);
          return { ok: false, message };
        }

        return { ok: true, storageUrl };
      } catch (error) {
        const message =
          extractErrorMessage(error) || "Unable to upload cancelled cheque. Please try again.";
        setError(message);
        return { ok: false, message };
      } finally {
        setIsUploadingCheque(false);
      }
    },
    [applicationIds, leadId, resolvedPan],
  );

  useEffect(() => {
    void loadBankDetails();
  }, [loadBankDetails]);

  return {
    data,
    isLoading,
    isValidating,
    isSaving,
    isUploadingCheque,
    error,
    bankValidationStatus,
    verificationType,
    isBankModified,
    qrSession,
    qrPolling,
    qrCaptureToken,
    isFetchingQrBankDetails,
    loadBankDetails,
    validateApmiBankDetails,
    validateManualPennyDrop,
    initiateQrPayment,
    checkQrPaymentStatus,
    stopQrPolling,
    uploadCancelledCheque,
    saveBankDetails,
    setBankValidationStatus,
    applyLocalBankUpdate,
  };
};
