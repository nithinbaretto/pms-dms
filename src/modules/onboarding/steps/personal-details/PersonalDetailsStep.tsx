import type { ReactElement } from "react";
import { useState } from "react";

import OnboardingStepFooter from "../../components/OnboardingStepFooter";
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
  const canEditAddress = data.email.verified && data.mobile.verified;

  return (
    <>
      <div className="mx-auto w-full max-w-[1240px] space-y-3">
        <section className="space-y-3">
          <header className="flex flex-col gap-2">
            <h1 className="font-['Mulish',sans-serif] text-[22px] font-medium leading-none tracking-normal text-[#231F20]">
              Personal Information
            </h1>
            <p className="font-['Mulish',sans-serif] text-[15px] font-semibold leading-[22.5px] tracking-normal text-[#435160]">
              Your details have been fetched from APMI. Fields shown in grey cannot be changed
            </p>
          </header>

          <div>
            <div className="flex items-center justify-between text-xs leading-[18px] text-[#231f20]">
              <span>Step 1 of 6</span>
              <span>20%</span>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[16px] bg-white shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)]">
          <div className="h-2 w-full bg-[#e6e7e8]">
            <div className="h-full w-[20%] rounded-r-full bg-[#37b400]" />
          </div>

          <div className="space-y-6 p-4 md:p-6">
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
              canEditCorrespondenceAddress={canEditAddress}
              correspondenceAddress={data.correspondenceAddress}
              onEditCorrespondenceAddress={() => {
                if (!canEditAddress) {
                  return;
                }

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

      <OnboardingStepFooter
        nextLabel={nextLabel}
        showPrevious={false}
        continueDisabled={!canSave}
        isLoading={isSaving}
        loadingLabel="Saving..."
        onContinue={() => {
          void (async () => {
            const result = await saveDetails();
            if (!result) {
              return;
            }

            onContinue(result.data, result.nextStep);
          })();
        }}
      />

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
          if (!canEditAddress) {
            return;
          }

          saveCorrespondenceAddress(address, sameAsPermanent);
          setShowAddressModal(false);
        }}
        open={showAddressModal && canEditAddress}
        permanentAddress={data.permanentAddress}
      />
    </>
  );
};

export default PersonalDetailsStep;
