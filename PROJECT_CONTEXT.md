# Project Context and Implementation Guardrails

Last Updated: 2026-08-06
Status: Active implementation snapshot for contributors and coding agents

## 1) Project Overview

Project Name: Distributor Management System (DMS) - Digital Self-Empanelment Portal

Objective:
Deliver a web-based onboarding journey for distributor empanelment across PMS and AIF using API-driven validation, verification, and document workflows.

Current Runtime State:
- App entry is wired to the onboarding module.
- The application renders the full onboarding container (not a placeholder home screen).
- Flow selection is state-driven with product/entity variants configured in flow files.

## 2) Tech Stack (Current)

Frontend:
- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Zustand for onboarding state
- Radix UI primitives and shared UI component library under shared/ui

Networking and Data Access:
- API adapters under modules/onboarding/services
- Request wrappers support normal and CSRF-aware requests

## 3) Repository Structure (Authoritative)

Primary feature module:

src/modules/onboarding/
- container/ -> main orchestration container and step rendering
- flow/
  - flow configs per journey (PMS/AIF x Individual/NRI/Corporate)
  - config/steps.ts for base step order used by engine
  - engine/step-engine.ts for next/prev progression
  - getScreenForStep.ts for override resolution
  - screen.registry.ts for default screen mapping
- state/ -> Zustand onboarding store
- steps/ -> step-level UI and local logic
- overrides/ -> flow-specific screen overrides (currently AIF-specific overrides exist)
- services/ -> onboarding API integration clients
- types/ -> central onboarding state and step unions

Shared layer:

src/shared/
- styles/ -> global design tokens (tokens.css, tokens.ts, index.ts)
- ui/ -> reusable primitives/components
- constants/ and utils/

## 4) Flow Model (As Implemented)

Supported flow keys:
- pms-individual
- pms-nri
- pms-corporate
- aif-individual
- aif-nri
- aif-corporate

Current Step union in types:
1. entity-details
2. onboarding-method
3. verify-contact
4. personal-details
5. business-details
6. business-category
7. aprn-verification
8. otp-verification
9. bank-details
10. nominee-details
11. upload-documents
12. review-confirm

Engine behavior today:
- nextStep and prevStep use flow/config/steps.ts sequence.
- getNextStepWithRules currently delegates to linear sequencing (rules are not yet enforcing dynamic branching in engine).
- The container performs additional explicit branching for certain transitions (for example onboarding-method, verify-contact, and edit-to-review routes).

Flow config behavior today:
- getFlowConfig returns per-flow config objects.
- Flow configs declare steps, documents requirements, and optional screen overrides.
- AIF individual currently uses custom override screens for onboarding method, verify contact, business, and review.

## 5) Screen Resolution Contract

- Default screens are resolved through flow/screen.registry.ts.
- Step-level overrides are resolved by flow/getScreenForStep.ts using override keys.
- Contributors must keep step IDs and override keys synchronized to avoid silent fallback or undefined mappings.

## 6) State Contract (Zustand)

The onboarding store currently tracks:

Journey and flow:
- currentFlow
- currentStep
- isEditMode

Identity and onboarding metadata:
- pan, panNumber, leadId, applicationIds
- existingProductTypes, isExistingApplicant, isExistingDistributor
- businessCategory, productCategories
- empanelmentType, onboardingMethod

Verification and contact:
- aprnNumber, aprnStatus, arn
- inputEmail, inputMobile
- amfiMaskedEmail, amfiMaskedMobile
- emailVerified, mobileVerified
- emailVerifiedAt, mobileVerifiedAt
- otpAttempts, otpTimerSeconds, accountRestricted

Form/document state:
- personalDetails
- documentUploads.signatureUploaded
- documentUploads.photoUploaded
- bankDocuments.chequeUploaded

Store actions include:
- navigation actions (nextStep, prevStep, setStep)
- flow selection and metadata setters
- OTP and verification state management helpers
- document upload flag setters

## 7) API Integration Surface (Current)

Onboarding API client currently implements:
- validatePan
- checkPanInInternalDb
- verifyAprn
- validateAmfiContact
- sendOtp
- sendAmfiOtp
- verifyOtp
- verifyAmfiOtp
- saveBusinessDetails

Environment-aware endpoint strategy:
- Endpoints are resolved from VITE_PMS_* environment variables when provided.
- Fallback paths are derived from VITE_PMS_API_BASE_URL where applicable.

## 8) UI and Design System Notes

- Global design tokens are centralized under src/shared/styles.
- index.css imports tokens.css and applies app-wide typography/background/base styles.
- Onboarding-specific visual behavior should consume shared token variables rather than hardcoded one-off values when possible.

## 9) Known Implementation Gaps and Risk Flags

1. Rule engine maturity:
- Flow rules are not yet fully integrated into navigation decisions; engine is mostly linear today.

2. Step naming consistency:
- Multiple step identifiers are used across files (for example upload-documents vs document-upload and onboarding-method vs onboarding-type in config contexts).
- Any new work in flow/config/registry/overrides must preserve consistent naming or include explicit mapping.

3. Logic distribution:
- Container currently owns significant transition logic.
- Future refactors should move durable business branching into flow/rules and keep screens focused on rendering and local interaction.

## 10) Contributor Guardrails

Before adding or changing onboarding behavior:
1. Confirm target flow key and step IDs are present in types and flow config.
2. Keep state additions typed and explicit in onboarding-types and onboarding-store.
3. Place reusable branching decisions in flow engine/rules instead of embedding repeatedly in UI screens.
4. Keep API response normalization centralized in services/onboarding-api.ts.
5. Update this document in the same PR whenever architectural contracts change.

## 11) Local Development Commands

- npm install
- npm run dev
- npm run build
- npm run lint
- npm run preview

## 12) Source of Truth Priority

When there is a mismatch:
1. Confirmed business requirement
2. Current TypeScript contracts and runtime behavior
3. This document

If runtime behavior or contracts change, update this file immediately so it remains reliable onboarding context.