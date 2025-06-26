import { Destination, Footer, Footer as FooterType } from "@/cms-types"
import { getCachedGlobal } from "@/utilities/getGlobals"
import Image from "next/image"
import Link from "next/link"
import { FooterColumns } from "./Footer2"

interface Props  {
  destination: Destination[]
}

export default async function FooterBlock({destination}:Props) {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  console.log(navItems)

  return (
    <footer className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/footer1.png"
          alt="Peruvian landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#2d3e3a]/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 text-white">
        
        <div className="flex flex-col lg:flex-row space-y-10 lg:space-x-10">
        <div>
          <Image src={"/pataruteraLogo.svg"} alt="Logo" width={350} height={400} className={""} />
        </div>
          <div>
            <FooterColumns columns={navItems.filter(ele=>ele.nameColumn !== "Destinos")}/>
          </div>
          {/* Destinations */}
          <div> 
            <FooterColumns columns={[navItems.find(ele=>ele.nameColumn == "Destinos")]}/>
          </div>
        </div>
      </div>

      {/* Colorful Bottom Border */}
      <div className="h-2 w-full grid grid-cols-4">
        <div className="bg-blue-600"></div>
        <div className="bg-[#3eae64]"></div>
        <div className="bg-yellow-500"></div>
        <div className="bg-purple-600"></div>
      </div>
    </footer>
  )
}
