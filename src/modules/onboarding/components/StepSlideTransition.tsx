import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import { STEPS } from "../flow/config/steps";
import type { Step } from "../types/onboarding-types";

export type StepSlideDirection = "forward" | "backward";

const FADE_DURATION_MS = 300;

const StepFooterLockContext = createContext(false);

export const useOnboardingFooterLocked = (): boolean => useContext(StepFooterLockContext);

const STEP_ID_ALIASES: Record<string, string> = {
  "document-upload": "upload-documents",
};

const normalizeStepId = (step: string): string => STEP_ID_ALIASES[step] ?? step;

const indexInSequence = (step: string, sequence: string[]): number =>
  sequence.findIndex((item) => normalizeStepId(item) === normalizeStepId(step));

const ENTRY_ANIMATION_STEPS: Step[] = [
  "entity-details",
  "huf-entity-details",
  "business-category",
  "onboarding-method",
  "verify-contact",
  "aprn-verification",
  "otp-verification",
];

export const shouldAnimateEntryTransition = (fromStep: Step, toStep: Step): boolean =>
  ENTRY_ANIMATION_STEPS.includes(fromStep) && ENTRY_ANIMATION_STEPS.includes(toStep);

export const resolveStepSlideDirection = (
  fromStep: Step,
  toStep: Step,
  flowSteps: string[] = [],
): StepSlideDirection => {
  const sequence = flowSteps.length > 0 ? flowSteps : STEPS;
  const fromIndex = indexInSequence(fromStep, sequence);
  const toIndex = indexInSequence(toStep, sequence);

  if (fromIndex !== -1 && toIndex !== -1) {
    return toIndex >= fromIndex ? "forward" : "backward";
  }

  const fallbackFrom = indexInSequence(fromStep, STEPS);
  const fallbackTo = indexInSequence(toStep, STEPS);

  if (fallbackFrom === -1 || fallbackTo === -1) {
    return "forward";
  }

  return fallbackTo >= fallbackFrom ? "forward" : "backward";
};

type StepSlideTransitionProps = {
  stepKey: string;
  direction: StepSlideDirection;
  enabled?: boolean;
  children: ReactNode;
};

type Phase = "idle" | "preload" | "out" | "in";

const motionClassFor = (phase: Phase, direction: StepSlideDirection): string => {
  if (phase === "out") {
    return direction === "backward"
      ? "onboarding-step-fade-out-back"
      : "onboarding-step-fade-out";
  }

  if (phase === "in") {
    return direction === "backward"
      ? "onboarding-step-fade-in-back"
      : "onboarding-step-fade-in";
  }

  return "";
};

const hasStepSkeleton = (node: HTMLElement | null): boolean =>
  Boolean(node?.querySelector("[data-onboarding-skeleton]"));

const StepSlideTransition = ({
  stepKey,
  direction,
  enabled = true,
  children,
}: StepSlideTransitionProps): ReactElement => {
  const activeKeyRef = useRef(stepKey);
  const visibleRef = useRef<ReactNode>(children);
  const incomingRef = useRef<HTMLDivElement>(null);
  const [frozenOutgoing, setFrozenOutgoing] = useState<ReactNode>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [motionDirection, setMotionDirection] = useState<StepSlideDirection>(direction);

  let phaseNow = phase;
  let outgoingNow = frozenOutgoing;
  let directionNow = motionDirection;

  if (activeKeyRef.current !== stepKey) {
    if (enabled) {
      outgoingNow = visibleRef.current;
      phaseNow = "preload";
      directionNow = direction;
      setFrozenOutgoing(outgoingNow);
      setPhase("preload");
      setMotionDirection(direction);
    } else {
      outgoingNow = null;
      phaseNow = "idle";
      if (phase !== "idle") {
        setFrozenOutgoing(null);
        setPhase("idle");
      }
    }
    activeKeyRef.current = stepKey;
  }

  const showOutgoing = phaseNow === "preload" || phaseNow === "out";
  const hideIncoming = showOutgoing;
  visibleRef.current = showOutgoing ? outgoingNow : children;

  useLayoutEffect(() => {
    if (phase !== "preload") {
      return;
    }

    if (!hasStepSkeleton(incomingRef.current)) {
      setPhase("out");
    }
  }, [phase, children]);

  useEffect(() => {
    if (phase !== "out") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFrozenOutgoing(null);
      setPhase("in");
    }, FADE_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [phase, stepKey]);

  useEffect(() => {
    if (phase !== "in") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPhase("idle");
    }, FADE_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [phase]);

  return (
    <div className="relative w-full min-w-0">
      {showOutgoing ? (
        <StepFooterLockContext.Provider value={false}>
          <div className={`w-full min-w-0 ${motionClassFor(phaseNow, directionNow)}`}>
            {outgoingNow}
          </div>
        </StepFooterLockContext.Provider>
      ) : null}

      <StepFooterLockContext.Provider value={hideIncoming}>
        <div
          className={
            hideIncoming
              ? "pointer-events-none absolute inset-0 overflow-hidden opacity-0"
              : `w-full min-w-0 ${motionClassFor(phaseNow, directionNow)}`
          }
          ref={incomingRef}
        >
          {children}
        </div>
      </StepFooterLockContext.Provider>
    </div>
  );
};

export default StepSlideTransition;
