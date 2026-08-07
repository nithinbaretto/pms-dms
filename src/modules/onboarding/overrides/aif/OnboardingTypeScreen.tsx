import type { ReactElement } from 'react';

import { BusinessCategoryStep } from '../../steps/business-category';
import type { ProductCategory } from '../../types/onboarding-types';

type OnboardingTypeScreenProps = {
  panNumber: string;
  initialCategories: ProductCategory[];
  onContinue: (categories: ProductCategory[]) => void;
};

const OnboardingTypeScreen = ({
  panNumber,
  initialCategories,
  onContinue,
}: OnboardingTypeScreenProps): ReactElement => {
  return (
    <BusinessCategoryStep
      panNumber={panNumber}
      initialCategories={initialCategories}
      onContinue={onContinue}
    />
  );
};

export default OnboardingTypeScreen;
