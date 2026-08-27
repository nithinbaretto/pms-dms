import type { ReactElement } from "react";

import guideline1 from "../../../assets/images/proof_of_identity_guidelines_1.png";
import guideline2 from "../../../assets/images/proof_of_identity_guidelines_2.png";
import guideline3 from "../../../assets/images/proof_of_identity_guidelines_3.png";
import guideline4 from "../../../assets/images/proof_of_identity_guidelines_4.png";
import { cn } from "../../../shared/ui/utils";

type GuidelineItem = {
  src: string;
  label: string;
  good: boolean;
};

const GUIDELINE_ITEMS: GuidelineItem[] = [
  { src: guideline1, label: "Clear & Complete", good: true },
  { src: guideline2, label: "Blurry / Out of focus", good: false },
  { src: guideline3, label: "Half cut / Incomplete", good: false },
  { src: guideline4, label: "Poor lighting / Glare", good: false },
];

const StatusIcon = ({ good, size }: { good: boolean; size: number }): ReactElement => {
  const color = good ? "#37B400" : "#E8402F";

  return (
    <svg className="shrink-0" fill="none" height={size} viewBox="0 0 18 18" width={size}>
      <circle cx="9" cy="9" fill={color} r="9" />
      {good ? (
        <path
          d="M5.2 9.15 7.7 11.6 12.8 6.4"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ) : (
        <path
          d="M6.2 6.2 11.8 11.8M11.8 6.2 6.2 11.8"
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      )}
    </svg>
  );
};

const GuidelineTile = ({ src, label, good }: GuidelineItem): ReactElement => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-2 rounded-[8px] px-2 py-3 ${
        good ? "bg-[#eeffe5]" : "bg-[#fff0e5]"
      }`}
    >
      <div className="absolute left-1.5 top-1.5">
        <StatusIcon good={good} size={18} />
      </div>
      <img
        alt={label}
        className="h-[72px] w-full max-w-[188px] object-contain drop-shadow-[0px_6px_16px_rgba(0,0,0,0.12)]"
        src={src}
      />
      <div className="flex items-center gap-1">
        <StatusIcon good={good} size={14} />
        <p
          className={`font-['Mulish',sans-serif] text-[9px] font-normal leading-[1.1] whitespace-nowrap ${
            good ? "text-[#37b400]" : "text-[#e8402f]"
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

type UploadImageGuidelinesProps = {
  className?: string;
  showTitle?: boolean;
};

const UploadImageGuidelines = ({
  className,
  showTitle = true,
}: UploadImageGuidelinesProps): ReactElement => {
  return (
    <div className={cn("flex w-full flex-col gap-[11px]", className)}>
      {showTitle ? (
        <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-[18px] text-[#231F20]">
          Upload image guidelines
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-4">
        {GUIDELINE_ITEMS.map((item) => (
          <GuidelineTile key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
};

export default UploadImageGuidelines;
