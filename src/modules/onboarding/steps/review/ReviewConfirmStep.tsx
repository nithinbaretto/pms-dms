import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import imgBgImg from "../../../../assets/images/background_img.png";
import imgDocPreview from "../../../../assets/images/guidlines_img_1.png";
import imgLogo from "../../../../assets/logo.png";
import { OnboardingContentSkeleton } from "../../components/OnboardingStepSkeleton";
import { REVIEW_SECTION_LABELS } from "./constants";
import { displayValue, displayYesNo, toGstStateCode } from "./helpers";
import type { ReviewSectionId } from "./types";
import { useReviewSubmitFlow } from "./useReviewSubmitFlow";

type ReviewConfirmStepProps = {
  onBack: () => void;
  onEditSection: (section: ReviewSectionId) => void;
};

function SuccessScreen(): ReactElement {
  return (
    <div className="bg-[#fffaf6] relative min-h-screen w-full overflow-hidden animate-[fadeIn_0.3s_ease-out]">
      <div className="absolute h-full w-full opacity-60 overflow-hidden pointer-events-none z-0">
        <img alt="" className="absolute h-full left-[30%] max-w-none top-0 w-auto" src={imgBgImg} />
      </div>

      <div className="hidden lg:block absolute h-[56px] w-[115px] left-[60px] top-[50px] xl:left-[120px] xl:top-[64px] z-20">
        <img
          alt="ICICI Prudential Alternate Investments"
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgLogo}
        />
      </div>

      <div className="lg:hidden absolute left-[20px] md:left-[40px] top-[20px] md:top-[24px] h-[40px] w-[82px] md:h-[48px] md:w-[98px] z-20">
        <img
          alt="ICICI Prudential Alternate Investments"
          className="absolute inset-0 max-w-none object-contain pointer-events-none size-full"
          src={imgLogo}
        />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-[120px] md:top-[172px] w-[calc(100%-40px)] md:w-[600px] lg:w-[1200px] bg-white rounded-[16px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] overflow-hidden z-20">
        <div className="flex flex-col items-center justify-center p-[32px] md:p-[48px] lg:p-[64px] gap-[24px] md:gap-[32px]">
          <div className="relative size-[120px] md:size-[158px] rounded-full bg-[#2DC659]/20 flex items-center justify-center">
            <div className="size-[84px] rounded-full bg-[#2DC659] flex items-center justify-center">
              <svg className="size-[40px]" fill="none" viewBox="0 0 24 24">
                <path
                  d="M20 7L10 17L5 12"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-[8px] items-center text-center w-full max-w-[620px] animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
            <h1 className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#231f20] text-[20px] md:text-[22px]">
              Application Submitted Successfully
            </h1>
            <p className="font-['Mulish',sans-serif] font-normal leading-[22.5px] text-[#435160] text-[14px] md:text-[15px]">
              Your application has been submitted and is under review. You will receive a confirmation
              email shortly with further details.
            </p>
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
  <div>
    <p className="text-[11px] text-[#71859b]">{label}</p>
    <p className="text-[13px] text-[#231f20] break-words">{value}</p>
  </div>
);

type SectionCardProps = {
  sectionId: ReviewSectionId;
  onEdit: (sectionId: ReviewSectionId) => void;
  children: ReactNode;
};

const SectionCard = ({ sectionId, onEdit, children }: SectionCardProps): ReactElement => (
  <div className="rounded-[8px] border border-[#e5e5e6] p-[24px] flex flex-col gap-[12px]">
    <div className="flex items-center justify-between">
      <p className="font-['Mulish',sans-serif] font-medium text-[#231f20] text-[14px]">
        {REVIEW_SECTION_LABELS[sectionId]}
      </p>
      <button
        type="button"
        onClick={() => onEdit(sectionId)}
        className="h-[29px] px-[12px] rounded-[8px] border border-[#eee] text-[13px] text-[#435160]"
      >
        Edit
      </button>
    </div>
    {children}
  </div>
);

const ReviewConfirmStep = ({ onBack, onEditSection }: ReviewConfirmStepProps): ReactElement => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    review,
    isLoading,
    isSubmitting,
    isSubmitted,
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

  if (isSubmitted) {
    return <SuccessScreen />;
  }

  return (
    <div className="min-h-screen w-full relative overflow-y-auto pb-[100px]">
      <div className="fixed inset-0 -z-10">
        <img alt="" className="absolute inset-0 w-full h-full object-cover" src={imgBgImg} />
      </div>

      <div className="w-full max-w-[1168px] mx-auto px-[20px] md:px-[40px] lg:px-0 pt-[24px] md:pt-[64px]">
        <div className="h-[56px] w-[115px] mb-[40px] md:mb-[64px]">
          <img alt="ICICI Prudential" className="w-full h-full object-contain" src={imgLogo} />
        </div>

        <div className="flex flex-col gap-[16px] mb-[24px]">
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#231f20] text-[22px]">
              Review & Confirm
            </p>
            <p className="font-['Mulish',sans-serif] font-normal leading-[22.5px] text-[#435160] text-[15px]">
              Please review your details before submitting the application.
            </p>
          </div>

          <div className="flex items-center justify-between font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">
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
                    <SummaryField
                      label="APRN"
                      value={displayValue(review?.personal.aprnNumber)}
                    />
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
                      label="Account Holder"
                      value={displayValue(review?.bank.accountHolderName)}
                    />
                    <SummaryField
                      label="Account Number"
                      value={displayValue(review?.bank.accountNumber)}
                    />
                    <SummaryField label="IFSC" value={displayValue(review?.bank.ifsc)} />
                    <SummaryField label="Bank Name" value={displayValue(review?.bank.bankName)} />
                    <SummaryField
                      label="Branch"
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
                      label="Relationship"
                      value={displayValue(review?.nominee.relationshipWithApplicant)}
                    />
                    <SummaryField
                      label="Mobile"
                      value={displayValue(review?.nominee.mobileNumber)}
                    />
                    <SummaryField label="Email" value={displayValue(review?.nominee.emailId)} />
                    <SummaryField
                      label="Date of Birth"
                      value={displayValue(review?.nominee.dateOfBirth)}
                    />
                    <SummaryField
                      label="ID Proof"
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
                  <div className="flex flex-wrap gap-[12px]">
                    <button
                      type="button"
                      disabled={!review?.documents.uploadedSignature}
                      onClick={() => setPreviewUrl(review?.documents.uploadedSignature ?? null)}
                      className="h-[42px] px-[12px] rounded-[8px] border border-[#eee] text-[13px] text-[#231f20] disabled:opacity-50"
                    >
                      Specimen Signature ({displayYesNo(Boolean(review?.documents.signatureUploaded))})
                    </button>
                    <button
                      type="button"
                      disabled={!review?.documents.uploadedPhoto}
                      onClick={() => setPreviewUrl(review?.documents.uploadedPhoto ?? null)}
                      className="h-[42px] px-[12px] rounded-[8px] border border-[#eee] text-[13px] text-[#231f20] disabled:opacity-50"
                    >
                      Photo Upload ({displayYesNo(Boolean(review?.documents.photoUploaded))})
                    </button>
                  </div>
                </SectionCard>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e5e6] z-40">
        <div className="w-full max-w-[1168px] mx-auto px-[20px] lg:px-0 py-[16px]">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="h-[36px] w-[180px] rounded-[8.75px] border border-[#eee] flex items-center justify-center gap-[8px] hover:border-[#c7aa7b] transition-colors disabled:opacity-60"
            >
              <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">
                Previous
              </p>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || isSubmitting || !review}
              className="bg-[#93161e] hover:bg-[#7a1319] h-[36px] w-[180px] rounded-[8.75px] flex items-center justify-center gap-[8px] transition-colors disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin text-white" />
                  <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-white text-[14px]">
                    Submitting...
                  </p>
                </>
              ) : (
                <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-white text-[14px]">
                  Submit
                </p>
              )}
            </button>
          </div>
        </div>
      </div>

      {previewUrl ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={() => setPreviewUrl(null)}
            className="absolute inset-0 bg-[rgba(35,31,32,0.5)] backdrop-blur-[3px]"
          />
          <div className="relative bg-white rounded-[16px] shadow-[4px_4px_20px_rgba(0,0,0,0.12)] w-[679.5px] max-w-[90vw] p-[32px] flex flex-col gap-[16px] z-10">
            <div className="flex items-center justify-between h-[33px]">
              <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#435160] text-[22px]">
                View Documents
              </p>
              <button
                type="button"
                onClick={() => setPreviewUrl(null)}
                className="size-[24px] hover:opacity-70 transition-opacity"
              >
                X
              </button>
            </div>
            <div className="w-full rounded-[8px] border border-dashed border-[#eee] overflow-hidden">
              <div className="h-[188px] w-full relative overflow-hidden p-[12px]">
                <img
                  alt="Document"
                  className="w-full h-full object-contain"
                  src={previewUrl || imgDocPreview}
                />
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
