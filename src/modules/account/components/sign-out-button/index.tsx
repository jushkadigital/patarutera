"use client"

import { Button } from "@medusajs/ui"
import { useState } from "react"

export const SignOutButton = () => {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleLogout = async () => {
    setIsSigningOut(true)

    // 1. Destruir sesión en Medusa (Backend)
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

    await fetch(`${backendUrl}/auth/session`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Importante para borrar la cookie del navegador
    })

    // 2. Redirigir a Keycloak para cerrar sesión global
    // Esto asegura que si el usuario quiere entrar de nuevo, le pida contraseña
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080/realms/quarkus"
    const clientId = "medusa-store" // Tu ID de cliente en Keycloak
    const redirectBack = window.location.origin // http://localhost:8000

    // Construimos la URL de logout de OpenID Connect
    const logoutUrl = `${keycloakUrl}/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(redirectBack)}&client_id=${clientId}`

    window.location.href = logoutUrl
  }

  return (
    <Button
      variant="secondary"
      onClick={handleLogout}
      isLoading={isSigningOut}
      data-testid="logout-button"
    >
      Cerrar Sesión
    </Button>
  )
}
