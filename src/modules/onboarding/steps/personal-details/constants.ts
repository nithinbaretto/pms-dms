import type { EntityType, PersonalDetailsModel } from "./types";

export const ENTITY_TYPE_OPTIONS: EntityType[] = [
  "Individual",
  "Proprietorship",
  "Company",
  "Partnership",
  "LLP",
  "HUF",
  "Trust",
  "AOP",
];

export const OTP_LENGTH = 6;
export const OTP_RESEND_TIMER_SECONDS = 23;
export const OTP_MAX_ATTEMPTS = 3;

export const MOCK_PERSONAL_DETAILS: PersonalDetailsModel = {
  personalDetails: {
    name: "Rajesh Gupta",
    pan: "ELDHY6734A",
    dob: "21/02/1990",
    aprn: "APRN098765",
    entityType: "Individual",
    entityTypeLocked: true,
  },
  mobile: {
    value: "9876543210",
    verified: true,
  },
  email: {
    value: "username@domain.com",
    verified: false,
  },
  permanentAddress: {
    lat: 19.0858,
    lng: 72.908,
    addressLine: "MG Road, Near Ghatkopar Metro Station",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400077",
  },
  correspondenceAddress: {
    lat: 19.0858,
    lng: 72.908,
    addressLine: "MG Road, Near Ghatkopar Metro Station",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400077",
  },
  isCorrespoingSameAsPermanent: true,
};
