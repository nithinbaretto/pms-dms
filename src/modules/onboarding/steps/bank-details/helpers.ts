import type {
  GetBankDetailsResponse,
  PennyDropAccountInfo,
  PennyDropCallResponse,
} from "../../services/onboarding-api";
import type {
  BankAccountType,
  BankDetailsModel,
  BankValidationStatus,
  BankVerificationType,
} from "./types";

export const createEmptyBankDetails = (): BankDetailsModel => ({
  accountHolderName: "",
  bankName: "",
  bankType: "",
  accountType: "",
  accountNumber: "",
  ifscCode: "",
  branchName: "",
  bankAddress: "",
  isBankVerified: false,
  branchDisplay: "",
  hasBankData: false,
});

export const normalizeAccountType = (bankType: string): BankAccountType => {
  const normalized = bankType.trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  if (normalized.includes("current") || normalized === "ca") {
    return "current";
  }

  if (
    normalized.includes("saving") ||
    normalized.includes("savings") ||
    normalized === "sa" ||
    normalized === "sb"
  ) {
    return "saving";
  }

  return "";
};

export const formatAccountTypeLabel = (bankType: string, accountType: BankAccountType): string => {
  if (accountType === "current") {
    return "Current";
  }

  if (accountType === "saving") {
    return "Savings";
  }

  const trimmed = bankType.trim();
  return trimmed || "Savings";
};

export const formatBranchDisplay = (branchName: string, bankAddress: string): string => {
  const name = branchName.trim();
  const address = bankAddress.trim();

  if (name && address) {
    if (address.toLowerCase().includes(name.toLowerCase())) {
      return address;
    }
    return `${name}, ${address}`;
  }

  return name || address;
};

export const hasBankCoreData = (model: Pick<BankDetailsModel, "accountNumber" | "ifscCode">): boolean => {
  return Boolean(model.accountNumber.trim() || model.ifscCode.trim());
};

const CHEQUE_FILE_EXTENSIONS = ["png", "jpg", "jpeg", "pdf"] as const;

export const isAllowedChequeFile = (file: File, allowedMimeTypes: readonly string[]): boolean => {
  const mime = (file.type || "").trim().toLowerCase();
  if (allowedMimeTypes.includes(mime) || mime === "image/jpg") {
    return true;
  }

  const extension = file.name.split(".").pop()?.trim().toLowerCase() ?? "";
  return (CHEQUE_FILE_EXTENSIONS as readonly string[]).includes(extension);
};

/**
 * HyperVerge reverse-penny-drop does not return bankName/branch/address.
 * RBI IFSC uses the first 4 characters as the bank code.
 */
const IFSC_BANK_CODES: Record<string, string> = {
  SBIN: "State Bank of India",
  ICIC: "ICICI Bank",
  HDFC: "HDFC Bank",
  UTIB: "Axis Bank",
  PUNB: "Punjab National Bank",
  CNRB: "Canara Bank",
  BARB: "Bank of Baroda",
  UBIN: "Union Bank of India",
  IDIB: "Indian Bank",
  IOBA: "Indian Overseas Bank",
  CBIN: "Central Bank of India",
  BKID: "Bank of India",
  MAHB: "Bank of Maharashtra",
  PSIB: "Punjab & Sind Bank",
  UCBA: "UCO Bank",
  YESB: "Yes Bank",
  KKBK: "Kotak Mahindra Bank",
  INDB: "IndusInd Bank",
  FDRL: "Federal Bank",
  IBKL: "IDBI Bank",
  IDFB: "IDFC First Bank",
  RATN: "RBL Bank",
  BAND: "Bandhan Bank",
  AUBL: "AU Small Finance Bank",
  ESME: "Equitas Small Finance Bank",
  JSFB: "Jana Small Finance Bank",
  FINO: "Fino Payments Bank",
  AIRP: "Airtel Payments Bank",
  PYTM: "Paytm Payments Bank",
  SCBL: "Standard Chartered Bank",
  CITI: "Citibank",
  HSBC: "HSBC Bank",
  DBSS: "DBS Bank",
  DLXB: "Dhanlaxmi Bank",
  KARB: "Karnataka Bank",
  KVBL: "Karur Vysya Bank",
  SIBL: "South Indian Bank",
  TMBL: "Tamilnad Mercantile Bank",
  CIUB: "City Union Bank",
  CSBK: "Catholic Syrian Bank",
  NNSB: "NKGSB Co-operative Bank",
  SRCB: "Saraswat Co-operative Bank",
  SVCB: "SVC Co-operative Bank",
  NUCB: "Nutan Nagarik Sahakari Bank",
  GSCB: "Gujarat State Co-operative Bank",
};

export const resolveBankNameFromIfsc = (ifscCode: string): string => {
  const code = ifscCode.trim().toUpperCase().slice(0, 4);
  if (!/^[A-Z]{4}$/.test(code)) {
    return "";
  }
  return IFSC_BANK_CODES[code] || `${code} Bank`;
};

/** Fill bankName (and optional blanks) that reverse-penny-drop responses omit. */
export const enrichBankDetailsFromIfsc = (model: BankDetailsModel): BankDetailsModel => {
  const ifscCode = model.ifscCode.trim().toUpperCase();
  const bankName = model.bankName.trim() || resolveBankNameFromIfsc(ifscCode);
  const branchName = model.branchName.trim();
  const bankAddress = model.bankAddress.trim();

  return {
    ...model,
    ifscCode,
    bankName,
    branchName,
    bankAddress,
    branchDisplay: formatBranchDisplay(branchName, bankAddress),
  };
};

const toBankDetailsModel = (input: {
  accountHolderName: string;
  bankName: string;
  bankType: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  bankAddress: string;
  isBankVerified: boolean;
}): BankDetailsModel => {
  const accountHolderName = input.accountHolderName.trim();
  const bankName = input.bankName.trim();
  const bankType = input.bankType.trim();
  const accountNumber = input.accountNumber.trim();
  const ifscCode = input.ifscCode.trim().toUpperCase();
  const branchName = input.branchName.trim();
  const bankAddress = input.bankAddress.trim();
  const accountType = normalizeAccountType(bankType);

  return {
    accountHolderName,
    bankName,
    bankType,
    accountType,
    accountNumber,
    ifscCode,
    branchName,
    bankAddress,
    isBankVerified: input.isBankVerified,
    branchDisplay: formatBranchDisplay(branchName, bankAddress),
    hasBankData: hasBankCoreData({ accountNumber, ifscCode }),
  };
};

export const mapGetBankDetailsToModel = (response: GetBankDetailsResponse): BankDetailsModel => {
  return toBankDetailsModel({
    accountHolderName: response.name,
    bankName: response.bankName,
    bankType: response.bankType,
    accountNumber: response.accountNumber,
    ifscCode: response.ifscCode,
    branchName: response.branchName,
    bankAddress: response.bankAddress,
    isBankVerified: response.isBankVerified,
  });
};

/** Map API verificationType values to the exact saveBankDetails contract strings. */
export const normalizeBankVerificationType = (value: string): BankVerificationType => {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  if (normalized.includes("reverse")) {
    return "Reverse Penny Drop";
  }

  if (normalized.includes("manual")) {
    return "Manual";
  }

  if (normalized.includes("penny")) {
    return "Penny drop";
  }

  return "";
};

export const isPennyDropAccountSuccess = (account: PennyDropAccountInfo): boolean => {
  const errorOk = !account.errorCode || account.errorCode === "0";
  const nameMatchOk =
    !account.nameMatchStatus || account.nameMatchStatus.trim().toUpperCase() === "Y";
  const desc = account.errorDescription.trim().toLowerCase();
  const descOk = !desc || desc.includes("success");

  return errorOk && nameMatchOk && descOk;
};

export const mapPennyDropAccountToModel = (
  account: PennyDropAccountInfo,
  fallback: { accountNumber: string; ifscCode: string },
): BankDetailsModel => {
  // Account_Holder / Investor_Name are person names; Investor_Name_Bank is bank name in DMS.
  const accountHolderName = account.accountHolder || account.investorName || "";
  const bankName = account.investorNameBank || "";
  const bankType = account.accountType || account.accountCategory || account.accountNature || "";

  return toBankDetailsModel({
    accountHolderName,
    bankName,
    bankType,
    accountNumber: account.accountNumber || fallback.accountNumber,
    ifscCode: account.ifscCode || fallback.ifscCode,
    branchName: "",
    bankAddress: "",
    isBankVerified: isPennyDropAccountSuccess(account),
  });
};

export const mapPennyDropResponseToModel = (
  response: PennyDropCallResponse,
  fallback: { accountNumber: string; ifscCode: string },
): { success: boolean; data: BankDetailsModel; message: string } => {
  const account = response.accounts[0];
  if (!account) {
    return {
      success: false,
      data: toBankDetailsModel({
        accountHolderName: "",
        bankName: "",
        bankType: "",
        accountNumber: fallback.accountNumber,
        ifscCode: fallback.ifscCode,
        branchName: "",
        bankAddress: "",
        isBankVerified: false,
      }),
      message: response.message || response.responseMessage || "Penny drop failed.",
    };
  }

  const success = response.success && isPennyDropAccountSuccess(account);
  return {
    success,
    data: mapPennyDropAccountToModel(account, fallback),
    message:
      account.errorDescription ||
      account.remarks ||
      response.message ||
      response.responseMessage ||
      (success ? "PennyDrop is successful" : "Penny drop failed."),
  };
};

export const resolveValidationStatus = (model: BankDetailsModel): BankValidationStatus => {
  if (!model.hasBankData) {
    return "pending";
  }

  return model.isBankVerified ? "success" : "failed";
};

/**
 * Initial getBankDetails status.
 * Backend defaults isBankVerified to false until the user runs penny drop via Validate.
 * Do not treat that default as a failed validation.
 */
export const resolveInitialValidationStatus = (model: BankDetailsModel): BankValidationStatus => {
  if (model.hasBankData && model.isBankVerified) {
    return "success";
  }

  return "pending";
};
