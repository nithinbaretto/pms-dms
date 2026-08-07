import OnboardingMethodScreen from '../overrides/aif/OnboardingMethodScreen';
import VerifyContactScreen from '../overrides/aif/VerifyContactScreen';
import AifBusinessOverride from '../overrides/aif/BusinessOverride';
import AifReviewOverride from '../overrides/aif/ReviewOverride';

export default {
  product: 'AIF',
  customerType: 'Individual',

  steps: [
    'business-category',
    'onboarding-method',
    'verify-contact',
    'otp-verification',
    'personal-details',
    'business-details',
    'bank-details',
    'nominee-details',
    'document-upload',
    'review-confirm',
  ],

  documents: {
    requiresPhoto: true,
    requiresSignature: true,
    requiresCheque: true,
    requiresDueDiligenceDoc: true,
  },

  overrides: {
    onboardingMethod: OnboardingMethodScreen,
    verifyContact: VerifyContactScreen,
    business: AifBusinessOverride,
    review: AifReviewOverride,
  },
};
