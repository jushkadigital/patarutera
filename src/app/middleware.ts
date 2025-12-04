export { auth as middleware } from "@/lib/auth"

export const config = {
  // El matcher evita que el middleware corra en archivos estáticos o imágenes
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};


