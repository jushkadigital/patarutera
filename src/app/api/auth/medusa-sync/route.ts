import { auth } from "@/lib2/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  // 1. En v5, auth() devuelve la sesión directamente
  const session = await auth()

  // Si no hay sesión, mandamos al login
  // Nota: En v5 la estructura del objeto session puede variar ligeramente, revisa si accessToken existe
  if (!session?.user) {
    // Usamos el signIn de v5 o redirigimos a la ruta estándar
    return NextResponse.redirect(new URL("/api/auth/signin", req.url))
  }

  // OJO: En v5, a veces el accessToken no queda en el nivel raíz de session
  // Asegúrate de que tu callback de session lo esté pasando (como puse en el paso 1).
  // @ts-ignore
  const accessToken = session.accessToken

  if (!accessToken) {
    console.error("❌ No hay Access Token en la sesión")
    return NextResponse.redirect(new URL("/", req.url))
  }

  try {
    // 2. Llamamos a Medusa (Igual que antes)
    const medusaRes = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/auth/keycloak`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      },
      body: JSON.stringify({ accessToken }),
    })

    if (!medusaRes.ok) {
      console.error("❌ Medusa error:", medusaRes.status)
      return NextResponse.redirect(new URL("/", req.url))
    }

    const setCookieHeader = medusaRes.headers.get("set-cookie")
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "/"
    const response = NextResponse.redirect(new URL(callbackUrl, req.url))

    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader)
    }

    return response

  } catch (error) {
    console.error("❌ Error sync:", error)
    return NextResponse.redirect(new URL("/", req.url))
  }
}
