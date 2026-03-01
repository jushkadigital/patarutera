# Problems - popup-auth-flow

Created: 2026-02-26

## QA Blocker (2026-02-26)

- E2E UI verification on `http://localhost:4000/pe` is blocked by an existing server-side runtime error: `TypeError: Cannot read properties of undefined (reading 'toLowerCase')` in `src/components/Subtitle.tsx:18`.
- Popup flow API endpoints were still verified via curl (login redirect, popup-callback HTML, medusa-sync redirect hardening).

## Critical Auth Flow Issue (2026-02-26)

- When the popup navigates from Keycloak (`https://auth.patarutera.pe`) back to `http://localhost:4000/api/auth/popup-callback`, `window.opener` is `null` on the callback page (verified via Playwright route interception).
- This breaks the current callback implementation which depends on `window.opener.postMessage(...)`.
- Fix plan: add a same-origin `BroadcastChannel` fallback keyed by `nonce` (callback posts to channel; opener listens and resolves), while keeping postMessage as a best-effort path.
