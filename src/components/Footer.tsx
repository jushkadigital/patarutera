import { Destination, Footer, Footer as FooterType } from "@/cms-types"
import { getCachedGlobal } from "@/utilities/getGlobals"
import Image from "next/image"
import Link from "next/link"
import { FooterColumns } from "./Footer2"
import { SvgFacebook, SvgInstagram, SvgTiktok } from "./IconsSvg"

interface Props  {
  destination: Destination[]
}

export default async function FooterBlock({destination}:Props) {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const redes = await getCachedGlobal('redesNegocio',1)()

  const navItems = footerData?.navItems || []
  console.log(navItems)
  console.log(redes)


  const networkName = {
    facebook: SvgFacebook,
    instagram: SvgInstagram,
    tiktok: SvgTiktok
  }

  return (
    <footer className="relative rounded-t-[7vw] lg:rounded-none">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 ">
        <Image
          src="/footer1.png"
          alt="Peruvian landscape"
          fill
          className="object-cover rounded-t-[7vw] lg:rounded-none"
          priority
        />
        <div className="absolute inset-0 bg-[#2d3e3a]/50 rounded-t-[7vw] lg:rounded-none" />
      </div>

      {/* Content */}
      <div className="relative z-10    lg:px-0 pt-16 text-white w-full">
        
        <div className="flex flex-col lg:flex-row space-y-10 lg:space-x-5 mx-auto w-[90%]">
        <div className="flex justify-center">
          <div
    className="relative flex-shrink-0 w-[clamp(0px,30vw,500px)] lg:w-[clamp(0px,13.5vw,300px)]  h-[clamp(0px,30vw,500px)] lg:h-[clamp(0px,6vw,300px)]  hidden lg:block"
    >
          <Image src={"/pataLogo.png"} alt="Logo" fill className={" object-cover"} />
    </div>
    <div
    className="relative flex-shrink-0 w-[clamp(0px,37vw,500px)] lg:w-[clamp(0px,13.5vw,300px)]  h-[clamp(0px,13vw,500px)] lg:h-[clamp(0px,6vw,300px)] block lg:hidden"
    >
          <Image src={"/pataruteraLogoWhite.png"} alt="Logo" fill className={" "} />
    </div>
        </div>
          <div>
            <FooterColumns columns={navItems.filter(ele=>ele.nameColumn !== "Destinos")}/>
          </div>
          <div className="flex flex-row gap-x-3 items-center justify-center">

          <div
    className="relative flex-shrink-0 w-[clamp(0px,30vw,500px)] md:w-[clamp(0px,25vw,300px)] lg:w-[clamp(0px,13vw,300px)]  h-[clamp(0px,30vw,500px)] md:h-[clamp(0px,25vw,300px)] lg:h-[clamp(0px,13vw,300px)]"
    >
    <Image
      src="/verificadoLogo.png"
      alt="Logo2"
      fill
      className="rounded-full object-cover"
      priority
    />
  </div>
   <div
    className="relative flex-shrink-0 w-[clamp(0px,30vw,500px)] md:w-[clamp(0px,25vw,300px)] lg:w-[clamp(0px,13vw,300px)]  h-[clamp(0px,30vw,500px)] md:h-[clamp(0px,25vw,300px)] lg:h-[clamp(0px,13vw,300px)]"
  >
    <Image
      src="/protegemeLogo.png"
      alt="Logo3"
      fill
      className="rounded-full object-cover"
    />
  </div>
          </div>
          {/* Destinations */}
          <div className="hidden lg:block"> 
            <FooterColumns columns={[navItems.find(ele=>ele.nameColumn == "Destinos")]}/>
          </div>
        </div>
        
      </div>

      <div className="relative h-[100px] w-full bg-[#000000]/50  flex flex-col justify-center items gap-y-2">
      <div className=" flex flex-row justify-center items-center gap-x-10">
        {
          redes.network.map(ele=>{
           const Compo =  networkName[ele.iconName]
            return <a key={ele.id} href={ele.link} target="_blank" rel="noopener noreferrer" ><Compo height={35} width={35} /></a>

          })
        }
      </div>
      <div className="text-[#FFF] text-[clamp(0px,2.4vw,12.8px)] lg:text-[clamp(8.87px,0.86vw,16.64px)] text-center">
        Desarrollado por Jushka Digital
      </div>
      </div>

      

      {/* Colorful Bottom Border */}
      <div className="h-2 w-full grid grid-cols-4 relative">
        <div className="bg-blue-600"></div>
        <div className="bg-[#3eae64]"></div>
        <div className="bg-yellow-500"></div>
        <div className="bg-purple-600"></div>
      </div>
    </footer>
  )
}
