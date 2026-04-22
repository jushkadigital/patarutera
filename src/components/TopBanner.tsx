import { Footer } from "@/cms-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import TopBannerClient from "./top-banner-client";

export async function TopBannerComplete() {
  const footerData: Footer = await getCachedGlobal("footer", 1)();
  const redes = await getCachedGlobal("redesNegocio", 1)();
  const emailLink = footerData.navItems?.[0]?.links?.[1]?.link;
  const email =
    emailLink &&
    typeof emailLink === "object" &&
    "textInfo" in emailLink &&
    typeof emailLink.textInfo === "string"
      ? emailLink.textInfo
      : "";

  return <TopBannerClient socialNetworks={redes.network} email={email} />;
}
