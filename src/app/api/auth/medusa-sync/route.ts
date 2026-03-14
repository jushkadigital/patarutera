import { auth, signOut } from "@/lib2/auth";
import { NextRequest, NextResponse } from "next/server";

// Configuración de reintentos
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500; // Esperar 1.5 segundos entre intentos
const MEDUSA_SYNC_FALLBACK_COOKIE = "medusa_sync_guest_fallback";
const MEDUSA_SYNC_FALLBACK_MAX_AGE_SECONDS = 60 * 5;

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

async function continueAsGuest(
  req: NextRequest,
  callbackUrl: string,
  reason: string,
  isDevelopment: boolean,
) {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    if (isDevelopment) {
      console.warn("[SYNC] Guest fallback signOut failed:", error);
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
    maxAge: MEDUSA_SYNC_FALLBACK_MAX_AGE_SECONDS,
  });
  response.cookies.set("_medusa_jwt", "", {
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

  while (attempt < MAX_RETRIES) {
    try {
      attempt++;

      const medusaRes = await fetch(
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
      );

      const data = await medusaRes.json().catch(() => ({}));

      if (isDevelopment) {
        console.log(
          `[SYNC] Intento ${attempt}/${MAX_RETRIES} - Status: ${medusaRes.status}`,
          data,
        );
      }

      if (!medusaRes.ok) {
        if (isDevelopment) {
          console.error(
            `⚠️ Intento ${attempt}/${MAX_RETRIES} fallido. Medusa error:`,
            medusaRes.status,
            data.code,
          );
        }

        if (data.code === "NOT_SYNCED" || data.code === "NOT_SYNCED_YET") {
          if (attempt < MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
            continue;
          }
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
      }

      if (isDevelopment) {
        console.log("[SYNC] Redirigiendo a:", callbackUrl);
      }

      return response;
    } catch (error) {
      console.error(`❌ Error de red en intento ${attempt}:`, error);
      return continueAsGuest(req, callbackUrl, "network_error", isDevelopment);
    }
  }

  console.error("❌ Error desconocido en sync. Continuando como guest.");
  return continueAsGuest(req, callbackUrl, "unknown_error", isDevelopment);
}
