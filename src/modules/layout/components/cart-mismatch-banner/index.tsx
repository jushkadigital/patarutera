"use client";

import { transferCart } from "@lib/data/customer";
import { ExclamationCircleSolid } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@medusajs/ui";
import { useEffect, useState } from "react";

function CartMismatchBanner() {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [actionText, setActionText] = useState("Run transfer again");

  useEffect(() => {
    let isMounted = true;

    const syncCart = async () => {
      try {
        const response = await fetch("/api/cart", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (isMounted) {
            setCart(null);
          }

          return;
        }

        const data = (await response.json()) as {
          cart?: HttpTypes.StoreCart | null;
        };

        if (isMounted) {
          setCart(data.cart ?? null);
        }
      } catch {
        if (isMounted) {
          setCart(null);
        }
      }
    };

    void syncCart();

    window.addEventListener("cart:item-added", syncCart);
    window.addEventListener("cart:item-removed", syncCart);
    window.addEventListener("cart:updated", syncCart);

    return () => {
      isMounted = false;
      window.removeEventListener("cart:item-added", syncCart);
      window.removeEventListener("cart:item-removed", syncCart);
      window.removeEventListener("cart:updated", syncCart);
    };
  }, []);

  if (!cart || !!cart.customer_id) {
    return null;
  }

  const handleSubmit = async () => {
    try {
      setIsPending(true);
      setActionText("Transferring..");

      await transferCart();
    } catch {
      setActionText("Run transfer again");
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center small:p-4 p-2 text-center bg-orange-300 small:gap-2 gap-1 text-sm mt-2 text-orange-800">
      <div className="flex flex-col small:flex-row small:gap-2 gap-1 items-center">
        <span className="flex items-center gap-1">
          <ExclamationCircleSolid className="inline" />
          Something went wrong when we tried to transfer your cart
        </span>

        <span>·</span>

        <Button
          variant="transparent"
          className="hover:bg-transparent active:bg-transparent focus:bg-transparent disabled:text-orange-500 text-orange-950 p-0 bg-transparent"
          size="base"
          disabled={isPending}
          onClick={handleSubmit}
        >
          {actionText}
        </Button>
      </div>
    </div>
  );
}

export default CartMismatchBanner;
