"use client"

import { useMedusaSync } from "@/hooks/use-medusa-sync"

export default function MedusaSynchronizer() {
  // Solo invocamos el hook. Este componente no renderiza nada visual.
  useMedusaSync()
  return null
}
