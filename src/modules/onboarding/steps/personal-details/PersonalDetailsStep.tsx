import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "../../../../shared/ui/button";
import { ENTITY_TYPE_OPTIONS, MOCK_PERSONAL_DETAILS } from "./constants";
import CorrespondenceAddressModal from "./modals/CorrespondenceAddressModal";
import OtpVerificationModal from "./modals/OtpVerificationModal";
import AddressSection from "./sections/AddressSection";
import ContactDetailsSection from "./sections/ContactDetailsSection";
import EntitySummarySection from "./sections/EntitySummarySection";
import type {
  EntityType,
  PersonalDetailsModel,
  VerificationChannel,
} from "./types";
import { isPersonalDetailsStepValid } from "./validation";

type PersonalDetailsStepProps = {
  initialData?: PersonalDetailsModel;
  onContinue: (value: PersonalDetailsModel) => void;
};

const PersonalDetailsStep = ({
  initialData = MOCK_PERSONAL_DETAILS,
  onContinue,
}: PersonalDetailsStepProps): ReactElement => {
  const [data, setData] = useState<PersonalDetailsModel>(initialData);
  const [otpChannel, setOtpChannel] = useState<VerificationChannel>("email");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const canContinue = useMemo(() => isPersonalDetailsStepValid(data), [data]);

  const handleEntityTypeSelect = (value: EntityType): void => {
    setData((current) => ({
      ...current,
      personalDetails: {
        ...current.personalDetails,
        entityType: value,
        entityTypeLocked: true,
      },
    }));
  };

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
              mobile={data.mobile}
              onEmailChange={(value) => {
                setData((current) => ({
                  ...current,
                  email: {
                    value,
                    verified: false,
                  },
                }));
              }}
              onMobileChange={(value) => {
                setData((current) => ({
                  ...current,
                  mobile: {
                    value,
                    verified: false,
                  },
                }));
              }}
              onStartVerify={(channel) => {
                setOtpChannel(channel);
                setShowOtpModal(true);
              }}
            />

            <AddressSection
              correspondenceAddress={data.correspondenceAddress}
              onEditCorrespondenceAddress={() => {
                setShowAddressModal(true);
              }}
              permanentAddress={data.permanentAddress}
            />
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-2 px-6 py-2 sm:items-end lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:px-[120px]">
          <div className="hidden h-9 w-[180px] opacity-0 lg:block" aria-hidden="true" />
          <div className="flex w-full flex-col items-start gap-2 sm:items-end lg:w-auto lg:flex-row lg:items-center lg:gap-6">
            <p className="text-[13px] leading-[19.5px] text-[#5a6b7d]">Next: Business Details</p>
            <Button
              className="h-10 w-full rounded-[8.75px] bg-[var(--color-onboarding-primary)] px-[21px] py-2 text-sm text-white hover:bg-[#7f141a] sm:w-[180px] disabled:bg-[#e5e5e6] disabled:text-[#5a6b7d]"
              disabled={!canContinue}
              onClick={() => {
                onContinue(data);
              }}
              type="button"
            >
              <span className="text-sm font-normal leading-[21px]">Continue</span> <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <OtpVerificationModal
        channel={otpChannel}
        onCancel={() => {
          setShowOtpModal(false);
        }}
        onVerify={() => {
          setData((current) => {
            if (otpChannel === "mobile") {
              return {
                ...current,
                mobile: {
                  ...current.mobile,
                  verified: true,
                },
              };
            }

            return {
              ...current,
              email: {
                ...current.email,
                verified: true,
              },
            };
          });
          setShowOtpModal(false);
        }}
        open={showOtpModal}
        value={otpChannel === "mobile" ? data.mobile.value : data.email.value}
      />

      <CorrespondenceAddressModal
        initialAddress={data.correspondenceAddress}
        onCancel={() => {
          setShowAddressModal(false);
        }}
        onSave={(address) => {
          setData((current) => ({ ...current, correspondenceAddress: address }));
          setShowAddressModal(false);
        }}
        open={showAddressModal}
        permanentAddress={data.permanentAddress}
      />
    </>
  );
};

export default PersonalDetailsStep;
