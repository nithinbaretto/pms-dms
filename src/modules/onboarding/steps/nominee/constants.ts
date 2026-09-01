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
export const AADHAAR_REGEX = /^\d{12}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const DRIVING_LICENSE_REGEX = /^[A-Z]{2}[0-9]{13}$/;
export const PASSPORT_REGEX = /^[A-Z][0-9]{7}$/;

export const PROOF_NUMBER_PLACEHOLDERS: Record<(typeof PROOF_OF_IDENTITY_OPTIONS)[number], string> = {
  Aadhar: "XXXX XXXX XXXX",
  PAN: "ABCDE1234F",
  "Driving License": "MH1420110012345",
  Passport: "A1234567",
};

export const PROOF_NUMBER_MAX_LENGTH: Record<(typeof PROOF_OF_IDENTITY_OPTIONS)[number], number> = {
  Aadhar: 14,
  PAN: 10,
  "Driving License": 15,
  Passport: 8,
};

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
  isGuardianAddressSameAsNomineeAddress: true,
});
