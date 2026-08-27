import type { ReactElement } from "react";
import { Plus } from "lucide-react";

import editIcon from "../../../../../assets/icons/edit_icon.png";
import trashIcon from "../../../../../assets/icons/svg/trash_icon.svg";
import noKartaImg from "../../../../../assets/images/no_karta.png";
import KartaPersonAvatar from "../components/KartaPersonAvatar";
import { HUF_ENTITY_DETAILS_COPY } from "../constants";
import type { CoparcenerDetails } from "../types";

type CoparcenerDetailsSectionProps = {
  coparceners: CoparcenerDetails[];
  onAdd: () => void;
  onEdit: (coparcener: CoparcenerDetails) => void;
  onRemove: (id: string) => void;
};

const CoparcenerDetailsSection = ({
  coparceners,
  onAdd,
  onEdit,
  onRemove,
}: CoparcenerDetailsSectionProps): ReactElement => {
  const copy = HUF_ENTITY_DETAILS_COPY.coparcener;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[860px]">
          <h2 className="font-['Mulish',sans-serif] text-[16px] font-medium leading-6 tracking-normal text-[#231F20]">
            {copy.title}
          </h2>
          <p className="mt-1 font-['Mulish',sans-serif] text-[12px] font-medium leading-none tracking-normal text-[#435160]">
            {copy.description}
          </p>
        </div>

        <button
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[8px] border border-[#93161E] px-[21px] py-[7px] font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#93161E]"
          onClick={onAdd}
          type="button"
        >
          <Plus className="size-4" strokeWidth={2.25} />
          {copy.addLabel}
        </button>
      </div>

      {coparceners.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {coparceners.map((coparcener) => (
            <div
              className="flex w-full max-w-[412px] items-center gap-3 rounded-[8px] border border-[#EEEEEE] bg-white px-3 py-3"
              key={coparcener.id}
            >
              <KartaPersonAvatar />
              <div className="min-w-0 flex-1">
                <p className="font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#435160]">
                  {coparcener.name}
                </p>
                <p className="mt-1 font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#5A6B7D]">
                  {coparcener.pan} | {coparcener.relationship}
                </p>
              </div>
              <button
                aria-label={`Edit ${coparcener.name}`}
                className="flex size-4 shrink-0 items-center justify-center hover:opacity-70"
                onClick={() => {
                  onEdit(coparcener);
                }}
                type="button"
              >
                <img alt="" className="size-4" src={editIcon} />
              </button>
              <button
                aria-label={`Remove ${coparcener.name}`}
                className="flex size-4 shrink-0 items-center justify-center hover:opacity-70"
                onClick={() => {
                  onRemove(coparcener.id);
                }}
                type="button"
              >
                <img alt="" className="size-4" src={trashIcon} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 py-8 text-center">
          <img alt="" className="h-[66px] w-[108px] object-contain" src={noKartaImg} />
          <div className="space-y-1.5">
            <p className="font-['Mulish',sans-serif] text-[16px] font-medium leading-6 text-[#231F20]">
              {copy.emptyTitle}
            </p>
            <p className="max-w-[440px] font-['Mulish',sans-serif] text-[13px] font-normal leading-[19.5px] text-[#71859B]">
              {copy.emptyDescription}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default CoparcenerDetailsSection;
