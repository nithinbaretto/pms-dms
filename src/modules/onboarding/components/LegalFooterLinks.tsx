import type { ReactElement } from "react";

const legalLinks = ["Privacy Policy", "Legal Terms"] as const;

const LegalFooterLinks = (): ReactElement => {
  return (
    <nav aria-label="Legal" className="flex items-center gap-12">
      {legalLinks.map((label) => (
        <button
          className="inline-flex items-center whitespace-nowrap align-middle font-['Inter',sans-serif] text-[11px] font-normal uppercase leading-4 tracking-[1px] text-[#71859B]"
          key={label}
          type="button"
        >
          {label}
        </button>
      ))}
    </nav>
  );
};

export default LegalFooterLinks;
