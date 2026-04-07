"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@lib/analytics";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams?.toString();
    const pageLocation = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;

    trackPageView({
      pageLocation,
      pageReferrer: document.referrer || undefined,
      pageTitle: document.title || undefined,
    });
  }, [pathname, searchParams]);

  return null;
}
