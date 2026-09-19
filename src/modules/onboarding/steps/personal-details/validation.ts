import type { Address, PersonalDetailsModel } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^\d{10}$/;
const PINCODE_PATTERN = /^\d{6}$/;
const PERSON_NAME_PATTERN = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const DOB_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

const startOfToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const parsePersonalDob = (value: string): Date | null => {
  const match = DOB_PATTERN.exec(value.trim());
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

  parsed.setHours(0, 0, 0, 0);
  return parsed;
};

export const getTodayDateInputValue = (): string => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

export const isPersonalDobValid = (value: string): boolean => {
  const parsed = parsePersonalDob(value);
  if (!parsed) {
    return false;
  }

  return parsed.getTime() <= startOfToday().getTime();
};

export const sanitizePersonName = (value: string): string => {
  return value.replace(/[^A-Za-z ]/g, "").replace(/ {2,}/g, " ").replace(/^ +/, "");
};

export const isPersonNameValid = (value: string): boolean => {
  return PERSON_NAME_PATTERN.test(value.trim());
};

export const isAddressValid = (address: Address): boolean => {
  const hasStructuredFields =
    Boolean(address.city.trim()) || Boolean(address.state.trim()) || Boolean(address.pincode.trim());

  // Structured address (manual/map edit path)
  if (hasStructuredFields) {
    return Boolean(
      address.addressLine.trim() &&
        address.city.trim() &&
        address.state.trim() &&
        PINCODE_PATTERN.test(address.pincode.trim()),
    );
  }

  // API single-line address while map/parse helpers are on hold
  return Boolean(address.addressLine.trim());
};

export const isMobileValid = (mobile: string): boolean => {
  return MOBILE_PATTERN.test(mobile.trim());
};

export const isEmailValid = (email: string): boolean => {
  return EMAIL_PATTERN.test(email.trim());
};

export const isPersonalDetailsStepValid = (
  data: PersonalDetailsModel,
  options?: { isManual?: boolean },
): boolean => {
  const identityValid = options?.isManual
    ? Boolean(
        isPersonNameValid(data.personalDetails.name) &&
          data.personalDetails.pan.trim() &&
          isPersonalDobValid(data.personalDetails.dob),
      )
    : Boolean(data.personalDetails.entityType);

  return Boolean(
    identityValid &&
      isMobileValid(data.mobile.value) &&
      data.mobile.verified &&
      isEmailValid(data.email.value) &&
      data.email.verified &&
      isAddressValid(data.correspondenceAddress) &&
      (!options?.isManual || isAddressValid(data.permanentAddress)),
  );
};
