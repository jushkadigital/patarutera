"use client";

export interface BuildKeycloakUrlParams {
  clientId: string;
  issuer: string;
  redirectUri: string;
  scope: string;
  codeChallenge: string;
  state: string;
  nonce?: string;
}

export function buildKeycloakUrl(params: BuildKeycloakUrlParams): string {
  const { clientId, issuer, redirectUri, scope, codeChallenge, state, nonce } =
    params;

  const url = new URL(issuer);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scope);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);

  if (nonce) {
    url.searchParams.set("nonce", nonce);
  }

  return url.toString();
}
