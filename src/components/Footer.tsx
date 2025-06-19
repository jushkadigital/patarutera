import { Destination, Footer, Footer as FooterType } from "@/cms-types"
import { getCachedGlobal } from "@/utilities/getGlobals"
import Image from "next/image"
import Link from "next/link"
import { FooterColumns } from "./Footer2"

interface Props  {
  destination: Destination[]
}
 const footerDataExample = [
    {
      id: "68518570dfdc1679a6aeaff9",
      nameColumn: "INFORMACIÓN DE CONTACTO",
      links: [
        {
          id: "68518575dfdc1679a6aeaffb",
          link: {
            type: "text",
            newTab: null,
            url: null,
            textInfo: "+51 930 770 103",
            label: null,
            icon: "Phone",
          },
        },
        {
          id: "68518584dfdc1679a6aeaffd",
          link: {
            type: "text",
            newTab: null,
            url: null,
            textInfo: "ventas@patarutera.com",
            label: null,
            icon: "Mail",
          },
        },
        {
          id: "685185a5dfdc1679a6aeafff",
          link: {
            type: "text",
            newTab: null,
            url: null,
            textInfo: "Av. Tacna 168 Wánchaq - Cusco",
            label: null,
            icon: "MapPin",
          },
        },
      ],
    },
    {
      id: "685185b9dfdc1679a6aeb001",
      nameColumn: "Destinos",
      links: [
        {
          id: "685185d2dfdc1679a6aeb003",
          link: {
            type: "custom",
            newTab: null,
            url: "destinos?destination=Cusco&categories=",
            textInfo: null,
            label: "Cusco",
            icon: "ChevronRight",
          },
        },
        {
          id: "685186bddfdc1679a6aeb005",
          link: {
            type: "custom",
            newTab: null,
            url: "destinos?destination=Ica&categories=",
            textInfo: null,
            label: "Ica",
            icon: "ChevronRight",
          },
        },
        {
          id: "685186d2dfdc1679a6aeb007",
          link: {
            type: "custom",
            newTab: null,
            url: "destinos?destination=Puerto%20Maldonado&categories=",
            textInfo: null,
            label: "Puerto Maldonado",
            icon: "ChevronRight",
          },
        },
      ],
    },
    {
      id: "68518797dfdc1679a6aeb009",
      nameColumn: "Horarios",
      links: [
        {
          id: "6851879fdfdc1679a6aeb00b",
          link: {
            type: "reference",
            newTab: null,
            reference: {
              relationTo: "tours",
              value: {
                id: 1,
                title: "Tour Valle Sagrado",
                slug: "tour-valle-sagrado",
              },
            },
            url: null,
            textInfo: null,
            label: "Pagina Prueba",
            icon: null,
          },
        },
      ],
    },
  ]

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
        
        <div className="flex flex-row space-x-10">
        <div>
          <Image src={"/pataruteraLogo.svg"} alt="Logo" width={350} height={400} className={""} />
        </div>
          <div>
            <FooterColumns columns={footerDataExample.filter(ele=>ele.nameColumn !== "Destinos")}/>
          </div>
          {/* Destinations */}
          <div> 
            <FooterColumns columns={[footerDataExample.find(ele=>ele.nameColumn == "Destinos")]}/>
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
