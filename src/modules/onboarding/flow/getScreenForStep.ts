import type { ComponentType } from 'react';

import type { FlowConfig } from './flow.config';
import { CORE_SCREENS } from './screen.registry';

const STEP_OVERRIDE_KEY: Record<string, string> = {
  'onboarding-type': 'onboardingType',
  'onboarding-method': 'onboardingMethod',
  'verify-contact': 'verifyContact',
  'personal-details': 'personal',
  'business-details': 'business',
  'bank-details': 'bank',
  'nominee-details': 'nominee',
  'document-upload': 'documents',
  'review-confirm': 'review',
};

const MissingScreen: ComponentType<any> = () => null;

export function getScreenForStep(step: string, flowConfig: FlowConfig): ComponentType<any> {
  const overrideKey = STEP_OVERRIDE_KEY[step] ?? step.replace('-', '');
  const override = flowConfig.overrides?.[overrideKey];
  if (override) {
    return override;
  }

  return CORE_SCREENS[step as keyof typeof CORE_SCREENS] ?? MissingScreen;
}
