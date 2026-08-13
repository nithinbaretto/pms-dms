import type { ReactElement } from "react";
import { useMemo, useState } from "react";

import backgroundImage from "../../../assets/images/background_img.png";
import logoImage from "../../../assets/logo.png";
import OnboardingHero from "../components/OnboardingHero";
import { getFlowConfig } from "../flow/flow.config";
import { getScreenForStep } from "../flow/getScreenForStep";
import { onboardingApi } from "../services/onboarding-api";
import { useOnboardingStore } from "../state/onboarding-store";
import { AprnVerificationStep } from "../steps/aprn-verification";
import { BankDetailsStep } from "../steps/bank-details";
import { BusinessCategoryStep } from "../steps/business-category";
import { BusinessDetailsStep } from "../steps/business-details";
import { UploadDocumentsStep } from "../steps/documents";
import { NomineeStep } from "../steps/nominee";
import { OtpVerificationStep } from "../steps/otp-verification";
import { PersonalDetailsStep } from "../steps/personal-details";
import { ReviewConfirmStep } from "../steps/review";
import { EntityDetailsStep } from "../steps/entity-details";
import type { Step } from "../types/onboarding-types";

const OnboardingContainer = (): ReactElement => {
  const {
    currentFlow,
    currentStep,
    pan,
    panNumber,
    leadId,
    onboardingMethod,
    empanelmentType,
    arn,
    inputEmail,
    inputMobile,
    productCategories,
    isEditMode,
    bankDocuments,
    nextStep,
    prevStep,
    setPan,
    setLeadId,
    setApplicationIds,
    setProductCategories,
    setBusinessCategory,
    setEmpanelmentType,
    setOnboardingMethod,
    setArn,
    setInputEmail,
    setInputMobile,
    setAmfiMaskedEmail,
    setAmfiMaskedMobile,
    resetAifOtpState,
    setOtpTimerSeconds,
    setOtpAttempts,
    setAccountRestricted,
    setEmailVerified,
    setMobileVerified,
    setEmailVerifiedAt,
    setMobileVerifiedAt,
    setPersonalDetails,
    setStep,
    setIsEditMode,
    setChequeUploaded,
    setPanValidationMeta,
  } = useOnboardingStore();
  const [businessCategoryError, setBusinessCategoryError] = useState<string | null>(null);
  const [panEntryError, setPanEntryError] = useState<string | null>(null);
  const [isValidatingPan, setIsValidatingPan] = useState(false);
  const [verifyContactError, setVerifyContactError] = useState<string | null>(null);
  const [isVerifyingContact, setIsVerifyingContact] = useState(false);
  const [isSavingBusinessCategory, setIsSavingBusinessCategory] = useState(false);

  const flowConfig = useMemo(() => getFlowConfig(currentFlow), [currentFlow]);

  const renderStep = (): ReactElement => {
    if (currentStep === "entity-details") {
      return (
        <EntityDetailsStep
          externalError={panEntryError}
          initialPan={pan || panNumber}
          isSubmitting={isValidatingPan}
          onPanChange={() => {
            setPanEntryError(null);
          }}
          onContinue={async (value) => {
            const normalizedPan = value.trim().toUpperCase();

            setPanEntryError(null);
            setIsValidatingPan(true);

            try {
              const panValidation = await onboardingApi.validatePan(normalizedPan);
              const responseMessage = panValidation.message?.trim();
              const hasErrorMessage = /error|invalid|unable|failed|not\s+valid|not\s+eligible/i.test(responseMessage ?? "");

              if (!panValidation.isValid || hasErrorMessage) {
                setPanEntryError(responseMessage || "Invalid PAN number");
                setIsValidatingPan(false);
                return;
              }

              setPan(normalizedPan);
              setInputEmail(panValidation.email ?? null);
              setInputMobile(panValidation.mobile ?? null);
              setPanValidationMeta({
                leadId: panValidation.leadId ?? null,
                existingProductTypes: panValidation.existingProductTypes ?? [],
                isExistingApplicant: panValidation.isExistingApplicant ?? null,
                isExistingDistributor: panValidation.isExistingDistributor ?? null,
              });
              setBusinessCategoryError(null);
              setIsValidatingPan(false);
              setStep("business-category");
            } catch {
              setPanEntryError("Unable to validate PAN. Please try again.");
              setIsValidatingPan(false);
            }
          }}
        />
      );
    }

    if (currentStep === "personal-details") {
      return (
        <PersonalDetailsStep
          onContinue={(details, routedStep) => {
            setPersonalDetails(details);
            if (isEditMode) {
              setIsEditMode(false);
              setStep("review-confirm");
              return;
            }

            if (routedStep) {
              setStep(routedStep as Step);
              return;
            }

            nextStep();
          }}
        />
      );
    }

    if (currentStep === "business-category") {
      return (
        <BusinessCategoryStep
          externalError={businessCategoryError}
          initialCategories={productCategories}
          isSubmitting={isSavingBusinessCategory}
          onEditPan={() => {
            setBusinessCategoryError(null);
            setPanEntryError(null);
            setStep("entity-details");
          }}
          onContinue={async (categories) => {
            setBusinessCategoryError(null);

            if (categories.length === 0) {
              setBusinessCategoryError("Please select at least one product category.");
              return;
            }

            const resolvedPanNumber = (pan || panNumber).trim().toUpperCase();

            if (!leadId || !resolvedPanNumber) {
              setBusinessCategoryError("Unable to proceed. Please restart the onboarding flow.");
              return;
            }

            setProductCategories(categories);

            const hasPms = categories.includes("PMS");
            const hasAif = categories.includes("AIF");
            const category = hasPms && hasAif ? "PMS+AIF" : hasPms ? "PMS" : "AIF";
            setBusinessCategory(category);

            setIsSavingBusinessCategory(true);

            try {
              const data = await onboardingApi.saveBusinessDetails({
                categories,
                leadId,
                panNumber: resolvedPanNumber,
              });

              if (data.status !== "SUCCESS") {
                setBusinessCategoryError(data.message?.trim() || "Unable to save business details.");
                setIsSavingBusinessCategory(false);
                return;
              }

              setApplicationIds(data.applicationIds);
              setLeadId(data.leadId ?? leadId);

              const configuredSteps = Array.isArray(flowConfig?.steps) ? flowConfig.steps : [];
              const currentIndex = configuredSteps.indexOf("business-category");
              const nextConfiguredStep = configuredSteps[currentIndex + 1] as Step | undefined;

              if (nextConfiguredStep) {
                setStep(nextConfiguredStep);
              } else if (configuredSteps.includes("onboarding-method")) {
                setStep("onboarding-method");
              } else {
                setStep("aprn-verification");
              }

              setIsSavingBusinessCategory(false);
              return;
            } catch {
              setBusinessCategoryError("Unable to save business details.");
              setIsSavingBusinessCategory(false);
              return;
            }
          }}
          panNumber={pan || panNumber}
        />
      );
    }

    if (currentStep === "onboarding-method") {
      const OnboardingMethodScreen = getScreenForStep("onboarding-method", flowConfig);

      return (
        <OnboardingMethodScreen
          empanelmentType={empanelmentType}
          onBack={() => {
            setStep("business-category");
          }}
          onContinue={() => {
            if (!onboardingMethod) {
              return;
            }

            if (onboardingMethod === "ARN") {
              setStep("verify-contact");
              return;
            }

            // Placeholder routes for KRA, Digilocker, and Manual journeys.
            window.alert(`${onboardingMethod} journey will be available in the next release.`);
          }}
          onEmpanelmentTypeChange={setEmpanelmentType}
          onMethodChange={setOnboardingMethod}
          onboardingMethod={onboardingMethod}
          panNumber={pan || panNumber}
        />
      );
    }

    if (currentStep === "verify-contact") {
      const VerifyContactScreen = getScreenForStep("verify-contact", flowConfig);

      return (
        <VerifyContactScreen
          arn={arn}
          email={inputEmail}
          errorMessage={verifyContactError}
          showFailureActions={Boolean(verifyContactError)}
          isSubmitting={isVerifyingContact}
          mobile={inputMobile}
          onBack={() => {
            setVerifyContactError(null);
            setStep("onboarding-method");
          }}
          onManualJourney={() => {
            setOnboardingMethod("MANUAL");
            window.alert("Manual AIF onboarding flow will be available in the next release.");
          }}
          onRetry={() => {
            setVerifyContactError(null);
          }}
          onContinue={async (payload: { arn: string | null; email: string | null; mobile: string | null }) => {
            setVerifyContactError(null);
            setIsVerifyingContact(true);

            const requestPayload = {
              pan: pan || panNumber,
              arn: payload.arn || null,
              contact: {
                email: payload.email || null,
                mobile: payload.mobile || null,
              },
            };

            try {
              const response = await onboardingApi.validateAmfiContact(requestPayload);
              if (!response.success) {
                setVerifyContactError(response.message ?? "AMFI validation failed.");
                return;
              }

              setArn(payload.arn || null);
              setInputEmail(payload.email || null);
              setInputMobile(payload.mobile || null);
              setAmfiMaskedEmail(response.maskedEmail || null);
              setAmfiMaskedMobile(response.maskedMobile || null);
              resetAifOtpState();
              setOtpAttempts(0);
              setAccountRestricted(false);
              setEmailVerified(false);
              setMobileVerified(false);
              setEmailVerifiedAt(null);
              setMobileVerifiedAt(null);
              setOtpTimerSeconds(30);
              setStep("otp-verification");
            } catch {
              setVerifyContactError("AMFI validation failed.");
            } finally {
              setIsVerifyingContact(false);
            }
          }}
          panNumber={pan || panNumber}
        />
      );
    }

    if (currentStep === "business-details") {
      return (
        <BusinessDetailsStep
          onBack={prevStep}
          onContinue={(routedStep) => {
            if (isEditMode) {
              setIsEditMode(false);
              setStep("review-confirm");
              return;
            }

            if (routedStep) {
              setStep(routedStep as Step);
              return;
            }

            nextStep();
          }}
        />
      );
    }

    if (currentStep === "aprn-verification") {
      return (
        <AprnVerificationStep
          leadId={leadId}
          onBack={() => {
            setStep("business-category");
          }}
          onContinue={() => {
            resetAifOtpState();
            setOtpAttempts(0);
            setAccountRestricted(false);
            setEmailVerifiedAt(null);
            setMobileVerifiedAt(null);

            const configuredSteps = Array.isArray(flowConfig?.steps) ? flowConfig.steps : [];
            const currentIndex = configuredSteps.indexOf("aprn-verification");
            const nextConfiguredStep = configuredSteps[currentIndex + 1] as Step | undefined;

            if (nextConfiguredStep) {
              setStep(nextConfiguredStep);
              return;
            }

            nextStep();
          }}
          panNumber={panNumber}
          productCategories={productCategories}
        />
      );
    }

    if (currentStep === "otp-verification") {
      return (
        <OtpVerificationStep
          onBack={() => {
            if (onboardingMethod === "ARN") {
              setStep("verify-contact");
              return;
            }

            setStep("aprn-verification");
          }}
          onContinue={() => {
            setStep("personal-details");
          }}
        />
      );
    }

    if (currentStep === "nominee-details") {
      return (
        <NomineeStep
          onBack={prevStep}
          onContinue={nextStep}
          isEditMode={isEditMode}
          onGoToReview={() => {
            setIsEditMode(false);
            setStep("review-confirm");
          }}
        />
      );
    }

    if (currentStep === "upload-documents") {
      return (
        <UploadDocumentsStep
          documentRules={flowConfig.documents}
          onBack={prevStep}
          onContinue={nextStep}
          isEditMode={isEditMode}
          onGoToReview={() => {
            setIsEditMode(false);
            setStep("review-confirm");
          }}
        />
      );
    }

    if (currentStep === "review-confirm") {
      return (
        <ReviewConfirmStep
          onBack={prevStep}
          onEditSection={(section) => {
            setIsEditMode(true);

            if (section === "personal") {
              setStep("personal-details");
              return;
            }

            if (section === "business") {
              setStep("business-details");
              return;
            }

            if (section === "bank") {
              setStep("bank-details");
              return;
            }

            if (section === "nominee") {
              setStep("nominee-details");
              return;
            }

            setStep("upload-documents");
          }}
        />
      );
    }

    return (
      <BankDetailsStep
        onBack={prevStep}
        onContinue={nextStep}
        isEditMode={isEditMode}
        onGoToReview={() => {
          setIsEditMode(false);
          setStep("review-confirm");
        }}
        chequeUploaded={bankDocuments.chequeUploaded}
        onChequeUploadedChange={setChequeUploaded}
      />
    );
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--color-onboarding-background)]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[810px] w-[1440px] -translate-x-1/2 -translate-y-1/2 opacity-60">
        <div className="absolute inset-0 overflow-hidden">
          <img
            alt=""
            className="absolute left-[27.29%] top-[-2.35%] h-[107.16%] w-[90.41%] max-w-none"
            src={backgroundImage}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-[120px] lg:py-16">
        <img
          alt="ICICI Prudential Alternate Investments"
          className="h-[56px] w-[115px] object-contain object-left"
          src={logoImage}
        />

        {currentStep === "personal-details" || currentStep === "business-details" || currentStep === "bank-details" || currentStep === "nominee-details" || currentStep === "upload-documents" || currentStep === "review-confirm" ? (
          <div className="mt-6 pb-28 lg:mt-10 lg:pb-24">{renderStep()}</div>
        ) : (
          <div className="relative mt-0 min-w-0">
            <div className="mt-10 min-w-0 max-w-[610px] lg:mt-34">
              <OnboardingHero />
            </div>
            <div className="mt-10 w-full min-w-0 max-w-[488px] lg:absolute lg:right-0 lg:top-1/2 lg:mt-0 lg:w-[488px] lg:-translate-y-1/2 lg:translate-x-6">
              {renderStep()}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default OnboardingContainer;
