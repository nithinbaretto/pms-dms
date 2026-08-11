import type { BranchOption } from "./types";

export const GST_DESCRIPTION =
  "Only the GST numbers you select here will be available for your billing. You can add or edit your GSTs later through our portal.";

export const GST_EMPTY_TITLE = "No GST Records Found";

export const GST_EMPTY_DESCRIPTION =
  "You can add GST details later through the portal after empanelment is completed";

/** Fallback branch options when pincode is missing or getBranchList fails. */
export const BRANCH_OPTIONS: BranchOption[] = [
  { id: "Mumbai - BKC", label: "Mumbai - BKC" },
  { id: "Mumbai - Andheri", label: "Mumbai - Andheri" },
  { id: "Delhi - Connaught Place", label: "Delhi - Connaught Place" },
  { id: "Bengaluru - MG Road", label: "Bengaluru - MG Road" },
];

export const GST_STATE_OPTIONS = [
  { code: "AN", label: "Andaman and Nicobar Islands" },
  { code: "AP", label: "Andhra Pradesh" },
  { code: "AR", label: "Arunachal Pradesh" },
  { code: "AS", label: "Assam" },
  { code: "BR", label: "Bihar" },
  { code: "CH", label: "Chandigarh" },
  { code: "CG", label: "Chhattisgarh" },
  { code: "DH", label: "Dadra and Nagar Haveli and Daman and Diu" },
  { code: "DL", label: "Delhi" },
  { code: "GA", label: "Goa" },
  { code: "GJ", label: "Gujarat" },
  { code: "HR", label: "Haryana" },
  { code: "HP", label: "Himachal Pradesh" },
  { code: "JK", label: "Jammu and Kashmir" },
  { code: "JH", label: "Jharkhand" },
  { code: "KA", label: "Karnataka" },
  { code: "KL", label: "Kerala" },
  { code: "LA", label: "Ladakh" },
  { code: "LD", label: "Lakshadweep" },
  { code: "MP", label: "Madhya Pradesh" },
  { code: "MH", label: "Maharashtra" },
  { code: "MN", label: "Manipur" },
  { code: "ML", label: "Meghalaya" },
  { code: "MZ", label: "Mizoram" },
  { code: "NL", label: "Nagaland" },
  { code: "OD", label: "Odisha" },
  { code: "PY", label: "Puducherry" },
  { code: "PB", label: "Punjab" },
  { code: "RJ", label: "Rajasthan" },
  { code: "SK", label: "Sikkim" },
  { code: "TN", label: "Tamil Nadu" },
  { code: "TS", label: "Telangana" },
  { code: "TR", label: "Tripura" },
  { code: "UP", label: "Uttar Pradesh" },
  { code: "UK", label: "Uttarakhand" },
  { code: "WB", label: "West Bengal" },
] as const;

export const MAX_GST_CERTIFICATE_BYTES = 2 * 1024 * 1024;

/** Backend labels for GST certificate upload-document payload. */
export const GST_CERTIFICATE_DOC_META = {
  documentName: "gstCertificate",
  documentType: "gstCertificate",
} as const;
