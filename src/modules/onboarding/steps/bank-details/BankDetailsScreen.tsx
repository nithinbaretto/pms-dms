import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Camera, Loader2, Trash2, Upload } from 'lucide-react';
import changeBankSvgPaths from '../../../../assets/figma-svg/svg-1hi99h9mgv';
import qrGeneratedSvgPaths from '../../../../assets/figma-svg/svg-idaonln9ok';
import loadingSvgPaths from '../../../../assets/figma-svg/svg-0crc3rdhsl';
import step3Pi22SvgPaths from '../../../../assets/figma-svg/svg-320085jz20';
import emailOtpSvgPaths from '../../../../assets/figma-svg/svg-ftc9bj5bhu';
import mobileBankSvgPaths from '../../../../assets/figma-svg/svg-clyhwdl8oc';
import mobileBankFailedSvgPaths from '../../../../assets/figma-svg/svg-zkn9tvc148';
import personalInfo5SvgPaths from '../../../../assets/figma-svg/svg-k5zifkr9hc';
import mobileChangeBankSvgPaths from '../../../../assets/figma-svg/svg-donzv28ygm';
import mobileBank9SvgPaths from '../../../../assets/figma-svg/svg-dczpv2qfz9';
import imgBankLogo from '../../../../assets/logo.png';
import imgQrCode from '../../../../assets/images/qrcode.png';
import imgClock from '../../../../assets/logo.png';
import imgCancelledCheque from '../../../../assets/images/guidlines_img_2.png';
import imgPi22ChequeExample from '../../../../assets/images/guidlines_img_3.png';
import imgPi22ChequeGlare from '../../../../assets/images/guidlines_img_4.png';
import imgLogo from '../../../../assets/logo.png';
import editIcon from '../../../../assets/icons/edit_icon.png';
import scanIcon from '../../../../assets/icons/svg/scan.svg';
import currencyInrIcon from '../../../../assets/icons/svg/currencyInr.svg';
import { Input } from '../../../../shared/ui/input';
import CameraCaptureModal from '../../components/CameraCaptureModal';
import OnboardingStepFooter from '../../components/OnboardingStepFooter';

const editIconMaskStyle = {
  WebkitMaskImage: `url(${editIcon})`,
  maskImage: `url(${editIcon})`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
} as const;

function QrScanInstructionPills() {
  return (
    <div className="flex items-center justify-center gap-[12px]">
      <div className="flex items-center gap-[4px] rounded-[24px] border border-[#e5e5e6] bg-[#FFFAF6] px-[12px] py-[10px]">
        <img src={scanIcon} alt="" className="size-4 shrink-0" />
        <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-center text-[#435160] whitespace-nowrap">
          Scan this QR Code
        </p>
      </div>
      <svg className="size-4 shrink-0" fill="none" viewBox="0 0 12.0004 10.0006">
        <path d={changeBankSvgPaths.p16866180} fill="#435160" />
      </svg>
      <div className="flex items-center gap-[4px] rounded-[24px] border border-[#e5e5e6] bg-[#FFFAF6] px-[12px] py-[10px]">
        <img src={currencyInrIcon} alt="" className="size-4 shrink-0" />
        <p className="font-['Mulish',sans-serif] text-[12px] font-normal leading-none tracking-normal text-center text-[#435160] whitespace-nowrap">
          make one rupee payment
        </p>
      </div>
    </div>
  );
}

interface BankDetailsScreenProps {
  contactPersonName: string;
  accountHolderName?: string;
  bankName?: string;
  accountTypeLabel?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchDisplay?: string;
  qrImageUrl?: string;
  isSaving?: boolean;
  onApmiValidate?: () => void;
  onManualValidate?: () => void;
  onQrGenerate?: () => void;
  onQrPayment?: () => void;
  onSaveAndContinue?: () => void;
  onUploadCancelledCheque?: (file: File) => Promise<boolean>;
  onViewCancelledCheque?: () => void;
  onClearChequeUploadError?: () => void;
  isUploadingCheque?: boolean;
  chequeUploadError?: string | null;
  cancelledChequeFileName?: string;
  chequePreviewDisplayUrl?: string;
  isLoadingChequePreview?: boolean;
  chequePreviewError?: string | null;
  isEditMode: boolean;
  isTransitioning: boolean;
  bankValidationStatus: 'pending' | 'validating' | 'success' | 'failed';
  setBankValidationStatus: (status: 'pending' | 'validating' | 'success' | 'failed') => void;
  chequeUploaded: boolean;
  setChequeUploaded: (value: boolean) => void;
  showChequeUploadModal: boolean;
  setShowChequeUploadModal: (value: boolean) => void;
  chequeUploadModalAnimating: boolean;
  setChequeUploadModalAnimating: (value: boolean) => void;
  chequeFileSelected: boolean;
  setChequeFileSelected: (value: boolean) => void;
  showChequePreviewModal: boolean;
  setShowChequePreviewModal: (value: boolean) => void;
  chequePreviewModalAnimating: boolean;
  setChequePreviewModalAnimating: (value: boolean) => void;
  showChangeBankScreen: boolean;
  setShowChangeBankScreen: (value: boolean) => void;
  changeBankTab: 'qr' | 'manual';
  setChangeBankTab: (tab: 'qr' | 'manual') => void;
  qrGenerated: boolean;
  setQrGenerated: (value: boolean) => void;
  qrTimer: number;
  setQrTimer: (value: number) => void;
  showLoadingModal: boolean;
  setShowLoadingModal: (value: boolean) => void;
  loadingModalAnimating: boolean;
  setLoadingModalAnimating: (value: boolean) => void;
  manualAccountNumber: string;
  setManualAccountNumber: (value: string) => void;
  manualIfscCode: string;
  setManualIfscCode: (value: string) => void;
  manualBankValidating: boolean;
  setManualBankValidating: (value: boolean) => void;
  showManualValidationError: boolean;
  setShowManualValidationError: (value: boolean) => void;
  manualErrorReenterAccountNumber: string;
  setManualErrorReenterAccountNumber: (value: string) => void;
  manualErrorAccountHolderName: string;
  setManualErrorAccountHolderName: (value: string) => void;
  manualErrorAccountType: 'saving' | 'current';
  setManualErrorAccountType: (type: 'saving' | 'current') => void;
  manualErrorBankBranch: string;
  setManualErrorBankBranch: (value: string) => void;
  manualErrorChequeUploaded: boolean;
  setManualErrorChequeUploaded: (value: boolean) => void;
  showManualErrorChequeModal: boolean;
  setShowManualErrorChequeModal: (value: boolean) => void;
  manualErrorChequeModalAnimating: boolean;
  setManualErrorChequeModalAnimating: (value: boolean) => void;
  manualErrorChequeFileSelected: boolean;
  setManualErrorChequeFileSelected: (value: boolean) => void;
  setCurrentStep: (step: string) => void;
  setIsTransitioning: (value: boolean) => void;
  setIsEditMode: (value: boolean) => void;
}

export function BankDetailsScreen({
  contactPersonName,
  accountHolderName = '',
  bankName = '',
  accountTypeLabel = 'Savings',
  accountNumber = '',
  ifscCode = '',
  branchDisplay = '',
  qrImageUrl = '',
  isSaving = false,
  onApmiValidate,
  onManualValidate,
  onQrGenerate,
  onQrPayment,
  onSaveAndContinue,
  onUploadCancelledCheque,
  onViewCancelledCheque,
  onClearChequeUploadError,
  isUploadingCheque = false,
  chequeUploadError = null,
  cancelledChequeFileName = '',
  chequePreviewDisplayUrl = '',
  isLoadingChequePreview = false,
  chequePreviewError = null,
  isEditMode,
  isTransitioning,
  bankValidationStatus,
  setBankValidationStatus,
  chequeUploaded,
  setChequeUploaded,
  showChequeUploadModal,
  setShowChequeUploadModal,
  chequeUploadModalAnimating,
  setChequeUploadModalAnimating,
  chequeFileSelected,
  setChequeFileSelected,
  showChequePreviewModal,
  setShowChequePreviewModal,
  chequePreviewModalAnimating,
  setChequePreviewModalAnimating,
  showChangeBankScreen,
  setShowChangeBankScreen,
  changeBankTab,
  setChangeBankTab,
  qrGenerated,
  setQrGenerated,
  qrTimer,
  setQrTimer,
  showLoadingModal,
  setShowLoadingModal,
  loadingModalAnimating,
  setLoadingModalAnimating,
  manualAccountNumber,
  setManualAccountNumber,
  manualIfscCode,
  setManualIfscCode,
  manualBankValidating,
  setManualBankValidating,
  showManualValidationError,
  setShowManualValidationError,
  manualErrorReenterAccountNumber,
  setManualErrorReenterAccountNumber,
  manualErrorAccountHolderName,
  setManualErrorAccountHolderName,
  manualErrorAccountType,
  setManualErrorAccountType,
  manualErrorBankBranch,
  setManualErrorBankBranch,
  manualErrorChequeUploaded,
  setManualErrorChequeUploaded,
  showManualErrorChequeModal,
  setShowManualErrorChequeModal,
  manualErrorChequeModalAnimating,
  setManualErrorChequeModalAnimating,
  manualErrorChequeFileSelected,
  setManualErrorChequeFileSelected,
  setCurrentStep,
  setIsTransitioning,
  setIsEditMode,
}: BankDetailsScreenProps) {
  // QR Timer countdown effect
  useEffect(() => {
    if (qrGenerated && qrTimer > 0) {
      const timer = setTimeout(() => setQrTimer(qrTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [qrGenerated, qrTimer, setQrTimer]);

  const ifscMaster = {
    ELDHY6734A: {
      bankName: 'ICICI Bank',
      branchName: 'Ghatkopar East',
      branchAddress: 'MG Road, Near Ghatkopar Metro Station Ghatkopar East Mumbai, Maharashtra 400077',
      micr: '400229012',
    },
    ICIC0001959: {
      bankName: 'ICICI Bank',
      branchName: 'Ghatkopar East',
      branchAddress: 'MG Road, Near Ghatkopar Metro Station Ghatkopar East Mumbai, Maharashtra 400077',
      micr: '400229012',
    },
  } as const;

  const normalizedIfscCode = manualIfscCode.trim().toUpperCase();
  const ifscData = ifscMaster[normalizedIfscCode as keyof typeof ifscMaster] ?? ifscMaster.ELDHY6734A;
  const canContinue = bankValidationStatus === 'success';
  const isManualErrorFormValid =
    manualErrorReenterAccountNumber.trim() !== '' &&
    manualErrorReenterAccountNumber === manualAccountNumber &&
    manualErrorAccountHolderName.trim() !== '' &&
    manualErrorAccountType !== undefined &&
    manualErrorBankBranch.trim() !== '' &&
    manualIfscCode.trim() !== '';
  const canContinueFromManualError =
    bankValidationStatus === 'failed' &&
    manualErrorChequeUploaded &&
    isManualErrorFormValid;

  const closeChangeBankScreen = () => {
    setShowChangeBankScreen(false);
    setQrGenerated(false);
    setQrTimer(213);
    setManualBankValidating(false);
  };

  const openChangeBankScreen = (tab: 'qr' | 'manual') => {
    setChangeBankTab(tab);
    setShowManualValidationError(false);
    setShowChangeBankScreen(true);
  };

  const proceedToNext = () => {
    if (onSaveAndContinue) {
      onSaveAndContinue();
      return;
    }
    if (!canContinue || isTransitioning) {
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      if (isEditMode) {
        setCurrentStep('review-confirm');
        setIsEditMode(false);
      } else {
        setCurrentStep('nominee-details');
      }
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const shouldPennyDropFail = (accountNumberValue: string, ifscCodeValue: string) => {
    const normalizedIfsc = ifscCodeValue.trim().toUpperCase();
    return accountNumberValue === '1234567890' || normalizedIfsc.startsWith('FAIL');
  };

  const displayAccountHolderName =
    accountHolderName.trim() ||
    manualErrorAccountHolderName.trim() ||
    contactPersonName.trim() ||
    '—';
  const displayBankName = bankName.trim() || ifscData.bankName;
  const displayAccountNumber = accountNumber.trim() || manualAccountNumber.trim() || '—';
  const displayIfscCode = ifscCode.trim() || normalizedIfscCode || '—';
  const displayBranch =
    branchDisplay.trim() ||
    manualErrorBankBranch.trim() ||
    ifscData.branchAddress;
  const resolvedQrImage = qrImageUrl.trim() || imgQrCode;

  const handleApmiValidate = () => {
    if (bankValidationStatus !== 'pending' && bankValidationStatus !== 'failed') {
      return;
    }
    setChequeUploaded(false);
    if (onApmiValidate) {
      onApmiValidate();
      return;
    }
    setBankValidationStatus('validating');
    setTimeout(() => {
      const apmiShouldFail =
        shouldPennyDropFail('0987654320', 'ELDHY6734A') ||
        contactPersonName.trim().toLowerCase().includes('fail');

      if (apmiShouldFail) {
        setBankValidationStatus('failed');
      } else {
        setBankValidationStatus('success');
      }
    }, 1500);
  };

  const handleQrGenerate = () => {
    if (onQrGenerate) {
      onQrGenerate();
      return;
    }
    setQrGenerated(true);
    setQrTimer(213);
  };

  const handleQrPayment = () => {
    if (!qrGenerated || qrTimer <= 0) {
      return;
    }
    if (onQrPayment) {
      onQrPayment();
      return;
    }
    setShowLoadingModal(true);
    setTimeout(() => setLoadingModalAnimating(true), 10);

    setTimeout(() => {
      setLoadingModalAnimating(false);
      setTimeout(() => {
        setShowLoadingModal(false);
        setBankValidationStatus('success');
        closeChangeBankScreen();
      }, 200);
    }, 2500);
  };

  const handleManualValidate = () => {
    if (!manualAccountNumber || !normalizedIfscCode || manualBankValidating) {
      return;
    }

    if (onManualValidate) {
      onManualValidate();
      return;
    }

    setManualBankValidating(true);
    setBankValidationStatus('validating');

    setTimeout(() => {
      setManualBankValidating(false);

      if (shouldPennyDropFail(manualAccountNumber, normalizedIfscCode)) {
        setBankValidationStatus('failed');
        setShowManualValidationError(true);
        setChequeUploaded(false);
        setManualErrorChequeUploaded(false);
        setManualErrorReenterAccountNumber('');
        setManualErrorAccountHolderName('');
        setManualErrorBankBranch('');
        return;
      }

      setManualErrorAccountHolderName(contactPersonName.trim() || 'Rajesh Gupta');
      setManualErrorBankBranch(ifscData.branchAddress);
      setManualErrorReenterAccountNumber(manualAccountNumber);
      setBankValidationStatus('success');
      setShowManualValidationError(false);
      closeChangeBankScreen();
    }, 1500);
  };

  const chequeFileInputRef = useRef<HTMLInputElement | null>(null);
  const manualErrorChequeFileInputRef = useRef<HTMLInputElement | null>(null);
  const [chequeCameraTarget, setChequeCameraTarget] = useState<'cheque' | 'manualErrorCheque' | null>(null);
  const [chequePreviewUrl, setChequePreviewUrl] = useState('');
  const [manualErrorChequePreviewUrl, setManualErrorChequePreviewUrl] = useState('');
  const [pendingChequeFile, setPendingChequeFile] = useState<File | null>(null);
  const [pendingManualErrorChequeFile, setPendingManualErrorChequeFile] = useState<File | null>(null);

  const revokePreviewUrl = (url: string) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  };

  const openChequeFilePicker = (inputRef: { current: HTMLInputElement | null }) => {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    input.value = '';
    input.click();
  };

  const clearChequeSelection = () => {
    setChequeFileSelected(false);
    setPendingChequeFile(null);
    setChequePreviewUrl((prev) => {
      revokePreviewUrl(prev);
      return '';
    });
  };

  const clearManualErrorChequeSelection = () => {
    setManualErrorChequeFileSelected(false);
    setPendingManualErrorChequeFile(null);
    setManualErrorChequePreviewUrl((prev) => {
      revokePreviewUrl(prev);
      return '';
    });
  };

  const handleChequeFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setPendingChequeFile(file);
    setChequePreviewUrl((prev) => {
      revokePreviewUrl(prev);
      return nextUrl;
    });
    setChequeFileSelected(true);
    event.target.value = '';
  };

  const handleManualErrorChequeFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setPendingManualErrorChequeFile(file);
    setManualErrorChequePreviewUrl((prev) => {
      revokePreviewUrl(prev);
      return nextUrl;
    });
    setManualErrorChequeFileSelected(true);
    event.target.value = '';
  };

  const applyChequeCapture = (file: File, target: 'cheque' | 'manualErrorCheque') => {
    const nextUrl = URL.createObjectURL(file);
    if (target === 'cheque') {
      setPendingChequeFile(file);
      setChequePreviewUrl((prev) => {
        revokePreviewUrl(prev);
        return nextUrl;
      });
      setChequeFileSelected(true);
      return;
    }

    setPendingManualErrorChequeFile(file);
    setManualErrorChequePreviewUrl((prev) => {
      revokePreviewUrl(prev);
      return nextUrl;
    });
    setManualErrorChequeFileSelected(true);
  };

  const handleChequeCameraSave = async (file: File) => {
    if (chequeCameraTarget) {
      applyChequeCapture(file, chequeCameraTarget);
    }
    setChequeCameraTarget(null);
  };

  const handleChequeUploadSave = async () => {
    if (!pendingChequeFile || isUploadingCheque) {
      return;
    }
    if (onUploadCancelledCheque) {
      const uploaded = await onUploadCancelledCheque(pendingChequeFile);
      if (!uploaded) {
        return;
      }
    } else {
      setChequeUploaded(true);
    }
    setChequeUploadModalAnimating(false);
    setTimeout(() => {
      setShowChequeUploadModal(false);
      clearChequeSelection();
    }, 200);
  };

  const handleManualErrorChequeSave = async () => {
    if (!pendingManualErrorChequeFile || isUploadingCheque) {
      return;
    }

    if (onUploadCancelledCheque) {
      const uploaded = await onUploadCancelledCheque(pendingManualErrorChequeFile);
      if (!uploaded) {
        return;
      }
    } else {
      setChequeUploaded(true);
      setManualErrorChequeUploaded(true);
    }

    setManualErrorChequeModalAnimating(false);
    setTimeout(() => {
      setShowManualErrorChequeModal(false);
      clearManualErrorChequeSelection();
    }, 200);
  };

  const chequeDisplayName = cancelledChequeFileName.trim() || 'Cheque.png';

  return (
    <>
      {showChangeBankScreen && !showManualValidationError ? (
        /* Change Bank Account Screen */
        <>
          {/* Mobile View */}
          <div className="lg:hidden fixed inset-0 bg-[#fffaf6] z-30 overflow-y-auto">
            <div className="flex flex-col gap-[24px] items-center pt-[24px] px-[24px] pb-[120px]">
              {/* Logo — parent chrome is covered by this full-screen overlay */}
              <div className="h-[48px] w-[98px] shrink-0 self-start">
                <img alt="ICICI Prudential" className="size-full object-contain" src={imgLogo} />
              </div>

              {/* Header */}
              <div className="flex flex-col gap-[4px] items-start w-full">
                <p className="font-['Mulish',sans-serif] font-medium leading-[24px] text-[#231f20] text-[16px]">Bank Details</p>
                <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#435160] text-[13px]">Your details have been fetched from APMI. Fields shown in grey cannot be changed</p>
              </div>

              {/* Step Indicator */}
              <div className="flex flex-col gap-[8px] items-start w-full">
                <div className="flex items-center justify-between w-full h-[18px]">
                  <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Step 3 of 6</p>
                  <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">20%</p>
                </div>

                {/* White Form Container */}
                <div className="bg-white rounded-[16px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] w-full overflow-hidden">
                  <div className="flex flex-col items-center size-full">
                    <div className="flex flex-col gap-[20px] items-center pb-[16px] px-[16px] relative size-full">
                      {/* Progress Bar */}
                      <div className="bg-[#e6e7e8] h-[8px] overflow-clip relative rounded-[999px] shrink-0 w-full">
                        <div className="absolute bg-[#37b400] h-[8px] left-0 rounded-[999px] top-0 w-[179px]"></div>
                      </div>

                      {/* Back Button */}
                      <div className="flex flex-col gap-[16px] items-start w-full">
                        <button
                          onClick={closeChangeBankScreen}
                          className="flex gap-[4px] items-center justify-center hover:opacity-70 transition-opacity"
                        >
                          <svg className="size-[16px]" fill="none" viewBox="0 0 6.50314 11.5026">
                            <path d={mobileChangeBankSvgPaths.p3893f300} fill="#93161E" />
                          </svg>
                          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#93161e] text-[13px]">Back</p>
                        </button>

                        {/* Tab Switcher */}
                        <div className="bg-[#f5f5f5] rounded-[16777200px] w-full p-[4px]">
                          <div className="flex gap-[4px] items-center">
                            <button
                              onClick={() => setChangeBankTab('qr')}
                              className={`flex-1 px-[14px] py-[5px] rounded-[16777200px] flex items-center justify-center transition-all duration-200 ${changeBankTab === 'qr'
                                ? 'bg-white text-[#93161e]'
                                : 'bg-transparent text-[#5a6b7d]'
                                }`}
                            >
                              <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[14px] text-center whitespace-nowrap">Add using QR Code</p>
                            </button>
                            <button
                              onClick={() => setChangeBankTab('manual')}
                              className={`flex-1 px-[14px] py-[5px] rounded-[16777200px] flex items-center justify-center transition-all duration-200 ${changeBankTab === 'manual'
                                ? 'bg-white text-[#93161e]'
                                : 'bg-transparent text-[#5a6b7d]'
                                }`}
                            >
                              <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[14px] text-center whitespace-nowrap">Add Bank Details Manually</p>
                            </button>
                          </div>
                        </div>
                      </div>

                      {changeBankTab === 'qr' ? (
                        <>
                          {/* Title */}
                          <p className="font-['Mulish',sans-serif] font-medium leading-none tracking-normal text-[#231F20] text-[12px] text-center w-full">Scan QR to add your bank account</p>

                          {/* QR Code */}
                          <div className="relative size-[116px] shrink-0 overflow-hidden">
                            <img
                              src={qrGenerated && qrTimer > 0 ? resolvedQrImage : imgQrCode}
                              alt="QR Code"
                              onClick={handleQrPayment}
                              className={`absolute inset-0 size-full object-cover ${qrGenerated && qrTimer > 0 ? 'cursor-pointer' : 'scale-110 blur-[8px]'}`}
                            />
                            {(!qrGenerated || qrTimer === 0) && (
                              <button
                                onClick={handleQrGenerate}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#93161e] h-[29px] px-[16px] py-[7px] rounded-[8px] flex items-center justify-center hover:bg-[#7a1319] transition-colors"
                              >
                                <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-center text-white text-[14px] whitespace-nowrap">
                                  {qrTimer === 0 ? 'Regenerate QR' : 'Generate QR'}
                                </p>
                              </button>
                            )}
                          </div>

                          <QrScanInstructionPills />

                          {/* Timer - shown when QR is generated and timer > 0 */}
                          {qrGenerated && qrTimer > 0 && (
                            <div className="flex gap-[6px] items-center justify-center">
                              <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px] whitespace-nowrap">Complete payment in</p>
                              <img src={imgClock} alt="Clock" className="size-[18px]" />
                              <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px] whitespace-nowrap">
                                {String(Math.floor(qrTimer / 60)).padStart(2, '0')}:{String(qrTimer % 60).padStart(2, '0')}
                              </p>
                            </div>
                          )}

                          {/* Error message - shown when timer runs out */}
                          {qrGenerated && qrTimer === 0 && (
                            <div className="bg-[#fff1e2] flex gap-[8px] items-start p-[12px] rounded-[8px]">
                              <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 13.7506 12.2499">
                                <path d={qrGeneratedSvgPaths.p1682e300} fill="#93161E" />
                              </svg>
                              <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#93161e] text-[12px]">Payment request timed out. Please try again by clicking regenerate QR code</p>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Manual Entry - Mobile */}
                          <div className="flex flex-col gap-[16px] w-full">
                            {/* Account Number Field */}
                            <div className="flex flex-col gap-[4px] w-full">
                              <div className="flex gap-[2px]">
                                <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Account Number</p>
                                <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                              </div>
                              <Input
                                type="text"
                                value={manualAccountNumber}
                                onChange={(e) => setManualAccountNumber(e.target.value)}
                                placeholder="0987654320"
                              />
                            </div>

                            {/* IFSC Code Field */}
                            <div className="flex flex-col gap-[4px] w-full">
                              <div className="flex gap-[2px]">
                                <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">IFSC Code</p>
                                <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                              </div>
                              <Input
                                type="text"
                                value={manualIfscCode}
                                onChange={(e) => setManualIfscCode(e.target.value.toUpperCase())}
                                placeholder="ELDHY6734A"
                              />
                            </div>

                            {/* Validate Button */}
                            <div className="flex items-center justify-end w-full">
                              <button
                                onClick={handleManualValidate}
                                disabled={!manualAccountNumber || !manualIfscCode || manualBankValidating}
                                className={`h-[29px] px-[16px] py-[7px] rounded-[8px] flex gap-[8px] items-center justify-center transition-colors ${manualAccountNumber && manualIfscCode && !manualBankValidating
                                  ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                                  : 'bg-[#e5e5e6] cursor-not-allowed'
                                  }`}
                              >
                                <p className={`font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] whitespace-nowrap ${manualAccountNumber && manualIfscCode && !manualBankValidating ? 'text-white' : 'text-[#5a6b7d]'
                                  }`}>
                                  {manualBankValidating ? 'Validating...' : 'Validate'}
                                </p>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block">
            {/* Page Title - Desktop */}
            <div className="flex flex-col gap-[4px] absolute left-[60px] xl:left-[120px] top-[172px] z-20 w-[1200px]">
              <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#231f20] text-[22px]">Bank Details</p>
              <p className="font-['Mulish',sans-serif] font-normal leading-[22.5px] text-[#435160] text-[15px]">Select your preferred method to update bank account details</p>
            </div>

            {/* Form Container */}
            <div className="absolute left-[60px] xl:left-[120px] right-[60px] xl:right-[120px] top-[248px] z-20">
              {/* Step Indicator */}
              <div className="flex items-center justify-between mb-[8px] w-full">
                <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Step 3 of 6</p>
                <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">50%</p>
              </div>

              {/* White Form Container */}
              <div className="bg-white rounded-[16px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] w-full">
                {/* Progress Bar */}
                <div className="overflow-hidden rounded-t-[16px]">
                  <div className="bg-[#e6e7e8] h-[8px] w-full">
                    <div className="bg-[#37b400] h-full w-[50%] animate-[progressBar_0.8s_ease-out]"></div>
                  </div>
                </div>

                <div className="flex flex-col gap-[20px] items-center p-[16px]">
                  {/* Back Button */}
                  <button
                    onClick={closeChangeBankScreen}
                    className="flex gap-[4px] items-center self-start hover:opacity-70 transition-opacity"
                  >
                    <svg className="size-[16px]" fill="none" viewBox="0 0 6.50314 11.5026">
                      <path d={mobileChangeBankSvgPaths.p3893f300} fill="#93161E" />
                    </svg>
                    <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#93161e] text-[13px]">Back</p>
                  </button>

                  {/* Tab Switcher */}
                  <div className="flex items-center w-full">
                    <div className="bg-[#f5f5f5] flex gap-[4px] items-center p-[4px] rounded-full">
                      <button
                        onClick={() => setChangeBankTab('qr')}
                        className={`px-[14px] py-[5px] rounded-full flex items-center justify-center transition-all duration-200 ${changeBankTab === 'qr'
                          ? 'bg-white text-[#93161e]'
                          : 'bg-transparent text-[#5a6b7d]'
                          }`}
                      >
                        <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[14px] text-center whitespace-nowrap">Add using QR Code</p>
                      </button>
                      <button
                        onClick={() => setChangeBankTab('manual')}
                        className={`px-[14px] py-[5px] rounded-full flex items-center justify-center transition-all duration-200 ${changeBankTab === 'manual'
                          ? 'bg-white text-[#93161e]'
                          : 'bg-transparent text-[#5a6b7d]'
                          }`}
                      >
                        <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-[14px] text-center whitespace-nowrap">Add Bank Details Manually</p>
                      </button>
                    </div>
                  </div>

                  {changeBankTab === 'qr' ? (
                    <>
                      {/* QR Code Content */}
                      <p className="font-['Mulish',sans-serif] font-medium leading-none tracking-normal text-[#231F20] text-[12px] text-center w-[390px]">Scan QR to add your bank account</p>

                      {/* QR Code */}
                      <div className="relative size-[116px] overflow-hidden">
                        <img
                          src={qrGenerated && qrTimer > 0 ? resolvedQrImage : imgQrCode}
                          alt="QR Code"
                          onClick={handleQrPayment}
                          className={`absolute inset-0 size-full object-cover ${qrGenerated && qrTimer > 0 ? 'cursor-pointer' : 'scale-110 blur-[3px]'}`}
                        />
                        {(!qrGenerated || qrTimer === 0) && (
                          <button
                            onClick={handleQrGenerate}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#93161e] h-[29px] px-[16px] py-[7px] rounded-[8px] flex items-center justify-center hover:bg-[#7a1319] transition-colors"
                          >
                            <p className="font-['Mulish',sans-serif] font-normal leading-none tracking-normal text-center text-white text-[14px] whitespace-nowrap">
                              {qrTimer === 0 ? 'Regenerate QR' : 'Generate QR'}
                            </p>
                          </button>
                        )}
                      </div>

                      <QrScanInstructionPills />

                      {/* Timer - shown when QR is generated and timer > 0 */}
                      {qrGenerated && qrTimer > 0 && (
                        <div className="flex gap-[6px] items-center justify-center">
                          <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px] whitespace-nowrap">Complete payment in</p>
                          <img src={imgClock} alt="Clock" className="size-[18px]" />
                          <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px] whitespace-nowrap">
                            {String(Math.floor(qrTimer / 60)).padStart(2, '0')}:{String(qrTimer % 60).padStart(2, '0')}
                          </p>
                        </div>
                      )}

                      {/* Error message - shown when timer runs out */}
                      {qrGenerated && qrTimer === 0 && (
                        <div className="bg-[#fff1e2] flex gap-[8px] items-start p-[12px] rounded-[8px]">
                          <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 13.7506 12.2499">
                            <path d={qrGeneratedSvgPaths.p1682e300} fill="#93161E" />
                          </svg>
                          <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#93161e] text-[12px] whitespace-nowrap">Payment request timed out. Please try again by clicking regenerate QR code</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Manual Entry Content */}
                      <div className="flex gap-[16px] items-start w-full">
                        {/* Account Number Field */}
                        <div className="flex flex-col gap-[4px] items-start flex-1">
                          <div className="flex gap-[2px] items-start w-full">
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Account  Number</p>
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                          </div>
                          <Input
                            type="text"
                            value={manualAccountNumber}
                            onChange={(e) => setManualAccountNumber(e.target.value)}
                            placeholder="0987654320"
                          />
                        </div>

                        {/* IFSC Code Field */}
                        <div className="flex flex-col gap-[4px] items-start flex-1">
                          <div className="flex gap-[2px] items-start w-full">
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">IFSC Code</p>
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                          </div>
                          <Input
                            type="text"
                            value={manualIfscCode}
                            onChange={(e) => setManualIfscCode(e.target.value.toUpperCase())}
                            placeholder="ELDHY6734A"
                          />
                        </div>

                        {/* Third field - opacity 0 to maintain layout */}
                        <div className="flex flex-col gap-[4px] items-start flex-1 opacity-0">
                          <div className="flex gap-[2px] items-start w-full">
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">IFSC Code</p>
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                          </div>
                          <Input type="text" disabled />
                        </div>
                      </div>

                      {/* Validate Button */}
                      <div className="flex items-center justify-end w-full">
                        <button
                          onClick={handleManualValidate}
                          disabled={!manualAccountNumber || !manualIfscCode || manualBankValidating}
                          className={`h-[29px] px-[16px] py-[7px] rounded-[8px] flex gap-[8px] items-center justify-center transition-colors ${manualAccountNumber && manualIfscCode && !manualBankValidating
                            ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                            : 'bg-[#e5e5e6] cursor-not-allowed'
                            }`}
                        >
                          <p className={`font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] whitespace-nowrap ${manualAccountNumber && manualIfscCode && !manualBankValidating ? 'text-white' : 'text-[#5a6b7d]'
                            }`}>
                            {manualBankValidating ? 'Validating...' : 'Validate'}
                          </p>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Loading Modal - shown when QR is clicked */}
          {showLoadingModal && (
            <>
              {/* Backdrop */}
              <div
                className={`fixed inset-0 backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)] z-50 transition-opacity duration-200 ease-out ${loadingModalAnimating ? 'opacity-100' : 'opacity-0'
                  }`}
              />

              {/* Modal */}
              <div className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[16px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.12)] w-[calc(100vw-40px)] max-w-[590px] p-[24px] lg:p-[32px] z-[60] flex flex-col gap-[16px] lg:gap-[24px] items-center justify-center transition-all duration-200 ease-out ${loadingModalAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                {/* Loading Spinner */}
                <div className="relative size-[50px] lg:size-[70px]">
                  <svg className="size-full" fill="none" viewBox="0 0 70.0001 70.0001">
                    <path d={loadingSvgPaths.p289bd300} fill="#E6E7E8" />
                    <path d={loadingSvgPaths.p1ac34c80} fill="#93161E" className="animate-spin origin-center" />
                  </svg>
                </div>

                {/* Loading Text */}
                <p className="font-['Mulish',sans-serif] font-medium leading-[1.4] text-[#435160] text-[16px] lg:text-[22px] text-center w-full">Please wait while we fetch Account Details...</p>
              </div>
            </>
          )}

          <OnboardingStepFooter
            nextLabel="Nominee Details"
            onPrevious={closeChangeBankScreen}
            continueDisabled={!canContinue}
            isLoading={isTransitioning || isSaving}
            loadingLabel="Saving..."
            onContinue={proceedToNext}
          />
        </>
      ) : showManualValidationError ? (
        /* Manual Validation Error Screen */
        <>
          {/* ── MOBILE / TABLET VIEW ── */}
          <div className="lg:hidden fixed inset-0 bg-[#fffaf6] z-30 overflow-y-auto">
            <div className="flex flex-col gap-[24px] items-center pt-[24px] px-[24px] pb-[120px]">
              {/* Logo — parent chrome is covered by this full-screen overlay */}
              <div className="h-[48px] w-[98px] shrink-0 self-start">
                <img alt="ICICI Prudential" className="size-full object-contain" src={imgLogo} />
              </div>

              {/* Header */}
              <div className="flex flex-col gap-[4px] items-start w-full">
                <p className="font-['Mulish',sans-serif] font-medium leading-[24px] text-[#231f20] text-[16px]">Bank Details</p>
                <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#435160] text-[13px]">Select your preferred method to update bank account details</p>
              </div>

              {/* Step Indicator + Card */}
              <div className="flex flex-col gap-[8px] items-start w-full">
                <div className="flex items-center justify-between w-full h-[18px]">
                  <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Step 3 of 6</p>
                  <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">20%</p>
                </div>

                {/* White Form Card */}
                <div className="bg-white rounded-[16px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] w-full overflow-hidden">
                  {/* Progress Bar */}
                  <div className="bg-[#e6e7e8] h-[8px] w-full relative">
                    <div className="absolute bg-[#37b400] h-[8px] left-0 top-0 rounded-[999px]" style={{ width: '50.56%' }} />
                  </div>

                  <div className="flex flex-col gap-[20px] items-start pb-[16px] px-[16px] pt-[0px]">
                    {/* Warning Banner */}
                    <div className="bg-[#fff1e2] rounded-[8px] w-full mt-[16px]">
                      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                        <div className="flex gap-[8px] items-center p-[12px] w-full">
                          <div className="overflow-clip relative shrink-0 size-[16px]">
                            <svg className="absolute inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.7506 12.2499">
                              <path d={mobileBankFailedSvgPaths.p1682e300} fill="#93161E" />
                            </svg>
                          </div>
                          <p className="flex-1 font-['Mulish',sans-serif] font-normal leading-[18px] text-[#93161e] text-[12px] min-w-0">
                            We couldn't process your request. Kindly fill in the details below to continue.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Upload Cancelled Cheque */}
                    <div className="flex flex-col gap-[4px] w-full">
                      <div className="flex gap-[2px] items-start">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Upload Cancelled Cheque</p>
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                      </div>
                      {manualErrorChequeUploaded ? (
                        <button
                          type="button"
                          onClick={() => onViewCancelledCheque?.()}
                          className="bg-[#fffaf6] border border-[#97291e] rounded-[8px] p-[14px] w-full max-w-[196px] hover:bg-[#fff5eb] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full gap-[6px]">
                            <p className="font-['Mulish',sans-serif] font-normal leading-normal text-[#231f20] text-[13px] whitespace-nowrap truncate min-w-0">
                              {chequeDisplayName}
                            </p>
                            <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 15 10">
                              <path d="M7.5 1.25C4.375 1.25 1.6875 3.1875 0.625 6C1.6875 8.8125 4.375 10.75 7.5 10.75C10.625 10.75 13.3125 8.8125 14.375 6C13.3125 3.1875 10.625 1.25 7.5 1.25ZM7.5 9.25C5.84375 9.25 4.5 7.90625 4.5 6.25C4.5 4.59375 5.84375 3.25 7.5 3.25C9.15625 3.25 10.5 4.59375 10.5 6.25C10.5 7.90625 9.15625 9.25 7.5 9.25ZM7.5 4.5C6.53125 4.5 5.75 5.28125 5.75 6.25C5.75 7.21875 6.53125 8 7.5 8C8.46875 8 9.25 7.21875 9.25 6.25C9.25 5.28125 8.46875 4.5 7.5 4.5Z" fill="#93161E" />
                            </svg>
                          </div>
                        </button>
                      ) : (
                        <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] flex items-center pr-[5.5px]">
                          <div className="flex-1 px-[12px] min-w-0">
                            <p className="font-['Mulish',sans-serif] font-normal leading-[normal] text-[#71859b] text-[12px] truncate">
                              Supported: PNG, JPEG or PDF up to 2MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              onClearChequeUploadError?.();
                              clearManualErrorChequeSelection();
                              setShowManualErrorChequeModal(true);
                              setTimeout(() => setManualErrorChequeModalAnimating(true), 10);
                            }}
                            className="bg-[#93161e] hover:bg-[#7a1319] transition-colors px-[12px] py-[4px] rounded-[4px] shrink-0"
                          >
                            <p className="font-['Mulish',sans-serif] font-normal leading-[16.5px] text-white text-[11px] whitespace-nowrap">Browse</p>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Account Number (masked) */}
                    <div className="flex flex-col gap-[4px] w-full">
                      <div className="flex gap-[2px] items-start">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Account  Number</p>
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                      </div>
                      <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] flex items-center px-[14px]">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px]">***********</p>
                      </div>
                    </div>

                    {/* Re-enter Account Number */}
                    <div className="flex flex-col gap-[4px] w-full">
                      <div className="flex gap-[2px] items-start">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Re-enter Account Number</p>
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                      </div>
                      <Input
                        type="text"
                        value={manualErrorReenterAccountNumber}
                        onChange={(e) => setManualErrorReenterAccountNumber(e.target.value)}
                        placeholder="0987654320"
                      />
                    </div>

                    {/* Account Holder Name */}
                    <div className="flex flex-col gap-[4px] w-full">
                      <div className="flex gap-[2px] items-start">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Account Holder Name</p>
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                      </div>
                      <Input
                        type="text"
                        value={manualErrorAccountHolderName}
                        onChange={(e) => setManualErrorAccountHolderName(e.target.value)}
                        placeholder="Rajesh Gupta"
                      />
                    </div>

                    {/* Account Type Switcher */}
                    <div className="flex flex-col gap-[4px] w-full">
                      <div className="flex gap-[2px] items-start">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Account Type</p>
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                      </div>
                      <div className="bg-[#f5f5f5] rounded-[16777200px] w-full p-[4px]">
                        <div className="flex gap-[4px] items-center">
                          <button
                            onClick={() => setManualErrorAccountType('saving')}
                            className={`flex-1 px-[14px] py-[5px] rounded-[16777200px] flex items-center justify-center transition-all duration-200 ${manualErrorAccountType === 'saving' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                              }`}
                          >
                            <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] whitespace-nowrap">Saving Account</p>
                          </button>
                          <button
                            onClick={() => setManualErrorAccountType('current')}
                            className={`flex-1 px-[14px] py-[5px] rounded-[16777200px] flex items-center justify-center transition-all duration-200 ${manualErrorAccountType === 'current' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                              }`}
                          >
                            <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] whitespace-nowrap">Current Account</p>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* IFSC Code */}
                    <div className="flex flex-col gap-[4px] w-full">
                      <div className="flex gap-[2px] items-start">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">IFSC Code</p>
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                      </div>
                      <Input
                        type="text"
                        value={manualIfscCode}
                        onChange={(e) => setManualIfscCode(e.target.value.toUpperCase())}
                        className="uppercase"
                        placeholder="ICIC0001959"
                      />
                    </div>

                    {/* Bank Branch & Address */}
                    <div className="flex flex-col gap-[4px] w-full">
                      <div className="flex gap-[2px] items-start">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Bank Branch & Address</p>
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                      </div>
                      <div className="bg-white rounded-[8px] border border-[#eee] flex items-start px-[14px] py-[10px] min-h-[62px]">
                        <textarea
                          value={manualErrorBankBranch}
                          onChange={(e) => setManualErrorBankBranch(e.target.value)}
                          className="flex-1 font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px] bg-transparent outline-none resize-none min-h-[42px]"
                          placeholder="MG Road, Near Ghatkopar Metro Station Ghatkopar East Mumbai, Maharashtra 400077"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── DESKTOP VIEW ── */}
          {/* Page Title */}
          <div className="hidden lg:flex flex-col gap-[4px] absolute left-[60px] xl:left-[120px] top-[172px] z-20 w-[1200px]">
            <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#231f20] text-[22px]">Bank Details</p>
            <p className="font-['Mulish',sans-serif] font-normal leading-[22.5px] text-[#435160] text-[15px]">Select your preferred method to update bank account details</p>
          </div>

          {/* Form Container */}
          <div className="hidden lg:block absolute left-[60px] xl:left-[120px] right-[60px] xl:right-[120px] top-[248px] z-20 pb-[80px]">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-[8px] w-full">
              <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Step 3 of 6</p>
              <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">20%</p>
            </div>

            {/* White Form Container */}
            <div className="bg-white rounded-[16px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] w-full">
              {/* Progress Bar */}
              <div className="overflow-hidden rounded-t-[16px]">
                <div className="bg-[#e6e7e8] h-[8px] w-full">
                  <div className="bg-[#37b400] h-full w-[50%] animate-[progressBar_0.8s_ease-out]"></div>
                </div>
              </div>

              <div className="flex flex-col gap-[20px] p-[16px]">
                {/* Warning Message */}
                <div className="bg-[#fff1e2] rounded-[8px] p-[12px] flex gap-[8px] items-start">
                  <div className="size-[16px] shrink-0 relative">
                    <svg className="absolute inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.7506 12.2499">
                      <path d={mobileBankFailedSvgPaths.p1682e300} fill="#93161E" />
                    </svg>
                  </div>
                  <p className="flex-1 font-['Mulish',sans-serif] font-normal leading-[18px] text-[#93161e] text-[12px]">
                    We couldn't process your request. Kindly fill in the details below to continue.
                  </p>
                </div>

                {/* Upload Cancelled Cheque */}
                <div className="flex flex-col gap-[4px] w-full min-w-[310px] max-w-[378.67px]">
                  <div className="flex gap-[2px] items-start">
                    <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Upload Cancelled Cheque</p>
                    <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                  </div>
                  {manualErrorChequeUploaded ? (
                    <button
                      type="button"
                      onClick={() => onViewCancelledCheque?.()}
                      className="bg-[#fffaf6] border border-[#97291e] rounded-[8px] p-[14px] w-[196px] shrink-0 hover:bg-[#fff5eb] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full gap-[6px]">
                        <p className="font-['Mulish',sans-serif] font-normal leading-normal text-[#231f20] text-[13px] whitespace-nowrap truncate min-w-0">
                          {chequeDisplayName}
                        </p>
                        <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 15 10">
                          <path d="M7.5 1.25C4.375 1.25 1.6875 3.1875 0.625 6C1.6875 8.8125 4.375 10.75 7.5 10.75C10.625 10.75 13.3125 8.8125 14.375 6C13.3125 3.1875 10.625 1.25 7.5 1.25ZM7.5 9.25C5.84375 9.25 4.5 7.90625 4.5 6.25C4.5 4.59375 5.84375 3.25 7.5 3.25C9.15625 3.25 10.5 4.59375 10.5 6.25C10.5 7.90625 9.15625 9.25 7.5 9.25ZM7.5 4.5C6.53125 4.5 5.75 5.28125 5.75 6.25C5.75 7.21875 6.53125 8 7.5 8C8.46875 8 9.25 7.21875 9.25 6.25C9.25 5.28125 8.46875 4.5 7.5 4.5Z" fill="#93161E" />
                        </svg>
                      </div>
                    </button>
                  ) : (
                    <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] flex items-center pr-[5.5px] py-[14px]">
                      <div className="flex-1 px-[12px] min-w-0">
                        <p className="font-['Mulish',sans-serif] font-normal text-[#71859b] text-[13px] truncate">
                          Supported: PNG, JPEG or PDF up to 2MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClearChequeUploadError?.();
                          clearManualErrorChequeSelection();
                          setShowManualErrorChequeModal(true);
                          setTimeout(() => setManualErrorChequeModalAnimating(true), 10);
                        }}
                        className="bg-[#93161e] hover:bg-[#7a1319] transition-colors px-[12px] py-[4px] rounded-[4px]"
                      >
                        <p className="font-['Mulish',sans-serif] font-normal leading-[16.5px] text-white text-[11px]">Browse</p>
                      </button>
                    </div>
                  )}
                </div>

                {/* Form Fields Grid - 3 columns */}
                <div className="flex flex-wrap gap-[16px] w-full">
                  <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)]">
                    <div className="flex gap-[2px] items-start">
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Account  Number</p>
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                    </div>
                    <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] flex items-center px-[14px]">
                      <p className="font-['Mulish',sans-serif] font-normal text-[#231f20] text-[13px]">***********</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)]">
                    <div className="flex gap-[2px] items-start">
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Re-enter Account Number</p>
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                    </div>
                    <Input
                      type="text"
                      value={manualErrorReenterAccountNumber}
                      onChange={(e) => setManualErrorReenterAccountNumber(e.target.value)}
                      placeholder="0987654320"
                    />
                  </div>

                  <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)]">
                    <div className="flex gap-[2px] items-start">
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Account Holder Name</p>
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                    </div>
                    <Input
                      type="text"
                      value={manualErrorAccountHolderName}
                      onChange={(e) => setManualErrorAccountHolderName(e.target.value)}
                      placeholder="Rajesh Gupta"
                    />
                  </div>

                  <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)]">
                    <div className="flex gap-[2px] items-start">
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Account Type</p>
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                    </div>
                    <div className="bg-[#f5f5f5] rounded-[16777200px] p-[4px]">
                      <div className="flex gap-[4px] items-center">
                        <button
                          onClick={() => setManualErrorAccountType('saving')}
                          className={`flex-1 px-[14px] py-[5px] rounded-[16777200px] transition-colors ${manualErrorAccountType === 'saving' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                            }`}
                        >
                          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px]">Saving Account</p>
                        </button>
                        <button
                          onClick={() => setManualErrorAccountType('current')}
                          className={`flex-1 px-[14px] py-[5px] rounded-[16777200px] transition-colors ${manualErrorAccountType === 'current' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                            }`}
                        >
                          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px]">Current Account</p>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)]">
                    <div className="flex gap-[2px] items-start">
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">IFSC Code</p>
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                    </div>
                    <Input
                      type="text"
                      value={manualIfscCode}
                      onChange={(e) => setManualIfscCode(e.target.value.toUpperCase())}
                      className="uppercase"
                      placeholder="ICIC0001959"
                    />
                  </div>

                  <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)] h-[83px]">
                    <div className="flex gap-[2px] items-start">
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Bank Branch & Address</p>
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                    </div>
                    <div className="bg-white flex-1 rounded-[8px] border border-[#eee] flex items-center px-[14px]">
                      <textarea
                        value={manualErrorBankBranch}
                        onChange={(e) => setManualErrorBankBranch(e.target.value)}
                        className="flex-1 h-full font-['Mulish',sans-serif] font-normal text-[#231f20] text-[13px] bg-transparent outline-none resize-none py-[8px]"
                        placeholder="MG Road, Near Ghatkopar Metro Station Ghatkopar East Mumbai, Maharashtra 400077"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <OnboardingStepFooter
            nextLabel="Nominee Details"
            onPrevious={() => {
              setShowManualValidationError(false);
              setShowChangeBankScreen(false);
              setManualAccountNumber('');
              setManualIfscCode('');
            }}
            continueDisabled={!canContinueFromManualError}
            isLoading={isTransitioning || isSaving}
            loadingLabel="Saving..."
            onContinue={() => {
              if (canContinueFromManualError) {
                proceedToNext();
              }
            }}
          />
        </>
      ) : (
        /* Main Bank Details Screen */
        <>
          {/* Page Title - Desktop */}
          <div className="hidden lg:flex flex-col gap-[4px] absolute left-[60px] xl:left-[120px] top-[172px] z-20 w-[1200px]">
            <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#231f20] text-[22px]">Bank Details</p>
            <p className="font-['Mulish',sans-serif] font-normal leading-[22.5px] text-[#435160] text-[15px]">Your details have been fetched from APMI. Fields shown in grey cannot be changed</p>
          </div>

          {/* Mobile/Tablet Header Section */}
          <div className="lg:hidden absolute left-[24px] right-[24px] top-[96px] z-20 flex flex-col gap-[4px]">
            <h1 className="font-['Mulish',sans-serif] font-medium leading-[24px] text-[#231f20] text-[16px]">Bank Details</h1>
            <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#435160] text-[13px]">Your details have been fetched from APMI. Fields shown in grey cannot be changed</p>
          </div>

          {/* Form Container */}
          <div className={`absolute left-[24px] lg:left-[60px] xl:left-[120px] right-[24px] lg:right-[60px] xl:right-[120px] top-[172px] lg:top-[248px] pb-[100px] z-20 transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
            }`}>
            {/* Step Indicator - Desktop Only */}
            <div className="hidden lg:flex items-center justify-between mb-[8px] w-full">
              <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Step 3 of 6</p>
              <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">50%</p>
            </div>

            {/* White Form Container */}
            <div className="bg-white rounded-[16px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] w-full">
              {/* Progress Bar */}
              <div className="overflow-hidden rounded-t-[16px]">
                <div className="bg-[#e6e7e8] h-[8px] w-full">
                  <div className="bg-[#37b400] h-full w-[50%] animate-[progressBar_0.8s_ease-out]"></div>
                </div>
              </div>

              {/* Step Indicator - Mobile/Tablet Inside Card */}
              <div className="lg:hidden flex items-center justify-between px-[16px] pt-[16px] pb-[8px] w-full">
                <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Step 3 of 6</p>
                <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">20%</p>
              </div>

              <div className="flex flex-col gap-[16px] lg:gap-[20px] px-[16px] pb-[16px] lg:p-[16px]">
                {/* Bank Details Card */}
                <div className="bg-[#f5f5f5] rounded-[8px] p-[16px]">
                  <div className="flex flex-col lg:flex-row gap-[16px] lg:items-start lg:justify-between w-full">
                    {/* Bank Name & Type */}
                    <div className="flex gap-[12px] items-center w-full lg:w-auto">
                      <div className="flex items-center justify-center rounded-[10px] border border-[#e5e5e6] size-[48px] shrink-0">
                        <img alt="Bank Logo" className="size-[26px] object-contain" src={imgBankLogo} />
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px]">{displayAccountHolderName}</p>
                        <div className="flex gap-[4px] items-center">
                          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#435160] text-[13px]">{displayBankName}</p>
                          <div className="bg-[rgba(147,22,30,0.06)] px-[8px] py-[2px] rounded-full">
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#93161e] text-[12px]">{accountTypeLabel}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Number */}
                    <div className="flex gap-[12px] items-center w-full lg:w-auto">
                      <div className="bg-[#c7aa7b] flex items-center justify-center rounded-[9.846px] size-[32px] shrink-0">
                        <svg className="size-[18px]" fill="none" viewBox="0 0 15.75 12.9375">
                          <path d={mobileBankSvgPaths.p32ef7f70} fill="white" />
                        </svg>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[100%] tracking-[0px] text-[#435160] text-[12px]">Account Number</p>
                        <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px]">{displayAccountNumber}</p>
                      </div>
                    </div>

                    {/* IFSC Code */}
                    <div className="flex gap-[12px] items-center w-full lg:w-auto">
                      <div className="bg-[#c7aa7b] flex items-center justify-center rounded-[9.846px] size-[32px] shrink-0">
                        <svg className="size-[18px]" fill="none" viewBox="0 0 15.0751 11.25">
                          <path d={mobileBankSvgPaths.p1f601d80} fill="white" />
                        </svg>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[100%] tracking-[0px] text-[#435160] text-[12px]">IFSC Code</p>
                        <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px]">{displayIfscCode}</p>
                      </div>
                    </div>

                    {/* Branch Name & Address */}
                    <div className="flex gap-[12px] items-start w-full lg:w-[347px]">
                      <div className="bg-[#c7aa7b] flex items-center justify-center rounded-[9.846px] size-[32px] shrink-0">
                        <svg className="size-[18px]" fill="none" viewBox="0 0 15.75 15.1875">
                          <path d={mobileBankSvgPaths.p163f6070} fill="white" />
                        </svg>
                      </div>
                      <div className="flex flex-col flex-1">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[100%] tracking-[0px] text-[#435160] text-[12px]">Branch Name & Address</p>
                        <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px]">{displayBranch || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Validation Status & Actions — cheque upload is OCR-journey only */}
                <div className="flex flex-col lg:flex-row gap-[8px] lg:gap-0 items-stretch lg:items-center justify-between w-full">
                  {/* Desktop Layout */}
                  <div className="hidden lg:flex lg:flex-row gap-[8px] items-center justify-between w-full">
                    {/* Status Message or Empty */}
                    {bankValidationStatus === 'failed' ? (
                      <div className="bg-[#FFF1E2] flex gap-[8px] items-center px-[12px] py-[8px] rounded-[8px] shrink-0">
                        <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 13.7506 12.2499">
                          <path d={mobileBankFailedSvgPaths.p1682e300} fill="#93161E" />
                        </svg>
                        <p className="font-['Mulish',sans-serif] font-normal leading-[100%] tracking-[0px] text-[#93161E] text-[12px] whitespace-nowrap shrink-0">It seems that the account validation has failed. Please upload a Cancelled Cheque.</p>
                      </div>
                    ) : bankValidationStatus === 'success' ? (
                      <div className="bg-[#eeffe5] flex gap-[8px] h-[32px] items-center px-[12px] rounded-[8px] shrink-0">
                        <svg className="size-[13px] shrink-0" fill="none" viewBox="0 0 13 13">
                          <path d={mobileBank9SvgPaths.p578e80} fill="#37B400" />
                        </svg>
                        <p className="font-['Mulish',sans-serif] font-normal leading-[100%] tracking-[0px] text-[#37B400] text-[12px] whitespace-nowrap">Account has been validated successfully.</p>
                      </div>
                    ) : (
                      <div className="flex-1"></div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-[8px] items-center">
                      <button
                        onClick={() => openChangeBankScreen('qr')}
                        className="flex gap-[8px] h-[29px] items-center justify-center px-[16px] py-[7px] rounded-[8px] border border-[#eee] hover:border-[#c7aa7b] transition-colors whitespace-nowrap"
                      >
                        <span aria-hidden className="size-[16px] shrink-0 bg-[#435160]" style={editIconMaskStyle} />
                        <p className="font-['Mulish',sans-serif] font-normal leading-[100%] tracking-[0px] text-center text-[#435160] text-[14px] whitespace-nowrap">Change Bank Account</p>
                      </button>
                      {bankValidationStatus === 'failed' && (
                        <button
                          type="button"
                          onClick={() => {
                            onClearChequeUploadError?.();
                            clearChequeSelection();
                            setShowChequeUploadModal(true);
                            setTimeout(() => setChequeUploadModalAnimating(true), 10);
                          }}
                          className="flex gap-[8px] h-[29px] items-center justify-center px-[16px] py-[7px] rounded-[8px] bg-[#93161E] hover:bg-[#7a1319] transition-colors whitespace-nowrap"
                        >
                          <p className="font-['Mulish',sans-serif] font-normal leading-[100%] tracking-[0px] text-center text-white text-[14px] whitespace-nowrap">Upload</p>
                        </button>
                      )}
                      {(bankValidationStatus === 'pending' || bankValidationStatus === 'validating') && (
                        <button
                          onClick={handleApmiValidate}
                          disabled={bankValidationStatus === 'validating'}
                          className={`flex gap-[8px] h-[29px] items-center justify-center px-[16px] py-[7px] rounded-[8px] transition-colors ${bankValidationStatus === 'validating'
                            ? 'bg-[#b8888e] cursor-not-allowed'
                            : 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                            }`}
                        >
                          {bankValidationStatus === 'validating' && (
                            <svg className="animate-spin size-[14px]" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] text-white whitespace-nowrap">
                            {bankValidationStatus === 'validating' ? 'Validating...' : 'Validate'}
                          </p>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="lg:hidden flex flex-col gap-[20px] items-stretch w-full">
                    {bankValidationStatus !== 'success' && (
                      <button
                        onClick={() => openChangeBankScreen('qr')}
                        className="flex gap-[8px] h-[29px] items-center justify-center px-[16px] py-[7px] rounded-[8px] border border-[#eee] hover:border-[#c7aa7b] transition-colors w-full"
                      >
                        <span aria-hidden className="size-[16px] shrink-0 bg-[#435160]" style={editIconMaskStyle} />
                        <p className="font-['Mulish',sans-serif] font-normal leading-[100%] tracking-[0px] text-center text-[#435160] text-[14px] whitespace-nowrap">Change Bank Account</p>
                      </button>
                    )}

                    {bankValidationStatus === 'failed' && (
                      <div className="bg-[#FFF1E2] rounded-[8px] p-[12px] flex flex-col gap-[12px] w-full">
                        <div className="flex gap-[8px] items-center w-full">
                          <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 13.7506 12.2499">
                            <path d={mobileBankFailedSvgPaths.p1682e300} fill="#93161E" />
                          </svg>
                          <p className="flex-1 font-['Mulish',sans-serif] font-normal leading-[100%] tracking-[0px] text-[#93161E] text-[12px]">It seems that the account validation has failed. Please upload a Cancelled Cheque.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onClearChequeUploadError?.();
                            clearChequeSelection();
                            setShowChequeUploadModal(true);
                            setTimeout(() => setChequeUploadModalAnimating(true), 10);
                          }}
                          className="flex h-[29px] w-full items-center justify-center px-[16px] py-[7px] rounded-[8px] bg-[#93161E] hover:bg-[#7a1319] transition-colors"
                        >
                          <p className="font-['Mulish',sans-serif] font-normal leading-[100%] tracking-[0px] text-center text-white text-[14px] whitespace-nowrap">Upload</p>
                        </button>
                      </div>
                    )}

                    {bankValidationStatus === 'success' && (
                      <div className="flex flex-col gap-[20px] w-full">
                        <div className="bg-[#eeffe5] flex gap-[8px] h-[32px] items-center px-[12px] rounded-[8px]">
                          <svg className="size-[13px] shrink-0" fill="none" viewBox="0 0 13 13">
                            <path d={mobileBank9SvgPaths.p578e80} fill="#37B400" />
                          </svg>
                          <p className="font-['Mulish',sans-serif] font-normal leading-[100%] tracking-[0px] text-[#37B400] text-[12px]">Account has been validated successfully.</p>
                        </div>
                        <div className="flex items-start justify-end w-full">
                          <button
                            onClick={() => openChangeBankScreen('qr')}
                            className="flex-1 h-[29px] rounded-[8px] border border-[#eee] flex items-center justify-center gap-[8px] hover:border-[#c7aa7b] transition-colors"
                          >
                            <span aria-hidden className="size-[16px] shrink-0 bg-[#435160]" style={editIconMaskStyle} />
                            <p className="font-['Mulish',sans-serif] font-normal leading-[100%] tracking-[0px] text-center text-[#435160] text-[14px] whitespace-nowrap">Change Bank Account</p>
                          </button>
                        </div>
                      </div>
                    )}

                    {(bankValidationStatus === 'pending' || bankValidationStatus === 'validating') && (
                      <button
                        onClick={handleApmiValidate}
                        disabled={bankValidationStatus === 'validating'}
                        className={`flex gap-[8px] h-[29px] w-full items-center justify-center px-[16px] py-[7px] rounded-[8px] transition-colors ${bankValidationStatus === 'validating'
                          ? 'bg-[#b8888e] cursor-not-allowed'
                          : 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                          }`}
                      >
                        {bankValidationStatus === 'validating' && (
                          <svg className="animate-spin size-[14px]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] text-white whitespace-nowrap">
                          {bankValidationStatus === 'validating' ? 'Validating...' : 'Validate'}
                        </p>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Cancelled Cheque Modal */}
          {showChequeUploadModal && (
            <>
              {/* Backdrop + scroll container */}
              <div
                className={`fixed inset-0 backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)] z-40 overflow-y-auto transition-opacity duration-200 ease-out ${chequeUploadModalAnimating ? 'opacity-100' : 'opacity-0'
                  }`}
                onClick={() => {
                  if (isUploadingCheque) {
                    return;
                  }
                  setChequeUploadModalAnimating(false);
                  setTimeout(() => {
                    setShowChequeUploadModal(false);
                    clearChequeSelection();
                  }, 200);
                }}
              >
                <div className="flex min-h-full items-center justify-center p-[20px]">
                  {/* Modal */}
                  <div className={`bg-white rounded-[16px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.12)] w-full max-w-[679.5px] flex flex-col gap-[16px] p-[20px] md:p-[32px] transition-transform duration-200 ease-out ${chequeUploadModalAnimating ? 'scale-100' : 'scale-95'
                    }`} onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between w-full h-[33px] shrink-0">
                      <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#435160] text-[22px]">Upload Cancelled Cheque</p>
                      <div className="opacity-0 pointer-events-none size-[24px] shrink-0" />
                    </div>

                    {/* Upload Area */}
                    <input
                      ref={chequeFileInputRef}
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
                      className="hidden"
                      onChange={handleChequeFileChange}
                    />
                    {chequeFileSelected ? (
                      <div className="relative w-full rounded-[8px] border border-dashed border-[#eee] shrink-0">
                        <div className="flex flex-col items-center justify-center p-[12px]">
                          <div className="flex w-full items-start justify-end gap-[16px]">
                            <div className="relative min-h-[140px] flex-1" style={{ height: '211px' }}>
                              <div className="absolute inset-0 overflow-hidden">
                                <img
                                  alt="Cancelled Cheque"
                                  className="absolute inset-0 size-full object-contain"
                                  src={chequePreviewUrl || imgCancelledCheque}
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={clearChequeSelection}
                              className="mt-[4px] size-[24px] shrink-0 overflow-clip hover:opacity-70 transition-opacity"
                              aria-label="Remove cancelled cheque"
                              title="Remove"
                            >
                              <Trash2 className="size-full text-[#71859B]" strokeWidth={1.75} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-[8px] border border-dashed border-[#e5e5e6] bg-white p-4 shrink-0">
                        <div className="flex flex-col items-center gap-3 text-center">
                          <Upload className="size-6 text-[#71859B]" strokeWidth={1.75} />
                          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#71859b] text-[13px]">
                            Format Supported: PNG, PDF or JPEG up to 2MB
                          </p>
                          <div className="flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => setChequeCameraTarget('cheque')}
                              className="flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#e5e5e6] bg-white px-[21px] py-[7px] text-[#435160] transition-colors hover:border-[#c7aa7b]"
                            >
                              <Camera className="size-4 shrink-0" strokeWidth={1.75} />
                              <span className="font-['Mulish',sans-serif] text-[14px] font-normal leading-[21px] whitespace-nowrap">
                                Capture
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openChequeFilePicker(chequeFileInputRef)}
                              className="flex h-9 items-center justify-center rounded-[8px] bg-[#93161e] px-[21px] py-[7px] transition-colors hover:bg-[#7a1319]"
                            >
                              <span className="font-['Mulish',sans-serif] text-[14px] font-normal leading-[21px] text-white whitespace-nowrap">
                                Upload
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upload Image Guidelines — only before a file is selected */}
                    {!chequeFileSelected && (
                      <div className="flex flex-col gap-[11px] w-full shrink-0">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Upload image guidelines</p>

                        {/* Row 1: Good + Blurry */}
                        <div className="flex gap-[16px] items-stretch w-full">
                          {/* Good Example - Clear & Complete */}
                          <div className="bg-[#eeffe5] flex-1 min-w-px relative rounded-[8px]">
                            <div className="flex flex-row items-center justify-center size-full">
                              <div className="flex gap-[10px] items-center justify-center px-[8px] py-[12px] w-full">
                                <div className="flex flex-col gap-[8px] items-center justify-center">
                                  <div className="h-[72px] w-full max-w-[188px] relative overflow-hidden shrink-0">
                                    <img alt="Clear and Complete Cheque" className="absolute inset-0 max-w-none object-cover pointer-events-none w-[105.21%] h-[104.18%] left-[-2.6%] top-[-4.18%]" src={imgPi22ChequeExample} />
                                  </div>
                                  <div className="flex gap-[4px] items-center">
                                    <div className="overflow-clip size-[14px] shrink-0">
                                      <svg className="size-full" fill="none" viewBox="0 0 11.375 11.375">
                                        <path d={step3Pi22SvgPaths.p2ae76000} fill="#37B400" />
                                      </svg>
                                    </div>
                                    <p className="font-['Mulish',sans-serif] font-normal leading-[1.1] text-[#37b400] text-[9px] whitespace-nowrap">Clear &amp; Complete</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Top-left badge */}
                            <div className="absolute left-[5px] top-[3px] overflow-clip size-[18px]">
                              <svg className="size-full" fill="none" viewBox="0 0 14.625 14.625">
                                <path d={step3Pi22SvgPaths.p31721900} fill="#37B400" />
                              </svg>
                            </div>
                          </div>

                          {/* Bad Example - Blurry / Out of focus */}
                          <div className="bg-[#fff0e5] flex-1 min-w-px relative rounded-[8px]">
                            <div className="flex flex-row items-center justify-center size-full">
                              <div className="flex gap-[10px] items-center justify-center px-[8px] py-[12px] w-full">
                                <div className="flex flex-col gap-[8px] items-center justify-center">
                                  <div className="blur-[0.5px] h-[72px] w-full max-w-[188px] relative shadow-[-6px_6px_20px_0px_rgba(0,0,0,0.08)] overflow-hidden shrink-0">
                                    <img alt="Blurry Cheque" className="absolute inset-0 max-w-none object-cover pointer-events-none w-[105.21%] h-[104.18%] left-[-2.6%] top-[-4.18%]" src={imgPi22ChequeExample} />
                                  </div>
                                  <div className="flex gap-[4px] items-center">
                                    <div className="overflow-clip size-[14px] shrink-0">
                                      <svg className="size-full" fill="none" viewBox="0 0 11.375 11.375">
                                        <path d={step3Pi22SvgPaths.pd971f00} fill="#E8402F" />
                                      </svg>
                                    </div>
                                    <p className="font-['Mulish',sans-serif] font-normal leading-[1.1] text-[#e8402f] text-[9px] whitespace-nowrap">Blurry / Out of focus</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Top-left badge */}
                            <div className="absolute left-[5px] top-[3px] overflow-clip size-[18px]">
                              <svg className="size-full" fill="none" viewBox="0 0 14.625 14.625">
                                <path d={step3Pi22SvgPaths.p1e9bc580} fill="#E8402F" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Half cut + Poor lighting (gray background) */}
                        <div className="bg-[#f5f5f5] rounded-[4px] p-[8px]">
                          <div className="flex gap-[16px] items-stretch w-full">
                            {/* Bad Example - Half cut / Incomplete */}
                            <div className="bg-[#fff0e5] flex-1 min-w-px relative rounded-[8px]">
                              <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                                <div className="flex gap-[10px] items-center justify-center px-[8px] py-[12px] w-full">
                                  <div className="flex flex-col gap-[8px] items-center justify-center">
                                    <div className="h-[72px] w-full max-w-[188px] relative shadow-[-6px_6px_20px_0px_rgba(0,0,0,0.08)] overflow-hidden shrink-0">
                                      <img alt="Incomplete Cheque" className="absolute inset-0 max-w-none object-cover pointer-events-none w-[126.16%] h-[138.11%] left-[-23.61%] top-[-0.05%]" src={imgPi22ChequeExample} />
                                    </div>
                                    <div className="flex gap-[4px] items-center">
                                      <div className="overflow-clip size-[14px] shrink-0">
                                        <svg className="size-full" fill="none" viewBox="0 0 11.375 11.375">
                                          <path d={step3Pi22SvgPaths.p37a9c200} fill="#E8402F" />
                                        </svg>
                                      </div>
                                      <p className="font-['Mulish',sans-serif] font-normal leading-[1.1] text-[#e8402f] text-[9px] whitespace-nowrap">Half cut / Incomplete </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Top-left badge */}
                              <div className="absolute left-[6px] top-[3px] overflow-clip size-[18px]">
                                <svg className="size-full" fill="none" viewBox="0 0 14.625 14.625">
                                  <path d={step3Pi22SvgPaths.p1e9bc580} fill="#E8402F" />
                                </svg>
                              </div>
                            </div>

                            {/* Bad Example - Poor lighting / Glare */}
                            <div className="bg-[#fff0e5] flex-1 min-w-px relative rounded-[8px]">
                              <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                                <div className="flex gap-[10px] items-center justify-center p-[12px] w-full">
                                  <div className="flex flex-col gap-[8px] items-center justify-center">
                                    <div className="h-[72px] w-full max-w-[188px] relative overflow-hidden shrink-0">
                                      <img alt="Poor lighting Cheque" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPi22ChequeGlare} />
                                    </div>
                                    <div className="flex gap-[4px] items-center">
                                      <div className="overflow-clip size-[14px] shrink-0">
                                        <svg className="size-full" fill="none" viewBox="0 0 11.375 11.375">
                                          <path d={step3Pi22SvgPaths.p37a9c200} fill="#E8402F" />
                                        </svg>
                                      </div>
                                      <p className="font-['Mulish',sans-serif] font-normal leading-[1.1] text-[#e8402f] text-[9px] whitespace-nowrap">Poor lighting / Glare</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Top-left badge */}
                              <div className="absolute left-[5px] top-[3px] overflow-clip size-[18px]">
                                <svg className="size-full" fill="none" viewBox="0 0 14.625 14.625">
                                  <path d={step3Pi22SvgPaths.p1e9bc580} fill="#E8402F" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {chequeUploadError ? (
                      <p className="font-['Mulish',sans-serif] text-[12px] leading-[18px] text-[#93161e] w-full">
                        {chequeUploadError}
                      </p>
                    ) : null}
                    <div className="flex gap-[24px] items-center w-full shrink-0">
                      <button
                        type="button"
                        disabled={isUploadingCheque}
                        onClick={() => {
                          if (isUploadingCheque) {
                            return;
                          }
                          setChequeUploadModalAnimating(false);
                          setTimeout(() => {
                            setShowChequeUploadModal(false);
                            clearChequeSelection();
                          }, 200);
                        }}
                        className="flex-1 h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center transition-all duration-300 hover:border-[#c7aa7b] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Cancel</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void handleChequeUploadSave();
                        }}
                        disabled={!chequeFileSelected || isUploadingCheque}
                        className={`flex-1 h-[36px] rounded-[8.75px] flex items-center justify-center gap-2 transition-all duration-300 ${chequeFileSelected || isUploadingCheque
                          ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                          : 'bg-[#e5e5e6] cursor-not-allowed'
                          } ${isUploadingCheque ? 'cursor-not-allowed' : ''}`}
                      >
                        {isUploadingCheque ? (
                          <>
                            <Loader2 className="size-4 animate-spin text-white" />
                            <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] text-white">Saving...</p>
                          </>
                        ) : (
                          <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${chequeFileSelected ? 'text-white' : 'text-[#5a6b7d]'
                            }`}>Save</p>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bottom Navigation */}
          <OnboardingStepFooter
            nextLabel="Nominee Details"
            nextClickable={isEditMode}
            onNextClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentStep('nominee-details');
                setTimeout(() => setIsTransitioning(false), 50);
              }, 300);
            }}
            showPrevious={!isEditMode}
            onPrevious={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentStep('business-details');
                setTimeout(() => setIsTransitioning(false), 50);
              }, 300);
            }}
            continueLabel={isEditMode ? 'Go to Review' : 'Continue'}
            continueDisabled={!canContinue}
            isLoading={isTransitioning || isSaving}
            loadingLabel="Saving..."
            hideContinueArrow={isEditMode}
            onContinue={proceedToNext}
          />
        </>
      )}

      {/* Cheque Preview Modal — root-level so it works on OCR journey too */}
      {showChequePreviewModal && (
        <>
          <div
            className={`fixed inset-0 backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)] z-[70] transition-opacity duration-200 ease-out ${chequePreviewModalAnimating ? 'opacity-100' : 'opacity-0'
              }`}
            onClick={() => {
              setChequePreviewModalAnimating(false);
              setTimeout(() => {
                setShowChequePreviewModal(false);
              }, 200);
            }}
          />

          <div className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[16px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.12)] w-[calc(100%-48px)] max-w-[420px] z-[80] flex flex-col gap-[24px] p-[24px] transition-all duration-200 ease-out ${chequePreviewModalAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
            <div className="flex items-center justify-between w-full">
              <p className="font-['Mulish',sans-serif] font-medium leading-[27px] text-[#435160] text-[18px]">View Cancelled Cheque</p>
              <button
                type="button"
                onClick={() => {
                  setChequePreviewModalAnimating(false);
                  setTimeout(() => {
                    setShowChequePreviewModal(false);
                  }, 200);
                }}
                className="size-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-200 shrink-0"
              >
                <svg className="size-full" fill="none" viewBox="0 0 15.0008 15.0008">
                  <path d={personalInfo5SvgPaths.p3bbf7480} fill="#435160" />
                </svg>
              </button>
            </div>

            <div className="border border-dashed border-[#eee] rounded-[8px] p-[12px] flex items-center justify-center min-h-[180px]">
              {isLoadingChequePreview ? (
                <div className="flex flex-col items-center gap-2 py-6">
                  <Loader2 className="size-6 animate-spin text-[#93161e]" />
                  <p className="font-['Mulish',sans-serif] text-[13px] text-[#435160]">Loading...</p>
                </div>
              ) : chequePreviewError ? (
                <p className="font-['Mulish',sans-serif] text-[13px] text-[#93161e] text-center py-6 px-2">
                  {chequePreviewError}
                </p>
              ) : chequePreviewDisplayUrl ? (
                <img
                  alt="Cancelled Cheque Preview"
                  className="max-h-[280px] w-full object-contain"
                  src={chequePreviewDisplayUrl}
                />
              ) : (
                <p className="font-['Mulish',sans-serif] text-[13px] text-[#71859b] text-center py-6">
                  No preview available.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Manual Error Cheque Upload Modal */}
      {showManualErrorChequeModal && (
        <>
          {/* Backdrop */}
          {/* Backdrop + scroll container */}
          <div
            className={`fixed inset-0 backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)] z-[60] overflow-y-auto transition-opacity duration-200 ease-out ${manualErrorChequeModalAnimating ? 'opacity-100' : 'opacity-0'
              }`}
            onClick={() => {
              if (isUploadingCheque) {
                return;
              }
              setManualErrorChequeModalAnimating(false);
              setTimeout(() => {
                setShowManualErrorChequeModal(false);
                clearManualErrorChequeSelection();
              }, 200);
            }}
          >
            <div className="flex min-h-full items-center justify-center p-[20px]">
              {/* Modal */}
              <div className={`bg-white rounded-[16px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.12)] w-full max-w-[679.5px] flex flex-col gap-[16px] p-[20px] md:p-[32px] transition-transform duration-200 ease-out ${manualErrorChequeModalAnimating ? 'scale-100' : 'scale-95'
                }`} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between w-full h-[33px]">
                  <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#435160] text-[22px]">Upload Cancelled Cheque</p>
                  <button
                    onClick={() => {
                      setManualErrorChequeModalAnimating(false);
                      setTimeout(() => {
                        setShowManualErrorChequeModal(false);
                        clearManualErrorChequeSelection();
                      }, 200);
                    }}
                    className="size-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-200 shrink-0 opacity-0 pointer-events-none"
                  >
                    <svg className="size-full" fill="none" viewBox="0 0 15.0008 15.0008">
                      <path d={emailOtpSvgPaths.p3bbf7480} fill="#435160" />
                    </svg>
                  </button>
                </div>

                {/* Upload Area */}
                <input
                  ref={manualErrorChequeFileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
                  className="hidden"
                  onChange={handleManualErrorChequeFileChange}
                />
                {manualErrorChequeFileSelected ? (
                  <div className="relative w-full rounded-[8px] border border-dashed border-[#eee] shrink-0">
                    <div className="flex flex-col items-center justify-center p-[12px]">
                      <div className="flex w-full items-start justify-end gap-[16px]">
                        <div className="relative min-h-[140px] flex-1" style={{ height: '211px' }}>
                          <div className="absolute inset-0 overflow-hidden">
                            <img
                              alt="Cancelled Cheque"
                              className="absolute inset-0 size-full object-contain"
                              src={manualErrorChequePreviewUrl || imgCancelledCheque}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={clearManualErrorChequeSelection}
                          className="mt-[4px] size-[24px] shrink-0 overflow-clip hover:opacity-70 transition-opacity"
                          aria-label="Remove cancelled cheque"
                          title="Remove"
                        >
                          <Trash2 className="size-full text-[#71859B]" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[8px] border border-dashed border-[#e5e5e6] bg-white p-4 shrink-0">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <Upload className="size-6 text-[#71859B]" strokeWidth={1.75} />
                      <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#71859b] text-[13px]">
                        Format Supported: PNG, PDF or JPEG up to 2MB
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setChequeCameraTarget('manualErrorCheque')}
                          className="flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#e5e5e6] bg-white px-[21px] py-[7px] text-[#435160] transition-colors hover:border-[#c7aa7b]"
                        >
                          <Camera className="size-4 shrink-0" strokeWidth={1.75} />
                          <span className="font-['Mulish',sans-serif] text-[14px] font-normal leading-[21px] whitespace-nowrap">
                            Capture
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openChequeFilePicker(manualErrorChequeFileInputRef)}
                          className="flex h-9 items-center justify-center rounded-[8px] bg-[#93161e] px-[21px] py-[7px] transition-colors hover:bg-[#7a1319]"
                        >
                          <span className="font-['Mulish',sans-serif] text-[14px] font-normal leading-[21px] text-white whitespace-nowrap">
                            Upload
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Image Guidelines — only before a file is selected */}
                {!manualErrorChequeFileSelected && (
                  <div className="flex flex-col gap-[11px]">
                    <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Upload image guidelines</p>

                    {/* Row 1: Good + Blurry */}
                    <div className="flex gap-[16px] items-stretch w-full">
                      {/* Good Example - Clear & Complete */}
                      <div className="bg-[#eeffe5] flex-1 min-w-px relative rounded-[8px]">
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="flex gap-[10px] items-center justify-center px-[8px] py-[12px] w-full">
                            <div className="flex flex-col gap-[8px] items-center justify-center">
                              <div className="h-[72px] w-full max-w-[188px] relative overflow-hidden shrink-0">
                                <img alt="Clear and Complete cheque" className="absolute inset-0 max-w-none object-cover pointer-events-none w-[105.21%] h-[104.18%] left-[-2.6%] top-[-4.18%]" src={imgPi22ChequeExample} />
                              </div>
                              <div className="flex gap-[4px] items-center">
                                <div className="overflow-clip size-[14px] shrink-0">
                                  <svg className="size-full" fill="none" viewBox="0 0 11.375 11.375">
                                    <path d={step3Pi22SvgPaths.p2ae76000} fill="#37B400" />
                                  </svg>
                                </div>
                                <p className="font-['Mulish',sans-serif] font-normal leading-[1.1] text-[#37b400] text-[9px] whitespace-nowrap">Clear &amp; Complete</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute left-[5px] top-[3px] overflow-clip size-[18px]">
                          <svg className="size-full" fill="none" viewBox="0 0 14.625 14.625">
                            <path d={step3Pi22SvgPaths.p31721900} fill="#37B400" />
                          </svg>
                        </div>
                      </div>

                      {/* Bad Example - Blurry / Out of focus */}
                      <div className="bg-[#fff0e5] flex-1 min-w-px relative rounded-[8px]">
                        <div className="flex flex-row items-center justify-center size-full">
                          <div className="flex gap-[10px] items-center justify-center px-[8px] py-[12px] w-full">
                            <div className="flex flex-col gap-[8px] items-center justify-center">
                              <div className="blur-[0.5px] h-[72px] w-full max-w-[188px] relative shadow-[-6px_6px_20px_0px_rgba(0,0,0,0.08)] overflow-hidden shrink-0">
                                <img alt="Blurry cheque" className="absolute inset-0 max-w-none object-cover pointer-events-none w-[105.21%] h-[104.18%] left-[-2.6%] top-[-4.18%]" src={imgPi22ChequeExample} />
                              </div>
                              <div className="flex gap-[4px] items-center">
                                <div className="overflow-clip size-[14px] shrink-0">
                                  <svg className="size-full" fill="none" viewBox="0 0 11.375 11.375">
                                    <path d={step3Pi22SvgPaths.pd971f00} fill="#E8402F" />
                                  </svg>
                                </div>
                                <p className="font-['Mulish',sans-serif] font-normal leading-[1.1] text-[#e8402f] text-[9px] whitespace-nowrap">Blurry / Out of focus</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute left-[5px] top-[3px] overflow-clip size-[18px]">
                          <svg className="size-full" fill="none" viewBox="0 0 14.625 14.625">
                            <path d={step3Pi22SvgPaths.p1e9bc580} fill="#E8402F" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Half cut + Poor lighting (gray background) */}
                    <div className="bg-[#f5f5f5] rounded-[4px] p-[8px]">
                      <div className="flex gap-[16px] items-stretch w-full">
                        {/* Bad Example - Half cut / Incomplete */}
                        <div className="bg-[#fff0e5] flex-1 min-w-px relative rounded-[8px]">
                          <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                            <div className="flex gap-[10px] items-center justify-center px-[8px] py-[12px] w-full">
                              <div className="flex flex-col gap-[8px] items-center justify-center">
                                <div className="h-[72px] w-full max-w-[188px] relative shadow-[-6px_6px_20px_0px_rgba(0,0,0,0.08)] overflow-hidden shrink-0">
                                  <img alt="Incomplete cheque" className="absolute inset-0 max-w-none object-cover pointer-events-none w-[126.16%] h-[138.11%] left-[-23.61%] top-[-0.05%]" src={imgPi22ChequeExample} />
                                </div>
                                <div className="flex gap-[4px] items-center">
                                  <div className="overflow-clip size-[14px] shrink-0">
                                    <svg className="size-full" fill="none" viewBox="0 0 11.375 11.375">
                                      <path d={step3Pi22SvgPaths.p37a9c200} fill="#E8402F" />
                                    </svg>
                                  </div>
                                  <p className="font-['Mulish',sans-serif] font-normal leading-[1.1] text-[#e8402f] text-[9px] whitespace-nowrap">Half cut / Incomplete </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute left-[6px] top-[3px] overflow-clip size-[18px]">
                            <svg className="size-full" fill="none" viewBox="0 0 14.625 14.625">
                              <path d={step3Pi22SvgPaths.p1e9bc580} fill="#E8402F" />
                            </svg>
                          </div>
                        </div>

                        {/* Bad Example - Poor lighting / Glare */}
                        <div className="bg-[#fff0e5] flex-1 min-w-px relative rounded-[8px]">
                          <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                            <div className="flex gap-[10px] items-center justify-center p-[12px] w-full">
                              <div className="flex flex-col gap-[8px] items-center justify-center">
                                <div className="h-[72px] w-full max-w-[188px] relative overflow-hidden shrink-0">
                                  <img alt="Poor lighting cheque" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPi22ChequeGlare} />
                                </div>
                                <div className="flex gap-[4px] items-center">
                                  <div className="overflow-clip size-[14px] shrink-0">
                                    <svg className="size-full" fill="none" viewBox="0 0 11.375 11.375">
                                      <path d={step3Pi22SvgPaths.p37a9c200} fill="#E8402F" />
                                    </svg>
                                  </div>
                                  <p className="font-['Mulish',sans-serif] font-normal leading-[1.1] text-[#e8402f] text-[9px] whitespace-nowrap">Poor lighting / Glare</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute left-[5px] top-[3px] overflow-clip size-[18px]">
                            <svg className="size-full" fill="none" viewBox="0 0 14.625 14.625">
                              <path d={step3Pi22SvgPaths.p1e9bc580} fill="#E8402F" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Buttons */}
                {chequeUploadError ? (
                  <p className="font-['Mulish',sans-serif] text-[12px] leading-[18px] text-[#93161e] w-full">
                    {chequeUploadError}
                  </p>
                ) : null}
                <div className="flex gap-[24px] items-center w-full">
                  <button
                    type="button"
                    disabled={isUploadingCheque}
                    onClick={() => {
                      if (isUploadingCheque) {
                        return;
                      }
                      setManualErrorChequeModalAnimating(false);
                      setTimeout(() => {
                        setShowManualErrorChequeModal(false);
                        clearManualErrorChequeSelection();
                      }, 200);
                    }}
                    className="flex-1 h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center hover:border-[#c7aa7b] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Cancel</p>
                  </button>

                  <button
                    type="button"
                    disabled={!manualErrorChequeFileSelected || isUploadingCheque}
                    onClick={() => {
                      void handleManualErrorChequeSave();
                    }}
                    className={`flex-1 h-[36px] rounded-[8.75px] flex items-center justify-center gap-2 transition-colors ${manualErrorChequeFileSelected || isUploadingCheque
                      ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                      : 'bg-[#e5e5e6] cursor-not-allowed'
                      } ${isUploadingCheque ? 'cursor-not-allowed' : ''}`}
                  >
                    {isUploadingCheque ? (
                      <>
                        <Loader2 className="size-4 animate-spin text-white" />
                        <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] text-white">Saving...</p>
                      </>
                    ) : (
                      <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${manualErrorChequeFileSelected ? 'text-white' : 'text-[#5a6b7d]'
                        }`}>Save</p>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {chequeCameraTarget ? (
        <CameraCaptureModal
          title="Capture Cancelled Cheque"
          onCancel={() => setChequeCameraTarget(null)}
          onSave={handleChequeCameraSave}
        />
      ) : null}

    </>
  );
}
