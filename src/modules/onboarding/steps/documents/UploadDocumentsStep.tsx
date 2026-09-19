/* eslint-disable react-hooks/set-state-in-effect */
import type { ChangeEvent, ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Info, X } from 'lucide-react';

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
import { getDocumentFileValidationError, isPdfDisplaySrc, isPdfFile, pdfSrcToBlob } from './helpers';
import { useDocumentsFlow } from './useDocumentsFlow';

const SIGNATURE_GUIDELINE_ITEMS = [
  { src: imgSignGuideline1, label: 'Clear & Complete', good: true },
  { src: imgSignGuideline2, label: 'Half cut / Incomplete', good: false },
  { src: imgSignGuideline3, label: 'Blurry / Out of focus', good: false },
  { src: imgSignGuideline4, label: 'Poor lighting / Glare', good: false },
];

const PHOTO_GUIDELINE_ITEMS = [
  { src: imgPhotoGuideline1, label: 'Clear & Complete', good: true },
  { src: imgPhotoGuideline2, label: 'Half cut / Incomplete', good: false },
  { src: imgPhotoGuideline3, label: 'Blurry / Out of focus', good: false },
  { src: imgPhotoGuideline4, label: 'Poor lighting / Glare', good: false },
];

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
  showInlineGuidelines: boolean;
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

const DOCUMENT_PREVIEW_WIDTH = 219;
const DOCUMENT_PREVIEW_HEIGHT = 122;
const DOCUMENT_FILE_ERROR_CLASS =
  "font-['Mulish',sans-serif] text-[12px] font-normal leading-[100%] tracking-[0px] text-[#E8402F]";

type DocumentUploadSlot = 'signature' | 'photo' | 'identity' | 'address';

function filePreviewMime(file: File | null | undefined): string | undefined {
  if (!file) {
    return undefined;
  }
  if (isPdfFile(file)) {
    return 'application/pdf';
  }
  return file.type || undefined;
}

function TrashIcon({ className, color = '#93161E' }: { className?: string; color?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.25 4.5H16.5V3.75C16.5 3.15326 16.2629 2.58097 15.841 2.15901C15.419 1.73705 14.8467 1.5 14.25 1.5H9.75C9.15326 1.5 8.58097 1.73705 8.15901 2.15901C7.73705 2.58097 7.5 3.15326 7.5 3.75V4.5H3.75C3.55109 4.5 3.36032 4.57902 3.21967 4.71967C3.07902 4.86032 3 5.05109 3 5.25C3 5.44891 3.07902 5.63968 3.21967 5.78033C3.36032 5.92098 3.55109 6 3.75 6H4.5V19.5C4.5 19.8978 4.65804 20.2794 4.93934 20.5607C5.22064 20.842 5.60218 21 6 21H18C18.3978 21 18.7794 20.842 19.0607 20.5607C19.342 20.2794 19.5 19.8978 19.5 19.5V6H20.25C20.4489 6 20.6397 5.92098 20.7803 5.78033C20.921 5.63968 21 5.44891 21 5.25C21 5.05109 20.921 4.86032 20.7803 4.71967C20.6397 4.57902 20.4489 4.5 20.25 4.5ZM9 3.75C9 3.55109 9.07902 3.36032 9.21967 3.21967C9.36032 3.07902 9.55109 3 9.75 3H14.25C14.4489 3 14.6397 3.07902 14.7803 3.21967C14.921 3.36032 15 3.55109 15 3.75V4.5H9V3.75ZM18 19.5H6V6H18V19.5ZM10.5 9.75V15.75C10.5 15.9489 10.421 16.1397 10.2803 16.2803C10.1397 16.421 9.94891 16.5 9.75 16.5C9.55109 16.5 9.36032 16.421 9.21967 16.2803C9.07902 16.1397 9 15.9489 9 15.75V9.75C9 9.55109 9.07902 9.36032 9.21967 9.21967C9.36032 9.07902 9.55109 9 9.75 9C9.94891 9 10.1397 9.07902 10.2803 9.21967C10.421 9.36032 10.5 9.55109 10.5 9.75ZM15 9.75V15.75C15 15.9489 14.921 16.1397 14.7803 16.2803C14.6397 16.421 14.4489 16.5 14.25 16.5C14.0511 16.5 13.8603 16.421 13.7197 16.2803C13.579 16.1397 13.5 15.9489 13.5 15.75V9.75C13.5 9.55109 13.579 9.36032 13.7197 9.21967C13.8603 9.07902 14.0511 9 14.25 9C14.4489 9 14.6397 9.07902 14.7803 9.21967C14.921 9.36032 15 9.55109 15 9.75Z"
        fill={color}
      />
    </svg>
  );
}

function withPdfViewerParams(src: string): string {
  if (src.startsWith("blob:") || src.startsWith("http://") || src.startsWith("https://")) {
    return `${src}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-width`;
  }
  return src;
}

function DocumentPreviewMedia({
  src,
  alt,
  className,
  mimeType,
}: {
  src: string;
  alt: string;
  className?: string;
  mimeType?: string;
}) {
  const isPdf = isPdfDisplaySrc(src, mimeType);
  const [pdfEmbedSrc, setPdfEmbedSrc] = useState(src);

  useEffect(() => {
    if (!isPdf) {
      return undefined;
    }

    if (src.startsWith("blob:") || src.startsWith("http://") || src.startsWith("https://")) {
      setPdfEmbedSrc(src);
      return undefined;
    }

    let objectUrl = "";
    try {
      objectUrl = URL.createObjectURL(pdfSrcToBlob(src));
      setPdfEmbedSrc(objectUrl);
    } catch {
      setPdfEmbedSrc(src);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isPdf, src]);

  if (isPdf) {
    return (
      <iframe
        className={className}
        src={withPdfViewerParams(pdfEmbedSrc)}
        title={alt}
      />
    );
  }

  return <img alt={alt} className={className} src={src} />;
}

function DocumentPreviewFrame({ src, mimeType }: { src: string; mimeType?: string }) {
  return (
    <div
      className="shrink-0 overflow-hidden bg-white"
      style={{ width: DOCUMENT_PREVIEW_WIDTH, height: DOCUMENT_PREVIEW_HEIGHT }}
    >
      <DocumentPreviewMedia
        alt="Uploaded document"
        className="block h-full w-full object-contain border-0 bg-white"
        mimeType={mimeType}
        src={src}
      />
    </div>
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
          <p className="font-['Mulish',sans-serif] text-[22px] font-medium leading-[100%] tracking-[0px] text-[#435160] whitespace-nowrap">{title}</p>
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
  mimeType,
  onCancel,
  onSave,
}: {
  title: string;
  previewUrl: string;
  mimeType?: string;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <PreviewDialogShell title={title} onCancel={onCancel} onSave={onSave}>
      <div className="flex flex-col items-center justify-center p-[12px]">
        <div className="flex w-full items-center justify-center" style={{ height: '211px' }}>
          <DocumentPreviewFrame mimeType={mimeType} src={previewUrl} />
        </div>
      </div>
    </PreviewDialogShell>
  );
}

function renderGuidelineContent(cardType: 'signature' | 'photo' | 'document', layout: 'grid' | 'row' = 'grid') {
  if (cardType === 'signature') {
    return <UploadImageGuidelines items={SIGNATURE_GUIDELINE_ITEMS} layout={layout} showTitle={false} />;
  }
  if (cardType === 'document') {
    return <UploadImageGuidelines layout={layout} showTitle={false} />;
  }
  return <UploadImageGuidelines items={PHOTO_GUIDELINE_ITEMS} layout={layout} showTitle={false} />;
}

/* ─── Desktop Upload Card ────────────────────────────────────────────────── */

function TitleInfoIcon() {
  return (
    <div className="overflow-clip size-[16px] shrink-0">
      <svg className="size-full" fill="none" viewBox="0 0 13 13">
        <path d={svgPaths.p1835e980} fill="#5A6B7D" />
      </svg>
    </div>
  );
}

function UploadCard({
  title,
  uploaded,
  previewUrl,
  mimeType,
  trashIconColor,
  showInlineGuidelines,
  showTitleInfoIcon = true,
  guidelineType,
  fileError,
  onCaptureClick,
  onUploadClick,
  onViewGuidelinesClick,
  onRemove,
}: {
  title: string;
  uploaded: boolean;
  previewUrl?: string;
  mimeType?: string;
  trashIconColor?: string;
  showInlineGuidelines?: boolean;
  showTitleInfoIcon?: boolean;
  guidelineType?: 'signature' | 'photo' | 'document';
  fileError?: string | null;
  onCaptureClick: () => void;
  onUploadClick: () => void;
  onViewGuidelinesClick: () => void;
  onRemove: () => void;
}) {
  const cardCls = `bg-white w-full flex-1 rounded-[8px] border flex flex-col gap-[12px] p-[14px] ${
    fileError ? 'border-[#d8787d]' : 'border-[#eee]'
  }`;

  if (uploaded && previewUrl) {
    return (
      <div className="flex flex-1 min-w-px flex-col">
        <div className={cardCls}>
        <div className="flex gap-[4px] items-center shrink-0">
          <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#231F20] text-[14px] whitespace-nowrap">{title}</p>
          {showTitleInfoIcon ? <TitleInfoIcon /> : null}
        </div>
        <div className="rounded-[8px] border border-[#eee] flex items-start p-[12px] gap-[16px]">
          <div className="flex flex-1 items-center justify-center overflow-hidden">
            <DocumentPreviewFrame mimeType={mimeType} src={previewUrl} />
          </div>
          <button onClick={onRemove} className="overflow-clip size-[24px] shrink-0 hover:opacity-70 transition-opacity" title="Remove" type="button">
            <TrashIcon className="size-full" color={trashIconColor} />
          </button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-w-px flex-col gap-[4px]">
      <div className={cardCls}>
      <div className="flex items-center justify-between w-full gap-[12px] shrink-0">
        <div className="flex flex-col gap-[4px]">
          <div className="flex gap-[4px] items-center">
            <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#231F20] text-[14px] whitespace-nowrap">{title}</p>
            {showTitleInfoIcon ? <TitleInfoIcon /> : null}
          </div>
          <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#71859B] text-[12px] whitespace-nowrap">Format Supported: PNG, PDF or JPEG up to 2MB</p>
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
      {showInlineGuidelines && guidelineType ? (
        renderGuidelineContent(guidelineType, 'row')
      ) : (
        <button
          className="inline-flex items-center gap-[4px] self-start font-['Mulish',sans-serif] text-[12px] font-normal leading-[100%] tracking-[0px] text-[#93161E]"
          onClick={onViewGuidelinesClick}
          type="button"
        >
          View upload guidelines
          <ChevronRight className="size-[12px] shrink-0" strokeWidth={1.75} />
        </button>
      )}
      </div>
      {fileError ? <p className={DOCUMENT_FILE_ERROR_CLASS}>{fileError}</p> : null}
    </div>
  );
}

/* ─── Mobile Upload Card ─────────────────────────────────────────────────── */

function MobileUploadCard({
  title,
  uploaded,
  previewUrl,
  mimeType,
  trashIconColor,
  showInlineGuidelines,
  showTitleInfoIcon = true,
  guidelineType,
  fileError,
  onCaptureClick,
  onUploadClick,
  onViewGuidelinesClick,
  onRemove,
}: {
  title: string;
  uploaded: boolean;
  previewUrl?: string;
  mimeType?: string;
  trashIconColor?: string;
  showInlineGuidelines?: boolean;
  showTitleInfoIcon?: boolean;
  guidelineType?: 'signature' | 'photo' | 'document';
  fileError?: string | null;
  onCaptureClick: () => void;
  onUploadClick: () => void;
  onViewGuidelinesClick: () => void;
  onRemove: () => void;
}) {
  if (uploaded && previewUrl) {
    return (
      <div className="bg-white rounded-[8px] border border-[#eee] flex flex-col gap-[12px] p-[14px]">
        <div className="flex gap-[4px] items-center">
          <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#231F20] text-[14px]">{title}</p>
          {showTitleInfoIcon ? <TitleInfoIcon /> : null}
        </div>
        <div className="rounded-[8px] border border-[#eee] flex items-start p-[10px] gap-[12px]">
          <div className="flex flex-1 items-center justify-center overflow-hidden">
            <DocumentPreviewFrame mimeType={mimeType} src={previewUrl} />
          </div>
          <button onClick={onRemove} className="overflow-clip size-[20px] shrink-0 hover:opacity-70 transition-opacity" title="Remove" type="button">
            <TrashIcon className="size-full" color={trashIconColor} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[4px]">
      <div className={`bg-white rounded-[8px] border flex flex-col gap-[12px] p-[14px] ${fileError ? 'border-[#d8787d]' : 'border-[#eee]'}`}>
        <div className="flex flex-col gap-[4px] items-start w-full">
          <div className="flex gap-[4px] items-center">
            <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#231F20] text-[14px] whitespace-nowrap">{title}</p>
            {showTitleInfoIcon ? <TitleInfoIcon /> : null}
          </div>
          <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#71859B] text-[12px]">Format Supported: PNG, PDF or JPEG up to 2MB</p>
        </div>

        {showInlineGuidelines && guidelineType ? (
          renderGuidelineContent(guidelineType, 'row')
        ) : (
          <button
            className="inline-flex items-center gap-[4px] self-start font-['Mulish',sans-serif] text-[12px] font-normal leading-[100%] tracking-[0px] text-[#93161E]"
            onClick={onViewGuidelinesClick}
            type="button"
          >
            View upload guidelines
            <ChevronRight className="size-[12px] shrink-0" strokeWidth={1.75} />
          </button>
        )}

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
      {fileError ? <p className={DOCUMENT_FILE_ERROR_CLASS}>{fileError}</p> : null}
    </div>
  );
}

/* ─── Main Screen ────────────────────────────────────────────────────────── */

export function UploadDocumentsScreen({
  signatureUploaded,
  photoUploaded,
  showInlineGuidelines,
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
  const [guidelineType, setGuidelineType] = useState<'signature' | 'photo' | 'document' | null>(null);
  const [fileErrors, setFileErrors] = useState<Record<DocumentUploadSlot, string | null>>({
    signature: null,
    photo: null,
    identity: null,
    address: null,
  });

  function setSlotFileError(slot: DocumentUploadSlot, message: string | null) {
    setFileErrors((current) => ({ ...current, [slot]: message }));
  }

  function applySelectedFile(file: File, slot: DocumentUploadSlot, onValid: (nextFile: File) => void) {
    const fileValidationError = getDocumentFileValidationError(file);
    if (fileValidationError) {
      setSlotFileError(slot, fileValidationError);
      return;
    }

    setSlotFileError(slot, null);
    onValid(file);
  }

  function prepareSignaturePreview(file: File) {
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
    if (!cameraTarget) {
      return;
    }

    const fileValidationError = getDocumentFileValidationError(file);
    if (fileValidationError) {
      setSlotFileError(cameraTarget, fileValidationError);
      setCameraTarget(null);
      return;
    }

    setSlotFileError(cameraTarget, null);

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

    applySelectedFile(file, 'signature', prepareSignaturePreview);
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
    setSlotFileError('signature', null);
  }

  function handlePhotoUploadClick() { triggerInput(photoFileInputRef); }
  function handlePhotoFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    applySelectedFile(file, 'photo', preparePhotoPreview);
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
    setSlotFileError('photo', null);
  }

  function handleIdentityUploadClick() { triggerInput(identityFileInputRef); }
  function handleIdentityFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    applySelectedFile(file, 'identity', prepareIdentityPreview);
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
    setSlotFileError('identity', null);
  }

  function handleAddressUploadClick() { triggerInput(addressFileInputRef); }
  function handleAddressFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    applySelectedFile(file, 'address', prepareAddressPreview);
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
    setSlotFileError('address', null);
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
          mimeType={filePreviewMime(pendingSignatureFile)}
          onCancel={handleSignatureCancel}
          onSave={handleSignatureSave}
        />
      )}

      {/* Upload Photo Modal */}
      {showPhotoModal && photoPreviewUrl && (
        <UploadSignatureModal
          title="Upload Photo"
          previewUrl={photoPreviewUrl}
          mimeType={filePreviewMime(pendingPhotoFile)}
          onCancel={handlePhotoCancel}
          onSave={handlePhotoSave}
        />
      )}

      {showIdentityModal && identityPreviewUrl && (
        <UploadSignatureModal
          title="Upload Proof of Identity"
          previewUrl={identityPreviewUrl}
          mimeType={filePreviewMime(pendingIdentityFile)}
          onCancel={handleIdentityTrash}
          onSave={handleIdentitySave}
        />
      )}

      {showAddressModal && addressPreviewUrl && (
        <UploadSignatureModal
          title="Upload Proof of Address"
          previewUrl={addressPreviewUrl}
          mimeType={filePreviewMime(pendingAddressFile)}
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

      {!showInlineGuidelines && guidelineType ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 overflow-y-auto backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)]"
            onClick={() => setGuidelineType(null)}
          />
          <div className="relative bg-white rounded-[16px] drop-shadow-[4px_4px_20px_rgba(0,0,0,0.12)] flex flex-col gap-[16px] p-[20px] md:p-[32px] w-[calc(100%-32px)] max-w-[679.5px] max-h-[calc(100vh-48px)] overflow-y-auto">
            <div className="flex h-[33px] items-center justify-between w-full shrink-0">
              <p className="font-['Mulish',sans-serif] text-[22px] font-medium leading-[100%] tracking-[0px] text-[#435160] whitespace-nowrap">Upload guidelines</p>
              <button
                className="overflow-clip size-[24px] hover:opacity-70 transition-opacity"
                onClick={() => setGuidelineType(null)}
                type="button"
              >
                <X className="size-6 text-[#435160]" strokeWidth={1.5} />
              </button>
            </div>
            {renderGuidelineContent(guidelineType)}
          </div>
        </div>
      ) : null}

      {/* ── Desktop View ── */}
      <div className="hidden lg:block">
        <div className="relative z-10 flex flex-col gap-[24px]">
        {/* Title */}
        <div className="hidden lg:flex flex-col gap-[4px]">
          <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#231f20] text-[22px]">Upload Documents</p>
        </div>

        <div>
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
                      <Info className="size-[16px] shrink-0 text-[#193D6C]" strokeWidth={1.75} />
                      <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#231F20] text-[12px] whitespace-nowrap">
                        Upload a clear and properly aligned file (JPG, PNG, or PDF) under 2MB, ensuring it is readable and not blurred or corrupted.
                      </p>
                    </div>
                    <button onClick={() => setShowUploadInfoBanner(false)} className="overflow-clip size-[16px] shrink-0 hover:opacity-70 transition-opacity ml-[8px]">
                      <X className="size-[16px] text-[#193D6C]" strokeWidth={1.75} />
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
                        trashIconColor="#93161E"
                        showTitleInfoIcon={!requiresProofDocs || identityUploaded}
                        fileError={fileErrors.identity}
                        onCaptureClick={handleIdentityCaptureClick}
                        onUploadClick={handleIdentityUploadClick}
                        onViewGuidelinesClick={() => setGuidelineType('document')}
                        onRemove={handleIdentityRemove}
                      />
                      <UploadCard
                        title="Proof of Address"
                        uploaded={addressUploaded}
                        previewUrl={addressPreviewUrl}
                        trashIconColor="#93161E"
                        showTitleInfoIcon={!requiresProofDocs || addressUploaded}
                        fileError={fileErrors.address}
                        onCaptureClick={handleAddressCaptureClick}
                        onUploadClick={handleAddressUploadClick}
                        onViewGuidelinesClick={() => setGuidelineType('document')}
                        onRemove={handleAddressRemove}
                      />
                    </div>
                  ) : null}
                  <div className="flex gap-[20px] items-stretch w-full">
                    <UploadCard
                      title="Specimen Signature"
                      uploaded={signatureUploaded}
                      previewUrl={signaturePreviewUrl}
                      trashIconColor="#93161E"
                      showInlineGuidelines={showInlineGuidelines}
                      showTitleInfoIcon={!requiresProofDocs || signatureUploaded}
                      guidelineType="signature"
                      fileError={fileErrors.signature}
                      onCaptureClick={handleSignatureCaptureClick}
                      onUploadClick={handleSignatureUploadClick}
                      onViewGuidelinesClick={() => setGuidelineType('signature')}
                      onRemove={handleSignatureRemove}
                    />
                    <UploadCard
                      title="Photo Upload"
                      uploaded={photoUploaded}
                      previewUrl={photoPreviewUrl}
                      trashIconColor="#93161E"
                      showInlineGuidelines={showInlineGuidelines}
                      showTitleInfoIcon={!requiresProofDocs || photoUploaded}
                      guidelineType="photo"
                      fileError={fileErrors.photo}
                      onCaptureClick={handlePhotoCaptureClick}
                      onUploadClick={handlePhotoUploadClick}
                      onViewGuidelinesClick={() => setGuidelineType('photo')}
                      onRemove={handlePhotoRemove}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* ── Mobile / Tablet View ── */}
      <div className="relative z-10 flex w-full flex-col lg:hidden">
        <div className="relative z-10 flex flex-col gap-[20px] pb-[140px]">
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
                      <Info className="mt-[1px] size-[16px] shrink-0 text-[#193D6C]" strokeWidth={1.75} />
                      <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[#231F20] text-[12px]">
                        Upload a clear and properly aligned file (JPG, PNG, or PDF) under 2MB, ensuring it is readable and not blurred or corrupted.
                      </p>
                    </div>
                    <button onClick={() => setShowUploadInfoBanner(false)} className="overflow-clip size-[16px] shrink-0 hover:opacity-70 transition-opacity mt-[1px]">
                      <X className="size-[16px] text-[#193D6C]" strokeWidth={1.75} />
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
                        trashIconColor="#93161E"
                        showTitleInfoIcon={!requiresProofDocs || identityUploaded}
                        fileError={fileErrors.identity}
                        onCaptureClick={handleIdentityCaptureClick}
                        onUploadClick={handleIdentityUploadClick}
                        onViewGuidelinesClick={() => setGuidelineType('document')}
                        onRemove={handleIdentityRemove}
                      />
                      <MobileUploadCard
                        title="Proof of Address"
                        uploaded={addressUploaded}
                        previewUrl={addressPreviewUrl}
                        trashIconColor="#93161E"
                        showTitleInfoIcon={!requiresProofDocs || addressUploaded}
                        fileError={fileErrors.address}
                        onCaptureClick={handleAddressCaptureClick}
                        onUploadClick={handleAddressUploadClick}
                        onViewGuidelinesClick={() => setGuidelineType('document')}
                        onRemove={handleAddressRemove}
                      />
                    </>
                  ) : null}
                  <MobileUploadCard
                    title="Specimen Signature"
                    uploaded={signatureUploaded}
                    previewUrl={signaturePreviewUrl}
                    trashIconColor="#93161E"
                    showInlineGuidelines={showInlineGuidelines}
                    showTitleInfoIcon={!requiresProofDocs || signatureUploaded}
                    guidelineType="signature"
                    fileError={fileErrors.signature}
                    onCaptureClick={handleSignatureCaptureClick}
                    onUploadClick={handleSignatureUploadClick}
                    onViewGuidelinesClick={() => setGuidelineType('signature')}
                    onRemove={handleSignatureRemove}
                  />
                  <MobileUploadCard
                    title="Photo Upload"
                    uploaded={photoUploaded}
                    previewUrl={photoPreviewUrl}
                    trashIconColor="#93161E"
                    showInlineGuidelines={showInlineGuidelines}
                    showTitleInfoIcon={!requiresProofDocs || photoUploaded}
                    guidelineType="photo"
                    fileError={fileErrors.photo}
                    onCaptureClick={handlePhotoCaptureClick}
                    onUploadClick={handlePhotoUploadClick}
                    onViewGuidelinesClick={() => setGuidelineType('photo')}
                    onRemove={handlePhotoRemove}
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
  const isAifManualFlow = currentFlow === "aif-individual" && onboardingMethod === "MANUAL";
  const showInlineGuidelines = !isAifManualFlow;
  const requiresProofDocs = isAifManualFlow;
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
      showInlineGuidelines={showInlineGuidelines}
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
