export default {
  product: 'PMS',
  customerType: 'NRI',

  steps: [
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
