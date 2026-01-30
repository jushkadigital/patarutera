import { auth } from "@/lib2/auth"
import { NextRequest, NextResponse } from "next/server"

// Configuración de reintentos
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1500 // Esperar 1.5 segundos entre intentos

export async function GET(req: NextRequest) {
  // 1. Verificación de sesión (igual que tu código original)
  const session = await auth()

  if (!session?.user) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url))
  }

  // @ts-ignore
  const accessToken = session.accessToken

  if (!accessToken) {
    console.error("❌ No hay Access Token en la sesión")
    return NextResponse.redirect(new URL("/", req.url))
  }

  const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "/"

  // 2. Lógica de Reintento
  let attempt = 0

  while (attempt < MAX_RETRIES) {
    try {
      attempt++

      const medusaRes = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/auth/keycloak`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
        body: JSON.stringify({ accessToken }),
        // Importante: No cachear para evitar recibir la misma respuesta fallida
        cache: 'no-store'
      })

      const data = await medusaRes.json()

      if (!medusaRes.ok) {
        console.error(`⚠️ Intento ${attempt}/${MAX_RETRIES} fallido. Medusa error:`, medusaRes.status, data.code)

        // Si el error es de sincronización, esperamos y reintentamos
        if (data.code === 'NOT_SYNCED' || data.code === 'NOT_SYNCED_YET') {
          if (attempt < MAX_RETRIES) {
            // Esperar un poco antes de volver a intentar (Backoff)
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
            continue // Vuelve al inicio del while
          }
        }

        // Si es otro error o se acabaron los intentos, salimos
        console.error("❌ Error definitivo o límite de intentos alcanzado.")
        return NextResponse.redirect(new URL("/", req.url))
      }

      // 3. Éxito: Procesar respuesta
      const setCookieHeader = medusaRes.headers.get("set-cookie")
      const response = NextResponse.redirect(new URL(callbackUrl, req.url))

      if (setCookieHeader) {
        response.headers.set("set-cookie", setCookieHeader)
      }

      return response

    } catch (error) {
      console.error(`❌ Error de red en intento ${attempt}:`, error)
      // Si quieres reintentar también en errores de red (fetch fail), usa 'continue' aquí también
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Si sale del bucle sin retornar nada (caso raro), redirigir a home
  return NextResponse.redirect(new URL("/", req.url))
}
