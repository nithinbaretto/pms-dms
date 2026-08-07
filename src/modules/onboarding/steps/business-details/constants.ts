import type { BranchOption, GstRecord } from "./types";

export const GST_DESCRIPTION =
  "Only the GST numbers you select here will be available for your billing. You can add or edit your GSTs later through our portal.";

export const GST_EMPTY_TITLE = "No GST Records Found";

export const GST_EMPTY_DESCRIPTION =
  "You can add GST details later through the portal after empanelment is completed";

export const MOCK_GST_RECORDS: GstRecord[] = [
  {
    id: "gst-1",
    gstNumber: "27AAAAA0000A1Z5",
    stateCode: "MH",
    legalName: "Nexus Private Limited",
    selected: true,
  },
  {
    id: "gst-2",
    gstNumber: "29ABCDE0000B2X6",
    stateCode: "KA",
    legalName: "Nexus Private Limited",
    selected: false,
  },
  {
    id: "gst-3",
    gstNumber: "10FGHIJ0000C3Y7",
    stateCode: "AP",
    legalName: "Nexus Private Limited",
    selected: false,
  },
  {
    id: "gst-4",
    gstNumber: "32KLMNO0000D4Z8",
    stateCode: "KL",
    legalName: "Nexus Private Limited",
    selected: false,
  },
  {
    id: "gst-5",
    gstNumber: "05PQRST0000E5A9",
    stateCode: "MH",
    legalName: "Nexus Private Limited",
    selected: false,
  },
  {
    id: "gst-6",
    gstNumber: "18UVVXY0000F6B0",
    stateCode: "TN",
    legalName: "Nexus Private Limited",
    selected: false,
  },
  {
    id: "gst-7",
    gstNumber: "21ZABCD0000G7C1",
    stateCode: "ND",
    legalName: "Nexus Private Limited",
    selected: false,
  },
  {
    id: "gst-8",
    gstNumber: "14EFGHI0000H8D2",
    stateCode: "AP",
    legalName: "Nexus Private Limited",
    selected: false,
  },
  {
    id: "gst-9",
    gstNumber: "05PQRST0000E5A9",
    stateCode: "MH",
    legalName: "Nexus Private Limited",
    selected: false,
  },
];

export const BRANCH_OPTIONS: BranchOption[] = [
  { id: "mumbai-1", label: "Mumbai - BKC" },
  { id: "mumbai-2", label: "Mumbai - Andheri" },
  { id: "delhi-1", label: "Delhi - Connaught Place" },
  { id: "bengaluru-1", label: "Bengaluru - MG Road" },
];
