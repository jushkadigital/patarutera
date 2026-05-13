"use client";
import dynamic from "next/dynamic";
import * as React from "react";
import { trackContact } from "@/lib/analytics";
import { cn } from "@/lib2/utils";
import { SvgFacebook, SvgInstagram, SvgTiktok, SvgWhatsapp } from "./IconsSvg";
import { Button } from "./ui/button";
import { Heart, ShoppingCart, CircleUserRound, Mail } from "lucide-react";
import { useMobile } from "@/hooks/useMobile";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const LazyCartDropdown = dynamic(
  () => import("@modules/layout/components/cart-dropdown"),
  {
    ssr: false,
    loading: () => <CartLinkFallback />,
  },
);

type SocialNetworkName = "facebook" | "instagram" | "tiktok";

type SocialNetwork = {
  id: string | number;
  iconName: SocialNetworkName;
  link: string;
};

interface Props {
  socialNetworks: SocialNetwork[];
  email: string;
  isHome: boolean;
  isAuthenticated: boolean;
}

function CartLinkFallback() {
  return (
    <LocalizedClientLink
      className="hover:text-ui-fg-base flex gap-2 text-white"
      href="/cart"
      data-testid="nav-cart-link"
      aria-label="Ver carrito"
    >
      <ShoppingCart size={"icon"} className="size-5" color="#fff" />
    </LocalizedClientLink>
  );
}

export const TopHeader = ({
  isHome,
  socialNetworks,
  email,
  isAuthenticated,
}: Props) => {
  const whatsappUrl = "https://wa.link/25w6dc";
  const networkName = {
    facebook: SvgFacebook,
    instagram: SvgInstagram,
    tiktok: SvgTiktok,
  };

  const isMobile = useMobile({ breakpoint: 610 });
  const [shouldLoadCartDropdown, setShouldLoadCartDropdown] =
    React.useState(false);

  const loadCartDropdown = React.useCallback(() => {
    setShouldLoadCartDropdown(true);
  }, []);

  React.useEffect(() => {
    const handleCartActivity = () => {
      loadCartDropdown();
    };

    window.addEventListener("cart:item-added", handleCartActivity);
    window.addEventListener("cart:item-removed", handleCartActivity);
    window.addEventListener("cart:updated", handleCartActivity);

    return () => {
      window.removeEventListener("cart:item-added", handleCartActivity);
      window.removeEventListener("cart:item-removed", handleCartActivity);
      window.removeEventListener("cart:updated", handleCartActivity);
    };
  }, [loadCartDropdown]);

  const handleWhatsappClick = () => {
    trackContact({
      contentName: "Top Header WhatsApp",
      contentCategory: "site_header",
      contentType: "contact",
      description: "WhatsApp contact from the top header",
      pageLocation: window.location.href,
    });
  };

  return (
    <div className={cn(isHome ? "h-17 overflow-visible " : "bg-[#2970B7]")}>
      <div
        className={`flex min-h-[76px] justify-between py-3 px-[clamp(21px,7.7vw,44px)] md:min-h-[72px] md:px-[clamp(44px,5.7vw,110px)] items-center`}
      >
        <div className="flex flex-row flex-wrap justify-center items-center gap-x-2 md:gap-x-4 lg:gap-x-5 text-[11px]  sm:text-xs lg:text-md text-white">
          <Mail size={"icon"} className="size-4" color="#fff" />
          {email}
          {isMobile ? (
            <div></div>
          ) : (
            <span className="sm:text-xl lg:text-3xl text-white font-light">
              |
            </span>
          )}

          <div className="flex flex-row gap-x-1 md:gap-x-4 lg:gap-x-5">
            {socialNetworks.map((ele) => {
              const Compo = networkName[ele.iconName];

              if (!Compo) {
                return null;
              }

              return (
                <a
                  key={ele.id}
                  href={ele.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Compo height={20} width={20} color="#FFF" />
                </a>
              );
            })}
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-x-2 sm:gap-x-4">
          {isMobile ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              onClick={handleWhatsappClick}
              className="inline-flex items-center justify-center"
            >
              <SvgWhatsapp size={20} />
            </a>
          ) : (
            <Button
              className="bg-[#3EAE64] rounded-2xl sm:text-xs lg:text-md"
              asChild
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsappClick}
              >
                <SvgWhatsapp />
                +51 930 770 103
              </a>
            </Button>
          )}

          {isAuthenticated ? (
            <LocalizedClientLink
              href="/account"
              data-testid="profile-link-top-header"
            >
              <Button
                className={cn(
                  "rounded-2xl uppercase font-bold sm:text-xs lg:text-md",
                  isMobile
                    ? "p-0! bg-transparent text-white"
                    : "text-[#2970B7] bg-white",
                )}
              >
                {isMobile ? (
                  <CircleUserRound
                    size={"icon"}
                    className="size-5 text-white"
                    color="#fff"
                  />
                ) : (
                  "Mi perfil"
                )}
              </Button>
            </LocalizedClientLink>
          ) : isMobile ? (
            <LocalizedClientLink href="/account">
              <Button variant={"ghost"} className="p-0!">
                <CircleUserRound
                  size={"icon"}
                  className="size-5 text-white"
                  color="#fff"
                />
              </Button>
            </LocalizedClientLink>
          ) : (
            <LocalizedClientLink href="/account">
              <Button className="text-[#2970B7] rounded-2xl bg-white uppercase font-bold sm:text-xs lg:text-md">
                Iniciar Sesion
              </Button>
            </LocalizedClientLink>
          )}

          <Button variant="ghost" className={`${isMobile ? "p-0!" : ""}`}>
            <Heart size={"icon"} className="size-5" color="#fff" />
          </Button>

          <div
            className="flex"
            onMouseEnter={loadCartDropdown}
            onFocus={loadCartDropdown}
            onTouchStart={loadCartDropdown}
          >
            {shouldLoadCartDropdown ? (
              <LazyCartDropdown />
            ) : (
              <CartLinkFallback />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
