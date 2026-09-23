import { PERSON_NAME_MAX_LENGTH } from "./constants";
import { isSoleProprietorshipEntityType } from "./helpers";
import type { Address, PersonalDetailsModel } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^\d{10}$/;
const PINCODE_PATTERN = /^\d{6}$/;
const DOB_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

const ADULT_AGE_YEARS = 18;

const startOfToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const startOfDateYearsAgo = (years: number): Date => {
  const date = startOfToday();
  date.setFullYear(date.getFullYear() - years);
  return date;
};

const toDateInputValue = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
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

export const getMaxAdultDobDateInputValue = (): string =>
  toDateInputValue(startOfDateYearsAgo(ADULT_AGE_YEARS));

export const isPersonalDobValid = (value: string): boolean => {
  const parsed = parsePersonalDob(value);
  if (!parsed) {
    return false;
  }

  return parsed.getTime() <= startOfDateYearsAgo(ADULT_AGE_YEARS).getTime();
};

/** Names may include letters, numbers, and symbols, up to 50 characters including spaces. */
export const sanitizePersonName = (value: string): string => {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/ {2,}/g, " ")
    .replace(/^ +/, "")
    .slice(0, PERSON_NAME_MAX_LENGTH);
};

export const isPersonNameValid = (value: string): boolean => {
  const trimmed = value.trim();
  return trimmed.length > 0 && value.length <= PERSON_NAME_MAX_LENGTH;
};

export const sanitizeContactPersonName = sanitizePersonName;

export const isContactPersonNameValid = isPersonNameValid;

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

  const contactPersonValid = isSoleProprietorshipEntityType(data.personalDetails.entityType)
    ? data.isContactPersonSameAsDistributor
      ? data.personalDetails.name.trim().length > 0
      : isContactPersonNameValid(data.contactPersonName)
    : true;

  return Boolean(
    identityValid &&
      contactPersonValid &&
      isMobileValid(data.mobile.value) &&
      data.mobile.verified &&
      isEmailValid(data.email.value) &&
      data.email.verified &&
      isAddressValid(data.correspondenceAddress) &&
      (!options?.isManual || isAddressValid(data.permanentAddress)),
  );
};
