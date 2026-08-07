import type { ReactElement } from "react";
import { Building2, CalendarDays, IdCard, ShieldUser, UserRound } from "lucide-react";

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
};

const iconWrapClass =
  "flex h-8 w-8 items-center justify-center rounded-[9.846px] bg-[var(--color-onboarding-accent)] text-white";

const valueClass = "text-sm font-semibold leading-[21px] text-[#231f20]";
const labelClass = "text-xs leading-[18px] text-[var(--color-onboarding-heading)]";

const EntitySummarySection = ({
  summary,
  entityTypeOptions,
  onEntityTypeSelect,
}: EntitySummarySectionProps): ReactElement => {
  const canSelectEntityType = !summary.entityTypeLocked;

  return (
    <section>
      <div className="rounded-lg bg-[#f5f5f5] p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="flex items-center gap-3 rounded-lg">
            <span className={iconWrapClass}>
              <UserRound className="h-4 w-4" />
            </span>
            <div>
              <p className={labelClass}>Name</p>
              <p className={valueClass}>{summary.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg">
            <span className={iconWrapClass}>
              <IdCard className="h-4 w-4" />
            </span>
            <div>
              <p className={labelClass}>PAN</p>
              <p className={valueClass}>{summary.pan}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg">
            <span className={iconWrapClass}>
              <CalendarDays className="h-4 w-4" />
            </span>
            <div>
              <p className={labelClass}>Date of Birth</p>
              <p className={valueClass}>{summary.dob}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg">
            <span className={iconWrapClass}>
              <ShieldUser className="h-4 w-4" />
            </span>
            <div>
              <p className={labelClass}>APRN</p>
              <p className={valueClass}>{summary.aprn}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg">
            <span className={iconWrapClass}>
              <Building2 className="h-4 w-4" />
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
                  <SelectTrigger className="h-8 min-w-[168px] border-[#d9d9d9] bg-white text-sm text-[#231f20]">
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
