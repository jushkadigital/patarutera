import { auth, signOut } from "@/lib2/auth";
import { NextRequest, NextResponse } from "next/server";

const MAX_SYNC_WAIT_MS = 35_000;
const SYNC_REQUEST_TIMEOUT_MS = 12_000;
const INITIAL_RETRY_DELAY_MS = 1_200;
const MAX_RETRY_DELAY_MS = 6_000;
const RETRY_BACKOFF_MULTIPLIER = 1.5;
const MEDUSA_SYNC_FALLBACK_COOKIE = "medusa_sync_guest_fallback";
const TRANSIENT_FALLBACK_MAX_AGE_SECONDS = 20;
const MANUAL_GUEST_FALLBACK_MAX_AGE_SECONDS = 60 * 5;

type MedusaSyncErrorBody = {
  code?: string;
  message?: string;
};

function getSafeCallbackPath(raw: string | null): string {
  if (!raw) {
    return "/";
  }

  if (!raw.startsWith("/") || raw.startsWith("//")) {
    return "/";
  }

  return raw;
}

// Helper function to extract cookie value from Set-Cookie header
function extractCookieValue(
  cookieString: string,
  cookieName: string,
): string | null {
  const trimmedCookie = cookieString.trim();
  const match = trimmedCookie.match(new RegExp(`^${cookieName}=([^;]+)`));
  return match ? match[1] : null;
}

function hasCookie(setCookieHeaders: string[], cookieName: string) {
  return setCookieHeaders.some((cookie) =>
    cookie.trim().startsWith(`${cookieName}=`),
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryDelay(currentDelayMs: number) {
  return Math.min(
    Math.floor(currentDelayMs * RETRY_BACKOFF_MULTIPLIER),
    MAX_RETRY_DELAY_MS,
  );
}

function getErrorCode(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  if (!("code" in data)) {
    return null;
  }

  const possibleCode = (data as MedusaSyncErrorBody).code;
  return typeof possibleCode === "string" ? possibleCode : null;
}

function isRetriableSyncError(status: number, data: unknown) {
  const code = getErrorCode(data);

  if (!code) {
    return false;
  }

  const retriableCodes = new Set([
    "NOT_SYNCED",
    "NOT_SYNCED_YET",
    "CUSTOMER_NOT_FOUND",
  ]);

  return status >= 400 && status < 500 && retriableCodes.has(code);
}

function isRetriableNetworkError(error: unknown) {
  if (!error || typeof error !== "object" || !("name" in error)) {
    return false;
  }

  const errorName = (error as { name?: unknown }).name;
  return errorName === "AbortError" || errorName === "TypeError";
}

function shouldSignOutOnFallback(reason: string) {
  return reason === "manual_guest";
}

function getFallbackCookieMaxAge(reason: string) {
  if (reason === "manual_guest") {
    return MANUAL_GUEST_FALLBACK_MAX_AGE_SECONDS;
  }

  return TRANSIENT_FALLBACK_MAX_AGE_SECONDS;
}

async function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function continueAsGuest(
  req: NextRequest,
  callbackUrl: string,
  reason: string,
  isDevelopment: boolean,
) {
  if (shouldSignOutOnFallback(reason)) {
    try {
      await signOut({ redirect: false });
    } catch (error) {
      if (isDevelopment) {
        console.warn("[SYNC] Guest fallback signOut failed:", error);
      }
    }
  }

  const fallbackUrl = new URL(callbackUrl, req.url);
  fallbackUrl.searchParams.set("medusa_sync", "guest");
  fallbackUrl.searchParams.set("medusa_sync_reason", reason);

  const isProduction = process.env.NODE_ENV === "production";
  const response = NextResponse.redirect(fallbackUrl);
  response.cookies.set(MEDUSA_SYNC_FALLBACK_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: getFallbackCookieMaxAge(reason),
  });
  response.cookies.set("_medusa_jwt", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("connect.sid", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function GET(req: NextRequest) {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const callbackUrl = getSafeCallbackPath(
    req.nextUrl.searchParams.get("callbackUrl"),
  );
  const mode = req.nextUrl.searchParams.get("mode");

  if (isDevelopment) {
    console.log("[SYNC] Iniciando medusa-sync...");
    console.log("[SYNC] CallbackUrl:", callbackUrl);
  }

  if (mode === "guest") {
    if (isDevelopment) {
      console.log("[SYNC] Modo guest solicitado por usuario.");
    }
    return continueAsGuest(req, callbackUrl, "manual_guest", isDevelopment);
  }

  const session = await auth();

  if (!session?.user) {
    if (isDevelopment) {
      console.log("[SYNC] ❌ No hay sesión, continuando como guest");
    }
    return continueAsGuest(req, callbackUrl, "no_session", isDevelopment);
  }

  const accessToken = session.accessToken;

  if (isDevelopment && accessToken) {
    console.log("[SYNC] ✅ Sesion encontrada, accessToken: existe");
  }

  // Capture incoming cart ID for later transfer (if exists)
  const incomingCartId = req.cookies.get("_medusa_cart_id")?.value;
  if (isDevelopment && incomingCartId) {
    console.log("[SYNC] Cart ID detectado en request:", incomingCartId);
  }

  if (!accessToken) {
    console.error("❌ No hay Access Token en la sesión");
    return continueAsGuest(
      req,
      callbackUrl,
      "missing_access_token",
      isDevelopment,
    );
  }

  let attempt = 0;
  let retryDelayMs = INITIAL_RETRY_DELAY_MS;
  const syncStartedAt = Date.now();

  while (Date.now() - syncStartedAt < MAX_SYNC_WAIT_MS) {
    try {
      attempt++;
      const elapsedMs = Date.now() - syncStartedAt;
      const remainingMs = MAX_SYNC_WAIT_MS - elapsedMs;
      const requestTimeoutMs = Math.min(
        SYNC_REQUEST_TIMEOUT_MS,
        Math.max(remainingMs, 1_000),
      );

      const medusaRes = await fetchWithTimeout(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/auth/keycloak`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
          },
          body: JSON.stringify({ accessToken }),
          cache: "no-store",
        },
        requestTimeoutMs,
      );

      const data = await medusaRes.json().catch(() => ({}));

      if (isDevelopment) {
        console.log(
          `[SYNC] Intento ${attempt} - Status: ${medusaRes.status} - Elapsed: ${elapsedMs}ms`,
          data,
        );
      }

      if (!medusaRes.ok) {
        const retryableSyncError = isRetriableSyncError(medusaRes.status, data);

        if (retryableSyncError && remainingMs > 0) {
          const waitMs = Math.min(retryDelayMs, remainingMs);

          if (isDevelopment) {
            console.warn(
              `[SYNC] ⚠️ Intento ${attempt} recibió error transitorio (${getErrorCode(data)}). Reintentando en ${waitMs}ms`,
            );
          }

          await sleep(waitMs);
          retryDelayMs = getRetryDelay(retryDelayMs);
          continue;
        }

        console.error(
          "❌ Error definitivo o límite de intentos alcanzado. Continuando como guest.",
        );
        return continueAsGuest(req, callbackUrl, "sync_failed", isDevelopment);
      }

      // Extract all Set-Cookie headers (may be multiple)
      // Node/undici provides getSetCookie() for reliable multi-cookie handling
      const setCookieHeaders =
        medusaRes.headers.getSetCookie?.() ??
        (() => {
          // Fallback: iterate header entries
          const cookies: string[] = [];
          medusaRes.headers.forEach((value, name) => {
            if (name.toLowerCase() === "set-cookie") {
              cookies.push(value);
            }
          });
          return cookies;
        })();
      const response = NextResponse.redirect(new URL(callbackUrl, req.url));
      const isProduction = process.env.NODE_ENV === "production";
      response.cookies.set(MEDUSA_SYNC_FALLBACK_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        maxAge: 0,
        path: "/",
      });

      if (isDevelopment) {
        console.log("[SYNC] ✅ Exito en sync.");
      }

      if (setCookieHeaders.length > 0) {
        if (isDevelopment) {
          console.log(
            "[SYNC] Cookies a agregar:",
            setCookieHeaders.length,
            `(${isProduction ? "production" : "development"})`,
          );
        }

        let medusaJwt: string | null = null;

        setCookieHeaders.forEach((cookie, index) => {
          let finalCookie = cookie.trim();

          if (!isProduction) {
            finalCookie = finalCookie.replace(/; Secure/gi, "");
            finalCookie = finalCookie.replace(
              /SameSite=Strict/gi,
              "SameSite=Lax",
            );
            finalCookie = finalCookie.replace(
              /SameSite=None/gi,
              "SameSite=Lax",
            );
            if (isDevelopment) {
              console.log(
                `[SYNC] Cookie ${index + 1} modificada (dev):`,
                finalCookie.substring(0, 100) + "...",
              );
            }
          } else if (isDevelopment) {
            console.log(
              `[SYNC] Cookie ${index + 1} original (prod):`,
              finalCookie.substring(0, 100) + "...",
            );
          }

          response.headers.append("set-cookie", finalCookie);

          // Extract _medusa_jwt for cart transfer (preferred over connect.sid)
          if (!medusaJwt) {
            medusaJwt = extractCookieValue(cookie, "_medusa_jwt");
          }
        });

        const receivedMedusaJwtCookie =
          hasCookie(setCookieHeaders, "_medusa_jwt") ||
          hasCookie(setCookieHeaders, "__Secure-_medusa_jwt");

        if (!receivedMedusaJwtCookie) {
          console.error(
            "❌ Medusa sync respondió sin _medusa_jwt. Continuando como guest para evitar loop.",
          );
          return continueAsGuest(
            req,
            callbackUrl,
            "missing_medusa_jwt",
            isDevelopment,
          );
        }

        // Cart transfer: If we have incoming cart ID and Medusa JWT, transfer the cart
        if (incomingCartId && medusaJwt) {
          if (isDevelopment) {
            console.log("[SYNC] Iniciando cart transfer para:", incomingCartId);
          }

          try {
            // Use correct Medusa v2 endpoint: POST /store/carts/{id}/customer
            // Customer ID is automatically extracted from JWT auth session
            const transferResponse = await fetch(
              `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${incomingCartId}/customer`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${medusaJwt}`,
                  "Content-Type": "application/json",
                  "x-publishable-api-key":
                    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
                },
                cache: "no-store",
              },
            );

            if (isDevelopment) {
              if (transferResponse.ok) {
                console.log("[SYNC] ✅ Cart transfer completado exitosamente");
              } else {
                const errorData = await transferResponse
                  .json()
                  .catch(() => ({}));
                console.warn(
                  "[SYNC] ⚠️ Cart transfer fallido (continuando anyway):",
                  transferResponse.status,
                  errorData,
                );
              }
            }
          } catch (transferError) {
            if (isDevelopment) {
              console.warn(
                "[SYNC] ⚠️ Error en cart transfer (continuando anyway):",
                transferError,
              );
            }
            // Don't fail the entire sync if transfer fails
          }
        } else if (incomingCartId && !medusaJwt) {
          if (isDevelopment) {
            console.log(
              "[SYNC] ⚠️ No se encontró _medusa_jwt en respuesta, skip cart transfer",
            );
          }
        }
      } else {
        console.error(
          "❌ Medusa sync respondió OK pero sin Set-Cookie. Continuando como guest para evitar loop.",
        );
        return continueAsGuest(
          req,
          callbackUrl,
          "missing_set_cookie",
          isDevelopment,
        );
      }

      if (isDevelopment) {
        console.log("[SYNC] Redirigiendo a:", callbackUrl);
      }

      return response;
    } catch (error) {
      const elapsedMs = Date.now() - syncStartedAt;
      const remainingMs = MAX_SYNC_WAIT_MS - elapsedMs;
      const shouldRetryNetwork =
        isRetriableNetworkError(error) && remainingMs > 0;

      if (shouldRetryNetwork) {
        const waitMs = Math.min(retryDelayMs, remainingMs);

        if (isDevelopment) {
          console.warn(
            `[SYNC] ⚠️ Error de red transitorio en intento ${attempt}. Reintentando en ${waitMs}ms`,
            error,
          );
        }

        await sleep(waitMs);
        retryDelayMs = getRetryDelay(retryDelayMs);
        continue;
      }

      console.error(`❌ Error de red definitivo en intento ${attempt}:`, error);
      return continueAsGuest(req, callbackUrl, "network_error", isDevelopment);
    }
  }

  console.error(
    `❌ Sync timeout alcanzado después de ${MAX_SYNC_WAIT_MS}ms. Continuando como guest.`,
  );
  return continueAsGuest(req, callbackUrl, "sync_timeout", isDevelopment);
}
