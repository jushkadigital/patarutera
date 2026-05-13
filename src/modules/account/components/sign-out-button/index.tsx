"use client"

import { Button } from "@medusajs/ui"
import { useState } from "react"

export const SignOutButton = () => {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleLogout = async () => {
    setIsSigningOut(true)

    try {
      await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      })
    } catch {
      // Proceed with Keycloak logout even if local logout fails
    }

    const AUTH_KEYCLOAK_ISSUER = process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER ?? ""
    const CLIENT_ID = process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ID ?? ""
    const redirectBack = window.location.origin

    const logoutUrl = `${AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(redirectBack)}&client_id=${CLIENT_ID}`

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
