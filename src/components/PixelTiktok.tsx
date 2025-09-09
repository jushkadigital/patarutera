'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

const TikTokPixel = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window.ttq) {
      window.ttq.page();
      if (pathname.startsWith('/tours/') || pathname.startsWith('/paquetes/')) {
        window.ttq.track('ViewContent');
      }
    }
  }, [pathname, searchParams]);

  return null
};

export default TikTokPixel;
