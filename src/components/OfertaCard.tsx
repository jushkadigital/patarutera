'use client'
import { useMobile } from "@/hooks/useMobile"
import Image from "next/image"
import Link from "next/link"

interface ComponentProps {
  color?: string
  price: number
  perPerson: string
  type: string
  title: string
  background: string
  slug: string
  isBigSize:boolean
}

export  function OfertaCardComponent({ color = "#79368C",price , perPerson, type, title, background ,slug ,isBigSize}: ComponentProps) {

  const isMobile = useMobile()
  isBigSize = isMobile ? false :isBigSize 
  return (
    <div className={`flex items-center justify-end lg:px-0 ${isBigSize ?"h-[430px]" :"h-[400px]"}`}>
      <Link href={`/tours/${slug}`} className="relative w-full h-full rounded-3xl overflow-hidden">
        {/* Background Image */}
        <Image src={background} alt="Background" fill className="object-cover" priority />

        {/* Overlay */}
        <div className="absolute inset-0 opacity-60 z-10" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />

        {/* Título en la izquierda - centrado verticalmente */}
        <div className={`absolute top-1/2  transform -translate-y-1/2 text-white font-bold z-20 flex flex-col lg:flex-row ${isBigSize ? 'px-20' : 'px-10'}  lg:justify-between w-full items-stretch lg:items-center`}>
        <div>

          <div className="text-2xl uppercase tracking-wider opacity-90">{type}</div>
          <div className={`font-black ${isBigSize ? 'text-6xl lg:text-7xl':'text-3xl lg:text-4xl' } uppercase font-black mb-3`}>{title}</div>

          {/* Barra de colores */}
          <div className="flex h-1 w-32 rounded-full overflow-hidden">
            <div className="flex-1 bg-blue-500"></div>
            <div className="flex-1 bg-purple-500"></div>
            <div className="flex-1 bg-pink-500"></div>
            <div className="flex-1 bg-orange-500"></div>
            <div className="flex-1 bg-yellow-500"></div>
            <div className="flex-1 bg-green-500"></div>
            <div className="flex-1 bg-teal-500"></div>
          </div>
          
        </div>
         <div className="  transform  text-white  z-20 flex lg:items-baseline items-end flex-col">
        <div className="relative z-10">

          <span className="text-sm text-[#EFBA06]">S/</span>
          <span className={`${isBigSize ? 'text-4xl lg:text-6xl' : 'text-3xl lg:text-5xl'}  font-bold`}>{price}</span>
        </div>
        <div className="relative z-10 text-[#EFBA06]">
        {perPerson}
        </div>
        <div className="absolute inset-0 transform translate-y-1/3 lg:translate-y-0 flex items-center justify-end  ">
          <svg
            viewBox="0 0 351 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${ isBigSize?'w-[300px]':'w-[200px]'} h-auto`}
          >
            <path
              d="M0.00491333 97.3629C26.4851 119.367 55.519 138.386 86.6057 153.899C146.977 184.046 215.063 201 287.103 201C308.79 201 330.123 199.461 351 196.491V0C273.357 63.8383 174.012 102.142 65.7045 102.142C43.3839 102.142 21.4464 100.51 0 97.3629H0.00491333Z"
              fill={color}
              fillOpacity="0.8"
            />
            <defs>
              <linearGradient
                id="paint0_linear_542_2306"
                x1="244.613"
                y1="-23.0611"
                x2="167.484"
                y2="166.19"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={color} />
                <stop offset="1" stopColor={color} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        </div>
        </div>

        {/* Precio en la derecha */}
       

        {/* Texto adicional del precio */}

        {/* SVG con ancho máximo de 200px */}
        
      </Link>
    </div>
  )
}
