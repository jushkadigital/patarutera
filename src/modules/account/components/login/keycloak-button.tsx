'use client'
import { useParams } from "next/navigation"
import React, { useState } from "react"

export const KeycloakButton = () => {
  // 1. Obtenemos la URL base
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams()

  // En Next.js, window.location.origin te da 'http://localhost:8000'
  // Usamos un pequeño truco para asegurar que solo corra en cliente o ponemos la url fija

  // 3. Construimos el link
  // IMPORTANTE: Cambia "keycloak" por el ID que pusiste en tu medusa-config.js si es distinto
  const handleKeycloakLogin = async () => {
    setIsLoading(true)

    // URL de tu backend
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

    // Endpoint Nativo de Medusa
    // Nota: Por estándar OAuth se usa GET para pedir la URL de login,
    // pero si Medusa lo requiere puedes usar POST (aunque GET es lo nativo aquí).
    const authEndpoint = `${backendUrl}/auth/customer/keycloak-store`

    try {
      // 1. Pedimos la URL a Medusa (AJAX)
      const response = await fetch(authEndpoint, {
        method: "GET", // El router nativo de Medusa suele esperar GET para esto
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      // 2. Medusa nos responde: { location: "http://keycloak..." }
      if (data.location) {
        // 3. Nosotros hacemos la redirección
        window.location.href = data.location
      } else {
        console.error("No se recibió URL de Keycloak", data)
        setIsLoading(false)
      }

    } catch (error) {
      console.error("Error al iniciar login:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-y-2 mt-4">
      <div className="w-full border-t border-gray-200 mb-2" />
      <button
        onClick={handleKeycloakLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none transition-colors"
      >
        <span className="mr-2">🔐</span>
        {isLoading ? "Redirigiendo..." : "Iniciar sesión con Keycloak"}
      </button>
    </div>
  )
}
