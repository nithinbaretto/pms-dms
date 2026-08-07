import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "../../../../shared/ui/button";
import { BRANCH_OPTIONS, MOCK_GST_RECORDS } from "./constants";
import type { BusinessDetailsMode, GstRecord } from "./types";
import AddGstModal from "./modals/AddGstModal";
import BranchSelectionSection from "./sections/BranchSelectionSection";
import GstSelectionSection from "./sections/GstSelectionSection";

type BusinessDetailsStepProps = {
  onBack: () => void;
  onContinue: () => void;
  mode?: BusinessDetailsMode;
};

const BusinessDetailsStep = ({
  onBack,
  onContinue,
  mode = "selection",
}: BusinessDetailsStepProps): ReactElement => {
  const resolvedMode = useMemo<BusinessDetailsMode>(() => {
    if (typeof window === "undefined") {
      return mode;
    }

    const modeFromQuery = new URLSearchParams(window.location.search).get(
      "businessDetailsMode",
    );

    if (modeFromQuery === "empty" || modeFromQuery === "selection") {
      return modeFromQuery;
    }

    return mode;
  }, [mode]);

  const [records, setRecords] = useState<GstRecord[]>(
    resolvedMode === "selection" ? MOCK_GST_RECORDS : [],
  );
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isAddGstModalOpen, setIsAddGstModalOpen] = useState(true);

  const canContinue = useMemo(() => {
    const hasAtLeastOneSelection = records.some((record) => record.selected);
    return hasAtLeastOneSelection && selectedBranch.length > 0;
  }, [records, selectedBranch]);

  return (
    <>
      <div className="mx-auto w-full max-w-[1240px] space-y-3 pb-28 lg:pb-24">
        <section className="space-y-3">
          <header className="space-y-1">
            <h1 className="text-[22px] font-semibold leading-[33px] text-[#231f20]">Business Details</h1>
            {resolvedMode === "selection" ? (
              <p className="text-[15px] leading-[22.5px] text-[#435160]">
                Your details have been fetched from APMI. Fields shown in grey cannot be changed
              </p>
            ) : null}
          </header>

          <div className="flex items-center justify-between text-xs leading-[18px] text-[#231f20]">
            <span>Step 2 of 6</span>
            <span>20%</span>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#f0f0f0] bg-[#f9f9f9] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)]">
          <div className="h-2 w-full rounded-full bg-[#e6e7e8]">
            <div className="h-full w-[35.5%] rounded-r-full bg-[#37b400]" />
          </div>

          <div className="space-y-5 px-4 pb-4 pt-6 md:px-6 md:pb-6">
            <GstSelectionSection
              mode={records.length > 0 ? "selection" : "empty"}
              onOpenAddGst={() => {
                setIsAddGstModalOpen(true);
              }}
              onSelectAll={() => {
                setRecords((current) => current.map((record) => ({ ...record, selected: true })));
              }}
              onToggleRecord={(id) => {
                setRecords((current) =>
                  current.map((record) =>
                    record.id === id ? { ...record, selected: !record.selected } : record,
                  ),
                );
              }}
              records={records}
            />

            <div className="h-px bg-[#e5e5e6]" />

            <BranchSelectionSection
              onSelectBranch={setSelectedBranch}
              options={BRANCH_OPTIONS}
              selectedBranch={selectedBranch}
            />
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-2 px-6 py-2 sm:items-end lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:px-[120px]">
          <Button
            className="h-9 w-full rounded-[8px] border border-[#eeeeee] bg-white px-[21px] py-[7px] text-[14px] font-normal text-[#435160] hover:bg-white sm:w-[180px]"
            onClick={onBack}
            type="button"
            variant="outline"
          >
            Previous
          </Button>

          <div className="flex w-full flex-col items-start gap-2 sm:items-end lg:w-auto lg:flex-row lg:items-center lg:gap-6">
            <p className="text-[13px] leading-[19.5px] text-[#5a6b7d]">Next: Bank Details</p>
            <Button
              className="h-9 w-full rounded-[8.75px] bg-[#93161e] px-[21px] py-2 text-[14px] font-normal text-white hover:bg-[#7f141a] sm:w-[180px] disabled:bg-[#e5e5e6] disabled:text-[#5a6b7d]"
              disabled={!canContinue}
              onClick={onContinue}
              type="button"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AddGstModal
        onOpenChange={setIsAddGstModalOpen}
        open={isAddGstModalOpen}
      />
    </>
  );
};

export default BusinessDetailsStep;