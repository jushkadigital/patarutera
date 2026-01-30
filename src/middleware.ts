import { NextResponse } from "next/server"
import { auth } from "@/lib2/auth"

export default auth((req) => {
  // --- ZONA DE DEBUG ---
  const isLoggedIn = !!req.auth
  const medusaCookieName = "_medusa_jwt" // Confirma que este sea el nombre
  const medusaCookie = req.cookies.get(medusaCookieName)
  const { pathname } = req.nextUrl

  // Solo logueamos rutas principales para no ensuciar la consola con archivos estáticos
  if (!pathname.startsWith("/_next")) {
    console.log(`[MIDDLEWARE] Ruta: ${pathname}`)
    console.log(`   > NextAuth Logged: ${isLoggedIn}`)
    console.log(`   > Medusa Cookie (${medusaCookieName}): ${medusaCookie ? "✅ Existe" : "❌ Falta"}`)
    console.log("CTM")
  }
  // ---------------------

  // LÓGICA DE SINCRONIZACIÓN
  if (isLoggedIn && !medusaCookie) {

    // Evitar bucle infinito en la ruta de sync
    if (pathname.startsWith("/favicon") || pathname.startsWith("/_next") || pathname.startsWith("/api/auth")) {
      console.log("   > Dejando pasar a ruta de sync...")
      return NextResponse.next()
    }

    console.log(`⚠️ DETECTADO: Usuario desincronizado. Redirigiendo a /api/auth/medusa-sync`)

    const syncUrl = new URL("/api/auth/medusa-sync", req.url)
    syncUrl.searchParams.set("callbackUrl", pathname)

    return NextResponse.redirect(syncUrl)
  }

  return NextResponse.next()
})

export const config = {
  // Coincide con todo excepto _next/static, _next/image y favicon
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

