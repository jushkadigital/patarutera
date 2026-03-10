"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type CheckoutStepGuardProps = {
  hasPreData: boolean;
};

export default function CheckoutStepGuard({
  hasPreData,
}: CheckoutStepGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentStep = searchParams.get("step");

    if (currentStep) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("step", hasPreData ? "predata" : "payment");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [hasPreData, pathname, router, searchParams]);

  return null;
}
