import type { ReactElement } from "react";
import { TrendingUp, UserRound, Users } from "lucide-react";

const heroStats = [
  { label: "27k+ Clients", Icon: Users },
  { label: "5k+ Distributors", Icon: UserRound },
  { label: "₹50,000 Cr AUM", Icon: TrendingUp },
] as const;

const OnboardingHero = (): ReactElement => {
  return (
    <section className="max-w-[610px] space-y-8">
      <div className="flex flex-col">
        <h1 className="font-['Mulish',sans-serif] text-[40px] font-semibold leading-[43.7px] tracking-[-0.95px] text-[var(--color-onboarding-heading-strong)]">
          <span>Grow Your </span>
          <span className="text-[var(--color-onboarding-accent)]">Practice </span>
          <br />
          <span className="text-[var(--color-onboarding-accent)]">Partner </span>
          <span>with us</span>
        </h1>

        <div className="mt-4 h-[2px] w-10 shrink-0 rounded-full bg-[var(--color-onboarding-accent)]" />

        <p className="max-w-[600px] pt-5 font-['Mulish',sans-serif] text-[15px] font-semibold leading-[22.5px] tracking-normal text-[#435160]">
          Join thousands of distributors earning more with a trusted fund house. Empanel in
          <br />
          minutes - go live in days.
        </p>
      </div>

      <div className="flex flex-wrap gap-5">
        {heroStats.map(({ label, Icon }) => (
          <div className="flex flex-col items-center gap-[7px]" key={label}>
            <div className="flex size-[35px] items-center justify-center rounded-[10px] border border-[var(--color-onboarding-accent)] bg-[#fff0e5]">
              <Icon className="size-4 text-[var(--color-onboarding-accent)]" />
            </div>
            <p className="text-center text-xs text-[var(--color-onboarding-muted)]">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OnboardingHero;
