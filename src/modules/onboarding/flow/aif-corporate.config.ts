export default {
  product: 'AIF',
  customerType: 'Corporate',

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
    requiresPhoto: false,
    requiresSignature: true,
    requiresCheque: true,
    requiresDueDiligenceDoc: true,
    requiresCorporateKycDocs: true,
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
