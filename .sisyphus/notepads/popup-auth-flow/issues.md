# Issues - popup-auth-flow

Created: 2026-02-26

## Popup opener messaging gotchas (2026-02-26)

- `noopener` severs the opener relationship, so the popup cannot call `window.opener.postMessage(...)` back to the originating tab.
- `noreferrer` often implies opener isolation as well, which breaks the callback page flow that depends on opener access.
- With strict origin, source, and nonce validation in the opener, popup messaging stays protected without relying on `noopener` here.
- Server-side redirect validation now rejects absolute `redirectTo` values, so the hook must send only internal paths (for example `/api/auth/popup-callback?...`).
