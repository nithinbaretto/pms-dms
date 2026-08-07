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
      <p className="text-center text-sm">
        <span className="text-[var(--color-onboarding-muted)]">Need help? </span>
        <span className="text-[var(--color-onboarding-primary)]">Contact Support</span>
      </p>

      {showSecureMessage ? (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--color-onboarding-product-selected-border)] bg-[var(--color-onboarding-product-selected)] p-3">
          <LockKeyhole className="size-5 shrink-0 text-[var(--color-onboarding-primary)]" />
          <p className="text-[11px] leading-[1.6] text-[var(--color-onboarding-muted)]">
            Protected by 256-bit SSL encryption. ICICI Prudential AMC is
            regulated by SEBI. This portal is for registered distributors only.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default SupportFooter;
