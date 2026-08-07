import type { Address, PersonalDetailsModel } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^\d{10}$/;
const PINCODE_PATTERN = /^\d{6}$/;

export const isAddressValid = (address: Address): boolean => {
  return Boolean(
    address.addressLine.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      PINCODE_PATTERN.test(address.pincode.trim()),
  );
};

export const isMobileValid = (mobile: string): boolean => {
  return MOBILE_PATTERN.test(mobile.trim());
};

export const isEmailValid = (email: string): boolean => {
  return EMAIL_PATTERN.test(email.trim());
};

export const isPersonalDetailsStepValid = (
  data: PersonalDetailsModel,
): boolean => {
  return Boolean(
    data.personalDetails.entityType &&
      isMobileValid(data.mobile.value) &&
      data.mobile.verified &&
      isEmailValid(data.email.value) &&
      data.email.verified &&
      isAddressValid(data.correspondenceAddress),
  );
};
