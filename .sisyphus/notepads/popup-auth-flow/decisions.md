# Decisions - popup-auth-flow

Created: 2026-02-26


- No NEXT_PUBLIC Keycloak env vars required: popup opens internal `/api/auth/login` route which triggers NextAuth server signIn, not direct Keycloak authorize URL
