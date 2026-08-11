import type { ChangeEvent, KeyboardEvent, ReactElement } from "react";
import { useMemo, useRef } from "react";

import { cn } from "../../../shared/ui/utils";

type OtpInputProps = {
  value: string;
  length?: number;
  onChange: (nextValue: string) => void;
  containerClassName?: string;
  inputClassName?: string;
};

const OtpInput = ({
  value,
  length = 6,
  onChange,
  containerClassName,
  inputClassName,
}: OtpInputProps): ReactElement => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const characters = useMemo(() => {
    const base = value.split("").slice(0, length);

    while (base.length < length) {
      base.push("");
    }

    return base;
  }, [length, value]);

  const updateIndex = (index: number, next: string): void => {
    const normalized = next.replace(/\D/g, "").slice(-1);
    const nextChars = [...characters];
    nextChars[index] = normalized;
    onChange(nextChars.join(""));

    if (normalized && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (event.key === "Backspace" && !characters[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ChangeEvent<HTMLInputElement>, index: number): void => {
    const pasted = event.target.value.replace(/\D/g, "");

    if (pasted.length <= 1) {
      updateIndex(index, pasted);
      return;
    }

    const nextChars = [...characters];

    for (let i = 0; i < length; i += 1) {
      nextChars[i] = pasted[i] ?? "";
    }

    onChange(nextChars.join(""));
    inputRefs.current[Math.min(pasted.length, length) - 1]?.focus();
  };

  return (
    <div className={cn("flex w-full max-w-full items-center justify-center gap-2 sm:gap-3 lg:gap-4", containerClassName)}>
      {characters.map((character, index) => (
        <input
          className={cn(
            "h-9 w-9 shrink-0 rounded-lg border border-[#eeeeee] px-0 text-center text-xl text-[var(--color-onboarding-heading)] outline-none sm:h-10 sm:w-10 sm:text-2xl",
            "focus-visible:border-[var(--color-onboarding-primary)] focus-visible:ring-2 focus-visible:ring-[rgba(147,22,30,0.2)]",
            inputClassName,
          )}
          inputMode="numeric"
          key={index}
          maxLength={1}
          onChange={(event) => {
            handlePaste(event, index);
          }}
          onKeyDown={(event) => {
            handleKeyDown(event, index);
          }}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          value={character}
        />
      ))}
    </div>
  );
};

export default OtpInput;
