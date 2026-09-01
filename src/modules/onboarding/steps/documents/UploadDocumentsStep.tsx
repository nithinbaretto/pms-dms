/* eslint-disable react-hooks/set-state-in-effect */
import type { ChangeEvent, ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';

import svgPaths from '../../../../assets/figma-svg/svg-fcmqq9l0qc';
import modalSvgPaths from '../../../../assets/figma-svg/svg-kmnbjcgk4j';
import imgSignGuideline1 from '../../../../assets/images/sign_guidelines_1.png';
import imgSignGuideline2 from '../../../../assets/images/sign_guidelines_2.png';
import imgSignGuideline3 from '../../../../assets/images/sign_guidelines_3.png';
import imgSignGuideline4 from '../../../../assets/images/sign_guidelines_4.png';
import imgPhotoGuideline1 from '../../../../assets/images/photo_guidelines_1.png';
import imgPhotoGuideline2 from '../../../../assets/images/photo_guidelines_2.png';
import imgPhotoGuideline3 from '../../../../assets/images/photo_guidelines_3.png';
import imgPhotoGuideline4 from '../../../../assets/images/photo_guidelines_4.png';
import CameraCaptureModal from '../../components/CameraCaptureModal';
import OnboardingStepFooter from '../../components/OnboardingStepFooter';
import OnboardingStepSkeleton from '../../components/OnboardingStepSkeleton';
import UploadImageGuidelines from '../../components/UploadImageGuidelines';
import { useOnboardingStore } from '../../state/onboarding-store';
import { useDocumentsFlow } from './useDocumentsFlow';

type UploadDocumentsStepProps = {
  onBack: () => void;
  onContinue: () => void;
  isEditMode?: boolean;
  onGoToReview?: () => void;
  documentRules?: {
    requiresPhoto?: boolean;
    requiresSignature?: boolean;
    requiresCheque?: boolean;
    requiresDueDiligenceDoc?: boolean;
    requiresProofDocs?: boolean;
  };
};

interface Props {
  signatureUploaded: boolean;
  photoUploaded: boolean;
  documentRules?: {
    requiresPhoto?: boolean;
    requiresSignature?: boolean;
    requiresCheque?: boolean;
    requiresDueDiligenceDoc?: boolean;
    requiresProofDocs?: boolean;
  };
  showUploadInfoBanner: boolean;
  setShowUploadInfoBanner: (v: boolean) => void;
  isEditMode: boolean;
  isSaving: boolean;
  continueLabel: string;
  errorMessage: string | null;
  initialSignatureUrl: string;
  initialPhotoUrl: string;
  initialIdentityUrl?: string;
  initialAddressUrl?: string;
  identityUploaded?: boolean;
  addressUploaded?: boolean;
  onPrevious: () => void;
  onContinue: () => void;
  onConfirmSignatureUpload: (file: File) => Promise<boolean>;
  onConfirmPhotoUpload: (file: File) => Promise<boolean>;
  onConfirmIdentityUpload?: (file: File) => Promise<boolean>;
  onConfirmAddressUpload?: (file: File) => Promise<boolean>;
  onRemoveSignature: () => void;
  onRemovePhoto: () => void;
  onRemoveIdentity?: () => void;
  onRemoveAddress?: () => void;
}

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.25 4.5H16.5V3.75C16.5 3.15326 16.2629 2.58097 15.841 2.15901C15.419 1.73705 14.8467 1.5 14.25 1.5H9.75C9.15326 1.5 8.58097 1.73705 8.15901 2.15901C7.73705 2.58097 7.5 3.15326 7.5 3.75V4.5H3.75C3.55109 4.5 3.36032 4.57902 3.21967 4.71967C3.07902 4.86032 3 5.05109 3 5.25C3 5.44891 3.07902 5.63968 3.21967 5.78033C3.36032 5.92098 3.55109 6 3.75 6H4.5V19.5C4.5 19.8978 4.65804 20.2794 4.93934 20.5607C5.22064 20.842 5.60218 21 6 21H18C18.3978 21 18.7794 20.842 19.0607 20.5607C19.342 20.2794 19.5 19.8978 19.5 19.5V6H20.25C20.4489 6 20.6397 5.92098 20.7803 5.78033C20.921 5.63968 21 5.44891 21 5.25C21 5.05109 20.921 4.86032 20.7803 4.71967C20.6397 4.57902 20.4489 4.5 20.25 4.5ZM9 3.75C9 3.55109 9.07902 3.36032 9.21967 3.21967C9.36032 3.07902 9.55109 3 9.75 3H14.25C14.4489 3 14.6397 3.07902 14.7803 3.21967C14.921 3.36032 15 3.55109 15 3.75V4.5H9V3.75ZM18 19.5H6V6H18V19.5ZM10.5 9.75V15.75C10.5 15.9489 10.421 16.1397 10.2803 16.2803C10.1397 16.421 9.94891 16.5 9.75 16.5C9.55109 16.5 9.36032 16.421 9.21967 16.2803C9.07902 16.1397 9 15.9489 9 15.75V9.75C9 9.55109 9.07902 9.36032 9.21967 9.21967C9.36032 9.07902 9.55109 9 9.75 9C9.94891 9 10.1397 9.07902 10.2803 9.21967C10.421 9.36032 10.5 9.55109 10.5 9.75ZM15 9.75V15.75C15 15.9489 14.921 16.1397 14.7803 16.2803C14.6397 16.421 14.4489 16.5 14.25 16.5C14.0511 16.5 13.8603 16.421 13.7197 16.2803C13.579 16.1397 13.5 15.9489 13.5 15.75V9.75C13.5 9.55109 13.579 9.36032 13.7197 9.21967C13.8603 9.07902 14.0511 9 14.25 9C14.4489 9 14.6397 9.07902 14.7803 9.21967C14.921 9.36032 15 9.55109 15 9.75Z"
        fill="#93161E"
      />
    </svg>
  );
}

function PreviewDialogShell({
  title,
  onCancel,
  onSave,
  saveDisabled,
  saveLabel,
  children,
}: {
  title: string;
  onCancel: () => void;
  onSave: () => void;
  saveDisabled?: boolean;
  saveLabel?: string;
  children: ReactElement;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 overflow-y-auto backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)]" onClick={onCancel} />
      <div className="relative bg-white rounded-[16px] drop-shadow-[4px_4px_20px_rgba(0,0,0,0.12)] flex flex-col gap-[16px] p-[20px] md:p-[32px] w-[calc(100%-32px)] max-w-[679.5px]">
        <div className="flex h-[33px] items-center justify-between w-full shrink-0">
          <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#435160] text-[22px] whitespace-nowrap">{title}</p>
          <button onClick={onCancel} className="overflow-clip size-[24px] hover:opacity-70 transition-opacity">
            <svg className="size-full" fill="none" viewBox="0 0 15.0008 15.0008">
              <path d={modalSvgPaths.p3bbf7480} fill="#435160" />
            </svg>
          </button>
        </div>

        <div className="relative rounded-[8px] w-full border border-dotted border-[#EEEEEE]">
          {children}
        </div>

        <div className="flex gap-[24px] items-center w-full shrink-0">
          <button onClick={onCancel} className="flex-1 h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center hover:border-[#c7aa7b] transition-colors">
            <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Cancel</p>
          </button>
          <button
            onClick={onSave}
            disabled={saveDisabled}
            className={`flex-1 h-[36px] rounded-[8px] flex items-center justify-center transition-colors ${saveDisabled ? 'bg-[#e5e5e6] cursor-not-allowed' : 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
              }`}
          >
            <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${saveDisabled ? 'text-[#5a6b7d]' : 'text-white'}`}>
              {saveLabel ?? 'Save'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Upload Signature Modal ─────────────────────────────────────────────── */

function UploadSignatureModal({
  title,
  previewUrl,
  onTrash,
  onCancel,
  onSave,
}: {
  title: string;
  previewUrl: string;
  onTrash: () => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <PreviewDialogShell title={title} onCancel={onCancel} onSave={onSave}>
      <div className="flex flex-col items-center justify-center p-[12px]">
        <div className="flex gap-[16px] items-start justify-end w-full">
          <div className="flex-1 relative" style={{ height: '211px' }}>
            <div className="absolute inset-0 overflow-hidden">
              <img alt="Uploaded document" className="absolute inset-0 w-full h-full object-contain" src={previewUrl} />
            </div>
          </div>
          <button onClick={onTrash} className="overflow-clip size-[24px] shrink-0 hover:opacity-70 transition-opacity mt-[4px]" title="Remove">
            <TrashIcon className="size-full" />
          </button>
        </div>
      </div>
    </PreviewDialogShell>
  );
}

/* ─── Guideline Strip ────────────────────────────────────────────────────── */

function GuidelinePreview({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2px] bg-white">
      <img alt={alt} className="absolute inset-0 w-full h-full object-cover" src={src} />
    </div>
  );
}

function OverlayStatusIcon({ variant }: { variant: 'good' | 'bad' }) {
  const isGood = variant === 'good';
  return (
    <div className="absolute left-1/2 top-full z-10 size-[9.75px] -translate-x-1/2 -mt-[-20px] overflow-clip pointer-events-none">
      <svg className="size-full" fill="none" viewBox="0 0 9.75 9.75">
        <path d={isGood ? svgPaths.p3fa6ec00 : svgPaths.pe3f6400} fill={isGood ? '#37B400' : '#E8402F'} />
      </svg>
    </div>
  );
}

function GoodTile({ src }: { src: string }) {
  return (
    <div className="bg-[#eeffe5] flex-1 min-w-px relative rounded-[5.851px]">
      <div className="flex items-center justify-center p-[5.851px] size-full">
        <div className="flex flex-col gap-[5.851px] items-center justify-center relative w-full">
          <div className="relative w-full" style={{ aspectRatio: '141/115' }}>
            <GuidelinePreview src={src} alt="Clear document" />
            <OverlayStatusIcon variant="good" />
          </div>
          <div className="flex gap-[2.926px] items-center">
            <svg className="size-[10.24px] shrink-0" fill="none" viewBox="0 0 8.32 8.32">
              <path d={svgPaths.p3d2cfb00} fill="#37B400" />
            </svg>
            <p className="font-['Mulish',sans-serif] font-normal leading-[1.1] text-[#37b400] text-[6.583px] whitespace-nowrap">Clear &amp; Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BadTile({ label, src }: { label: string; src: string }) {
  return (
    <div className="bg-[#fff0e5] flex-1 min-w-px relative rounded-[5.851px]">
      <div className="flex items-center justify-center p-[5.851px] size-full">
        <div className="flex flex-col gap-[5.851px] items-center justify-center relative w-full">
          <div className="relative w-full" style={{ aspectRatio: '141/115' }}>
            <GuidelinePreview src={src} alt={label} />
            <OverlayStatusIcon variant="bad" />
          </div>
          <div className="flex gap-[2.926px] items-center">
            <svg className="size-[10.24px] shrink-0" fill="none" viewBox="0 0 8.32 8.32">
              <path d={svgPaths.p1450c700} fill="#E8402F" />
            </svg>
            <p className="font-['Mulish',sans-serif] font-normal leading-[1.1] text-[#e8402f] text-[6.583px] whitespace-nowrap">{label}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignatureGuidelineStrip() {
  return (
    <div className="bg-[#f5f5f5] rounded-[4px] w-full shrink-0">
      <div className="flex gap-[8px] items-stretch p-[8px]">
        <GoodTile src={imgSignGuideline1} />
        <BadTile label="Half cut / Incomplete" src={imgSignGuideline2} />
        <BadTile label="Blurry / Out of focus" src={imgSignGuideline3} />
        <BadTile label="Poor lighting / Glare" src={imgSignGuideline4} />
      </div>
    </div>
  );
}

function PhotoGuidelineStrip() {
  return (
    <div className="bg-[#f5f5f5] rounded-[4px] w-full shrink-0">
      <div className="flex gap-[8px] items-stretch p-[8px]">
        <GoodTile src={imgPhotoGuideline1} />
        <BadTile label="Half cut / Incomplete" src={imgPhotoGuideline2} />
        <BadTile label="Blurry / Out of focus" src={imgPhotoGuideline3} />
        <BadTile label="Poor lighting / Glare" src={imgPhotoGuideline4} />
      </div>
    </div>
  );
}

function DocumentGuidelineStrip() {
  return <UploadImageGuidelines showTitle={false} />;
}

function renderGuidelineStrip(cardType: 'signature' | 'photo' | 'document') {
  if (cardType === 'signature') {
    return <SignatureGuidelineStrip />;
  }
  if (cardType === 'document') {
    return <DocumentGuidelineStrip />;
  }
  return <PhotoGuidelineStrip />;
}

/* ─── Desktop Upload Card ────────────────────────────────────────────────── */

function UploadCard({
  title,
  uploaded,
  previewUrl,
  onCaptureClick,
  onUploadClick,
  onRemove,
  cardType,
}: {
  title: string;
  uploaded: boolean;
  previewUrl?: string;
  onCaptureClick: () => void;
  onUploadClick: () => void;
  onRemove: () => void;
  cardType: 'signature' | 'photo' | 'document';
}) {
  const cardCls = 'bg-white flex-1 min-w-px rounded-[8px] border border-[#eee] flex flex-col gap-[12px] p-[14px]';

  if (uploaded && previewUrl) {
    return (
      <div className={cardCls}>
        <div className="flex gap-[4px] items-center shrink-0">
          <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#231F20] text-[14px] whitespace-nowrap">{title}</p>
          <div className="overflow-clip size-[16px] shrink-0">
            <svg className="size-full" fill="none" viewBox="0 0 13 13">
              <path d={svgPaths.p1835e980} fill="#5A6B7D" />
            </svg>
          </div>
        </div>
        <div className="flex-1 rounded-[8px] border border-[#eee] flex flex-col p-[12px] gap-[12px]">
          <div className="flex justify-end shrink-0">
            <button onClick={onRemove} className="overflow-clip size-[24px] hover:opacity-70 transition-opacity">
              <TrashIcon className="size-full" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <img alt="Uploaded document" className="max-w-full max-h-full object-contain" src={previewUrl} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between w-full gap-[12px] shrink-0">
        <div className="flex flex-col gap-[4px] min-w-0">
          <div className="flex gap-[4px] items-center">
            <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#231F20] text-[14px] whitespace-nowrap">{title}</p>
            <div className="overflow-clip size-[16px] shrink-0">
              <svg className="size-full" fill="none" viewBox="0 0 13 13">
                <path d={svgPaths.p1835e980} fill="#5A6B7D" />
              </svg>
            </div>
          </div>
          <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#71859B] text-[12px] max-w-[267px]">Format Supported: PNG, PDF or JPEG up to 2MB</p>
        </div>
        <div className="flex gap-[12px] items-center shrink-0">
          <button onClick={onCaptureClick} className="flex gap-[8px] h-[36px] items-center justify-center px-[21px] py-[7px] rounded-[8px] border border-[#eee] hover:border-[#c7aa7b] transition-colors">
            <div className="overflow-clip size-[16px] shrink-0">
              <svg className="size-full" fill="none" viewBox="0 0 13 11.5">
                <path d={svgPaths.pf78bc00} fill="#435160" />
              </svg>
            </div>
            <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-center text-[#435160] text-[14px] whitespace-nowrap">Capture</p>
          </button>
          <button
            onClick={onUploadClick}
            className="bg-[#93161e] hover:bg-[#7a1319] transition-colors flex h-[36px] items-center justify-center px-[21px] py-[7px] rounded-[8px]"
          >
            <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-center text-white text-[14px] whitespace-nowrap">Upload</p>
          </button>
        </div>
      </div>
      {renderGuidelineStrip(cardType)}
    </div>
  );
}

/* ─── Mobile Upload Card ─────────────────────────────────────────────────── */

function MobileUploadCard({
  title,
  uploaded,
  previewUrl,
  onCaptureClick,
  onUploadClick,
  onRemove,
  cardType,
}: {
  title: string;
  uploaded: boolean;
  previewUrl?: string;
  onCaptureClick: () => void;
  onUploadClick: () => void;
  onRemove: () => void;
  cardType: 'signature' | 'photo' | 'document';
}) {
  if (uploaded && previewUrl) {
    return (
      <div className="bg-white rounded-[8px] border border-[#eee] flex flex-col gap-[12px] p-[14px]">
        <div className="flex gap-[4px] items-center">
          <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#231F20] text-[14px]">{title}</p>
          <div className="overflow-clip size-[16px] shrink-0">
            <svg className="size-full" fill="none" viewBox="0 0 13 13">
              <path d={svgPaths.p1835e980} fill="#5A6B7D" />
            </svg>
          </div>
        </div>
        <div className="rounded-[8px] border border-[#eee] flex flex-col p-[10px] gap-[8px]" style={{ minHeight: '140px' }}>
          <div className="flex justify-end shrink-0">
            <button onClick={onRemove} className="overflow-clip size-[20px] hover:opacity-70 transition-opacity">
              <TrashIcon className="size-full" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <img alt="Uploaded document" className="max-w-full max-h-[110px] object-contain" src={previewUrl} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[8px] border border-[#eee] flex flex-col gap-[12px] p-[14px]">
      <div className="flex flex-col gap-[4px] items-start w-full">
        <div className="flex gap-[4px] items-center">
          <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#231F20] text-[14px] whitespace-nowrap">{title}</p>
          <div className="overflow-clip shrink-0 size-[16px]">
            <svg className="size-full" fill="none" viewBox="0 0 13 13">
              <path d={svgPaths.p1835e980} fill="#5A6B7D" />
            </svg>
          </div>
        </div>
        <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#71859B] text-[12px]">Format Supported: PNG, PDF or JPEG up to 2MB</p>
      </div>

      {renderGuidelineStrip(cardType)}

      <div className="flex gap-[12px] items-center w-full">
        <div onClick={onCaptureClick} className="flex-1 min-w-px h-[36px] rounded-[8px] border border-[#eee] hover:border-[#c7aa7b] transition-colors flex items-center justify-center gap-[8px]">
          <div className="overflow-clip shrink-0 size-[16px]">
            <svg className="size-full" fill="none" viewBox="0 0 13 11.5">
              <path d={svgPaths.pf78bc00} fill="#435160" />
            </svg>
          </div>
          <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-center text-[#435160] text-[14px] whitespace-nowrap">Capture</p>
        </div>
        <button
          onClick={onUploadClick}
          className="bg-[#93161e] hover:bg-[#7a1319] transition-colors flex-1 min-w-px h-[36px] rounded-[8px] flex items-center justify-center"
        >
          <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-center text-white text-[14px] whitespace-nowrap">Upload</p>
        </button>
      </div>
    </div>
  );
}

/* ─── Main Screen ────────────────────────────────────────────────────────── */

export function UploadDocumentsScreen({
  signatureUploaded,
  photoUploaded,
  identityUploaded = false,
  addressUploaded = false,
  showUploadInfoBanner,
  documentRules,
  setShowUploadInfoBanner,
  isEditMode,
  isSaving,
  continueLabel,
  errorMessage,
  initialSignatureUrl,
  initialPhotoUrl,
  initialIdentityUrl = '',
  initialAddressUrl = '',
  onPrevious,
  onContinue,
  onConfirmSignatureUpload,
  onConfirmPhotoUpload,
  onConfirmIdentityUpload,
  onConfirmAddressUpload,
  onRemoveSignature,
  onRemovePhoto,
  onRemoveIdentity,
  onRemoveAddress,
}: Props) {
  const requiresSignature = documentRules?.requiresSignature ?? true;
  const requiresPhoto = documentRules?.requiresPhoto ?? true;
  const requiresProofDocs = documentRules?.requiresProofDocs ?? false;
  const canContinue =
    !isSaving &&
    (!requiresSignature || signatureUploaded) &&
    (!requiresPhoto || photoUploaded) &&
    (!requiresProofDocs || (identityUploaded && addressUploaded));
  /* Signature upload state */
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState<string>(initialSignatureUrl);
  const [signatureObjectUrl, setSignatureObjectUrl] = useState<string>('');
  const [pendingSignatureFile, setPendingSignatureFile] = useState<File | null>(null);
  const sigFileInputRef = useRef<HTMLInputElement>(null);
  const [cameraTarget, setCameraTarget] = useState<'signature' | 'photo' | 'identity' | 'address' | null>(null);

  /* Photo upload state */
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>(initialPhotoUrl);
  const [photoObjectUrl, setPhotoObjectUrl] = useState<string>('');
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [identityPreviewUrl, setIdentityPreviewUrl] = useState<string>(initialIdentityUrl);
  const [identityObjectUrl, setIdentityObjectUrl] = useState<string>('');
  const [pendingIdentityFile, setPendingIdentityFile] = useState<File | null>(null);
  const identityFileInputRef = useRef<HTMLInputElement>(null);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressPreviewUrl, setAddressPreviewUrl] = useState<string>(initialAddressUrl);
  const [addressObjectUrl, setAddressObjectUrl] = useState<string>('');
  const [pendingAddressFile, setPendingAddressFile] = useState<File | null>(null);
  const addressFileInputRef = useRef<HTMLInputElement>(null);

  function validateSelectedFile(file: File, fileLabel: string): boolean {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      console.warn(`Invalid ${fileLabel} file type selected. Allowed types: PNG, JPEG, PDF.`);
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      console.warn(`Invalid ${fileLabel} file size. Maximum allowed size is 2MB.`);
      return false;
    }

    return true;
  }

  function prepareSignaturePreview(file: File) {
    if (!validateSelectedFile(file, 'signature')) {
      return;
    }

    if (signatureObjectUrl) {
      URL.revokeObjectURL(signatureObjectUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSignatureObjectUrl(objectUrl);
    setSignaturePreviewUrl(objectUrl);
    setPendingSignatureFile(file);
    setShowSignatureModal(true);
  }

  function preparePhotoPreview(file: File) {
    if (!validateSelectedFile(file, 'photo')) {
      return;
    }

    if (photoObjectUrl) {
      URL.revokeObjectURL(photoObjectUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPhotoObjectUrl(objectUrl);
    setPhotoPreviewUrl(objectUrl);
    setPendingPhotoFile(file);
    setShowPhotoModal(true);
  }

  function prepareIdentityPreview(file: File) {
    if (!validateSelectedFile(file, 'identity')) {
      return;
    }

    if (identityObjectUrl) {
      URL.revokeObjectURL(identityObjectUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setIdentityObjectUrl(objectUrl);
    setIdentityPreviewUrl(objectUrl);
    setPendingIdentityFile(file);
    setShowIdentityModal(true);
  }

  function prepareAddressPreview(file: File) {
    if (!validateSelectedFile(file, 'address')) {
      return;
    }

    if (addressObjectUrl) {
      URL.revokeObjectURL(addressObjectUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setAddressObjectUrl(objectUrl);
    setAddressPreviewUrl(objectUrl);
    setPendingAddressFile(file);
    setShowAddressModal(true);
  }

  function handleSignatureCaptureClick() {
    setCameraTarget('signature');
  }

  async function handleCameraSave(file: File) {
    if (cameraTarget === 'signature') {
      await onConfirmSignatureUpload(file);
    } else if (cameraTarget === 'photo') {
      await onConfirmPhotoUpload(file);
    } else if (cameraTarget === 'identity') {
      await onConfirmIdentityUpload?.(file);
    } else if (cameraTarget === 'address') {
      await onConfirmAddressUpload?.(file);
    }

    setCameraTarget(null);
  }

  function handlePhotoCaptureClick() {
    setCameraTarget('photo');
  }

  function handleIdentityCaptureClick() {
    setCameraTarget('identity');
  }

  function handleAddressCaptureClick() {
    setCameraTarget('address');
  }

  function triggerInput(ref: { current: HTMLInputElement | null }) {
    const input = ref.current;
    if (!input) {
      return;
    }

    input.accept = 'image/png,image/jpeg,application/pdf';
    input.removeAttribute('capture');

    input.click();
  }

  function handleSignatureUploadClick() { triggerInput(sigFileInputRef); }
  function handleSignatureFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    prepareSignaturePreview(file);
    e.target.value = '';
  }
  useEffect(() => {
    if (!showSignatureModal && initialSignatureUrl) {
      setSignaturePreviewUrl(initialSignatureUrl);
    }
  }, [initialSignatureUrl, showSignatureModal]);

  useEffect(() => {
    if (!showPhotoModal && initialPhotoUrl) {
      setPhotoPreviewUrl(initialPhotoUrl);
    }
  }, [initialPhotoUrl, showPhotoModal]);

  useEffect(() => {
    if (!showIdentityModal && initialIdentityUrl) {
      setIdentityPreviewUrl(initialIdentityUrl);
    }
  }, [initialIdentityUrl, showIdentityModal]);

  useEffect(() => {
    if (!showAddressModal && initialAddressUrl) {
      setAddressPreviewUrl(initialAddressUrl);
    }
  }, [initialAddressUrl, showAddressModal]);

  function handleSignatureTrash() {
    if (signatureObjectUrl) {
      URL.revokeObjectURL(signatureObjectUrl);
    }
    setShowSignatureModal(false);
    setSignatureObjectUrl('');
    setPendingSignatureFile(null);
    setSignaturePreviewUrl(initialSignatureUrl);
    if (sigFileInputRef.current) {
      sigFileInputRef.current.value = '';
    }
  }
  function handleSignatureCancel() {
    handleSignatureTrash();
  }
  async function handleSignatureSave() {
    if (!pendingSignatureFile) {
      setShowSignatureModal(false);
      return;
    }

    const uploaded = await onConfirmSignatureUpload(pendingSignatureFile);
    if (!uploaded) {
      return;
    }

    if (signatureObjectUrl) {
      URL.revokeObjectURL(signatureObjectUrl);
    }
    setSignatureObjectUrl('');
    setPendingSignatureFile(null);
    setShowSignatureModal(false);
  }
  function handleSignatureRemove() {
    if (signatureObjectUrl) {
      URL.revokeObjectURL(signatureObjectUrl);
    }
    setSignatureObjectUrl('');
    setPendingSignatureFile(null);
    setSignaturePreviewUrl('');
    onRemoveSignature();
  }

  function handlePhotoUploadClick() { triggerInput(photoFileInputRef); }
  function handlePhotoFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    preparePhotoPreview(file);
    e.target.value = '';
  }
  function handlePhotoTrash() {
    if (photoObjectUrl) {
      URL.revokeObjectURL(photoObjectUrl);
    }
    setShowPhotoModal(false);
    setPhotoObjectUrl('');
    setPendingPhotoFile(null);
    setPhotoPreviewUrl(initialPhotoUrl);
    if (photoFileInputRef.current) {
      photoFileInputRef.current.value = '';
    }
  }
  function handlePhotoCancel() {
    handlePhotoTrash();
  }
  async function handlePhotoSave() {
    if (!pendingPhotoFile) {
      setShowPhotoModal(false);
      return;
    }

    const uploaded = await onConfirmPhotoUpload(pendingPhotoFile);
    if (!uploaded) {
      return;
    }

    if (photoObjectUrl) {
      URL.revokeObjectURL(photoObjectUrl);
    }
    setPhotoObjectUrl('');
    setPendingPhotoFile(null);
    setShowPhotoModal(false);
  }
  function handlePhotoRemove() {
    if (photoObjectUrl) {
      URL.revokeObjectURL(photoObjectUrl);
    }
    setPhotoObjectUrl('');
    setPendingPhotoFile(null);
    setPhotoPreviewUrl('');
    onRemovePhoto();
  }

  function handleIdentityUploadClick() { triggerInput(identityFileInputRef); }
  function handleIdentityFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    prepareIdentityPreview(file);
    e.target.value = '';
  }
  function handleIdentityTrash() {
    if (identityObjectUrl) {
      URL.revokeObjectURL(identityObjectUrl);
    }
    setShowIdentityModal(false);
    setIdentityObjectUrl('');
    setPendingIdentityFile(null);
    setIdentityPreviewUrl(initialIdentityUrl);
    if (identityFileInputRef.current) {
      identityFileInputRef.current.value = '';
    }
  }
  async function handleIdentitySave() {
    if (!pendingIdentityFile) {
      setShowIdentityModal(false);
      return;
    }

    const uploaded = await onConfirmIdentityUpload?.(pendingIdentityFile);
    if (!uploaded) {
      return;
    }

    if (identityObjectUrl) {
      URL.revokeObjectURL(identityObjectUrl);
    }
    setIdentityObjectUrl('');
    setPendingIdentityFile(null);
    setShowIdentityModal(false);
  }
  function handleIdentityRemove() {
    if (identityObjectUrl) {
      URL.revokeObjectURL(identityObjectUrl);
    }
    setIdentityObjectUrl('');
    setPendingIdentityFile(null);
    setIdentityPreviewUrl('');
    onRemoveIdentity?.();
  }

  function handleAddressUploadClick() { triggerInput(addressFileInputRef); }
  function handleAddressFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    prepareAddressPreview(file);
    e.target.value = '';
  }
  function handleAddressTrash() {
    if (addressObjectUrl) {
      URL.revokeObjectURL(addressObjectUrl);
    }
    setShowAddressModal(false);
    setAddressObjectUrl('');
    setPendingAddressFile(null);
    setAddressPreviewUrl(initialAddressUrl);
    if (addressFileInputRef.current) {
      addressFileInputRef.current.value = '';
    }
  }
  async function handleAddressSave() {
    if (!pendingAddressFile) {
      setShowAddressModal(false);
      return;
    }

    const uploaded = await onConfirmAddressUpload?.(pendingAddressFile);
    if (!uploaded) {
      return;
    }

    if (addressObjectUrl) {
      URL.revokeObjectURL(addressObjectUrl);
    }
    setAddressObjectUrl('');
    setPendingAddressFile(null);
    setShowAddressModal(false);
  }
  function handleAddressRemove() {
    if (addressObjectUrl) {
      URL.revokeObjectURL(addressObjectUrl);
    }
    setAddressObjectUrl('');
    setPendingAddressFile(null);
    setAddressPreviewUrl('');
    onRemoveAddress?.();
  }

  useEffect(() => {
    return () => {
      if (signatureObjectUrl) {
        URL.revokeObjectURL(signatureObjectUrl);
      }
      if (photoObjectUrl) {
        URL.revokeObjectURL(photoObjectUrl);
      }
      if (identityObjectUrl) {
        URL.revokeObjectURL(identityObjectUrl);
      }
      if (addressObjectUrl) {
        URL.revokeObjectURL(addressObjectUrl);
      }
    };
  }, [addressObjectUrl, identityObjectUrl, photoObjectUrl, signatureObjectUrl]);

  return (
    <>
      {/* Hidden file inputs */}
      <input ref={sigFileInputRef} type="file" accept="image/png,image/jpeg,application/pdf" className="hidden" onChange={handleSignatureFileChange} />
      <input ref={photoFileInputRef} type="file" accept="image/png,image/jpeg,application/pdf" className="hidden" onChange={handlePhotoFileChange} />
      <input ref={identityFileInputRef} type="file" accept="image/png,image/jpeg,application/pdf" className="hidden" onChange={handleIdentityFileChange} />
      <input ref={addressFileInputRef} type="file" accept="image/png,image/jpeg,application/pdf" className="hidden" onChange={handleAddressFileChange} />

      {/* Upload Signature Modal */}
      {showSignatureModal && signaturePreviewUrl && (
        <UploadSignatureModal
          title="Upload Signature"
          previewUrl={signaturePreviewUrl}
          onTrash={handleSignatureTrash}
          onCancel={handleSignatureCancel}
          onSave={handleSignatureSave}
        />
      )}

      {/* Upload Photo Modal */}
      {showPhotoModal && photoPreviewUrl && (
        <UploadSignatureModal
          title="Upload Photo"
          previewUrl={photoPreviewUrl}
          onTrash={handlePhotoTrash}
          onCancel={handlePhotoCancel}
          onSave={handlePhotoSave}
        />
      )}

      {showIdentityModal && identityPreviewUrl && (
        <UploadSignatureModal
          title="Upload Proof of Identity"
          previewUrl={identityPreviewUrl}
          onTrash={handleIdentityTrash}
          onCancel={handleIdentityTrash}
          onSave={handleIdentitySave}
        />
      )}

      {showAddressModal && addressPreviewUrl && (
        <UploadSignatureModal
          title="Upload Proof of Address"
          previewUrl={addressPreviewUrl}
          onTrash={handleAddressTrash}
          onCancel={handleAddressTrash}
          onSave={handleAddressSave}
        />
      )}

      {cameraTarget ? (
        <CameraCaptureModal
          title={
            cameraTarget === 'signature'
              ? 'Capture Signature'
              : cameraTarget === 'photo'
                ? 'Capture Photo'
                : cameraTarget === 'identity'
                  ? 'Capture Proof of Identity'
                  : 'Capture Proof of Address'
          }
          onCancel={() => setCameraTarget(null)}
          onSave={handleCameraSave}
        />
      ) : null}

      {/* ── Desktop View ── */}
      <div className="hidden lg:block">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-[24px]">
          <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#231f20] text-[22px]">Upload Documents</p>

          <div className="flex flex-col gap-[8px]">
            {/* Step / progress */}
            <div className="flex items-center justify-between font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px] w-full">
              <p>Step 5 of 6</p>
              <p>75%</p>
            </div>

            {/* White card */}
            <div className="bg-white rounded-[16px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] w-full overflow-hidden">
              {/* Progress bar */}
              <div className="bg-[#e6e7e8] h-[8px] rounded-[999px] w-full overflow-hidden">
                <div className="bg-[#37b400] h-full rounded-[999px]" style={{ width: '75%' }} />
              </div>

              <div className="flex flex-col gap-[20px] p-[16px]">
                {errorMessage ? (
                  <p className="text-sm text-[#e2585f]">{errorMessage}</p>
                ) : null}
                {/* Info banner */}
                {showUploadInfoBanner && (
                  <div className="bg-[#E8F1FB] h-[32px] rounded-[8px] flex items-center justify-between px-[12px] shrink-0">
                    <div className="flex gap-[8px] items-center flex-1 min-w-0">
                      <div className="overflow-clip size-[16px] shrink-0">
                        <svg className="size-full" fill="none" viewBox="0 0 13 13">
                          <path d={svgPaths.p1835e980} fill="#193D6C" />
                        </svg>
                      </div>
                      <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#231F20] text-[12px] whitespace-nowrap">
                        Upload a clear and properly aligned file (JPG, PNG, or PDF) under 2MB, ensuring it is readable and not blurred or corrupted.
                      </p>
                    </div>
                    <button onClick={() => setShowUploadInfoBanner(false)} className="overflow-clip size-[16px] shrink-0 hover:opacity-70 transition-opacity ml-[8px]">
                      <svg className="size-full" fill="none" viewBox="0 0 10.0006 10.0006">
                        <path d={svgPaths.p2662980} fill="#193D6C" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Two upload cards — items-stretch ensures equal height */}
                <div className="flex flex-col gap-[20px] w-full">
                  {requiresProofDocs ? (
                    <div className="flex gap-[20px] items-stretch w-full">
                      <UploadCard
                        title="Proof of Identity"
                        uploaded={identityUploaded}
                        previewUrl={identityPreviewUrl}
                        onCaptureClick={handleIdentityCaptureClick}
                        onUploadClick={handleIdentityUploadClick}
                        onRemove={handleIdentityRemove}
                        cardType="document"
                      />
                      <UploadCard
                        title="Proof of Address"
                        uploaded={addressUploaded}
                        previewUrl={addressPreviewUrl}
                        onCaptureClick={handleAddressCaptureClick}
                        onUploadClick={handleAddressUploadClick}
                        onRemove={handleAddressRemove}
                        cardType="document"
                      />
                    </div>
                  ) : null}
                  <div className="flex gap-[20px] items-stretch w-full">
                    <UploadCard
                      title="Specimen Signature"
                      uploaded={signatureUploaded}
                      previewUrl={signaturePreviewUrl}
                      onCaptureClick={handleSignatureCaptureClick}
                      onUploadClick={handleSignatureUploadClick}
                      onRemove={handleSignatureRemove}
                      cardType="signature"
                    />
                    <UploadCard
                      title="Photo Upload"
                      uploaded={photoUploaded}
                      previewUrl={photoPreviewUrl}
                      onCaptureClick={handlePhotoCaptureClick}
                      onUploadClick={handlePhotoUploadClick}
                      onRemove={handlePhotoRemove}
                      cardType="photo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile / Tablet View ── */}
      <div className="relative z-10 flex w-full flex-col lg:hidden">
        <div className="relative z-10 flex flex-col gap-[20px]">
          <p className="font-['Mulish',sans-serif] font-medium leading-[28px] text-[#231f20] text-[20px]">Upload Documents</p>

          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">
              <p>Step 5 of 6</p>
              <p>80%</p>
            </div>

            <div className="bg-white rounded-[16px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] w-full overflow-hidden">
              <div className="bg-[#e6e7e8] h-[8px] rounded-[999px] w-full overflow-hidden">
                <div className="bg-[#37b400] h-full rounded-[999px]" style={{ width: '80%' }} />
              </div>

              <div className="flex flex-col gap-[16px] p-[16px]">
                {errorMessage ? (
                  <p className="text-sm text-[#e2585f]">{errorMessage}</p>
                ) : null}
                {showUploadInfoBanner && (
                  <div className="bg-[#E8F1FB] rounded-[8px] flex items-start justify-between gap-[8px] p-[12px]">
                    <div className="flex gap-[8px] items-start flex-1">
                      <div className="overflow-clip size-[16px] shrink-0 mt-[1px]">
                        <svg className="size-full" fill="none" viewBox="0 0 13 13">
                          <path d={svgPaths.p1835e980} fill="#193D6C" />
                        </svg>
                      </div>
                      <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#231F20] text-[12px]">
                        Upload a clear and properly aligned file (JPG, PNG, or PDF) under 2MB, ensuring it is readable and not blurred or corrupted.
                      </p>
                    </div>
                    <button onClick={() => setShowUploadInfoBanner(false)} className="overflow-clip size-[16px] shrink-0 hover:opacity-70 transition-opacity mt-[1px]">
                      <svg className="size-full" fill="none" viewBox="0 0 10.0006 10.0006">
                        <path d={svgPaths.p2662980} fill="#193D6C" />
                      </svg>
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-[16px]">
                  {requiresProofDocs ? (
                    <>
                      <MobileUploadCard
                        title="Proof of Identity"
                        uploaded={identityUploaded}
                        previewUrl={identityPreviewUrl}
                        onCaptureClick={handleIdentityCaptureClick}
                        onUploadClick={handleIdentityUploadClick}
                        onRemove={handleIdentityRemove}
                        cardType="document"
                      />
                      <MobileUploadCard
                        title="Proof of Address"
                        uploaded={addressUploaded}
                        previewUrl={addressPreviewUrl}
                        onCaptureClick={handleAddressCaptureClick}
                        onUploadClick={handleAddressUploadClick}
                        onRemove={handleAddressRemove}
                        cardType="document"
                      />
                    </>
                  ) : null}
                  <MobileUploadCard
                    title="Specimen Signature"
                    uploaded={signatureUploaded}
                    previewUrl={signaturePreviewUrl}
                    onCaptureClick={handleSignatureCaptureClick}
                    onUploadClick={handleSignatureUploadClick}
                    onRemove={handleSignatureRemove}
                    cardType="signature"
                  />
                  <MobileUploadCard
                    title="Photo Upload"
                    uploaded={photoUploaded}
                    previewUrl={photoPreviewUrl}
                    onCaptureClick={handlePhotoCaptureClick}
                    onUploadClick={handlePhotoUploadClick}
                    onRemove={handlePhotoRemove}
                    cardType="photo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OnboardingStepFooter
        nextLabel={isEditMode ? null : 'Review & Confirm'}
        showPrevious={!isEditMode}
        onPrevious={onPrevious}
        previousDisabled={isSaving}
        continueLabel={isEditMode ? 'Go to Review' : 'Continue'}
        continueDisabled={!canContinue}
        isLoading={isSaving}
        loadingLabel={continueLabel}
        hideContinueArrow={isEditMode && !isSaving}
        onContinue={() => {
          if (canContinue) {
            onContinue();
          }
        }}
      />
    </>
  );
}

const UploadDocumentsStep = ({
  onBack,
  onContinue,
  isEditMode = false,
  onGoToReview,
  documentRules,
}: UploadDocumentsStepProps): ReactElement => {
  const { currentFlow, onboardingMethod } = useOnboardingStore();
  const requiresProofDocs =
    currentFlow === "aif-individual" &&
    (onboardingMethod === "MANUAL");
  const [showUploadInfoBanner, setShowUploadInfoBanner] = useState(true);
  const {
    photoDisplayUrl,
    signatureDisplayUrl,
    identityDisplayUrl,
    addressDisplayUrl,
    photoUploaded,
    signatureUploaded,
    identityUploaded,
    addressUploaded,
    isLoading,
    isUploadingPhoto,
    isUploadingSignature,
    isUploadingIdentity,
    isUploadingAddress,
    isSaving,
    error,
    canContinue,
    uploadPhoto,
    uploadSignature,
    uploadIdentity,
    uploadAddress,
    clearPhoto,
    clearSignature,
    clearIdentity,
    clearAddress,
    saveDocuments,
  } = useDocumentsFlow({
    requiresPhoto: documentRules?.requiresPhoto ?? true,
    requiresSignature: documentRules?.requiresSignature ?? true,
    requiresProofDocs,
  });

  const resolvedDocumentRules = {
    ...documentRules,
    requiresProofDocs,
  };

  const handleContinue = async () => {
    if (!canContinue) {
      return;
    }

    const saved = await saveDocuments();
    if (!saved) {
      return;
    }

    if (isEditMode && onGoToReview) {
      onGoToReview();
      return;
    }

    onContinue();
  };

  if (isLoading) {
    return (
      <OnboardingStepSkeleton
        nextLabel="Review & Confirm"
        progressPercent={80}
        stepLabel="Step 5 of 6"
        subtitle="Upload a clear and properly aligned file (JPG, PNG, or PDF) under 2MB."
        title="Upload Documents"
      />
    );
  }

  const isUploadingAny =
    isUploadingPhoto || isUploadingSignature || isUploadingIdentity || isUploadingAddress;
  const continueLabel = isSaving
    ? "Saving..."
    : isUploadingAny
      ? "Uploading..."
      : isEditMode
        ? "Go to Review"
        : "Continue";

  return (
    <UploadDocumentsScreen
      signatureUploaded={signatureUploaded}
      photoUploaded={photoUploaded}
      identityUploaded={identityUploaded}
      addressUploaded={addressUploaded}
      documentRules={resolvedDocumentRules}
      showUploadInfoBanner={showUploadInfoBanner}
      setShowUploadInfoBanner={setShowUploadInfoBanner}
      isEditMode={isEditMode}
      isSaving={isSaving || isUploadingAny}
      continueLabel={continueLabel}
      errorMessage={error}
      initialSignatureUrl={signatureDisplayUrl}
      initialPhotoUrl={photoDisplayUrl}
      initialIdentityUrl={identityDisplayUrl}
      initialAddressUrl={addressDisplayUrl}
      onPrevious={onBack}
      onContinue={() => {
        void handleContinue();
      }}
      onConfirmSignatureUpload={uploadSignature}
      onConfirmPhotoUpload={uploadPhoto}
      onConfirmIdentityUpload={uploadIdentity}
      onConfirmAddressUpload={uploadAddress}
      onRemoveSignature={clearSignature}
      onRemovePhoto={clearPhoto}
      onRemoveIdentity={clearIdentity}
      onRemoveAddress={clearAddress}
    />
  );
};

export default UploadDocumentsStep;
