import type { NomineeFormData } from "./types";

export const RELATIONSHIP_OPTIONS = [
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Spouse",
  "Wife",
  "Husband",
  "Brother",
  "Sister",
  "Grandfather",
  "Grandmother",
  "Grandson",
  "Granddaughter",
] as const;

export const PROOF_OF_IDENTITY_OPTIONS = ["Aadhar", "PAN", "Driving License", "Passport"] as const;

export const DEFAULT_PROOF_OF_IDENTITY = "Aadhar";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_PATTERN = /^\d{10}$/;
export const DOB_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export const createEmptyNomineeForm = (): NomineeFormData => ({
  nomineeName: "",
  relationshipWithApplicant: "",
  proofOfIdentityType: DEFAULT_PROOF_OF_IDENTITY,
  proofOfIdentityNumber: "",
  mobileNumber: "",
  emailId: "",
  dateOfBirth: "",
  nomineeAddress: "",
  guardianName: "",
  guardianAddress: "",
  isNomineeAddressSameAsApplicantAddress: false,
  isGuardianAddressSameAsNomineeAddress: false,
});
