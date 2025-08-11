'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as pixel from '@/lib/pixel';

export default function PixelEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();


  useEffect(() => {
    // Leemos la variable de entorno de forma segura en el cliente.
    const PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL_ID;

    if (PIXEL_ID && typeof window.fbq === 'function') {
      window.fbq('init', PIXEL_ID);
      // Disparamos el primer PageView justo después de inicializar.
      window.fbq('track', 'PageView');
    }
  }, []); 

  // 2. EFECTO PARA SEGUIR LOS CAMBIOS DE RUTA
  useEffect(() => {
    // Este efecto se dispara en cada cambio de URL.
    // El primer PageView ya se envió arriba, así que este se encarga de las navegaciones posteriores.
    if (typeof window.fbq === 'function') {
        // Aquí puedes usar tu helper si lo tienes: pixel.pageview();
        window.fbq('track', 'PageView');
    }
  }, [pathname, searchParams]); // Se re-ejecuta cuando la URL cambia.

  // Este componente no renderiza ningún HTML.
  return null;
}