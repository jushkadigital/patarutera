"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib2/utils";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Destination } from "@/cms-types";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { TopHeader } from "./Topheader";
import { StoreCart } from "@medusajs/types";

// Asume que tienes un logo en esta ruta, o reemplázalo
const LOGO_URL = "/pataruteraLogoWhite.png"; // Reemplaza con la ruta real de tu logo
const LOGO_URLCOLOR = "/pataruteraLogo.png"; // Reemplaza con la ruta real de tu logo
interface Props {
  destinations: Destination[];
  isHome: boolean;
  isTransparent: boolean;
  socialNetworks: any[];
  email: string;
  cart: StoreCart | null;
  isAuthenticated: boolean;
}
export const Navbar = ({
  destinations,
  isHome,
  isTransparent,
  socialNetworks,
  email,
  cart,
  isAuthenticated,
}: Props) => {
  //const pathname = usePathname();
  //const isHome = pathname === '/';

  const navbarClasses = cn(
    "w-full transition-all duration-300 ease-in-out z-50 sticky top-0",
    isTransparent
      ? "bg-transparent text-white pb-6"
      : "bg-background text-foreground shadow-sm pb-4",
  );

  return (
    <nav className={navbarClasses}>
      <TopHeader
        socialNetworks={socialNetworks}
        email={email}
        isHome={isHome}
        cart={cart}
        isAuthenticated={isAuthenticated}
      />
      <div className=" mx-auto flex items-center justify-around px-4">
        {/* Sección 1: Logo */}
        <Link href="/pe" className="flex items-center space-x-2" prefetch={false}>
          <Image
            src={isHome ? LOGO_URL : LOGO_URLCOLOR}
            alt="Logo"
            width={200}
            height={200}
            className={cn("w-[150px] lg:w-[200px]")}
          />
        </Link>
        <div></div>

        {/* Secciones 2, 3, 4: Navegación Principal y Dropdown */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  isHome
                    ? "bg-transparent text-white"
                    : isTransparent
                      ? "bg-transparent text-[#2970b7]"
                      : "text-[#2970b7]",
                )}
              >
                <Link href="/pe/destino">Destinos</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {/* Sección 2: Enlace 1 */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  isHome
                    ? "bg-transparent text-white"
                    : isTransparent
                      ? "bg-trasparent text-[#2970b7]"
                      : "text-[#2970b7]",
                )}
              >
                <Link href="/pe/paquetes?destinations=Ica,Cusco">
                  Paquetes
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  isHome
                    ? "bg-transparent text-white"
                    : isTransparent
                      ? "bg-transparent text-[#2970b7]"
                      : "text-[#2970b7]",
                )}
              >
                <Link href="/pe/tours?destination=Cusco&categories=">
                  Tours
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Sección 4: Enlace 2 */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  isHome
                    ? "bg-transparent text-white"
                    : isTransparent
                      ? "bg-transparent text-[#2970b7]"
                      : "text-[#2970b7]",
                )}
              >
                <Link href="/pe/posts">Blog</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Sección 5: Botón CTA */}

        {/* Placeholder para menú móvil si es necesario */}
        <div className="md"> </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Menu
              size={40}
              className={cn(
                "md:hidden",
                isHome
                  ? "text-white hover:bg-white/10"
                  : "text-[#2970b7] hover:bg-gray-100",
              )}
            />
          </SheetTrigger>
          <SheetContent side="left" className="w-[400px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-6 justify-center">
              {/* Logo en el menú móvil */}

              <SheetClose asChild>
                <Link
                  href="/pe"
                  className="flex items-center justify-center space-x-2 mb-6"
                >
                  <Image
                    src={LOGO_URLCOLOR || "/placeholder.svg"}
                    alt="Logo"
                    width={150}
                    height={150}
                  />
                </Link>
              </SheetClose>
              {/* Destinos con Collapsible */}
              <SheetClose asChild>
                <Link
                  href="/pe/destino"
                  className="py-2 text-3xl font-semibold text-[#2970b7] hover:text-[#1e5a9b] transition-colors text-center"
                >
                  Destinos
                </Link>
              </SheetClose>
              {/* Paquetes */}
              <SheetClose asChild>
                <Link
                  href="/pe/paquetes?destinations=Ica,Cusco"
                  className="py-2 text-3xl font-semibold text-[#2970b7] hover:text-[#1e5a9b] transition-colors text-center"
                >
                  Paquetes
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/pe/tours?destination=Cusco&categories="
                  className="py-2 text-3xl font-semibold text-[#2970b7] hover:text-[#1e5a9b] transition-colors text-center"
                >
                  Tours
                </Link>
              </SheetClose>
              {/* Blog */}
              <SheetClose asChild>
                <Link
                  href="/pe/posts"
                  className="py-2 text-3xl font-semibold text-[#2970b7] hover:text-[#1e5a9b] transition-colors text-center"
                >
                  Blog
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; isHome: boolean }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        asChild
        className={cn(
          navigationMenuTriggerStyle(),
          props.isHome
            ? "bg-transparent hover:bg-white/10 text-white"
            : "text-[#2970b7]",
        )}
      >
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground  text-lg leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
