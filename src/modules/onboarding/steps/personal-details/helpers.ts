import type { GetPersonalDetailsResponse, SavePersonalDetailsRequest } from "../../services/onboarding-api";
import type { Address, EntityType, PersonalDetailsModel, VerificationChannel } from "./types";

const ENTITY_TYPES: EntityType[] = [
  "Individual",
  "Proprietorship",
  "Company",
  "Partnership",
  "LLP",
  "HUF",
  "Trust",
  "AOP",
];

export const maskMobile = (mobile: string): string => {
  const digits = mobile.replace(/\D/g, "");
  if (digits.length < 4) {
    return mobile;
  }

  return `+91 ${"x".repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
};

export const maskEmail = (email: string): string => {
  const [name = "", domain = ""] = email.split("@");

  if (!name || !domain) {
    return email;
  }

  return `${name.slice(0, 2)}${"x".repeat(Math.max(0, name.length - 2))}@${domain}`;
};

/** Map API single-line address into UI Address (structured parse/map on hold). */
export const addressFromApiString = (value: string): Address => {
  return {
    lat: 0,
    lng: 0,
    addressLine: value.trim(),
    city: "",
    state: "",
    pincode: "",
  };
};

export const formatAddressForApi = (address: Address): string => {
  const parts = [address.addressLine, address.city, address.state, address.pincode]
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  if (!address.city.trim() && !address.state.trim() && !address.pincode.trim()) {
    return address.addressLine.trim();
  }

  const location = [address.city, address.state].map((part) => part.trim()).filter(Boolean).join(", ");
  const pincode = address.pincode.trim();

  if (location && pincode) {
    return `${address.addressLine.trim()}, ${location} - ${pincode}`;
  }

  return parts.join(", ");
};

export const normalizeVerifiedSource = (value: string | null | undefined): VerificationChannel | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "mobile" || normalized === "phone" || normalized === "sms") {
    return "mobile";
  }

  if (normalized === "email" || normalized === "mail") {
    return "email";
  }

  return null;
};

/** Normalize for equality checks when deciding if re-verification is required. */
export const normalizeEmailForCompare = (email: string): string => email.trim().toLowerCase();

export const normalizeMobileForCompare = (mobile: string): string =>
  mobile.replace(/\D/g, "").slice(-10);

const toEntityType = (value: string): EntityType | "" => {
  const match = ENTITY_TYPES.find((item) => item.toLowerCase() === value.trim().toLowerCase());
  return match ?? "";
};

export const createEmptyPersonalDetails = (pan: string): PersonalDetailsModel => {
  const emptyAddress: Address = {
    lat: 0,
    lng: 0,
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  };

  return {
    personalDetails: {
      name: "",
      pan: pan.trim().toUpperCase(),
      dob: "",
      aprn: "",
      arn: "",
      entityType: "",
      entityTypeLocked: false,
    },
    mobile: {
      value: "",
      verified: false,
    },
    email: {
      value: "",
      verified: false,
    },
    permanentAddress: { ...emptyAddress },
    correspondenceAddress: { ...emptyAddress },
    isCorrespoingSameAsPermanent: false,
  };
};

export const mapGetPersonalDetailsToModel = (
  response: GetPersonalDetailsResponse,
  verification: { emailVerified: boolean; mobileVerified: boolean },
): PersonalDetailsModel => {
  const permanentAddress = addressFromApiString(response.permanentAddress);
  const sameAsPermanent = response.isCorrespoingSameAsPermanent;
  const correspondenceAddress = sameAsPermanent
    ? { ...permanentAddress }
    : addressFromApiString(response.correspondenceAddress || response.permanentAddress);

  return {
    personalDetails: {
      name: response.name,
      pan: response.panNumber,
      dob: response.dob,
      aprn: response.aprnNumber,
      arn: response.arnNumber,
      entityType: toEntityType(response.entityType),
      entityTypeLocked: true,
    },
    mobile: {
      value: response.mobile.replace(/\D/g, "").slice(-10) || response.mobile,
      verified: verification.mobileVerified,
    },
    email: {
      value: response.email.trim(),
      verified: verification.emailVerified,
    },
    permanentAddress,
    correspondenceAddress,
    isCorrespoingSameAsPermanent: sameAsPermanent,
    nextInfoSection: response.nextInfoSection || undefined,
    applicationStatus: response.Application_status || undefined,
  };
};

export const buildSavePayload = (
  data: PersonalDetailsModel,
  leadId: string,
  dataSource = "APMI",
): SavePersonalDetailsRequest => {
  const correspondenceAddress = data.isCorrespoingSameAsPermanent
    ? formatAddressForApi(data.permanentAddress)
    : formatAddressForApi(data.correspondenceAddress);

  return {
    correspondenceAddress,
    isCorrespoingSameAsPermanent: data.isCorrespoingSameAsPermanent,
    leadId,
    primaryEmail: data.email.value.trim(),
    primaryMobile: data.mobile.value.trim(),
    dob: data.personalDetails.dob,
    name: data.personalDetails.name.trim(),
    permanentAddress: formatAddressForApi(data.permanentAddress),
    dataSource,
  };
};

export const mapNextInfoSectionToStep = (nextInfoSection: string | undefined): string | null => {
  if (!nextInfoSection?.trim()) {
    return null;
  }

  const normalized = nextInfoSection.trim().toLowerCase().replace(/\s+/g, "-");

  if (normalized.includes("business")) {
    return "business-details";
  }

  if (normalized.includes("bank")) {
    return "bank-details";
  }

  if (normalized.includes("nominee")) {
    return "nominee-details";
  }

  if (normalized.includes("document")) {
    return "upload-documents";
  }

  if (normalized.includes("review")) {
    return "review-confirm";
  }

  return normalized;
};
