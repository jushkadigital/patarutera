import { Destination, Footer } from "@/cms-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import TopBannerClient from "./top-banner-client";

interface Props {
  destinations: Destination[];
}
export async function TopBannerComplete({ destinations }: Props) {
  const footerData: Footer = await getCachedGlobal("footer", 1)();
  const redes = await getCachedGlobal("redesNegocio", 1)();
  const email: string = (footerData.navItems as any[])[0].links[1].link
    ?.textInfo;

  return (
    <TopBannerClient
      destinations={destinations}
      socialNetworks={redes.network}
      email={email}
    />
  );
}
