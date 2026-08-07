# DMS Digital Self-Empanelment Portal

Frontend application for the Distributor Management System (DMS) digital onboarding journey across PMS and AIF product onboarding variants.

## Objective

Build a web-based, API-driven onboarding experience for distributor empanelment across products like PMS and AIF.

## Current Implementation State

- App entry renders the onboarding container directly.
- Multi-step onboarding screens are implemented and routed via flow/state configuration.
- Product and entity variants are configured through flow config files.
- API integrations are wired through onboarding service adapters.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Zustand
- Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm 10+

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

For sub-path deployments (for example, serving the app at `/dms-ui/`), set a base path at build time:

```powershell
$env:VITE_BASE_PATH='/dms-ui'; npm run build
```

```bash
VITE_BASE_PATH=/dms-ui npm run build
```

For Docker image builds, pass the same value as a build argument:

```bash
docker build --build-arg VITE_BASE_PATH=/dms-ui -t icici-prudential .
```

### Lint

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## Architecture Guardrails

- Keep step IDs and flow override keys consistent across types/config/registry/overrides.
- Keep API normalization in the onboarding services layer.
- Keep onboarding state strictly typed in shared onboarding types and store contracts.
- Keep reusable branching logic in flow engine/rules rather than duplicating in screens.

## Supported Flows

- pms-individual
- pms-nri
- pms-corporate
- aif-individual
- aif-nri
- aif-corporate

## Current Step Contract

1. `entity-details`
2. `onboarding-method`
3. `verify-contact`
4. `personal-details`
5. `business-details`
6. `business-category`
7. `aprn-verification`
8. `otp-verification`
9. `bank-details`
10. `nominee-details`
11. `upload-documents`
12. `review-confirm`

## API Integration Surface

The onboarding API client currently supports:

- PAN validation and internal PAN checks
- APRN verification
- AMFI contact validation
- OTP send/verify for standard and AMFI channels
- Business category persistence

Endpoints can be configured through `VITE_PMS_*` env variables, with fallback routing via `VITE_PMS_API_BASE_URL`.

## Suggested Folder Pattern

```text
src/
  modules/onboarding/
    container/
    steps/
    flow/
      config/
      engine/
      rules/
    state/
    components/
    services/
    hooks/
  shared/
    ui/
    utils/
    constants/
```

## Reference

Project architecture and implementation constraints are defined in `PROJECT_CONTEXT.md`.
