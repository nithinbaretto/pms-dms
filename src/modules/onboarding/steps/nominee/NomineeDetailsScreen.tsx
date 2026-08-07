import type { RefObject } from 'react';
import nomineeFormSvgPaths from '../../../../assets/figma-svg/svg-2tncnp7dy5';
import nomineeSvgPaths from '../../../../assets/figma-svg/svg-7h2pdnxf7l';
import emailOtpSvgPaths from '../../../../assets/figma-svg/svg-ftc9bj5bhu';
import nomineeAddressSvgPaths from '../../../../assets/figma-svg/svg-8pstwmmui8';
import guardianAddressSvgPaths from '../../../../assets/figma-svg/svg-31cjxfwjep';
import imgLogo from '../../../../assets/logo.png';
import imgEmptyNominee from '../../../../assets/images/guidlines_img_2.png';
import imgMapPreview from '../../../../assets/images/guidlines_img_1.png';
import imgGuardianMapPreview from '../../../../assets/images/guidlines_img_1.png';

interface NomineeDetailsScreenProps {
  // Nominee form state
  nomineeOption: 'later' | 'now';
  setNomineeOption: (option: 'later' | 'now') => void;
  nomineeName: string;
  setNomineeName: (name: string) => void;
  nomineeRelationship: string;
  setNomineeRelationship: (relationship: string) => void;
  nomineeProofType: string;
  setNomineeProofType: (type: string) => void;
  nomineeProofNumber: string;
  setNomineeProofNumber: (number: string) => void;
  nomineeMobileCountry: string;
  nomineeMobile: string;
  setNomineeMobile: (mobile: string) => void;
  nomineeEmail: string;
  setNomineeEmail: (email: string) => void;
  nomineeIsMinor: 'yes' | 'no';
  setNomineeIsMinor: (isMinor: 'yes' | 'no') => void;
  nomineeDob: string;
  nomineeAddress: string;

  // Guardian details
  guardianName: string;
  setGuardianName: (name: string) => void;
  guardianAddress: string;

  // Dropdown state
  showProofDropdown: boolean;
  setShowProofDropdown: (show: boolean) => void;
  proofDropdownRef: RefObject<HTMLDivElement | null>;
  showRelationshipDropdown: boolean;
  setShowRelationshipDropdown: (show: boolean) => void;
  relationshipDropdownRef: RefObject<HTMLDivElement | null>;

  // DOB picker modal
  showDobPicker: boolean;
  dobPickerAnimating: boolean;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  handleOpenDobPicker: () => void;
  handleCloseDobPicker: () => void;
  handleSaveDob: () => void;

  // Nominee address modal
  showNomineeAddressModal: boolean;
  nomineeAddressModalAnimating: boolean;
  sameAsApplicant: boolean;
  setSameAsApplicant: (same: boolean) => void;
  nomineeAddressSearch: string;
  setNomineeAddressSearch: (search: string) => void;
  nomineeAddressDetails: string;
  setNomineeAddressDetails: (details: string) => void;
  permanentAddress: string;
  handleOpenNomineeAddressModal: () => void;
  handleCloseNomineeAddressModal: () => void;
  handleSaveNomineeAddress: () => void;

  // Guardian address modal
  showGuardianAddressModal: boolean;
  guardianAddressModalAnimating: boolean;
  sameAsNominee: boolean;
  setSameAsNominee: (same: boolean) => void;
  guardianAddressSearch: string;
  setGuardianAddressSearch: (search: string) => void;
  guardianAddressDetails: string;
  setGuardianAddressDetails: (details: string) => void;
  handleOpenGuardianAddressModal: () => void;
  handleCloseGuardianAddressModal: () => void;
  handleSaveGuardianAddress: () => void;

  // Navigation
  isEditMode: boolean;
  isTransitioning: boolean;
  canProceed: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
  setCurrentStep: (step: string) => void;
  setIsEditMode: (editMode: boolean) => void;
}

export function NomineeDetailsScreen({
  nomineeOption,
  setNomineeOption,
  nomineeName,
  setNomineeName,
  nomineeRelationship,
  setNomineeRelationship,
  nomineeProofType,
  setNomineeProofType,
  nomineeProofNumber,
  setNomineeProofNumber,
  nomineeMobileCountry,
  nomineeMobile,
  setNomineeMobile,
  nomineeEmail,
  setNomineeEmail,
  nomineeIsMinor,
  setNomineeIsMinor,
  nomineeDob,
  nomineeAddress,
  guardianName,
  setGuardianName,
  guardianAddress,
  showProofDropdown,
  setShowProofDropdown,
  proofDropdownRef,
  showRelationshipDropdown,
  setShowRelationshipDropdown,
  relationshipDropdownRef,
  showDobPicker,
  dobPickerAnimating,
  selectedDay,
  setSelectedDay,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  handleOpenDobPicker,
  handleCloseDobPicker,
  handleSaveDob,
  showNomineeAddressModal,
  nomineeAddressModalAnimating,
  sameAsApplicant,
  setSameAsApplicant,
  nomineeAddressSearch,
  setNomineeAddressSearch,
  nomineeAddressDetails,
  setNomineeAddressDetails,
  permanentAddress,
  handleOpenNomineeAddressModal,
  handleCloseNomineeAddressModal,
  handleSaveNomineeAddress,
  showGuardianAddressModal,
  guardianAddressModalAnimating,
  sameAsNominee,
  setSameAsNominee,
  guardianAddressSearch,
  setGuardianAddressSearch,
  guardianAddressDetails,
  setGuardianAddressDetails,
  handleOpenGuardianAddressModal,
  handleCloseGuardianAddressModal,
  handleSaveGuardianAddress,
  isEditMode,
  isTransitioning,
  canProceed,
  setIsTransitioning,
  setCurrentStep,
  setIsEditMode,
}: NomineeDetailsScreenProps) {
  void isTransitioning;

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block min-h-screen bg-[#fffaf6] pb-[80px]">
        {/* Main Content - Scrollable with centered container */}
        <div className="relative z-10">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-[24px]">
            {/* Header */}
            <div className="flex flex-col gap-[4px]">
              <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#231f20] text-[22px]">Nominee Details</p>
              <p className="font-['Mulish',sans-serif] font-normal leading-[22.5px] text-[#435160] text-[15px]">Your details have been fetched from APMI. Fields shown in grey cannot be changed</p>
            </div>

            {/* Form Container */}
            <div className="flex flex-col gap-[8px]">
            {/* Step Progress */}
            <div className="flex items-center justify-between font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">
              <p>Step 4 of 6</p>
              <p>60%</p>
            </div>

            {/* White Card - Content hugs, no internal scroll */}
            <div className="bg-white rounded-[16px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] w-full">
              {/* Progress Bar - Full width at top */}
              <div className="bg-[#e6e7e8] h-[8px] w-full">
                <div className="bg-[#37b400] h-full w-[60%]"></div>
              </div>

              <div className="flex flex-col gap-[20px] p-[16px]">
                {/* Switcher */}
                <div className="flex items-start w-full">
                  <div className="bg-[#f5f5f5] rounded-[16777200px] p-[4px] flex gap-[4px]">
                    <button
                      onClick={() => setNomineeOption('later')}
                      className={`px-[14px] py-[5px] rounded-[16777200px] transition-colors ${
                        nomineeOption === 'later' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                      }`}
                    >
                      <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px]">Add Nominee Later</p>
                    </button>
                    <button
                      onClick={() => setNomineeOption('now')}
                      className={`px-[14px] py-[5px] rounded-[16777200px] transition-colors ${
                        nomineeOption === 'now' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                      }`}
                    >
                      <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px]">Add Nominee now</p>
                    </button>
                  </div>
                </div>

                {/* Content Area - No scroll, hugs content */}
                {nomineeOption === 'later' ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-[24px] gap-[12px]">
                    <img src={imgEmptyNominee} alt="No nominee added" className="w-[108px] h-[66px] object-contain" />
                    <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#71859b] text-[13px] text-center">Add a nominee now for convenience or complete this step later.</p>
                  </div>
                ) : (
                  /* Nominee Form */
                  <div className="flex flex-wrap gap-[16px]">
                    {/* Nominee Name */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)]">
                      <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                        <p className="text-[#231f20]">Nominee Name</p>
                        <p className="text-[#e8402f]">*</p>
                      </div>
                      <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative">
                        <input
                          type="text"
                          value={nomineeName}
                          onChange={(e) => setNomineeName(e.target.value)}
                          className="w-full h-full px-[14px] rounded-[8px] font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] outline-none"
                        />
                      </div>
                    </div>

                    {/* Relationship with Applicant */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)] relative" ref={relationshipDropdownRef}>
                      <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                        <p className="text-[#231f20]">Relationship with Applicant</p>
                        <p className="text-[#e8402f]">*</p>
                      </div>
                      <button
                        onClick={() => setShowRelationshipDropdown(!showRelationshipDropdown)}
                        className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative hover:border-[#c7aa7b] transition-colors"
                      >
                        <div className="flex items-center justify-between px-[14px] h-full">
                          <p className="font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20]">{nomineeRelationship}</p>
                          <svg className="size-[14px]" fill="none" viewBox="0 0 8.62789 4.87783">
                            <path d={nomineeFormSvgPaths.p3ea1e500} fill="#231F20" />
                          </svg>
                        </div>
                      </button>

                      {/* Relationship Dropdown */}
                      {showRelationshipDropdown && (
                        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-[8px] border border-[#e5e5e6] z-50 overflow-hidden shadow-lg max-h-[240px] overflow-y-auto">
                          {['Father', 'Mother', 'Son', 'Daughter', 'Spouse', 'Wife', 'Husband', 'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Grandson', 'Granddaughter'].map((relationship) => (
                            <button
                              key={relationship}
                              onClick={() => {
                                setNomineeRelationship(relationship);
                                setShowRelationshipDropdown(false);
                              }}
                              className="w-full h-[36px] flex items-center px-[12px] py-[14px] hover:bg-[#f5f5f5] transition-colors"
                            >
                              <p className="font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] whitespace-nowrap">{relationship}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Proof of Identity */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)] relative" ref={proofDropdownRef}>
                      <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                        <p className="text-[#231f20]">Proof of Identity</p>
                        <p className="text-[#e8402f]">*</p>
                      </div>
                      <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative flex items-center">
                        <button
                          onClick={() => setShowProofDropdown(!showProofDropdown)}
                          className="bg-[#f5f5f5] flex gap-[4px] items-center px-[6px] h-full hover:bg-[#e8e8e8] transition-colors"
                        >
                          <p className="font-['Mulish',sans-serif] font-normal text-[13px] text-[#71859b]">{nomineeProofType}</p>
                          <svg className="size-[12px]" fill="none" viewBox="0 0 8.62789 4.87783">
                            <path d={nomineeFormSvgPaths.p3ea1e500} fill="#5A6B7D" />
                          </svg>
                        </button>
                        <p className="font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] px-[12px]">
                          {nomineeProofNumber}
                        </p>
                      </div>

                      {/* Dropdown Menu */}
                      {showProofDropdown && (
                        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-[8px] border border-[#e5e5e6] z-50 overflow-hidden shadow-lg">
                          <button
                            onClick={() => {
                              setNomineeProofType('Aadhar');
                              setNomineeProofNumber('1111 2222 3333');
                              setShowProofDropdown(false);
                            }}
                            className="content-stretch w-full flex gap-[8px] h-[36px] items-center px-[12px] py-[14px] hover:bg-[#f5f5f5] transition-colors"
                          >
                            <p className="[word-break:break-word] font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px] whitespace-nowrap">Aadhar</p>
                          </button>
                          <button
                            onClick={() => {
                              setNomineeProofType('PAN');
                              setNomineeProofNumber('EHSYT7465H');
                              setShowProofDropdown(false);
                            }}
                            className="content-stretch w-full flex gap-[8px] h-[36px] items-center px-[12px] py-[14px] hover:bg-[#f5f5f5] transition-colors"
                          >
                            <p className="[word-break:break-word] font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px] whitespace-nowrap">PAN</p>
                          </button>
                          <button
                            onClick={() => {
                              setNomineeProofType('Driving License');
                              setNomineeProofNumber('DL1234567890');
                              setShowProofDropdown(false);
                            }}
                            className="content-stretch w-full flex gap-[8px] h-[36px] items-center px-[12px] py-[14px] hover:bg-[#f5f5f5] transition-colors"
                          >
                            <p className="[word-break:break-word] font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px] whitespace-nowrap">Driving License</p>
                          </button>
                          <button
                            onClick={() => {
                              setNomineeProofType('Passport');
                              setNomineeProofNumber('P1234567');
                              setShowProofDropdown(false);
                            }}
                            className="w-full h-[36px] flex items-center px-[12px] py-[14px] hover:bg-[#f5f5f5] transition-colors"
                          >
                            <div className="[word-break:break-word] font-['Mulish',sans-serif] font-normal leading-[0] text-[#231f20] text-[0px] whitespace-nowrap">
                              <p className="leading-[1.452] mb-0 text-[13px]">Passport</p>
                              <p className="leading-[1.452] text-[8px]">(For NRI nominees)</p>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)]">
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Mobile Number</p>
                      <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative flex">
                        <div className="bg-[#f5f5f5] flex gap-[4px] items-center px-[6px]">
                          <p className="font-['Mulish',sans-serif] font-normal text-[13px] text-[#71859b] w-[59px]">{nomineeMobileCountry}</p>
                          <svg className="size-[12px]" fill="none" viewBox="0 0 8.62789 4.87783">
                            <path d={nomineeFormSvgPaths.p3ea1e500} fill="#5A6B7D" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={nomineeMobile}
                          onChange={(e) => setNomineeMobile(e.target.value)}
                          placeholder="Enter Mobile Number"
                          className="flex-1 px-[12px] font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] placeholder:text-[#71859b] outline-none"
                        />
                      </div>
                    </div>

                    {/* Email ID */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)]">
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Email ID</p>
                      <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative">
                        <input
                          type="email"
                          value={nomineeEmail}
                          onChange={(e) => setNomineeEmail(e.target.value)}
                          placeholder="Enter Email ID"
                          className="w-full h-full px-[14px] rounded-[8px] font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] placeholder:text-[#71859b] outline-none"
                        />
                      </div>
                    </div>

                    {/* Is nominee a minor */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)]">
                      <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal text-[12px]">
                        <p className="leading-[18px] text-[#231f20]">Is nominee a minor?</p>
                        <p className="leading-[18px] text-[#e8402f]">*</p>
                      </div>
                      <div className="flex gap-[30px] items-center">
                        {/* Yes/No Switcher */}
                        <div className="bg-[#f5f5f5] rounded-[16777200px] p-[4px] flex gap-[4px]">
                          <button
                            onClick={() => setNomineeIsMinor('yes')}
                            className={`px-[14px] py-[5px] rounded-[16777200px] transition-colors ${
                              nomineeIsMinor === 'yes' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                            }`}
                          >
                            <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px]">Yes</p>
                          </button>
                          <button
                            onClick={() => setNomineeIsMinor('no')}
                            className={`px-[14px] py-[5px] rounded-[16777200px] transition-colors ${
                              nomineeIsMinor === 'no' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                            }`}
                          >
                            <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px]">No</p>
                          </button>
                        </div>

                        {/* DOB Field */}
                        <div className="flex-1">
                          <button
                            onClick={handleOpenDobPicker}
                            className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative w-full hover:bg-[#f9f9f9] transition-colors"
                          >
                            <div className="flex items-center justify-between px-[14px] h-full gap-[8px]">
                              <div className="flex gap-[8px] flex-1 items-center font-['Mulish',sans-serif] font-normal text-[13px]">
                                <p className="text-[#71859b]">DOB</p>
                                <p className="text-[#231f20]">{nomineeDob}</p>
                              </div>
                              <svg className="size-[14px]" fill="none" viewBox="0 0 10.5 11.375">
                                <path d={nomineeFormSvgPaths.p3c25e700} fill="#231F20" />
                              </svg>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] max-w-[calc(33.333%-11px)]">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                          <p className="text-[#231f20]">Address</p>
                          <p className="text-[#e8402f]">*</p>
                        </div>
                        <button onClick={handleOpenNomineeAddressModal} className="flex gap-[4px] items-center hover:opacity-70 transition-opacity">
                          <svg className="size-[14px]" fill="none" viewBox="0 0 10.9379 10.9374">
                            <path d={nomineeFormSvgPaths.p2f5a1780} fill="#93161E" />
                          </svg>
                          <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#93161e] text-[12px]">Edit</p>
                        </button>
                      </div>
                      <div className="bg-[#f5f5f5] rounded-[8.75px] border border-[#e5e5e6] relative">
                        <div className="flex items-center px-[14px] py-[14px]">
                          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] text-[#5a6b7d] flex-1 overflow-hidden text-ellipsis">{nomineeAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Empty spacer for layout - maintains 3-column grid alignment */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] opacity-0 pointer-events-none"></div>

                    {/* Guardian Details - Only shown for minor nominees */}
                    {nomineeIsMinor === 'yes' && (
                      <>
                        {/* Divider Line */}
                        <div className="h-0 relative w-full">
                          <div className="absolute inset-[-1px_0]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1168 2">
                              <path d="M0 1H1168" stroke="#E5E5E6" strokeWidth="2" />
                            </svg>
                          </div>
                        </div>

                        {/* Guardian Details Header */}
                        <div className="flex flex-col font-['Mulish',sans-serif] font-medium gap-[4px] items-start justify-center w-full">
                          <p className="h-[22px] leading-[24px] overflow-hidden text-[#231f20] text-[16px] text-ellipsis w-full whitespace-nowrap">Guardian Details</p>
                          <p className="leading-[21px] text-[#435160] text-[14px] w-full">Required for Minor nominees</p>
                        </div>

                        {/* Guardian Name */}
                        <div className="flex flex-col gap-[4px] flex-1 min-w-[310px]">
                          <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                            <p className="text-[#231f20]">Guardian Name</p>
                            <p className="text-[#e8402f]">*</p>
                          </div>
                          <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative">
                            <input
                              type="text"
                              value={guardianName}
                              onChange={(e) => setGuardianName(e.target.value)}
                              className="w-full h-full px-[14px] rounded-[8px] font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] outline-none"
                            />
                          </div>
                        </div>

                        {/* Guardian Address */}
                        <div className="flex flex-col gap-[4px] flex-1 min-w-[310px]">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                              <p className="text-[#231f20]">Address</p>
                              <p className="text-[#e8402f]">*</p>
                            </div>
                            <button onClick={handleOpenGuardianAddressModal} className="flex gap-[4px] items-center hover:opacity-70 transition-opacity">
                              <svg className="size-[14px]" fill="none" viewBox="0 0 10.9379 10.9374">
                                <path d={nomineeFormSvgPaths.p2f5a1780} fill="#93161E" />
                              </svg>
                              <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#93161e] text-[12px]">Edit</p>
                            </button>
                          </div>
                          <div className="bg-[#f5f5f5] rounded-[8.75px] border border-[#e5e5e6] relative">
                            <div className="flex items-center px-[14px] py-[14px]">
                              <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] text-[#5a6b7d] flex-1 overflow-hidden text-ellipsis">{guardianAddress}</p>
                            </div>
                          </div>
                        </div>

                        {/* Empty spacer for layout - maintains 3-column grid alignment */}
                        <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] opacity-0 pointer-events-none"></div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Desktop - Fixed */}
        <div className="fixed bottom-0 left-0 right-0 bg-white h-[64px] shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)] flex items-center justify-between px-[60px] xl:px-[120px] py-[8px] z-30">
          <button
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentStep('bank-details');
                setTimeout(() => setIsTransitioning(false), 50);
              }, 300);
            }}
            className="h-[36px] w-[180px] rounded-[8px] border border-[#eee] flex items-center justify-center hover:border-[#c7aa7b] transition-colors"
          >
            <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Previous</p>
          </button>

          <div className="flex gap-[24px] items-center">
            {isEditMode ? (
              <p
                onClick={() => {
                  if (!canProceed) {
                    return;
                  }
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentStep('upload-documents');
                    setTimeout(() => setIsTransitioning(false), 50);
                  }, 300);
                }}
                className={`font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] text-right ${canProceed ? 'text-[#e8402f] cursor-pointer hover:underline' : 'text-[#b7b7b8] cursor-not-allowed'}`}
              >
                Next: Upload Documents
              </p>
            ) : (
              <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#5a6b7d] text-[13px] text-right">Next: Upload Documents</p>
            )}
            <button
              onClick={() => {
                if (!canProceed) {
                  return;
                }
                setIsTransitioning(true);
                setTimeout(() => {
                  if (isEditMode) {
                    setCurrentStep('review-confirm');
                    setIsEditMode(false);
                  } else {
                    setCurrentStep('upload-documents');
                  }
                  setTimeout(() => setIsTransitioning(false), 50);
                }, 300);
              }}
              disabled={!canProceed}
              className="h-[36px] w-[180px] rounded-[8px] flex items-center justify-center gap-[8px] transition-colors bg-[#93161e] hover:bg-[#7a1319] disabled:bg-[#e5e5e6] disabled:hover:bg-[#e5e5e6] disabled:cursor-not-allowed"
            >
              <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] text-white">{isEditMode ? 'Go to Review' : 'Continue'}</p>
              <div className="size-[16px]">
                <svg className="size-full" fill="none" viewBox="0 0 12.0004 10.0006">
                  <path d={nomineeSvgPaths.p16866180} fill="white" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="lg:hidden flex flex-col min-h-screen w-full bg-[#fffaf6]">
        {/* Logo */}
        <div className="absolute left-[20px] md:left-[40px] top-[32px] md:top-[48px] w-[80px] md:w-[100px] h-[40px] md:h-[50px] z-10">
          <img alt="ICICI Prudential" className="w-full h-full object-contain" src={imgLogo} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col px-[20px] md:px-[40px] pt-[100px] md:pt-[130px] pb-[120px] relative z-10 gap-[24px]">
          {/* Header */}
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Mulish',sans-serif] font-medium leading-[28px] md:leading-[33px] text-[#231f20] text-[20px] md:text-[22px]">Nominee Details</p>
            <p className="font-['Mulish',sans-serif] font-normal leading-[20px] md:leading-[22.5px] text-[#435160] text-[14px] md:text-[15px]">Your details have been fetched from APMI. Fields shown in grey cannot be changed</p>
          </div>

          {/* Form Container */}
          <div className="flex flex-col gap-[8px]">
            {/* Step Progress */}
            <div className="flex items-center justify-between font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">
              <p>Step 4 of 6</p>
              <p>60%</p>
            </div>

            {/* White Card */}
            <div className="bg-white rounded-[16px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] w-full overflow-hidden">
              {/* Progress Bar - Full width at top */}
              <div className="bg-[#e6e7e8] h-[8px] w-full">
                <div className="bg-[#37b400] h-full w-[60%]"></div>
              </div>

              <div className="flex flex-col gap-[20px] p-[16px] pb-0">
                {/* Switcher */}
                <div className="flex items-start w-full">
                  <div className="bg-[#f5f5f5] rounded-[16777200px] p-[4px] flex gap-[4px]">
                    <button
                      onClick={() => setNomineeOption('later')}
                      className={`px-[14px] py-[5px] rounded-[16777200px] transition-colors ${
                        nomineeOption === 'later' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                      }`}
                    >
                      <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px]">Add Nominee Later</p>
                    </button>
                    <button
                      onClick={() => setNomineeOption('now')}
                      className={`px-[14px] py-[5px] rounded-[16777200px] transition-colors ${
                        nomineeOption === 'now' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                      }`}
                    >
                      <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px]">Add Nominee now</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-[16px] pt-[20px]">
                {/* Conditional Content */}
                {nomineeOption === 'later' ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-[24px] gap-[12px]">
                    <img src={imgEmptyNominee} alt="No nominee added" className="w-[108px] h-[66px] object-contain" />
                    <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#71859b] text-[13px] text-center">Add a nominee now for convenience or complete this step later.</p>
                  </div>
                ) : (
                  /* Nominee Form */
                  <div className="flex flex-wrap gap-[16px]">
                    {/* Nominee Name */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px]">
                      <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                        <p className="text-[#231f20]">Nominee Name</p>
                        <p className="text-[#e8402f]">*</p>
                      </div>
                      <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative">
                        <input
                          type="text"
                          value={nomineeName}
                          onChange={(e) => setNomineeName(e.target.value)}
                          className="w-full h-full px-[14px] rounded-[8px] font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] outline-none"
                        />
                      </div>
                    </div>

                    {/* Relationship with Applicant */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] relative" ref={relationshipDropdownRef}>
                      <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                        <p className="text-[#231f20]">Relationship with Applicant</p>
                        <p className="text-[#e8402f]">*</p>
                      </div>
                      <button
                        onClick={() => setShowRelationshipDropdown(!showRelationshipDropdown)}
                        className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative hover:border-[#c7aa7b] transition-colors"
                      >
                        <div className="flex items-center justify-between px-[14px] h-full">
                          <p className="font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20]">{nomineeRelationship}</p>
                          <svg className="size-[14px]" fill="none" viewBox="0 0 8.62789 4.87783">
                            <path d={nomineeFormSvgPaths.p3ea1e500} fill="#231F20" />
                          </svg>
                        </div>
                      </button>

                      {/* Relationship Dropdown */}
                      {showRelationshipDropdown && (
                        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-[8px] border border-[#e5e5e6] z-50 overflow-hidden shadow-lg max-h-[240px] overflow-y-auto">
                          {['Father', 'Mother', 'Son', 'Daughter', 'Spouse', 'Wife', 'Husband', 'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Grandson', 'Granddaughter'].map((relationship) => (
                            <button
                              key={relationship}
                              onClick={() => {
                                setNomineeRelationship(relationship);
                                setShowRelationshipDropdown(false);
                              }}
                              className="w-full h-[36px] flex items-center px-[12px] py-[14px] hover:bg-[#f5f5f5] transition-colors"
                            >
                              <p className="font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] whitespace-nowrap">{relationship}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Proof of Identity */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] relative" ref={proofDropdownRef}>
                      <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                        <p className="text-[#231f20]">Proof of Identity</p>
                        <p className="text-[#e8402f]">*</p>
                      </div>
                      <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative flex items-center">
                        <button
                          onClick={() => setShowProofDropdown(!showProofDropdown)}
                          className="bg-[#f5f5f5] flex gap-[4px] items-center px-[6px] h-full hover:bg-[#e8e8e8] transition-colors"
                        >
                          <p className="font-['Mulish',sans-serif] font-normal text-[13px] text-[#71859b]">{nomineeProofType}</p>
                          <svg className="size-[12px]" fill="none" viewBox="0 0 8.62789 4.87783">
                            <path d={nomineeFormSvgPaths.p3ea1e500} fill="#5A6B7D" />
                          </svg>
                        </button>
                        <p className="font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] px-[12px]">
                          {nomineeProofNumber}
                        </p>
                      </div>

                      {/* Dropdown Menu */}
                      {showProofDropdown && (
                        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-[8px] border border-[#e5e5e6] z-50 overflow-hidden shadow-lg">
                          <button
                            onClick={() => {
                              setNomineeProofType('Aadhar');
                              setNomineeProofNumber('1111 2222 3333');
                              setShowProofDropdown(false);
                            }}
                            className="content-stretch w-full flex gap-[8px] h-[36px] items-center px-[12px] py-[14px] hover:bg-[#f5f5f5] transition-colors"
                          >
                            <p className="[word-break:break-word] font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px] whitespace-nowrap">Aadhar</p>
                          </button>
                          <button
                            onClick={() => {
                              setNomineeProofType('PAN');
                              setNomineeProofNumber('EHSYT7465H');
                              setShowProofDropdown(false);
                            }}
                            className="content-stretch w-full flex gap-[8px] h-[36px] items-center px-[12px] py-[14px] hover:bg-[#f5f5f5] transition-colors"
                          >
                            <p className="[word-break:break-word] font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px] whitespace-nowrap">PAN</p>
                          </button>
                          <button
                            onClick={() => {
                              setNomineeProofType('Driving License');
                              setNomineeProofNumber('DL1234567890');
                              setShowProofDropdown(false);
                            }}
                            className="content-stretch w-full flex gap-[8px] h-[36px] items-center px-[12px] py-[14px] hover:bg-[#f5f5f5] transition-colors"
                          >
                            <p className="[word-break:break-word] font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px] whitespace-nowrap">Driving License</p>
                          </button>
                          <button
                            onClick={() => {
                              setNomineeProofType('Passport');
                              setNomineeProofNumber('P1234567');
                              setShowProofDropdown(false);
                            }}
                            className="w-full h-[36px] flex items-center px-[12px] py-[14px] hover:bg-[#f5f5f5] transition-colors"
                          >
                            <div className="[word-break:break-word] font-['Mulish',sans-serif] font-normal leading-[0] text-[#231f20] text-[0px] whitespace-nowrap">
                              <p className="leading-[1.452] mb-0 text-[13px]">Passport</p>
                              <p className="leading-[1.452] text-[8px]">(For NRI nominees)</p>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px]">
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Mobile Number</p>
                      <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative flex">
                        <div className="bg-[#f5f5f5] flex gap-[4px] items-center px-[6px]">
                          <p className="font-['Mulish',sans-serif] font-normal text-[13px] text-[#71859b] w-[59px]">{nomineeMobileCountry}</p>
                          <svg className="size-[12px]" fill="none" viewBox="0 0 8.62789 4.87783">
                            <path d={nomineeFormSvgPaths.p3ea1e500} fill="#5A6B7D" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={nomineeMobile}
                          onChange={(e) => setNomineeMobile(e.target.value)}
                          placeholder="Enter Mobile Number"
                          className="flex-1 px-[12px] font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] placeholder:text-[#71859b] outline-none"
                        />
                      </div>
                    </div>

                    {/* Email ID */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px]">
                      <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#231f20] text-[12px]">Email ID</p>
                      <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative">
                        <input
                          type="email"
                          value={nomineeEmail}
                          onChange={(e) => setNomineeEmail(e.target.value)}
                          placeholder="Enter Email ID"
                          className="w-full h-full px-[14px] rounded-[8px] font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] placeholder:text-[#71859b] outline-none"
                        />
                      </div>
                    </div>

                    {/* Is nominee a minor */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px]">
                      <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal text-[12px]">
                        <p className="leading-[18px] text-[#231f20]">Is nominee a minor?</p>
                        <p className="leading-[18px] text-[#e8402f]">*</p>
                      </div>
                      <div className="flex gap-[30px] items-center">
                        {/* Yes/No Switcher */}
                        <div className="bg-[#f5f5f5] rounded-[16777200px] p-[4px] flex gap-[4px]">
                          <button
                            onClick={() => setNomineeIsMinor('yes')}
                            className={`px-[14px] py-[5px] rounded-[16777200px] transition-colors ${
                              nomineeIsMinor === 'yes' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                            }`}
                          >
                            <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px]">Yes</p>
                          </button>
                          <button
                            onClick={() => setNomineeIsMinor('no')}
                            className={`px-[14px] py-[5px] rounded-[16777200px] transition-colors ${
                              nomineeIsMinor === 'no' ? 'bg-white text-[#93161e]' : 'text-[#5a6b7d]'
                            }`}
                          >
                            <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px]">No</p>
                          </button>
                        </div>

                        {/* DOB Field */}
                        <div className="flex-1">
                          <button
                            onClick={handleOpenDobPicker}
                            className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative w-full hover:bg-[#f9f9f9] transition-colors"
                          >
                            <div className="flex items-center justify-between px-[14px] h-full gap-[8px]">
                              <div className="flex gap-[8px] flex-1 items-center font-['Mulish',sans-serif] font-normal text-[13px]">
                                <p className="text-[#71859b]">DOB</p>
                                <p className="text-[#231f20]">{nomineeDob}</p>
                              </div>
                              <svg className="size-[14px]" fill="none" viewBox="0 0 10.5 11.375">
                                <path d={nomineeFormSvgPaths.p3c25e700} fill="#231F20" />
                              </svg>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px]">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                          <p className="text-[#231f20]">Address</p>
                          <p className="text-[#e8402f]">*</p>
                        </div>
                        <button onClick={handleOpenNomineeAddressModal} className="flex gap-[4px] items-center hover:opacity-70 transition-opacity">
                          <svg className="size-[14px]" fill="none" viewBox="0 0 10.9379 10.9374">
                            <path d={nomineeFormSvgPaths.p2f5a1780} fill="#93161E" />
                          </svg>
                          <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#93161e] text-[12px]">Edit</p>
                        </button>
                      </div>
                      <div className="bg-[#f5f5f5] rounded-[8.75px] border border-[#e5e5e6] relative">
                        <div className="flex items-center px-[14px] py-[14px]">
                          <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] text-[#5a6b7d] flex-1 overflow-hidden text-ellipsis">{nomineeAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Empty spacer for layout - maintains 3-column grid alignment */}
                    <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] opacity-0 pointer-events-none"></div>

                    {/* Guardian Details - Only shown for minor nominees */}
                    {nomineeIsMinor === 'yes' && (
                      <>
                        {/* Divider Line */}
                        <div className="h-0 relative w-full">
                          <div className="absolute inset-[-1px_0]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1168 2">
                              <path d="M0 1H1168" stroke="#E5E5E6" strokeWidth="2" />
                            </svg>
                          </div>
                        </div>

                        {/* Guardian Details Header */}
                        <div className="flex flex-col font-['Mulish',sans-serif] font-medium gap-[4px] items-start justify-center w-full">
                          <p className="h-[22px] leading-[24px] overflow-hidden text-[#231f20] text-[16px] text-ellipsis w-full whitespace-nowrap">Guardian Details</p>
                          <p className="leading-[21px] text-[#435160] text-[14px] w-full">Required for Minor nominees</p>
                        </div>

                        {/* Guardian Name */}
                        <div className="flex flex-col gap-[4px] flex-1 min-w-[310px]">
                          <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                            <p className="text-[#231f20]">Guardian Name</p>
                            <p className="text-[#e8402f]">*</p>
                          </div>
                          <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] relative">
                            <input
                              type="text"
                              value={guardianName}
                              onChange={(e) => setGuardianName(e.target.value)}
                              className="w-full h-full px-[14px] rounded-[8px] font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] outline-none"
                            />
                          </div>
                        </div>

                        {/* Guardian Address */}
                        <div className="flex flex-col gap-[4px] flex-1 min-w-[310px]">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                              <p className="text-[#231f20]">Address</p>
                              <p className="text-[#e8402f]">*</p>
                            </div>
                            <button onClick={handleOpenGuardianAddressModal} className="flex gap-[4px] items-center hover:opacity-70 transition-opacity">
                              <svg className="size-[14px]" fill="none" viewBox="0 0 10.9379 10.9374">
                                <path d={nomineeFormSvgPaths.p2f5a1780} fill="#93161E" />
                              </svg>
                              <p className="font-['Mulish',sans-serif] font-normal leading-[18px] text-[#93161e] text-[12px]">Edit</p>
                            </button>
                          </div>
                          <div className="bg-[#f5f5f5] rounded-[8.75px] border border-[#e5e5e6] relative">
                            <div className="flex items-center px-[14px] py-[14px]">
                              <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] text-[#5a6b7d] flex-1 overflow-hidden text-ellipsis">{guardianAddress}</p>
                            </div>
                          </div>
                        </div>

                        {/* Empty spacer for layout - maintains 3-column grid alignment */}
                        <div className="flex flex-col gap-[4px] flex-1 min-w-[310px] opacity-0 pointer-events-none"></div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Mobile/Tablet */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.12)] flex flex-col gap-[12px] p-[16px] md:p-[20px] z-30 lg:hidden">
          {isEditMode ? (
            <>
              <p
                onClick={() => {
                  if (!canProceed) {
                    return;
                  }
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentStep('upload-documents');
                    setTimeout(() => setIsTransitioning(false), 50);
                  }, 300);
                }}
                className={`font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[13px] text-left ${canProceed ? 'text-[#e8402f] cursor-pointer hover:underline' : 'text-[#b7b7b8] cursor-not-allowed'}`}
              >
                Next: Upload Documents
              </p>
              <div className="flex gap-[12px] items-center w-full">
                <button
                  onClick={() => {
                    if (!canProceed) {
                      return;
                    }
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentStep('review-confirm');
                      setIsEditMode(false);
                      setTimeout(() => setIsTransitioning(false), 50);
                    }, 300);
                  }}
                  disabled={!canProceed}
                  className="flex-1 h-[44px] md:h-[36px] rounded-[8px] flex items-center justify-center gap-[8px] transition-colors bg-[#93161e] hover:bg-[#7a1319] disabled:bg-[#e5e5e6] disabled:hover:bg-[#e5e5e6] disabled:cursor-not-allowed"
                >
                  <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] text-white">Go to Review</p>
                  <div className="size-[16px]">
                    <svg className="size-full" fill="none" viewBox="0 0 12.0004 10.0006">
                      <path d={nomineeSvgPaths.p16866180} fill="white" />
                    </svg>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#5a6b7d] text-[13px] text-left">Next: Upload Documents</p>
              <div className="flex gap-[12px] items-center w-full">
                <button
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentStep('bank-details');
                      setTimeout(() => setIsTransitioning(false), 50);
                    }, 300);
                  }}
                  className="flex-1 h-[44px] md:h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center hover:border-[#c7aa7b] transition-colors"
                >
                  <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Previous</p>
                </button>
                <button
                  onClick={() => {
                    if (!canProceed) {
                      return;
                    }
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentStep('upload-documents');
                      setTimeout(() => setIsTransitioning(false), 50);
                    }, 300);
                  }}
                  disabled={!canProceed}
                  className="flex-1 h-[44px] md:h-[36px] rounded-[8px] flex items-center justify-center gap-[8px] transition-colors bg-[#93161e] hover:bg-[#7a1319] disabled:bg-[#e5e5e6] disabled:hover:bg-[#e5e5e6] disabled:cursor-not-allowed"
                >
                  <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[14px] text-white">Continue</p>
                  <div className="size-[16px]">
                    <svg className="size-full" fill="none" viewBox="0 0 12.0004 10.0006">
                      <path d={nomineeSvgPaths.p16866180} fill="white" />
                    </svg>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* DOB Picker Modal */}
      {showDobPicker && (
        <>
          {/* Backdrop + scroll container */}
          <div
            className={`fixed inset-0 backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)] z-40 overflow-y-auto transition-opacity duration-200 ease-out ${
              dobPickerAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleCloseDobPicker}
          >
          <div className="flex min-h-full items-center justify-center p-[20px]">
          {/* Modal */}
          <div className={`bg-white rounded-[16px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.12)] w-full max-w-[480px] flex flex-col transition-transform duration-200 ease-out overflow-hidden ${
            dobPickerAnimating ? 'scale-100' : 'scale-95'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-[24px] p-[24px]">
              {/* Header */}
              <div className="flex items-center justify-between w-full">
                <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#435160] text-[22px]">Select Date of Birth</p>
                <button
                  onClick={handleCloseDobPicker}
                  className="size-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-200 shrink-0"
                >
                  <svg className="size-full" fill="none" viewBox="0 0 15.0008 15.0008">
                    <path d={emailOtpSvgPaths.p3bbf7480} fill="#435160" />
                  </svg>
                </button>
              </div>

              {/* Date Selectors */}
              <div className="flex gap-[12px]">
                {/* Day */}
                <div className="flex-1 flex flex-col gap-[8px]">
                  <label className="font-['Mulish',sans-serif] font-normal text-[12px] text-[#231f20]">Day</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="bg-white h-[40px] rounded-[8px] border border-[#eee] px-[12px] font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] outline-none focus:border-[#c7aa7b]"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day.toString().padStart(2, '0')}>
                        {day.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Month */}
                <div className="flex-1 flex flex-col gap-[8px]">
                  <label className="font-['Mulish',sans-serif] font-normal text-[12px] text-[#231f20]">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-white h-[40px] rounded-[8px] border border-[#eee] px-[12px] font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] outline-none focus:border-[#c7aa7b]"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month.toString().padStart(2, '0')}>
                        {month.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div className="flex-1 flex flex-col gap-[8px]">
                  <label className="font-['Mulish',sans-serif] font-normal text-[12px] text-[#231f20]">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="bg-white h-[40px] rounded-[8px] border border-[#eee] px-[12px] font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] outline-none focus:border-[#c7aa7b]"
                  >
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveDob}
                className="bg-[#93161e] hover:bg-[#7a1319] h-[44px] rounded-[8px] flex items-center justify-center transition-colors"
              >
                <p className="font-['Mulish',sans-serif] font-normal text-[14px] text-white">Save</p>
              </button>
            </div>
          </div>
          </div>
          </div>
        </>
      )}

      {/* Nominee Address Edit Modal */}
      {showNomineeAddressModal && (
        <>
          {/* Backdrop + scroll container */}
          <div
            className={`fixed inset-0 backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)] z-40 overflow-y-auto transition-opacity duration-200 ease-out ${
              nomineeAddressModalAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleCloseNomineeAddressModal}
          >
          <div className="flex min-h-full items-center justify-center p-[20px]">
          {/* Modal */}
          <div className={`bg-white rounded-[16px] drop-shadow-[4px_4px_20px_rgba(0,0,0,0.12)] w-full max-w-[590px] flex flex-col transition-transform duration-200 ease-out ${
            nomineeAddressModalAnimating ? 'scale-100' : 'scale-95'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-[20px] md:gap-[24px] p-[20px] md:p-[32px]">
              {/* Header */}
              <div className="flex flex-col gap-[16px] items-start w-full">
                <div className="flex items-center justify-between w-full">
                  <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#435160] text-[22px]">Nominee Address</p>
                  <button
                    onClick={handleCloseNomineeAddressModal}
                    className="size-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-200 shrink-0"
                  >
                    <svg className="size-full" fill="none" viewBox="0 0 15.0008 15.0008">
                      <path d={emailOtpSvgPaths.p3bbf7480} fill="#435160" />
                    </svg>
                  </button>
                </div>
                <p className="font-['Mulish',sans-serif] font-normal leading-[22.5px] text-[#435160] text-[15px] w-full">Update the address details.</p>
              </div>

              {/* Same as Applicant's Address Option */}
              <div className="bg-white rounded-[8px] border border-[#eee] w-full">
                <div className="flex flex-col items-start justify-center p-[14px]">
                  <div className="flex gap-[8px] items-start w-full">
                    <button
                      onClick={() => setSameAsApplicant(!sameAsApplicant)}
                      className="shrink-0"
                    >
                      <div className={`bg-white rounded-[4px] size-[16px] border-[2.286px] flex items-center justify-center transition-colors ${
                        sameAsApplicant ? 'border-[#93161e]' : 'border-[#eee]'
                      }`}>
                        {sameAsApplicant && (
                          <svg className="size-[10px]" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#93161e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </button>
                    <div className="flex flex-col gap-[12px] flex-1">
                      <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#435160] text-[13px]">Same as applicant's address</p>
                      <p className="font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px]">{permanentAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manual Address Entry - Only shown when NOT same as applicant */}
              {!sameAsApplicant && (
                <div className="flex flex-col gap-[12px] items-start w-full">
                  {/* Search Bar */}
                  <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] w-full">
                    <div className="flex items-center gap-[8px] p-[14px] size-full">
                      <svg className="size-[14px]" fill="none" viewBox="0 0 11.3873 11.3873">
                        <path d={nomineeAddressSvgPaths.p1210c800} fill="#231F20" />
                      </svg>
                      <input
                        type="text"
                        value={nomineeAddressSearch}
                        onChange={(e) => setNomineeAddressSearch(e.target.value)}
                        placeholder="Search on google map"
                        className="flex-1 font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] placeholder:text-[#71859b] outline-none"
                      />
                    </div>
                  </div>

                  {/* Map Preview */}
                  <div className="bg-white rounded-[8px] border border-[#eee] w-full overflow-hidden">
                    <div className="flex flex-col items-start justify-center p-[12px]">
                      <div className="h-[177px] w-full relative overflow-hidden">
                        <img alt="Map preview" className="absolute h-full w-full object-cover" src={imgMapPreview} />
                      </div>
                    </div>
                  </div>

                  {/* Address Details Input */}
                  <div className="flex flex-col gap-[4px] w-full">
                    <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                      <p className="text-[#231f20]">Address Details</p>
                      <p className="text-[#e8402f]">*</p>
                    </div>
                    <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] w-full">
                      <div className="flex items-center gap-[8px] p-[14px] size-full">
                        <input
                          type="text"
                          value={nomineeAddressDetails}
                          onChange={(e) => setNomineeAddressDetails(e.target.value)}
                          className="flex-1 font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Suggestion Card */}
                  <div className="bg-white rounded-[8px] border border-[#eee] w-full">
                    <div className="flex flex-col gap-[8px] items-start justify-center p-[14px]">
                      <div className="flex gap-[8px] items-center w-full">
                        <svg className="size-[16px]" fill="none" viewBox="0 0 14 13.5">
                          <path d={nomineeAddressSvgPaths.p6bbd070} fill="#93161E" />
                        </svg>
                        <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px] overflow-hidden text-ellipsis whitespace-nowrap flex-1">MG Road, Mumbai</p>
                      </div>
                      <p className="font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px]">Ghatkopar East Mumbai, Maharashtra 400077</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-[24px] items-center w-full">
                <button
                  onClick={handleCloseNomineeAddressModal}
                  className="flex-1 h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center hover:border-[#c7aa7b] transition-colors"
                >
                  <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Cancel</p>
                </button>
                <button
                  onClick={handleSaveNomineeAddress}
                  className="flex-1 h-[36px] bg-[#93161e] hover:bg-[#7a1319] rounded-[8px] flex items-center justify-center transition-colors"
                >
                  <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-white text-[14px]">Save & Continue</p>
                </button>
              </div>
            </div>
          </div>
          </div>
          </div>
        </>
      )}

      {/* Guardian Address Edit Modal */}
      {showGuardianAddressModal && (
        <>
          {/* Backdrop + scroll container */}
          <div
            className={`fixed inset-0 backdrop-blur-[3px] bg-[rgba(35,31,32,0.5)] z-40 overflow-y-auto transition-opacity duration-200 ease-out ${
              guardianAddressModalAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleCloseGuardianAddressModal}
          >
          <div className="flex min-h-full items-center justify-center p-[20px]">
          {/* Modal */}
          <div className={`bg-white rounded-[16px] drop-shadow-[4px_4px_20px_rgba(0,0,0,0.12)] w-full max-w-[590px] flex flex-col transition-transform duration-200 ease-out ${
            guardianAddressModalAnimating ? 'scale-100' : 'scale-95'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-[20px] md:gap-[24px] p-[20px] md:p-[32px]">
              {/* Header */}
              <div className="flex flex-col gap-[16px] items-start w-full">
                <div className="flex items-center justify-between w-full">
                  <p className="font-['Mulish',sans-serif] font-medium leading-[33px] text-[#435160] text-[22px]">Guardian Address</p>
                  <button
                    onClick={handleCloseGuardianAddressModal}
                    className="size-[24px] flex items-center justify-center hover:opacity-70 transition-opacity duration-200 shrink-0"
                  >
                    <svg className="size-full" fill="none" viewBox="0 0 15.0008 15.0008">
                      <path d={emailOtpSvgPaths.p3bbf7480} fill="#435160" />
                    </svg>
                  </button>
                </div>
                <p className="font-['Mulish',sans-serif] font-normal leading-[22.5px] text-[#435160] text-[15px] w-full">Update the address details.</p>
              </div>

              {/* Same as Nominee Address Option */}
              <div className="bg-white rounded-[8px] border border-[#eee] w-full">
                <div className="flex flex-col items-start justify-center p-[14px]">
                  <div className="flex gap-[8px] items-start w-full">
                    <button
                      onClick={() => setSameAsNominee(!sameAsNominee)}
                      className="shrink-0"
                    >
                      <div className={`bg-white rounded-[4px] size-[16px] border-[2.286px] flex items-center justify-center transition-colors ${
                        sameAsNominee ? 'border-[#93161e]' : 'border-[#eee]'
                      }`}>
                        {sameAsNominee && (
                          <svg className="size-[10px]" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#93161e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </button>
                    <div className="flex flex-col gap-[12px] flex-1">
                      <p className="font-['Mulish',sans-serif] font-normal leading-[19.5px] text-[#435160] text-[13px]">Same as nominee address</p>
                      <p className="font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px]">{nomineeAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manual Address Entry - Only shown when NOT same as nominee */}
              {!sameAsNominee && (
                <div className="flex flex-col gap-[12px] items-start w-full">
                  {/* Search Bar */}
                  <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] w-full">
                    <div className="flex items-center gap-[8px] p-[14px] size-full">
                      <svg className="size-[14px]" fill="none" viewBox="0 0 11.3873 11.3873">
                        <path d={guardianAddressSvgPaths.p1210c800} fill="#231F20" />
                      </svg>
                      <input
                        type="text"
                        value={guardianAddressSearch}
                        onChange={(e) => setGuardianAddressSearch(e.target.value)}
                        placeholder="Search on google map"
                        className="flex-1 font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] placeholder:text-[#71859b] outline-none"
                      />
                    </div>
                  </div>

                  {/* Map Preview */}
                  <div className="bg-white rounded-[8px] border border-[#eee] w-full overflow-hidden">
                    <div className="flex flex-col items-start justify-center p-[12px]">
                      <div className="h-[177px] w-full relative overflow-hidden">
                        <img alt="Map preview" className="absolute h-full w-full object-cover" src={imgGuardianMapPreview} />
                      </div>
                    </div>
                  </div>

                  {/* Address Details Input */}
                  <div className="flex flex-col gap-[4px] w-full">
                    <div className="flex gap-[2px] font-['Mulish',sans-serif] font-normal leading-[18px] text-[12px]">
                      <p className="text-[#231f20]">Address Details</p>
                      <p className="text-[#e8402f]">*</p>
                    </div>
                    <div className="bg-white h-[36px] rounded-[8px] border border-[#eee] w-full">
                      <div className="flex items-center gap-[8px] p-[14px] size-full">
                        <input
                          type="text"
                          value={guardianAddressDetails}
                          onChange={(e) => setGuardianAddressDetails(e.target.value)}
                          className="flex-1 font-['Mulish',sans-serif] font-normal text-[13px] text-[#231f20] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Suggestion Card */}
                  <div className="bg-white rounded-[8px] border border-[#eee] w-full">
                    <div className="flex flex-col gap-[8px] items-start justify-center p-[14px]">
                      <div className="flex gap-[8px] items-center w-full">
                        <svg className="size-[16px]" fill="none" viewBox="0 0 14 13.5">
                          <path d={guardianAddressSvgPaths.p6bbd070} fill="#93161E" />
                        </svg>
                        <p className="font-['Mulish',sans-serif] font-medium leading-[21px] text-[#231f20] text-[14px] overflow-hidden text-ellipsis whitespace-nowrap flex-1">MG Road, Mumbai</p>
                      </div>
                      <p className="font-['Mulish',sans-serif] font-normal leading-[normal] text-[#231f20] text-[13px]">Ghatkopar East Mumbai, Maharashtra 400077</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-[24px] items-center w-full">
                <button
                  onClick={handleCloseGuardianAddressModal}
                  className="flex-1 h-[36px] rounded-[8px] border border-[#eee] flex items-center justify-center hover:border-[#c7aa7b] transition-colors"
                >
                  <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-[#435160] text-[14px]">Cancel</p>
                </button>
                <button
                  onClick={handleSaveGuardianAddress}
                  className="flex-1 h-[36px] bg-[#93161e] hover:bg-[#7a1319] rounded-[8px] flex items-center justify-center transition-colors"
                >
                  <p className="font-['Mulish',sans-serif] font-normal leading-[21px] text-white text-[14px]">Save & Continue</p>
                </button>
              </div>
            </div>
          </div>
          </div>
          </div>
        </>
      )}
    </>
  );
}
