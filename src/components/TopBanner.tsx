import { Destination, Footer } from '@/cms-types';
import { cn } from '@/lib2/utils';
import { getCachedGlobal } from '@/utilities/getGlobals';
import { SvgFacebook, SvgInstagram, SvgTiktok } from "./IconsSvg"
import { TopHeader } from './Topheader';
import { Header } from './Header';
import { retrieveCart } from '@lib/data/cart';


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

  const cart = await retrieveCart().catch(() => null)
  return (
    <>
      <Header destinations={destinations} socialNetworks={redes.network} email={email} cart={cart} />
    </>


  );
}
