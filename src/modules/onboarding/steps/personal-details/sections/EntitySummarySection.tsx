import type { ReactElement } from "react";

import aprnIcon from "../../../../../assets/icons/aprn_icon.png";
import dobIcon from "../../../../../assets/icons/dob_icon.png";
import entityTypeIcon from "../../../../../assets/icons/entity_type_icon.png";
import nameIcon from "../../../../../assets/icons/name_icon.png";
import panIcon from "../../../../../assets/icons/pan_icon.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../shared/ui/select";
import type { EntitySummary, EntityType } from "../types";

type EntitySummarySectionProps = {
  summary: EntitySummary;
  entityTypeOptions: EntityType[];
  onEntityTypeSelect: (value: EntityType) => void;
  /** AIF ARN journey shows ARN instead of APRN. */
  showArn?: boolean;
  /** KRA journey has no APRN/ARN — hide the registration number. */
  showRegistration?: boolean;
};

const iconWrapClass =
  "flex size-[32px] shrink-0 items-center justify-center rounded-[9.846px] bg-[#C7AA7B]";

const labelClass =
  "font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-[#435160]";
const valueClass =
  "font-['Mulish',sans-serif] text-[12px] font-medium leading-none tracking-normal text-[#231F20]";

const EntitySummarySection = ({
  summary,
  entityTypeOptions,
  onEntityTypeSelect,
  showArn = false,
  showRegistration = true,
}: EntitySummarySectionProps): ReactElement => {
  const canSelectEntityType = !summary.entityTypeLocked;
  const registrationLabel = showArn ? "ARN" : "APRN";
  const registrationValue = showArn ? summary.arn : summary.aprn;

  return (
    <section>
      <div className="rounded-lg bg-[#f5f5f5] p-4">
        <div
          className={
            showRegistration
              ? "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5"
              : "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
          }
        >
          <div className="flex items-center gap-3 rounded-lg">
            <span className={iconWrapClass}>
              <img alt="" className="size-[18px]" src={nameIcon} />
            </span>
            <div>
              <p className={labelClass}>Name</p>
              <p className={valueClass}>{summary.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg">
            <span className={iconWrapClass}>
              <img alt="" className="size-[18px]" src={panIcon} />
            </span>
            <div>
              <p className={labelClass}>PAN</p>
              <p className={valueClass}>{summary.pan}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg">
            <span className={iconWrapClass}>
              <img alt="" className="size-[18px]" src={dobIcon} />
            </span>
            <div>
              <p className={labelClass}>Date of Birth</p>
              <p className={valueClass}>{summary.dob}</p>
            </div>
          </div>

          {showRegistration ? (
            <div className="flex items-center gap-3 rounded-lg">
              <span className={iconWrapClass}>
                <img alt="" className="size-[18px]" src={aprnIcon} />
              </span>
              <div>
                <p className={labelClass}>{registrationLabel}</p>
                <p className={valueClass}>{registrationValue}</p>
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-3 rounded-lg">
            <span className={iconWrapClass}>
              <img alt="" className="size-[18px]" src={entityTypeIcon} />
            </span>
            <div className="w-full">
              <p className={labelClass}>Entity Type</p>
              {canSelectEntityType ? (
                <Select
                  onValueChange={(value) => {
                    onEntityTypeSelect(value as EntityType);
                  }}
                  value={summary.entityType}
                >
                  <SelectTrigger className="h-8 min-w-[168px] border-[#d9d9d9] bg-white font-['Mulish',sans-serif] text-[12px] font-medium leading-none tracking-normal text-[#231F20]">
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className={valueClass}>{summary.entityType}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EntitySummarySection;
