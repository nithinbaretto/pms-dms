export default {
  product: 'PMS',
  customerType: 'Individual',

  steps: [
    'entity-details',
    'business-category',
    'aprn-verification',
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
  },

  overrides: {
    onboardingType: null,
    personal: null,
    business: null,
    bank: null,
    nominee: null,
    documents: null,
    review: null,
  },
};
