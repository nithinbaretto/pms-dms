import type {
  CreateApplicationResponse,
  ReviewDetailsResponse,
} from "../../services/onboarding-api";

export type ReviewSectionId = "personal" | "business" | "bank" | "nominee" | "documents";

export type { CreateApplicationResponse, ReviewDetailsResponse };
