import type { ProductCategory } from "../types/onboarding-types";
import { apiGet, apiPost, apiPostBlob, apiPostFormData } from "../../../services/http/apiClient";

export type VerifyAprnRequest = {
  panNumber: string;
  aprnNumber: string;
  leadId: string;
};

export type VerifyAprnResponse = {
  success: boolean;
  validationStatus: boolean;
  message?: string;
  email?: string | null;
  mobile?: string | null;
  aprnStatus: boolean;
  leadId?: string | null;
  dataSource?: string | null;
};

/** Entry / first personal-details verify uses Partner Integration; re-verify uses Primary. */
export type PartnerOtpType = "Partner Integration" | "Primary";

export type SendOtpRequest = {
  email: string;
  leadId: string;
  mobile: string;
  panNumber: string;
  type: PartnerOtpType;
};

export type SendOtpResponse = {
  success: boolean;
  message?: string;
};

export type VerifyOtpRequest = {
  leadId: string;
  otp: number;
  panNumber: string;
  type: PartnerOtpType;
};

export type VerifyOtpResponse = {
  verified: boolean;
  message?: string;
  verifiedSource?: string | null;
};

export type GetPersonalDetailsRequest = {
  leadId: string;
};

export type GetPersonalDetailsResponse = {
  name: string;
  panNumber: string;
  dob: string;
  aprnNumber: string;
  arnNumber: string;
  entityType: string;
  email: string;
  mobile: string;
  permanentAddress: string;
  correspondenceAddress: string;
  Application_status: string;
  nextInfoSection: string;
  isCorrespoingSameAsPermanent: boolean;
};

export type SavePersonalDetailsRequest = {
  correspondenceAddress: string;
  isCorrespoingSameAsPermanent: boolean;
  leadId: string;
  primaryEmail: string;
  primaryMobile: string;
  dob: string;
  name: string;
  permanentAddress: string;
  dataSource: string;
};

export type SavePersonalDetailsResponse = {
  Message: string;
  Application_status: string;
  nextInfoSection?: string;
};

export type ValidatePanResponse = {
  isValid: boolean;
  message?: string;
  email?: string | null;
  mobile?: string | null;
  leadId?: string | null;
  existingProductTypes?: string[];
  isExistingApplicant?: boolean;
  isExistingDistributor?: boolean;
};

export type InternalPanCheckResponse = {
  exists: boolean;
  message?: string;
};

export type ValidateAmfiContactRequest = {
  pan: string;
  arn: string | null;
  contact: {
    email: string | null;
    mobile: string | null;
  };
};

export type ValidateAmfiContactResponse = {
  success: boolean;
  message?: string;
  maskedEmail: string | null;
  maskedMobile: string | null;
};

export type SendAmfiOtpRequest = {
  channel: "email" | "mobile";
};

export type VerifyAmfiOtpRequest = {
  channel: "email" | "mobile";
  otp: string;
};

export type SaveBusinessDetailsRequest = {
  categories: ProductCategory[];
  leadId: string;
  panNumber: string;
};

export type SaveBusinessDetailsResponse = {
  status: string;
  message?: string;
  leadId: string | null;
  applicationIds: string[];
};

export type UpdateManualDataRequest = {
  leadId: string;
};

export type UpdateManualDataResponse = {
  success: boolean;
  message?: string;
  leadId: string | null;
};

export type GetPanDetailsByKraRequest = {
  leadId: string;
  panNo: string;
};

export type GetPanDetailsByKraResponse = {
  leadId: string | null;
  success: boolean;
  validationStatus: boolean;
  arnStatus: string | null;
  mobile: string | null;
  email: string | null;
  dataSource: string | null;
  message?: string;
};

export type ValidateInputWithKraRequest = {
  email: string;
  leadId: string;
  mobile: string;
};

export type ValidateInputWithKraResponse = {
  isValidated: boolean;
  errorMsg: string | null;
  message?: string;
};

export type ValidateArnRequest = {
  leadId: string;
  pan: string;
  arn: string;
  email: string;
  mobile: string;
};

export type ValidateArnResponse = {
  leadId: string | null;
  validateStatus: boolean;
  arnStatus: string | null;
  mobile: string | null;
  email: string | null;
  message?: string;
  expiringInDays: boolean | null;
};

export type GstInItem = {
  gstInId: string;
  gstInName: string;
  gstInState: string;
  isSelected: boolean;
  fileURL: string;
};

export type BusinessDetailsResponse = {
  selectedBranch: string;
  gstInDetails: GstInItem[];
};

export type BranchListItem = {
  BranchName: string;
};

export type BranchListResponse = BranchListItem[];

export type ValidateGstInRequest = {
  leadId: string;
  gstInNumber: string;
};

export type ValidateGstInResponse = {
  isMatchFound: boolean;
  gstInId: string;
  legalName: string;
  state: string;
};

export type UploadDocumentPayload = {
  leadId: string;
  panNumber: string;
  applicationId: string[];
  documentName: string;
  documentType: string;
  metadata?: Record<string, unknown>;
};

export type UploadDocumentRequest = {
  file: File;
  payload: UploadDocumentPayload;
};

export type UploadDocumentResponse = {
  fileURL: string;
};

export type DocumentOcrResponse = {
  name: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
};

export type DownloadFileRequest = {
  downloadLink: string;
  fileName: string;
  leadId: string;
  panNumber: string;
  /** Document format, e.g. png | jpeg | pdf */
  type: string;
};

export type DownloadFileResponse = {
  fileURL: string;
};

export type GeneratePdfRequest = {
  leadId: string;
};

export type GeneratePdfResponse = {
  fileURL: string;
  fileName: string;
};

export type SaveGstDetailsRequest = {
  gstInDetails: GstInItem[];
  leadId: string;
  selectedBranch: string;
};

export type SaveGstDetailsResponse = {
  Message: string;
  Application_status: string;
  nextInfoSection?: string;
};

export type GetNomineeDetailsResponse = {
  nomineeName: string;
  relationshipWithApplicant: string;
  proofOfIdentityType: string;
  proofOfIdentityNumber: string;
  mobileNumber: string;
  emailId: string;
  dateOfBirth: string;
  nomineeAddress: string;
  guardianName: string;
  guardianAddress: string;
  isNomineeAddressSameAsApplicantAddress: boolean;
  isGuardianAddressSameAsNomineeAddress: boolean;
  isMinor: boolean;
};

export type SaveNomineeDetailsRequest = {
  dateOfBirth: string;
  emailId: string;
  guardianAddress: string;
  guardianName: string;
  isGuardianAddressModified: boolean;
  isGuardianAddressSameAsNomineeAddress: boolean;
  isMinor: boolean;
  isNomineeAddressModified: boolean;
  isNomineeAddressSameAsApplicantAddress: boolean;
  leadId: string;
  mobileNumber: string;
  nomineeAddress: string;
  nomineeName: string;
  proofOfIdentityNumber: string;
  proofOfIdentityType: string;
  relationshipWithApplicant: string;
};

export type SaveNomineeDetailsResponse = {
  Message: string;
  Application_status: string;
};

export type GetUploadDocumentsResponse = {
  leadId: string;
  uploadedPhoto: string;
  uploadedSignature: string;
  uploadedProofOfIdentity: string;
  uploadedProofOfAddress: string;
  documentUploaded: boolean;
};

export type UploadedDocumentItem = {
  documentName: string;
  documentType: string;
  documentUrl: string;
};

export type SaveUploadedDocumentsRequest = {
  documents: UploadedDocumentItem[];
  leadId: string;
};

export type SaveUploadedDocumentsResponse = {
  message: string;
  applicationStatus: string;
};

export type GetBankDetailsResponse = {
  name: string;
  bankName: string;
  bankType: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  bankAddress: string;
  isBankVerified: boolean;
  isBankModified: boolean;
  verificationType: string;
};

export type PennyDropCallRequest = {
  Account_Number: string;
  Golden_Master: string;
  IFSC_Code: string;
  Investor_Name: string;
  Match_Percentage: string;
  PAN: string;
  PennyDrop: string;
  Source: string;
};

export type PennyDropAccountInfo = {
  amcCode: string;
  investorName: string;
  accountNumber: string;
  ifscCode: string;
  pan: string;
  investorNameBank: string;
  accountCategory: string;
  accountHolder: string;
  accountNature: string;
  accountType: string;
  nameMatchStatus: string;
  actualMatchPercentage: string;
  remarks: string;
  errorCode: string;
  errorDescription: string;
};

export type PennyDropCallResponse = {
  statusCode: number;
  status: string;
  message: string;
  success: boolean;
  referenceId: string;
  successCode: string;
  responseMessage: string;
  accounts: PennyDropAccountInfo[];
};

export type SaveBankDetailsPayload = {
  accountNumber: string;
  bankAddress: string;
  bankName: string;
  bankType: string;
  branchName: string;
  ifscCode: string;
  name: string;
};

export type SaveBankDetailsRequest = {
  bankDetails: SaveBankDetailsPayload;
  cancelledCheque: string;
  isBankModified: boolean;
  isBankVerified: boolean;
  leadId: string;
  verificationType: string;
};

export type SaveBankDetailsResponse = {
  message: string;
  applicationStatus: string;
};

export type InitiateReversePennyDropRequest = {
  panNumber: string;
  name: string;
  rpdVendor: string;
};

export type InitiateReversePennyDropResponse = {
  reversePennyDropId: string;
  verificationId: string;
  qrCode: string;
  qrImageUrl: string;
  upiLink: string;
  expiresInSeconds: number;
  rawStatus: string;
  message: string;
};

export type ReversePennyDropValidationStatus = "CREATED" | "SUCCESS" | "FAILURE" | "EXPIRED" | "PENDING" | "UNKNOWN";

export type GetReversePennyDropValidationStatusResponse = {
  status: ReversePennyDropValidationStatus;
  reversePennyDropId: string;
  verificationId: string;
  message: string;
};

export type FetchReversePennyDropBankDetailsRequest = {
  panNumber: string;
  rpdVendor: string;
  verificationId: string;
};

export type FetchReversePennyDropBankDetailsResponse = GetBankDetailsResponse & {
  verificationId: string;
  message: string;
};

/** Provisional review payload — field mapping will be tightened when UAT sample is available. */
export type ReviewPersonalSection = {
  name: string;
  panNumber: string;
  dob: string;
  email: string;
  mobile: string;
  permanentAddress: string;
  correspondenceAddress: string;
  aprnNumber: string;
  arnNumber: string;
  entityType: string;
};

export type ReviewGstDetail = {
  gstNumber: string;
  stateCode: string;
  legalName: string;
};

export type ReviewBusinessSection = {
  selectedBranch: string;
  productCategories: string[];
  gstSummary: string;
  gstDetails: ReviewGstDetail[];
};

export type ReviewBankSection = {
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  branchName: string;
  chequeUploaded: boolean;
};

export type ReviewNomineeSection = {
  nomineeName: string;
  relationshipWithApplicant: string;
  mobileNumber: string;
  emailId: string;
  dateOfBirth: string;
  nomineeAddress: string;
  proofOfIdentityType: string;
  proofOfIdentityNumber: string;
  isMinor: boolean;
};

export type ReviewDocumentSection = {
  uploadedPhoto: string;
  uploadedSignature: string;
  documentUploaded: boolean;
  photoUploaded: boolean;
  signatureUploaded: boolean;
};

export type ReviewDetailsResponse = {
  leadId: string;
  applicationStatus: string;
  nextInfoSection: string;
  personal: ReviewPersonalSection;
  business: ReviewBusinessSection;
  bank: ReviewBankSection;
  nominee: ReviewNomineeSection;
  documents: ReviewDocumentSection;
};

export type CreateApplicationResponse = {
  message: string;
  applicationStatus: string;
  applicationId: string[];
  expectedReviewTimeline: string;
  name: string;
  primaryContactNumber: string;
  primaryEmail: string;
};

type PanValidationApiResponse = {
  isValid?: boolean;
  valid?: boolean;
  success?: boolean;
  status?: string;
  statusCode?: number;
  code?: number | string;
  message?: string;
  errorMessage?: string;
  email?: string | null;
  mobile?: string | null;
  leadId?: string | null;
  leadID?: string | null;
  lead_id?: string | null;
  existingProductTypes?: string[];
  productTypes?: string[];
  isExistingApplicant?: boolean;
  isExistingDistributor?: boolean;
};

type ErrorWithResponse = {
  response?: {
    data?: unknown;
  };
  message?: string;
};

type InternalPanApiResponse = {
  exists?: boolean;
  found?: boolean;
  message?: string;
};

type VerifyAprnApiResponse = {
  validationStatus?: boolean | string | null;
  isValid?: boolean;
  valid?: boolean;
  message?: string | null;
  Message?: string | null;
  messageText?: string | null;
  messages?: unknown;
  email?: string | null;
  mobile?: string | number | null;
  aprnStatus?: boolean | string | null;
  leadId?: string | null;
  dataSource?: string | null;
  status?: string;
  statusCode?: number;
};

type ValidateAmfiContactApiResponse = {
  success?: boolean;
  status?: "SUCCESS" | "FAILED";
  message?: string;
  maskedEmail?: string | null;
  maskedMobile?: string | null;
};

type SendOtpApiResponse = {
  statusCode?: number;
  status?: string;
  success?: boolean;
  sent?: boolean;
  message?: string;
  expiresInSeconds?: number;
  expiryInSeconds?: number;
  maskedMobile?: string;
  maskedEmail?: string;
};

type VerifyOtpApiResponse = {
  statusCode?: number;
  status?: string;
  verified?: boolean;
  success?: boolean;
  message?: string;
  verifiedSource?: string | null;
  verifedSoruce?: string | null;
  data?: {
    verifedSoruce?: string | null;
    verifiedSource?: string | null;
  };
};

type GetPersonalDetailsApiResponse = {
  name?: string;
  panNumber?: string;
  dob?: string;
  aprnNumber?: string;
  arnNumber?: string;
  entityType?: string;
  email?: string;
  mobile?: string;
  permanentAddress?: string;
  correspondenceAddress?: string;
  Application_status?: string;
  application_status?: string;
  nextInfoSection?: string;
  isCorrespoingSameAsPermanent?: boolean;
  isCorrespondingSameAsPermanent?: boolean;
};

type SavePersonalDetailsApiResponse = {
  Message?: string;
  message?: string;
  Application_status?: string;
  application_status?: string;
  nextInfoSection?: string;
};

type SaveBusinessDetailsApiResponse = {
  applicationIds?: string[];
  leadId?: string | null;
  message?: string;
  status?: string;
};

type UpdateManualDataApiResponse = {
  leadId?: string | null;
  message?: string;
  Message?: string;
  status?: string;
  success?: boolean;
};

type GetPanDetailsByKraApiResponse = {
  leadId?: string | null;
  validationStatus?: boolean;
  arnStatus?: string | boolean | null;
  mobile?: string | number | null;
  email?: string | null;
  dataSource?: string | null;
  message?: string;
  Message?: string;
  status?: string;
  statusCode?: number;
};

type ValidateInputWithKraApiResponse = {
  isValidated?: boolean;
  errorMsg?: string | null;
  message?: string;
  Message?: string;
  status?: string;
  statusCode?: number;
};

type ValidateArnApiResponse = {
  leadId?: string | null;
  validateStatus?: string | boolean | null;
  validationStatus?: string | boolean | null;
  arnStatus?: string | boolean | null;
  mobile?: string | number | null;
  email?: string | null;
  message?: string;
  Message?: string;
  expiringInDays?: boolean | string | number | null;
  status?: string;
  statusCode?: number;
};

type GstInItemApi = {
  gstInId?: string;
  gstInName?: string;
  gstInState?: string;
  isSelected?: boolean;
  fileURL?: string;
  fileUrl?: string;
};

type GetBusinessDetailsApiResponse = {
  selectedBranch?: string;
  gstInDetails?: GstInItemApi[];
};

type BranchListItemApi = {
  BranchName?: string;
  branchName?: string;
};

type ValidateGstInApiResponse = {
  isMatchFound?: boolean;
  gstInId?: string;
  legalName?: string;
  state?: string;
};

type UploadDocumentApiResponse = {
  fileURL?: string;
  fileUrl?: string;
  /** Some upload-document responses return the blob URL as a nested string. */
  data?: string | Record<string, unknown>;
};

type DownloadFileApiResponse = {
  fileURL?: string;
  fileUrl?: string;
  downloadUrl?: string;
  downloadLink?: string;
  url?: string;
  /** Base64 file bytes (UAT download-file envelope uses `file` + `filename`). */
  file?: string;
  base64?: string;
  fileContent?: string;
  content?: string;
  filename?: string;
  fileName?: string;
  /** Some download-file responses return the viewable URL as a nested string. */
  data?: string | Record<string, unknown>;
};

type SaveGstDetailsApiResponse = {
  Message?: string;
  message?: string;
  Application_status?: string;
  application_status?: string;
  nextInfoSection?: string;
};

type GetNomineeDetailsApiResponse = {
  nomineeName?: string;
  relationshipWithApplicant?: string;
  proofOfIdentityType?: string;
  proofOfIdentityNumber?: string;
  mobileNumber?: string;
  emailId?: string;
  dateOfBirth?: string;
  nomineeAddress?: string;
  guardianName?: string;
  guardianAddress?: string;
  isNomineeAddressSameAsApplicantAddress?: boolean;
  isGuardianAddressSameAsNomineeAddress?: boolean;
  isMinor?: boolean;
};

type SaveNomineeDetailsApiResponse = {
  Message?: string;
  message?: string;
  Application_status?: string;
  application_status?: string;
};

type GetUploadDocumentsApiResponse = {
  leadId?: string;
  uploadedPhoto?: string;
  uploadedSignature?: string;
  uploadedProofOfIdentity?: string;
  uploadedProofOfAddress?: string;
  proofOfIdentity?: string;
  proofOfAddress?: string;
  documentUploaded?: boolean;
  documents?: unknown;
};

type SaveUploadedDocumentsApiResponse = {
  message?: string;
  Message?: string;
  applicationStatus?: string;
  Application_status?: string;
  application_status?: string;
};

const API_BASE_URL = (import.meta.env.VITE_PMS_API_BASE_URL ?? "").replace(/\/$/, "");

const withBase = (path: string): string => {
  if (!API_BASE_URL) {
    return path;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const absoluteBaseMatch = API_BASE_URL.match(/^https?:\/\/[^/]+(\/.*)?$/i);
  const basePath = absoluteBaseMatch ? (new URL(API_BASE_URL).pathname || "") : API_BASE_URL;
  const normalizedBasePath = basePath.replace(/\/+$/, "");

  let resolvedPath = normalizedPath;

  // Prevent duplicate path segments when base already contains the endpoint prefix.
  if (
    normalizedBasePath &&
    normalizedBasePath !== "/" &&
    (normalizedPath === normalizedBasePath || normalizedPath.startsWith(`${normalizedBasePath}/`))
  ) {
    resolvedPath = normalizedPath.slice(normalizedBasePath.length) || "/";
    if (!resolvedPath.startsWith("/")) {
      resolvedPath = `/${resolvedPath}`;
    }
  }

  return `${API_BASE_URL}${resolvedPath}`;
};

const API_ENDPOINTS = {
  validatePan: import.meta.env.VITE_PMS_INDIVIDUAL_VALIDATE_PAN_URL ?? withBase("/dms-api/api/v1/pan/validate"),
  checkPanInInternalDb:
    import.meta.env.VITE_PMS_INDIVIDUAL_INTERNAL_PAN_CHECK_URL ?? withBase("/pms/individual/pan/internal-check"),
  verifyAprn:
    import.meta.env.VITE_PMS_INDIVIDUAL_APRN_VERIFY_URL ?? withBase("/dms-api/apmi/validateAprnNumber"),
  validateAmfiContact:
    import.meta.env.VITE_PMS_INDIVIDUAL_VALIDATE_AMFI_CONTACT_URL ?? withBase("/pms/individual/amfi/contact/validate"),
  sendOtp: import.meta.env.VITE_PMS_INDIVIDUAL_SEND_OTP_URL ?? withBase("/dms-api/authentication/generateOtp"),
  sendAmfiOtp: import.meta.env.VITE_PMS_INDIVIDUAL_SEND_AMFI_OTP_URL ?? withBase("/pms/individual/amfi/otp/send"),
  verifyOtp: import.meta.env.VITE_PMS_INDIVIDUAL_VERIFY_OTP_URL ?? withBase("/dms-api/authentication/verifyOtp"),
  verifyAmfiOtp:
    import.meta.env.VITE_PMS_INDIVIDUAL_VERIFY_AMFI_OTP_URL ?? withBase("/pms/individual/amfi/otp/verify"),
  saveBusinessDetails:
    import.meta.env.VITE_PMS_INDIVIDUAL_SAVE_BUSINESS_DETAILS_URL ?? withBase("/dms-api/businessCategory/saveBusinessDetails"),
  updateManualData:
    import.meta.env.VITE_PMS_UPDATE_MANUAL_DATA_URL ?? withBase("/dms-api/applicant/updateManualData"),
  getPanDetailsByKra:
    import.meta.env.VITE_PMS_GET_PAN_DETAILS_BY_KRA_URL ?? withBase("/dms-api/kra/getPanDetailsByKRA"),
  validateInputWithKra:
    import.meta.env.VITE_PMS_VALIDATE_INPUT_WITH_KRA_URL ?? withBase("/dms-api/kra/validateInputWithKRA"),
  validateArn: import.meta.env.VITE_PMS_VALIDATE_ARN_URL ?? withBase("/dms-api/api/v1/arn/validate"),
  getPersonalDetails:
    import.meta.env.VITE_PMS_INDIVIDUAL_GET_PERSONAL_DETAILS_URL ?? withBase("/dms-api/applicant/getPersonalDetails"),
  savePersonalDetails:
    import.meta.env.VITE_PMS_INDIVIDUAL_SAVE_PERSONAL_DETAILS_URL ?? withBase("/dms-api/applicant/savePersonalDetails"),
  getBusinessDetails:
    import.meta.env.VITE_PMS_GET_BUSINESS_DETAILS_URL ?? withBase("/dms-api/businessDetails/getBusinessDetails"),
  /** Ready for future pincode/geo branch search — not wired in UI yet. */
  getBranchList:
    import.meta.env.VITE_PMS_GET_BRANCH_LIST_URL ?? withBase("/dms-api/businessDetails/getBranchList"),
  validateGstIn:
    import.meta.env.VITE_PMS_VALIDATE_GST_IN_URL ?? withBase("/dms-api/businessDetails/validateGstIn"),
  uploadDocument:
    import.meta.env.VITE_PMS_UPLOAD_DOCUMENT_URL ?? withBase("/dms-api/api/v1/thirdparty/upload-document"),
  downloadFile:
    import.meta.env.VITE_PMS_DOWNLOAD_FILE_URL ?? withBase("/dms-api/api/v1/thirdparty/download-file"),
  documentOcr:
    import.meta.env.VITE_PMS_DOCUMENT_OCR_URL ?? withBase("/dms-api/api/v1/thirdparty/document-ocr"),
  saveGstDetails:
    import.meta.env.VITE_PMS_SAVE_GST_DETAILS_URL ?? withBase("/dms-api/businessDetails/saveGSTDetails"),
  getNomineeDetails:
    import.meta.env.VITE_PMS_GET_NOMINEE_DETAILS_URL ?? withBase("/dms-api/nominee/getNomineeDetails"),
  saveNomineeDetails:
    import.meta.env.VITE_PMS_SAVE_NOMINEE_DETAILS_URL ?? withBase("/dms-api/nominee/saveNomineeDetails"),
  getUploadDocuments:
    import.meta.env.VITE_PMS_GET_UPLOAD_DOCUMENTS_URL ?? withBase("/dms-api/documents/getUploadDocuments"),
  saveUploadedDocuments:
    import.meta.env.VITE_PMS_SAVE_UPLOADED_DOCUMENTS_URL ??
    withBase("/dms-api/documents/saveUploadedDocuments"),
  getApplicationReviewDetails:
    import.meta.env.VITE_PMS_GET_APPLICATION_REVIEW_DETAILS_URL ??
    withBase("/dms-api/application/getApplicationReviewDetails"),
  createApplication:
    import.meta.env.VITE_PMS_CREATE_APPLICATION_URL ?? withBase("/dms-api/application/createApplication"),
  generatePdf:
    import.meta.env.VITE_PMS_GENERATE_PDF_URL ?? withBase("/dms-api/pdf/generate"),
  getBankDetails:
    import.meta.env.VITE_PMS_GET_BANK_DETAILS_URL ?? withBase("/dms-api/applicant/getBankDetails"),
  pennyDropCall:
    import.meta.env.VITE_PMS_PENNY_DROP_CALL_URL ?? withBase("/dms-api/pennydrop/pan/pennyDropCall"),
  saveBankDetails:
    import.meta.env.VITE_PMS_SAVE_BANK_DETAILS_URL ?? withBase("/dms-api/applicant/saveBankDetails"),
  reversePennyDropInitiatePayment:
    import.meta.env.VITE_PMS_REVERSE_PENNY_DROP_INITIATE_URL ??
    withBase("/dms-api/api/reversepennydrop/initiatePayment"),
  reversePennyDropGetValidationStatus:
    import.meta.env.VITE_PMS_REVERSE_PENNY_DROP_STATUS_URL ??
    withBase("/dms-api/api/reversepennydrop/getValidationStatus"),
  reversePennyDropFetchBankDetails:
    import.meta.env.VITE_PMS_REVERSE_PENNY_DROP_FETCH_URL ??
    withBase("/dms-api/api/reversepennydrop/fetchBankDetails"),
  getStates: import.meta.env.VITE_PMS_GET_STATES_URL ?? withBase("/dms-api/api/v1/states"),
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const asStringOrNull = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const asTextOrNull = (value: unknown): string | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return asStringOrNull(value);
};

const toLastTenMobileDigits = (value: unknown): string | null => {
  const digits = (asTextOrNull(value) ?? "").replace(/\D/g, "");
  if (digits.length >= 10) {
    return digits.slice(-10);
  }

  return asTextOrNull(value);
};

const asBooleanOrUndefined = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }

  return undefined;
};

const extractPayload = (value: unknown): Record<string, unknown> => {
  if (!isRecord(value)) {
    return {};
  }

  const nestedData = value.data;
  if (isRecord(nestedData)) {
    return nestedData;
  }

  return value;
};

const normalizeProductTypes = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
};

const asRecord = (value: unknown): Record<string, unknown> => {
  return isRecord(value) ? value : {};
};

const pickNestedRecord = (root: Record<string, unknown>, keys: string[]): Record<string, unknown> => {
  for (const key of keys) {
    const nested = root[key];
    if (isRecord(nested)) {
      return nested;
    }
  }

  return {};
};

const pickString = (source: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const value = asStringOrNull(source[key]);
    if (value) {
      return value;
    }
  }

  return "";
};

const pickBoolean = (source: Record<string, unknown>, keys: string[]): boolean => {
  for (const key of keys) {
    const value = asBooleanOrUndefined(source[key]);
    if (value !== undefined) {
      return value;
    }
  }

  return false;
};

const parseProofOfIdentity = (
  value: string,
): { proofOfIdentityType: string; proofOfIdentityNumber: string } => {
  const separatorIndex = value.indexOf(":");
  if (separatorIndex < 0) {
    return { proofOfIdentityType: value, proofOfIdentityNumber: "" };
  }

  return {
    proofOfIdentityType: value.slice(0, separatorIndex).trim(),
    proofOfIdentityNumber: value.slice(separatorIndex + 1).trim(),
  };
};

const parseNomineeMinorAndDob = (
  value: unknown,
): { isNomineeMinor?: boolean; dateOfBirth: string } => {
  if (typeof value === "boolean") {
    return { isNomineeMinor: value, dateOfBirth: "" };
  }

  if (typeof value !== "string") {
    return { dateOfBirth: "" };
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return { dateOfBirth: "" };
  }

  const booleanOnly = asBooleanOrUndefined(trimmed);
  if (booleanOnly !== undefined) {
    return { isNomineeMinor: booleanOnly, dateOfBirth: "" };
  }

  // Backend sometimes returns "false 08/11/1976" (flag + DOB concatenated).
  const match = trimmed.match(/^(true|false)\s+(.+)$/i);
  if (match) {
    return {
      isNomineeMinor: match[1].toLowerCase() === "true",
      dateOfBirth: match[2].trim(),
    };
  }

  const dateMatch = trimmed.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);
  if (dateMatch) {
    return { dateOfBirth: dateMatch[1] };
  }

  return { dateOfBirth: "" };
};

const mapReviewDetailsResponse = (payload: Record<string, unknown>, leadId: string): ReviewDetailsResponse => {
  const personal = pickNestedRecord(payload, [
    "personal",
    "personalDetails",
    "PersonalDetails",
    "personalInformation",
  ]);
  const business = pickNestedRecord(payload, ["business", "businessDetails", "BusinessDetails"]);
  const bank = pickNestedRecord(payload, ["bank", "bankDetails", "BankDetails"]);
  const nominee = pickNestedRecord(payload, ["nominee", "nomineeDetails", "NomineeDetails"]);
  const documents = pickNestedRecord(payload, [
    "documents",
    "documentDetails",
    "DocumentDetails",
    "uploadedDocuments",
  ]);

  const personalSource = Object.keys(personal).length > 0 ? personal : payload;
  const businessSource = Object.keys(business).length > 0 ? business : payload;
  const bankSource = Object.keys(bank).length > 0 ? bank : payload;
  const nomineeSource = Object.keys(nominee).length > 0 ? nominee : payload;
  const documentsSource = Object.keys(documents).length > 0 ? documents : payload;

  const productCategories = normalizeProductTypes(
    businessSource.productCategories ??
    businessSource.categories ??
    businessSource.selectedProducts ??
    payload.productCategories ??
    payload.categories,
  );

  const gstList = Array.isArray(businessSource.gstDetails)
    ? businessSource.gstDetails
    : Array.isArray(businessSource.gstInDetails)
      ? businessSource.gstInDetails
      : Array.isArray(payload.gstDetails)
        ? payload.gstDetails
        : Array.isArray(payload.gstInDetails)
          ? payload.gstInDetails
          : [];
  const gstDetails = gstList
    .map((item) => {
      const record = asRecord(item);
      const isSelected = asBooleanOrUndefined(record.isSelected);
      if (isSelected === false) {
        return null;
      }

      return {
        gstNumber: pickString(record, ["gstInId", "gstIn", "gstNumber"]),
        stateCode: pickString(record, ["gstInState", "stateCode", "state"]),
        legalName: pickString(record, ["gstInName", "name", "legalName"]),
      };
    })
    .filter((item): item is ReviewGstDetail => item !== null);
  const gstSummary =
    pickString(businessSource, ["gstSummary", "gstInSummary"]) ||
    gstDetails
      .map((item) => {
        if (item.gstNumber && item.legalName) {
          return `${item.legalName} (${item.gstNumber})`;
        }

        return item.legalName || item.gstNumber;
      })
      .filter(Boolean)
      .join(", ");

  const uploadedPhoto = pickString(documentsSource, [
    "uploadedPhoto",
    "photo",
    "photoUrl",
    "photoURL",
  ]);
  const uploadedSignature = pickString(documentsSource, [
    "uploadedSignature",
    "signature",
    "signatureUrl",
    "signatureURL",
  ]);
  const cancelledChequeUrl = pickString(bankSource, [
    "uploadedCancelledChequeURL",
    "uploadedCancelledChequeUrl",
    "cancelledChequeURL",
    "cancelledChequeUrl",
  ]);

  const proofOfIdentityRaw = pickString(nomineeSource, ["proofOfIdentity"]);
  const parsedProof = proofOfIdentityRaw
    ? parseProofOfIdentity(proofOfIdentityRaw)
    : { proofOfIdentityType: "", proofOfIdentityNumber: "" };
  const nomineeMinorParsed = parseNomineeMinorAndDob(nomineeSource.isNomineeMinor);

  return {
    leadId: pickString(payload, ["leadId"]) || leadId,
    applicationStatus: pickString(payload, [
      "applicationStatus",
      "Application_status",
      "application_status",
    ]),
    nextInfoSection: pickString(payload, ["nextInfoSection"]),
    personal: {
      name: pickString(personalSource, ["name", "applicantName", "fullName"]),
      panNumber: pickString(personalSource, ["panNumber", "pan"]),
      dob: pickString(personalSource, ["dob", "dateOfBirth"]),
      email: pickString(personalSource, ["email", "primaryEmail", "emailId"]),
      mobile: pickString(personalSource, [
        "mobile",
        "primaryMobile",
        "primaryMobileNumber",
        "mobileNumber",
      ]),
      permanentAddress: pickString(personalSource, ["permanentAddress"]),
      correspondenceAddress: pickString(personalSource, ["correspondenceAddress"]),
      aprnNumber: pickString(personalSource, ["aprnNumber", "aprn"]),
      arnNumber:
        pickString(personalSource, ["arnNumber", "arn"]) ||
        pickString(payload, ["arnNumber", "arn"]),
      entityType: pickString(personalSource, ["entityType"]),
    },
    business: {
      selectedBranch: pickString(businessSource, ["selectedBranch", "branchName", "branch"]),
      productCategories,
      gstSummary,
      gstDetails,
    },
    bank: {
      accountHolderName: pickString(bankSource, [
        "accountHolderName",
        "accountName",
        "nameAsPerBank",
        "name",
      ]),
      accountNumber: pickString(bankSource, ["accountNumber", "bankAccountNumber"]),
      ifsc: pickString(bankSource, ["ifsc", "ifscCode"]),
      bankName: pickString(bankSource, ["bankName", "bank"]),
      branchName: pickString(bankSource, [
        "branchName",
        "branchNameandAddress",
        "branchNameAndAddress",
        "bankBranch",
        "branchAddress",
      ]),
      chequeUploaded:
        pickBoolean(bankSource, ["chequeUploaded", "isChequeUploaded"]) || Boolean(cancelledChequeUrl),
    },
    nominee: {
      nomineeName: pickString(nomineeSource, ["nomineeName", "name"]),
      relationshipWithApplicant: pickString(nomineeSource, [
        "relationshipWithApplicant",
        "relationShipWithApplicant",
        "relationship",
      ]),
      mobileNumber: pickString(nomineeSource, ["mobileNumber", "mobile"]),
      emailId: pickString(nomineeSource, ["emailId", "email"]),
      dateOfBirth:
        pickString(nomineeSource, ["dateOfBirth", "dob"]) || nomineeMinorParsed.dateOfBirth,
      nomineeAddress: pickString(nomineeSource, ["nomineeAddress", "address"]),
      proofOfIdentityType:
        pickString(nomineeSource, ["proofOfIdentityType"]) || parsedProof.proofOfIdentityType,
      proofOfIdentityNumber:
        pickString(nomineeSource, ["proofOfIdentityNumber"]) || parsedProof.proofOfIdentityNumber,
      isMinor:
        pickBoolean(nomineeSource, ["isMinor", "isNomineeMinor"]) ||
        Boolean(nomineeMinorParsed.isNomineeMinor),
    },
    documents: {
      uploadedPhoto,
      uploadedSignature,
      documentUploaded: pickBoolean(documentsSource, ["documentUploaded"]),
      photoUploaded: pickBoolean(documentsSource, ["photoUploaded"]) || Boolean(uploadedPhoto),
      signatureUploaded:
        pickBoolean(documentsSource, ["signatureUploaded"]) || Boolean(uploadedSignature),
    },
  };
};

const normalizeStatesResponse = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  if (!isRecord(value)) {
    return [];
  }

  const nested = value.data ?? value.states ?? value.stateList;
  if (Array.isArray(nested)) {
    return normalizeStatesResponse(nested);
  }

  return [];
};

const normalizePanValidationResponse = (rawData: unknown): ValidatePanResponse => {
  const data = extractPayload(rawData);
  const status = asStringOrNull(data.status)?.toUpperCase();
  const explicitValidity =
    asBooleanOrUndefined(data.isValid) ?? asBooleanOrUndefined(data.valid) ?? asBooleanOrUndefined(data.success);
  const existingProductTypes = normalizeProductTypes(data.existingProductTypes);
  const fallbackProductTypes = normalizeProductTypes(data.productTypes);

  return {
    isValid: explicitValidity ?? status === "SUCCESS",
    message: asStringOrNull(data.message) ?? asStringOrNull(data.errorMessage) ?? undefined,
    email: asStringOrNull(data.email),
    mobile: asStringOrNull(data.mobile),
    leadId:
      asStringOrNull(data.leadId) ?? asStringOrNull(data.leadID) ?? asStringOrNull(data.lead_id) ?? null,
    existingProductTypes: existingProductTypes.length > 0 ? existingProductTypes : fallbackProductTypes,
    isExistingApplicant: asBooleanOrUndefined(data.isExistingApplicant),
    isExistingDistributor: asBooleanOrUndefined(data.isExistingDistributor),
  };
};

const extractErrorMessage = (error: unknown): string | undefined => {
  if (!isRecord(error)) {
    return undefined;
  }

  const errorWithResponse = error as ErrorWithResponse;
  const payload = extractPayload(errorWithResponse.response?.data);

  const messageFromPayload =
    asStringOrNull(payload.message) ??
    asStringOrNull(payload.Message) ??
    asStringOrNull(payload.errorMessage) ??
    asStringOrNull(payload.error);
  if (messageFromPayload) {
    return messageFromPayload;
  }

  return asStringOrNull(errorWithResponse.message) ?? undefined;
};

export { extractErrorMessage };

export const onboardingApi = {
  async validatePan(pan: string): Promise<ValidatePanResponse> {
    const normalizedPan = pan.trim().toUpperCase();
    const payload = {
      pan: normalizedPan,
    };

    try {
      const response = await apiPost<PanValidationApiResponse>(API_ENDPOINTS.validatePan, payload);
      return normalizePanValidationResponse(response);
    } catch (error) {
      return {
        isValid: false,
        message: extractErrorMessage(error),
        email: null,
        mobile: null,
        leadId: null,
        existingProductTypes: [],
        isExistingApplicant: undefined,
        isExistingDistributor: undefined,
      };
    }
  },

  async checkPanInInternalDb(pan: string): Promise<InternalPanCheckResponse> {
    const normalizedPan = pan.trim().toUpperCase();
    const response = await apiPost<InternalPanApiResponse>(API_ENDPOINTS.checkPanInInternalDb, {
      panNumber: normalizedPan,
    });
    const data = response;

    return {
      exists: data.exists ?? data.found ?? false,
      message: data.message,
    };
  },

  async verifyAprn(request: VerifyAprnRequest): Promise<VerifyAprnResponse> {
    const payload = {
      aprnNumber: request.aprnNumber,
      leadId: request.leadId,
      panNumber: request.panNumber,
    };

    const response = await apiPost<VerifyAprnApiResponse>(API_ENDPOINTS.verifyAprn, payload);
    const envelope = isRecord(response) ? response : {};
    const data = extractPayload(response) as VerifyAprnApiResponse;
    const envelopeStatus = (asStringOrNull(envelope.status) ?? "").toLowerCase();
    const envelopeFailed = envelopeStatus === "failed" || envelopeStatus === "error";
    const hasEnvelope = envelopeStatus.length > 0 || typeof envelope.statusCode === "number";
    const envelopeSuccess =
      !envelopeFailed &&
      (envelopeStatus === "success" || envelope.statusCode === 200 || !hasEnvelope);

    const validationFlag =
      asBooleanOrUndefined(data.validationStatus) ??
      asBooleanOrUndefined(data.isValid) ??
      asBooleanOrUndefined(data.valid);
    const validationText = asTextOrNull(data.validationStatus)?.toLowerCase();
    const validationStatus = validationFlag === true || validationText === "success";

    const aprnStatusFlag = asBooleanOrUndefined(data.aprnStatus);
    const aprnStatusText = asTextOrNull(data.aprnStatus)?.toLowerCase();
    const aprnStatus =
      aprnStatusFlag === true ||
      aprnStatusText === "success" ||
      (aprnStatusFlag === undefined && aprnStatusText == null);

    return {
      success: envelopeSuccess && validationStatus && aprnStatus,
      validationStatus,
      message:
        asStringOrNull(data.message) ??
        asStringOrNull(data.Message) ??
        asStringOrNull(envelope.message) ??
        undefined,
      email: asStringOrNull(data.email),
      mobile: toLastTenMobileDigits(data.mobile),
      aprnStatus,
      leadId: asStringOrNull(data.leadId) ?? request.leadId,
      dataSource: asStringOrNull(data.dataSource),
    };
  },

  async validateAmfiContact(
    request: ValidateAmfiContactRequest,
  ): Promise<ValidateAmfiContactResponse> {
    const payload = {
      pan: request.pan.trim().toUpperCase(),
      arn: request.arn,
      contact: request.contact,
    };

    const response = await apiPost<ValidateAmfiContactApiResponse>(API_ENDPOINTS.validateAmfiContact, payload);
    const data = response;

    return {
      success: data.success ?? (data.status === "SUCCESS"),
      message: data.message,
      maskedEmail: data.maskedEmail ?? null,
      maskedMobile: data.maskedMobile ?? null,
    };
  },

  async sendOtp(request: SendOtpRequest): Promise<SendOtpResponse> {
    const payload = {
      email: request.email.trim(),
      leadId: request.leadId,
      mobile: request.mobile.trim(),
      panNumber: request.panNumber.trim().toUpperCase(),
      type: request.type,
    };

    const response = await apiPost<SendOtpApiResponse>(API_ENDPOINTS.sendOtp, payload);
    const data = response ?? {};
    const status = asStringOrNull(data.status)?.toLowerCase();
    const failedStatus = status === "failed" || status === "failure" || status === "error";
    const success =
      !failedStatus &&
      (data.success === true ||
        data.sent === true ||
        status === "success" ||
        data.statusCode === 200);

    return {
      success,
      message: asStringOrNull(data.message) ?? undefined,
    };
  },

  async sendAmfiOtp(request: SendAmfiOtpRequest): Promise<{ success: boolean; expiresInSeconds: number }> {
    const response = await apiPost<SendOtpApiResponse>(API_ENDPOINTS.sendAmfiOtp, request);
    const data = response;

    return {
      success: data.success ?? data.sent ?? false,
      expiresInSeconds: data.expiresInSeconds ?? data.expiryInSeconds ?? 30,
    };
  },

  async verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const payload = {
      leadId: request.leadId,
      otp: request.otp,
      panNumber: request.panNumber.trim().toUpperCase(),
      type: request.type,
    };

    const response = await apiPost<VerifyOtpApiResponse>(API_ENDPOINTS.verifyOtp, payload);
    const data = response ?? {};
    const status = asStringOrNull(data.status)?.toLowerCase();
    const failedStatus = status === "failed" || status === "failure" || status === "error";
    const verified =
      !failedStatus &&
      (data.verified === true ||
        data.success === true ||
        status === "success" ||
        data.statusCode === 200);

    return {
      verified,
      message: asStringOrNull(data.message) ?? undefined,
      verifiedSource:
        asStringOrNull(data.verifiedSource) ??
        asStringOrNull(data.verifedSoruce) ??
        asStringOrNull(data.data?.verifiedSource) ??
        asStringOrNull(data.data?.verifedSoruce),
    };
  },

  async verifyAmfiOtp(request: VerifyAmfiOtpRequest): Promise<VerifyOtpResponse> {
    const response = await apiPost<VerifyOtpApiResponse>(API_ENDPOINTS.verifyAmfiOtp, request);
    const data = response;

    return {
      verified: data.verified ?? data.success ?? false,
    };
  },

  async getPersonalDetails(leadId: string): Promise<GetPersonalDetailsResponse> {
    const response = await apiPost<GetPersonalDetailsApiResponse>(API_ENDPOINTS.getPersonalDetails, {
      leadId,
    });
    const data = extractPayload(response) as GetPersonalDetailsApiResponse;

    return {
      name: asStringOrNull(data.name) ?? "",
      panNumber: asStringOrNull(data.panNumber) ?? "",
      dob: asStringOrNull(data.dob) ?? "",
      aprnNumber: asStringOrNull(data.aprnNumber) ?? "",
      arnNumber: asStringOrNull(data.arnNumber) ?? "",
      entityType: asStringOrNull(data.entityType) ?? "",
      email: asStringOrNull(data.email) ?? "",
      mobile: asStringOrNull(data.mobile) ?? "",
      permanentAddress: asStringOrNull(data.permanentAddress) ?? "",
      correspondenceAddress: asStringOrNull(data.correspondenceAddress) ?? "",
      Application_status:
        asStringOrNull(data.Application_status) ?? asStringOrNull(data.application_status) ?? "",
      nextInfoSection: asStringOrNull(data.nextInfoSection) ?? "",
      isCorrespoingSameAsPermanent:
        asBooleanOrUndefined(data.isCorrespoingSameAsPermanent) ??
        asBooleanOrUndefined(data.isCorrespondingSameAsPermanent) ??
        false,
    };
  },

  async savePersonalDetails(request: SavePersonalDetailsRequest): Promise<SavePersonalDetailsResponse> {
    const payload: SavePersonalDetailsRequest = {
      correspondenceAddress: request.correspondenceAddress.trim(),
      isCorrespoingSameAsPermanent: request.isCorrespoingSameAsPermanent,
      leadId: request.leadId,
      primaryEmail: request.primaryEmail.trim(),
      primaryMobile: request.primaryMobile.trim(),
      dob: request.dob.trim(),
      name: request.name.trim(),
      permanentAddress: request.permanentAddress.trim(),
      dataSource: request.dataSource,
    };

    const response = await apiPost<SavePersonalDetailsApiResponse>(API_ENDPOINTS.savePersonalDetails, payload);
    const data = extractPayload(response) as SavePersonalDetailsApiResponse;

    return {
      Message: asStringOrNull(data.Message) ?? asStringOrNull(data.message) ?? "",
      Application_status:
        asStringOrNull(data.Application_status) ?? asStringOrNull(data.application_status) ?? "",
      nextInfoSection: asStringOrNull(data.nextInfoSection) ?? undefined,
    };
  },

  async updateManualData(request: UpdateManualDataRequest): Promise<UpdateManualDataResponse> {
    const response = await apiPost<UpdateManualDataApiResponse>(API_ENDPOINTS.updateManualData, {
      leadId: request.leadId,
    });
    const data = extractPayload(response) as UpdateManualDataApiResponse;
    const status = (asStringOrNull(data.status) ?? "").toUpperCase();
    const successFlag = asBooleanOrUndefined(data.success);
    const failed = successFlag === false || status === "FAILED" || status === "ERROR";
    const succeeded = successFlag === true || status === "SUCCESS" || !failed;

    return {
      success: succeeded,
      message: asStringOrNull(data.message) ?? asStringOrNull(data.Message) ?? undefined,
      leadId: asStringOrNull(data.leadId),
    };
  },

  async getPanDetailsByKra(request: GetPanDetailsByKraRequest): Promise<GetPanDetailsByKraResponse> {
    const response = await apiPost<GetPanDetailsByKraApiResponse>(API_ENDPOINTS.getPanDetailsByKra, {
      leadId: request.leadId,
      panNo: request.panNo.trim().toUpperCase(),
    });
    const envelope = isRecord(response) ? response : {};
    const data = extractPayload(response) as GetPanDetailsByKraApiResponse;
    const envelopeStatus = (asStringOrNull(envelope.status) ?? "").toLowerCase();
    const envelopeFailed = envelopeStatus === "failed" || envelopeStatus === "error";
    const envelopeSuccess =
      !envelopeFailed && (envelopeStatus === "success" || envelope.statusCode === 200);

    return {
      leadId: asStringOrNull(data.leadId),
      success: envelopeSuccess,
      validationStatus: asBooleanOrUndefined(data.validationStatus) ?? false,
      arnStatus: asTextOrNull(data.arnStatus),
      mobile: toLastTenMobileDigits(data.mobile),
      email: asStringOrNull(data.email),
      dataSource: asStringOrNull(data.dataSource),
      message:
        asStringOrNull(envelope.message) ??
        asStringOrNull(data.message) ??
        asStringOrNull(data.Message) ??
        undefined,
    };
  },

  async validateInputWithKra(request: ValidateInputWithKraRequest): Promise<ValidateInputWithKraResponse> {
    const payload = {
      email: request.email.trim(),
      leadId: request.leadId,
      mobile: request.mobile.trim(),
    };

    const response = await apiPost<ValidateInputWithKraApiResponse>(
      API_ENDPOINTS.validateInputWithKra,
      payload,
    );
    const envelope = isRecord(response) ? response : {};
    const data = extractPayload(response) as ValidateInputWithKraApiResponse;
    const envelopeStatus = (asStringOrNull(envelope.status) ?? "").toLowerCase();
    const envelopeFailed = envelopeStatus === "failed" || envelopeStatus === "error";
    const isValidated = !envelopeFailed && (asBooleanOrUndefined(data.isValidated) ?? false);

    return {
      isValidated,
      errorMsg: asStringOrNull(data.errorMsg),
      message:
        asStringOrNull(envelope.message) ??
        asStringOrNull(data.message) ??
        asStringOrNull(data.Message) ??
        undefined,
    };
  },

  async validateArn(request: ValidateArnRequest): Promise<ValidateArnResponse> {
    const payload = {
      leadId: request.leadId,
      pan: request.pan.trim().toUpperCase(),
      arn: request.arn.trim().toUpperCase(),
      email: request.email.trim(),
      mobile: request.mobile.trim(),
    };

    const response = await apiPost<ValidateArnApiResponse>(API_ENDPOINTS.validateArn, payload);
    const envelope = isRecord(response) ? response : {};
    const data = extractPayload(response) as ValidateArnApiResponse;
    const envelopeStatus = (asStringOrNull(envelope.status) ?? "").toLowerCase();
    const envelopeFailed = envelopeStatus === "failed" || envelopeStatus === "error";
    const rawValidateStatus = data.validateStatus ?? data.validationStatus;
    const statusText = asTextOrNull(rawValidateStatus)?.toUpperCase();
    const statusFlag = asBooleanOrUndefined(rawValidateStatus);
    const validateStatus =
      !envelopeFailed && (statusFlag === true || statusText === "SUCCESS");

    return {
      leadId: asStringOrNull(data.leadId),
      validateStatus,
      arnStatus: asTextOrNull(data.arnStatus),
      mobile: toLastTenMobileDigits(data.mobile),
      email: asStringOrNull(data.email),
      message:
        asStringOrNull(envelope.message) ??
        asStringOrNull(data.message) ??
        asStringOrNull(data.Message) ??
        undefined,
      expiringInDays: asBooleanOrUndefined(data.expiringInDays) ?? null,
    };
  },

  async saveBusinessDetails(requestPayload: SaveBusinessDetailsRequest): Promise<SaveBusinessDetailsResponse> {
    const payload = {
      categories: requestPayload.categories,
      leadId: requestPayload.leadId,
      panNumber: requestPayload.panNumber,
    };

    const res = await apiPost<SaveBusinessDetailsApiResponse>(API_ENDPOINTS.saveBusinessDetails, payload);
    const data = res ?? {};

    return {
      status: data.status ?? "",
      message: data.message,
      leadId: data.leadId ?? null,
      applicationIds: Array.isArray(data.applicationIds) ? data.applicationIds : [],
    };
  },

  async getBusinessDetails(leadId: string): Promise<BusinessDetailsResponse> {
    const response = await apiPost<GetBusinessDetailsApiResponse>(API_ENDPOINTS.getBusinessDetails, {
      leadId,
    });
    const data = extractPayload(response) as GetBusinessDetailsApiResponse;
    const rawList = Array.isArray(data.gstInDetails) ? data.gstInDetails : [];

    return {
      selectedBranch: asStringOrNull(data.selectedBranch) ?? "",
      gstInDetails: rawList.map((item) => ({
        gstInId: asStringOrNull(item.gstInId) ?? "",
        gstInName: asStringOrNull(item.gstInName) ?? "",
        gstInState: asStringOrNull(item.gstInState) ?? "",
        isSelected: asBooleanOrUndefined(item.isSelected) ?? false,
        fileURL: asStringOrNull(item.fileURL) ?? asStringOrNull(item.fileUrl) ?? "",
      })),
    };
  },

  async getBranchList(pincode: string): Promise<BranchListResponse> {
    const response = await apiPost<BranchListItemApi[] | Record<string, unknown>>(
      API_ENDPOINTS.getBranchList,
      { pincode: pincode.trim() },
    );

    const nested =
      isRecord(response) && Array.isArray(response.data)
        ? response.data
        : isRecord(response) && Array.isArray(response.branchList)
          ? response.branchList
          : isRecord(response) && Array.isArray(response.branches)
            ? response.branches
            : null;

    const list = Array.isArray(response)
      ? response
      : Array.isArray(nested)
        ? (nested as BranchListItemApi[])
        : [];

    return list
      .map((item) => ({
        BranchName: asStringOrNull(item.BranchName) ?? asStringOrNull(item.branchName) ?? "",
      }))
      .filter((item) => item.BranchName.length > 0);
  },

  async getStates(): Promise<string[]> {
    const response = await apiGet<unknown>(API_ENDPOINTS.getStates);
    return normalizeStatesResponse(response);
  },

  async validateGstIn(request: ValidateGstInRequest): Promise<ValidateGstInResponse> {
    const response = await apiPost<ValidateGstInApiResponse>(API_ENDPOINTS.validateGstIn, {
      leadId: request.leadId,
      gstInNumber: request.gstInNumber.trim().toUpperCase(),
    });
    const data = extractPayload(response) as ValidateGstInApiResponse;

    return {
      isMatchFound: asBooleanOrUndefined(data.isMatchFound) ?? false,
      gstInId: asStringOrNull(data.gstInId) ?? "",
      legalName: asStringOrNull(data.legalName) ?? "",
      state: asStringOrNull(data.state) ?? "",
    };
  },

  async uploadDocument(request: UploadDocumentRequest): Promise<UploadDocumentResponse> {
    const payload: UploadDocumentPayload = {
      leadId: request.payload.leadId,
      panNumber: request.payload.panNumber.trim().toUpperCase(),
      applicationId: request.payload.applicationId,
      documentName: request.payload.documentName.trim(),
      documentType: request.payload.documentType.trim(),
      metadata: request.payload.metadata ?? {},
    };

    const formData = new FormData();
    formData.append("file", request.file, request.file.name);
    // Backend @RequestPart expects application/json (plain string parts become octet-stream → 415).
    formData.append(
      "payload",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );

    const response = await apiPostFormData<Record<string, unknown>>(
      API_ENDPOINTS.uploadDocument,
      formData,
    );
    const root = isRecord(response) ? response : {};
    if (root.success === false) {
      throw new Error(pickString(root, ["message", "Message", "error"]) || "Document upload failed.");
    }

    const data = extractPayload(response) as UploadDocumentApiResponse & Record<string, unknown>;
    const nestedData = data.data;
    const fileURL =
      pickString(data, ["fileURL", "fileUrl", "url", "blobUrl", "blobURL", "downloadUrl", "documentUrl"]) ||
      pickString(root, ["fileURL", "fileUrl", "url", "blobUrl", "blobURL", "downloadUrl", "documentUrl"]) ||
      (typeof nestedData === "string" ? asStringOrNull(nestedData) : null) ||
      "";

    return { fileURL };
  },

  async documentOcr(file: File): Promise<DocumentOcrResponse> {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const response = await apiPostFormData<Record<string, unknown>>(
      API_ENDPOINTS.documentOcr,
      formData,
    );
    const root = isRecord(response) ? response : {};
    if (root.success === false) {
      throw new Error(pickString(root, ["message", "Message"]) || "Document OCR failed.");
    }

    const data = extractPayload(response);

    return {
      name: pickString(data, ["name", "accountHolderName"]),
      bankName: pickString(data, ["bankName"]),
      accountNumber: pickString(data, ["accountNumber"]),
      ifscCode: pickString(data, ["ifscCode", "ifsc", "IFSCCode"]).toUpperCase(),
      accountType: pickString(data, ["accountType"]),
    };
  },

  async downloadFile(request: DownloadFileRequest): Promise<DownloadFileResponse> {
    const payload: DownloadFileRequest = {
      downloadLink: request.downloadLink.trim(),
      fileName: request.fileName.trim(),
      leadId: request.leadId,
      panNumber: request.panNumber.trim().toUpperCase(),
      type: request.type.trim().toLowerCase(),
    };

    const response = await apiPost<DownloadFileApiResponse | Record<string, unknown> | string>(
      API_ENDPOINTS.downloadFile,
      payload,
    );

    // download-file may decrypt to a raw base64 string (not a JSON envelope).
    if (typeof response === "string") {
      const fileURL = response.trim();
      if (!fileURL) {
        throw new Error("Document download returned an empty file URL.");
      }
      return { fileURL };
    }

    const envelope = isRecord(response) ? response : {};
    const envelopeData = envelope.data;
    const fromEnvelopeString =
      typeof envelopeData === "string" ? asStringOrNull(envelopeData) : null;

    const data = extractPayload(response) as DownloadFileApiResponse & Record<string, unknown>;
    const nestedData = data.data;
    const nestedRecord = isRecord(nestedData) ? nestedData : null;

    // Prefer viewable link / base64 fields — do not treat request echo `downloadLink`
    // as the result unless it differs from the storage URL we just sent.
    // UAT shape: { data: { data: { file: "<base64>", filename: "..." } } }
    const candidateFromFields =
      asStringOrNull(data.fileURL) ??
      asStringOrNull(data.fileUrl) ??
      asStringOrNull(data.downloadUrl) ??
      asStringOrNull(data.url) ??
      asStringOrNull(data.file) ??
      asStringOrNull(data.base64) ??
      asStringOrNull(data.fileContent) ??
      asStringOrNull(data.content) ??
      asStringOrNull(nestedRecord?.fileURL) ??
      asStringOrNull(nestedRecord?.fileUrl) ??
      asStringOrNull(nestedRecord?.downloadUrl) ??
      asStringOrNull(nestedRecord?.url) ??
      asStringOrNull(nestedRecord?.file) ??
      asStringOrNull(nestedRecord?.base64) ??
      asStringOrNull(nestedRecord?.fileContent) ??
      asStringOrNull(nestedRecord?.content) ??
      null;

    const echoedDownloadLink =
      asStringOrNull(data.downloadLink) ?? asStringOrNull(nestedRecord?.downloadLink);
    const fromDownloadLink =
      echoedDownloadLink && echoedDownloadLink !== payload.downloadLink
        ? echoedDownloadLink
        : null;

    const fileURL =
      fromEnvelopeString ??
      candidateFromFields ??
      (typeof nestedData === "string" ? asStringOrNull(nestedData) : null) ??
      fromDownloadLink ??
      "";

    if (!fileURL) {
      throw new Error("Document download returned an empty file URL.");
    }

    return { fileURL };
  },

  async saveGstDetails(request: SaveGstDetailsRequest): Promise<SaveGstDetailsResponse> {
    const payload: SaveGstDetailsRequest = {
      leadId: request.leadId,
      selectedBranch: request.selectedBranch.trim(),
      gstInDetails: request.gstInDetails.map((item) => ({
        gstInId: item.gstInId.trim().toUpperCase(),
        gstInName: item.gstInName.trim(),
        gstInState: item.gstInState.trim(),
        isSelected: item.isSelected,
        fileURL: item.fileURL.trim(),
      })),
    };

    const response = await apiPost<SaveGstDetailsApiResponse>(API_ENDPOINTS.saveGstDetails, payload);
    const data = extractPayload(response) as SaveGstDetailsApiResponse;

    return {
      Message: asStringOrNull(data.Message) ?? asStringOrNull(data.message) ?? "",
      Application_status:
        asStringOrNull(data.Application_status) ?? asStringOrNull(data.application_status) ?? "",
      nextInfoSection: asStringOrNull(data.nextInfoSection) ?? undefined,
    };
  },

  async getNomineeDetails(leadId: string): Promise<GetNomineeDetailsResponse> {
    const response = await apiPost<GetNomineeDetailsApiResponse>(API_ENDPOINTS.getNomineeDetails, {
      leadId,
    });
    const data = extractPayload(response) as GetNomineeDetailsApiResponse;

    return {
      nomineeName: asStringOrNull(data.nomineeName) ?? "",
      relationshipWithApplicant: asStringOrNull(data.relationshipWithApplicant) ?? "",
      proofOfIdentityType: asStringOrNull(data.proofOfIdentityType) ?? "",
      proofOfIdentityNumber: asStringOrNull(data.proofOfIdentityNumber) ?? "",
      mobileNumber: asStringOrNull(data.mobileNumber) ?? "",
      emailId: asStringOrNull(data.emailId) ?? "",
      dateOfBirth: asStringOrNull(data.dateOfBirth) ?? "",
      nomineeAddress: asStringOrNull(data.nomineeAddress) ?? "",
      guardianName: asStringOrNull(data.guardianName) ?? "",
      guardianAddress: asStringOrNull(data.guardianAddress) ?? "",
      isNomineeAddressSameAsApplicantAddress:
        asBooleanOrUndefined(data.isNomineeAddressSameAsApplicantAddress) ?? false,
      isGuardianAddressSameAsNomineeAddress:
        asBooleanOrUndefined(data.isGuardianAddressSameAsNomineeAddress) ?? false,
      isMinor: asBooleanOrUndefined(data.isMinor) ?? false,
    };
  },

  async saveNomineeDetails(request: SaveNomineeDetailsRequest): Promise<SaveNomineeDetailsResponse> {
    const payload: SaveNomineeDetailsRequest = {
      dateOfBirth: request.dateOfBirth.trim(),
      emailId: request.emailId.trim(),
      guardianAddress: request.guardianAddress.trim(),
      guardianName: request.guardianName.trim(),
      isGuardianAddressModified: request.isGuardianAddressModified,
      isGuardianAddressSameAsNomineeAddress: request.isGuardianAddressSameAsNomineeAddress,
      isMinor: request.isMinor,
      isNomineeAddressModified: request.isNomineeAddressModified,
      isNomineeAddressSameAsApplicantAddress: request.isNomineeAddressSameAsApplicantAddress,
      leadId: request.leadId,
      mobileNumber: request.mobileNumber.trim(),
      nomineeAddress: request.nomineeAddress.trim(),
      nomineeName: request.nomineeName.trim(),
      proofOfIdentityNumber: request.proofOfIdentityNumber.trim(),
      proofOfIdentityType: request.proofOfIdentityType.trim(),
      relationshipWithApplicant: request.relationshipWithApplicant.trim(),
    };

    const response = await apiPost<SaveNomineeDetailsApiResponse>(API_ENDPOINTS.saveNomineeDetails, payload);
    const data = extractPayload(response) as SaveNomineeDetailsApiResponse;

    return {
      Message: asStringOrNull(data.Message) ?? asStringOrNull(data.message) ?? "",
      Application_status:
        asStringOrNull(data.Application_status) ?? asStringOrNull(data.application_status) ?? "",
    };
  },

  async getUploadDocuments(leadId: string): Promise<GetUploadDocumentsResponse> {
    const response = await apiPost<GetUploadDocumentsApiResponse>(API_ENDPOINTS.getUploadDocuments, {
      leadId,
    });
    const data = extractPayload(response) as GetUploadDocumentsApiResponse;
    const listedDocs = Array.isArray(data.documents) ? data.documents : [];

    const urlFromListed = (names: string[]): string => {
      for (const item of listedDocs) {
        if (!isRecord(item)) {
          continue;
        }
        const name = (asStringOrNull(item.documentName) ?? "").trim().toLowerCase().replace(/\s+/g, "");
        const type = (asStringOrNull(item.documentType) ?? "").trim().toLowerCase().replace(/\s+/g, "");
        if (names.some((candidate) => name === candidate || type === candidate)) {
          return (
            asStringOrNull(item.documentUrl) ??
            asStringOrNull(item.fileURL) ??
            asStringOrNull(item.fileUrl) ??
            ""
          );
        }
      }
      return "";
    };

    return {
      leadId: asStringOrNull(data.leadId) ?? leadId,
      uploadedPhoto: asStringOrNull(data.uploadedPhoto) ?? "",
      uploadedSignature: asStringOrNull(data.uploadedSignature) ?? "",
      uploadedProofOfIdentity:
        asStringOrNull(data.uploadedProofOfIdentity) ??
        asStringOrNull(data.proofOfIdentity) ??
        urlFromListed(["proofofidentity", "identity"]) ??
        "",
      uploadedProofOfAddress:
        asStringOrNull(data.uploadedProofOfAddress) ??
        asStringOrNull(data.proofOfAddress) ??
        urlFromListed(["proofofaddress", "address"]) ??
        "",
      documentUploaded: asBooleanOrUndefined(data.documentUploaded) ?? false,
    };
  },

  async saveUploadedDocuments(
    request: SaveUploadedDocumentsRequest,
  ): Promise<SaveUploadedDocumentsResponse> {
    const payload: SaveUploadedDocumentsRequest = {
      leadId: request.leadId,
      documents: request.documents.map((item) => ({
        documentName: item.documentName.trim(),
        documentType: item.documentType.trim(),
        documentUrl: item.documentUrl.trim(),
      })),
    };

    const response = await apiPost<SaveUploadedDocumentsApiResponse>(
      API_ENDPOINTS.saveUploadedDocuments,
      payload,
    );
    const data = extractPayload(response) as SaveUploadedDocumentsApiResponse;

    return {
      message: asStringOrNull(data.message) ?? asStringOrNull(data.Message) ?? "",
      applicationStatus:
        asStringOrNull(data.applicationStatus) ??
        asStringOrNull(data.Application_status) ??
        asStringOrNull(data.application_status) ??
        "",
    };
  },

  async getApplicationReviewDetails(leadId: string): Promise<ReviewDetailsResponse> {
    const response = await apiPost<Record<string, unknown>>(API_ENDPOINTS.getApplicationReviewDetails, {
      leadId,
    });
    const data = extractPayload(response);
    return mapReviewDetailsResponse(data, leadId);
  },

  async createApplication(leadId: string): Promise<CreateApplicationResponse> {
    const response = await apiPost<Record<string, unknown>>(API_ENDPOINTS.createApplication, {
      leadId,
    });
    const root = isRecord(response) ? response : {};
    const data = extractPayload(response);

    const applicationIdRaw = data.applicationId;
    const applicationId = Array.isArray(applicationIdRaw)
      ? applicationIdRaw.filter((id): id is string => typeof id === "string" && id.trim().length > 0).map((id) => id.trim())
      : (() => {
        const single = asStringOrNull(applicationIdRaw);
        return single ? [single] : [];
      })();

    return {
      message:
        asStringOrNull(root.message) ??
        asStringOrNull(data.message) ??
        asStringOrNull(data.Message) ??
        "",
      applicationStatus:
        asStringOrNull(data.applicationStatus) ??
        asStringOrNull(data.Application_status) ??
        asStringOrNull(data.application_status) ??
        "",
      applicationId,
      expectedReviewTimeline: asStringOrNull(data.expectedReviewTimeline) ?? "",
      name: asStringOrNull(data.name) ?? "",
      primaryContactNumber: asStringOrNull(data.primaryContactNumber) ?? "",
      primaryEmail: asStringOrNull(data.primaryEmail) ?? "",
    };
  },

  async generatePdf(request: GeneratePdfRequest): Promise<GeneratePdfResponse> {
    const blob = await apiPostBlob(API_ENDPOINTS.generatePdf, {
      leadId: request.leadId,
    });

    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new Error("PDF generate returned an empty file.");
    }

    // Some gateways return JSON errors with a 200 + blob body.
    const contentType = (blob.type || "").toLowerCase();
    if (contentType.includes("application/json") || contentType.includes("text/")) {
      const text = (await blob.text()).trim();
      throw new Error(text || "PDF generate failed.");
    }

    const pdfBlob =
      contentType.includes("application/pdf") || contentType.includes("octet-stream") || !contentType
        ? new Blob([blob], { type: "application/pdf" })
        : blob;

    // Sanity-check PDF magic header when possible.
    const header = await pdfBlob.slice(0, 5).text();
    if (!header.startsWith("%PDF-")) {
      const text = (await pdfBlob.text()).trim();
      throw new Error(text || "PDF generate returned an invalid file.");
    }

    const fileURL = URL.createObjectURL(pdfBlob);
    return { fileURL, fileName: "application-form.pdf" };
  },

  async getBankDetails(leadId: string): Promise<GetBankDetailsResponse> {
    const response = await apiPost<Record<string, unknown>>(API_ENDPOINTS.getBankDetails, {
      leadId,
    });
    const data = extractPayload(response);

    return {
      name: asStringOrNull(data.name) ?? "",
      bankName: asStringOrNull(data.bankName) ?? "",
      bankType: asStringOrNull(data.bankType) ?? "",
      accountNumber: asStringOrNull(data.accountNumber) ?? "",
      ifscCode: asStringOrNull(data.ifscCode) ?? asStringOrNull(data.ifsc) ?? "",
      branchName: asStringOrNull(data.branchName) ?? "",
      bankAddress: asStringOrNull(data.bankAddress) ?? "",
      isBankVerified: asBooleanOrUndefined(data.isBankVerified) ?? false,
      isBankModified: asBooleanOrUndefined(data.isBankModified) ?? false,
      verificationType:
        asStringOrNull(data.verificationType) ??
        asStringOrNull(data.verification_type) ??
        asStringOrNull(data.verificationtype) ??
        "",
    };
  },

  async pennyDropCall(request: PennyDropCallRequest): Promise<PennyDropCallResponse> {
    const response = await apiPost<Record<string, unknown>>(API_ENDPOINTS.pennyDropCall, request);
    const root = isRecord(response) ? response : {};
    const payload = extractPayload(response);
    const successBlock = pickNestedRecord(payload, ["success", "Success"]);
    const nestedData = pickNestedRecord(successBlock, ["data", "Data"]);
    const accountSource = isRecord(nestedData.data) ? nestedData.data : nestedData;
    const rawAccounts = Array.isArray(accountSource.data)
      ? accountSource.data
      : Array.isArray(nestedData.data)
        ? nestedData.data
        : Array.isArray(payload.data)
          ? payload.data
          : [];

    const accounts: PennyDropAccountInfo[] = rawAccounts
      .filter((item): item is Record<string, unknown> => isRecord(item))
      .map((item) => ({
        amcCode: pickString(item, ["Amc_Code", "AmcCode", "amcCode"]),
        investorName: pickString(item, ["Investor_Name", "InvestorName", "investorName"]),
        accountNumber: pickString(item, ["Account_Number", "AccountNumber", "accountNumber"]),
        ifscCode: pickString(item, ["IFSC_Code", "IFSCCode", "ifscCode", "IFSC"]),
        pan: pickString(item, ["PAN", "pan", "panNumber"]),
        investorNameBank: pickString(item, [
          "Investor_Name_Bank",
          "InvestorNameBank",
          "investorNameBank",
        ]),
        accountCategory: pickString(item, [
          "Account_Category",
          "AccountCategory",
          "accountCategory",
        ]),
        accountHolder: pickString(item, ["Account_Holder", "AccountHolder", "accountHolder"]),
        accountNature: pickString(item, ["Account_Nature", "AccountNature", "accountNature"]),
        accountType: pickString(item, ["Account_Type", "AccountType", "accountType"]),
        nameMatchStatus: pickString(item, [
          "Name_Match_Status",
          "NameMatchStatus",
          "nameMatchStatus",
        ]),
        actualMatchPercentage: pickString(item, [
          "Actual_Match_Percentage",
          "ActualMatchPercentage",
          "actualMatchPercentage",
        ]),
        remarks: pickString(item, ["Remarks", "remarks"]),
        errorCode: pickString(item, ["Error_Code", "ErrorCode", "errorCode"]),
        errorDescription: pickString(item, [
          "Error_Description",
          "ErrorDescription",
          "errorDescription",
        ]),
      }));

    const status = pickString(root, ["status", "Status"]).toLowerCase();
    const statusCode = typeof root.statusCode === "number" ? root.statusCode : Number(root.statusCode) || 0;
    const message =
      pickString(root, ["message", "Message"]) ||
      pickString(payload, ["message", "Message"]) ||
      pickString(successBlock, ["responseMessage", "ResponseMessage"]) ||
      "";
    const topSuccess = accounts.some(
      (item) =>
        item.errorCode === "0" ||
        item.nameMatchStatus.toUpperCase() === "Y" ||
        item.errorDescription.toLowerCase().includes("success"),
    );
    const envelopeSuccess = status === "success" || message.toLowerCase().includes("successful");

    return {
      statusCode,
      status,
      message,
      success: envelopeSuccess || topSuccess,
      referenceId: pickString(accountSource, ["referenceId", "ReferenceId", "referenceID"]),
      successCode: pickString(successBlock, ["successCode", "SuccessCode"]),
      responseMessage: pickString(successBlock, ["responseMessage", "ResponseMessage"]),
      accounts,
    };
  },

  async saveBankDetails(request: SaveBankDetailsRequest): Promise<SaveBankDetailsResponse> {
    // Backend contract uses spaced keys: "Bank Details", "cancelled Cheque".
    const payload = {
      "Bank Details": {
        accountNumber: request.bankDetails.accountNumber.trim(),
        bankAddress: request.bankDetails.bankAddress.trim(),
        bankName: request.bankDetails.bankName.trim(),
        bankType: request.bankDetails.bankType.trim(),
        branchName: request.bankDetails.branchName.trim(),
        ifscCode: request.bankDetails.ifscCode.trim().toUpperCase(),
        name: request.bankDetails.name.trim(),
      },
      "cancelled Cheque": request.cancelledCheque.trim(),
      isBankModified: request.isBankModified,
      isBankVerified: request.isBankVerified,
      leadId: request.leadId,
      verification_type: request.verificationType,
    };

    const response = await apiPost<Record<string, unknown>>(API_ENDPOINTS.saveBankDetails, payload);
    const data = extractPayload(response);
    const root = isRecord(response) ? response : {};

    return {
      message:
        pickString(root, ["Message", "message"]) ||
        pickString(data, ["Message", "message"]) ||
        "",
      applicationStatus:
        pickString(root, ["Applicationstatus", "Application_status", "applicationStatus", "application_status"]) ||
        pickString(data, ["Applicationstatus", "Application_status", "applicationStatus", "application_status"]) ||
        "",
    };
  },

  async initiateReversePennyDropPayment(
    request: InitiateReversePennyDropRequest,
  ): Promise<InitiateReversePennyDropResponse> {
    const response = await apiPost<Record<string, unknown>>(
      API_ENDPOINTS.reversePennyDropInitiatePayment,
      {
        panNumber: request.panNumber.trim().toUpperCase(),
        requestData: {
          name: request.name.trim(),
          rpdVendor: request.rpdVendor.trim(),
        },
      },
    );

    const root = isRecord(response) ? response : {};
    const data = extractPayload(response);
    // HyperVerge: fields live under data.result; keep fallbacks for other vendors.
    const result = pickNestedRecord(data, ["result", "Result", "requestData", "RequestData"]);
    const source = Object.keys(result).length > 0 ? result : data;

    const qrCode = pickString(source, ["qrCode", "qr_code", "qr", "QRCode", "base64Qr", "qrBase64"]);
    const qrImageUrl = pickString(source, [
      "qrImageUrl",
      "qrImage",
      "qrUrl",
      "qr_image_url",
      "imageUrl",
    ]);

    const toDataUri = (raw: string): string => {
      const value = raw.trim();
      if (!value) {
        return "";
      }
      if (value.startsWith("data:") || value.startsWith("http://") || value.startsWith("https://")) {
        return value;
      }
      // HyperVerge returns JPEG base64 (SOI marker /9j/); default to PNG otherwise.
      const mime = value.startsWith("/9j/") ? "image/jpeg" : "image/png";
      return `data:${mime};base64,${value}`;
    };

    const normalizedQrImage = qrImageUrl ? toDataUri(qrImageUrl) : toDataUri(qrCode);

    const expiresRaw =
      pickString(source, ["expiresInSeconds", "expirySeconds", "expiresIn", "validitySeconds"]) ||
      pickString(data, ["expiresInSeconds", "expirySeconds", "expiresIn"]);
    const expiresInSeconds = Number(expiresRaw);
    const safeExpiry = Number.isFinite(expiresInSeconds) && expiresInSeconds > 0 ? expiresInSeconds : 600;

    const referenceId = pickString(data, ["referenceId", "ReferenceId", "referenceID"]);
    const verificationId =
      pickString(source, [
        "verificationId",
        "verification_id",
        "verificationID",
        "refId",
        "ref_id",
      ]) || pickString(data, ["verificationId", "verification_id", "refId"]);

    return {
      // Prefer HyperVerge referenceId (HV_PAY-...) for status polling id.
      reversePennyDropId:
        referenceId ||
        pickString(data, ["reversepennydrop_id", "reversePennyDropId", "id"]) ||
        verificationId,
      verificationId: verificationId || referenceId,
      qrCode,
      qrImageUrl: normalizedQrImage,
      upiLink: pickString(source, ["upiLink", "upi_link", "upiUrl", "paymentLink", "url"]),
      expiresInSeconds: safeExpiry,
      rawStatus: pickString(data, ["status", "Status"]) || pickString(root, ["status", "Status"]),
      message: pickString(root, ["message", "Message"]) || pickString(data, ["message", "Message"]),
    };
  },

  async getReversePennyDropValidationStatus(
    leadId: string,
    reversePennyDropId: string,
  ): Promise<GetReversePennyDropValidationStatusResponse> {
    const response = await apiPost<Record<string, unknown>>(
      API_ENDPOINTS.reversePennyDropGetValidationStatus,
      {
        leadId,
        reversepennydrop_id: reversePennyDropId,
      },
    );

    const root = isRecord(response) ? response : {};
    // UAT shape: { statusCode, status: "success", message, data: true|false }
    // Envelope `status` is API success — payment validation lives in boolean `data`.
    const validatedFlag = asBooleanOrUndefined(root.data);

    let status: ReversePennyDropValidationStatus = "UNKNOWN";
    if (validatedFlag === true) {
      status = "SUCCESS";
    } else if (validatedFlag === false) {
      status = "PENDING";
    } else {
      // Fallback for object-shaped payloads from other vendors/environments.
      const data = extractPayload(response);
      const rawStatus = (
        pickString(data, ["status", "Status", "validationStatus", "ValidationStatus"]) ||
        pickString(root, ["validationStatus", "ValidationStatus"])
      ).toUpperCase();

      if (rawStatus.includes("SUCCESS") || rawStatus === "VERIFIED" || rawStatus === "COMPLETED") {
        status = "SUCCESS";
      } else if (rawStatus.includes("FAIL")) {
        status = "FAILURE";
      } else if (rawStatus.includes("EXPIRE")) {
        status = "EXPIRED";
      } else if (
        rawStatus.includes("CREATE") ||
        rawStatus.includes("PENDING") ||
        rawStatus.includes("INIT")
      ) {
        status = rawStatus.includes("CREATE") ? "CREATED" : "PENDING";
      }
    }

    const dataRecord = isRecord(root.data) ? root.data : extractPayload(response);

    return {
      status,
      reversePennyDropId:
        pickString(dataRecord, ["reversepennydrop_id", "reversePennyDropId"]) || reversePennyDropId,
      verificationId: pickString(dataRecord, [
        "verificationId",
        "verification_id",
        "refId",
        "referenceId",
      ]),
      message: pickString(root, ["message", "Message"]) || pickString(dataRecord, ["message", "Message"]),
    };
  },

  async fetchReversePennyDropBankDetails(
    request: FetchReversePennyDropBankDetailsRequest,
  ): Promise<FetchReversePennyDropBankDetailsResponse> {
    const response = await apiPost<Record<string, unknown>>(
      API_ENDPOINTS.reversePennyDropFetchBankDetails,
      {
        panNumber: request.panNumber.trim().toUpperCase(),
        requestData: {
          rpdVendor: request.rpdVendor.trim(),
          verificationId: request.verificationId.trim(),
        },
      },
    );

    const root = isRecord(response) ? response : {};
    const data = extractPayload(response);

    const hasBankIdentity = (source: Record<string, unknown>): boolean => {
      return Boolean(
        pickString(source, ["bankAccount", "accountNumber", "AccountNumber"]) ||
        (pickString(source, ["ifsc", "ifscCode", "IFSCCode", "IFSC"]) &&
          pickString(source, ["nameAtBank", "name", "accountHolderName", "AccountHolder"])),
      );
    };

    // Walk common wrappers: data.result / result / bankDetails / nested data.
    const resolveBankSource = (node: unknown, depth = 0): Record<string, unknown> => {
      if (!isRecord(node) || depth > 5) {
        return {};
      }
      if (hasBankIdentity(node)) {
        return node;
      }
      for (const key of ["result", "Result", "bankDetails", "BankDetails", "bank", "data", "Data"]) {
        const nested = resolveBankSource(node[key], depth + 1);
        if (Object.keys(nested).length > 0) {
          return nested;
        }
      }
      return {};
    };

    const fromData = resolveBankSource(data);
    const fromRoot = Object.keys(fromData).length > 0 ? fromData : resolveBankSource(root);
    const bankSource = Object.keys(fromRoot).length > 0 ? fromRoot : data;

    const resultStatus = pickString(bankSource, ["status", "Status"]).toUpperCase();
    const isCompleted =
      resultStatus === "COMPLETED" ||
      resultStatus.includes("SUCCESS") ||
      resultStatus === "VERIFIED";

    const accountNumber = pickString(bankSource, [
      "bankAccount",
      "accountNumber",
      "AccountNumber",
    ]);

    return {
      name: pickString(bankSource, [
        "nameAtBank",
        "name",
        "accountHolderName",
        "InvestorName",
        "AccountHolder",
      ]),
      bankName: pickString(bankSource, ["bankName", "BankName"]),
      bankType: pickString(bankSource, [
        "accountType",
        "AccountType",
        "bankType",
        "AccountCategory",
      ]),
      accountNumber,
      ifscCode: pickString(bankSource, ["ifsc", "ifscCode", "IFSCCode", "IFSC"]),
      branchName: pickString(bankSource, ["branchName", "BranchName"]),
      bankAddress: pickString(bankSource, ["bankAddress", "BankAddress", "branchAddress"]),
      isBankVerified:
        asBooleanOrUndefined(bankSource.isBankVerified) ??
        asBooleanOrUndefined(data.isBankVerified) ??
        (isCompleted || Boolean(accountNumber)),
      isBankModified: asBooleanOrUndefined(bankSource.isBankModified) ?? true,
      verificationType:
        asStringOrNull(bankSource.verificationType) ??
        asStringOrNull(bankSource.verification_type) ??
        "Reverse Penny Drop",
      verificationId:
        pickString(bankSource, ["verificationId", "verification_id"]) ||
        pickString(root, ["referenceId", "ReferenceId"]) ||
        pickString(data, ["referenceId", "ReferenceId"]) ||
        request.verificationId,
      message: pickString(root, ["message", "Message"]) || pickString(data, ["message", "Message"]),
    };
  },
};
