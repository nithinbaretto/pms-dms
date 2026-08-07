/* eslint-disable react-hooks/set-state-in-effect */
import type { ChangeEvent, CSSProperties, ReactElement, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import svgPaths from '../../../../assets/figma-svg/svg-fcmqq9l0qc';
import modalSvgPaths from '../../../../assets/figma-svg/svg-kmnbjcgk4j';
import step5v2SvgPaths from '../../../../assets/figma-svg/svg-g0g3d8hkgl';
import imgBgImg from '../../../../assets/images/background_img.png';
import imgSignatureExample from '../../../../assets/images/guidlines_img_1.png';
import imgSignatureGlare from '../../../../assets/images/guidlines_img_4.png';
import imgPhotoExample from '../../../../assets/images/guidlines_img_2.png';

type UploadDocumentsStepProps = {
  onBack: () => void;
  onContinue: () => void;
  isEditMode?: boolean;
  onGoToReview?: () => void;
  signatureUploaded?: boolean;
  photoUploaded?: boolean;
  onSignatureUploadedChange?: (value: boolean) => void;
  onPhotoUploadedChange?: (value: boolean) => void;
  documentRules?: {
    requiresPhoto?: boolean;
    requiresSignature?: boolean;
    requiresCheque?: boolean;
    requiresDueDiligenceDoc?: boolean;
  };
};

interface Props {
  signatureUploaded: boolean;
  setSignatureUploaded: (v: boolean) => void;
  photoUploaded: boolean;
  setPhotoUploaded: (v: boolean) => void;
  documentRules?: {
    requiresPhoto?: boolean;
    requiresSignature?: boolean;
    requiresCheque?: boolean;
    requiresDueDiligenceDoc?: boolean;
  };
  showUploadInfoBanner: boolean;
  setShowUploadInfoBanner: (v: boolean) => void;
  isEditMode: boolean;
  onPrevious: () => void;
  onContinue: () => void;
}

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

/* ─── Upload Signature Modal ─────────────────────────────────────────────── */

function UploadSignatureModal({
  previewUrl,
  onTrash,
  onCancel,
  onSave,
}: {
  previewUrl: string;
  onTrash: () => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 overflow-y-auto backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)]" onClick={onCancel} />
      <div className="relative bg-white rounded-[16px] drop-shadow-[4px_4px_20px_rgba(0,0,0,0.12)] flex flex-col gap-[16px] p-[20px] md:p-[32px] w-[calc(100%-32px)] max-w-[679.5px]">
        {/* Header */}
        <div className="flex h-[33px] items-center justify-between w-full shrink-0">
          <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#435160] text-[22px] whitespace-nowrap">Upload Signature</p>
          <button onClick={onCancel} className="overflow-clip size-[24px] hover:opacity-70 transition-opacity">
            <svg className="size-full" fill="none" viewBox="0 0 15.0008 15.0008">
              <path d={modalSvgPaths.p3bbf7480} fill="#435160" />
            </svg>
          </button>
        </div>

        {/* Preview area with dashed border */}
        <div className="relative rounded-[8px] w-full border border-dashed border-[#eee]">
          <div className="flex flex-col items-center justify-center p-[12px]">
            <div className="flex gap-[16px] items-start justify-end w-full">
              <div className="flex-1 relative" style={{ height: '211px' }}>
                <div className="absolute inset-0 overflow-hidden">
                  <img alt="Uploaded signature" className="absolute inset-0 w-full h-full object-contain" src={previewUrl} />
                </div>
              </div>
              <button onClick={onTrash} className="overflow-clip size-[24px] shrink-0 hover:opacity-70 transition-opacity mt-[4px]" title="Remove">
                <svg className="size-full" fill="none" viewBox="0 0 18 19.5">
                  <path d={modalSvgPaths.p35a63e00} fill="#71859B" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Cancel + Save */}
        <div className="flex gap-[24px] items-center w-full shrink-0">
          <button onClick={onCancel} className="flex-1 h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center hover:border-[#c7aa7b] transition-colors">
            <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Cancel</p>
          </button>
          <button onClick={onSave} className="bg-[#93161e] hover:bg-[#7a1319] transition-colors flex-1 h-[36px] rounded-[8px] flex items-center justify-center">
            <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-white text-[14px]">Save</p>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Guideline Strip ────────────────────────────────────────────────────── */

function GoodTile({ src, imgPositionStyle }: { src: string; imgPositionStyle?: CSSProperties }) {
  return (
    <div className="bg-[#eeffe5] flex-1 min-w-px relative rounded-[5.851px]">
      <div className="flex items-center justify-center p-[5.851px] size-full">
        <div className="flex flex-col gap-[5.851px] items-center justify-center relative w-full">
          <div className="w-full relative overflow-hidden rounded-[2px]" style={{ aspectRatio: '141/115' }}>
            <div className="absolute inset-0 bg-white" />
            <div className="absolute inset-0 overflow-hidden">
              <img alt="Clear document" className="absolute max-w-none" style={imgPositionStyle ?? { inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} src={src} />
            </div>
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 overflow-clip size-[12px]">
              <svg className="size-full" fill="none" viewBox="0 0 9.75 9.75">
                <path d={svgPaths.p3fa6ec00} fill="#37B400" />
              </svg>
            </div>
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

function BadTile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-[#fff0e5] flex-1 min-w-px relative rounded-[5.851px]">
      <div className="flex items-center justify-center p-[5.851px] size-full">
        <div className="flex flex-col gap-[5.851px] items-center justify-center relative w-full">
          <div className="w-full relative overflow-hidden rounded-[2px]" style={{ aspectRatio: '141/115' }}>
            <div className="absolute inset-0 bg-white" />
            {children}
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 overflow-clip size-[12px]">
              <svg className="size-full" fill="none" viewBox="0 0 9.75 9.75">
                <path d={svgPaths.pe3f6400} fill="#E8402F" />
              </svg>
            </div>
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
        {/* Clear & Complete */}
        <GoodTile src={imgSignatureExample} />

        {/* Half cut / Incomplete */}
        <BadTile label="Half cut / Incomplete">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="Half cut" className="absolute max-w-none" style={{ height: '191.74%', left: '0.06%', top: '-24.53%', width: '178.61%' }} src={imgSignatureExample} />
          </div>
        </BadTile>

        {/* Blurry / Out of focus */}
        <BadTile label="Blurry / Out of focus">
          <div className="absolute inset-0 blur-[0.865px] overflow-hidden">
            <img alt="Blurry" className="absolute w-full h-[107.35%] left-0 top-[-0.14%] max-w-none" src={imgSignatureExample} />
          </div>
        </BadTile>

        {/* Poor lighting / Glare */}
        <BadTile label="Poor lighting / Glare">
          <div className="absolute inset-0 bg-black" />
          <img alt="Poor lighting" className="absolute max-w-none opacity-[0.61] inset-0 w-full h-full object-bottom" src={imgSignatureGlare} />
        </BadTile>
      </div>
    </div>
  );
}

function PhotoGuidelineStrip() {
  return (
    <div className="bg-[#f5f5f5] rounded-[4px] w-full shrink-0">
      <div className="flex gap-[8px] items-stretch p-[8px]">
        {/* Clear & Complete */}
        <GoodTile src={imgPhotoExample} imgPositionStyle={{ height: '100%', left: '-11.04%', top: '0.46%', width: '122.34%' }} />

        {/* Half cut / Incomplete */}
        <BadTile label="Half cut / Incomplete">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="Half cut" className="absolute max-w-none" style={{ height: '133.57%', left: '6.84%', top: '-2.72%', width: '124.42%' }} src={imgPhotoExample} />
          </div>
        </BadTile>

        {/* Blurry / Out of focus */}
        <BadTile label="Blurry / Out of focus">
          <div className="absolute inset-0 blur-[0.865px] overflow-hidden">
            <img alt="Blurry" className="absolute max-w-none h-full top-[0.46%]" style={{ left: '-11.04%', width: '122.34%' }} src={imgPhotoExample} />
          </div>
        </BadTile>

        {/* Poor lighting / Glare */}
        <BadTile label="Poor lighting / Glare">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.64)]" />
          <div className="absolute inset-0 opacity-[0.59] overflow-hidden">
            <img alt="Poor lighting" className="absolute max-w-none h-full top-[0.46%]" style={{ left: '-11.04%', width: '122.34%' }} src={imgPhotoExample} />
          </div>
        </BadTile>
      </div>
    </div>
  );
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
  cardType: 'signature' | 'photo';
}) {
  const cardCls = 'bg-white flex-1 min-w-px rounded-[8px] border border-[#eee] flex flex-col gap-[12px] p-[14px]';

  if (uploaded && previewUrl) {
    return (
      <div className={cardCls}>
        <div className="flex gap-[4px] items-center shrink-0">
          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#231f20] text-[13px] whitespace-nowrap">{title}</p>
          <div className="overflow-clip size-[16px] shrink-0">
            <svg className="size-full" fill="none" viewBox="0 0 13 13">
              <path d={svgPaths.p1835e980} fill="#5A6B7D" />
            </svg>
          </div>
        </div>
        <div className="flex-1 rounded-[8px] border border-[#eee] flex flex-col p-[12px] gap-[12px]">
          <div className="flex justify-end shrink-0">
            <button onClick={onRemove} className="overflow-clip size-[24px] hover:opacity-70 transition-opacity">
              <svg className="size-full" fill="none" viewBox="0 0 18 19.5">
                <path d={step5v2SvgPaths.p35a63e00} fill="#93161E" />
              </svg>
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
            <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#231f20] text-[13px] whitespace-nowrap">{title}</p>
            <div className="overflow-clip size-[16px] shrink-0">
              <svg className="size-full" fill="none" viewBox="0 0 13 13">
                <path d={svgPaths.p1835e980} fill="#5A6B7D" />
              </svg>
            </div>
          </div>
          <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#71859b] text-[12px] max-w-[267px]">Format Supported: PNG, PDF or JPEG up to 2MB</p>
        </div>
        <div className="flex gap-[12px] items-center shrink-0">
          <button onClick={onCaptureClick} className="flex gap-[8px] h-[36px] items-center justify-center px-[21px] py-[7px] rounded-[8px] border border-[#eee] hover:border-[#c7aa7b] transition-colors">
            <div className="overflow-clip size-[16px] shrink-0">
              <svg className="size-full" fill="none" viewBox="0 0 13 11.5">
                <path d={svgPaths.pf78bc00} fill="#435160" />
              </svg>
            </div>
            <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px] whitespace-nowrap">Capture</p>
          </button>
          <button
            onClick={onUploadClick}
            className="bg-[#93161e] hover:bg-[#7a1319] transition-colors flex h-[36px] items-center justify-center px-[21px] py-[7px] rounded-[8px]"
          >
            <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-white text-[14px] whitespace-nowrap">Upload</p>
          </button>
        </div>
      </div>
      {cardType === 'signature' ? <SignatureGuidelineStrip /> : <PhotoGuidelineStrip />}
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
  cardType: 'signature' | 'photo';
}) {
  if (uploaded && previewUrl) {
    return (
      <div className="bg-white rounded-[8px] border border-[#eee] flex flex-col gap-[12px] p-[14px]">
        <div className="flex gap-[4px] items-center">
          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#231f20] text-[13px]">{title}</p>
          <div className="overflow-clip size-[16px] shrink-0">
            <svg className="size-full" fill="none" viewBox="0 0 13 13">
              <path d={svgPaths.p1835e980} fill="#5A6B7D" />
            </svg>
          </div>
        </div>
        <div className="rounded-[8px] border border-[#eee] flex flex-col p-[10px] gap-[8px]" style={{ minHeight: '140px' }}>
          <div className="flex justify-end shrink-0">
            <button onClick={onRemove} className="overflow-clip size-[20px] hover:opacity-70 transition-opacity">
              <svg className="size-full" fill="none" viewBox="0 0 18 19.5">
                <path d={step5v2SvgPaths.p35a63e00} fill="#93161E" />
              </svg>
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
          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#231f20] text-[13px] whitespace-nowrap">{title}</p>
          <div className="overflow-clip shrink-0 size-[16px]">
            <svg className="size-full" fill="none" viewBox="0 0 13 13">
              <path d={svgPaths.p1835e980} fill="#5A6B7D" />
            </svg>
          </div>
        </div>
        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#71859b] text-[12px]">Format Supported: PNG, PDF or JPEG up to 2MB</p>
      </div>

      {cardType === 'signature' ? <SignatureGuidelineStrip /> : <PhotoGuidelineStrip />}

      <div className="flex gap-[12px] items-center w-full">
        <div onClick={onCaptureClick} className="flex-1 min-w-px h-[36px] rounded-[8px] border border-[#eee] hover:border-[#c7aa7b] transition-colors flex items-center justify-center gap-[8px]">
          <div className="overflow-clip shrink-0 size-[16px]">
            <svg className="size-full" fill="none" viewBox="0 0 13 11.5">
              <path d={svgPaths.pf78bc00} fill="#435160" />
            </svg>
          </div>
          <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px] whitespace-nowrap">Capture</p>
        </div>
        <button
          onClick={onUploadClick}
          className="bg-[#93161e] hover:bg-[#7a1319] transition-colors flex-1 min-w-px h-[36px] rounded-[8px] flex items-center justify-center"
        >
          <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] text-white whitespace-nowrap">Upload</p>
        </button>
      </div>
    </div>
  );
}

/* ─── Main Screen ────────────────────────────────────────────────────────── */

export function UploadDocumentsScreen({
  signatureUploaded,
  setSignatureUploaded,
  photoUploaded,
  setPhotoUploaded,
  showUploadInfoBanner,
  documentRules,
  setShowUploadInfoBanner,
  isEditMode,
  onPrevious,
  onContinue,
}: Props) {
  const requiresSignature = documentRules?.requiresSignature ?? true;
  const requiresPhoto = documentRules?.requiresPhoto ?? true;
  const canContinue = (!requiresSignature || signatureUploaded) && (!requiresPhoto || photoUploaded);
  /* Signature upload state */
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState<string>('');
  const sigFileInputRef = useRef<HTMLInputElement>(null);
  const captureSequenceRef = useRef(0);

  function validateSelectedFile(file: File, fileLabel: 'signature' | 'photo'): boolean {
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

    if (signaturePreviewUrl) {
      URL.revokeObjectURL(signaturePreviewUrl);
    }

    setSignaturePreviewUrl(URL.createObjectURL(file));
    setShowSignatureModal(true);
  }

  function preparePhotoPreview(file: File) {
    if (!validateSelectedFile(file, 'photo')) {
      return;
    }

    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    setPhotoPreviewUrl(URL.createObjectURL(file));
    setShowPhotoModal(true);
  }

  async function captureFromFrontCamera(target: 'signature' | 'photo') {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('Camera API is not supported on this device/browser.');
      return;
    }

    let stream: MediaStream | null = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      const video = document.createElement('video');
      video.setAttribute('playsinline', 'true');
      video.srcObject = stream;
      await video.play();

      await new Promise<void>((resolve) => {
        if (video.readyState >= 2) {
          resolve();
          return;
        }

        video.onloadeddata = () => resolve();
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      const context = canvas.getContext('2d');
      if (!context) {
        console.warn('Unable to capture image from camera.');
        return;
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.92);
      });

      if (!blob) {
        console.warn('Camera capture failed. Please try again.');
        return;
      }

      captureSequenceRef.current += 1;
      const capturedFile = new File([blob], `${target}-capture-${captureSequenceRef.current}.jpg`, {
        type: 'image/jpeg',
      });

      if (target === 'signature') {
        prepareSignaturePreview(capturedFile);
      } else {
        preparePhotoPreview(capturedFile);
      }
    } catch (error) {
      console.warn('Camera permission denied or camera unavailable.', error);
    } finally {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
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
  function handleSignatureCaptureClick() { void captureFromFrontCamera('signature'); }
  function handleSignatureFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    prepareSignaturePreview(file);
    e.target.value = '';
  }
  function handleSignatureTrash() {
    if (signaturePreviewUrl) {
      URL.revokeObjectURL(signaturePreviewUrl);
    }
    setShowSignatureModal(false);
    setSignaturePreviewUrl('');
    setSignatureUploaded(false);
    if (sigFileInputRef.current) {
      sigFileInputRef.current.value = '';
    }
  }
  function handleSignatureCancel() {
    if (signaturePreviewUrl) {
      URL.revokeObjectURL(signaturePreviewUrl);
    }
    setShowSignatureModal(false);
    setSignaturePreviewUrl('');
    setSignatureUploaded(false);
    if (sigFileInputRef.current) {
      sigFileInputRef.current.value = '';
    }
  }
  function handleSignatureSave() { setSignatureUploaded(true); setShowSignatureModal(false); }
  function handleSignatureRemove() {
    if (signaturePreviewUrl) URL.revokeObjectURL(signaturePreviewUrl);
    setSignaturePreviewUrl('');
    setSignatureUploaded(false);
  }

  /* Photo upload state */
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>('');
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoUploadClick() { triggerInput(photoFileInputRef); }
  function handlePhotoCaptureClick() { void captureFromFrontCamera('photo'); }
  function handlePhotoFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    preparePhotoPreview(file);
    e.target.value = '';
  }
  function handlePhotoTrash() {
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }
    setShowPhotoModal(false);
    setPhotoPreviewUrl('');
    setPhotoUploaded(false);
    if (photoFileInputRef.current) {
      photoFileInputRef.current.value = '';
    }
  }
  function handlePhotoCancel() {
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }
    setShowPhotoModal(false);
    setPhotoPreviewUrl('');
    setPhotoUploaded(false);
    if (photoFileInputRef.current) {
      photoFileInputRef.current.value = '';
    }
  }
  function handlePhotoSave() { setPhotoUploaded(true); setShowPhotoModal(false); }
  function handlePhotoRemove() {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoPreviewUrl('');
    setPhotoUploaded(false);
  }

  useEffect(() => {
    return () => {
      if (signaturePreviewUrl) {
        URL.revokeObjectURL(signaturePreviewUrl);
      }
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl, signaturePreviewUrl]);

  return (
    <>
      {/* Hidden file inputs */}
      <input ref={sigFileInputRef} type="file" accept="image/png,image/jpeg,application/pdf" className="hidden" onChange={handleSignatureFileChange} />
      <input ref={photoFileInputRef} type="file" accept="image/png,image/jpeg,application/pdf" className="hidden" onChange={handlePhotoFileChange} />

      {/* Upload Signature Modal */}
      {showSignatureModal && signaturePreviewUrl && (
        <UploadSignatureModal
          previewUrl={signaturePreviewUrl}
          onTrash={handleSignatureTrash}
          onCancel={handleSignatureCancel}
          onSave={handleSignatureSave}
        />
      )}

      {/* Upload Photo Modal */}
      {showPhotoModal && photoPreviewUrl && (
        <UploadSignatureModal
          previewUrl={photoPreviewUrl}
          onTrash={handlePhotoTrash}
          onCancel={handlePhotoCancel}
          onSave={handlePhotoSave}
        />
      )}

      {/* ── Desktop View ── */}
      <div className="hidden lg:block min-h-screen bg-[#fffaf6] pb-[80px]">
        <div className="fixed inset-0 opacity-60 pointer-events-none overflow-hidden">
          <img alt="" className="absolute left-[27.29%] top-[-2.35%] w-[90.41%] h-[107.16%] max-w-none" src={imgBgImg} />
        </div>

        {/* Title — no subtitle, so form starts at top-[229px] */}
        <div className="hidden lg:flex flex-col gap-[4px] absolute left-[60px] xl:left-[120px] top-[172px] z-20 w-[1200px]">
          <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#231f20] text-[22px]">Upload Documents</p>
        </div>

        <div className="absolute left-[60px] xl:left-[120px] top-[229px] z-10 w-[calc(100%-120px)] xl:w-[calc(100%-240px)] max-w-[1200px]">
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
                {/* Info banner */}
                {showUploadInfoBanner && (
                  <div className="bg-[#e8f1fb] h-[32px] rounded-[8px] flex items-center justify-between px-[12px] shrink-0">
                    <div className="flex gap-[8px] items-center flex-1 min-w-0">
                      <div className="overflow-clip size-[16px] shrink-0">
                        <svg className="size-full" fill="none" viewBox="0 0 13 13">
                          <path d={svgPaths.p1835e980} fill="#193D6C" />
                        </svg>
                      </div>
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px] whitespace-nowrap">
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

        {/* Desktop bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white h-[64px] shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)] flex items-center justify-between px-[60px] xl:px-[120px] py-[8px] z-30">
          <button onClick={onPrevious} className="h-[36px] w-[180px] rounded-[8px] border border-[#eee] flex items-center justify-center hover:border-[#c7aa7b] transition-colors">
            <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Previous</p>
          </button>
          <div className="flex gap-[24px] items-center">
            {isEditMode ? (
              <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#5a6b7d] text-[13px] text-right opacity-0 pointer-events-none">Next: Review &amp; Confirm</p>
            ) : (
              <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#5a6b7d] text-[13px] text-right">Next: Review &amp; Confirm</p>
            )}
            <button
              onClick={canContinue ? onContinue : undefined}
              disabled={!canContinue}
              className={`h-[36px] w-[180px] rounded-[8.75px] flex items-center justify-center gap-[8px] transition-colors ${
                canContinue ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer' : 'bg-[#e5e5e6] cursor-not-allowed'
              }`}
            >
              <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${canContinue ? 'text-white' : 'text-[#5a6b7d]'}`}>{isEditMode ? 'Go to Review' : 'Continue'}</p>
              <div className="overflow-clip size-[16px]">
                <svg className="size-full" fill="none" viewBox="0 0 12.0004 10.0006">
                  <path d={svgPaths.p16866180} fill={canContinue ? 'white' : '#5A6B7D'} />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile / Tablet View ── */}
      <div className="lg:hidden flex flex-col min-h-screen w-full relative bg-[#fffaf6]">
        <div className="fixed inset-0 opacity-60 pointer-events-none overflow-hidden">
          <img alt="" className="absolute left-[27.29%] top-[-2.35%] w-[90.41%] h-[107.16%] max-w-none" src={imgBgImg} />
        </div>


        <div className="flex flex-col px-[20px] md:px-[40px] pt-[100px] md:pt-[130px] pb-[140px] relative z-10 gap-[20px]">
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
                {showUploadInfoBanner && (
                  <div className="bg-[#e8f1fb] rounded-[8px] flex items-start justify-between gap-[8px] p-[12px]">
                    <div className="flex gap-[8px] items-start flex-1">
                      <div className="overflow-clip size-[16px] shrink-0 mt-[1px]">
                        <svg className="size-full" fill="none" viewBox="0 0 13 13">
                          <path d={svgPaths.p1835e980} fill="#193D6C" />
                        </svg>
                      </div>
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">
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

        {/* Mobile bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)] flex flex-col gap-[12px] p-[16px] md:p-[20px] z-30">
          {isEditMode ? (
            <>
              <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#e8402f] text-[13px] opacity-0 pointer-events-none">Next: Review &amp; Confirm</p>
              <div className="flex gap-[12px] items-center w-full">
                <button
                  onClick={canContinue ? onContinue : undefined}
                  disabled={!canContinue}
                  className={`flex-1 h-[44px] md:h-[36px] rounded-[8px] flex items-center justify-center gap-[8px] transition-colors ${
                    canContinue ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer' : 'bg-[#e5e5e6] cursor-not-allowed'
                  }`}
                >
                  <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${canContinue ? 'text-white' : 'text-[#5a6b7d]'}`}>Go to Review</p>
                  <div className="size-[16px]">
                    <svg className="size-full" fill="none" viewBox="0 0 12.0004 10.0006">
                      <path d={svgPaths.p16866180} fill={canContinue ? 'white' : '#5A6B7D'} />
                    </svg>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#5a6b7d] text-[13px] text-left">Next: Review &amp; Confirm</p>
              <div className="flex gap-[12px] items-center w-full">
                <button onClick={onPrevious} className="flex-1 h-[44px] md:h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center hover:border-[#c7aa7b] transition-colors">
                  <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Previous</p>
                </button>
                <button
                  onClick={canContinue ? onContinue : undefined}
                  disabled={!canContinue}
                  className={`flex-1 h-[44px] md:h-[36px] rounded-[8px] flex items-center justify-center gap-[8px] transition-colors ${
                    canContinue ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer' : 'bg-[#e5e5e6] cursor-not-allowed'
                  }`}
                >
                  <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${canContinue ? 'text-white' : 'text-[#5a6b7d]'}`}>Continue</p>
                  <div className="size-[16px]">
                    <svg className="size-full" fill="none" viewBox="0 0 12.0004 10.0006">
                      <path d={svgPaths.p16866180} fill={canContinue ? 'white' : '#5A6B7D'} />
                    </svg>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const UploadDocumentsStep = ({
  onBack,
  onContinue,
  isEditMode = false,
  onGoToReview,
  signatureUploaded: initialSignatureUploaded = false,
  photoUploaded: initialPhotoUploaded = false,
  onSignatureUploadedChange,
  onPhotoUploadedChange,
  documentRules,
}: UploadDocumentsStepProps): ReactElement => {
  const [signatureUploaded, setSignatureUploaded] = useState(initialSignatureUploaded);
  const [photoUploaded, setPhotoUploaded] = useState(initialPhotoUploaded);
  const [showUploadInfoBanner, setShowUploadInfoBanner] = useState(true);

  useEffect(() => {
    setSignatureUploaded(initialSignatureUploaded);
  }, [initialSignatureUploaded]);

  useEffect(() => {
    setPhotoUploaded(initialPhotoUploaded);
  }, [initialPhotoUploaded]);

  const handleSignatureUploadedChange = (value: boolean) => {
    setSignatureUploaded(value);
    onSignatureUploadedChange?.(value);
  };

  const handlePhotoUploadedChange = (value: boolean) => {
    setPhotoUploaded(value);
    onPhotoUploadedChange?.(value);
  };

  const handleContinue = () => {
    if (isEditMode && onGoToReview) {
      onGoToReview();
      return;
    }

    onContinue();
  };

  return (
    <UploadDocumentsScreen
      signatureUploaded={signatureUploaded}
      setSignatureUploaded={handleSignatureUploadedChange}
      photoUploaded={photoUploaded}
      setPhotoUploaded={handlePhotoUploadedChange}
      documentRules={documentRules}
      showUploadInfoBanner={showUploadInfoBanner}
      setShowUploadInfoBanner={setShowUploadInfoBanner}
      isEditMode={isEditMode}
      onPrevious={onBack}
      onContinue={handleContinue}
    />
  );
};

export default UploadDocumentsStep;
