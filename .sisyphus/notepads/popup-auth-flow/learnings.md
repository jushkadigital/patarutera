# Learnings - popup-auth-flow

Created: 2026-02-26

## PKCE Implementation Learnings (2026-02-26)

- WebCrypto API (`globalThis.crypto`) works in browser and Next.js client components
- `crypto.getRandomValues()` generates cryptographically secure random bytes
- `crypto.subtle.digest('SHA-256', data)` computes SHA-256 hash asynchronously
- Base64url encoding requires three transformations:
  1. Replace `+` with `-`
  2. Replace `/` with `_`
  3. Remove `=` padding characters
- 32 random bytes (256 bits) produces 43-character base64url string (within RFC 7636 43-128 char range)
- TextEncoder ensures ASCII-only encoding for verifier before hashing
- No external dependencies needed - all browser APIs available

## Type Definitions Learnings (2026-02-26)

- Keep postMessage payload minimal: only status + nonce + error (no tokens)
- Use literal union types for status ("success" | "error")
- Optional error field allows success messages without error property
- PopupConfig separates window dimensions from popup name/features
- ASCII-only types ensure compatibility across browsers

## URL Builder Learnings (2026-02-26)

- `new URL()` automatically encodes special characters in query parameters
- `url.searchParams.set()` handles parameter encoding and ordering
- Nonce is optional parameter; only append to URL if provided

## Popup Hook Learnings (2026-02-26)

- Validate `postMessage` with both `event.origin` and `event.source` to prevent cross-window spoofing
- Match `nonce` in message payload to bind callback events to the active popup request
- Use internal `/api/auth/login` URL and pass callback URL via `redirectTo` instead of opening provider directly
- Fallback to full-page redirect when `window.open()` is blocked by popup settings
- Poll `popupWindow.closed` to detect user cancellation and reject promptly
- Always clear message listeners, interval timers, and timeout timers when resolving or rejecting
- In UI buttons that trigger popup auth, bind `isLoading` to disabled state and render `error` text so cancel/timeout failures are visible without unhandled promise rejections

## Popup Callback Learnings (2026-02-26)

- Callback route returns HTML with inline script that posts message to window.opener and attempts window.close()
- Use window.location.origin as targetOrigin (not \*) for security; fallback to minimal HTML if window cannot close or no opener exists
- Sanitize `callbackUrl` redirects by allowing only internal paths that start with `/` and rejecting values that start with `//`; fallback to `/` when invalid
- Login route should sanitize `redirectTo` using the same internal-path rule (start with `/`, reject `//`) and fallback to `/dashboard`
- After popup auth success, call `window.location.reload()` so Next.js middleware runs and triggers Medusa sync on the refreshed request
- Avoid triggering sign-in during component render; require explicit button click to prevent unwanted auth redirects in client components
- Map popup failures to typed errors (PopupBlockedError, UserCancelledError, PopupTimeoutError, PopupUnknownError) for better error handling and UI feedback


## Timeout Configuration (2026-02-26)

- Default popup auth timeout set to 30000ms (30 seconds)
- Timeout is configurable via `OpenPopupParams.timeoutMs` parameter
- Timeout error message reflects the actual timeout used in milliseconds
