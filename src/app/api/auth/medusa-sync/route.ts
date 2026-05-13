import { auth, signOut } from "@/lib2/auth";
import { syncWithMedusa, transferCartToCustomer } from "@/lib2/auth/medusa-auth";
import { NextRequest, NextResponse } from "next/server";

const MEDUSA_SYNC_FALLBACK_COOKIE = "medusa_sync_guest_fallback";
const TRANSIENT_FALLBACK_MAX_AGE_SECONDS = 20;
const MANUAL_GUEST_FALLBACK_MAX_AGE_SECONDS = 60 * 5;

function getSafeCallbackPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/";
  }
  return raw;
}

function getFallbackCookieMaxAge(reason: string) {
  if (reason === "manual_guest") {
    return MANUAL_GUEST_FALLBACK_MAX_AGE_SECONDS;
  }
  return TRANSIENT_FALLBACK_MAX_AGE_SECONDS;
}

async function continueAsGuest(
  req: NextRequest,
  callbackUrl: string,
  reason: string,
) {
  if (reason === "manual_guest") {
    try {
      await signOut({ redirect: false });
    } catch {}
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
  const callbackUrl = getSafeCallbackPath(
    req.nextUrl.searchParams.get("callbackUrl"),
  );
  const mode = req.nextUrl.searchParams.get("mode");

  if (mode === "guest") {
    return continueAsGuest(req, callbackUrl, "manual_guest");
  }

  const session = await auth();

  if (!session?.user) {
    return continueAsGuest(req, callbackUrl, "no_session");
  }

  const accessToken = session.accessToken;

  if (!accessToken) {
    return continueAsGuest(req, callbackUrl, "missing_access_token");
  }

  const { medusaJwt, setCookieHeaders } = await syncWithMedusa(accessToken);

  if (!medusaJwt) {
    console.error("[SYNC] Medusa sync failed. Continuing as guest.");
    return continueAsGuest(req, callbackUrl, "sync_failed");
  }

  const response = NextResponse.redirect(new URL(callbackUrl, req.url));
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set("_medusa_jwt", medusaJwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set(MEDUSA_SYNC_FALLBACK_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 0,
    path: "/",
  });

  for (const cookie of setCookieHeaders) {
    response.headers.append("set-cookie", cookie);
  }

  const incomingCartId = req.cookies.get("_medusa_cart_id")?.value;
  if (incomingCartId && medusaJwt) {
    await transferCartToCustomer(incomingCartId, medusaJwt);
  }

  return response;
}
