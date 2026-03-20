"use client";

import { useEffect } from "react";
import { Toaster, toast } from "@medusajs/ui";

const getAddedCount = (event: Event) => {
  if (!(event instanceof CustomEvent)) {
    return undefined;
  }

  const detail = event.detail;

  if (
    detail &&
    typeof detail === "object" &&
    "addedCount" in detail &&
    typeof detail.addedCount === "number"
  ) {
    return detail.addedCount;
  }

  return undefined;
};

const getToastMessage = (addedCount?: number) => {
  if (typeof addedCount === "number" && addedCount > 1) {
    return `Se agregaron ${addedCount} ítems al carrito`;
  }

  return "Se agregó al carrito";
};

export default function CartItemAddedToastBridge() {
  useEffect(() => {
    const handleItemAdded = (event: Event) => {
      toast.success(getToastMessage(getAddedCount(event)), {
        position: "top-center",
      });
    };

    window.addEventListener("cart:item-added", handleItemAdded);

    return () => {
      window.removeEventListener("cart:item-added", handleItemAdded);
    };
  }, []);

  return (
    <>
      <Toaster
        className="cart-item-added-toaster"
        position="top-center"
        offset={16}
        style={{ zIndex: 2147483647 }}
      />
      <style jsx global>{`
        .cart-item-added-toaster [data-sonner-toast][data-type="success"] {
          background-color: #2970b7 !important;
          border: 1px solid var(--border) !important;
          color: #ffffff !important;
        }

        .cart-item-added-toaster
          [data-sonner-toast][data-type="success"]
          [data-title],
        .cart-item-added-toaster
          [data-sonner-toast][data-type="success"]
          [data-description],
        .cart-item-added-toaster
          [data-sonner-toast][data-type="success"]
          [data-icon] {
          color: #ffffff !important;
        }
      `}</style>
    </>
  );
}
