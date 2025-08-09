'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as pixel from '@/lib/pixel';

export default function PixelEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // La combinación de pathname y searchParams cubre todas las navegaciones de URL.
    pixel.pageview();
  }, [pathname, searchParams]);

  // Este componente no renderiza ningún HTML.
  return null;
}