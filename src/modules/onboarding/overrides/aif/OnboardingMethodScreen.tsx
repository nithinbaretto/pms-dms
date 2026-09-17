import type { ReactElement } from "react";

import { OnboardingMethodStep } from "../../steps/onboarding-method";
import type { EmpanelmentType, OnboardingMethod } from "../../types/onboarding-types";

type OnboardingMethodScreenProps = {
  panNumber: string;
  empanelmentType: EmpanelmentType;
  onboardingMethod: OnboardingMethod | null;
  onEmpanelmentTypeChange: (value: EmpanelmentType) => void;
  onMethodChange: (value: OnboardingMethod) => void;
  onBack: () => void;
  onContinue: () => void;
  onEditPan?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

const OnboardingMethodScreen = ({
  panNumber,
  empanelmentType,
  onboardingMethod,
  onEmpanelmentTypeChange,
  onMethodChange,
  onBack,
  onContinue,
  onEditPan,
  isSubmitting,
  errorMessage,
}: OnboardingMethodScreenProps): ReactElement => {
  return (
    <OnboardingMethodStep
      empanelmentType={empanelmentType}
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
      onBack={onBack}
      onContinue={onContinue}
      onEditPan={onEditPan}
      onEmpanelmentTypeChange={onEmpanelmentTypeChange}
      onMethodChange={onMethodChange}
      onboardingMethod={onboardingMethod}
      panNumber={panNumber}
    />
  );
};

export default OnboardingMethodScreen;
