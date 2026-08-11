import type { PersonalDetailsModel } from "../steps/personal-details/types";
import type { FlowKey } from "../flow/flow.config";

export type Step =
  | "entity-details"
  | "onboarding-method"
  | "verify-contact"
  | "personal-details"
  | "business-details"
  | "business-category"
  | "aprn-verification"
  | "otp-verification"
  | "bank-details"
  | "nominee-details"
  | "upload-documents"
  | "review-confirm";

export type ProductCategory = "PMS" | "AIF";

export type BusinessCategory = "AIF" | "PMS" | "PMS+AIF";
export type EmpanelmentType = "Distributor" | "RIA";
export type OnboardingMethod = "ARN" | "KRA" | "DIGILOCKER" | "MANUAL";

export type OnboardingStateType = {
  currentFlow: FlowKey;
  currentStep: Step;
  pan: string;
  panNumber: string;
  leadId: string | null;
  applicationIds: string[];
  existingProductTypes: string[];
  isExistingApplicant: boolean | null;
  isExistingDistributor: boolean | null;
  businessCategory: BusinessCategory | null;
  productCategories: ProductCategory[];
  empanelmentType: EmpanelmentType;
  onboardingMethod: OnboardingMethod | null;
  aprnNumber: string | null;
  aprnStatus: boolean | null;
  arn: string | null;
  inputEmail: string | null;
  inputMobile: string | null;
  amfiMaskedEmail: string | null;
  amfiMaskedMobile: string | null;
  emailVerified: boolean;
  mobileVerified: boolean;
  /** Verified on entry OTP screen — locked on personal details. */
  emailVerifiedFromEntry: boolean;
  mobileVerifiedFromEntry: boolean;
  otpAttempts: number;
  otpTimerSeconds: number;
  accountRestricted: boolean;
  personalDetails: PersonalDetailsModel | null;
  isEditMode: boolean;
  documentUploads: {
    signatureUploaded: boolean;
    photoUploaded: boolean;
  };
  emailVerifiedAt: string | null;
  mobileVerifiedAt: string | null;
  bankDocuments: {
    chequeUploaded: boolean;
  };
};