# Project Context and Implementation Guardrails

Last Updated: 2026-09-23
Status: Active implementation snapshot for contributors and coding agents

Read this file before changing onboarding behavior. It describes what the app actually does today. When TypeScript contracts or runtime branching change, update this file in the same change.

## 1) Project Overview

Project Name: Distributor Management System (DMS) — Digital Self-Empanelment Portal

Objective:
A web onboarding journey for distributor empanelment across PMS and AIF. The user validates PAN, chooses a product, verifies identity through APRN, ARN, KRA, or manual entry, then completes personal, entity, business, bank, nominee, document, and review steps. Review ends with application creation and e-sign.

Current runtime:
- `src/App.tsx` renders only `OnboardingContainer`. There is no other route.
- The live product choice is Individual only. After business category, the container sets `pms-individual` or `aif-individual`.
- NRI and Corporate flow config files exist, but nothing in the container selects those flow keys.
- Digilocker is a visible method option. Continue on it shows a placeholder alert and does not start a journey.

## 2) Tech Stack

Frontend:
- React 19 + TypeScript
- Vite 8 (`npm run dev` uses `--mode uat`)
- Tailwind CSS 4
- Zustand 5 for onboarding state (`src/modules/onboarding/state/onboarding-store.ts`)
- Radix UI primitives and shared components under `src/shared/ui`
- react-hook-form is installed. Step flows mostly keep local React state in `use*Flow` hooks.
- `@tanstack/react-query` and `react-router-dom` are dependencies. The running app does not use them.

Networking:
- `src/services/http/apiClient.ts` posts through `encryptedAxios`.
- JSON bodies are encrypted as `{ part1, part2 }` and responses are decrypted in the interceptor (`src/services/http/encryptedAxios.ts`, `src/enc.js`).
- These paths stay plaintext: document upload, file download, document OCR, and PDF generate.
- Onboarding calls live in `src/modules/onboarding/services/onboarding-api.ts`.
- Endpoint URLs come from `VITE_PMS_*` env vars. Missing vars fall back to paths under `VITE_PMS_API_BASE_URL`.

## 3) Repository Structure

`src/modules/onboarding/`
- `container/onboarding-container.tsx` — real orchestrator. It renders each step, calls early APIs, and owns most branching.
- `flow/` — flow keys, per-journey step lists, HUF skip helpers, a linear step engine, and a screen registry that the container mostly bypasses.
- `state/onboarding-store.ts` — Zustand store.
- `steps/` — the screens the container actually mounts. Each heavy step has a `use*Flow` hook, helpers, validation, and local types.
- `overrides/aif/` — alternate screens. The container uses the AIF onboarding-method override. The AMFI verify-contact override is only a fallback when the method is neither ARN nor KRA.
- `services/onboarding-api.ts` — request types, response normalization, and the `onboardingApi` client.
- `types/onboarding-types.ts` — `Step` union and store shape.
- `components/` — shared onboarding chrome (hero, OTP input, footer, slide transition, camera capture, upload picker).
- `screens/` — older screen wrappers registered in `flow/screen.registry.ts`. Do not treat them as the live UI unless the container imports them.

`src/shared/`
- `styles/` — design tokens (`tokens.css`, `tokens.ts`).
- `ui/` — reusable primitives.
- `constants/` and `utils/`.

`src/services/http/` — encrypted axios client.

## 4) What Is Live vs Scaffold

Live journeys the container can enter:
- `pms-individual` — user selected PMS, or PMS and AIF together.
- `aif-individual` — user selected AIF only (`resolveIndividualFlow` in the container).

Scaffolded and not selected at runtime:
- `pms-nri`, `pms-corporate`, `aif-nri`, `aif-corporate`.

Screen resolution today:
- The container switches on `currentStep` and mounts step components directly.
- `getScreenForStep` is used for `onboarding-method`, and for `verify-contact` only when the method is not ARN or KRA.
- `flow/screen.registry.ts` maps a different id, `document-upload`, while the live step id is `upload-documents`. Do not assume the registry is the screen the user sees.

## 5) Journey Map

Canonical step ids (`types/onboarding-types.ts` and `flow/config/steps.ts`):

1. `entity-details`
2. `business-category`
3. `onboarding-method`
4. `verify-contact`
5. `aprn-verification`
6. `otp-verification`
7. `personal-details`
8. `huf-entity-details` (only when personal entity type is HUF)
9. `business-details`
10. `bank-details`
11. `nominee-details`
12. `upload-documents`
13. `review-confirm`

`STEPS` in `flow/config/steps.ts` is the linear engine order. The container does not walk that list blindly. Product choice and onboarding method pick a different path.

### Shared start

1. `entity-details` — PAN entry. `validatePan`. On success, store PAN, lead id, existing-product flags, and any returned email/mobile, then go to `business-category`.
2. `business-category` — PMS, AIF, or both. `saveBusinessDetails` stores category and `applicationIds`. Then:
   - PMS, or PMS+AIF → flow `pms-individual`, next step `aprn-verification`.
   - AIF only → flow `aif-individual`, next step `onboarding-method`.

### PMS individual

`aprn-verification` → `otp-verification` → `personal-details` → (HUF step if applicable) → `business-details` → `bank-details` → `nominee-details` → `upload-documents` → `review-confirm`.

APRN calls `verifyAprn` and stores APRN status plus contact used for OTP. OTP back goes to `aprn-verification`.

### AIF individual

Onboarding method (`EmpanelmentType` is Distributor or RIA; method is ARN, KRA, Digilocker, or Manual):

- ARN → `ArnVerifyContactStep`. User enters ARN plus mobile or email. `validateArn`, then `sendOtp`, then `otp-verification`.
- KRA → `getPanDetailsByKra` first, then `KraVerifyContactStep`. User confirms the registered contact. `validateInputWithKra`, then `sendOtp`, then `otp-verification`.
- Manual → `updateManualData`, then jump straight to `personal-details`. No verify-contact and no entry OTP.
- Digilocker → placeholder alert. No navigation.

AIF ARN/KRA OTP back returns to `verify-contact`. OTP continue always goes to `personal-details`.

Entry OTP sets `emailVerifiedFromEntry` / `mobileVerifiedFromEntry`. Personal details treats those channels as already verified and locks them.

### After personal details

`savePersonalDetails` returns `nextInfoSection`. `mapNextInfoSectionToStep` can jump to business, bank, nominee, documents, or review.

Exception: if `entityType` is `HUF`, `resolveStepAfterPersonalDetails` always inserts `huf-entity-details` before that mapped step. The engine also skips `huf-entity-details` when the entity type is not HUF. If the store is not HUF and the step is still `huf-entity-details`, the container redirects to `business-details`.

## 6) Step Behavior

### Personal details

Hook: `steps/personal-details/usePersonalDetailsFlow.ts`.

- Loads `getPersonalDetails`, saves `savePersonalDetails`.
- Entity type comes from the API and is locked (`entityTypeLocked`). Options include Individual, Sole Proprietorship, Company, Partnership, LLP, HUF, Trust, AOP.
- Sole Proprietorship shows Contact Person Name and “same as distributor”. Save sends `contactPersonName` and `isContactPersonSameAsDistributor`.
- Addresses are permanent and correspondence, with a same-as-permanent flag. Address text is capped at 300 characters. Names are capped at 50.
- Changed email or mobile that was not verified at entry must be OTP-verified in the step modal before save.
- `dataSource` on save is `MANUAL` for the manual method, the stored KRA data source (or `KRA`) for the KRA method, and `APMI` otherwise, including the PMS APRN path.

### HUF entity details

Hook: `steps/huf-entity-details/useHufEntityDetailsFlow.ts`.

Shown only for entity type HUF, on both PMS and AIF.

- Karta: PAN check via `validateKarthaPanByAPMI`, then name, contact, addresses, and proof documents.
- Co-parceners and authorized signatories (jointly or any-N).
- Load `getEntityDetails`, save `saveEntityDetails`.
- Mappers: `steps/huf-entity-details/entity-api-mappers.ts`.
- Continue goes to `business-details`, or back to review in edit mode.

### Business details

Hook: `steps/business-details/useBusinessDetailsFlow.ts`.

- GST list: select existing numbers, add a manual GST, `validateGstIn`, upload a GST certificate (max 2MB).
- Branch: `getBranchList` by pincode from the address. Static `BRANCH_OPTIONS` are the fallback.
- Entity type on this step is only `Individual` or `Sole Proprietorship`.
- On `pms-individual`, that toggle is locked from the personal-details entity type.
- Authorized signatory (documents, jointly / any-N) shows only when personal entity type is Sole Proprietorship and the selected business entity type is Sole Proprietorship. Choosing Individual hides it.
- Save uses `saveGstDetails` and also persists `entityType`, `authSignatoryData`, `riaNumber`, `dataSource`, and `isRia`.

### Bank details

Hook: `steps/bank-details/useBankDetailsFlow.ts`. Screen: `BankDetailsScreen.tsx`.

- Load `getBankDetails`, save `saveBankDetails`.
- Verification paths: penny drop (`pennyDropCall` with account number and IFSC) and reverse penny drop (QR).
- Reverse penny drop: `initiateReversePennyDropPayment`, poll `getReversePennyDropValidationStatus`, then `fetchReversePennyDropBankDetails`. Default vendor is `VITE_PMS_REVERSE_PENNY_DROP_VENDOR` or `hyperverge`.
- Cancelled cheque upload, optional OCR via `documentOcr`.
- The container passes `chequeUploaded` through the store flag `bankDocuments.chequeUploaded`.

### Nominee

Hook: `steps/nominee/useNomineeFlow.ts`.

- Option `now` or `later`. Later skips the form and still continues.
- Fields: name, relationship, proof of identity, mobile, email, DOB, address. Address can match the applicant permanent address.
- A minor DOB reveals guardian name and address.
- `getNomineeDetails` / `saveNomineeDetails`.

### Upload documents

Hook: `steps/documents/useDocumentsFlow.ts`. Screen: `UploadDocumentsStep.tsx`.

Slots: photo, signature, proof of identity, proof of address.

- Photo and signature follow `flowConfig.documents` (`requiresPhoto`, `requiresSignature`). AIF individual also sets `requiresDueDiligenceDoc` and `requiresCheque` on the config object.
- Files: PNG, JPEG, or PDF, max 2MB. Camera capture and file picker both exist.
- Load `getUploadDocuments`, upload with `uploadDocument`, persist with `saveUploadedDocuments`.
- Backend labels are in `steps/documents/constants.ts` (`photo`, `signature`, `proofOfIdentity`, `proofOfAddress`).

### Review and submit

- Load `getApplicationReviewDetails`.
- PDF: `generatePdf`.
- Edit jumps back with `isEditMode: true` to personal, business, bank, nominee, or documents. Saving that step clears edit mode and returns to `review-confirm`.
- Submit (`steps/review/useReviewSubmitFlow.ts`): `createApplication`, then `createEsign` (opens `signUrl`), then `getEsignStatus`.

### OTP

`steps/otp-verification/OtpVerificationStep.tsx`.

- PMS APRN verifies both email and mobile when both exist.
- AIF ARN/KRA verifies the single channel captured on verify-contact.
- Failed attempts increment `otpAttempts`. The account can be marked restricted.
- Verified channels are stored with timestamps and the entry-verified flags.

## 7) State Contract

Store: `useOnboardingStore` in `state/onboarding-store.ts`. Shape: `OnboardingStateType`.

Journey:
- `currentFlow` (default `pms-individual`), `currentStep` (default `entity-details`), `isEditMode`

Identity:
- `pan`, `panNumber`, `leadId`, `applicationIds`
- `existingProductTypes`, `isExistingApplicant`, `isExistingDistributor`
- `businessCategory` (`AIF` | `PMS` | `PMS+AIF`), `productCategories`
- `empanelmentType` (`Distributor` | `RIA`, default Distributor)
- `onboardingMethod` (`ARN` | `KRA` | `DIGILOCKER` | `MANUAL`)

Verification:
- `aprnNumber`, `aprnStatus`, `arn`
- `kraArnStatus`, `kraDataSource`, `kraRegisteredEmail`, `kraRegisteredMobile`
- `inputEmail`, `inputMobile`, `amfiMaskedEmail`, `amfiMaskedMobile`
- `emailVerified`, `mobileVerified`, `emailVerifiedFromEntry`, `mobileVerifiedFromEntry`
- `emailVerifiedAt`, `mobileVerifiedAt`
- `otpAttempts`, `otpTimerSeconds`, `accountRestricted`

Forms:
- `personalDetails` (`PersonalDetailsModel` from the personal-details step)
- `documentUploads.signatureUploaded`, `documentUploads.photoUploaded`
- `bankDocuments.chequeUploaded`

Navigation actions `nextStep` / `prevStep` call the linear engine, which skips HUF when it does not apply. Most product branching uses `setStep` from the container or from a step’s `nextInfoSection` mapping. Do not add a new branch only inside a screen if the container already owns that transition.

## 8) API Surface

All methods are on `onboardingApi` in `services/onboarding-api.ts`. Keep response normalization there.

Identity and category:
- `validatePan`, `checkPanInInternalDb`, `saveBusinessDetails` (product category, not the GST screen)

PMS APRN:
- `verifyAprn`

AIF contact:
- `updateManualData`, `getPanDetailsByKra`, `validateInputWithKra`, `validateArn`
- `validateAmfiContact`, `sendAmfiOtp`, `verifyAmfiOtp` (AMFI fallback path)

OTP:
- `sendOtp`, `verifyOtp`

Personal and HUF:
- `getPersonalDetails`, `savePersonalDetails`
- `validateKarthaPanByAPMI`, `getEntityDetails`, `saveEntityDetails`

Business:
- `getBusinessDetails`, `getBranchList`, `getStates`, `validateGstIn`, `saveGstDetails`

Bank:
- `getBankDetails`, `pennyDropCall`, `saveBankDetails`
- `initiateReversePennyDropPayment`, `getReversePennyDropValidationStatus`, `fetchReversePennyDropBankDetails`

Nominee and documents:
- `getNomineeDetails`, `saveNomineeDetails`
- `getUploadDocuments`, `saveUploadedDocuments`, `uploadDocument`, `downloadFile`, `documentOcr`

Review:
- `getApplicationReviewDetails`, `createApplication`, `generatePdf`, `createEsign`, `getEsignStatus`

## 9) UI Notes

- Tokens live in `src/shared/styles`. `src/index.css` imports them.
- Early steps (PAN through OTP) use the hero layout: logo, hero copy, floating card, legal footer.
- Form steps (personal, HUF, business, bank, nominee, documents, review) use the wide form layout and hide the hero and legal footer.
- Step changes animate through `StepSlideTransition`.
- Prefer token variables over one-off colors when touching shared chrome. Existing step screens still contain many literal hex values; match the surrounding screen when editing it.

## 10) Known Gaps

1. Engine vs container.
   `getNextStepWithRules` only special-cases HUF. Product, method, OTP, edit-mode, and `nextInfoSection` branching live in the container and in step hooks.

2. Step id drift.
   Live id is `upload-documents`. Flow configs and the screen registry still say `document-upload`. Override lookup also knows `onboarding-type`, which is not the live step id `onboarding-method`. New flow work must use the `Step` union and map old ids explicitly.

3. NRI and Corporate configs are unused by the container.

4. Digilocker does not start a flow.

5. `checkPanInInternalDb` exists on the client and is not the PAN step’s current call. The PAN step uses `validatePan`.

## 11) Contributor Guardrails

1. Confirm the flow key (`pms-individual` or `aif-individual`) and the `Step` id before adding a screen.
2. Add new store fields to `onboarding-types.ts` and `onboarding-store.ts` together.
3. Put a new API call, and its response normalization, on `onboardingApi`.
4. If a transition depends on product, method, entity type, or edit mode, update the container (or the existing step-hook router) and this file. Do not hide that branch only inside JSX.
5. HUF insertion and Sole Proprietorship signatory visibility are entity-type rules. Do not duplicate them with a hardcoded flow key check unless the code already locks that behavior to `pms-individual` (business entity-type lock does).
6. Entry-verified email and mobile must stay locked on personal details. Do not clear `emailVerifiedFromEntry` / `mobileVerifiedFromEntry` except where OTP or method reset already does.
7. Edit mode must return to `review-confirm` after a successful save of the edited section.

## 12) Local Development

- `npm install`
- `npm run dev` (Vite, mode `uat`)
- `npm run dev:local`
- `npm run build`
- `npm run lint`
- `npm run preview`

## 13) Source of Truth

When sources disagree, trust them in this order:

1. Confirmed business requirement
2. Current TypeScript contracts and the container’s runtime branching
3. This document

If runtime behavior or contracts change, update this file in the same change.
