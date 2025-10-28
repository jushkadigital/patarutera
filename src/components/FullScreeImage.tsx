"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/useMobile"

interface FullscreenImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export function FullscreenImage({ src, alt, width = 600, height = 400, className }: FullscreenImageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden"

      // En móviles, forzar orientación horizontal

    } else {
      document.body.style.overflow = "unset"

      // Liberar el bloqueo de orientación
      if (isMobile && screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock()
      }
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isFullscreen, isMobile])

  const handleImageClick = () => {
    setIsFullscreen(true)
  }

  const handleClose = () => {
    setIsFullscreen(false)
  }


  return isMobile && (
    <>
      {/* Imagen normal */}
      <div className={cn("relative cursor-pointer", className)}>
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className="rounded-lg object-cover transition-transform hover:scale-105"
          onClick={handleImageClick}
        />
      </div>

      {/* Modal de pantalla completa */}
      {isFullscreen && (
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/95" onClick={handleClose}>
          {/* Botón de cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 md:top-6 md:right-6"
            aria-label="Cerrar pantalla completa"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Imagen en pantalla completa */}
          <div
            className={cn("relative h-full w-full", isMobile && "flex items-center justify-center")}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              fill
              className={cn("object-contain", isMobile && "rotate-0 md:rotate-0")}
              priority
            />
          </div>

          {/* Indicador para móviles */}
          {isMobile && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              Gira tu dispositivo para mejor visualización
            </div>
          )}
        </div>
      )}
    </>
  )
}
