import type { ReactElement } from 'react';

import { BusinessCategoryStep } from '../../steps/business-category';
import type { ProductCategory } from '../../types/onboarding-types';

type OnboardingTypeScreenProps = {
  panNumber: string;
  initialCategories: ProductCategory[];
  onContinue: (categories: ProductCategory[]) => void;
  onEditPan?: () => void;
};

const OnboardingTypeScreen = ({
  panNumber,
  initialCategories,
  onContinue,
  onEditPan,
}: OnboardingTypeScreenProps): ReactElement => {
  return (
    <BusinessCategoryStep
      panNumber={panNumber}
      initialCategories={initialCategories}
      onContinue={onContinue}
      onEditPan={onEditPan}
    />
  );
};

export default OnboardingTypeScreen;
