import "server-only";

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

interface MedusaSyncResult {
  medusaJwt: string | null;
  setCookieHeaders: string[];
}

/**
 * Exchange a Keycloak access token for a Medusa JWT session.
 * Extracted from the former medusa-sync route for reuse in BFF login.
 */
export async function syncWithMedusa(
  accessToken: string,
): Promise<MedusaSyncResult> {
  if (!accessToken) {
    return { medusaJwt: null, setCookieHeaders: [] };
  }

  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/auth/keycloak`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ accessToken }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(
        `[MEDUSA-AUTH] Sync failed: ${response.status} ${await response.text().catch(() => "")}`,
      );
      return { medusaJwt: null, setCookieHeaders: [] };
    }

    const data = await response.json().catch(() => ({}));
    const medusaJwtFromBody =
      typeof data?.token === "string" && data.token.length > 0
        ? data.token
        : null;

    const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
    const isProduction = process.env.NODE_ENV === "production";

    let medusaJwt = medusaJwtFromBody;

    if (!medusaJwt && setCookieHeaders.length > 0) {
      for (const cookie of setCookieHeaders) {
        const match = cookie.trim().match(/^_medusa_jwt=([^;]+)/);
        if (match?.[1]) {
          medusaJwt = match[1];
          break;
        }
      }
    }

    const processedHeaders = isProduction
      ? setCookieHeaders
      : setCookieHeaders.map((c) =>
          c
            .replace(/; Secure/gi, "")
            .replace(/SameSite=Strict/gi, "SameSite=Lax")
            .replace(/SameSite=None/gi, "SameSite=Lax"),
        );

    return { medusaJwt, setCookieHeaders: processedHeaders };
  } catch (error) {
    console.error("[MEDUSA-AUTH] Sync error:", error);
    return { medusaJwt: null, setCookieHeaders: [] };
  }
}

/**
 * Transfer a guest cart to the authenticated customer.
 * Returns true if successful, false otherwise (never throws).
 */
export async function transferCartToCustomer(
  cartId: string,
  medusaJwt: string,
): Promise<boolean> {
  if (!cartId || !medusaJwt) return false;

  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/customer`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${medusaJwt}`,
          "Content-Type": "application/json",
          "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
        },
        cache: "no-store",
      },
    );

    return response.ok;
  } catch (error) {
    console.error("[MEDUSA-AUTH] Cart transfer error:", error);
    return false;
  }
}
