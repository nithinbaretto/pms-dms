import type { ProductCategory } from "../types/onboarding-types";
import { apiPost } from "../../../services/http/apiClient";

export type VerifyAprnRequest = {
  panNumber: string;
  aprnNumber: string;
  leadId: string;
};

export type VerifyAprnResponse = {
  validationStatus: boolean;
  message?: string;
  email?: string | null;
  mobile?: string | null;
  aprnStatus?: boolean | null;
  leadId?: string | null;
};

export type SendOtpRequest = {
  panNumber: string;
  channel: "mobile" | "email";
};

export type SendOtpResponse = {
  success: boolean;
  expiresInSeconds: number;
  maskedMobile: string;
  maskedEmail: string;
};

export type VerifyOtpRequest = {
  otp: string;
};

export type VerifyOtpResponse = {
  verified: boolean;
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
  validationStatus?: boolean;
  isValid?: boolean;
  valid?: boolean;
  message?: string;
  email?: string | null;
  mobile?: string | null;
  aprnStatus?: boolean | null;
  leadId?: string | null;
};

type ValidateAmfiContactApiResponse = {
  success?: boolean;
  status?: "SUCCESS" | "FAILED";
  message?: string;
  maskedEmail?: string | null;
  maskedMobile?: string | null;
};

type SendOtpApiResponse = {
  success?: boolean;
  sent?: boolean;
  expiresInSeconds?: number;
  expiryInSeconds?: number;
  maskedMobile?: string;
  maskedEmail?: string;
};

type VerifyOtpApiResponse = {
  verified?: boolean;
  success?: boolean;
  message?: string;
};

type SaveBusinessDetailsApiResponse = {
  applicationIds?: string[];
  leadId?: string | null;
  message?: string;
  status?: string;
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
  verifyAprn: "/dms-api/apmi/validateAprnNumber",
  validateAmfiContact:
    import.meta.env.VITE_PMS_INDIVIDUAL_VALIDATE_AMFI_CONTACT_URL ?? withBase("/pms/individual/amfi/contact/validate"),
  sendOtp: import.meta.env.VITE_PMS_INDIVIDUAL_SEND_OTP_URL ?? withBase("/pms/individual/otp/send"),
  sendAmfiOtp: import.meta.env.VITE_PMS_INDIVIDUAL_SEND_AMFI_OTP_URL ?? withBase("/pms/individual/amfi/otp/send"),
  verifyOtp: import.meta.env.VITE_PMS_INDIVIDUAL_VERIFY_OTP_URL ?? withBase("/pms/individual/otp/verify"),
  verifyAmfiOtp:
    import.meta.env.VITE_PMS_INDIVIDUAL_VERIFY_AMFI_OTP_URL ?? withBase("/pms/individual/amfi/otp/verify"),
  saveBusinessDetails:
    import.meta.env.VITE_PMS_INDIVIDUAL_SAVE_BUSINESS_DETAILS_URL ?? withBase("/dms-api/businessCategory/saveBusinessDetails"),
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

const asBooleanOrUndefined = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") {
    return value;
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

  const messageFromPayload = asStringOrNull(payload.message) ?? asStringOrNull(payload.errorMessage);
  if (messageFromPayload) {
    return messageFromPayload;
  }

  return asStringOrNull(errorWithResponse.message) ?? undefined;
};

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
    const data = response ?? {};

    return {
      validationStatus: data.validationStatus ?? data.isValid ?? data.valid ?? false,
      message: data.message,
      email: data.email ?? null,
      mobile: data.mobile ?? null,
      aprnStatus: data.aprnStatus ?? null,
      leadId: data.leadId ?? request.leadId,
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
      panNumber: request.panNumber.trim().toUpperCase(),
      channel: request.channel,
    };

    const response = await apiPost<SendOtpApiResponse>(API_ENDPOINTS.sendOtp, payload);
    const data = response;

    return {
      success: data.success ?? data.sent ?? false,
      expiresInSeconds: data.expiresInSeconds ?? data.expiryInSeconds ?? 30,
      maskedMobile: data.maskedMobile ?? "",
      maskedEmail: data.maskedEmail ?? "",
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
    const response = await apiPost<VerifyOtpApiResponse>(API_ENDPOINTS.verifyOtp, request);
    const data = response;

    return {
      verified: data.verified ?? data.success ?? false,
    };
  },

  async verifyAmfiOtp(request: VerifyAmfiOtpRequest): Promise<VerifyOtpResponse> {
    const response = await apiPost<VerifyOtpApiResponse>(API_ENDPOINTS.verifyAmfiOtp, request);
    const data = response;

    return {
      verified: data.verified ?? data.success ?? false,
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
};
