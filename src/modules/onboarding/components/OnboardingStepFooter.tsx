import type { ReactElement, ReactNode } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

type OnboardingStepFooterProps = {
  nextLabel?: string | null;
  onNextClick?: () => void;
  nextClickable?: boolean;
  showPrevious?: boolean;
  onPrevious?: () => void;
  previousDisabled?: boolean;
  previousLabel?: string;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  hideContinueArrow?: boolean;
  continueContent?: ReactNode;
  /** Optional action rendered immediately before the primary continue button. */
  beforeContinue?: ReactNode;
};

const NextLabel = ({
  nextLabel,
  canClickNext,
  onNextClick,
  className,
}: {
  nextLabel: string;
  canClickNext: boolean;
  onNextClick?: () => void;
  className?: string;
}): ReactElement =>
  canClickNext ? (
    <button
      type="button"
      onClick={onNextClick}
      className={`font-['Mulish',sans-serif] text-[13px] font-normal leading-[19.5px] text-[#e8402f] underline underline-offset-2 hover:opacity-80 ${className ?? ""}`}
    >
      Next: {nextLabel}
    </button>
  ) : (
    <p
      className={`font-['Mulish',sans-serif] text-[13px] font-normal leading-[19.5px] text-[#5a6b7d] ${className ?? ""}`}
    >
      Next: {nextLabel}
    </p>
  );

/**
 * Shared onboarding step footer.
 * - Mobile: stacked Figma layout — Next label above, then [Previous] [Continue]
 * - Desktop: original web layout — Previous left, Next + Continue right
 */
const OnboardingStepFooter = ({
  nextLabel,
  onNextClick,
  nextClickable = false,
  showPrevious = true,
  onPrevious,
  previousDisabled = false,
  previousLabel = "Previous",
  onContinue,
  continueDisabled = false,
  continueLabel = "Continue",
  isLoading = false,
  loadingLabel,
  hideContinueArrow = false,
  continueContent,
  beforeContinue,
}: OnboardingStepFooterProps): ReactElement => {
  const canClickNext = Boolean(nextClickable && onNextClick && !continueDisabled && !isLoading);
  const resolvedLoadingLabel = loadingLabel ?? `${continueLabel.replace(/→.*/, "").trim()}...`;

  const renderPrevious = (className: string): ReactElement | null =>
    showPrevious ? (
      <button
        type="button"
        onClick={onPrevious}
        disabled={previousDisabled || isLoading}
        className={`flex items-center justify-center rounded-[8px] border border-[#eee] bg-white transition-colors hover:border-[#c7aa7b] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        <span className="font-['Mulish',sans-serif] text-[14px] font-normal leading-[21px] text-[#435160]">
          {previousLabel}
        </span>
      </button>
    ) : null;

  const renderContinue = (className: string): ReactElement => (
    <button
      type="button"
      onClick={continueDisabled || isLoading ? undefined : onContinue}
      disabled={continueDisabled || isLoading}
      className={`flex items-center justify-center gap-2 rounded-[8.75px] transition-colors ${
        !continueDisabled || isLoading
          ? "bg-[#93161e] hover:bg-[#7a1319] cursor-pointer"
          : "bg-[#e5e5e6] cursor-not-allowed"
      } ${isLoading ? "cursor-not-allowed" : ""} ${className}`}
    >
      {continueContent ? (
        continueContent
      ) : isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin text-white" />
          <span className="font-['Mulish',sans-serif] text-[14px] font-normal leading-[21px] text-white">
            {resolvedLoadingLabel}
          </span>
        </>
      ) : (
        <>
          <span
            className={`font-['Mulish',sans-serif] text-[14px] font-normal leading-[21px] ${
              continueDisabled ? "text-[#5a6b7d]" : "text-white"
            }`}
          >
            {continueLabel}
          </span>
          {!hideContinueArrow ? (
            <ArrowRight
              className={`size-4 ${continueDisabled ? "text-[#5a6b7d]" : "text-white"}`}
            />
          ) : null}
        </>
      )}
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)]">
      {/* Mobile — stacked Figma layout */}
      <div className="mx-auto flex w-full flex-col items-start gap-2 px-4 py-3 sm:px-5 lg:hidden">
        {nextLabel ? (
          <NextLabel
            nextLabel={nextLabel}
            canClickNext={canClickNext}
            onNextClick={onNextClick}
            className="underline underline-offset-2"
          />
        ) : null}
        <div className="flex w-full items-center gap-3">
          {showPrevious ? renderPrevious("h-11 w-full flex-1") : null}
          {beforeContinue ? <div className="w-full flex-1">{beforeContinue}</div> : null}
          {renderContinue("h-11 w-full flex-1")}
        </div>
      </div>

      {/* Desktop — original horizontal layout */}
      <div className="mx-auto hidden h-16 w-full max-w-[1440px] items-center justify-between px-[60px] xl:px-[120px] lg:flex">
        {showPrevious ? (
          renderPrevious("h-9 w-[180px]")
        ) : (
          <div className="h-9 w-[180px]" aria-hidden="true" />
        )}

        <div className="flex items-center gap-3">
          {nextLabel ? (
            <NextLabel
              nextLabel={nextLabel}
              canClickNext={canClickNext}
              onNextClick={onNextClick}
            />
          ) : null}
          {beforeContinue}
          {renderContinue("h-9 w-[180px]")}
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepFooter;
