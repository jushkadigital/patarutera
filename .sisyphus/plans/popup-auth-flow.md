# Popup-Based Authentication Flow with Keycloak + NextAuth

## TL;DR

> **Quick Summary**: Replace current redirect-based Keycloak auth flow with popup-based authentication using window.open() + postMessage, maintaining PKCE security and auto-closing the popup after successful login.
>
> **Deliverables**:
>
> - PKCE generator utility (code_verifier + code_challenge)
> - Popup auth hook (usePopupAuth) with postMessage communication
> - New popup-callback route handler
> - Hardened callbackUrl validation in medusa-sync route
> - Updated UI components (Topheader, LoginKeycloak) to use popup flow
> - Fallback mechanism for blocked popups
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: PKCE utils → Popup hook → popup-callback route → UI update

---

## Context

### Original Request

Implement popup-based authentication flow with Keycloak + NextAuth instead of traditional redirect-based flow, maintaining PKCE and auto-closing the popup after successful login.

### Interview Summary

**Key Discussions**:

- PKCE already enabled in NextAuth OAuth flow
- Current flow: `/api/auth/login` → redirect → `/api/auth/callback/keycloak` → session creation
- Medusa sync happens via middleware redirect
- Vitest + Storybook tests exist but minimal coverage (0.8%)
- User wants dedicated popup-callback route instead of reusing standardcallback

**Research Findings**:

- NextAuth v5 with Keycloak provider (`src/lib2/auth.ts`)
- Medusa cookie sync: `/api/auth/medusa-sync/route.ts` exchanges NextAuth accessToken → cookies
- PKCE patterns from MSAL Browser, Mattermost, Sprig implementations
- postMessage communication patterns with origin/source validation
- Popup window.open and close patterns

**User Decisions**:

1. **Incremental vs Full**: Full (new dedicated popup-callback route)
2. **PKCE owner**: NextAuth-managed (reusing existing OAuth flow)
3. **PKCE storage**: sessionStorage for code_verifier
4. **Medusa timing**: Only NextAuth in popup, Medusa after in opener
5. **Failover if popup blocked**: Fallback to traditional redirect
6. **Hardening scope**: Internal-to-same-origin only
7. **Tests**: No automated tests, QA scenarios only

### Metis Review

**Identified Gaps** (addressed):

- **Open redirect risk in medusa-sync**: Will harden callbackUrl validation to internal paths only (user decision)
- **PKCE storage**: Using sessionStorage as decided by user (not NextAuth cookies)
- **popup-callback message contract**: Will define nonce-based contract with origin/source validation
- **Fallback to traditional redirect**: Will implement as user requested
- **Promote popup-safe closing**: Will include "Close this window" UI fallback

---

## Work Objectives

### Core Objective

Replace redirect-based Keycloak authentication with popup-based flow using window.open() + postMessage, maintaining PKCE security and auto-closing popup after success.

### Concrete Deliverables

- `src/lib/pkce.ts` - PKCE code generator utilities
- `src/hooks/usePopupAuth.ts` - Client-side popup auth hook with postMessage handler
- `src/app/api/auth/popup-callback/route.ts` - New callback route handler
- `src/app/api/auth/medusa-sync/route.ts` - Hardened callbackUrl validation
- `src/components/Topheader.tsx` - Updated to use popup auth
- `src/components/LoginKeycloak.tsx` - Updated to use popup auth
- `src/app/api/auth/login/route.ts` - Fallback to traditional redirect

### Definition of Done

- [x] Popup opens successfully with Keycloak auth URL
- [ ] User authenticates in popup and popup closes after success
- [ ] Opener receives success message via postMessage
- [ ] NextAuth session is established after popup success
- [ ] Middleware triggers Medusa cookie sync on first request after popup closes
- [x] CallbackUrl validation blocks external redirects
- [x] Popup fallback to traditional redirect works when popup blocked
- [ ] All error scenarios handled (user cancel, timeout, Keycloak error)

### Must Have

- PKCE generation (code_verifier, code_challenge) using WebCrypto
- Windows.open() popup generation with proper dimensions
- postMessage communication with origin/source validation + nonce
- Auto-close popup after success (window.close() + UI fallback)
- Error handling: user cancelled, timeout (30s), Keycloak errors
- Fallback: traditional redirect if popup blocked
- Hardening: callbackUrl validation to internal paths only

### Must NOT Have (Guardrails)

- NO changes to existing `/api/auth/callback/keycloak` route
- NO changes to NextAuth Keycloak provider configuration in `src/lib2/auth.ts`
- NO automated tests (user explicitly requested)
- NO popup NAME collisions (must use unique names per attempt)
- NO `localStorage` for PKCE codes - use `sessionStorage` only
- NO `postMessage` with wildcard `*` for targetOrigin - use specific origin
- NO open-redirect vulnerabilities in medusa-sync callbackUrl

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.
> Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision

- **Infrastructure exists**: YES (Vitest + Storybook)
- **Automated tests**: NO (user explicitly excluded all tests)
- **Framework**: None (QA scenarios only)
- **If TDD**: Not applicable

### QA Policy

Every task MUST include agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **QA Scenarios**: Always included (agent-executed verification only)

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.
> Each wave completes before the next begins.
> Target: 5-8 tasks per wave. Fewer than 3 per wave (except final) = under-splitting.

```
Wave 1 (Start Immediately — foundation utilities):
├── Task 1: PKCE generator utilities [quick]
├── Task 2: Helper type definitions [quick]
└── Task 3: Popup URL builder utility [quick]

Wave 2 (After Wave 1 — client-side authentication):
├── Task 4: Popup auth hook with postMessage [quick]
├── Task 5: Popup URL generator component [quick]
└── Task 6: Error handling utilities [quick]

Wave 3 (After Wave 2 — server-side callbacks):
├── Task 7: popup-callback route handler [deep]
├── Task 8: Harden medusa-sync redirect validation [deep]
└── Task 9: Fallback login route [quick]

Wave 4 (After Wave 3 — UI integration):
├── Task 10: Update Topheader component [quick]
├── Task 11: Update LoginKeycloak component [quick]
└── Task 12: Add loading/error states to auth UI [visual-engineering]

Wave FINAL (After ALL tasks — integration):
├── Task F1: Secret callback cleanup exploration [quick]
└── Full integration note: Manual verification required (no automated tests)
```

### Dependency Matrix

- **1-3**: — — 4-6, 3
- **4-6**: 1-3 — 10-11, 2
- **7**: 1-3, 4 — 10-11, 3
- **8**: — — 10-11, 3
- **9**: — — 10-11, 3
- **10-11**: 4-9, 7 — FINAL, 2

### Agent Dispatch Summary

- **1**: **3** — T1 → `quick`, T2 → `quick`, T3 → `quick`
- **2**: **3** — T4 → `quick`, T5 → `quick`, T6 → `quick`
- **3**: **3** — T7 → `deep`, T8 → `deep`, T9 → `quick`
- **4**: **3** — T10 → `quick`, T11 → `quick`, T12 → `visual-engineering`
- **FINAL**: **1** — F1 → `quick`

---

## TODOs

> Implementation + Verification = ONE Task.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.

---

- [x] 1. PKCE Generator Utilities
- [x] 7. Popup Callback Route Handler

  **What to do**:
  - Create `src/app/api/auth/popup-callback/route.ts` (GET).
  - This route is the `callbackUrl` passed to NextAuth `signIn`.
  - Content: Return HTML page.
  - Script: `window.opener.postMessage({ status: 'success' }, origin); window.close();`
  - Handle error params if NextAuth redirects with error.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Auth flow logic, route handler.
  - **Skills**: [`nextjs`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 10
  - **Blocked By**: Task 4 (conceptually)

  **References**:
  - `src/app/api/auth/popup-callback/route.ts` (new file)
  - `src/app/api/auth/[...nextauth]/route.ts` (reference for session cookie behavior)

  **Acceptance Criteria**:
  - [ ] Returns 200 OK with HTML content
  - [ ] HTML contains `window.opener.postMessage`
  - [ ] HTML contains `window.close`

  **QA Scenarios**:

  ```
  Scenario: Callback route returns closer script
    Tool: Bash
    Preconditions: None
    Steps:
      1. `curl http://localhost:4000/api/auth/popup-callback`
    Expected Result: HTML contains <script>...postMessage...window.close...</script>
    Evidence: .sisyphus/evidence/task-7-callback-route.html
  ```

- [x] 8. Harden Medusa Sync Redirect

  **What to do**:
  - Edit `src/app/api/auth/medusa-sync/route.ts`.
  - Validate `callbackUrl` query param.
  - If `callbackUrl` is present:
    - Check if it starts with `/` (relative).
    - Or matches `process.env.NEXTAUTH_URL` / `VERCEL_URL`.
    - REJECT external domains (e.g., `https://evil.com`).
    - If invalid, default to `/dashboard` or `/`.

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Security hardening, critical auth path.
  - **Skills**: [`security`, `nextjs`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 10
  - **Blocked By**: None

  **References**:
  - `src/app/api/auth/medusa-sync/route.ts`

  **Acceptance Criteria**:
  - [ ] External callbackUrl redirects to default/safe path
  - [ ] Internal callbackUrl works as expected

  **QA Scenarios**:

  ```
  Scenario: Block external redirect
    Tool: Bash
    Preconditions: None
    Steps:
      1. `curl -v "http://localhost:4000/api/auth/medusa-sync?callbackUrl=https://google.com"`
    Expected Result: Location header is NOT google.com (should be / or /dashboard)
    Evidence: .sisyphus/evidence/task-8-harden-redirect.txt
  ```

- [x] 9. Fallback Login Route

  **What to do**:
  - Modify `src/app/api/auth/login/route.ts`.
  - Ensure it supports a `fallback=true` param or similar if we want to force full redirect.
  - Actually, existing route is fine as the fallback. Just ensure it redirects to `/` or correct callbackUrl.
  - Maybe add logging for fallback usage.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Minor adjustment.
  - **Skills**: [`nextjs`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 10
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] Route exists and performs redirect `signIn`

  **QA Scenarios**:

  ```
  Scenario: Fallback route redirects
    Tool: Bash
    Preconditions: None
    Steps:
      1. `curl -v http://localhost:4000/api/auth/login`
    Expected Result: 302/307 Redirect to Keycloak/NextAuth signin
    Evidence: .sisyphus/evidence/task-9-fallback.txt
  ```

- [x] 10. Update Topheader Component

  **What to do**:
  - Edit `src/components/Topheader.tsx`.
  - Integrate `usePopupAuth` hook.
  - Replace `signIn` call with `openPopup`.
  - Handle "Success" message:
    - Trigger `router.refresh()` to update session state in UI.
    - OPTIONAL: Manually trigger `/api/auth/medusa-sync` fetch if cookies not set?
    - **Correction**: If we used "NextAuth in Popup" strategy (Task 7), the cookies are set in the browser (shared domain).
    - So just `router.refresh()` should show user as logged in.
    - **Wait**: `medusa-sync` might need to run.
    - Since `medusa-sync` is triggered by middleware on navigation...
    - If popup closes and we stay on same page, we might have NextAuth session but NO Medusa cookies yet.
    - **Action**: In `onSuccess` handler, `fetch('/api/auth/medusa-sync')` explicitly? Or navigate?
    - Better: `fetch('/api/auth/medusa-sync?json=true')` (might need to update route to support JSON response instead of redirect).
    - **Or**: Just `window.location.reload()` which triggers middleware -> medusa-sync -> page load. Simple and robust.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component update, user interaction flow.
  - **Skills**: [`react`, `nextjs`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Task F1
  - **Blocked By**: Tasks 4, 7, 8

  **References**:
  - `src/components/Topheader.tsx`

  **Acceptance Criteria**:
  - [ ] Login button calls `openPopup`
  - [ ] Page reloads/refreshes on success

  **QA Scenarios**:

  ```
  Scenario: Login button present
    Tool: Playwright
    Preconditions: Server running
    Steps:
      1. Navigate to home
      2. Check for Login button
    Expected Result: Button visible
    Evidence: .sisyphus/evidence/task-10-ui-check.png
  ```

- [x] 11. Update LoginKeycloak Component

  **What to do**:
  - Edit `src/components/LoginKeycloak.tsx`.
  - Similar updates as Topheader. Use `usePopupAuth`.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component update.
  - **Skills**: [`react`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Task F1
  - **Blocked By**: Tasks 4, 7

  **Acceptance Criteria**:
  - [ ] Component uses popup hook

  **QA Scenarios**:

  ```
  Scenario: Component logic update
    Tool: Bash
    Preconditions: None
    Steps:
      1. Grep "usePopupAuth" src/components/LoginKeycloak.tsx
    Expected Result: Found
    Evidence: .sisyphus/evidence/task-11-grep.txt
  ```

- [x] 12. Add Loading/Error States

  **What to do**:
  - Enhance UI components to show "Authenticating..." spinner during popup flow.
  - Show error messages (toast or inline) if popup fails/closes.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UX refinement.
  - **Skills**: [`react`, `tailwind`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Task F1
  - **Blocked By**: Tasks 10, 11

  **Acceptance Criteria**:
  - [ ] Loading state exists
  - [ ] Error state exists

  **QA Scenarios**:

  ```
  Scenario: Loading state code check
    Tool: Bash
    Preconditions: None
    Steps:
      1. Grep "isLoading" src/components/Topheader.tsx
    Expected Result: Found
    Evidence: .sisyphus/evidence/task-12-grep-loading.txt
  ```

- [x] F1. Secret Callback Cleanup Exploration

  **What to do**:
  - Investigation task: Verify if any temp files or session storage items need explicit cleanup.
  - Ensure `sessionStorage` is cleared of sensitive verifiers (though we shifted to NextAuth cookie strategy, so mostly check for `popup-open` flags).

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Verification.
  - **Skills**: [`security`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave FINAL
  - **Blocks**: None
  - **Blocked By**: All previous

  **Acceptance Criteria**:
  - [ ] Cleanup verified

  **QA Scenarios**:

  ```
  Scenario: Manual verification checklist
    Tool: Bash
    Preconditions: None
    Steps:
      1. Echo "Manual verification required"
    Expected Result: Info logged
    Evidence: .sisyphus/evidence/task-f1-check.txt
  ```

  **What to do**:
  - Create `src/lib/pkce.ts`
  - Implement `generateCodeVerifier()`: Generate 32-byte random string, url-safe base64 encoded.
  - Implement `generateCodeChallenge(verifier)`: SHA-256 hash of verifier, url-safe base64 encoded.
  - Ensure compatibility with browser `window.crypto` (SubtleCrypto).
  - Add simple fallback for non-secure contexts (localhost development).

  **Must NOT do**:
  - Use Node.js crypto module (must be client-side compatible).
  - Use `localStorage` for anything.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Pure utility function implementation, standard crypto logic.
  - **Skills**: [`typescript`, `crypto`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 4, 7
  - **Blocked By**: None

  **References**:
  - `src/lib/pkce.ts` (new file)
  - MDN SubtleCrypto: `https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest`

  **Acceptance Criteria**:
  - [ ] `bun -e "import('./src/lib/pkce.ts').then(m => m.generateCodeVerifier().then(v => console.log(v.length > 40)))"` → true
  - [ ] `bun -e "import('./src/lib/pkce.ts').then(m => m.generateCodeChallenge('test').then(c => console.log(c.length > 0)))"` → true

  **QA Scenarios**:

  ```
  Scenario: Generate valid PKCE pair
    Tool: Bash
    Preconditions: None
    Steps:
      1. Create temp test file `test-pkce.ts` importing `generateCodeVerifier`, `generateCodeChallenge`
      2. Run with bun: `bun test-pkce.ts`
      3. Assert output contains valid base64url strings
    Expected Result: Verifier and Challenge are non-empty strings
    Evidence: .sisyphus/evidence/task-1-pkce-gen.txt
  ```

- [x] 2. Helper Type Definitions

  **What to do**:
  - Create `src/types/auth-popup.ts`
  - Define `AuthMessage` interface for postMessage communication.
  - Properties: `status` ('success' | 'error'), `accessToken?`, `refreshToken?`, `error?`, `nonce`.
  - Define `PopupConfig` interface for window dimensions and features.

  **Must NOT do**:
  - Import server-side types in this client-side definition file.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple TypeScript interface definitions.
  - **Skills**: [`typescript`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:
  - `src/types/auth-popup.ts` (new file)

  **Acceptance Criteria**:
  - [ ] File exists and compiles with `tsc --noEmit`

  **QA Scenarios**:

  ```
  Scenario: Types compile correctly
    Tool: Bash
    Preconditions: File created
    Steps:
      1. Run `bun tsc --noEmit src/types/auth-popup.ts`
    Expected Result: No errors
    Evidence: .sisyphus/evidence/task-2-types-check.txt
  ```

- [x] 3. Popup URL Builder Utility

  **What to do**:
  - Create `src/lib/auth-url.ts`
  - Implement `buildKeycloakUrl(verifier, challenge, redirectUri)` function.
  - Construct standard OAuth2 authorization URL.
  - Include params: `client_id`, `response_type=code`, `scope`, `code_challenge`, `code_challenge_method=S256`.
  - Use `process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER` (ensure it's available to client).

  **Must NOT do**:
  - Hardcode client IDs or secrets.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: URL construction logic, environment variable usage.
  - **Skills**: [`typescript`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:
  - `src/lib/auth-url.ts` (new file)
  - `src/lib2/auth.ts` (for env var names reference)

  **Acceptance Criteria**:
  - [ ] Function returns valid URL string starting with Keycloak issuer
  - [ ] URL contains `code_challenge` param

  **QA Scenarios**:

  ```
  Scenario: Build valid Auth URL
    Tool: Bash
    Preconditions: Env vars set
    Steps:
      1. Create test script importing `buildKeycloakUrl`
      2. Run with mock inputs
    Expected Result: Output URL contains correct query params
    Evidence: .sisyphus/evidence/task-3-url-builder.txt
  ```

- [x] 4. Popup Auth Hook with postMessage

  **What to do**:
  - Create `src/hooks/usePopupAuth.ts`
  - Implement `usePopupAuth` hook.
  - `openPopup()` function:
    - Generate PKCE codes (Task 1).
    - Store `code_verifier` in `sessionStorage`.
    - Open window using `window.open` (centered dimensions).
    - Setup `window.addEventListener('message')`.
    - Validate `event.origin` (must match window.location.origin).
    - Validate `event.source` (must match popup window ref).
    - Resolve promise on 'success' message.
    - Reject on 'error' or timeout.
  - Handle polling for window closure (user cancel detection).

  **Must NOT do**:
  - Use `localStorage` for verifier.
  - Allow `*` origin in listeners.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex client-side logic, event handling, window management.
  - **Skills**: [`react`, `browser-api`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 10, 11
  - **Blocked By**: Tasks 1, 2, 3

  **References**:
  - `src/hooks/usePopupAuth.ts` (new file)
  - Pattern: MSAL PopupClient

  **Acceptance Criteria**:
  - [ ] Hook exports `openPopup` function
  - [ ] Compiles without errors

  **QA Scenarios**:

  ```
  Scenario: Hook initializes correctly
    Tool: Bash
    Preconditions: File created
    Steps:
      1. Run `bun tsc --noEmit src/hooks/usePopupAuth.ts`
    Expected Result: No type errors
    Evidence: .sisyphus/evidence/task-4-hook-compile.txt
  ```

- [x] 5. Popup URL Generator Component

  **What to do**:
  - Create `src/components/AuthPopupParams.tsx` (client component).
  - Purpose: Handle the dynamic environment variables needed for URL generation if they aren't exposed to client by default.
  - Or simply ensure `process.env.NEXT_PUBLIC_...` are correctly set in `next.config.js` / `.env`.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Configuration verification.
  - **Skills**: [`nextjs`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:
  - `.env.local`
  - `next.config.ts`

  **Acceptance Criteria**:
  - [ ] Env vars accessible in client component

  **QA Scenarios**:

  ```
  Scenario: Env vars present
    Tool: Bash
    Preconditions: None
    Steps:
      1. grep "NEXT_PUBLIC" .env* || echo "Check next.config.ts"
    Expected Result: Keycloak issuer/ID are public or exposed
    Evidence: .sisyphus/evidence/task-5-env-check.txt
  ```

- [x] 6. Error Handling Utilities

  **What to do**:
  - Create `src/utilities/auth-errors.ts`
  - Define error types: `PopupBlockedError`, `UserCancelledError`, `TimeoutError`, `AuthError`.
  - Helper to map Keycloak error codes to user-friendly messages.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple utility class/functions.
  - **Skills**: [`typescript`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 10
  - **Blocked By**: None

  **References**:
  - `src/utilities/auth-errors.ts` (new file)

  **Acceptance Criteria**:
  - [ ] Error classes exported

  **QA Scenarios**:

  ```
  Scenario: Error types available
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run `bun tsc --noEmit src/utilities/auth-errors.ts`
    Expected Result: No errors
    Evidence: .sisyphus/evidence/task-6-errors.txt
  ```

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> Note: No automated tests, so verification will focus on QA scenarios and manual-agent-executed checks.

- [x] F1. **Final Integration Check** — `quick`
      Verify end-to-end flow works: popup opens, user clicks close manually, fallback redirect triggers, medusa-sync validates callbackUrl correctly.
      Output: `Popup Open [OK | FAIL] | Fallback [OK | FAIL] | Validation [OK | FAIL] | VERDICT`

---

## Commit Strategy

- **1**: `feat(auth): add PKCE generator utilities` — src/lib/pkce.ts
- **2**: `feat(auth): add popup auth hook with postMessage` — src/hooks/usePopupAuth.ts
- **3**: `feat(auth): add popup-callback route handler` — src/app/api/auth/popup-callback/route.ts
- **4**: `feat(auth): harden medusa-sync callbackUrl validation` — src/app/api/auth/medusa-sync/route.ts
- **5**: `feat(auth): add fallback login route` — src/app/api/auth/login/route.ts
- **6**: `refactor(ui): update Topheader to use popup auth` — src/components/Topheader.tsx
- **7**: `refactor(ui): update LoginKeycloak to use popup auth` — src/components/LoginKeycloak.tsx
- **8**: `feat(ui): add loading/error states to auth components` — src/components/\*.tsx

---

## Success Criteria

### Verification Commands

```bash
# Verify PKCE generator works
bun -e "import('./src/lib/pkce.js').then(m => m.generatePkceCodes().then(console.log))"
# Expected: { codeVerifier: '...', codeChallenge: '...' }

# Verify popup-callback route exists
curl -I http://localhost:4000/api/auth/popup-callback
# Expected: 404 not found (before) or 200 OK (after implementation)

# Verify medusa-sync hardens external redirect
curl -s -D - "http://localhost:4000/api/auth/medusa-sync?callbackUrl=https://evil.example" -o /dev/null | sed -n '1,20p'
# Expected: Location does NOT point to https://evil.example (either 400/422 or redirects to safe internal path)
```

### Final Checklist

- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Popup opens with correct dimensions centered
- [x] postMessage validates origin and source
- [ ] autoClose works via window.close()
- [ ] Fallback redirect works when popup blocked
- [ ] callbackUrl validation blocks external redirects
- [ ] Error scenarios handled (cancel/timeout/error)
