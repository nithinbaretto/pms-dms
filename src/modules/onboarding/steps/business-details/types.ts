export type BusinessDetailsMode = "selection" | "empty";

export type GstRegistrationStatus = "Registered" | "Unregistered";

export type GstRecord = {
  id: string;
  gstNumber: string;
  stateCode: string;
  legalName: string;
  selected: boolean;
  fileURL: string;
  registrationStatus: GstRegistrationStatus;
  /** True only for manual/unregistered paths when validateGstIn did not resolve details. */
  requiresCertificate: boolean;
};

export type BranchOption = {
  id: string;
  label: string;
};

export type ManualGstDraft = {
  gstNumber: string;
  stateCode: string;
  legalName: string;
  fileURL: string;
  registrationStatus: GstRegistrationStatus;
  requiresCertificate: boolean;
};

export type ValidateGstResult = {
  isMatchFound: boolean;
  gstInId: string;
  legalName: string;
  state: string;
};

export type SaveBusinessDetailsResult = {
  nextStep: string | null;
};
