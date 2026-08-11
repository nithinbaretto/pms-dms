import { EMAIL_PATTERN, MOBILE_PATTERN } from "./constants";
import { parseDob, validateAgeForMinor } from "./helpers";
import type { NomineeFieldErrors, NomineeFormData, NomineeOption } from "./types";

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

  if (!form.proofOfIdentityNumber.trim()) {
    errors.proofOfIdentityNumber = "Proof number is required.";
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
