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
    <div className={`flex items-center justify-center lg:px-0 ${isBigSize ?"h-[clamp(93px,43.6vw,855px)] lg:h-[clamp(93px,23.6vw,455px)]" :"h-[clamp(93px,44.6vw,835px)] lg:h-[clamp(93px,22.6vw,435px)]"}`}>
      <Link href={`/tours/${slug}`} className="relative w-full h-full rounded-3xl overflow-hidden">
        {/* Background Image */}
        <Image src={background} alt="Background" fill className="object-cover" priority />

        {/* Overlay */}
        <div className="absolute inset-0 opacity-60 z-10" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />

        {/* Título en la izquierda - centrado verticalmente */}
        <div className={`absolute top-1/2  transform -translate-y-1/2 text-white h-[85%] font-bold z-20 flex flex-row ${isBigSize ? 'px-20' : 'pl-[clamp(10.48px,6.5vw,88.64px)] lg:pl-[clamp(10.48px,2.5vw,48.64px)]'} w-full items-center lg:items-center`}>
        <div className="z-30 w-3/4">

          <div className={`uppercase tracking-wider opacity-90 ${isBigSize ? 'text-[clamp(8.83px,2.1vw,40.96px)]':'text-[clamp(8.83px,3.1vw,50.96px)] lg:text-[clamp(8.83px,2.1vw,40.96px)]'} font-normal`}>{type}</div>
          <div className={`font-extrabold ${isBigSize ? 'text-[clamp(13.24px,6.2vw,101.44px)] lg:text-[clamp(26.44px,6.4vw,122.88px)]':'text-[clamp(13.24px,5.2vw,91.44px)] lg:text-[clamp(13.24px,3.2vw,61.44px)]' } uppercase mb-3 multi-line-truncate multi-line-truncate-3 text-left ${isBigSize ? 'leading-[clamp(5.4px,4vw,100px)] sm:leading-[clamp(5.4px,6vw,100px)] lg:leading-[clamp(10px,5vw,150px)]' : 'leading-[clamp(5.4px,5.5vw,85px)] sm:leading-[clamp(5.4px,5.5vw,85px)] lg:leading-[clamp(5.4px,2.8vw,80.24px)]'}  max-w-full`}>{title}</div>

          {/* Barra de colores */}
          <div className="flex h-1 w-50 rounded-full overflow-hidden">
            <div className="flex-1 bg-blue-500"></div>
            <div className="flex-1 bg-purple-500"></div>
            <div className="flex-1 bg-pink-500"></div>
            <div className="flex-1 bg-orange-500"></div>
          </div>
          
        </div>
        <div className={`text-white  z-20 flex flex-col z-20 w-1/4 pt-10 justify-center`}>
        <div className={`relative z-10 flex flex-col ${isBigSize ? 'justify-end items-end':'justify-start'} `}>

        <div>

          <span className="text-sm lg:text-lg text-[#EFBA06]">S/</span>
          <span className={`${isBigSize ? 'text-[clamp(11.04px,3.66vw,71.2px)]' : 'text-[clamp(11.04px,4.66vw,81.2px)] lg:text-[clamp(11.04px,2.66vw,51.2px)]'} leading-tight  font-bold`}>{price}</span>
        </div>
          <div className="relative z-10 text-[#EFBA06] text-[clamp(3.31px,1.8vw,45.36px)] lg:text-[clamp(3.31px,0.8vw,15.36px)]">
        {perPerson}
        </div>
        </div>
        
        <div className="absolute inset-0 lg:translate-y-0 flex items-center justify-end  w-full">
          <svg
            viewBox="0 0 351 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${ isBigSize?'w-[180px] sm:w-[230px] md:w-[330px] lg:w-[290px] xl:w-[300px] 2xl:w-[280px]':'w-[180px] sm:w-[230px] md:w-[330px] lg:w-[190px] xl:w-[250px] 2xl:w-[280px]'} h-auto`}
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
