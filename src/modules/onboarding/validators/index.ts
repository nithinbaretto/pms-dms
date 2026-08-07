import type { FlowConfig } from "../flow/flow.config";
import type { PersonalDetailsModel } from "../steps/personal-details/types";

export type ValidationContext = {
  panNumber: string;
  productCategories: string[];
  personalDetails: PersonalDetailsModel | null;
  signatureUploaded: boolean;
  photoUploaded: boolean;
  chequeUploaded: boolean;
  dueDiligenceDocUploaded?: boolean;
  flowConfig: FlowConfig;
};

export type ValidatorFn = (context: ValidationContext) => boolean;

export const defaultValidators: Record<string, ValidatorFn> = {
  business: (context) => context.productCategories.length > 0,
  nominee: () => true,
  documents: (context) => {
    const docRules = context.flowConfig.documents ?? {};
    const signatureValid = !docRules.requiresSignature || context.signatureUploaded;
    const photoValid = !docRules.requiresPhoto || context.photoUploaded;
    const chequeValid = !docRules.requiresCheque || context.chequeUploaded;
    const dueDiligenceValid = !docRules.requiresDueDiligenceDoc || context.dueDiligenceDocUploaded !== false;

    return signatureValid && photoValid && chequeValid && dueDiligenceValid;
  },
};

export function resolveValidator(flowConfig: FlowConfig, key: string): ValidatorFn {
  const override = flowConfig.validators?.[key];
  if (override) {
    return override as ValidatorFn;
  }

  return defaultValidators[key] ?? (() => true);
}
