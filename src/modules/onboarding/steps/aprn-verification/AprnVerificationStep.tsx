import type { ReactElement } from "react";
import { useMemo, useState } from "react";

import AprnFormCard from "../../components/AprnFormCard";
import { onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import type { ProductCategory } from "../../types/onboarding-types";

type AprnStepVariant = "default" | "error" | "riaVariant";

type AprnVerificationStepProps = {
  panNumber: string;
  leadId: string | null;
  productCategories: ProductCategory[];
  onBack: () => void;
  onContinue: () => void;
};

const APRN_NUMERIC_FORMAT = /^(?:APRN)?\d+$/;

const AprnVerificationStep = ({
  panNumber,
  leadId,
  productCategories,
  onBack,
  onContinue,
}: AprnVerificationStepProps): ReactElement => {
  const { setAprnNumber: setAprnNumberInStore, setAprnStatus, setInputEmail, setInputMobile, setLeadId, setArn } =
    useOnboardingStore();
  const [aprnNumber, setAprnNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasAifCategory = productCategories.includes("AIF");
  const [variant, setVariant] = useState<AprnStepVariant>(
    hasAifCategory ? "riaVariant" : "default",
  );

  const productLabel = useMemo(() => {
    return productCategories.join(", ");
  }, [productCategories]);

  const validateAprn = (value: string): string | null => {
    const trimmed = value.trim().toUpperCase();

    if (!trimmed) {
      return "APRN Number is required";
    }

    if (!APRN_NUMERIC_FORMAT.test(trimmed)) {
      return "Please enter a valid APRN number";
    }

    return null;
  };

  const handleContinue = async (): Promise<void> => {
    const validationError = validateAprn(aprnNumber);

    if (validationError) {
      setErrorMessage(validationError);
      setVariant("error");
      return;
    }

    if (!leadId || !panNumber.trim()) {
      setErrorMessage("Unable to verify APRN. Please restart onboarding.");
      setVariant("error");
      return;
    }

    const normalizedAprn = aprnNumber.trim().toUpperCase();

    try {
      const response = await onboardingApi.verifyAprn({
        aprnNumber: normalizedAprn,
        leadId,
        panNumber: panNumber.trim().toUpperCase(),
      });
      const backendMessage = response.message?.trim();
      const hasBackendErrorMessage = /error|invalid|unable|failed|not\s+valid/i.test(backendMessage ?? "");

      if (response.validationStatus !== true || hasBackendErrorMessage) {
        setErrorMessage(backendMessage || "Invalid APRN");
        setVariant("error");
        return;
      }

      setAprnNumberInStore(normalizedAprn);
      setInputEmail(response.email ?? null);
      setInputMobile(response.mobile ?? null);
      setAprnStatus(response.aprnStatus ?? true);
      setLeadId(response.leadId ?? leadId);
      setArn(normalizedAprn);
      setErrorMessage(null);
      setVariant(hasAifCategory ? "riaVariant" : "default");
      onContinue();
    } catch {
      setErrorMessage("Invalid APRN");
      setVariant("error");
    }
  };

  return (
    <AprnFormCard
      errorMessage={errorMessage}
      onBack={onBack}
      onChange={(next) => {
        setAprnNumber(next);

        if (errorMessage) {
          setErrorMessage(null);
          setVariant(hasAifCategory ? "riaVariant" : "default");
        }
      }}
      onContinue={() => {
        void handleContinue();
      }}
      panNumber={panNumber}
      productLabel={productLabel}
      showRiaVariant={variant === "riaVariant"}
      value={aprnNumber}
    />
  );
};

export default AprnVerificationStep;
