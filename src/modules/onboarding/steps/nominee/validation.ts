import {
  AADHAAR_REGEX,
  DRIVING_LICENSE_REGEX,
  EMAIL_PATTERN,
  MOBILE_PATTERN,
  PAN_REGEX,
  PASSPORT_REGEX,
} from "./constants";
import { parseDob, validateAgeForMinor } from "./helpers";
import type { NomineeFieldErrors, NomineeFormData, NomineeOption } from "./types";

const getProofOfIdentityNumberError = (type: string, value: string): string | undefined => {
  const proofType = type.trim();
  const proofNumber = value.trim();

  if (!proofNumber) {
    return "Proof number is required.";
  }

  if (proofType === "Aadhar") {
    const digits = proofNumber.replace(/\s/g, "");
    if (!AADHAAR_REGEX.test(digits)) {
      return "Enter a valid 12-digit Aadhaar number.";
    }
    return undefined;
  }

  if (proofType === "PAN") {
    if (!PAN_REGEX.test(proofNumber.toUpperCase())) {
      return "Enter a valid 10-character PAN.";
    }
    return undefined;
  }

  if (proofType === "Driving License") {
    if (!DRIVING_LICENSE_REGEX.test(proofNumber.toUpperCase())) {
      return "Enter a valid 15-character driving license number.";
    }
    return undefined;
  }

  if (proofType === "Passport") {
    if (!PASSPORT_REGEX.test(proofNumber.toUpperCase())) {
      return "Enter a valid 8-character passport number.";
    }
    return undefined;
  }

  return undefined;
};

export const isNomineeFormValid = (
  option: NomineeOption,
  form: NomineeFormData,
  applicantAddress: string,
): boolean => {
  if (option === "later") {
    return true;
  }

  const errors = getNomineeFieldErrors(form, applicantAddress);
  return Object.keys(errors).length === 0;
};

export const getNomineeFieldErrors = (
  form: NomineeFormData,
  applicantAddress: string,
): NomineeFieldErrors => {
  const errors: NomineeFieldErrors = {};

  if (!form.nomineeName.trim()) {
    errors.nomineeName = "Nominee name is required.";
  }

  if (!form.relationshipWithApplicant.trim()) {
    errors.relationshipWithApplicant = "Relationship with applicant is required.";
  }

  if (!form.proofOfIdentityType.trim()) {
    errors.proofOfIdentityType = "Proof of identity is required.";
  }

  const proofNumberError = getProofOfIdentityNumberError(
    form.proofOfIdentityType,
    form.proofOfIdentityNumber,
  );
  if (proofNumberError) {
    errors.proofOfIdentityNumber = proofNumberError;
  }

  if (!form.dateOfBirth.trim() || parseDob(form.dateOfBirth) === null) {
    errors.dateOfBirth = "Date of birth is required.";
  }

  const resolvedNomineeAddress = form.isNomineeAddressSameAsApplicantAddress
    ? applicantAddress.trim() || form.nomineeAddress.trim()
    : form.nomineeAddress.trim();

  if (!form.isNomineeAddressSameAsApplicantAddress && !resolvedNomineeAddress) {
    errors.nomineeAddress = "Nominee address is required.";
  }

  if (form.isNomineeAddressSameAsApplicantAddress && !resolvedNomineeAddress) {
    errors.nomineeAddress = "Applicant permanent address is unavailable.";
  }

  if (form.mobileNumber.trim() && !MOBILE_PATTERN.test(form.mobileNumber.trim())) {
    errors.mobileNumber = "Enter a valid 10-digit mobile number.";
  }

  if (form.emailId.trim() && !EMAIL_PATTERN.test(form.emailId.trim())) {
    errors.emailId = "Enter a valid email address.";
  }

  if (validateAgeForMinor(form.dateOfBirth)) {
    if (!form.guardianName.trim()) {
      errors.guardianName = "Guardian name is required for minor nominees.";
    }

    const guardianAddress = form.isGuardianAddressSameAsNomineeAddress
      ? resolvedNomineeAddress
      : form.guardianAddress.trim();

    if (!guardianAddress) {
      errors.guardianAddress = "Guardian address is required for minor nominees.";
    }
  }

  return errors;
};
