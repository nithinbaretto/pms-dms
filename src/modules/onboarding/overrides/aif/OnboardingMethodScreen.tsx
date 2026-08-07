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
};

const OnboardingMethodScreen = ({
  panNumber,
  empanelmentType,
  onboardingMethod,
  onEmpanelmentTypeChange,
  onMethodChange,
  onBack,
  onContinue,
}: OnboardingMethodScreenProps): ReactElement => {
  return (
    <OnboardingMethodStep
      empanelmentType={empanelmentType}
      onBack={onBack}
      onContinue={onContinue}
      onEmpanelmentTypeChange={onEmpanelmentTypeChange}
      onMethodChange={onMethodChange}
      onboardingMethod={onboardingMethod}
      panNumber={panNumber}
    />
  );
};

export default OnboardingMethodScreen;
