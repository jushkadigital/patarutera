/**
 * Keycloak token exchange for BFF Pattern.
 * ROPC grant runs server-side only — credentials never reach the browser.
 * Includes refresh token rotation to maintain sessions.
 */

export interface KeycloakTokenSet {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_at: number;
  email: string;
  name: string;
  sub: string;
}

interface KeycloakTokenResponse {
  access_token: string;
  refresh_token: string;
  id_token?: string;
  expires_in: number;
  token_type: string;
}

interface DecodedIdToken {
  sub: string;
  email: string;
  name: string;
  preferred_username?: string;
  exp?: number;
  iat?: number;
}

const KEYCLOAK_ISSUER = process.env.AUTH_KEYCLOAK_ISSUER ?? "";
const KEYCLOAK_CLIENT_ID = process.env.AUTH_KEYCLOAK_ID ?? "";
const KEYCLOAK_CLIENT_SECRET = process.env.AUTH_KEYCLOAK_SECRET ?? "";

const TOKEN_ENDPOINT = `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

function decodeJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
}

/**
 * Exchange username + password for Keycloak tokens via ROPC.
 * Server-side only — core of the BFF Pattern.
 */
export async function exchangeCredentialsForTokens(
  username: string,
  password: string,
): Promise<KeycloakTokenSet | null> {
  if (!username || !password) return null;

  try {
    const params = new URLSearchParams({
      grant_type: "password",
      client_id: KEYCLOAK_CLIENT_ID,
      client_secret: KEYCLOAK_CLIENT_SECRET,
      username,
      password,
      scope: "openid profile email offline_access",
    });

    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(
        `[KEYCLOAK-TOKEN] ROPC exchange failed: ${response.status} ${errorBody}`,
      );
      return null;
    }

    const data = (await response.json()) as KeycloakTokenResponse;

    return mapTokenResponse(data);
  } catch (error) {
    console.error("[KEYCLOAK-TOKEN] ROPC exchange error:", error);
    return null;
  }
}

/**
 * Refresh an expired access token. Keycloak rotates refresh tokens —
 * if no new refresh_token is returned, reuse the old one.
 */
export async function refreshKeycloakToken(
  refreshToken: string,
): Promise<KeycloakTokenSet | null> {
  if (!refreshToken) return null;

  try {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: KEYCLOAK_CLIENT_ID,
      client_secret: KEYCLOAK_CLIENT_SECRET,
      refresh_token: refreshToken,
    });

    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(
        `[KEYCLOAK-TOKEN] Refresh failed: ${response.status} ${errorBody}`,
      );
      return null;
    }

    const data = (await response.json()) as KeycloakTokenResponse & {
      refresh_token?: string;
    };

    if (!data.refresh_token) {
      data.refresh_token = refreshToken;
    }

    return mapTokenResponse(data);
  } catch (error) {
    console.error("[KEYCLOAK-TOKEN] Refresh error:", error);
    return null;
  }
}

function mapTokenResponse(
  data: KeycloakTokenResponse & { refresh_token?: string },
): KeycloakTokenSet | null {
  if (!data.access_token) return null;

  const idToken = data.id_token ?? data.access_token;
  const decoded = decodeJwtPayload<DecodedIdToken>(idToken);

  if (!decoded) {
    console.error("[KEYCLOAK-TOKEN] Failed to decode ID token");
    return null;
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? "",
    id_token: data.id_token ?? "",
    expires_at: Math.floor(Date.now() / 1000) + (data.expires_in ?? 300),
    email: decoded.email ?? "",
    name: decoded.name ?? decoded.preferred_username ?? "",
    sub: decoded.sub,
  };
}
