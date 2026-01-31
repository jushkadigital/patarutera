import { NextResponse } from "next/server";
import { auth } from "@/lib2/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const medusaCookieName = "_medusa_jwt";
  const medusaCookie = req.cookies.get(medusaCookieName);
  const { pathname } = req.nextUrl;
  const isDevelopment = process.env.NODE_ENV !== "production";

  // Debug solo en desarrollo
  if (isDevelopment && !pathname.startsWith("/_next")) {
    console.log(`[MIDDLEWARE] Ruta: ${pathname}`);
    console.log(`   > NextAuth Logged: ${isLoggedIn}`);
    console.log(
      `   > Medusa Cookie (${medusaCookieName}): ${medusaCookie ? "✅ Existe" : "❌ Falta"}`,
    );
  }

  // Excluir todas las rutas de /api/auth para evitar bucles
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Sincronización: Solo si está logueado en NextAuth pero NO tiene cookie Medusa
  if (isLoggedIn && !medusaCookie) {
    if (isDevelopment) {
      console.log(
        "[MIDDLEWARE] ⚠️ Usuario logueado pero SIN cookie Medusa. Redirigiendo a sync...",
      );
    }
    const syncUrl = new URL("/api/auth/medusa-sync", req.url);
    syncUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(syncUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Coincide con todo excepto _next/static, _next/image y favicon
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
