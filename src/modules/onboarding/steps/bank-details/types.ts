export type BankValidationStatus = "pending" | "validating" | "success" | "failed";

export type BankAccountType = "saving" | "current" | "";

/** Exact `verificationtype` values expected by saveBankDetails. */
export type BankVerificationType = "Penny drop" | "Reverse Penny Drop" | "";

export type BankDetailsModel = {
  accountHolderName: string;
  bankName: string;
  bankType: string;
  accountType: BankAccountType;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  bankAddress: string;
  isBankVerified: boolean;
  /** Combined branch label for the summary card. */
  branchDisplay: string;
  hasBankData: boolean;
};

export type ManualPennyDropResult = {
  success: boolean;
  data: BankDetailsModel;
  message: string;
};

export type SaveBankResult = {
  message: string;
  applicationStatus: string;
};

export type QrSessionState = {
  reversePennyDropId: string;
  verificationId: string;
  qrImageUrl: string;
  upiLink: string;
  expiresInSeconds: number;
};
