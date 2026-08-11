import type { ReactElement } from "react";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "../../../../shared/ui/button";
import OnboardingStepSkeleton from "../../components/OnboardingStepSkeleton";
import { ENTITY_TYPE_OPTIONS } from "./constants";
import CorrespondenceAddressModal from "./modals/CorrespondenceAddressModal";
import OtpVerificationModal from "./modals/OtpVerificationModal";
import AddressSection from "./sections/AddressSection";
import ContactDetailsSection from "./sections/ContactDetailsSection";
import EntitySummarySection from "./sections/EntitySummarySection";
import type { EntityType, PersonalDetailsModel } from "./types";
import { usePersonalDetailsFlow } from "./usePersonalDetailsFlow";

type PersonalDetailsStepProps = {
  onContinue: (value: PersonalDetailsModel, nextStep?: string | null) => void;
};

const PersonalDetailsStep = ({ onContinue }: PersonalDetailsStepProps): ReactElement => {
  const {
    data,
    isLoading,
    isSaving,
    isSendingOtp,
    isVerifyingOtp,
    error,
    otpChannel,
    otpModalOpen,
    canSave,
    emailLockedFromEntry,
    mobileLockedFromEntry,
    setEmailValue,
    setMobileValue,
    startOtpForChannel,
    resendOtp,
    verifyOtpForChannel,
    closeOtpModal,
    saveCorrespondenceAddress,
    saveDetails,
  } = usePersonalDetailsFlow();

  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleEntityTypeSelect = (value: EntityType): void => {
    // Entity type stays locked for PMS Individual; keep handler for existing section API.
    void value;
  };

  if (isLoading) {
    return (
      <OnboardingStepSkeleton
        nextLabel="Business Details"
        progressPercent={20}
        showPrevious={false}
        stepLabel="Step 1 of 6"
        subtitle="Your details have been fetched from APMI. Fields shown in grey cannot be changed."
        title="Personal Information"
      />
    );
  }

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-[1240px] space-y-3 py-16 text-center">
        <p className="text-sm text-[var(--color-onboarding-danger)]">
          {error || "Unable to load personal details."}
        </p>
      </div>
    );
  }

  const nextLabel = data.nextInfoSection?.trim() || "Business Details";

  return (
    <>
      <div className="mx-auto w-full max-w-[1240px] space-y-3">
        <section className="space-y-3">
          <header className="space-y-1">
            <h1 className="text-[22px] font-semibold leading-[33px] text-[#231f20]">Personal Information</h1>
            <p className="text-[15px] leading-[22.5px] text-[var(--color-onboarding-heading)]">
              Your details have been fetched from APMI. Fields shown in grey cannot be changed.
            </p>
          </header>

          <div>
            <div className="flex items-center justify-between text-xs leading-[18px] text-[#231f20]">
              <span>Step 1 of 6</span>
              <span>20%</span>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#f0f0f0] bg-[#f9f9f9] shadow-[-8px_-8px_40px_0px_rgba(0,0,0,0.08)]">
          <div className="h-2 w-full bg-[#e6e7e8]">
            <div className="h-full w-[20%] rounded-r-full bg-[#37b400]" />
          </div>

          <div className="space-y-4 p-4 md:p-6">
            <EntitySummarySection
              entityTypeOptions={ENTITY_TYPE_OPTIONS}
              onEntityTypeSelect={handleEntityTypeSelect}
              summary={data.personalDetails}
            />

            <ContactDetailsSection
              email={data.email}
              emailLocked={emailLockedFromEntry}
              isSendingOtp={isSendingOtp}
              mobile={data.mobile}
              mobileLocked={mobileLockedFromEntry}
              onEmailChange={setEmailValue}
              onMobileChange={setMobileValue}
              onStartVerify={(channel) => {
                void startOtpForChannel(channel);
              }}
            />

            <AddressSection
              correspondenceAddress={data.correspondenceAddress}
              onEditCorrespondenceAddress={() => {
                setShowAddressModal(true);
              }}
              permanentAddress={data.permanentAddress}
            />

            {error && !otpModalOpen ? (
              <p className="text-sm text-[var(--color-onboarding-danger)]">{error}</p>
            ) : null}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-2 px-6 py-2 sm:items-end lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:px-[120px]">
          <div className="hidden h-9 w-[180px] opacity-0 lg:block" aria-hidden="true" />
          <div className="flex w-full flex-col items-start gap-2 sm:items-end lg:w-auto lg:flex-row lg:items-center lg:gap-6">
            <p className="text-[13px] leading-[19.5px] text-[#5a6b7d]">Next: {nextLabel}</p>
            <Button
              className={`h-10 w-full rounded-[8.75px] px-[21px] py-2 text-sm text-white sm:w-[180px] ${
                isSaving
                  ? "bg-[var(--color-onboarding-primary)] hover:bg-[var(--color-onboarding-primary)]"
                  : "bg-[var(--color-onboarding-primary)] hover:bg-[#7f141a] disabled:bg-[#e5e5e6] disabled:text-[#5a6b7d]"
              }`}
              disabled={!canSave || isSaving}
              onClick={() => {
                void (async () => {
                  const result = await saveDetails();
                  if (!result) {
                    return;
                  }

                  onContinue(result.data, result.nextStep);
                })();
              }}
              type="button"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {otpChannel ? (
        <OtpVerificationModal
          channel={otpChannel}
          errorMessage={otpModalOpen ? error : null}
          isSendingOtp={isSendingOtp}
          isVerifyingOtp={isVerifyingOtp}
          onCancel={closeOtpModal}
          onResend={resendOtp}
          onVerify={verifyOtpForChannel}
          open={otpModalOpen}
          value={otpChannel === "mobile" ? data.mobile.value : data.email.value}
        />
      ) : null}

      <CorrespondenceAddressModal
        initialAddress={data.correspondenceAddress}
        initialSameAsPermanent={data.isCorrespoingSameAsPermanent}
        onCancel={() => {
          setShowAddressModal(false);
        }}
        onSave={(address, sameAsPermanent) => {
          saveCorrespondenceAddress(address, sameAsPermanent);
          setShowAddressModal(false);
        }}
        open={showAddressModal}
        permanentAddress={data.permanentAddress}
      />
    </>
  );
};

export default PersonalDetailsStep;
