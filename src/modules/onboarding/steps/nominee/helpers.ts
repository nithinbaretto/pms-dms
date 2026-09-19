import type {
  GetNomineeDetailsResponse,
  SaveNomineeDetailsRequest,
} from "../../services/onboarding-api";
import type { Address } from "../personal-details/types";
import { DEFAULT_PROOF_OF_IDENTITY, DOB_PATTERN, NOMINEE_NAME_MAX_LENGTH } from "./constants";
import type { NomineeFormData, NomineeOption, NomineeSnapshot } from "./types";

const nomineeOptionStorageKey = (leadId: string): string => `onboarding:nomineeOption:${leadId}`;

export const getStoredNomineeOption = (leadId: string | null): NomineeOption | null => {
  if (!leadId) {
    return null;
  }

  try {
    const value = sessionStorage.getItem(nomineeOptionStorageKey(leadId));
    return value === "later" || value === "now" ? value : null;
  } catch {
    return null;
  }
};

export const storeNomineeOption = (leadId: string | null, option: NomineeOption): void => {
  if (!leadId) {
    return;
  }

  try {
    sessionStorage.setItem(nomineeOptionStorageKey(leadId), option);
  } catch {
    // Ignore quota / private-mode storage failures.
  }
};

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

export const sanitizeNomineeName = (value: string): string => {
  return value.replace(/[^A-Za-z ]/g, "").slice(0, NOMINEE_NAME_MAX_LENGTH);
};

const startOfToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
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

export const isFutureDob = (dob: string): boolean => {
  const parsed = parseDob(dob);
  if (!parsed) {
    return false;
  }

  parsed.setHours(0, 0, 0, 0);
  return parsed.getTime() > startOfToday().getTime();
};

export const getAge = (dob: string): number | null => {
  const parsed = parseDob(dob);
  if (!parsed) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);
  const now = startOfToday();
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
  const fallback = new Date();
  fallback.setFullYear(fallback.getFullYear() - 18);
  fallback.setHours(0, 0, 0, 0);

  const source = !parsed || parsed.getTime() > startOfToday().getTime() ? fallback : parsed;

  return {
    day: source.getDate().toString().padStart(2, "0"),
    month: (source.getMonth() + 1).toString().padStart(2, "0"),
    year: source.getFullYear().toString(),
  };
};

export const getDobYearOptions = (): string[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 100 }, (_, index) => (currentYear - index).toString());
};

export const getDobMonthOptions = (year: string): string[] => {
  const now = new Date();
  const selectedYear = Number(year);
  const maxMonth = selectedYear === now.getFullYear() ? now.getMonth() + 1 : 12;

  return Array.from({ length: maxMonth }, (_, index) => (index + 1).toString().padStart(2, "0"));
};

export const getDobDayOptions = (year: string, month: string): string[] => {
  const now = new Date();
  const selectedYear = Number(year);
  const selectedMonth = Number(month);
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1;
  const maxDay = isCurrentMonth ? Math.min(daysInMonth, now.getDate()) : daysInMonth;

  return Array.from({ length: maxDay }, (_, index) => (index + 1).toString().padStart(2, "0"));
};

export const clampDobSelection = (
  day: string,
  month: string,
  year: string,
): { day: string; month: string; year: string } => {
  const yearOptions = getDobYearOptions();
  const nextYear = yearOptions.includes(year) ? year : yearOptions[0];
  const monthOptions = getDobMonthOptions(nextYear);
  const nextMonth = monthOptions.includes(month) ? month : monthOptions[monthOptions.length - 1];
  const dayOptions = getDobDayOptions(nextYear, nextMonth);
  const nextDay = dayOptions.includes(day) ? day : dayOptions[dayOptions.length - 1];

  return { day: nextDay, month: nextMonth, year: nextYear };
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
    nomineeName: sanitizeNomineeName(response.nomineeName),
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
    guardianName: sanitizeNomineeName(response.guardianName),
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
