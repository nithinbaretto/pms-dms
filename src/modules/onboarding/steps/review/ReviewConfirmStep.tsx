import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';

import imgBgImg from '../../../../assets/images/background_img.png';
import imgDocPreview from '../../../../assets/images/guidlines_img_1.png';
import imgLogo from '../../../../assets/logo.png';
import type { FlowConfig } from '../../flow/flow.config';
import { useOnboardingStore } from '../../state/onboarding-store';
import type { ProductCategory } from '../../types/onboarding-types';
import { resolveValidator } from '../../validators';
import type { PersonalDetailsModel } from '../personal-details/types';

type ReviewConfirmStepProps = {
  onBack: () => void;
  panNumber: string;
  productCategories: ProductCategory[];
  personalDetails: PersonalDetailsModel | null;
  signatureUploaded: boolean;
  photoUploaded: boolean;
  chequeUploaded: boolean;
  flowConfig: FlowConfig;
  onEditSection: (section: 'personal' | 'business' | 'bank' | 'nominee' | 'documents') => void;
};

type SubmitRoute = 'branch-maker' | 'esign';

function SuccessScreen({ route }: { route: SubmitRoute }): ReactElement {
  const title = route === 'branch-maker' ? 'Application Submitted Successfully' : 'E-sign Completed Successfully';
  const subtitle = route === 'branch-maker'
    ? 'Your application has been submitted and is under review. You will receive a confirmation email shortly with further details.'
    : 'A confirmation SMS/Email has been sent to your registered contact details';

  return (
    <div className="bg-[#fffaf6] relative min-h-screen w-full overflow-hidden animate-[fadeIn_0.3s_ease-out]">
      <div className="absolute h-full w-full opacity-60 overflow-hidden pointer-events-none z-0">
        <img alt="" className="absolute h-full left-[30%] max-w-none top-0 w-auto" src={imgBgImg} />
      </div>

      <div className="hidden lg:block absolute h-[56px] w-[115px] left-[60px] top-[50px] xl:left-[120px] xl:top-[64px] z-20">
        <img alt="ICICI Prudential Alternate Investments" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo} />
      </div>

      <div className="lg:hidden absolute left-[20px] md:left-[40px] top-[20px] md:top-[24px] h-[40px] w-[82px] md:h-[48px] md:w-[98px] z-20">
        <img alt="ICICI Prudential Alternate Investments" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo} />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-[120px] md:top-[172px] w-[calc(100%-40px)] md:w-[600px] lg:w-[1200px] bg-white rounded-[16px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] overflow-hidden z-20">
        <div className="flex flex-col items-center justify-center p-[32px] md:p-[48px] lg:p-[64px] gap-[24px] md:gap-[32px]">
          <div className="relative size-[120px] md:size-[158px] rounded-full bg-[#2DC659]/20 flex items-center justify-center">
            <div className="size-[84px] rounded-full bg-[#2DC659] flex items-center justify-center">
              <svg className="size-[40px]" fill="none" viewBox="0 0 24 24">
                <path d="M20 7L10 17L5 12" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-[8px] items-center text-center w-full max-w-[620px] animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
            <h1 className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#231f20] text-[20px] md:text-[22px]">
              {title}
            </h1>
            <p className="font-['Mulish',sans-serif] font-normal leading-[22.5px] text-[#435160] text-[14px] md:text-[15px]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const ReviewConfirmStep = ({
  onBack,
  panNumber,
  productCategories,
  personalDetails,
  signatureUploaded,
  photoUploaded,
  chequeUploaded,
  flowConfig,
  onEditSection,
}: ReviewConfirmStepProps): ReactElement => {
  const [expandedSections] = useState({
    personal: true,
    business: true,
    bank: true,
    nominee: true,
    documents: true,
  });
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitRoute, setSubmitRoute] = useState<SubmitRoute | null>(null);
  const [loaderMessage, setLoaderMessage] = useState('');

  const setStep = useOnboardingStore((state) => state.setStep);
  const setIsEditMode = useOnboardingStore((state) => state.setIsEditMode);

  const selectedProductsLabel = useMemo(() => {
    if (!productCategories.length) {
      return '-';
    }

    return productCategories.join(', ');
  }, [productCategories]);

  const validateBeforeSubmit = () => {
    const personalValid = Boolean(
      personalDetails?.personalDetails?.name?.trim() &&
      panNumber.trim() &&
      personalDetails?.mobile?.value?.trim() &&
      personalDetails?.email?.value?.trim() &&
      personalDetails?.permanentAddress?.addressLine?.trim() &&
      personalDetails?.correspondenceAddress?.addressLine?.trim(),
    );

    const businessValidator = resolveValidator(flowConfig, 'business');
    const nomineeValidator = resolveValidator(flowConfig, 'nominee');
    const documentsValidator = resolveValidator(flowConfig, 'documents');

    const businessValid = businessValidator({
      panNumber,
      productCategories,
      personalDetails,
      signatureUploaded,
      photoUploaded,
      chequeUploaded,
      flowConfig,
    });
    const bankValid = true;
    const nomineeValid = nomineeValidator({
      panNumber,
      productCategories,
      personalDetails,
      signatureUploaded,
      photoUploaded,
      chequeUploaded,
      flowConfig,
    });
    const docsValid = documentsValidator({
      panNumber,
      productCategories,
      personalDetails,
      signatureUploaded,
      photoUploaded,
      chequeUploaded,
      flowConfig,
    });

    if (!personalValid || !businessValid || !bankValid || !nomineeValid || !docsValid) {
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (isSubmitting) {
      return;
    }

    setSubmitError('');

    const isValid = validateBeforeSubmit();
    if (!isValid) {
      setSubmitError('Please complete all mandatory details and uploads before submission.');
      return;
    }

    setIsSubmitting(true);

    const requiresCheque = flowConfig.documents?.requiresCheque === true;
    const branchMakerByFlow = flowConfig.product === 'PMS' && flowConfig.customerType === 'Corporate';

    if ((requiresCheque && chequeUploaded) || branchMakerByFlow) {
      setLoaderMessage('Submitting application for Branch/Maker processing...');
      window.setTimeout(() => {
        setSubmitRoute('branch-maker');
        setIsSubmitting(false);
      }, 1200);
      return;
    }

    setLoaderMessage('Redirecting to E-sign Verification');
    window.setTimeout(() => {
      setSubmitRoute('esign');
      setIsSubmitting(false);
    }, 1400);
  };

  if (submitRoute) {
    return <SuccessScreen route={submitRoute} />;
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
            <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#231f20] text-[22px]">Review & Confirm</p>
            <p className="font-['Mulish',sans-serif] font-normal leading-[22.5px] text-[#435160] text-[15px]">
              Your details have been fetched from APMI. Fields shown in grey cannot be changed
            </p>
          </div>

          <div className="flex items-center justify-between font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">
            <p>Step 6 of 6</p>
            <p>100%</p>
          </div>
        </div>

        {submitError ? (
          <p className="mb-[12px] font-['Mulish',sans-serif] text-[13px] text-[#E8402F]">{submitError}</p>
        ) : null}

        <div className="bg-white rounded-[16px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] w-full overflow-hidden mb-[24px]">
          <div className="bg-[#e6e7e8] h-[8px] w-full">
            <div className="bg-[#37b400] h-full w-full" />
          </div>

          <div className="flex flex-col gap-[24px] p-[24px]">
            <div className="rounded-[8px] border border-[#e5e5e6] p-[24px] flex flex-col gap-[12px]">
              <div className="flex items-center justify-between">
                <p className="font-['Mulish',sans-serif] font-medium text-[#231f20] text-[14px]">Personal Information</p>
                <button onClick={() => onEditSection('personal')} className="h-[29px] px-[12px] rounded-[8px] border border-[#eee] text-[13px] text-[#435160]">Edit</button>
              </div>
              {expandedSections.personal && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                  <div><p className="text-[11px] text-[#71859b]">Name</p><p className="text-[13px] text-[#231f20]">{personalDetails?.personalDetails?.name || '-'}</p></div>
                  <div><p className="text-[11px] text-[#71859b]">PAN</p><p className="text-[13px] text-[#231f20]">{panNumber}</p></div>
                  <div><p className="text-[11px] text-[#71859b]">Mobile Number</p><p className="text-[13px] text-[#231f20]">+91 {personalDetails?.mobile?.value || '-'}</p></div>
                  <div><p className="text-[11px] text-[#71859b]">Email</p><p className="text-[13px] text-[#231f20]">{personalDetails?.email?.value || '-'}</p></div>
                </div>
              )}
            </div>

            <div className="rounded-[8px] border border-[#e5e5e6] p-[24px] flex flex-col gap-[12px]">
              <div className="flex items-center justify-between">
                <p className="font-['Mulish',sans-serif] font-medium text-[#231f20] text-[14px]">Business Details</p>
                <button onClick={() => onEditSection('business')} className="h-[29px] px-[12px] rounded-[8px] border border-[#eee] text-[13px] text-[#435160]">Edit</button>
              </div>
              {expandedSections.business && <p className="text-[13px] text-[#231f20]">Selected Products: {selectedProductsLabel}</p>}
            </div>

            <div className="rounded-[8px] border border-[#e5e5e6] p-[24px] flex flex-col gap-[12px]">
              <div className="flex items-center justify-between">
                <p className="font-['Mulish',sans-serif] font-medium text-[#231f20] text-[14px]">Bank Details</p>
                <button onClick={() => onEditSection('bank')} className="h-[29px] px-[12px] rounded-[8px] border border-[#eee] text-[13px] text-[#435160]">Edit</button>
              </div>
              {expandedSections.bank && <p className="text-[13px] text-[#231f20]">Cheque Upload: {chequeUploaded ? 'Uploaded' : 'Pending'}</p>}
            </div>

            <div className="rounded-[8px] border border-[#e5e5e6] p-[24px] flex flex-col gap-[12px]">
              <div className="flex items-center justify-between">
                <p className="font-['Mulish',sans-serif] font-medium text-[#231f20] text-[14px]">Nominee Details</p>
                <button onClick={() => onEditSection('nominee')} className="h-[29px] px-[12px] rounded-[8px] border border-[#eee] text-[13px] text-[#435160]">Edit</button>
              </div>
              {expandedSections.nominee && <p className="text-[13px] text-[#231f20]">Details reviewed.</p>}
            </div>

            <div className="rounded-[8px] border border-[#e5e5e6] p-[24px] flex flex-col gap-[12px]">
              <div className="flex items-center justify-between">
                <p className="font-['Mulish',sans-serif] font-medium text-[#231f20] text-[14px]">Uploaded Documents</p>
                <button onClick={() => onEditSection('documents')} className="h-[29px] px-[12px] rounded-[8px] border border-[#eee] text-[13px] text-[#435160]">Edit</button>
              </div>
              {expandedSections.documents && (
                <div className="flex gap-[12px]">
                  <button onClick={() => setShowDocumentModal(true)} className="h-[42px] px-[12px] rounded-[8px] border border-[#eee] text-[13px] text-[#231f20]">Specimen Signature</button>
                  <button onClick={() => setShowDocumentModal(true)} className="h-[42px] px-[12px] rounded-[8px] border border-[#eee] text-[13px] text-[#231f20]">Photo Upload</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e5e6] z-40">
        <div className="w-full max-w-[1168px] mx-auto px-[20px] lg:px-0 py-[16px]">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="h-[36px] w-[180px] rounded-[8.75px] border border-[#eee] flex items-center justify-center gap-[8px] hover:border-[#c7aa7b] transition-colors"
            >
              <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Previous</p>
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#93161e] hover:bg-[#7a1319] h-[36px] w-[180px] rounded-[8.75px] flex items-center justify-center gap-[8px] transition-colors"
            >
              <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-white text-[14px]">Submit</p>
            </button>
          </div>
        </div>
      </div>

      {showDocumentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div onClick={() => setShowDocumentModal(false)} className="absolute inset-0 bg-[rgba(35,31,32,0.5)] backdrop-blur-[3px]" />
          <div className="relative bg-white rounded-[16px] shadow-[4px_4px_20px_rgba(0,0,0,0.12)] w-[679.5px] max-w-[90vw] p-[32px] flex flex-col gap-[16px] z-10">
            <div className="flex items-center justify-between h-[33px]">
              <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#435160] text-[22px]">View Documents</p>
              <button onClick={() => setShowDocumentModal(false)} className="size-[24px] hover:opacity-70 transition-opacity">X</button>
            </div>
            <div className="w-full rounded-[8px] border border-dashed border-[#eee] overflow-hidden">
              <div className="h-[188px] w-full relative overflow-hidden p-[12px]">
                <img alt="Document" className="w-full h-full object-contain" src={imgDocPreview} />
              </div>
            </div>
          </div>
        </div>
      )}

      {isSubmitting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-[rgba(35,31,32,0.5)] backdrop-blur-[3px]" />
          <div className="relative bg-white rounded-[16px] shadow-[4px_4px_20px_rgba(0,0,0,0.12)] w-[470px] max-w-[90vw] p-[24px] flex flex-col items-center gap-[16px]">
            <div className="size-[52px] rounded-full border-[6px] border-[#e5e5e6] border-t-[#93161e] animate-spin" />
            <p className="font-['Mulish',sans-serif] text-[20px] leading-[30px] text-[#435160] text-center">{loaderMessage}</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setIsEditMode(false);
          setStep('review-confirm');
        }}
        className="opacity-0 pointer-events-none"
      >
        Return to Review
      </button>
    </div>
  );
};

export default ReviewConfirmStep;
