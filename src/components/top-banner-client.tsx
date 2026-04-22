"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Header } from "./Header";

type HeaderSocialNetwork = {
  id: string | number;
  iconName: "facebook" | "instagram" | "tiktok";
  link: string;
};

const CartMismatchBanner = dynamic(
  () => import("@modules/layout/components/cart-mismatch-banner"),
  {
    ssr: false,
  },
);

interface TopBannerClientProps {
  socialNetworks: HeaderSocialNetwork[];
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
  socialNetworks,
  email,
}: TopBannerClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const syncSessionState = () => {
      setIsAuthenticated(hasMedusaAuthCookie());
    };

    syncSessionState();
    window.addEventListener("focus", syncSessionState);

    return () => {
      window.removeEventListener("focus", syncSessionState);
    };
  }, []);

  return (
    <>
      <Header
        socialNetworks={socialNetworks}
        email={email}
        isAuthenticated={isAuthenticated}
      />
      {isAuthenticated ? <CartMismatchBanner /> : null}
    </>
  );
}
