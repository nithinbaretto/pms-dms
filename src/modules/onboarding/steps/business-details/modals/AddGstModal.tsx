import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  Copy,
  FileText,
  Plus,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";

import { Button } from "../../../../../shared/ui/button";
import { Dialog, DialogContent } from "../../../../../shared/ui/dialog";
import guidlinesImg1 from "../../../../../assets/images/guidlines_img_1.png";
import guidlinesImg2 from "../../../../../assets/images/guidlines_img_2.png";
import guidlinesImg3 from "../../../../../assets/images/guidlines_img_3.png";
import guidlinesImg4 from "../../../../../assets/images/guidlines_img_4.png";

type AddGstModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AddGstFlowState =
  | "initial-fetch"
  | "single-card"
  | "single-card-with-fetch"
  | "multi-card"
  | "manual-upload-empty"
  | "manual-upload-filled";

type AddedGst = {
  id: string;
  gstNumber: string;
  stateCode: string;
  legalName: string;
};

const INITIAL_GST = "29ABCDE0000B2X6";

const DEFAULT_CARD: AddedGst = {
  id: "gst-primary",
  gstNumber: "27AAAAA0000A1Z5",
  stateCode: "MH",
  legalName: "Nexus Private Limited",
};

const SECOND_CARD: AddedGst = {
  id: "gst-secondary",
  gstNumber: "27AAAAA0000A1Z5",
  stateCode: "MH",
  legalName: "Nexus Private Limited",
};

const GuidanceCard = ({
  label,
  status,
  statusColor,
  borderColor,
  imageSrc,
}: {
  label: string;
  status: string;
  statusColor: string;
  borderColor: string;
  imageSrc: string;
}): ReactElement => {
  return (
    <div className="space-y-1">
      <div className={`h-[112px] rounded-[4px] border bg-white p-1 ${borderColor}`}>
        <img alt={label} className="h-full w-full rounded-[2px] object-cover" src={imageSrc} />
      </div>
      <div className={`flex items-center justify-center gap-1 text-[10px] ${statusColor}`}>
        {statusColor.includes("green") ? (
          <CheckCircle2 className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        {status}
      </div>
    </div>
  );
};

const GstItemCard = ({
  item,
  showCopy,
  onCopy,
  onDelete,
}: {
  item: AddedGst;
  showCopy: boolean;
  onCopy?: () => void;
  onDelete?: () => void;
}): ReactElement => {
  return (
    <div className="flex min-h-[72px] items-start justify-between rounded-[8px] border border-[#d8787d] bg-[#fffaf6] px-3 py-2.5">
      <div className="flex min-w-0 items-start gap-2">
        <div className="mt-1 h-[14px] w-[14px] rounded-[3.5px] border-2 border-[#93161e] bg-[#93161e]" />
        <div className="min-w-0">
          <p className="truncate text-[13px] leading-[19px] text-[#231f20]">{`${item.gstNumber} | ${item.stateCode}`}</p>
          <p className="mt-1 text-[11px] leading-[16.5px] text-[#71859b]">{item.legalName}</p>
        </div>
      </div>

      <div className="ml-3 flex items-center gap-2 text-[#9a9a9a]">
        {showCopy ? (
          <button onClick={onCopy} type="button">
            <Copy className="h-4 w-4" />
          </button>
        ) : null}
        <button onClick={onDelete} type="button">
          <Trash2 className="h-4 w-4 text-[#d8787d]" />
        </button>
      </div>
    </div>
  );
};

const AddGstModal = ({ open, onOpenChange }: AddGstModalProps): ReactElement => {
  const initialStateFromQuery = useMemo<AddGstFlowState>(() => {
    if (typeof window === "undefined") {
      return "initial-fetch";
    }

    const modeFromQuery = new URLSearchParams(window.location.search).get("addGstMode");

    if (
      modeFromQuery === "initial-fetch" ||
      modeFromQuery === "single-card" ||
      modeFromQuery === "single-card-with-fetch" ||
      modeFromQuery === "multi-card" ||
      modeFromQuery === "manual-upload-empty" ||
      modeFromQuery === "manual-upload-filled"
    ) {
      return modeFromQuery;
    }

    return "manual-upload-empty";
  }, []);

  const [flowState, setFlowState] = useState<AddGstFlowState>(initialStateFromQuery);
  const [gstNumber, setGstNumber] = useState(INITIAL_GST);
  const [addedGsts, setAddedGsts] = useState<AddedGst[]>([DEFAULT_CARD]);
  const [uploadedGstCertificate, setUploadedGstCertificate] = useState<{
    name: string;
    type: string;
    previewUrl: string;
  } | null>(null);
  const gstCertificateInputRef = useRef<HTMLInputElement | null>(null);

  const isManualFlow =
    flowState === "manual-upload-empty" || flowState === "manual-upload-filled";
  const isLargeModal = isManualFlow;

  useEffect(() => {
    return () => {
      if (uploadedGstCertificate?.previewUrl) {
        URL.revokeObjectURL(uploadedGstCertificate.previewUrl);
      }
    };
  }, [uploadedGstCertificate]);

  const clearUploadedGstCertificate = (nextFlowState: AddGstFlowState = "manual-upload-empty"): void => {
    if (uploadedGstCertificate?.previewUrl) {
      URL.revokeObjectURL(uploadedGstCertificate.previewUrl);
    }

    setUploadedGstCertificate(null);
    if (gstCertificateInputRef.current) {
      gstCertificateInputRef.current.value = "";
    }
    setFlowState(nextFlowState);
  };

  const resetModal = (): void => {
    setAddedGsts([DEFAULT_CARD]);
    setGstNumber(INITIAL_GST);
    clearUploadedGstCertificate(initialStateFromQuery);
  };

  const handleGstCertificateUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (uploadedGstCertificate?.previewUrl) {
      URL.revokeObjectURL(uploadedGstCertificate.previewUrl);
    }

    setUploadedGstCertificate({
      name: selectedFile.name,
      type: selectedFile.type,
      previewUrl: URL.createObjectURL(selectedFile),
    });
    setFlowState("manual-upload-filled");
  };

  const showCardsOnly = flowState === "single-card" || flowState === "multi-card";
  const showCardWithFetch = flowState === "single-card-with-fetch";

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetModal();
        }

        onOpenChange(nextOpen);
      }}
      open={open}
    >
      <DialogContent
        className={`max-h-[calc(100vh-48px)] overflow-y-auto rounded-[16px] border-0 bg-[#f9f9f9] p-0 shadow-[0px_24px_60px_rgba(0,0,0,0.2)] ${isLargeModal ? "max-w-[860px]" : "max-w-[520px]"
          }`}
      >
        <div className="p-6">
          <h3 className="text-[40px] leading-[44px] font-medium text-[#5a6b7d]">Add GST</h3>

          <div className="mt-5 space-y-4">
            {showCardsOnly || showCardWithFetch || isManualFlow ? (
              <GstItemCard
                item={addedGsts[0]}
                onCopy={() => {
                  setFlowState("single-card-with-fetch");
                }}
                onDelete={() => {
                  setAddedGsts((current) => current.slice(1));
                  setFlowState("initial-fetch");
                }}
                showCopy={showCardWithFetch || flowState === "single-card"}
              />
            ) : null}

            {flowState === "multi-card" ? (
              <GstItemCard
                item={SECOND_CARD}
                onDelete={() => {
                  setFlowState("single-card");
                }}
                showCopy={false}
              />
            ) : null}

            {showCardWithFetch || flowState === "manual-upload-empty" || flowState === "manual-upload-filled" ? (
              <div className="h-px bg-[#e5e5e6]" />
            ) : null}

            {flowState === "initial-fetch" || showCardWithFetch ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[14px] leading-[21px] text-[#435160]">
                    GST Number <span className="text-[#e2585f]">*</span>
                  </label>
                  <div className="flex h-[38px] overflow-hidden rounded-[8px] border border-[#d8787d] bg-white">
                    <input
                      className="flex-1 bg-transparent px-3 text-[13px] outline-none"
                      onChange={(event) => {
                        setGstNumber(event.target.value.toUpperCase());
                      }}
                      value={gstNumber}
                    />
                    <button
                      className="m-[5px] h-[28px] rounded-[4px] bg-[#aa1722] px-3 text-[12px] leading-[18px] text-white"
                      onClick={() => {
                        if (showCardWithFetch) {
                          setFlowState("manual-upload-empty");
                          return;
                        }

                        setFlowState("single-card");
                      }}
                      type="button"
                    >
                      Fetch
                    </button>
                  </div>
                </div>

                <Button
                  className="h-[42px] w-full rounded-[8px] bg-[#d9d9d9] text-[14px] leading-[21px] text-[#71859b] hover:bg-[#d9d9d9]"
                  disabled
                  type="button"
                >
                  Save & Update
                </Button>
              </div>
            ) : null}

            {flowState === "single-card" || flowState === "multi-card" ? (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="h-[42px] rounded-[8px] border border-[#e5e5e6] bg-white text-[14px] leading-[21px] text-[#5a6b7d] hover:bg-white"
                  onClick={() => {
                    setAddedGsts([DEFAULT_CARD, SECOND_CARD]);
                    setFlowState("multi-card");
                  }}
                  type="button"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" /> Add Another GST
                </Button>

                <Button
                  className="h-[42px] rounded-[8px] bg-[#aa1722] text-[14px] leading-[21px] text-white hover:bg-[#93161e]"
                  onClick={() => {
                    onOpenChange(false);
                    resetModal();
                  }}
                  type="button"
                >
                  Save & Update
                </Button>
              </div>
            ) : null}

            {isManualFlow ? (
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[14px] leading-[21px] text-[#435160]">
                    GST Number <span className="text-[#e2585f]">*</span>
                  </label>
                  <div className="flex h-[38px] overflow-hidden rounded-[8px] border border-[#d8787d] bg-white">
                    <input className="flex-1 bg-transparent px-3 text-[13px] outline-none" value={gstNumber} />
                    <button className="m-[5px] h-[28px] rounded-[4px] bg-[#dce2ea] px-3 text-[12px] leading-[18px] text-[#7a8796]" type="button">
                      Fetch
                    </button>
                  </div>
                  <p className="text-[13px] text-[#ff5e57]">Something went wrong. Enter details manually</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[14px] leading-[21px] text-[#435160]">
                      State <span className="text-[#e2585f]">*</span>
                    </label>
                    <div className="flex h-[38px] items-center justify-between rounded-[8px] border border-[#e5e5e6] bg-white px-3 text-[13px] text-[#231f20]">
                      Maharashtra
                      <ChevronDown className="h-4 w-4 text-[#8ca1b5]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[14px] leading-[21px] text-[#435160]">
                      Legal Name <span className="text-[#e2585f]">*</span>
                    </label>
                    <div className="flex h-[38px] items-center rounded-[8px] border border-[#e5e5e6] bg-white px-3 text-[13px] text-[#231f20]">
                      Nexus Private Limited
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[14px] leading-[21px] text-[#435160]">
                    Upload GST Certificate <span className="text-[#e2585f]">*</span>
                  </label>

                  <input
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                    onChange={handleGstCertificateUpload}
                    ref={gstCertificateInputRef}
                    type="file"
                  />

                  <div className="rounded-[8px] border border-dashed border-[#e5e5e6] bg-[#fbfcfd] p-4">
                    {flowState === "manual-upload-filled" ? (
                      <div className="relative mx-auto h-[220px] max-w-[420px] rounded-[4px] border border-[#4a90e2] bg-white p-2">
                        {!uploadedGstCertificate ? (
                          <div className="flex h-full items-center justify-center text-[13px] text-[#6b7d90]">Uploaded GST Certificate</div>
                        ) : uploadedGstCertificate.type === "application/pdf" ? (
                          <div className="flex h-full flex-col items-center justify-center gap-2 text-[#6b7d90]">
                            <FileText className="h-9 w-9 text-[#4a90e2]" />
                            <p className="max-w-[280px] truncate text-[13px]">{uploadedGstCertificate.name}</p>
                          </div>
                        ) : (
                          <img
                            alt="GST certificate preview"
                            className="h-full w-full rounded-[2px] object-contain"
                            src={uploadedGstCertificate?.previewUrl}
                          />
                        )}
                        <button
                          className="absolute right-2 top-2 text-[#8ca1b5]"
                          onClick={() => {
                            clearUploadedGstCertificate();
                          }}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 text-center">
                        <Upload className="mx-auto h-5 w-5 text-[#8ca1b5]" />
                        <p className="text-[13px] text-[#8ca1b5]">Format Supported: PNG, PDF or JPEG up to 2MB</p>
                        <div className="flex items-center justify-center gap-2">
                          <Button className="h-[34px] border border-[#e5e5e6] bg-white text-[13px] text-[#5a6b7d] hover:bg-white" type="button" variant="outline">
                            <Camera className="h-4 w-4" /> Capture
                          </Button>
                          <Button
                            className="h-[34px] bg-[#aa1722] text-[13px] text-white hover:bg-[#93161e]"
                            onClick={() => {
                              gstCertificateInputRef.current?.click();
                            }}
                            type="button"
                          >
                            Upload
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[14px] text-[#435160]">Upload image guidelines</p>
                  <div className="grid grid-cols-4 gap-2 rounded-[8px] bg-[#f2f4f7] p-2.5">
                    <GuidanceCard
                      borderColor="border-[#6ac15a]"
                      imageSrc={guidlinesImg1}
                      label="Clear"
                      status="Clear & Complete"
                      statusColor="text-[#44b832]"
                    />
                    <GuidanceCard
                      borderColor="border-[#f6bf95]"
                      imageSrc={guidlinesImg2}
                      label="Blurry"
                      status="Blurry / Out of focus"
                      statusColor="text-[#ff6b57]"
                    />
                    <GuidanceCard
                      borderColor="border-[#f6bf95]"
                      imageSrc={guidlinesImg3}
                      label="Half"
                      status="Half cut / Incomplete"
                      statusColor="text-[#ff6b57]"
                    />
                    <GuidanceCard
                      borderColor="border-[#f6bf95]"
                      imageSrc={guidlinesImg4}
                      label="Glare"
                      status="Poor lighting / Glare"
                      statusColor="text-[#ff6b57]"
                    />
                  </div>
                </div>

                <Button
                  className={`h-[42px] w-full rounded-[8px] text-[14px] leading-[21px] ${flowState === "manual-upload-filled"
                      ? "bg-[#aa1722] text-white hover:bg-[#93161e]"
                      : "bg-[#d9d9d9] text-[#71859b] hover:bg-[#d9d9d9]"
                    }`}
                  disabled={flowState !== "manual-upload-filled"}
                  onClick={() => {
                    onOpenChange(false);
                    resetModal();
                  }}
                  type="button"
                >
                  Continue
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGstModal;