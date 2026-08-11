export type NomineeOption = "now" | "later";

export type NomineeFormData = {
  nomineeName: string;
  relationshipWithApplicant: string;
  proofOfIdentityType: string;
  proofOfIdentityNumber: string;
  mobileNumber: string;
  emailId: string;
  dateOfBirth: string;
  nomineeAddress: string;
  guardianName: string;
  guardianAddress: string;
  isNomineeAddressSameAsApplicantAddress: boolean;
  isGuardianAddressSameAsNomineeAddress: boolean;
};

export type NomineeSnapshot = NomineeFormData;

export type NomineeFieldErrors = {
  nomineeName?: string;
  relationshipWithApplicant?: string;
  proofOfIdentityType?: string;
  proofOfIdentityNumber?: string;
  dateOfBirth?: string;
  nomineeAddress?: string;
  guardianName?: string;
  guardianAddress?: string;
  mobileNumber?: string;
  emailId?: string;
};

export type GuardianDetails = {
  guardianName: string;
  guardianAddress: string;
  isGuardianAddressSameAsNomineeAddress: boolean;
};
