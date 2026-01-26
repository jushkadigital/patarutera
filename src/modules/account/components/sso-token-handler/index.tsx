"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Heading, Text } from "@medusajs/ui" // Opcional: para estilos

export const SSOTokenHandler = () => {
  const searchParams = useSearchParams()
  const [isValidating, setIsValidating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get("access_token")

    if (token) {
      setIsValidating(true)

      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

      // 1. Canjear Token por Cookie
      fetch(`${backendUrl}/auth/session`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include", // <--- IMPORTANTE: Guarda la cookie
      })
        .then(async (res) => {
          if (res.ok) {
            // 2. Limpiar URL (quitar el token para que no se vea feo)
            const newUrl = window.location.pathname
            window.history.replaceState({}, "", newUrl)

            // 3. Recargar para que el Server Component (Layout) detecte la cookie
            // Usamos window.location.reload() porque router.refresh() a veces
            // no actualiza las cookies del lado del servidor instantáneamente en Next.js
            window.location.reload()
          } else {
            console.error("Token SSO inválido")
            setIsValidating(false)
          }
        })
        .catch((err) => {
          console.error("Error SSO:", err)
          setIsValidating(false)
        })
    }
  }, [searchParams])

  // Si estamos validando, mostramos un Spinner o mensaje de carga
  // Esto tapa el formulario de Login momentáneamente
  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[50vh] gap-4">
        <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin border-t-blue-600" />
        <Heading level="h2" className="text-xl">Iniciando sesión segura...</Heading>
        <Text>Estamos validando tus credenciales.</Text>
      </div>
    )
  }

  // Si no hay token, retornamos null (no renderiza nada visual)
  // para que se muestre el formulario de Login que está debajo
  return null
}
