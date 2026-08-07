import type { ReactElement } from "react";

import { VerifyContactStep } from "../../steps/verify-contact";

type VerifyContactScreenProps = {
  panNumber: string;
  arn: string | null;
  email: string | null;
  mobile: string | null;
  errorMessage?: string | null;
  showFailureActions?: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onRetry?: () => void;
  onManualJourney?: () => void;
  onContinue: (payload: { arn: string | null; email: string | null; mobile: string | null }) => void;
};

const VerifyContactScreen = ({
  panNumber,
  arn,
  email,
  mobile,
  errorMessage,
  showFailureActions,
  isSubmitting,
  onBack,
  onRetry,
  onManualJourney,
  onContinue,
}: VerifyContactScreenProps): ReactElement => {
  return (
    <VerifyContactStep
      arn={arn}
      email={email}
      errorMessage={errorMessage}
      showFailureActions={showFailureActions}
      isSubmitting={isSubmitting}
      mobile={mobile}
      onBack={onBack}
      onContinue={onContinue}
      onManualJourney={onManualJourney}
      onRetry={onRetry}
      panNumber={panNumber}
    />
  );
};

export default VerifyContactScreen;
