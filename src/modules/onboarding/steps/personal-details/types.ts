export type EntityType =
  | "Individual"
  | "Proprietorship"
  | "Company"
  | "Partnership"
  | "LLP"
  | "HUF"
  | "Trust"
  | "AOP";

export type VerificationChannel = "email" | "mobile";

export type VerificationStatus = {
  value: string;
  verified: boolean;
};

export type Address = {
  lat: number;
  lng: number;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
};

export type EntitySummary = {
  name: string;
  pan: string;
  dob: string;
  aprn: string;
  entityType: EntityType | "";
  entityTypeLocked: boolean;
};

export type PersonalDetailsModel = {
  personalDetails: EntitySummary;
  mobile: VerificationStatus;
  email: VerificationStatus;
  permanentAddress: Address;
  correspondenceAddress: Address;
};
