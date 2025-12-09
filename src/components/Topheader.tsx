'use client'
import { cn } from '@/lib/utils';
import { SvgFacebook, SvgInstagram, SvgTiktok, SvgWhatsapp } from "./IconsSvg"
import { Button } from './ui/button';
import { Heart, ShoppingCart, CircleUserRound, Mail } from 'lucide-react'
import { useMobile } from '@/hooks/useMobile';
import Link from 'next/link';

interface Props {
  socialNetworks: any[]
  email: string
  isHome: boolean
}

export const TopHeader = ({ isHome, socialNetworks, email }: Props) => {
  const networkName = {
    facebook: SvgFacebook,
    instagram: SvgInstagram,
    tiktok: SvgTiktok
  }

  const isMobile = useMobile({ breakpoint: 610 })

  return (
    <div className={cn(isHome ? 'h-17 overflow-visible ' : 'bg-[#2970B7]')}>
      <div className={`flex justify-between py-3 px-[clamp(21px,7.7vw,44px)]  md:px-[clamp(44px,5.7vw,110px)] items-center`} >
        <div className='flex flex-row flex-wrap justify-center items-center gap-x-2 md:gap-x-4 lg:gap-x-5 text-[11px]  sm:text-xs lg:text-md text-white'>
          <Mail size={'icon'} className='size-4' color='#fff' />
          {email}
          {
            isMobile ?
              <div></div>
              :
              <span className='sm:text-xl lg:text-3xl text-white font-light'>
                |
              </span>
          }

          <div className='flex flex-row gap-x-1 md:gap-x-4 lg:gap-x-5'>
            {
              socialNetworks.map(ele => {
                const Compo = networkName[ele.iconName]
                return <a key={ele.id} href={ele.link} target="_blank" rel="noopener noreferrer" ><Compo height={20} width={20} color='#FFF' /></a>

              })
            }
          </div>

        </div>
        <div className='flex flex-row justify-center items-center gap-x-2 sm:gap-x-4'>
          {
            isMobile ?
              <SvgWhatsapp size={20} />
              :
              <Button className='bg-[#3EAE64] rounded-2xl sm:text-xs lg:text-md' asChild>
                <a href='https://wa.link/25w6dc' target="_blank" rel="noopener noreferrer">
                  <SvgWhatsapp />
                  +51 930 770 103
                </a>
              </Button>
          }

          {isMobile ?
            <Button variant={'ghost'} className='p-0!' >
              <CircleUserRound size={'icon'} className='size-5' />
            </Button>
            :
            <Button className='text-[#2970B7] rounded-2xl bg-white uppercase font-bold sm:text-xs lg:text-md' asChild>
              <Link href={"/dashboard"} >
                Iniciar Sesion
              </Link>
            </Button>
          }

          <Button variant='ghost' className={`${isMobile ? 'p-0!' : ''}`}><Heart size={'icon'} className='size-5' color='#fff' /></Button>
          <Button variant='ghost' className={`${isMobile ? 'p-0!' : ''}`}><ShoppingCart size={'icon'} className='size-5' color='#fff' /></Button>
        </div>
      </div>

    </div>
  );
}
