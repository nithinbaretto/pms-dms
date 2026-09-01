import type { ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import backgroundImage from "../../../assets/images/background_img.png";
import logoImage from "../../../assets/logo.png";
import OnboardingHero from "../components/OnboardingHero";
import { getFlowConfig, type FlowKey } from "../flow/flow.config";
import { getScreenForStep } from "../flow/getScreenForStep";
import { isHufEntityJourney } from "../flow/huf-entity-journey";
import { onboardingApi } from "../services/onboarding-api";
import { useOnboardingStore } from "../state/onboarding-store";
import { AprnVerificationStep } from "../steps/aprn-verification";
import { BankDetailsStep } from "../steps/bank-details";
import { BusinessCategoryStep } from "../steps/business-category";
import { BusinessDetailsStep } from "../steps/business-details";
import { UploadDocumentsStep } from "../steps/documents";
import { EntityDetailsStep } from "../steps/entity-details";
import { HufEntityDetailsStep } from "../steps/huf-entity-details";
import { NomineeStep } from "../steps/nominee";
import { OtpVerificationStep } from "../steps/otp-verification";
import { PersonalDetailsStep } from "../steps/personal-details";
import { ReviewConfirmStep } from "../steps/review";
import { ArnVerifyContactStep, KraVerifyContactStep } from "../steps/verify-contact";
import type { ProductCategory, Step } from "../types/onboarding-types";

const resolveIndividualFlow = (categories: ProductCategory[]): FlowKey => {
  const hasAif = categories.includes("AIF");
  const hasPms = categories.includes("PMS");
  return hasAif && !hasPms ? "aif-individual" : "pms-individual";
};

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
    setCurrentFlow,
    setEmpanelmentType,
    setOnboardingMethod,
    setArn,
    setKraArnStatus,
    setKraDataSource,
    setKraRegisteredContact,
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
  const [onboardingMethodError, setOnboardingMethodError] = useState<string | null>(null);
  const [isUpdatingManualData, setIsUpdatingManualData] = useState(false);

  const flowConfig = useMemo(() => getFlowConfig(currentFlow), [currentFlow]);

  useEffect(() => {
    if (!isHufEntityJourney() && currentStep === "huf-entity-details") {
      setStep("entity-details");
    }
  }, [currentStep, setStep]);

  const startManualJourney = useCallback(async (): Promise<{ ok: boolean; message: string }> => {
    if (!leadId) {
      return { ok: false, message: "Unable to proceed. Please restart the onboarding flow." };
    }

    setIsUpdatingManualData(true);

    try {
      const response = await onboardingApi.updateManualData({ leadId });
      if (!response.success) {
        return {
          ok: false,
          message: response.message?.trim() || "Unable to start manual onboarding. Please try again.",
        };
      }

      if (response.leadId) {
        setLeadId(response.leadId);
      }

      resetAifOtpState();
      setOnboardingMethod("MANUAL");
      setStep("personal-details");
      return { ok: true, message: "" };
    } catch {
      return { ok: false, message: "Unable to start manual onboarding. Please try again." };
    } finally {
      setIsUpdatingManualData(false);
    }
  }, [leadId, resetAifOtpState, setLeadId, setOnboardingMethod, setStep]);

  const startKraJourney = useCallback(async (): Promise<{ ok: boolean; message: string }> => {
    const resolvedPan = (pan || panNumber).trim().toUpperCase();

    if (!leadId || !resolvedPan) {
      return { ok: false, message: "Unable to proceed. Please restart the onboarding flow." };
    }

    setIsUpdatingManualData(true);

    try {
      const response = await onboardingApi.getPanDetailsByKra({
        leadId,
        panNo: resolvedPan,
      });

      if (!response.success) {
        return {
          ok: false,
          message: response.message?.trim() || "Unable to fetch KRA details. Please try again.",
        };
      }

      if (response.leadId) {
        setLeadId(response.leadId);
      }

      setInputEmail(null);
      setInputMobile(null);
      setKraArnStatus(response.arnStatus);
      setKraDataSource(response.dataSource);
      setKraRegisteredContact({
        email: response.email,
        mobile: response.mobile,
      });
      resetAifOtpState();
      setOnboardingMethod("KRA");
      setStep("verify-contact");
      return { ok: true, message: "" };
    } catch {
      return { ok: false, message: "Unable to fetch KRA details. Please try again." };
    } finally {
      setIsUpdatingManualData(false);
    }
  }, [
    leadId,
    pan,
    panNumber,
    resetAifOtpState,
    setInputEmail,
    setInputMobile,
    setKraArnStatus,
    setKraDataSource,
    setKraRegisteredContact,
    setLeadId,
    setOnboardingMethod,
    setStep,
  ]);

  const renderStep = (): ReactElement => {
    if (currentStep === "huf-entity-details" && isHufEntityJourney()) {
      return <HufEntityDetailsStep />;
    }

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
                setPanEntryError(responseMessage || "Invalid PAN");
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

              const nextFlow = resolveIndividualFlow(categories);
              setCurrentFlow(nextFlow);

              if (nextFlow === "pms-individual") {
                setOnboardingMethod(null);
              }

              const configuredSteps = getFlowConfig(nextFlow).steps;
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
          errorMessage={onboardingMethodError}
          isSubmitting={isUpdatingManualData}
          onBack={() => {
            setOnboardingMethodError(null);
            setStep("business-category");
          }}
          onContinue={() => {
            if (!onboardingMethod || isUpdatingManualData) {
              return;
            }

            if (onboardingMethod === "ARN") {
              setOnboardingMethodError(null);
              setVerifyContactError(null);
              setStep("verify-contact");
              return;
            }

            if (onboardingMethod === "MANUAL") {
              setOnboardingMethodError(null);

              void (async () => {
                const result = await startManualJourney();
                if (!result.ok) {
                  setOnboardingMethodError(result.message);
                }
              })();
              return;
            }

            if (onboardingMethod === "KRA") {
              setOnboardingMethodError(null);

              void (async () => {
                const result = await startKraJourney();
                if (!result.ok) {
                  setOnboardingMethodError(result.message);
                }
              })();
              return;
            }

            // Placeholder route for Digilocker journey.
            window.alert(`${onboardingMethod} journey will be available in the next release.`);
          }}
          onEmpanelmentTypeChange={setEmpanelmentType}
          onMethodChange={(value) => {
            setOnboardingMethod(value);
            if (value === "KRA") {
              setInputEmail(null);
              setInputMobile(null);
            }
          }}
          onboardingMethod={onboardingMethod}
          panNumber={pan || panNumber}
        />
      );
    }

    if (currentStep === "verify-contact") {
      if (onboardingMethod === "KRA" || onboardingMethod === "ARN") {
        const VerifyContactForMethod =
          onboardingMethod === "ARN" ? ArnVerifyContactStep : KraVerifyContactStep;

        return (
          <VerifyContactForMethod
            onBack={() => {
              setVerifyContactError(null);
              setStep("onboarding-method");
            }}
            onContinue={() => {
              setVerifyContactError(null);
              resetAifOtpState();
              setOtpAttempts(0);
              setAccountRestricted(false);
              setEmailVerified(false);
              setMobileVerified(false);
              setEmailVerifiedAt(null);
              setMobileVerifiedAt(null);
              setOtpTimerSeconds(30);
              setStep("otp-verification");
            }}
            panNumber={pan || panNumber}
          />
        );
      }

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
            if (isUpdatingManualData) {
              return;
            }

            setVerifyContactError(null);

            void (async () => {
              const result = await startManualJourney();
              if (!result.ok) {
                setVerifyContactError(result.message);
              }
            })();
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
            if (
              currentFlow === "aif-individual" &&
              (onboardingMethod === "ARN" || onboardingMethod === "KRA")
            ) {
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

  const isFullPageStep =
    (currentStep === "huf-entity-details" && isHufEntityJourney()) ||
    currentStep === "personal-details" ||
    currentStep === "business-details" ||
    currentStep === "bank-details" ||
    currentStep === "nominee-details" ||
    currentStep === "upload-documents" ||
    currentStep === "review-confirm";

  return (
    <main className="relative flex h-svh flex-col overflow-hidden bg-[var(--color-onboarding-background)]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[810px] w-[1440px] -translate-x-1/2 -translate-y-1/2 opacity-60">
        <div className="absolute inset-0 overflow-hidden">
          <img
            alt=""
            className="absolute left-[27.29%] top-[-2.35%] h-[107.16%] w-[90.41%] max-w-none"
            src={backgroundImage}
          />
        </div>
      </div>

      <div
        className={
          isFullPageStep
            ? "relative z-10 mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col px-6 pt-8 pb-24 lg:px-[120px] lg:pt-16 lg:pb-16"
            : "relative z-10 mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col px-6 py-8 lg:px-[120px] lg:py-16"
        }
      >
        <img
          alt="ICICI Prudential Alternate Investments"
          className="h-[56px] w-[115px] shrink-0 object-contain object-left"
          src={logoImage}
        />

        {isFullPageStep ? (
          <div className="mt-6 min-h-0 flex-1 overflow-y-auto lg:mt-10">
            {renderStep()}
          </div>
        ) : (
          <div className="mt-10 flex min-h-0 flex-1 flex-col overflow-y-auto lg:mt-16">
            <div className="my-auto flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="min-w-0 max-w-[610px]">
                <OnboardingHero />
              </div>
              <div className="w-full min-w-0 max-w-[488px] shrink-0 lg:ml-auto">
                {renderStep()}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default OnboardingContainer;
