import type { ReactElement } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Button } from "../../../../../shared/ui/button";
import { Input } from "../../../../../shared/ui/input";
import type { VerificationStatus } from "../types";

type ContactDetailsSectionProps = {
  mobile: VerificationStatus;
  email: VerificationStatus;
  onMobileChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onStartVerify: (channel: "mobile" | "email") => void;
};

const VerificationPill = ({ verified }: { verified: boolean }): ReactElement => {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f8e7] px-2 py-1 text-xs font-semibold text-[#37b400]">
        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#fff5ea] px-2 py-1 text-xs font-semibold text-[#d97706]">
      <AlertTriangle className="h-3.5 w-3.5" /> Verify
    </span>
  );
};

const ContactDetailsSection = ({
  mobile,
  email,
  onMobileChange,
  onEmailChange,
  onStartVerify,
}: ContactDetailsSectionProps): ReactElement => {
  const isEmailInvalid = !email.verified;

  return (
    <section className="space-y-3 border-t border-[#e6e7e8] pt-4">
      <h2 className="text-sm font-semibold text-[#231f20]">Contact details</h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
        <div className="space-y-1">
          <label className="text-xs text-[#231f20]">Mobile Number *</label>
          <div className="flex h-9 items-center rounded-[8px] border border-[#eeeeee] bg-white pr-2">
            <div className="flex h-full items-center gap-1 bg-[#f5f5f5] px-2 text-[13px] text-[#71859b]">
              <span>+91 (IND)</span>
            </div>
            <Input
              className="h-full flex-1 border-0 bg-transparent px-3 text-[13px] shadow-none focus-visible:ring-0"
              maxLength={10}
              onChange={(event) => {
                onMobileChange(event.target.value.replace(/\D/g, ""));
              }}
              value={mobile.value}
            />
            {mobile.verified ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-[#37b400]" />
            ) : (
              <Button
                className="h-6 rounded-[4px] bg-[var(--color-onboarding-primary)] px-3 text-[11px] text-white hover:bg-[#7f141a]"
                onClick={() => {
                  onStartVerify("mobile");
                }}
                type="button"
              >
                Verify
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-[#231f20]">Email *</label>
          <div
            className={`flex h-9 items-center rounded-[8px] border bg-white pr-1 ${
              isEmailInvalid ? "border-[var(--color-onboarding-danger)]" : "border-[#eeeeee]"
            }`}
          >
            <Input
              className="h-full flex-1 border-0 bg-transparent px-3 text-[13px] shadow-none focus-visible:ring-0"
              onChange={(event) => {
                onEmailChange(event.target.value);
              }}
              value={email.value}
            />
            <Button
              className="h-6 rounded-[4px] bg-[var(--color-onboarding-primary)] px-3 text-[11px] text-white hover:bg-[#7f141a]"
              onClick={() => {
                onStartVerify("email");
              }}
              type="button"
            >
              Verify
            </Button>
          </div>
          {isEmailInvalid ? (
            <p className="text-xs leading-[18px] text-[var(--color-onboarding-danger)]">Please verify your email.</p>
          ) : (
            <VerificationPill verified />
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactDetailsSection;
