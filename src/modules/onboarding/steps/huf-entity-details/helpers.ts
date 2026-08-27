import { MOCK_PERSONAL_DETAILS } from "../personal-details/constants";
import type { Address } from "../personal-details/types";
import { MOCK_KARTA_SUCCESS_PAN, PAN_REGEX } from "./constants";
import type { CoparcenerDetails, KartaDetails, SignatoryDetails } from "./types";

export const createSignatoryId = (): string =>
  `signatory-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createSignatoryFromKarta = (karta: KartaDetails): SignatoryDetails => ({
  id: createSignatoryId(),
  source: "karta",
  sourceId: karta.pan,
  name: karta.name,
  pan: karta.pan,
  mobile: karta.mobile,
  email: karta.email,
  identityDocument: karta.identityDocument,
  addressDocument: karta.addressDocument,
  signatureDocument: null,
});

export const createSignatoryFromCoparcener = (coparcener: CoparcenerDetails): SignatoryDetails => ({
  id: createSignatoryId(),
  source: "coparcener",
  sourceId: coparcener.id,
  name: coparcener.name,
  pan: coparcener.pan,
  mobile: "",
  email: "",
  identityDocument: null,
  addressDocument: null,
  signatureDocument: null,
});

export const createEmptyOtherSignatory = (): SignatoryDetails => ({
  id: createSignatoryId(),
  source: "other",
  sourceId: createSignatoryId(),
  name: "",
  pan: "",
  mobile: "",
  email: "",
  identityDocument: null,
  addressDocument: null,
  signatureDocument: null,
});

export const emptyAddress = (): Address => ({
  lat: 0,
  lng: 0,
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
});

export const formatAddressLine = (address: Address): string => {
  const parts = [address.addressLine, address.city, address.state, address.pincode]
    .map((part) => part.trim())
    .filter(Boolean);

  if (!address.city.trim() && !address.state.trim() && !address.pincode.trim()) {
    return address.addressLine.trim();
  }

  return parts.join(", ");
};

export const isValidPan = (value: string): boolean => PAN_REGEX.test(value.trim().toUpperCase());

export const isValidIndividualPan = (value: string): boolean => {
  const pan = value.trim().toUpperCase();
  return isValidPan(pan) && pan.charAt(3) === "P";
};

export const formatMobileDisplay = (mobile: string): string => {
  const digits = mobile.replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  return `+91 ${digits}`;
};

export const getApplicantAddress = (): Address => MOCK_PERSONAL_DETAILS.permanentAddress;

export const createFetchedKarta = (pan: string): KartaDetails => ({
  name: "Prakash Sharma",
  pan: pan.trim().toUpperCase(),
  mobile: "9876543210",
  email: "nithinsharma44@gmail.com",
  permanentAddress: {
    lat: 12.9352,
    lng: 77.6245,
    addressLine: "123, MG Road, brigade road, Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560012",
  },
  correspondenceAddress: {
    lat: 12.9352,
    lng: 77.6245,
    addressLine: "123, MG Road, brigade road, Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560012",
  },
  source: "fetched",
  proofOfIdentityType: "PAN",
  proofOfIdentityNumber: pan.trim().toUpperCase(),
  identityDocument: null,
  addressDocument: null,
  sameAsApplicantAddress: false,
  sameAsPermanentAddress: true,
});

export const createEmptyManualKarta = (pan: string): KartaDetails => ({
  name: "",
  pan: pan.trim().toUpperCase(),
  mobile: "",
  email: "",
  permanentAddress: emptyAddress(),
  correspondenceAddress: emptyAddress(),
  source: "manual",
  proofOfIdentityType: "PAN",
  proofOfIdentityNumber: pan.trim().toUpperCase(),
  identityDocument: null,
  addressDocument: null,
  sameAsApplicantAddress: false,
  sameAsPermanentAddress: false,
});

export const shouldMockFetchSucceed = (pan: string): boolean => {
  return pan.trim().toUpperCase() === MOCK_KARTA_SUCCESS_PAN;
};
