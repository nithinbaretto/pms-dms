import type {
  GetNomineeDetailsResponse,
  SaveNomineeDetailsRequest,
} from "../../services/onboarding-api";
import type { Address } from "../personal-details/types";
import { DEFAULT_PROOF_OF_IDENTITY, DOB_PATTERN } from "./constants";
import type { NomineeFormData, NomineeSnapshot } from "./types";

export const formatAadhaarNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

export const sanitizeProofNumber = (type: string, value: string): string => {
  switch (type) {
    case "Aadhar":
      return formatAadhaarNumber(value);
    case "PAN":
      return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    case "Driving License":
      return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15);
    case "Passport":
      return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
    default:
      return value.trim();
  }
};

export const normalizeProofNumberForSave = (type: string, value: string): string => {
  if (type === "Aadhar") {
    return value.replace(/\s/g, "");
  }

  return value.trim().toUpperCase();
};

export const parseDob = (value: string): Date | null => {
  const trimmed = value.trim();
  const match = DOB_PATTERN.exec(trimmed);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
};

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
};

export const getAge = (dob: string): number | null => {
  const parsed = parseDob(dob);
  if (!parsed) {
    return null;
  }

  const now = new Date();
  if (parsed.getTime() > now.getTime()) {
    return null;
  }

  let age = now.getFullYear() - parsed.getFullYear();
  const monthDiff = now.getMonth() - parsed.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < parsed.getDate())) {
    age -= 1;
  }

  return age;
};

export const validateAgeForMinor = (dob: string): boolean => {
  const age = getAge(dob);
  return age !== null && age < 18;
};

export const getSafeDobParts = (dob: string) => {
  const parsed = parseDob(dob);
  if (!parsed) {
    return {
      day: "01",
      month: "01",
      year: (new Date().getFullYear() - 18).toString(),
    };
  }

  return {
    day: parsed.getDate().toString().padStart(2, "0"),
    month: (parsed.getMonth() + 1).toString().padStart(2, "0"),
    year: parsed.getFullYear().toString(),
  };
};

export const emptyAddress = (): Address => ({
  lat: 0,
  lng: 0,
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
});

export const addressFromLine = (line: string): Address => ({
  ...emptyAddress(),
  addressLine: line.trim(),
});

export const formatApplicantAddress = (address: Address | null | undefined): string => {
  if (!address) {
    return "";
  }

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

export const withDefaultGuardianSameAsNominee = (form: NomineeFormData): NomineeFormData => {
  if (!validateAgeForMinor(form.dateOfBirth)) {
    return form;
  }

  const hasDistinctGuardianAddress =
    form.guardianAddress.trim() !== "" &&
    form.guardianAddress.trim() !== form.nomineeAddress.trim();

  if (hasDistinctGuardianAddress && !form.isGuardianAddressSameAsNomineeAddress) {
    return form;
  }

  if (form.isGuardianAddressSameAsNomineeAddress && form.guardianAddress === form.nomineeAddress) {
    return form;
  }

  return {
    ...form,
    isGuardianAddressSameAsNomineeAddress: true,
    guardianAddress: form.nomineeAddress,
  };
};

export const mapGetNomineeDetailsToForm = (response: GetNomineeDetailsResponse): NomineeFormData => {
  return withDefaultGuardianSameAsNominee({
    nomineeName: response.nomineeName,
    relationshipWithApplicant: response.relationshipWithApplicant,
    proofOfIdentityType: response.proofOfIdentityType || DEFAULT_PROOF_OF_IDENTITY,
    proofOfIdentityNumber: sanitizeProofNumber(
      response.proofOfIdentityType || DEFAULT_PROOF_OF_IDENTITY,
      response.proofOfIdentityNumber,
    ),
    mobileNumber: response.mobileNumber.replace(/\D/g, "").slice(0, 10),
    emailId: response.emailId.trim(),
    dateOfBirth: response.dateOfBirth.trim(),
    nomineeAddress: response.nomineeAddress.trim(),
    guardianName: response.guardianName.trim(),
    guardianAddress: response.guardianAddress.trim(),
    isNomineeAddressSameAsApplicantAddress: response.isNomineeAddressSameAsApplicantAddress,
    isGuardianAddressSameAsNomineeAddress: response.isGuardianAddressSameAsNomineeAddress,
  });
};

export const hasNomineeCoreData = (form: NomineeFormData): boolean => {
  return Boolean(
    form.nomineeName.trim() ||
      form.relationshipWithApplicant.trim() ||
      form.proofOfIdentityNumber.trim() ||
      form.dateOfBirth.trim() ||
      form.nomineeAddress.trim(),
  );
};

export const cloneNomineeSnapshot = (form: NomineeFormData): NomineeSnapshot => ({
  ...form,
});

export const buildSaveNomineePayload = (
  form: NomineeFormData,
  initial: NomineeSnapshot,
  leadId: string,
  applicantAddress: string,
): SaveNomineeDetailsRequest => {
  const isMinor = validateAgeForMinor(form.dateOfBirth);
  const nomineeAddress = form.isNomineeAddressSameAsApplicantAddress
    ? applicantAddress.trim() || form.nomineeAddress.trim()
    : form.nomineeAddress.trim();
  const guardianName = isMinor ? form.guardianName.trim() : "";
  const guardianAddress = isMinor
    ? form.isGuardianAddressSameAsNomineeAddress
      ? nomineeAddress
      : form.guardianAddress.trim()
    : "";

  return {
    dateOfBirth: form.dateOfBirth.trim(),
    emailId: form.emailId.trim(),
    guardianAddress,
    guardianName,
    isGuardianAddressModified: isMinor && guardianAddress !== initial.guardianAddress.trim(),
    isGuardianAddressSameAsNomineeAddress: isMinor
      ? form.isGuardianAddressSameAsNomineeAddress
      : false,
    isMinor,
    isNomineeAddressModified: nomineeAddress !== initial.nomineeAddress.trim(),
    isNomineeAddressSameAsApplicantAddress: form.isNomineeAddressSameAsApplicantAddress,
    leadId,
    mobileNumber: form.mobileNumber.trim(),
    nomineeAddress,
    nomineeName: form.nomineeName.trim(),
    proofOfIdentityNumber: normalizeProofNumberForSave(
      form.proofOfIdentityType,
      form.proofOfIdentityNumber,
    ),
    proofOfIdentityType: form.proofOfIdentityType.trim(),
    relationshipWithApplicant: form.relationshipWithApplicant.trim(),
  };
};
