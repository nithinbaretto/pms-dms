export type BusinessDetailsMode = "selection" | "empty";

export type GstRecord = {
  id: string;
  gstNumber: string;
  stateCode: string;
  legalName: string;
  selected: boolean;
};

export type BranchOption = {
  id: string;
  label: string;
};
