import { auth, signOut } from "@/lib2/auth";
import { NextRequest, NextResponse } from "next/server";

// Configuración de reintentos
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500; // Esperar 1.5 segundos entre intentos

export async function GET(req: NextRequest) {
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment) {
    console.log("[SYNC] Iniciando medusa-sync...");
  }

  const session = await auth();

  if (!session?.user) {
    if (isDevelopment) {
      console.log("[SYNC] ❌ No hay sesión, redirigiendo a signin");
    }
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // @ts-ignore
  const accessToken = session.accessToken;

  if (isDevelopment && accessToken) {
    console.log("[SYNC] ✅ Sesion encontrada, accessToken: existe");
  }

  if (!accessToken) {
    console.error("❌ No hay Access Token en la sesión");
    await signOut({ redirect: false });
    return NextResponse.redirect(new URL("/?error=no_access_token", req.url));
  }

  const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "/";
  if (isDevelopment) {
    console.log("[SYNC] CallbackUrl:", callbackUrl);
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

      const data = await medusaRes.json();

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
          "❌ Error definitivo o límite de intentos alcanzado. Haciendo logout.",
        );
        await signOut({ redirect: false });
        return NextResponse.redirect(new URL("/?error=sync_failed", req.url));
      }

      const setCookieHeader = medusaRes.headers.get("set-cookie");
      const response = NextResponse.redirect(new URL(callbackUrl, req.url));
      const isProduction = process.env.NODE_ENV === "production";

      if (isDevelopment) {
        console.log("[SYNC] ✅ Exito en sync.");
      }

      if (setCookieHeader) {
        const cookies = setCookieHeader.split(/,(?=\s*\w+=)/);

        if (isDevelopment) {
          console.log(
            "[SYNC] Cookies a agregar:",
            cookies.length,
            `(${isProduction ? "production" : "development"})`,
          );
        }

        cookies.forEach((cookie, index) => {
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
                finalCookie,
              );
            }
          } else if (isDevelopment) {
            console.log(
              `[SYNC] Cookie ${index + 1} original (prod):`,
              finalCookie,
            );
          }

          response.headers.append("set-cookie", finalCookie);
        });
      }

      if (isDevelopment) {
        console.log("[SYNC] Redirigiendo a:", callbackUrl);
      }

      return response;
    } catch (error) {
      console.error(`❌ Error de red en intento ${attempt}:`, error);
      await signOut({ redirect: false });
      return NextResponse.redirect(new URL("/?error=network_error", req.url));
    }
  }

  console.error("❌ Error desconocido en sync. Haciendo logout.");
  await signOut({ redirect: false });
  return NextResponse.redirect(new URL("/?error=unknown_error", req.url));
}
