import { NextResponse } from "next/server";
import { auth } from "@/lib2/auth";

const MEDUSA_FALLBACK_COOKIE = "medusa_sync_guest_fallback";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const medusaJwtCookie = req.cookies.get("_medusa_jwt");
  const secureMedusaJwtCookie = req.cookies.get("__Secure-_medusa_jwt");
  const hasMedusaJwtCookie = !!medusaJwtCookie || !!secureMedusaJwtCookie;
  const hasGuestFallbackCookie =
    req.cookies.get(MEDUSA_FALLBACK_COOKIE)?.value === "1";
  const syncQueryState = req.nextUrl.searchParams.get("medusa_sync");
  const hasSyncGuestQuery = syncQueryState === "guest";
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (
    isLoggedIn &&
    !hasMedusaJwtCookie &&
    !hasGuestFallbackCookie &&
    !hasSyncGuestQuery
  ) {
    const syncUrl = new URL("/api/auth/medusa-sync", req.url);
    syncUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(syncUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
