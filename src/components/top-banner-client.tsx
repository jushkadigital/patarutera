"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { useSession } from "next-auth/react";

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

export default function TopBannerClient({
  socialNetworks,
  email,
}: TopBannerClientProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

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
