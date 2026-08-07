export default {
  product: 'AIF',
  customerType: 'NRI',

  steps: [
    'onboarding-type',
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
    requiresNriKycDocs: true,
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
