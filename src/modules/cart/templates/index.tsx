"use client";

import { useCallback, useEffect, useState } from "react";

import ItemsTemplate from "./items";
import Summary from "./summary";
import EmptyCartMessage from "../components/empty-cart-message";
import { registerCartRefresh, waitForNextPaint } from "@lib/util/cart-sync";
import { HttpTypes } from "@medusajs/types";

const CartTemplate = ({
  cart,
  customer,
  showExpiredCartNotice,
  hasAuthSessionCookie,
  hasMedusaSessionCookie,
}: {
  cart: HttpTypes.StoreCart | null;
  customer: HttpTypes.StoreCustomer | null;
  showExpiredCartNotice: boolean;
  hasAuthSessionCookie: boolean;
  hasMedusaSessionCookie: boolean;
}) => {
  const [localCart, setLocalCart] = useState<HttpTypes.StoreCart | null>(cart);

  const refreshCart = useCallback(async () => {
    try {
      const response = await fetch("/api/cart", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh cart state");
      }

      const data = (await response.json()) as {
        cart: HttpTypes.StoreCart | null;
      };

      setLocalCart(data.cart);
      await waitForNextPaint();
    } catch (error) {
      console.error("Failed to refresh cart after update", error);
    }
  }, []);

  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  useEffect(() => {
    const handleCartChange: EventListener = (event) => {
      const refreshPromise = refreshCart();

      registerCartRefresh(event, refreshPromise);
    };

    window.addEventListener("cart:item-added", handleCartChange);
    window.addEventListener("cart:item-removed", handleCartChange);
    window.addEventListener("cart:updated", handleCartChange);

    return () => {
      window.removeEventListener("cart:item-added", handleCartChange);
      window.removeEventListener("cart:item-removed", handleCartChange);
      window.removeEventListener("cart:updated", handleCartChange);
    };
  }, [refreshCart]);

  return (
    <div className="py-12 font-[Poppins]">
      <div className="content-container" data-testid="cart-container">
        {showExpiredCartNotice && (
          <div className="mb-6 rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
            Tu carrito ya no esta disponible, seras redirigido al checkout{" "}
          </div>
        )}
        {localCart?.items?.length ? (
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-6">
              {!customer && <></>}
              <ItemsTemplate cart={localCart} />
            </div>
            {localCart && localCart.region && (
              <Summary
                cart={localCart}
                hasAuthSessionCookie={hasAuthSessionCookie}
                hasMedusaSessionCookie={hasMedusaSessionCookie}
              />
            )}
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTemplate;
