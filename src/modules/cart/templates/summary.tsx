"use client";

import { Button, Heading } from "@medusajs/ui";

import CartTotals from "@modules/common/components/cart-totals";
import Divider from "@modules/common/components/divider";
import DiscountCode from "@modules/checkout/components/discount-code";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { usePopupAuth } from "@/hooks/usePopupAuth";
import { HttpTypes } from "@medusajs/types";
import { useState } from "react";

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[];
  };
  hasAuthSessionCookie: boolean;
  hasMedusaSessionCookie: boolean;
};

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  return "payment";
}

const Summary = ({
  cart,
  hasAuthSessionCookie,
  hasMedusaSessionCookie,
}: SummaryProps) => {
  const step = getCheckoutStep(cart);
  const checkoutHref = "/checkout?step=" + step;
  const { openPopup, isLoading, error } = usePopupAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const canContinueToCheckout = hasMedusaSessionCookie || hasAuthSessionCookie;

  console.log("XRP")
  console.log(hasMedusaSessionCookie)
  console.log(hasAuthSessionCookie)
  const handleCheckoutClick = async () => {
    if (canContinueToCheckout) {
      return;
    }

    if (hasAuthSessionCookie && !hasMedusaSessionCookie) {
      setIsSyncing(true);
      const localizedCheckoutPath = window.location.pathname.replace(
        /\/cart$/,
        checkoutHref,
      );
      const syncUrl = `/api/auth/medusa-sync?callbackUrl=${encodeURIComponent(localizedCheckoutPath)}`;
      window.location.assign(syncUrl);
      return;
    }

    try {
      await openPopup({ provider: "keycloak" });
      window.location.assign(checkoutHref);
    } catch { }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />
      {canContinueToCheckout ? (
        <LocalizedClientLink href={checkoutHref} data-testid="checkout-button">
          <Button className="w-full h-10">Go to checkout</Button>
        </LocalizedClientLink>
      ) : (
        <>
          <Button
            className="w-full h-10"
            onClick={() => void handleCheckoutClick()}
            disabled={isLoading || isSyncing}
            aria-busy={isLoading || isSyncing}
            data-testid="checkout-button"
          >
            {isSyncing
              ? "Syncing session..."
              : isLoading
                ? "Connecting..."
                : "Go to checkout"}
          </Button>
          {error ? (
            <p className="text-sm text-red-500" role="alert" aria-live="polite">
              {error}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Summary;
