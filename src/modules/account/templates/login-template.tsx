"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import { KeycloakButton } from "../components/login/keycloak-button"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === "sign-in" ? (
        <div className="max-w-sm w-full flex flex-col items-center">
          <h1 className="text-large-semi uppercase mb-6">Bienvenido de nuevo</h1>
          <p className="text-center text-base-regular text-ui-fg-base mb-8">
            Inicia sesión para acceder a una experiencia de compra mejorada.
          </p>

          {/* 2. AQUÍ AGREGAS TU BOTÓN */}
          <KeycloakButton />
          <span className="text-center text-ui-fg-base text-small-regular mt-6">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => setCurrentView("register")}
              className="underline"
            >
              Únete a nosotros
            </button>
          </span>
        </div>
      ) : (
        <div>GAAA</div>
      )}
    </div>
  )
}

export default LoginTemplate
