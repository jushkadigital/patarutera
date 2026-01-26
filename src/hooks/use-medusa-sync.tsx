"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { sdk } from "@/lib/config" // Tu instancia del JS SDK

export const useMedusaSync = () => {
  const { data: session, status } = useSession()
  console.log(status)
  const [isSynced, setIsSynced] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const router = useRouter()

  // Usamos un ref para evitar dobles llamadas en React StrictMode
  const hasAttempted = useRef(false)

  useEffect(() => {
    const syncUser = async () => {
      // Condiciones:
      // 1. NextAuth dice que estamos logueados
      // 2. No estamos sincronizando ya
      // 3. No estamos sincronizados ya
      // 4. Tenemos el token
      if (
        status === "authenticated" &&
        session?.accessToken &&
        !isSyncing &&
        !isSynced &&
        !hasAttempted.current
      ) {

        setIsSyncing(true)
        hasAttempted.current = true

        try {
          const syncAttempt = async (retries = 1) => {
            try {

              // Llamamos a TU endpoint de Medusa

              const response = await fetch("http://localhost:9000/store/auth/keycloak", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
                },
                body: JSON.stringify({ accessToken: session.accessToken }),
              })

              const rr = await response.json()

              console.log("✅ Conectado con Medusa (Cookie establecida)")
              setIsSynced(true)

              // VITAL: Refresca los Server Components para que 'retrieveCustomer'
              // ahora sí reciba la cookie y muestre los datos.

            } catch (err: any) {
              // Si el error es el código que definimos para "RabbitMQ lento"
              if (err.status === 404 || err.message?.includes("NOT_SYNCED_YET")) {
                if (retries > 0) {
                  console.log(`⏳ Esperando a RabbitMQ... reintentando (${retries})`)
                }
              }
              throw err
            }
          }

          await syncAttempt()

        } catch (error) {
          console.error("❌ Error sincronizando sesión:", error)
          hasAttempted.current = false // Permitir reintento manual si falló
        } finally {
          setIsSyncing(false)
        }
      }
    }

    syncUser()
  }, [session, status, isSynced, isSyncing, router])

  return { isSynced, isSyncing }
}
