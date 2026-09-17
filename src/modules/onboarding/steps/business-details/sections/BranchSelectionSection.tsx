import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { ChevronDown, Search } from "lucide-react";

import type { BranchOption } from "../types";
import { Popover, PopoverAnchor, PopoverContent } from "../../../../../shared/ui/popover";

type BranchSelectionSectionProps = {
  selectedBranch: string;
  options: BranchOption[];
  onSelectBranch: (value: string) => void;
};

const BranchSelectionSection = ({
  selectedBranch,
  options,
  onSelectBranch,
}: BranchSelectionSectionProps): ReactElement => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = useMemo(() => {
    return options.find((option) => option.id === selectedBranch)?.label ?? "";
  }, [options, selectedBranch]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    );
  }, [options, query]);

  const displayedValue = isOpen || query ? query : selectedLabel;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-[4px]">
        <h2 className="text-[16px] font-medium leading-[24px] tracking-normal text-[#231f20]">
          Branch Details
        </h2>
        <p className="text-[12px] font-medium leading-none tracking-normal text-[#435160]">
          Select your nearest branch for onboarding assistance and future support.
        </p>
      </div>

      <div className="max-w-[248px] space-y-1">
        <label
          className="block text-[12px] font-normal leading-none tracking-normal text-[#231f20]"
          htmlFor="business-branch"
        >
          Select Branch <span className="text-[#e8402f]">*</span>
        </label>

        <Popover onOpenChange={setIsOpen} open={isOpen}>
          <PopoverAnchor asChild>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71859B]" />
              <input
                className="h-8 w-full rounded-[8px] border border-[#E5E5E6] bg-[#FFFFFF] pl-9 pr-8 text-[14px] font-normal leading-[20px] tracking-[0px] text-[#231f20] shadow-none outline-none placeholder:text-[#71859B]"
                id="business-branch"
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  setQuery(nextQuery);
                  setIsOpen(true);
                  if (selectedBranch && nextQuery !== selectedLabel) {
                    onSelectBranch("");
                  }
                }}
                onClick={() => setIsOpen(true)}
                onFocus={() => setIsOpen(true)}
                placeholder="Search Branch"
                ref={inputRef}
                style={{ fontFamily: "Mulish" }}
                type="text"
                value={displayedValue}
              />
              <button
                aria-label="Toggle branch options"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setIsOpen((previous) => !previous)}
                type="button"
              >
                <ChevronDown className="h-4 w-4 shrink-0 text-[#71859B]" />
              </button>
            </div>
          </PopoverAnchor>

          <PopoverContent
            align="start"
            className="w-[248px] rounded-[12px] border border-[#E5E5E6] bg-[#FFFFFF] p-0 shadow-none"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <div className="hide-scrollbar max-h-[260px] overflow-y-auto py-1">
              {filteredOptions.length === 0 ? (
                <p
                  className="py-3 text-center text-[13px] text-[#71859B]"
                  style={{ fontFamily: "Mulish" }}
                >
                  No branch found.
                </p>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    className="flex h-12 w-full items-center px-4 text-left text-[14px] font-normal leading-[20px] tracking-[0px] text-[#231f20] hover:bg-[#f8fafc]"
                    key={option.id}
                    onClick={() => {
                      onSelectBranch(option.id);
                      setQuery(option.label);
                      setIsOpen(false);
                    }}
                    style={{ fontFamily: "Mulish" }}
                    type="button"
                  >
                    <span className="truncate">{option.label}</span>
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </section>
  );
};

export default BranchSelectionSection;
