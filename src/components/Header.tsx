"use client";

import { Navbar } from "./Navbar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib2/utils";

type HeaderSocialNetwork = {
  id: string | number;
  iconName: "facebook" | "instagram" | "tiktok";
  link: string;
};

interface Props {
  socialNetworks: HeaderSocialNetwork[];
  email: string;
  isAuthenticated: boolean;
}

export const Header = ({ socialNetworks, email, isAuthenticated }: Props) => {
  const allowedPaths = ["/", "/destino"];
  const pathname = usePathname();
  const isHome = pathname == "/";
  const isTransparent = allowedPaths.includes(pathname);

  return (
    <header className={cn(isHome ? "h-0 overflow-visible " : "")}>
      <Navbar
        isHome={isHome}
        isTransparent={isTransparent}
        socialNetworks={socialNetworks}
        email={email}
        isAuthenticated={isAuthenticated}
      />
    </header>
  );
};
