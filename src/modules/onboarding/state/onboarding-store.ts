import { create } from "zustand";
import { getNextStepWithRules, getPrevStep } from "../flow/engine/step-engine";
import type { FlowKey } from "../flow/flow.config";
import type { PersonalDetailsModel } from "../steps/personal-details/types";
import type {
  BusinessCategory,
  EmpanelmentType,
  OnboardingStateType,
  OnboardingMethod,
  ProductCategory,
  Step,
} from "../types/onboarding-types";

type OnboardingStore = OnboardingStateType & {
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: Step) => void;
  setCurrentFlow: (flow: FlowKey) => void;
  setPan: (pan: string) => void;
  setLeadId: (leadId: string | null) => void;
  setApplicationIds: (applicationIds: string[]) => void;
  setPanValidationMeta: (meta: {
    leadId: string | null;
    existingProductTypes: string[];
    isExistingApplicant: boolean | null;
    isExistingDistributor: boolean | null;
  }) => void;
  setProductCategories: (categories: ProductCategory[]) => void;
  setBusinessCategory: (category: BusinessCategory | null) => void;
  setEmpanelmentType: (type: EmpanelmentType) => void;
  setOnboardingMethod: (method: OnboardingMethod | null) => void;
  setAprnNumber: (value: string | null) => void;
  setAprnStatus: (value: boolean | null) => void;
  setArn: (value: string | null) => void;
  setKraArnStatus: (value: string | null) => void;
  setKraDataSource: (value: string | null) => void;
  setKraRegisteredContact: (contact: { email: string | null; mobile: string | null }) => void;
  setInputEmail: (value: string | null) => void;
  setInputMobile: (value: string | null) => void;
  setAmfiMaskedEmail: (value: string | null) => void;
  setAmfiMaskedMobile: (value: string | null) => void;
  setEmailVerified: (value: boolean) => void;
  setMobileVerified: (value: boolean) => void;
  setEmailVerifiedFromEntry: (value: boolean) => void;
  setMobileVerifiedFromEntry: (value: boolean) => void;
  setEmailVerifiedAt: (value: string | null) => void;
  setMobileVerifiedAt: (value: string | null) => void;
  setOtpAttempts: (value: number) => void;
  incrementOtpAttempts: () => void;
  setOtpTimerSeconds: (value: number) => void;
  setAccountRestricted: (value: boolean) => void;
  resetAifOtpState: () => void;
  setPanNumber: (panNumber: string) => void;
  setPersonalDetails: (details: PersonalDetailsModel) => void;
  setIsEditMode: (value: boolean) => void;
  setSignatureUploaded: (value: boolean) => void;
  setPhotoUploaded: (value: boolean) => void;
  setChequeUploaded: (value: boolean) => void;
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  currentFlow: "pms-individual",
  currentStep: "entity-details",
  pan: "",
  panNumber: "",
  leadId: null,
  applicationIds: [],
  existingProductTypes: [],
  isExistingApplicant: null,
  isExistingDistributor: null,
  businessCategory: null,
  productCategories: [],
  empanelmentType: "Distributor",
  onboardingMethod: null,
  aprnNumber: null,
  aprnStatus: null,
  arn: null,
  kraArnStatus: null,
  kraDataSource: null,
  kraRegisteredEmail: null,
  kraRegisteredMobile: null,
  inputEmail: null,
  inputMobile: null,
  amfiMaskedEmail: null,
  amfiMaskedMobile: null,
  emailVerified: false,
  mobileVerified: false,
  emailVerifiedFromEntry: false,
  mobileVerifiedFromEntry: false,
  emailVerifiedAt: null,
  mobileVerifiedAt: null,
  otpAttempts: 0,
  otpTimerSeconds: 30,
  accountRestricted: false,
  personalDetails: null,
  isEditMode: false,
  documentUploads: {
    signatureUploaded: false,
    photoUploaded: false,
  },
  bankDocuments: {
    chequeUploaded: false,
  },

  nextStep: () => {
    const state = get();
    const next = getNextStepWithRules(state.currentStep);
    set({ currentStep: next });
  },

  prevStep: () => {
    const state = get();
    const prev = getPrevStep(state.currentStep);
    set({ currentStep: prev });
  },

  setStep: (step) => set({ currentStep: step }),
  setCurrentFlow: (flow) => set({ currentFlow: flow }),
  setPan: (pan) => set({ pan, panNumber: pan }),
  setLeadId: (leadId) => set({ leadId }),
  setApplicationIds: (applicationIds) => set({ applicationIds }),
  setPanValidationMeta: (meta) =>
    set({
      leadId: meta.leadId,
      existingProductTypes: meta.existingProductTypes,
      isExistingApplicant: meta.isExistingApplicant,
      isExistingDistributor: meta.isExistingDistributor,
    }),
  setProductCategories: (categories) => set({ productCategories: categories }),
  setBusinessCategory: (category) => set({ businessCategory: category }),
  setEmpanelmentType: (type) => set({ empanelmentType: type }),
  setOnboardingMethod: (method) => set({ onboardingMethod: method }),
  setAprnNumber: (value) => set({ aprnNumber: value }),
  setAprnStatus: (value) => set({ aprnStatus: value }),
  setArn: (value) => set({ arn: value }),
  setKraArnStatus: (value) => set({ kraArnStatus: value }),
  setKraDataSource: (value) => set({ kraDataSource: value }),
  setKraRegisteredContact: (contact) =>
    set({
      kraRegisteredEmail: contact.email,
      kraRegisteredMobile: contact.mobile,
    }),
  setInputEmail: (value) => set({ inputEmail: value }),
  setInputMobile: (value) => set({ inputMobile: value }),
  setAmfiMaskedEmail: (value) => set({ amfiMaskedEmail: value }),
  setAmfiMaskedMobile: (value) => set({ amfiMaskedMobile: value }),
  setEmailVerified: (value) => set({ emailVerified: value }),
  setMobileVerified: (value) => set({ mobileVerified: value }),
  setEmailVerifiedFromEntry: (value) => set({ emailVerifiedFromEntry: value }),
  setMobileVerifiedFromEntry: (value) => set({ mobileVerifiedFromEntry: value }),
  setEmailVerifiedAt: (value) => set({ emailVerifiedAt: value }),
  setMobileVerifiedAt: (value) => set({ mobileVerifiedAt: value }),
  setOtpAttempts: (value) => set({ otpAttempts: value }),
  incrementOtpAttempts: () =>
    set((state) => ({
      otpAttempts: state.otpAttempts + 1,
    })),
  setOtpTimerSeconds: (value) => set({ otpTimerSeconds: value }),
  setAccountRestricted: (value) => set({ accountRestricted: value }),
  resetAifOtpState: () =>
    set({
      emailVerified: false,
      mobileVerified: false,
      emailVerifiedFromEntry: false,
      mobileVerifiedFromEntry: false,
      emailVerifiedAt: null,
      mobileVerifiedAt: null,
      otpAttempts: 0,
      accountRestricted: false,
    }),
  setPanNumber: (panNumber) => set({ panNumber }),
  setPersonalDetails: (details) => set({ personalDetails: details }),
  setIsEditMode: (value) => set({ isEditMode: value }),
  setSignatureUploaded: (value) =>
    set((state) => ({
      documentUploads: {
        ...state.documentUploads,
        signatureUploaded: value,
      },
    })),
  setPhotoUploaded: (value) =>
    set((state) => ({
      documentUploads: {
        ...state.documentUploads,
        photoUploaded: value,
      },
    })),
  setChequeUploaded: (value) =>
    set((state) => ({
      bankDocuments: {
        ...state.bankDocuments,
        chequeUploaded: value,
      },
    })),
}));