'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PixelEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
 const [isPixelInitialized, setIsPixelInitialized] = useState(false);

//const PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL_ID;
   const PIXEL_ID = 971219730544055

  useEffect(() => {
    // Leemos la variable de entorno de forma segura en el cliente.
    if (isPixelInitialized) {
      return;
    }
    if (PIXEL_ID && typeof window.fbq === 'function' ) {
        console.log(PIXEL_ID)
      window.fbq('init', PIXEL_ID);
      window.fbq.loaded = false
      setIsPixelInitialized(true);
      // Disparamos el primer PageView justo después de inicializar.
    }
  }, [isPixelInitialized]); 

  // 2. EFECTO PARA SEGUIR LOS CAMBIOS DE RUTA
  useEffect(() => {
    
     if (!isPixelInitialized) {
      return;
    }

    if (typeof window.fbq === 'function' ){
    window.fbq('track', 'PageView');
      if(pathname.startsWith('/tours/')){
        window.fbq('track', 'ViewContent');
    }
    }
    // Este efecto se dispara en cada cambio de URL.
    // El primer PageView ya se envió arriba, así que este se encarga de las navegaciones posteriores.
  }, [pathname, searchParams,isPixelInitialized]); // Se re-ejecuta cuando la URL cambia.

  // Este componente no renderiza ningún HTML.
  return null;
}