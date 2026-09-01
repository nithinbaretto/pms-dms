import type { ReactElement, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronUp, Copy, Download, Loader2, Mail, Smartphone, UserRound } from "lucide-react";

import modalSvgPaths from "../../../../assets/figma-svg/svg-kmnbjcgk4j";
import imgBgImg from "../../../../assets/images/background_img.png";
import imgSuccessTick from "../../../../assets/images/success_right_tick.png";
import imgLogo from "../../../../assets/logo.png";
import editIcon from "../../../../assets/icons/edit_icon.png";
import OnboardingStepFooter from "../../components/OnboardingStepFooter";
import { OnboardingContentSkeleton } from "../../components/OnboardingStepSkeleton";
import { onboardingApi } from "../../services/onboarding-api";
import { useOnboardingStore } from "../../state/onboarding-store";
import {
  extractFileNameFromUrl,
  resolveDocumentFormat,
  toDisplaySrc,
} from "../documents/helpers";
import { REVIEW_SECTION_LABELS } from "./constants";
import {
  displayValue,
  displayYesNo,
  fileTypeLabelFromUrl,
  formatPrimaryContact,
  primaryApplicationId,
  toGstStateCode,
  triggerPdfDownload,
} from "./helpers";
import type { CreateApplicationResponse, ReviewSectionId } from "./types";
import { useReviewSubmitFlow } from "./useReviewSubmitFlow";

type ReviewConfirmStepProps = {
  onBack: () => void;
  onEditSection: (section: ReviewSectionId) => void;
};

type ReviewDocumentCardProps = {
  label: string;
  storageUrl: string;
  isLoading: boolean;
  onView: (storageUrl: string) => void;
};

const FileTypeBadge = ({ type }: { type: string }): ReactElement => (
  <div className="relative size-[28px] shrink-0" aria-hidden>
    <svg className="size-full" fill="none" viewBox="0 0 28 28">
      <path
        d="M7 2.5h9.5L23 9v16.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4.5a2 2 0 0 1 2-2Z"
        fill="#E8402F"
      />
      <path d="M16.5 2.5V9H23" fill="#C62828" />
    </svg>
    <span className="absolute bottom-[4px] left-1/2 -translate-x-1/2 font-['Mulish',sans-serif] text-[6px] font-bold leading-none text-white uppercase">
      {type}
    </span>
  </div>
);

const EyeIcon = (): ReactElement => (
  <svg className="size-[18px] shrink-0" fill="none" viewBox="0 0 15 10" aria-hidden>
    <path
      d="M7.5 0C4.375 0 1.6875 1.9375 0.625 4.75C1.6875 7.5625 4.375 9.5 7.5 9.5C10.625 9.5 13.3125 7.5625 14.375 4.75C13.3125 1.9375 10.625 0 7.5 0ZM7.5 8C5.84375 8 4.5 6.65625 4.5 5C4.5 3.34375 5.84375 2 7.5 2C9.15625 2 10.5 3.34375 10.5 5C10.5 6.65625 9.15625 8 7.5 8ZM7.5 3.25C6.53125 3.25 5.75 4.03125 5.75 5C5.75 5.96875 6.53125 6.75 7.5 6.75C8.46875 6.75 9.25 5.96875 9.25 5C9.25 4.03125 8.46875 3.25 7.5 3.25Z"
      fill="#93161E"
    />
  </svg>
);

const ReviewDocumentCard = ({
  label,
  storageUrl,
  isLoading,
  onView,
}: ReviewDocumentCardProps): ReactElement => {
  const hasUrl = Boolean(storageUrl.trim());
  const typeLabel = fileTypeLabelFromUrl(storageUrl) || "PDF";

  return (
    <div className="flex min-w-0 flex-1 items-center gap-[12px] rounded-[8px] border border-[#EEEEEE] bg-white px-[12px] py-[10px]">
      <FileTypeBadge type={typeLabel} />
      <p className="min-w-0 flex-1 font-['Mulish',sans-serif] text-[14px] font-normal leading-none tracking-normal text-[#231F20]">
        {label}
      </p>
      <button
        type="button"
        disabled={!hasUrl || isLoading}
        onClick={() => onView(storageUrl)}
        className="flex size-[24px] shrink-0 items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-40"
        aria-label={`View ${label}`}
        title={`View ${label}`}
      >
        {isLoading ? <Loader2 className="size-4 animate-spin text-[#93161e]" /> : <EyeIcon />}
      </button>
    </div>
  );
};

type TicketCardProps = {
  label: string;
  value: string;
  tone: "green" | "blue";
  onCopy?: () => void;
  copied?: boolean;
};

const TicketCard = ({ label, value, tone, onCopy, copied }: TicketCardProps): ReactElement => {
  const isGreen = tone === "green";
  const bgClass = isGreen ? "bg-[#EEFFE5]" : "bg-[#E8F1FB]";
  const valueClass = isGreen ? "text-[#37B400]" : "text-[#3669BA]";

  return (
    <div
      className={`relative flex min-h-[72px] flex-1 flex-col items-center justify-center overflow-hidden rounded-[10px] px-[28px] py-[14px] text-center ${bgClass}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-0 size-[16px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 size-[16px] translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
      />
      <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#435160] text-[12px]">{label}</p>
      <p
        className={`mt-[8px] w-full break-all font-['Mulish',sans-serif] text-[15px] font-semibold leading-[22px] md:text-[16px] md:leading-[24px] ${valueClass}`}
        title={value}
      >
        {value}
      </p>
      {onCopy ? (
        <button
          type="button"
          onClick={onCopy}
          className="absolute top-1/2 right-[12px] flex size-[24px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#71859b] shadow-[0px_1px_2px_rgba(0,0,0,0.06)] transition-colors hover:text-[#435160]"
          aria-label={copied ? "Copied" : "Copy application ID"}
          title={copied ? "Copied" : "Copy"}
        >
          <Copy className="size-[12px]" />
        </button>
      ) : null}
    </div>
  );
};

type ContactMetaItemProps = {
  icon: LucideIcon;
  value: string;
  title?: string;
};

const ContactMetaItem = ({ icon: Icon, value, title }: ContactMetaItemProps): ReactElement => (
  <div className="flex min-w-0 flex-1 items-center gap-[10px] px-[4px]">
    <span
      aria-hidden
      className="flex size-[28px] shrink-0 items-center justify-center rounded-[6px] bg-[#fce8ea]"
    >
      <Icon className="size-[14px] text-[#93161e]" strokeWidth={1.75} />
    </span>
    <p
      className="truncate font-['Mulish',sans-serif] text-[13px] leading-[19.5px] text-[#231f20]"
      title={title}
    >
      {value}
    </p>
  </div>
);

type SuccessScreenProps = {
  result: CreateApplicationResponse | null;
};

const SuccessCheckIcon = (): ReactElement => (
  <img
    alt=""
    aria-hidden
    className="size-[120px] shrink-0 object-contain md:size-[94px]"
    src={imgSuccessTick}
  />
);

function SuccessScreen({ result }: SuccessScreenProps): ReactElement {
  const [copied, setCopied] = useState(false);
  const applicationId = displayValue(primaryApplicationId(result?.applicationId));
  const timeline = displayValue(result?.expectedReviewTimeline);
  const name = displayValue(result?.name);
  const contact = formatPrimaryContact(result?.primaryContactNumber);
  const email = displayValue(result?.primaryEmail);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleCopy = useCallback(async (): Promise<void> => {
    const id = primaryApplicationId(result?.applicationId);
    if (!id) {
      return;
    }

    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [result?.applicationId]);

  return (
    <div className="fixed inset-0 z-50 flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#fffaf6] animate-[fadeIn_0.3s_ease-out]">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-60">
        <img alt="" className="absolute top-0 left-[30%] h-full w-auto max-w-none" src={imgBgImg} />
      </div>

      <div className="relative z-20 shrink-0 px-[20px] pt-[20px] md:px-[40px] md:pt-[24px] lg:px-[60px] lg:pt-[40px] xl:px-[120px] xl:pt-[48px]">
        <img
          alt="ICICI Prudential Alternate Investments"
          className="h-[40px] w-[82px] object-contain md:h-[48px] md:w-[98px] lg:h-[56px] lg:w-[115px]"
          src={imgLogo}
        />
      </div>

      <div className="relative z-20 flex min-h-0 flex-1 items-center justify-center px-[20px] pb-[24px]">
        <div className="w-full max-w-[684px] overflow-hidden rounded-[16px] bg-white shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col items-center gap-[20px] px-[20px] py-[28px] md:gap-[16px] md:px-[32px] md:py-[32px]">
            <SuccessCheckIcon />

            <div className="flex w-full max-w-[460px] flex-col items-center gap-[8px] text-center">
              <h1 className="font-['Mulish',sans-serif] text-[18px] font-semibold leading-[27px] text-[#231f20] md:text-[22px] md:leading-[33px]">
                Application Submitted for Review
              </h1>
              <p className="font-['Mulish',sans-serif] text-[15px] font-semibold leading-[22.5px] tracking-normal text-center text-[#435160]">
                A confirmation SMS/Email has been sent to your registered contact details
              </p>
            </div>

            <div className="flex w-full flex-col gap-[12px] sm:flex-row">
              <TicketCard
                label="Application ID"
                value={applicationId}
                tone="green"
                onCopy={() => {
                  void handleCopy();
                }}
                copied={copied}
              />
              <TicketCard label="Expected Review Timeline" value={timeline} tone="blue" />
            </div>

            <div className="flex w-full flex-col gap-[12px] rounded-[10px] border border-[#e5e5e6] bg-white px-[12px] py-[12px] sm:flex-row sm:items-center sm:gap-[12px] sm:px-[16px] sm:py-[14px]">
              <ContactMetaItem icon={UserRound} value={name} />
              <div className="hidden h-[24px] w-px shrink-0 bg-[#e5e5e6] sm:block" />
              <ContactMetaItem icon={Smartphone} value={contact} />
              <div className="hidden h-[24px] w-px shrink-0 bg-[#e5e5e6] sm:block" />
              <ContactMetaItem
                icon={Mail}
                value={email}
                title={email !== "-" ? email : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type SummaryFieldProps = {
  label: string;
  value: string;
};

const SummaryField = ({ label, value }: SummaryFieldProps): ReactElement => (
  <div className="flex flex-col gap-[4px]">
    <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#71859B] text-[12px]">{label}</p>
    <p className="text-[13px] text-[#231f20] break-words">{value}</p>
  </div>
);

type SectionCardProps = {
  sectionId: ReviewSectionId;
  onEdit: (sectionId: ReviewSectionId) => void;
  children: ReactNode;
};

const editIconMaskStyle = {
  WebkitMaskImage: `url(${editIcon})`,
  maskImage: `url(${editIcon})`,
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
} as const;

const SectionCard = ({ sectionId, onEdit, children }: SectionCardProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`rounded-[8px] border border-[#e5e5e6] p-[24px] flex flex-col ${isOpen ? "gap-[12px]" : ""}`}>
      <div className="flex items-center justify-between">
        <p className="font-['Mulish',sans-serif] font-medium leading-[24px] tracking-normal text-[#231F20] text-[16px]">
          {REVIEW_SECTION_LABELS[sectionId]}
        </p>
        <div className="flex items-center gap-[8px]">
          <button
            type="button"
            onClick={() => onEdit(sectionId)}
            className="inline-flex h-[29px] items-center justify-center gap-[6px] px-[12px] rounded-[8px] border border-[#eee] bg-white font-['Mulish',sans-serif] text-[13px] font-normal leading-none tracking-normal text-[#435160]"
          >
            <span aria-hidden className="size-[14px] shrink-0 bg-[#435160]" style={editIconMaskStyle} />
            Edit
          </button>
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={isOpen ? `Collapse ${REVIEW_SECTION_LABELS[sectionId]}` : `Expand ${REVIEW_SECTION_LABELS[sectionId]}`}
            onClick={() => setIsOpen((open) => !open)}
            className="flex size-[32px] items-center justify-center rounded-full border border-[#eee] bg-white text-[#435160] hover:border-[#c7aa7b] transition-colors"
          >
            <ChevronUp
              className={`size-[16px] transition-transform duration-200 ${isOpen ? "" : "rotate-180"}`}
              strokeWidth={1.75}
            />
          </button>
        </div>
      </div>
      {isOpen ? children : null}
    </div>
  );
};

const ReviewConfirmStep = ({ onBack, onEditSection }: ReviewConfirmStepProps): ReactElement => {
  const leadId = useOnboardingStore((state) => state.leadId);
  const pan = useOnboardingStore((state) => state.pan);
  const panNumber = useOnboardingStore((state) => state.panNumber);
  const currentFlow = useOnboardingStore((state) => state.currentFlow);
  const onboardingMethod = useOnboardingStore((state) => state.onboardingMethod);
  const resolvedPan = (pan || panNumber).trim().toUpperCase();
  const isArnFlow = currentFlow === "aif-individual" && onboardingMethod === "ARN";
  const isKraFlow = currentFlow === "aif-individual" && onboardingMethod === "KRA";

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoadingKey, setPreviewLoadingKey] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isDownloadingForm, setIsDownloadingForm] = useState(false);
  const [downloadFormError, setDownloadFormError] = useState<string | null>(null);

  const {
    review,
    isLoading,
    isSubmitting,
    isSubmitted,
    submissionResult,
    error,
    editSection,
    submitApplication,
  } = useReviewSubmitFlow(onEditSection);

  const handleEdit = (sectionId: ReviewSectionId): void => {
    editSection(sectionId);
  };

  const handleSubmit = (): void => {
    void submitApplication();
  };

  const closePreview = (): void => {
    setIsPreviewOpen(false);
    setPreviewUrl(null);
    setPreviewError(null);
    setPreviewLoadingKey(null);
  };

  const handleViewDocument = useCallback(
    async (storageUrl: string): Promise<void> => {
      const downloadLink = storageUrl.trim();
      if (!downloadLink || previewLoadingKey) {
        return;
      }

      if (!leadId || !resolvedPan) {
        setIsPreviewOpen(true);
        setPreviewUrl(null);
        setPreviewError("Unable to open document. Missing lead or PAN information.");
        return;
      }

      setIsPreviewOpen(true);
      setPreviewUrl(null);
      setPreviewError(null);
      setPreviewLoadingKey(downloadLink);

      try {
        const fileName = extractFileNameFromUrl(downloadLink);
        const type = resolveDocumentFormat(fileName || downloadLink);
        const response = await onboardingApi.downloadFile({
          downloadLink,
          fileName,
          leadId,
          panNumber: resolvedPan,
          type,
        });
        const displaySrc = toDisplaySrc(response.fileURL, type);
        if (!displaySrc) {
          throw new Error("Document download returned an empty file.");
        }
        setPreviewUrl(displaySrc);
      } catch {
        setPreviewError("Unable to load document. Please try again.");
      } finally {
        setPreviewLoadingKey(null);
      }
    },
    [leadId, previewLoadingKey, resolvedPan],
  );

  const handleDownloadForm = useCallback(async (): Promise<void> => {
    if (!leadId || isDownloadingForm) {
      if (!leadId) {
        setDownloadFormError("Unable to download form. Missing lead information.");
      }
      return;
    }

    setIsDownloadingForm(true);
    setDownloadFormError(null);

    try {
      const response = await onboardingApi.generatePdf({ leadId });
      triggerPdfDownload(response.fileURL, response.fileName);
    } catch {
      setDownloadFormError("Unable to download form. Please try again.");
    } finally {
      setIsDownloadingForm(false);
    }
  }, [isDownloadingForm, leadId]);

  if (isSubmitted) {
    return <SuccessScreen result={submissionResult} />;
  }

  return (
    <div className="relative w-full overflow-y-auto pb-[100px]">
      <div className="w-full max-w-[1168px] mx-auto">
        <div className="mb-[24px] flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Mulish',sans-serif] text-[22px] font-medium leading-none tracking-normal text-[#231F20]">
              Review & Confirm
            </p>
            <p className="font-['Mulish',sans-serif] text-[15px] font-semibold leading-[22.5px] tracking-normal text-[#435160]">
              Please review your details before submitting the application.
            </p>
          </div>

          <div className="flex items-center justify-between font-['Mulish',sans-serif] text-[12px] font-normal leading-[18px] text-[#231f20]">
            <p>Step 6 of 6</p>
            <p>100%</p>
          </div>
        </div>

        {error ? (
          <p className="mb-[12px] font-['Mulish',sans-serif] text-[13px] text-[#E8402F]">{error}</p>
        ) : null}

        <div className="bg-white rounded-[16px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] w-full overflow-hidden mb-[24px]">
          <div className="bg-[#e6e7e8] h-[8px] w-full">
            <div className="bg-[#37b400] h-full w-full" />
          </div>

          <div className="flex flex-col gap-[24px] p-[24px]">
            {isLoading ? (
              <OnboardingContentSkeleton sections={4} />
            ) : (
              <>
                <SectionCard sectionId="personal" onEdit={handleEdit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                    <SummaryField label="Name" value={displayValue(review?.personal.name)} />
                    <SummaryField label="PAN" value={displayValue(review?.personal.panNumber)} />
                    <SummaryField
                      label="Mobile Number"
                      value={
                        review?.personal.mobile
                          ? `+91 ${review.personal.mobile}`
                          : "-"
                      }
                    />
                    <SummaryField label="Email" value={displayValue(review?.personal.email)} />
                    <SummaryField label="Date of Birth" value={displayValue(review?.personal.dob)} />
                    {isKraFlow ? null : (
                      <SummaryField
                        label={isArnFlow ? "ARN" : "APRN"}
                        value={displayValue(
                          isArnFlow ? review?.personal.arnNumber : review?.personal.aprnNumber,
                        )}
                      />
                    )}
                    <SummaryField
                      label="Entity Type"
                      value={displayValue(review?.personal.entityType)}
                    />
                    <SummaryField
                      label="Permanent Address"
                      value={displayValue(review?.personal.permanentAddress)}
                    />
                    <SummaryField
                      label="Correspondence Address"
                      value={displayValue(review?.personal.correspondenceAddress)}
                    />
                  </div>
                </SectionCard>

                <SectionCard sectionId="business" onEdit={handleEdit}>
                  <div className="flex flex-col gap-[16px]">
                    <div className="flex flex-col gap-[12px]">
                      <p className="font-['Mulish',sans-serif] font-medium text-[13px] leading-[19.5px] text-[#231f20]">
                        GST Details
                      </p>
                      {review?.business.gstDetails?.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                          {review.business.gstDetails.map((gst, index) => {
                            const gstNumber = gst.gstNumber.trim() || "Unregistered";
                            const stateCode = toGstStateCode(gst.stateCode);
                            const legalName = gst.legalName.trim();

                            return (
                              <div
                                key={`${gstNumber}-${stateCode}-${index}`}
                                className="min-w-0 flex flex-col gap-[4px]"
                              >
                                <p className="font-['Mulish',sans-serif] font-normal text-[13px] leading-[19.5px] text-[#231f20] break-words">
                                  {gstNumber}
                                  {stateCode ? (
                                    <>
                                      <span className="text-[#71859b]"> | </span>
                                      <span>{stateCode}</span>
                                    </>
                                  ) : null}
                                </p>
                                <p className="font-['Mulish',sans-serif] font-normal text-[12px] leading-[18px] text-[#71859b] break-words">
                                  {displayValue(legalName)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="font-['Mulish',sans-serif] text-[13px] text-[#71859b]">-</p>
                      )}
                    </div>

                    <div className="h-px w-full bg-[#e5e5e6]" />

                    <div className="flex flex-col gap-[12px]">
                      <p className="font-['Mulish',sans-serif] font-medium text-[13px] leading-[19.5px] text-[#231f20]">
                        Branch Details
                      </p>
                      <SummaryField
                        label="Branch Selected"
                        value={displayValue(review?.business.selectedBranch)}
                      />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard sectionId="bank" onEdit={handleEdit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                    <SummaryField
                      label="Name"
                      value={displayValue(review?.bank.accountHolderName)}
                    />
                    <SummaryField
                      label="Account Number"
                      value={displayValue(review?.bank.accountNumber)}
                    />
                    <SummaryField label="IFSC Code" value={displayValue(review?.bank.ifsc)} />
                    <SummaryField label="Bank" value={displayValue(review?.bank.bankName)} />
                    <SummaryField
                      label="Branch Name & Address"
                      value={displayValue(review?.bank.branchName)}
                    />
                    <SummaryField
                      label="Cheque Upload"
                      value={displayYesNo(Boolean(review?.bank.chequeUploaded))}
                    />
                  </div>
                </SectionCard>

                <SectionCard sectionId="nominee" onEdit={handleEdit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                    <SummaryField
                      label="Nominee Name"
                      value={displayValue(review?.nominee.nomineeName)}
                    />
                    <SummaryField
                      label="Relationship with Applicant"
                      value={displayValue(review?.nominee.relationshipWithApplicant)}
                    />
                    <SummaryField
                      label="Is nominee a minor?"
                      value={review?.nominee.isMinor ? "Yes" : "No"}
                    />
                    <SummaryField
                      label="Mobile Number"
                      value={displayValue(review?.nominee.mobileNumber)}
                    />
                    <SummaryField label="Email" value={displayValue(review?.nominee.emailId)} />
                    <SummaryField
                      label="Date of Birth"
                      value={displayValue(review?.nominee.dateOfBirth)}
                    />
                    <SummaryField
                      label="Proof of Identity"
                      value={
                        review?.nominee.proofOfIdentityType || review?.nominee.proofOfIdentityNumber
                          ? `${displayValue(review?.nominee.proofOfIdentityType)} / ${displayValue(review?.nominee.proofOfIdentityNumber)}`
                          : "-"
                      }
                    />
                    <SummaryField
                      label="Address"
                      value={displayValue(review?.nominee.nomineeAddress)}
                    />
                  </div>
                </SectionCard>

                <SectionCard sectionId="documents" onEdit={handleEdit}>
                  {review?.documents.signatureUploaded || review?.documents.photoUploaded ? (
                    <div className="flex flex-col gap-[12px] sm:flex-row sm:gap-[16px]">
                      {review.documents.signatureUploaded ? (
                        <ReviewDocumentCard
                          label="Specimen Signature"
                          storageUrl={review.documents.uploadedSignature}
                          isLoading={
                            previewLoadingKey === review.documents.uploadedSignature.trim()
                          }
                          onView={(url) => {
                            void handleViewDocument(url);
                          }}
                        />
                      ) : null}
                      {review.documents.photoUploaded ? (
                        <ReviewDocumentCard
                          label="Photo Upload"
                          storageUrl={review.documents.uploadedPhoto}
                          isLoading={previewLoadingKey === review.documents.uploadedPhoto.trim()}
                          onView={(url) => {
                            void handleViewDocument(url);
                          }}
                        />
                      ) : null}
                    </div>
                  ) : (
                    <p className="font-['Mulish',sans-serif] text-[13px] text-[#71859b]">
                      No documents uploaded
                    </p>
                  )}
                </SectionCard>
              </>
            )}
          </div>
        </div>

      </div>

      {downloadFormError ? (
        <p className="fixed bottom-[72px] left-0 right-0 z-40 px-4 text-center font-['Mulish',sans-serif] text-[13px] text-[#E8402F] lg:bottom-[68px]">
          {downloadFormError}
        </p>
      ) : null}

      <OnboardingStepFooter
        onPrevious={onBack}
        previousDisabled={isSubmitting || isDownloadingForm}
        continueLabel="Submit"
        hideContinueArrow
        continueDisabled={isLoading || !review}
        isLoading={isSubmitting}
        loadingLabel="Submitting..."
        onContinue={handleSubmit}
        beforeContinue={
          <button
            type="button"
            onClick={() => {
              void handleDownloadForm();
            }}
            disabled={!leadId || isDownloadingForm || isSubmitting || isLoading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[8px] border border-[#eee] bg-white px-4 transition-colors hover:border-[#c7aa7b] disabled:cursor-not-allowed disabled:opacity-60 lg:h-9 lg:w-auto lg:min-w-[180px]"
          >
            {isDownloadingForm ? (
              <Loader2 className="size-4 animate-spin text-[#435160]" />
            ) : (
              <>
                <span className="font-['Mulish',sans-serif] text-[14px] font-normal leading-[21px] text-[#435160]">
                  Download Form
                </span>
                <Download className="size-4 text-[#435160]" aria-hidden />
              </>
            )}
          </button>
        }
      />

      {isPreviewOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={closePreview}
            className="absolute inset-0 bg-[rgba(35,31,32,0.5)] backdrop-blur-[3px]"
          />
          <div className="relative z-10 flex w-[679.5px] max-w-[90vw] flex-col gap-[16px] rounded-[16px] bg-white p-[24px] md:p-[32px] shadow-[4px_4px_20px_rgba(0,0,0,0.12)]">
            <div className="flex h-[33px] items-center justify-between">
              <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#435160] text-[22px]">
                View Documents
              </p>
              <button
                type="button"
                onClick={closePreview}
                className="size-[24px] overflow-clip hover:opacity-70 transition-opacity"
                aria-label="Close"
              >
                <svg className="size-full" fill="none" viewBox="0 0 15.0008 15.0008">
                  <path d={modalSvgPaths.p3bbf7480} fill="#435160" />
                </svg>
              </button>
            </div>
            <div className="w-full overflow-hidden rounded-[8px] border border-dashed border-[#eee]">
              <div className="relative flex min-h-[188px] w-full items-center justify-center overflow-hidden p-[12px]">
                {previewLoadingKey ? (
                  <div className="flex flex-col items-center gap-[12px] py-[24px]">
                    <Loader2 className="size-6 animate-spin text-[#93161e]" />
                    <p className="font-['Mulish',sans-serif] text-[13px] text-[#71859b]">
                      Loading document...
                    </p>
                  </div>
                ) : previewError ? (
                  <p className="py-[24px] text-center font-['Mulish',sans-serif] text-[13px] text-[#E8402F]">
                    {previewError}
                  </p>
                ) : previewUrl ? (
                  <img
                    alt="Document preview"
                    className="max-h-[320px] w-full object-contain"
                    src={previewUrl}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isSubmitting ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-[rgba(35,31,32,0.5)] backdrop-blur-[3px]" />
          <div className="relative bg-white rounded-[16px] shadow-[4px_4px_20px_rgba(0,0,0,0.12)] w-[470px] max-w-[90vw] p-[24px] flex flex-col items-center gap-[16px]">
            <div className="size-[52px] rounded-full border-[6px] border-[#e5e5e6] border-t-[#93161e] animate-spin" />
            <p className="font-['Mulish',sans-serif] text-[20px] leading-[30px] text-[#435160] text-center">
              Submitting application...
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ReviewConfirmStep;
