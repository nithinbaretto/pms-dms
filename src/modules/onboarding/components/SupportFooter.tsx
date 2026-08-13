import type { ReactElement } from "react";
import { LockKeyhole } from "lucide-react";

type SupportFooterProps = {
  showSecureMessage?: boolean;
};

const SupportFooter = ({
  showSecureMessage = false,
}: SupportFooterProps): ReactElement => {
  return (
    <div className="w-full space-y-4">
      <p className="text-center font-['Mulish',sans-serif]">
        <span className="text-[14px] font-normal leading-[18px] tracking-normal text-[#71859b]">
          Need help?{" "}
        </span>
        <span className="text-[14px] font-normal leading-[21px] tracking-normal text-[#93161e]">
          Contact Support
        </span>
      </p>

      {showSecureMessage ? (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--color-onboarding-product-selected-border)] bg-[var(--color-onboarding-product-selected)] p-3">
          <LockKeyhole className="size-5 shrink-0 text-[var(--color-onboarding-primary)]" />
          <p className="font-['Mulish',sans-serif] text-[11px] font-normal leading-[17.88px] tracking-normal text-[#71859b]">
            Protected by 256-bit SSL encryption. ICICI Prudential AMC is
            regulated by SEBI. This portal is for registered distributors only.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default SupportFooter;
