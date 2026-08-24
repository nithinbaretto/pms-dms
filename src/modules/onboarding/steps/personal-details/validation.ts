import type { Address, PersonalDetailsModel } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^\d{10}$/;
const PINCODE_PATTERN = /^\d{6}$/;

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
        data.personalDetails.name.trim() &&
          data.personalDetails.pan.trim() &&
          data.personalDetails.dob.trim(),
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
