import type { ReactElement } from "react";
import { useMemo, useState } from "react";

import AprnFormCard from "../../components/AprnFormCard";
import { extractErrorMessage, onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import type { EmpanelmentType, ProductCategory } from "../../types/onboarding-types";

type AprnStepVariant = "default" | "error" | "riaVariant";

type AprnVerificationStepProps = {
  panNumber: string;
  leadId: string | null;
  productCategories: ProductCategory[];
  onBack: () => void;
  onContinue: () => void;
};

const APRN_PREFIX = "APRN";
const APRN_DIGITS_FORMAT = /^\d+$/;

const toFullAprnNumber = (digits: string): string => `${APRN_PREFIX}${digits.trim()}`;

const AprnVerificationStep = ({
  panNumber,
  leadId,
  productCategories,
  onBack,
  onContinue,
}: AprnVerificationStepProps): ReactElement => {
  const {
    setAprnNumber: setAprnNumberInStore,
    setAprnStatus,
    setInputEmail,
    setInputMobile,
    setLeadId,
    setArn,
    setKraDataSource,
  } = useOnboardingStore();
  const [aprnNumber, setAprnNumber] = useState("");
  const [empanelmentType, setEmpanelmentType] = useState<EmpanelmentType>("Distributor");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasAifCategory = productCategories.includes("AIF");
  const [variant, setVariant] = useState<AprnStepVariant>(
    hasAifCategory ? "riaVariant" : "default",
  );

  const productLabel = useMemo(() => {
    return productCategories.join(", ");
  }, [productCategories]);

  const validateAprn = (value: string): string | null => {
    const digits = value.trim();

    if (!digits) {
      return "APRN Number is required";
    }

    if (!APRN_DIGITS_FORMAT.test(digits)) {
      return "Please enter a valid APRN number";
    }

    return null;
  };

  const handleContinue = async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }

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

    const normalizedAprn = toFullAprnNumber(aprnNumber);
    const normalizedPan = panNumber.trim().toUpperCase();

    setIsSubmitting(true);

    try {
      const response = await onboardingApi.verifyAprn({
        aprnNumber: normalizedAprn,
        leadId,
        panNumber: normalizedPan,
      });
      const backendMessage = response.message?.trim();

      if (!response.success || response.validationStatus !== true) {
        setErrorMessage(backendMessage || "Please enter valid APRN Number");
        setVariant("error");
        return;
      }

      const resolvedLeadId = response.leadId ?? leadId;
      const email = (response.email ?? "").trim();
      const mobile = (response.mobile ?? "").trim();

      if (!email || !mobile) {
        setErrorMessage("Unable to send OTP. Email or mobile not available from APMI.");
        setVariant("error");
        return;
      }

      const otpPayloadBase = {
        email,
        leadId: resolvedLeadId,
        mobile,
        panNumber: normalizedPan,
      };

      try {
        const otpResponse = await onboardingApi.sendOtp({
          ...otpPayloadBase,
          type: "Partner Integration",
        });

        if (!otpResponse.success) {
          setErrorMessage(otpResponse.message || "Unable to send OTP. Please try again.");
          setVariant("error");
          return;
        }
      } catch {
        setErrorMessage("Unable to send OTP. Please try again.");
        setVariant("error");
        return;
      }

      setAprnNumberInStore(normalizedAprn);
      setInputEmail(email);
      setInputMobile(mobile);
      setAprnStatus(response.aprnStatus);
      setKraDataSource(response.dataSource ?? "APMI");
      setLeadId(resolvedLeadId);
      setArn(normalizedAprn);
      setErrorMessage(null);
      setVariant(hasAifCategory ? "riaVariant" : "default");
      onContinue();
    } catch (error) {
      setErrorMessage(extractErrorMessage(error) || "Please enter valid APRN Number");
      setVariant("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AprnFormCard
      empanelmentType={empanelmentType}
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
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
      onEmpanelmentTypeChange={setEmpanelmentType}
      panNumber={panNumber}
      productLabel={productLabel}
      showRiaVariant={variant === "riaVariant"}
      value={aprnNumber}
    />
  );
};

export default AprnVerificationStep;
