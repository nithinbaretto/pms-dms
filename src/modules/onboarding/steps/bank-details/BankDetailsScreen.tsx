import { useEffect } from 'react';
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
import imgQrCode from '../../../../assets/images/guidlines_img_1.png';
import imgClock from '../../../../assets/logo.png';
import imgWarning from '../../../../assets/logo.png';
import imgCancelledCheque from '../../../../assets/images/guidlines_img_2.png';
import imgPi22ChequeExample from '../../../../assets/images/guidlines_img_3.png';
import imgPi22ChequeGlare from '../../../../assets/images/guidlines_img_4.png';
import imgChequePreview from '../../../../assets/images/guidlines_img_1.png';
import imgLogo from '../../../../assets/logo.png';

interface BankDetailsScreenProps {
  contactPersonName: string;
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
  const canContinue = bankValidationStatus === 'success' || (bankValidationStatus === 'failed' && chequeUploaded);
  const isManualErrorFormValid =
    manualErrorReenterAccountNumber.trim() !== '' &&
    manualErrorReenterAccountNumber === manualAccountNumber &&
    manualErrorAccountHolderName.trim() !== '' &&
    manualErrorAccountType !== undefined &&
    manualErrorBankBranch.trim() !== '';
  const canContinueFromManualError = canContinue && isManualErrorFormValid;

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
    if (!canContinue) {
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

  const shouldPennyDropFail = (accountNumber: string, ifscCode: string) => {
    const normalizedIfsc = ifscCode.trim().toUpperCase();
    return accountNumber === '1234567890' || normalizedIfsc.startsWith('FAIL');
  };

  const handleApmiValidate = () => {
    if (bankValidationStatus !== 'pending') {
      return;
    }
    setChequeUploaded(false);
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
    setQrGenerated(true);
    setQrTimer(213);
  };

  const handleQrPayment = () => {
    if (!qrGenerated || qrTimer <= 0) {
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

  const handleChequeUploadSave = () => {
    if (!chequeFileSelected) {
      return;
    }
    setChequeUploaded(true);
    setChequeUploadModalAnimating(false);
    setTimeout(() => {
      setShowChequeUploadModal(false);
      setChequeFileSelected(false);
    }, 200);
  };

  const handleManualErrorChequeSave = () => {
    if (!manualErrorChequeFileSelected) {
      return;
    }

    setChequeUploaded(true);
    setManualErrorChequeUploaded(true);

    const ocrSuccess = normalizedIfscCode !== '' && !normalizedIfscCode.startsWith('FAIL');
    if (ocrSuccess) {
      setManualErrorReenterAccountNumber(manualAccountNumber);
      setManualErrorAccountHolderName(contactPersonName.trim() || 'Rajesh Gupta');
      setManualErrorBankBranch(ifscData.branchAddress);
    } else {
      setManualErrorReenterAccountNumber('');
      setManualErrorAccountHolderName('');
      setManualErrorBankBranch('');
    }

    setManualErrorChequeModalAnimating(false);
    setTimeout(() => {
      setShowManualErrorChequeModal(false);
      setManualErrorChequeFileSelected(false);
    }, 200);
  };

  return (
    <>
      {showChangeBankScreen && !showManualValidationError ? (
        /* Change Bank Account Screen */
        <>
          {/* Mobile View */}
          <div className="lg:hidden fixed inset-0 bg-[#fffaf6] z-30 overflow-y-auto">
            <div className="flex flex-col gap-[24px] items-center pt-[24px] px-[24px] pb-[120px]">
              {/* Logo */}
              <div className="h-[48px] w-[98px] shrink-0">
                <img alt="Logo" className="size-full object-cover" src={imgLogo} />
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
                          className={`flex-1 px-[14px] py-[5px] rounded-[16777200px] flex items-center justify-center transition-all duration-200 ${
                            changeBankTab === 'qr'
                              ? 'bg-white text-[#93161e]'
                              : 'bg-transparent text-[#5a6b7d]'
                          }`}
                        >
                          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[12px] text-center whitespace-nowrap">Add using QR Code</p>
                        </button>
                        <button
                          onClick={() => setChangeBankTab('manual')}
                          className={`flex-1 px-[14px] py-[5px] rounded-[16777200px] flex items-center justify-center transition-all duration-200 ${
                            changeBankTab === 'manual'
                              ? 'bg-white text-[#93161e]'
                              : 'bg-transparent text-[#5a6b7d]'
                          }`}
                        >
                          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[12px] text-center whitespace-nowrap">Add Bank Details Manually</p>
                        </button>
                      </div>
                    </div>
                  </div>

                  {changeBankTab === 'qr' ? (
                    <>
                      {/* Title */}
                      <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px] text-center w-full">Scan QR to add your bank account</p>

                      {/* QR Code */}
                      <div className="relative size-[116px] shrink-0">
                        <img
                          src={imgQrCode}
                          alt="QR Code"
                          onClick={handleQrPayment}
                          className={`absolute inset-0 size-full object-cover ${qrGenerated && qrTimer > 0 ? 'cursor-pointer' : 'blur-[4px]'}`}
                        />
                        {(!qrGenerated || qrTimer === 0) && (
                          <button
                            onClick={handleQrGenerate}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#93161e] h-[29px] px-[16px] py-[7px] rounded-[8px] flex items-center justify-center hover:bg-[#7a1319] transition-colors"
                          >
                            <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-white text-[13px] whitespace-nowrap">
                              {qrTimer === 0 ? 'Regenerate QR' : 'Generate QR'}
                            </p>
                          </button>
                        )}
                      </div>

                      {/* Instructions */}
                      <div className="flex gap-[8px] items-center justify-center w-full">
                        <div className="bg-[#fffaf6] border border-[#e5e5e6] rounded-[24px] px-[8px] py-[8px] flex gap-[4px] items-center">
                          <svg className="size-[12px]" fill="none" viewBox="0 0 9 9">
                            <path d={mobileChangeBankSvgPaths.p3f0c3100} fill="#435160" />
                          </svg>
                          <p className="font-['Mulish',sans-serif] font-normal leading-[16.5px] text-[#435160] text-[11px] text-center whitespace-nowrap">Scan this QR Code</p>
                        </div>
                        <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 12.0004 10.0006">
                          <path d={mobileChangeBankSvgPaths.p16866180} fill="#435160" />
                        </svg>
                        <div className="bg-[#fffaf6] border border-[#e5e5e6] rounded-[24px] px-[8px] py-[8px] flex gap-[4px] items-center">
                          <svg className="size-[12px]" fill="none" viewBox="0 0 6.75 9.37802">
                            <path d={mobileChangeBankSvgPaths.p26ea7ef2} fill="#435160" />
                          </svg>
                          <p className="font-['Mulish',sans-serif] font-normal leading-[16.5px] text-[#435160] text-[11px] text-center whitespace-nowrap">make 1 rupee payment</p>
                        </div>
                      </div>

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
                          <div className="bg-white h-[36px] w-full rounded-[8px] border border-[#eee]">
                            <input
                              type="text"
                              value={manualAccountNumber}
                              onChange={(e) => setManualAccountNumber(e.target.value)}
                              placeholder="0987654320"
                              className="w-full h-full px-[14px] py-[8px] rounded-[8px] font-['Mulish',sans-serif] font-normal text-[#231f20] text-[13px] outline-none"
                            />
                          </div>
                        </div>

                        {/* IFSC Code Field */}
                        <div className="flex flex-col gap-[4px] w-full">
                          <div className="flex gap-[2px]">
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">IFSC Code</p>
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                          </div>
                          <div className="bg-white h-[36px] w-full rounded-[8px] border border-[#eee]">
                            <input
                              type="text"
                              value={manualIfscCode}
                              onChange={(e) => setManualIfscCode(e.target.value.toUpperCase())}
                              placeholder="ELDHY6734A"
                              className="w-full h-full px-[14px] py-[8px] rounded-[8px] font-['Mulish',sans-serif] font-normal text-[#231f20] text-[13px] outline-none"
                            />
                          </div>
                        </div>

                        {/* Validate Button */}
                        <div className="flex items-center justify-end w-full">
                          <button
                            onClick={handleManualValidate}
                            disabled={!manualAccountNumber || !manualIfscCode || manualBankValidating}
                            className={`h-[29px] px-[16px] py-[7px] rounded-[8px] flex gap-[8px] items-center justify-center transition-colors ${
                              manualAccountNumber && manualIfscCode && !manualBankValidating
                                ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                                : 'bg-[#e5e5e6] cursor-not-allowed'
                            }`}
                          >
                            <p className={`font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] whitespace-nowrap ${
                              manualAccountNumber && manualIfscCode && !manualBankValidating ? 'text-white' : 'text-[#5a6b7d]'
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

            {/* Mobile Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)] px-[24px] py-[8px] z-40">
              <div className="flex flex-col gap-[8px] items-start justify-center w-full">
                <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#5a6b7d] text-[13px]">Next: Nominee Details</p>
                <div className="flex gap-[16px] items-center w-full">
                  <button
                    onClick={closeChangeBankScreen}
                    className="flex-1 h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center"
                  >
                    <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Previous</p>
                  </button>
                  <button
                    disabled={!canContinue}
                    onClick={proceedToNext}
                    className={`flex-1 h-[36px] rounded-[8.75px] flex items-center justify-center gap-[8px] ${
                      canContinue ? 'bg-[#93161e]' : 'bg-[#e5e5e6]'
                    }`}
                  >
                    <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${
                      canContinue ? 'text-white' : 'text-[#5a6b7d]'
                    }`}>Continue</p>
                    <svg className="size-[16px]" fill="none" viewBox="0 0 12.0004 10.0006">
                      <path d={mobileChangeBankSvgPaths.p16866180} fill={canContinue ? 'white' : '#5A6B7D'} />
                    </svg>
                  </button>
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
                        className={`px-[14px] py-[5px] rounded-full flex items-center justify-center transition-all duration-200 ${
                          changeBankTab === 'qr'
                            ? 'bg-white text-[#93161e]'
                            : 'bg-transparent text-[#5a6b7d]'
                        }`}
                      >
                        <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] whitespace-nowrap">Add using QR Code</p>
                      </button>
                      <button
                        onClick={() => setChangeBankTab('manual')}
                        className={`px-[14px] py-[5px] rounded-full flex items-center justify-center transition-all duration-200 ${
                          changeBankTab === 'manual'
                            ? 'bg-white text-[#93161e]'
                            : 'bg-transparent text-[#5a6b7d]'
                        }`}
                      >
                        <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] whitespace-nowrap">Add Bank Details Manually</p>
                      </button>
                    </div>
                  </div>

                  {changeBankTab === 'qr' ? (
                    <>
                      {/* QR Code Content */}
                      <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px] text-center w-[390px]">Scan QR to add your bank account</p>

                      {/* QR Code */}
                      <div className="relative size-[116px]">
                        <img
                          src={imgQrCode}
                          alt="QR Code"
                          onClick={handleQrPayment}
                          className={`absolute inset-0 size-full object-cover ${qrGenerated && qrTimer > 0 ? 'cursor-pointer' : 'blur-[4px]'}`}
                        />
                        {(!qrGenerated || qrTimer === 0) && (
                          <button
                            onClick={handleQrGenerate}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#93161e] h-[29px] px-[16px] py-[7px] rounded-[8px] flex items-center justify-center hover:bg-[#7a1319] transition-colors"
                          >
                            <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-white text-[13px] whitespace-nowrap">
                              {qrTimer === 0 ? 'Regenerate QR' : 'Generate QR'}
                            </p>
                          </button>
                        )}
                      </div>

                      {/* Instructions */}
                      <div className="flex gap-[12px] items-center">
                        <div className="bg-[#fffaf6] border border-[#e5e5e6] rounded-[24px] px-[12px] py-[10px] flex gap-[4px] items-center">
                          <svg className="size-[16px]" fill="none" viewBox="0 0 12 12">
                            <path d={changeBankSvgPaths.p2da18f00} fill="#435160" />
                          </svg>
                          <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#435160] text-[12px] whitespace-nowrap">Scan this QR Code</p>
                        </div>
                        <svg className="size-[16px]" fill="none" viewBox="0 0 12.0004 10.0006">
                          <path d={changeBankSvgPaths.p16866180} fill="#435160" />
                        </svg>
                        <div className="bg-[#fffaf6] border border-[#e5e5e6] rounded-[24px] px-[12px] py-[10px] flex gap-[4px] items-center">
                          <svg className="size-[16px]" fill="none" viewBox="0 0 9 12.5">
                            <path d={changeBankSvgPaths.p201a900} fill="#435160" />
                          </svg>
                          <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#435160] text-[12px] whitespace-nowrap">make one rupee payment</p>
                        </div>
                      </div>

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
                          <div className="bg-white h-[36px] w-full rounded-[8px] border border-[#eee] border-solid">
                            <input
                              type="text"
                              value={manualAccountNumber}
                              onChange={(e) => setManualAccountNumber(e.target.value)}
                              placeholder="0987654320"
                              className="w-full h-full px-[14px] py-[8px] rounded-[8px] font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px] outline-none"
                            />
                          </div>
                        </div>

                        {/* IFSC Code Field */}
                        <div className="flex flex-col gap-[4px] items-start flex-1">
                          <div className="flex gap-[2px] items-start w-full">
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">IFSC Code</p>
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                          </div>
                          <div className="bg-white h-[36px] w-full rounded-[8px] border border-[#eee] border-solid">
                            <input
                              type="text"
                              value={manualIfscCode}
                              onChange={(e) => setManualIfscCode(e.target.value.toUpperCase())}
                              placeholder="ELDHY6734A"
                              className="w-full h-full px-[14px] py-[8px] rounded-[8px] font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px] outline-none"
                            />
                          </div>
                        </div>

                        {/* Third field - opacity 0 to maintain layout */}
                        <div className="flex flex-col gap-[4px] items-start flex-1 opacity-0">
                          <div className="flex gap-[2px] items-start w-full">
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">IFSC Code</p>
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                          </div>
                          <div className="bg-white h-[36px] w-full rounded-[8px] border border-[#eee] border-solid">
                            <input
                              type="text"
                              disabled
                              className="w-full h-full px-[14px] py-[8px] rounded-[8px] font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Validate Button */}
                      <div className="flex items-center justify-end w-full">
                        <button
                          onClick={handleManualValidate}
                          disabled={!manualAccountNumber || !manualIfscCode || manualBankValidating}
                          className={`h-[29px] px-[16px] py-[7px] rounded-[8px] flex gap-[8px] items-center justify-center transition-colors ${
                            manualAccountNumber && manualIfscCode && !manualBankValidating
                              ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                              : 'bg-[#e5e5e6] cursor-not-allowed'
                          }`}
                        >
                          <p className={`font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] whitespace-nowrap ${
                            manualAccountNumber && manualIfscCode && !manualBankValidating ? 'text-white' : 'text-[#5a6b7d]'
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
                className={`fixed inset-0 backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)] z-50 transition-opacity duration-200 ease-out ${
                  loadingModalAnimating ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Modal */}
              <div className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[16px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.12)] w-[calc(100vw-40px)] max-w-[590px] p-[24px] lg:p-[32px] z-[60] flex flex-col gap-[16px] lg:gap-[24px] items-center justify-center transition-all duration-200 ease-out ${
                loadingModalAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
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
        </>
      ) : showManualValidationError ? (
        /* Manual Validation Error Screen */
        <>
          {/* ── MOBILE / TABLET VIEW ── */}
          <div className="lg:hidden fixed inset-0 bg-[#fffaf6] z-30 overflow-y-auto">
            <div className="flex flex-col gap-[24px] items-center pt-[24px] px-[24px] pb-[120px]">
              {/* Logo */}
              <div className="h-[48px] w-[98px] shrink-0 self-start">
                <img alt="Logo" className="size-full object-cover" src={imgLogo} />
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
                      <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] flex items-center pr-[5.5px]">
                        <div className="flex-1 px-[12px]">
                          <p className="font-['Mulish',sans-serif] font-normal leading-[normal] text-[#71859b] text-[12px] truncate">
                            {manualErrorChequeUploaded ? 'Cheque uploaded' : 'Supported: PNG, JPEG or PDF up to 2MB'}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setManualErrorChequeFileSelected(false);
                            setShowManualErrorChequeModal(true);
                            setTimeout(() => setManualErrorChequeModalAnimating(true), 10);
                          }}
                          className="bg-[#93161e] hover:bg-[#7a1319] transition-colors px-[12px] py-[4px] rounded-[4px] shrink-0"
                        >
                          <p className="font-['Mulish',sans-serif] font-normal leading-[16.5px] text-white text-[11px] whitespace-nowrap">Browse</p>
                        </button>
                      </div>
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
                      <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] flex items-center px-[14px]">
                        <input
                          type="text"
                          value={manualErrorReenterAccountNumber}
                          onChange={(e) => setManualErrorReenterAccountNumber(e.target.value)}
                          className="flex-1 font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px] bg-transparent outline-none min-w-0"
                          placeholder="0987654320"
                        />
                      </div>
                    </div>

                    {/* Account Holder Name */}
                    <div className="flex flex-col gap-[4px] w-full">
                      <div className="flex gap-[2px] items-start">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Account Holder Name</p>
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                      </div>
                      <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] flex items-center px-[14px]">
                        <input
                          type="text"
                          value={manualErrorAccountHolderName}
                          onChange={(e) => setManualErrorAccountHolderName(e.target.value)}
                          className="flex-1 font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px] bg-transparent outline-none min-w-0"
                          placeholder="Rajesh Gupta"
                        />
                      </div>
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
                            className={`flex-1 px-[14px] py-[5px] rounded-[16777200px] flex items-center justify-center transition-all duration-200 ${
                              manualErrorAccountType === 'saving' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                            }`}
                          >
                            <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] whitespace-nowrap">Saving Account</p>
                          </button>
                          <button
                            onClick={() => setManualErrorAccountType('current')}
                            className={`flex-1 px-[14px] py-[5px] rounded-[16777200px] flex items-center justify-center transition-all duration-200 ${
                              manualErrorAccountType === 'current' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
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
                      <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] flex items-center px-[14px]">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px]">{manualIfscCode || 'ICIC0001959'}</p>
                      </div>
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

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)] px-[24px] py-[8px] z-40">
              <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#5a6b7d] text-[13px] text-right overflow-hidden text-ellipsis whitespace-nowrap mb-[8px]">Next: Nominee Details</p>
              <div className="flex gap-[16px] items-center">
                <button
                  onClick={() => {
                    setShowManualValidationError(false);
                    setShowChangeBankScreen(false);
                    setManualAccountNumber('');
                    setManualIfscCode('');
                  }}
                  className="flex-1 h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center hover:border-[#c7aa7b] transition-colors"
                >
                  <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Previous</p>
                </button>
                <button
                  disabled={!canContinueFromManualError}
                  onClick={() => {
                    if (canContinueFromManualError) {
                      proceedToNext();
                    }
                  }}
                  className={`flex-1 h-[36px] rounded-[8.75px] flex gap-[8px] items-center justify-center transition-colors ${
                    canContinueFromManualError
                      ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                      : 'bg-[#e5e5e6] cursor-not-allowed'
                  }`}
                >
                  <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${
                    canContinueFromManualError ? 'text-white' : 'text-[#5a6b7d]'
                  }`}>Continue</p>
                  <div className="size-[16px] relative shrink-0">
                    <svg className="absolute inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.0004 10.0006">
                      <path d={mobileBankFailedSvgPaths.p16866180} fill={canContinueFromManualError ? 'white' : '#5A6B7D'} />
                    </svg>
                  </div>
                </button>
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
                  <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] flex items-center pr-[5.5px] py-[14px]">
                    <div className="flex-1 px-[12px]">
                      <p className="font-['Mulish',sans-serif] font-normal text-[#71859b] text-[13px]">
                        {manualErrorChequeUploaded ? 'Cheque uploaded' : 'Supported: PNG, JPEG or PDF up to 2MB'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setManualErrorChequeFileSelected(false);
                        setShowManualErrorChequeModal(true);
                        setTimeout(() => setManualErrorChequeModalAnimating(true), 10);
                      }}
                      className="bg-[#93161e] hover:bg-[#7a1319] transition-colors px-[12px] py-[4px] rounded-[4px]"
                    >
                      <p className="font-['Mulish',sans-serif] font-normal leading-[16.5px] text-white text-[11px]">Browse</p>
                    </button>
                  </div>
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
                    <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] flex items-center px-[14px]">
                      <input
                        type="text"
                        value={manualErrorReenterAccountNumber}
                        onChange={(e) => setManualErrorReenterAccountNumber(e.target.value)}
                        className="flex-1 font-['Mulish',sans-serif] font-normal text-[#231f20] text-[13px] bg-transparent outline-none"
                        placeholder="0987654320"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)]">
                    <div className="flex gap-[2px] items-start">
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Account Holder Name</p>
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#e8402f] text-[12px]">*</p>
                    </div>
                    <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] flex items-center px-[14px]">
                      <input
                        type="text"
                        value={manualErrorAccountHolderName}
                        onChange={(e) => setManualErrorAccountHolderName(e.target.value)}
                        className="flex-1 font-['Mulish',sans-serif] font-normal text-[#231f20] text-[13px] bg-transparent outline-none"
                        placeholder="Rajesh Gupta"
                      />
                    </div>
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
                          className={`flex-1 px-[14px] py-[5px] rounded-[16777200px] transition-colors ${
                            manualErrorAccountType === 'saving' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                          }`}
                        >
                          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px]">Saving Account</p>
                        </button>
                        <button
                          onClick={() => setManualErrorAccountType('current')}
                          className={`flex-1 px-[14px] py-[5px] rounded-[16777200px] transition-colors ${
                            manualErrorAccountType === 'current' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
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
                    <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] flex items-center px-[14px]">
                      <p className="font-['Mulish',sans-serif] font-normal text-[#231f20] text-[13px]">{manualIfscCode || 'ICIC0001959'}</p>
                    </div>
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

          {/* Footer - Desktop */}
          <div className="hidden lg:flex absolute bottom-0 left-0 right-0 h-[64px] bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)] items-center justify-between px-[60px] xl:px-[120px] py-[8px] z-30">
            <button
              onClick={() => {
                setShowManualValidationError(false);
                setShowChangeBankScreen(false);
                setManualAccountNumber('');
                setManualIfscCode('');
              }}
              className="flex gap-[8px] h-[36px] items-center justify-center px-[21px] py-[7px] rounded-[8px] border border-[#eee] hover:border-[#c7aa7b] transition-colors"
            >
              <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Previous</p>
            </button>

            <div className="flex gap-[24px] items-center">
              <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#5a6b7d] text-[13px] text-right">Next: Nominee Details</p>
              <button
                disabled={!canContinueFromManualError}
                onClick={() => {
                  if (canContinueFromManualError) {
                    proceedToNext();
                  }
                }}
                className={`flex gap-[8px] h-[36px] items-center justify-center px-[21px] py-[8px] rounded-[8.75px] transition-colors ${
                  canContinueFromManualError
                    ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                    : 'bg-[#e5e5e6] cursor-not-allowed'
                }`}
              >
                <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${
                  canContinueFromManualError ? 'text-white' : 'text-[#5a6b7d]'
                }`}>Continue</p>
                <div className="size-[16px] relative">
                  <svg className="absolute inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.0004 10.0006">
                    <path d={mobileBankFailedSvgPaths.p16866180} fill={canContinueFromManualError ? 'white' : '#5A6B7D'} />
                  </svg>
                </div>
              </button>
            </div>
          </div>
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
          <div className={`absolute left-[24px] lg:left-[60px] xl:left-[120px] right-[24px] lg:right-[60px] xl:right-[120px] top-[172px] lg:top-[248px] pb-[100px] z-20 transition-all duration-300 ease-in-out ${
            isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
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
                        <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px]">{manualErrorAccountHolderName || contactPersonName || 'Rajesh Gupta'}</p>
                        <div className="flex gap-[4px] items-center">
                          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#435160] text-[13px]">{ifscData.bankName}</p>
                          <div className="bg-[rgba(147,22,30,0.06)] px-[8px] py-[2px] rounded-full">
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#93161e] text-[12px]">Savings</p>
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
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#435160] text-[12px]">Account Number</p>
                        <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px]">{manualAccountNumber || '0987654320'}</p>
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
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#435160] text-[12px]">IFSC Code</p>
                        <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px]">{normalizedIfscCode || 'ELDHY6734A'}</p>
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
                        <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#435160] text-[12px]">Branch Name & Address</p>
                        <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px]">{manualErrorBankBranch || ifscData.branchAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Validation Status & Actions */}
                <div className="flex flex-col lg:flex-row gap-[8px] lg:gap-0 items-stretch lg:items-center justify-between w-full">
                  {/* Show cheque uploaded card when cheque is uploaded */}
                  {chequeUploaded ? (
                    <>
                      <button
                        onClick={() => {
                          setShowChequePreviewModal(true);
                          setTimeout(() => setChequePreviewModalAnimating(true), 10);
                        }}
                        className="bg-[#fffaf6] border border-[#97291e] rounded-[8px] p-[14px] w-[196px] shrink-0 hover:bg-[#fff5eb] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full gap-[6px]">
                          <p className="font-['Mulish',sans-serif] font-normal leading-normal text-[#231f20] text-[13px] whitespace-nowrap">Cheque.png</p>
                          <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 15 10">
                            <path d="M7.5 1.25C4.375 1.25 1.6875 3.1875 0.625 6C1.6875 8.8125 4.375 10.75 7.5 10.75C10.625 10.75 13.3125 8.8125 14.375 6C13.3125 3.1875 10.625 1.25 7.5 1.25ZM7.5 9.25C5.84375 9.25 4.5 7.90625 4.5 6.25C4.5 4.59375 5.84375 3.25 7.5 3.25C9.15625 3.25 10.5 4.59375 10.5 6.25C10.5 7.90625 9.15625 9.25 7.5 9.25ZM7.5 4.5C6.53125 4.5 5.75 5.28125 5.75 6.25C5.75 7.21875 6.53125 8 7.5 8C8.46875 8 9.25 7.21875 9.25 6.25C9.25 5.28125 8.46875 4.5 7.5 4.5Z" fill="#93161E" />
                          </svg>
                        </div>
                      </button>
                      <button
                            onClick={() => openChangeBankScreen('qr')}
                        className="flex gap-[8px] h-[29px] items-center justify-center px-[16px] py-[7px] rounded-[8px] border border-[#eee] hover:border-[#c7aa7b] transition-colors w-full lg:w-auto"
                      >
                        <svg className="size-[16px]" fill="none" viewBox="0 0 12.5005 12.4999">
                          <path d={mobileBankSvgPaths.p24c9fc00} fill="#435160" />
                        </svg>
                        <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#435160] text-[13px] whitespace-nowrap">Change Bank Account</p>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Desktop Layout */}
                      <div className="hidden lg:flex lg:flex-row gap-[8px] items-center justify-between w-full">
                        {/* Status Message or Empty */}
                        {bankValidationStatus === 'failed' ? (
                          <div className="bg-[#fff1e2] flex gap-[8px] items-center px-[12px] py-[8px] rounded-[8px] shrink-0">
                            <img src={imgWarning} alt="Warning" className="size-[16px] shrink-0" />
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#93161e] text-[12px] whitespace-nowrap shrink-0">It seems that the account validation has failed. Please upload a Cancelled Cheque.</p>
                            <button
                              onClick={() => {
                                setChequeFileSelected(false);
                                setShowChequeUploadModal(true);
                                setTimeout(() => setChequeUploadModalAnimating(true), 10);
                              }}
                              className="bg-[#93161e] flex gap-[8px] h-[29px] items-center justify-center px-[16px] py-[7px] rounded-[8px] shrink-0 hover:bg-[#7a1319] transition-colors"
                            >
                              <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] text-white whitespace-nowrap">Upload</p>
                            </button>
                          </div>
                        ) : bankValidationStatus === 'success' ? (
                          <div className="bg-[#eeffe5] flex gap-[8px] h-[32px] items-center px-[12px] rounded-[8px] shrink-0">
                            <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 13 13">
                              <path d={mobileBank9SvgPaths.p578e80} fill="#37B400" />
                            </svg>
                            <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#37b400] text-[12px] whitespace-nowrap">Account has been validated successfully.</p>
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
                            <svg className="size-[16px]" fill="none" viewBox="0 0 12.5005 12.4999">
                              <path d={mobileBankSvgPaths.p24c9fc00} fill="#435160" />
                            </svg>
                            <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#435160] text-[13px] whitespace-nowrap">Change Bank Account</p>
                          </button>
                          {(bankValidationStatus === 'pending' || bankValidationStatus === 'validating') && (
                            <button
                              onClick={handleApmiValidate}
                              disabled={bankValidationStatus === 'validating'}
                              className={`flex gap-[8px] h-[29px] items-center justify-center px-[16px] py-[7px] rounded-[8px] transition-colors ${
                                bankValidationStatus === 'validating'
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
                        {/* Change Bank Account Button - Always visible on mobile when not cheque uploaded */}
                        {bankValidationStatus !== 'success' && (
                          <button
                            onClick={() => openChangeBankScreen('qr')}
                            className="flex gap-[8px] h-[29px] items-center justify-center px-[16px] py-[7px] rounded-[8px] border border-[#eee] hover:border-[#c7aa7b] transition-colors w-full"
                          >
                            <svg className="size-[16px]" fill="none" viewBox="0 0 12.5005 12.4999">
                              <path d={mobileBankFailedSvgPaths.p24c9fc00} fill="#435160" />
                            </svg>
                            <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#435160] text-[13px] whitespace-nowrap">Change Bank Account</p>
                          </button>
                        )}

                        {/* Error Banner - Mobile specific layout */}
                        {bankValidationStatus === 'failed' && (
                          <div className="bg-[#fff1e2] rounded-[8px] p-[12px] flex flex-col gap-[12px] w-full">
                            <div className="flex gap-[8px] items-center w-full">
                              <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 13.7506 12.2499">
                                <path d={mobileBankFailedSvgPaths.p1682e300} fill="#93161E" />
                              </svg>
                              <p className="flex-1 font-['Mulish',sans-serif] font-normal leading-[18px] text-[#93161e] text-[12px]">It seems that the account validation has failed. Please upload a Cancelled Cheque.</p>
                            </div>
                            <button
                              onClick={() => {
                                setChequeFileSelected(false);
                                setShowChequeUploadModal(true);
                                setTimeout(() => setChequeUploadModalAnimating(true), 10);
                              }}
                              className="bg-[#93161e] h-[29px] w-full rounded-[8px] flex items-center justify-center hover:bg-[#7a1319] transition-colors"
                            >
                              <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] text-white whitespace-nowrap">Upload</p>
                            </button>
                          </div>
                        )}

                        {/* Success Banner + Change Bank Account */}
                        {bankValidationStatus === 'success' && (
                          <div className="flex flex-col gap-[20px] w-full">
                            <div className="bg-[#eeffe5] flex gap-[8px] h-[32px] items-center px-[12px] rounded-[8px]">
                              <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 13 13">
                                <path d={mobileBank9SvgPaths.p578e80} fill="#37B400" />
                              </svg>
                              <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#37b400] text-[12px]">Account has been validated successfully.</p>
                            </div>
                            <div className="flex items-start justify-end w-full">
                              <button
                                onClick={() => openChangeBankScreen('qr')}
                                className="flex-1 h-[29px] rounded-[8px] border border-[#eee] flex items-center justify-center gap-[8px] hover:border-[#c7aa7b] transition-colors"
                              >
                                <svg className="size-[16px]" fill="none" viewBox="0 0 12.5005 12.4999">
                                  <path d={mobileBankFailedSvgPaths.p24c9fc00} fill="#435160" />
                                </svg>
                                <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#435160] text-[13px] whitespace-nowrap">Change Bank Account</p>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Validate Button - Only show when status is pending or validating */}
                        {(bankValidationStatus === 'pending' || bankValidationStatus === 'validating') && (
                          <button
                            onClick={handleApmiValidate}
                            disabled={bankValidationStatus === 'validating'}
                            className={`flex gap-[8px] h-[29px] w-full items-center justify-center px-[16px] py-[7px] rounded-[8px] transition-colors ${
                              bankValidationStatus === 'validating'
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Cancelled Cheque Modal */}
          {showChequeUploadModal && (
            <>
              {/* Backdrop + scroll container */}
              <div
                className={`fixed inset-0 backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)] z-40 overflow-y-auto transition-opacity duration-200 ease-out ${
                  chequeUploadModalAnimating ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => {
                  setChequeUploadModalAnimating(false);
                  setTimeout(() => {
                    setShowChequeUploadModal(false);
                    setChequeFileSelected(false);
                  }, 200);
                }}
              >
              <div className="flex min-h-full items-center justify-center p-[20px]">
              {/* Modal */}
              <div className={`bg-white rounded-[16px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.12)] w-full max-w-[679.5px] flex flex-col gap-[16px] p-[20px] md:p-[32px] transition-transform duration-200 ease-out ${
                chequeUploadModalAnimating ? 'scale-100' : 'scale-95'
              }`} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between w-full h-[33px] shrink-0">
                  <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#435160] text-[22px]">Upload Cancelled Cheque</p>
                  <div className="opacity-0 pointer-events-none size-[24px] shrink-0" />
                </div>

                {/* Upload Area */}
                <div className="border border-dashed border-[#eee] rounded-[8px] flex flex-col gap-[12px] items-center justify-center p-[12px] shrink-0">
                  {chequeFileSelected ? (
                    <div className="flex gap-[16px] items-start justify-between w-full">
                      <div className="flex-1 min-w-0">
                        <img alt="Cancelled Cheque" className="w-full max-h-[188px] object-contain rounded-[4px]" src={imgCancelledCheque} />
                      </div>
                      <button
                        onClick={() => setChequeFileSelected(false)}
                        className="size-[24px] shrink-0 flex items-center justify-center hover:opacity-70 transition-opacity"
                      >
                        <svg className="size-[18px]" fill="none" viewBox="0 0 18 19.5">
                          <path d="M2.25 4.5H15.75M6.75 7.875V13.5M11.25 7.875V13.5M3.375 4.5L4.5 15.75C4.5 16.0484 4.61853 16.3345 4.8295 16.5455C5.04048 16.7565 5.32663 16.875 5.625 16.875H12.375C12.6734 16.875 12.9595 16.7565 13.1705 16.5455C13.3815 16.3345 13.5 16.0484 13.5 15.75L14.625 4.5M6.75 4.5V3.375C6.75 3.07663 6.86853 2.79048 7.0795 2.5795C7.29048 2.36853 7.57663 2.25 7.875 2.25H10.125C10.4234 2.25 10.7095 2.36853 10.9205 2.5795C11.1315 2.79048 11.25 3.07663 11.25 3.375V4.5" stroke="#71859B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-clip size-[24px] shrink-0">
                        <svg className="size-full" fill="none" viewBox="0 0 18 18">
                          <path d={step3Pi22SvgPaths.p2f004400} fill="#71859B" />
                        </svg>
                      </div>
                      <div className="flex flex-col gap-[12px] items-center w-full">
                        <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#71859b] text-[13px] text-center">Format Supported: PNG, PDF or JPEG up to 2MB</p>
                        <div className="flex gap-[12px] items-center">
                          <button className="flex gap-[8px] h-[36px] items-center justify-center px-[21px] py-[7px] rounded-[8px] border border-[#eee] hover:border-[#c7aa7b] transition-colors">
                            <div className="overflow-clip size-[16px] shrink-0">
                              <svg className="size-full" fill="none" viewBox="0 0 13 11.5">
                                <path d={step3Pi22SvgPaths.pf78bc00} fill="#435160" />
                              </svg>
                            </div>
                            <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px] text-center whitespace-nowrap">Capture</p>
                          </button>
                          <button
                            onClick={() => setChequeFileSelected(true)}
                            className="bg-[#93161e] flex gap-[8px] h-[36px] items-center justify-center px-[21px] py-[7px] rounded-[8px] hover:bg-[#7a1319] transition-colors"
                          >
                            <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-white text-[14px] text-center whitespace-nowrap">Upload</p>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Upload Image Guidelines */}
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

                {/* Action Buttons */}
                <div className="flex gap-[24px] items-center w-full shrink-0">
                  <button
                    onClick={() => {
                      setChequeUploadModalAnimating(false);
                      setTimeout(() => {
                        setShowChequeUploadModal(false);
                        setChequeFileSelected(false);
                      }, 200);
                    }}
                    className="flex-1 h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center transition-all duration-300 hover:border-[#c7aa7b] hover:shadow-md"
                  >
                    <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Cancel</p>
                  </button>
                  <button
                    onClick={handleChequeUploadSave}
                    disabled={!chequeFileSelected}
                    className={`flex-1 h-[36px] rounded-[8.75px] flex items-center justify-center transition-all duration-300 ${
                      chequeFileSelected
                        ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                        : 'bg-[#e5e5e6] cursor-not-allowed'
                    }`}
                  >
                    <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${
                      chequeFileSelected ? 'text-white' : 'text-[#5a6b7d]'
                    }`}>Save</p>
                  </button>
                </div>
              </div>
              </div>
              </div>
            </>
          )}

          {/* Cheque Preview Modal */}
          {showChequePreviewModal && (
            <>
              {/* Backdrop */}
              <div
                className={`fixed inset-0 backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)] z-40 transition-opacity duration-200 ease-out ${
                  chequePreviewModalAnimating ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => {
                  setChequePreviewModalAnimating(false);
                  setTimeout(() => {
                    setShowChequePreviewModal(false);
                  }, 200);
                }}
              />

              {/* Modal */}
              <div className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[16px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.12)] w-[calc(100%-48px)] max-w-[354px] z-50 flex flex-col gap-[24px] p-[24px] transition-all duration-200 ease-out ${
                chequePreviewModalAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                {/* Header */}
                <div className="flex items-center justify-between w-full">
                  <p className="font-['Mulish',sans-serif] font-medium leading-[27px] text-[#435160] text-[18px]">View Cancelled Cheque</p>
                  <button
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

                {/* Cheque Image Container */}
                <div className="border border-dashed border-[#eee] rounded-[8px] p-[12px] flex items-center justify-center">
                  <div className="flex gap-[16px] items-start justify-end w-full">
                    <div className="h-[92px] w-[240px] relative shrink-0">
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <img alt="Cancelled Cheque Preview" className="absolute h-[82.45%] left-[14.16%] max-w-none top-[8.23%] w-[83.64%]" src={imgChequePreview} />
                      </div>
                    </div>
                    <div className="opacity-0 size-[20px] shrink-0">
                      <svg className="size-full" fill="none" viewBox="0 0 15 16.25">
                        <path d={personalInfo5SvgPaths.p13b2a100} fill="#71859B" />
                      </svg>
                    </div>
                  </div>
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
                className={`fixed inset-0 backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)] z-[60] overflow-y-auto transition-opacity duration-200 ease-out ${
                  manualErrorChequeModalAnimating ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => {
                  setManualErrorChequeModalAnimating(false);
                  setTimeout(() => {
                    setShowManualErrorChequeModal(false);
                  }, 200);
                }}
              >
              <div className="flex min-h-full items-center justify-center p-[20px]">
              {/* Modal */}
              <div className={`bg-white rounded-[16px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.12)] w-full max-w-[679.5px] flex flex-col gap-[16px] p-[20px] md:p-[32px] transition-transform duration-200 ease-out ${
                manualErrorChequeModalAnimating ? 'scale-100' : 'scale-95'
              }`} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between w-full h-[33px]">
                  <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#435160] text-[22px]">Upload Cancelled Cheque</p>
                  <button
                    onClick={() => {
                      setManualErrorChequeModalAnimating(false);
                      setTimeout(() => {
                        setShowManualErrorChequeModal(false);
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
                <div className="border border-dashed border-[#eee] rounded-[8px] flex flex-col items-center justify-center p-[12px] gap-[12px] shrink-0">
                  <div className="overflow-clip size-[24px] shrink-0">
                    <svg className="size-full" fill="none" viewBox="0 0 18 18">
                      <path d={step3Pi22SvgPaths.p2f004400} fill="#71859B" />
                    </svg>
                  </div>

                  <div className="flex flex-col items-center gap-[12px] w-full">
                    <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#71859b] text-[13px] text-center">Format Supported: PNG, PDF or JPEG up to 2MB</p>

                    <div className="flex gap-[12px] items-center">
                      <button className="h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center gap-[8px] px-[21px] py-[7px] hover:border-[#c7aa7b] transition-colors">
                        <div className="overflow-clip size-[16px] shrink-0">
                          <svg className="size-full" fill="none" viewBox="0 0 13 11.5">
                            <path d={step3Pi22SvgPaths.pf78bc00} fill="#435160" />
                          </svg>
                        </div>
                        <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Capture</p>
                      </button>

                      <button
                        onClick={() => setManualErrorChequeFileSelected(true)}
                        className="bg-[#93161e] hover:bg-[#7a1319] transition-colors h-[36px] rounded-[8px] flex items-center justify-center gap-[8px] px-[21px] py-[7px]"
                      >
                        <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-white text-[14px]">Upload</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upload Image Guidelines - Same as main cheque upload modal */}
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

                {/* Bottom Buttons */}
                <div className="flex gap-[24px] items-center w-full">
                  <button
                    onClick={() => {
                      setManualErrorChequeModalAnimating(false);
                      setTimeout(() => {
                        setShowManualErrorChequeModal(false);
                      }, 200);
                    }}
                    className="flex-1 h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center hover:border-[#c7aa7b] transition-colors"
                  >
                    <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Cancel</p>
                  </button>

                  <button
                    disabled={!manualErrorChequeFileSelected}
                    onClick={handleManualErrorChequeSave}
                    className={`flex-1 h-[36px] rounded-[8.75px] flex items-center justify-center transition-colors ${
                      manualErrorChequeFileSelected
                        ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                        : 'bg-[#e5e5e6] cursor-not-allowed'
                    }`}
                  >
                    <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${
                      manualErrorChequeFileSelected ? 'text-white' : 'text-[#5a6b7d]'
                    }`}>Save</p>
                  </button>
                </div>
              </div>
              </div>
              </div>
            </>
          )}

          {/* Bottom Navigation - Desktop */}
          <div className="hidden lg:flex fixed bottom-0 left-0 right-0 bg-white h-[64px] shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)] items-center justify-between px-[60px] xl:px-[120px] z-30">
            <button
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentStep('business-details');
                  setTimeout(() => setIsTransitioning(false), 50);
                }, 300);
              }}
              className="h-[36px] w-[180px] rounded-[8px] border border-[#eee] flex items-center justify-center transition-all duration-300 hover:border-[#c7aa7b] hover:shadow-md"
            >
              <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Previous</p>
            </button>
            <div className="flex gap-[24px] items-center">
              {isEditMode ? (
                <p
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentStep('nominee-details');
                      setTimeout(() => setIsTransitioning(false), 50);
                    }, 300);
                  }}
                  className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#e8402f] text-[13px] cursor-pointer hover:underline"
                >
                  Next: Nominee Details
                </p>
              ) : (
                <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#5a6b7d] text-[13px]">Next: Nominee Details</p>
              )}
              <button
                disabled={bankValidationStatus === 'success' ? false : (bankValidationStatus === 'failed' && chequeUploaded ? false : true)}
                onClick={() => {
                  if (bankValidationStatus === 'success' || (bankValidationStatus === 'failed' && chequeUploaded)) {
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
                  }
                }}
                className={`h-[36px] w-[180px] rounded-[8.75px] flex items-center justify-center gap-[8px] transition-all duration-300 ${
                  (bankValidationStatus === 'success' || (bankValidationStatus === 'failed' && chequeUploaded))
                    ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                    : 'bg-[#e5e5e6] cursor-not-allowed'
                }`}
              >
                <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${
                  (bankValidationStatus === 'success' || (bankValidationStatus === 'failed' && chequeUploaded)) ? 'text-white' : 'text-[#5a6b7d]'
                }`}>
                  {isEditMode ? 'Go to Review' : 'Continue'}
                </p>
                <div className="size-[16px]">
                  <svg className="size-full" fill="none" viewBox="0 0 12.0004 10.0006">
                    <path d={mobileBankSvgPaths.p16866180} fill={(bankValidationStatus === 'success' || (bankValidationStatus === 'failed' && chequeUploaded)) ? "white" : "#5A6B7D"} />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Navigation - Mobile/Tablet */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)] flex flex-col gap-[12px] p-[16px] md:p-[20px] z-30">
            {isEditMode ? (
              <>
                <p
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentStep('nominee-details');
                      setTimeout(() => setIsTransitioning(false), 50);
                    }, 300);
                  }}
                  className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#e8402f] text-[13px] cursor-pointer hover:underline"
                >
                  Next: Nominee Details
                </p>
                <div className="flex gap-[12px] items-center w-full">
                  <button
                    disabled={bankValidationStatus === 'success' ? false : (bankValidationStatus === 'failed' && chequeUploaded ? false : true)}
                    onClick={() => {
                      if (bankValidationStatus === 'success' || (bankValidationStatus === 'failed' && chequeUploaded)) {
                        setIsTransitioning(true);
                        setTimeout(() => {
                          setCurrentStep('review-confirm');
                          setIsEditMode(false);
                          setTimeout(() => setIsTransitioning(false), 50);
                        }, 300);
                      }
                    }}
                    className={`flex-1 h-[44px] md:h-[36px] rounded-[8px] flex items-center justify-center gap-[8px] transition-all duration-300 ${
                      (bankValidationStatus === 'success' || (bankValidationStatus === 'failed' && chequeUploaded))
                        ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                        : 'bg-[#e5e5e6] cursor-not-allowed'
                    }`}
                  >
                    <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${
                      (bankValidationStatus === 'success' || (bankValidationStatus === 'failed' && chequeUploaded)) ? 'text-white' : 'text-[#5a6b7d]'
                    }`}>Go to Review</p>
                    <div className="size-[16px]">
                      <svg className="size-full" fill="none" viewBox="0 0 12.0004 10.0006">
                        <path d={mobileBankSvgPaths.p16866180} fill={(bankValidationStatus === 'success' || (bankValidationStatus === 'failed' && chequeUploaded)) ? "white" : "#5A6B7D"} />
                      </svg>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#5a6b7d] text-[13px]">Next: Nominee Details</p>
                <div className="flex gap-[12px] items-center w-full">
                  <button
                    onClick={() => {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setCurrentStep('business-details');
                        setTimeout(() => setIsTransitioning(false), 50);
                      }, 300);
                    }}
                    className="flex-1 h-[44px] md:h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center transition-all duration-300 hover:border-[#c7aa7b]"
                  >
                    <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Previous</p>
                  </button>
                  <button
                    disabled={bankValidationStatus === 'success' ? false : (bankValidationStatus === 'failed' && chequeUploaded ? false : true)}
                    onClick={() => {
                      if (bankValidationStatus === 'success' || (bankValidationStatus === 'failed' && chequeUploaded)) {
                        setIsTransitioning(true);
                        setTimeout(() => {
                          setCurrentStep('nominee-details');
                          setTimeout(() => setIsTransitioning(false), 50);
                        }, 300);
                      }
                    }}
                    className={`flex-1 h-[44px] md:h-[36px] rounded-[8px] flex items-center justify-center gap-[8px] transition-all duration-300 ${
                      (bankValidationStatus === 'success' || (bankValidationStatus === 'failed' && chequeUploaded))
                        ? 'bg-[#93161e] hover:bg-[#7a1319] cursor-pointer'
                        : 'bg-[#e5e5e6] cursor-not-allowed'
                    }`}
                  >
                    <p className={`font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] ${
                      (bankValidationStatus === 'success' || (bankValidationStatus === 'failed' && chequeUploaded)) ? 'text-white' : 'text-[#5a6b7d]'
                    }`}>Continue</p>
                    <div className="size-[16px]">
                      <svg className="size-full" fill="none" viewBox="0 0 12.0004 10.0006">
                        <path d={mobileBankSvgPaths.p16866180} fill={(bankValidationStatus === 'success' || (bankValidationStatus === 'failed' && chequeUploaded)) ? "white" : "#5A6B7D"} />
                      </svg>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
