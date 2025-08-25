import { Destination, Footer } from '@/cms-types';
import { cn } from '@/lib/utils';
import { getCachedGlobal } from '@/utilities/getGlobals';
import { SvgFacebook, SvgInstagram, SvgTiktok } from "./IconsSvg"
import { TopHeader } from './Topheader';
import { Header } from './Header';


interface Props {
  destinations: Destination[]
}
export async function TopBannerComplete({ destinations }: Props) {

  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const redes = await getCachedGlobal('redesNegocio', 1)()
  const email: string = (footerData.navItems as any[])[0].links[1].link?.textInfo

  const networkName = {
    facebook: SvgFacebook,
    instagram: SvgInstagram,
    tiktok: SvgTiktok
  }

  return (
    <>
      <Header destinations={destinations} socialNetworks={redes.network} email={email} />
    </>


  );
}
