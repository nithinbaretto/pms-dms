/* eslint-disable react-hooks/set-state-in-effect */
import type { ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { NomineeDetailsScreen } from './NomineeDetailsScreen';

type NomineeStepProps = {
  onBack: () => void;
  onContinue: () => void;
  onGoToReview?: () => void;
  isEditMode?: boolean;
};

type NomineeErrors = {
  nomineeName?: string;
  nomineeRelationship?: string;
  nomineeIdType?: string;
  nomineeIdNumber?: string;
  nomineeAddress?: string;
  nomineeDob?: string;
  guardianName?: string;
  guardianAddress?: string;
};

type ApmiNomineePayload = {
  nomineeName: string;
  nomineeRelationship: string;
  nomineeIdType: string;
  nomineeIdNumber: string;
  nomineeMobile: string;
  nomineeEmail: string;
  nomineeAddress: string;
  nomineeDob: string;
  guardianName: string;
  guardianAddress: string;
};

const APPLICANT_PERMANENT_ADDRESS =
  'MG Road, Near Ghatkopar Metro Station Ghatkopar East Mumbai, Maharashtra 400077';

const APMI_NOMINEE: ApmiNomineePayload = {
  nomineeName: 'Rakesh Kumar',
  nomineeRelationship: 'Son',
  nomineeIdType: 'Aadhar',
  nomineeIdNumber: '1111 2222 3333',
  nomineeMobile: '9876543210',
  nomineeEmail: 'rakeshkumar43@gmail.com',
  nomineeAddress: 'MG Road, Near Ghatkopar Metro Station Ghatkopar East Mumbai, Maharashtra 400077',
  nomineeDob: '23/08/1993',
  guardianName: 'Nithin Sharma',
  guardianAddress: 'MG Road, Near Ghatkopar Metro Station Ghatkopar East Mumbai, Maharashtra 400077',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^\d{10}$/;

const parseDob = (value: string): Date | null => {
  const trimmed = value.trim();
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
};

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
};

const getAge = (dob: string): number | null => {
  const parsed = parseDob(dob);
  if (!parsed) {
    return null;
  }

  const now = new Date();
  const diffMs = now.getTime() - parsed.getTime();
  if (diffMs < 0) {
    return null;
  }

  return Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
};

const getSafeDobParts = (dob: string) => {
  const parsed = parseDob(dob);
  if (!parsed) {
    return {
      day: '01',
      month: '01',
      year: (new Date().getFullYear() - 18).toString(),
    };
  }

  return {
    day: parsed.getDate().toString().padStart(2, '0'),
    month: (parsed.getMonth() + 1).toString().padStart(2, '0'),
    year: parsed.getFullYear().toString(),
  };
};

const NomineeStep = ({ onBack, onContinue, onGoToReview, isEditMode: initialIsEditMode = false }: NomineeStepProps): ReactElement => {
  const [isEditMode, setIsEditMode] = useState(initialIsEditMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [nomineeOptIn, setNomineeOptIn] = useState<'undecided' | 'yes' | 'no'>('undecided');

  const [nomineeName, setNomineeName] = useState('');
  const [nomineeRelationship, setNomineeRelationship] = useState('');
  const [nomineeIdType, setNomineeIdType] = useState('Aadhar');
  const [nomineeIdNumber, setNomineeIdNumber] = useState('');
  const [nomineeMobile, setNomineeMobile] = useState('');
  const [nomineeEmail, setNomineeEmail] = useState('');
  const [nomineeAddress, setNomineeAddress] = useState('');
  const [nomineeDob, setNomineeDob] = useState('');

  const [guardianName, setGuardianName] = useState('');
  const [guardianAddress, setGuardianAddress] = useState('');

  const [sameAsApplicantAddress, setSameAsApplicantAddress] = useState(false);
  const [sameAsNomineeAddress, setSameAsNomineeAddress] = useState(false);

  const [showNomineeAddressModal, setShowNomineeAddressModal] = useState(false);
  const [showGuardianAddressModal, setShowGuardianAddressModal] = useState(false);
  const [nomineeAddressModalAnimating, setNomineeAddressModalAnimating] = useState(false);
  const [guardianAddressModalAnimating, setGuardianAddressModalAnimating] = useState(false);

  const [showDobPicker, setShowDobPicker] = useState(false);
  const [dobPickerAnimating, setDobPickerAnimating] = useState(false);
  const [selectedDay, setSelectedDay] = useState('01');
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedYear, setSelectedYear] = useState((new Date().getFullYear() - 18).toString());

  const [showProofDropdown, setShowProofDropdown] = useState(false);
  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);
  const proofDropdownRef = useRef<HTMLDivElement>(null);
  const relationshipDropdownRef = useRef<HTMLDivElement>(null);

  const [nomineeAddressSearch, setNomineeAddressSearch] = useState('');
  const [nomineeAddressDetails, setNomineeAddressDetails] = useState('');
  const [guardianAddressSearch, setGuardianAddressSearch] = useState('');
  const [guardianAddressDetails, setGuardianAddressDetails] = useState('');

  useEffect(() => {
    setIsEditMode(initialIsEditMode);
  }, [initialIsEditMode]);

  const isMinor = useMemo(() => {
    const age = getAge(nomineeDob);
    return age !== null && age < 18;
  }, [nomineeDob]);

  const nomineeOption: 'later' | 'now' = nomineeOptIn === 'yes' ? 'now' : 'later';
  const nomineeIsMinor: 'yes' | 'no' = isMinor ? 'yes' : 'no';

  const showAddressModal = showNomineeAddressModal || showGuardianAddressModal;
  const addressModalFor: 'nominee' | 'guardian' | null = showNomineeAddressModal
    ? 'nominee'
    : showGuardianAddressModal
      ? 'guardian'
      : null;

  void showAddressModal;
  void addressModalFor;
  void isTransitioning;

  const prefillFromApmi = () => {
    setNomineeName(APMI_NOMINEE.nomineeName);
    setNomineeRelationship(APMI_NOMINEE.nomineeRelationship);
    setNomineeIdType(APMI_NOMINEE.nomineeIdType);
    setNomineeIdNumber(APMI_NOMINEE.nomineeIdNumber);
    setNomineeMobile(APMI_NOMINEE.nomineeMobile);
    setNomineeEmail(APMI_NOMINEE.nomineeEmail);
    setNomineeAddress(APMI_NOMINEE.nomineeAddress);
    setNomineeAddressDetails(APMI_NOMINEE.nomineeAddress);
    setNomineeDob(APMI_NOMINEE.nomineeDob);

    const parts = getSafeDobParts(APMI_NOMINEE.nomineeDob);
    setSelectedDay(parts.day);
    setSelectedMonth(parts.month);
    setSelectedYear(parts.year);

    const age = getAge(APMI_NOMINEE.nomineeDob);
    if (age !== null && age < 18) {
      setGuardianName(APMI_NOMINEE.guardianName);
      setGuardianAddress(APMI_NOMINEE.guardianAddress);
      setGuardianAddressDetails(APMI_NOMINEE.guardianAddress);
    }
  };

  useEffect(() => {
    if (nomineeOptIn !== 'undecided') {
      return;
    }

    setNomineeOptIn('yes');
    prefillFromApmi();
  }, [nomineeOptIn]);

  useEffect(() => {
    if (!isMinor) {
      setGuardianName('');
      setGuardianAddress('');
      setGuardianAddressDetails('');
      setSameAsNomineeAddress(false);
      return;
    }

    if (sameAsNomineeAddress) {
      setGuardianAddress(nomineeAddress);
      setGuardianAddressDetails(nomineeAddress);
    }
  }, [isMinor, nomineeAddress, sameAsNomineeAddress]);

  useEffect(() => {
    if (!sameAsApplicantAddress) {
      return;
    }

    setNomineeAddress(APPLICANT_PERMANENT_ADDRESS);
    setNomineeAddressDetails(APPLICANT_PERMANENT_ADDRESS);
  }, [sameAsApplicantAddress]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        showProofDropdown &&
        proofDropdownRef.current &&
        !proofDropdownRef.current.contains(target)
      ) {
        setShowProofDropdown(false);
      }

      if (
        showRelationshipDropdown &&
        relationshipDropdownRef.current &&
        !relationshipDropdownRef.current.contains(target)
      ) {
        setShowRelationshipDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showProofDropdown, showRelationshipDropdown]);

  const buildRequiredErrors = useCallback((): NomineeErrors => {
    const nextErrors: NomineeErrors = {};

    if (nomineeOptIn !== 'yes') {
      return nextErrors;
    }

    if (!nomineeName.trim()) {
      nextErrors.nomineeName = 'Nominee name is required.';
    }
    if (!nomineeRelationship.trim()) {
      nextErrors.nomineeRelationship = 'Relationship with applicant is required.';
    }
    if (!nomineeIdType.trim()) {
      nextErrors.nomineeIdType = 'Proof of identity is required.';
    }
    if (!nomineeIdNumber.trim()) {
      nextErrors.nomineeIdNumber = 'Proof number is required.';
    }
    if (!nomineeDob.trim() || parseDob(nomineeDob) === null) {
      nextErrors.nomineeDob = 'Date of birth is required.';
    }
    if (!nomineeAddress.trim()) {
      nextErrors.nomineeAddress = 'Nominee address is required.';
    }

    if (isMinor) {
      if (!guardianName.trim()) {
        nextErrors.guardianName = 'Guardian name is required for minor nominees.';
      }
      if (!guardianAddress.trim()) {
        nextErrors.guardianAddress = 'Guardian address is required for minor nominees.';
      }
    }

    return nextErrors;
  }, [
    nomineeOptIn,
    nomineeName,
    nomineeRelationship,
    nomineeIdType,
    nomineeIdNumber,
    nomineeDob,
    nomineeAddress,
    isMinor,
    guardianName,
    guardianAddress,
  ]);

  const hasOptionalError = useMemo(() => {
    if (nomineeOptIn !== 'yes') {
      return false;
    }

    const mobileValid = nomineeMobile.trim() === '' || MOBILE_PATTERN.test(nomineeMobile.trim());
    const emailValid = nomineeEmail.trim() === '' || EMAIL_PATTERN.test(nomineeEmail.trim());
    return !mobileValid || !emailValid;
  }, [nomineeEmail, nomineeMobile, nomineeOptIn]);

  const isFormValid = useMemo(() => {
    if (nomineeOptIn !== 'yes') {
      return true;
    }

    const requiredErrors = buildRequiredErrors();
    return Object.keys(requiredErrors).length === 0 && !hasOptionalError;
  }, [buildRequiredErrors, hasOptionalError, nomineeOptIn]);

  const canProceed = nomineeOption === 'later' || isFormValid;

  const validateForContinue = (): boolean => {
    if (nomineeOptIn !== 'yes') {
      return true;
    }

    const requiredErrors = buildRequiredErrors();

    if (Object.keys(requiredErrors).length > 0) {
      return false;
    }

    return !hasOptionalError;
  };

  const handleSetNomineeOption = (option: 'later' | 'now') => {
    const nextOptIn = option === 'now' ? 'yes' : 'no';
    setNomineeOptIn(nextOptIn);

    if (nextOptIn === 'no') {
      return;
    }

    if (!nomineeName && nomineeOptIn === 'undecided') {
      prefillFromApmi();
    }
  };

  const handleSetNomineeName = (value: string) => {
    setNomineeName(value);
  };

  const handleSetNomineeRelationship = (value: string) => {
    setNomineeRelationship(value);
  };

  const handleSetNomineeProofType = (value: string) => {
    setNomineeIdType(value);
  };

  const handleSetNomineeProofNumber = (value: string) => {
    setNomineeIdNumber(value);
  };

  const handleSetNomineeMobile = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setNomineeMobile(digitsOnly);
  };

  const handleSetNomineeEmail = (value: string) => {
    setNomineeEmail(value.trimStart());
  };

  const handleSetNomineeIsMinor = (value: 'yes' | 'no') => {
    const now = new Date();

    if (value === 'yes') {
      const currentAge = getAge(nomineeDob);
      if (currentAge === null || currentAge >= 18) {
        const forcedMinorDate = new Date(now.getFullYear() - 17, 0, 1);
        setNomineeDob(formatDate(forcedMinorDate));
        setSelectedDay('01');
        setSelectedMonth('01');
        setSelectedYear((now.getFullYear() - 17).toString());
      }
      return;
    }

    const currentAge = getAge(nomineeDob);
    if (currentAge === null || currentAge < 18) {
      const forcedAdultDate = new Date(now.getFullYear() - 18, 0, 1);
      setNomineeDob(formatDate(forcedAdultDate));
      setSelectedDay('01');
      setSelectedMonth('01');
      setSelectedYear((now.getFullYear() - 18).toString());
    }
  };

  const handleSetGuardianName = (value: string) => {
    setGuardianName(value);
  };

  const handleOpenDobPicker = () => {
    const parts = getSafeDobParts(nomineeDob);
    setSelectedDay(parts.day);
    setSelectedMonth(parts.month);
    setSelectedYear(parts.year);
    setShowDobPicker(true);
    setTimeout(() => setDobPickerAnimating(true), 10);
  };

  const handleCloseDobPicker = () => {
    setDobPickerAnimating(false);
    setTimeout(() => setShowDobPicker(false), 200);
  };

  const handleSaveDob = () => {
    const nextDob = `${selectedDay}/${selectedMonth}/${selectedYear}`;
    setNomineeDob(nextDob);
    handleCloseDobPicker();
  };

  const handleOpenNomineeAddressModal = () => {
    setNomineeAddressSearch('');
    setNomineeAddressDetails(nomineeAddress || APPLICANT_PERMANENT_ADDRESS);
    setShowNomineeAddressModal(true);
    setTimeout(() => setNomineeAddressModalAnimating(true), 10);
  };

  const handleCloseNomineeAddressModal = () => {
    setNomineeAddressModalAnimating(false);
    setTimeout(() => setShowNomineeAddressModal(false), 200);
  };

  const handleSaveNomineeAddress = () => {
    const resolved = sameAsApplicantAddress
      ? APPLICANT_PERMANENT_ADDRESS
      : nomineeAddressDetails.trim() || nomineeAddressSearch.trim() || nomineeAddress;

    if (resolved.trim()) {
      setNomineeAddress(resolved.trim());
      setNomineeAddressDetails(resolved.trim());
    }

    if (sameAsNomineeAddress && isMinor) {
      setGuardianAddress(resolved.trim());
      setGuardianAddressDetails(resolved.trim());
    }

    handleCloseNomineeAddressModal();
  };

  const handleOpenGuardianAddressModal = () => {
    setGuardianAddressSearch('');
    setGuardianAddressDetails(guardianAddress || nomineeAddress || APPLICANT_PERMANENT_ADDRESS);
    setShowGuardianAddressModal(true);
    setTimeout(() => setGuardianAddressModalAnimating(true), 10);
  };

  const handleCloseGuardianAddressModal = () => {
    setGuardianAddressModalAnimating(false);
    setTimeout(() => setShowGuardianAddressModal(false), 200);
  };

  const handleSaveGuardianAddress = () => {
    const resolved = sameAsNomineeAddress
      ? nomineeAddress
      : guardianAddressDetails.trim() || guardianAddressSearch.trim() || guardianAddress;

    if (resolved.trim()) {
      setGuardianAddress(resolved.trim());
      setGuardianAddressDetails(resolved.trim());
    }

    handleCloseGuardianAddressModal();
  };

  const setCurrentStep = (step: string) => {
    if (step === 'bank-details') {
      onBack();
      return;
    }

    if (!validateForContinue()) {
      return;
    }

    if (step === 'review-confirm') {
      if (onGoToReview) {
        onGoToReview();
      } else {
        onContinue();
      }
      return;
    }

    if (step === 'upload-documents') {
      onContinue();
    }
  };

  return (
    <NomineeDetailsScreen
      nomineeOption={nomineeOption}
      setNomineeOption={handleSetNomineeOption}
      nomineeName={nomineeName}
      setNomineeName={handleSetNomineeName}
      nomineeRelationship={nomineeRelationship}
      setNomineeRelationship={handleSetNomineeRelationship}
      nomineeProofType={nomineeIdType}
      setNomineeProofType={handleSetNomineeProofType}
      nomineeProofNumber={nomineeIdNumber}
      setNomineeProofNumber={handleSetNomineeProofNumber}
      nomineeMobileCountry={'+91 (IND)'}
      nomineeMobile={nomineeMobile}
      setNomineeMobile={handleSetNomineeMobile}
      nomineeEmail={nomineeEmail}
      setNomineeEmail={handleSetNomineeEmail}
      nomineeIsMinor={nomineeIsMinor}
      setNomineeIsMinor={handleSetNomineeIsMinor}
      nomineeDob={nomineeDob}
      nomineeAddress={nomineeAddress}
      guardianName={guardianName}
      setGuardianName={handleSetGuardianName}
      guardianAddress={guardianAddress}
      showProofDropdown={showProofDropdown}
      setShowProofDropdown={setShowProofDropdown}
      proofDropdownRef={proofDropdownRef}
      showRelationshipDropdown={showRelationshipDropdown}
      setShowRelationshipDropdown={setShowRelationshipDropdown}
      relationshipDropdownRef={relationshipDropdownRef}
      showDobPicker={showDobPicker}
      dobPickerAnimating={dobPickerAnimating}
      selectedDay={selectedDay}
      setSelectedDay={setSelectedDay}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
      handleOpenDobPicker={handleOpenDobPicker}
      handleCloseDobPicker={handleCloseDobPicker}
      handleSaveDob={handleSaveDob}
      showNomineeAddressModal={showNomineeAddressModal}
      nomineeAddressModalAnimating={nomineeAddressModalAnimating}
      sameAsApplicant={sameAsApplicantAddress}
      setSameAsApplicant={setSameAsApplicantAddress}
      nomineeAddressSearch={nomineeAddressSearch}
      setNomineeAddressSearch={setNomineeAddressSearch}
      nomineeAddressDetails={nomineeAddressDetails}
      setNomineeAddressDetails={setNomineeAddressDetails}
      permanentAddress={APPLICANT_PERMANENT_ADDRESS}
      handleOpenNomineeAddressModal={handleOpenNomineeAddressModal}
      handleCloseNomineeAddressModal={handleCloseNomineeAddressModal}
      handleSaveNomineeAddress={handleSaveNomineeAddress}
      showGuardianAddressModal={showGuardianAddressModal}
      guardianAddressModalAnimating={guardianAddressModalAnimating}
      sameAsNominee={sameAsNomineeAddress}
      setSameAsNominee={setSameAsNomineeAddress}
      guardianAddressSearch={guardianAddressSearch}
      setGuardianAddressSearch={setGuardianAddressSearch}
      guardianAddressDetails={guardianAddressDetails}
      setGuardianAddressDetails={setGuardianAddressDetails}
      handleOpenGuardianAddressModal={handleOpenGuardianAddressModal}
      handleCloseGuardianAddressModal={handleCloseGuardianAddressModal}
      handleSaveGuardianAddress={handleSaveGuardianAddress}
      isEditMode={isEditMode}
      isTransitioning={isTransitioning}
      canProceed={canProceed}
      setIsTransitioning={setIsTransitioning}
      setCurrentStep={setCurrentStep}
      setIsEditMode={setIsEditMode}
    />
  );
};

export default NomineeStep;
