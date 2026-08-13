import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-[8px] border border-[#eeeeee] bg-white px-[14px] py-0 font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#231f20] shadow-none outline-none transition-[color,box-shadow] placeholder:text-[#71859b]",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "focus-visible:border-[var(--color-onboarding-primary)] focus-visible:ring-2 focus-visible:ring-[rgba(147,22,30,0.2)] focus-visible:ring-offset-0",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#f5f6f8] disabled:opacity-100",
        "aria-invalid:border-[var(--color-onboarding-danger)] aria-invalid:ring-[rgba(232,64,47,0.2)]",
        "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#ffffff] [&:-webkit-autofill]:[-webkit-text-fill-color:#231f20]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
