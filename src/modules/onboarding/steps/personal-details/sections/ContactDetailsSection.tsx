import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";

import verifiedIcon from "../../../../../assets/icons/svg/verified_icon.svg";
import { Button } from "../../../../../shared/ui/button";
import { Input } from "../../../../../shared/ui/input";
import type { VerificationStatus } from "../types";

type ContactDetailsSectionProps = {
  mobile: VerificationStatus;
  email: VerificationStatus;
  /** Locked after entry-screen OTP — not editable on personal details. */
  mobileLocked?: boolean;
  emailLocked?: boolean;
  isSendingOtp?: boolean;
  onMobileChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onStartVerify: (channel: "mobile" | "email") => void;
};

const ContactDetailsSection = ({
  mobile,
  email,
  mobileLocked = false,
  emailLocked = false,
  isSendingOtp = false,
  onMobileChange,
  onEmailChange,
  onStartVerify,
}: ContactDetailsSectionProps): ReactElement => {
  const isEmailInvalid = !email.verified;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-['Mulish',sans-serif] text-[12px] font-medium leading-none tracking-normal text-[#231F20]">
        Contact details
      </h2>

      <div className="grid w-full max-w-[860px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
        <div className="space-y-1">
          <label className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]">
            Mobile Number <span className="text-[#E8402F]">*</span>
          </label>
          <div className="flex h-9 items-center rounded-[8px] border border-[#eeeeee] bg-white pr-2">
            <div className="flex h-full items-center gap-1 bg-[#f5f5f5] px-2 text-right font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#71859B]">
              <span>+91 (IND)</span>
            </div>
            <Input
              className="h-full flex-1 border-0 bg-transparent px-3 shadow-none focus-visible:border-transparent focus-visible:ring-0 disabled:cursor-not-allowed disabled:bg-transparent disabled:opacity-100"
              disabled={mobileLocked}
              maxLength={10}
              onChange={(event) => {
                onMobileChange(event.target.value.replace(/\D/g, ""));
              }}
              readOnly={mobileLocked}
              value={mobile.value}
            />
            {mobile.verified ? (
              <img alt="" className="size-[13px]" src={verifiedIcon} />
            ) : (
              <Button
                className="h-6 rounded-[4px] bg-[var(--color-onboarding-primary)] px-3 text-[11px] text-white hover:bg-[#7f141a] disabled:bg-[#e5e5e6] disabled:text-[#5a6b7d]"
                disabled={isSendingOtp || mobile.value.length !== 10}
                onClick={() => {
                  onStartVerify("mobile");
                }}
                type="button"
              >
                {isSendingOtp ? <Loader2 className="size-3 animate-spin" /> : "Verify"}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#231F20]">
            Email <span className="text-[#E8402F]">*</span>
          </label>
          <div
            className={`flex h-9 items-center rounded-[8px] border bg-white pr-1 ${
              isEmailInvalid ? "border-[var(--color-onboarding-danger)]" : "border-[#eeeeee]"
            }`}
          >
            <Input
              className="h-full flex-1 border-0 bg-transparent px-3 shadow-none focus-visible:border-transparent focus-visible:ring-0 disabled:cursor-not-allowed disabled:bg-transparent disabled:opacity-100"
              disabled={emailLocked}
              onChange={(event) => {
                onEmailChange(event.target.value);
              }}
              readOnly={emailLocked}
              value={email.value}
            />
            {email.verified ? (
              <img alt="" className="mr-2 size-[13px]" src={verifiedIcon} />
            ) : (
              <Button
                className="h-6 rounded-[4px] bg-[var(--color-onboarding-primary)] px-3 text-[11px] text-white hover:bg-[#7f141a] disabled:bg-[#e5e5e6] disabled:text-[#5a6b7d]"
                disabled={isSendingOtp || !email.value.trim()}
                onClick={() => {
                  onStartVerify("email");
                }}
                type="button"
              >
                {isSendingOtp ? <Loader2 className="size-3 animate-spin" /> : "Verify"}
              </Button>
            )}
          </div>
          {isEmailInvalid ? (
            <p className="text-xs leading-[18px] text-[var(--color-onboarding-danger)]">Please verify your email.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ContactDetailsSection;
