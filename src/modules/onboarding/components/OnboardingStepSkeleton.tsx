import type { ReactElement } from "react";

import { Skeleton } from "../../../shared/ui/skeleton";

type OnboardingStepSkeletonProps = {
  title: string;
  subtitle?: string;
  stepLabel: string;
  progressPercent: number;
  fieldRows?: number;
  showFooter?: boolean;
  showPrevious?: boolean;
  nextLabel?: string;
};

type OnboardingContentSkeletonProps = {
  sections?: number;
};

const FieldRowSkeleton = (): ReactElement => (
  <div className="space-y-1.5">
    <Skeleton className="h-3 w-24 bg-[#e5e5e6]" />
    <Skeleton className="h-9 w-full rounded-[8px] bg-[#e5e5e6]" />
  </div>
);

export const OnboardingContentSkeleton = ({
  sections = 3,
}: OnboardingContentSkeletonProps): ReactElement => (
  <div className="space-y-5">
    {Array.from({ length: sections }).map((_, sectionIndex) => (
      <div className="space-y-3" key={`section-${sectionIndex}`}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36 bg-[#e5e5e6]" />
          <Skeleton className="h-4 w-12 bg-[#e5e5e6]" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
          {Array.from({ length: 4 }).map((__, fieldIndex) => (
            <FieldRowSkeleton key={`section-${sectionIndex}-field-${fieldIndex}`} />
          ))}
        </div>
        {sectionIndex < sections - 1 ? <div className="h-px bg-[#e5e5e6]" /> : null}
      </div>
    ))}
  </div>
);

const OnboardingStepSkeleton = ({
  title,
  subtitle,
  stepLabel,
  progressPercent,
  fieldRows = 6,
  showFooter = true,
  showPrevious = true,
  nextLabel,
}: OnboardingStepSkeletonProps): ReactElement => {
  const clampedProgress = Math.min(100, Math.max(0, progressPercent));

  return (
    <>
      <div className="mx-auto w-full max-w-[1240px] space-y-3 pb-28 lg:pb-24">
        <section className="space-y-3">
          <header className="space-y-1">
            <h1 className="text-[22px] font-semibold leading-[33px] text-[#231f20]">{title}</h1>
            {subtitle ? (
              <p className="text-[15px] leading-[22.5px] text-[#435160]">{subtitle}</p>
            ) : (
              <Skeleton className="h-4 w-[70%] max-w-[520px] bg-[#e5e5e6]" />
            )}
          </header>

          <div className="flex items-center justify-between text-xs leading-[18px] text-[#231f20]">
            <span>{stepLabel}</span>
            <span>{clampedProgress}%</span>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#f0f0f0] bg-[#f9f9f9] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)]">
          <div className="h-2 w-full bg-[#e6e7e8]">
            <div
              className="h-full rounded-r-full bg-[#37b400]"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>

          <div className="space-y-5 p-4 md:p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-36 bg-[#e5e5e6]" />
              <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
                {Array.from({ length: Math.min(fieldRows, 4) }).map((_, index) => (
                  <FieldRowSkeleton key={`top-${index}`} />
                ))}
              </div>
            </div>

            <div className="h-px bg-[#e5e5e6]" />

            <div className="space-y-3">
              <Skeleton className="h-4 w-28 bg-[#e5e5e6]" />
              <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
                {Array.from({ length: Math.min(Math.max(fieldRows - 2, 2), 4) }).map((_, index) => (
                  <FieldRowSkeleton key={`mid-${index}`} />
                ))}
              </div>
            </div>

            <div className="h-px bg-[#e5e5e6]" />

            <div className="space-y-3">
              <Skeleton className="h-4 w-32 bg-[#e5e5e6]" />
              <Skeleton className="h-20 w-full rounded-[8px] bg-[#e5e5e6]" />
              <Skeleton className="h-20 w-full rounded-[8px] bg-[#e5e5e6]" />
            </div>
          </div>
        </section>
      </div>

      {showFooter ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)]">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-2 px-6 py-2 sm:items-end lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:px-[120px]">
            {showPrevious ? (
              <Skeleton className="h-9 w-full rounded-[8px] bg-[#e5e5e6] sm:w-[180px]" />
            ) : (
              <div className="hidden h-9 w-[180px] lg:block" aria-hidden="true" />
            )}
            <div className="flex w-full flex-col items-start gap-2 sm:items-end lg:w-auto lg:flex-row lg:items-center lg:gap-6">
              {nextLabel ? (
                <p className="text-[13px] leading-[19.5px] text-[#5a6b7d]">Next: {nextLabel}</p>
              ) : (
                <Skeleton className="h-4 w-28 bg-[#e5e5e6]" />
              )}
              <Skeleton className="h-9 w-full rounded-[8.75px] bg-[#e5e5e6] sm:w-[180px]" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default OnboardingStepSkeleton;
