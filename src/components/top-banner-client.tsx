"use client";

import { useEffect, useState } from "react";
import { Destination } from "@/cms-types";
import { HttpTypes } from "@medusajs/types";
import { Header } from "./Header";
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner";

interface TopBannerClientProps {
  destinations: Destination[];
  socialNetworks: any[];
  email: string;
}

const hasMedusaAuthCookie = () => {
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .some(
      (cookieName) =>
        cookieName === "_medusa_jwt" || cookieName === "__Secure-_medusa_jwt",
    );
};

export default function TopBannerClient({
  destinations,
  socialNetworks,
  email,
}: TopBannerClientProps) {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const syncSessionState = async () => {
      setIsAuthenticated(hasMedusaAuthCookie());

      try {
        const response = await fetch("/api/cart", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as {
          cart?: HttpTypes.StoreCart | null;
        };

        setCart(data.cart ?? null);
      } catch {
        setCart(null);
      }
    };

    const handleCartChange = () => {
      void syncSessionState();
    };

    void syncSessionState();

    window.addEventListener("cart:item-added", handleCartChange);
    window.addEventListener("cart:item-removed", handleCartChange);
    window.addEventListener("cart:updated", handleCartChange);

    return () => {
      window.removeEventListener("cart:item-added", handleCartChange);
      window.removeEventListener("cart:item-removed", handleCartChange);
      window.removeEventListener("cart:updated", handleCartChange);
    };
  }, []);

  return (
    <>
      <Header
        destinations={destinations}
        socialNetworks={socialNetworks}
        email={email}
        cart={cart}
        isAuthenticated={isAuthenticated}
      />
      <CartMismatchBanner cart={cart} isAuthenticated={isAuthenticated} />
    </>
  );
}
