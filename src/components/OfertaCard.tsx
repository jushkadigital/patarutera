'use client'
import { Media } from "@/cms-types"
import { useMobile } from "@/hooks/useMobile"
import Image from "@/components/PayloadImage"
import Link from "next/link"

interface ComponentProps {
  color?: string
  price: number
  perPerson: string
  type: string
  title: string
  background: Media
  slug: string
  isBigSize:boolean
}

export  function OfertaCardComponent({ color = "#79368C",price , perPerson, type, title, background ,slug ,isBigSize}: ComponentProps) {

  const isMobile = useMobile()
  isBigSize = isMobile ? false :isBigSize 
  return (
    <div className={`flex w-full items-center justify-center lg:px-0 ${isBigSize ?"h-[clamp(93px,43.6vw,855px)] lg:h-[clamp(93px,23.6vw,455px)]" :"h-[clamp(93px,44.6vw,835px)] lg:h-[clamp(93px,22.6vw,435px)]"}`}>
      <Link href={`/tours/${slug}`} className="relative w-full h-full rounded-3xl overflow-hidden">
        {/* Background Image */}
        <Image media={background} fill className="object-cover" priority />

        {/* Overlay */}
        <div className="absolute inset-0 opacity-60 z-10" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />

        {/* Título en la izquierda - centrado verticalmente */}
        <div className={`absolute top-1/2  transform -translate-y-1/2 text-white  font-bold z-20 flex flex-col ${isBigSize ? 'px-20' : ''} w-full items-center lg:items-center text-center`}>
        <div className="z-30 w-full">

          <div className={`uppercase tracking-wider opacity-90 ${isBigSize ? 'text-[clamp(8.83px,2.1vw,40.96px)]':'text-[clamp(8.83px,3.1vw,50.96px)] lg:text-[clamp(8.83px,2.1vw,40.96px)]'} font-normal`}>{type}</div>
          <div className={`text-center font-extrabold ${isBigSize ? 'text-[clamp(13.24px,6.2vw,101.44px)] lg:text-[clamp(26.44px,5.4vw,122.88px)]':'text-[clamp(13.24px,5.2vw,91.44px)] lg:text-[clamp(13.24px,3.2vw,61.44px)]' } uppercase mb-3 multi-line-truncate multi-line-truncate-3 ${isBigSize ? 'leading-[clamp(5.4px,4vw,100px)] sm:leading-[clamp(5.4px,6vw,100px)] lg:leading-[clamp(10px,5vw,150px)]' : 'leading-[clamp(5.4px,5.5vw,85px)] sm:leading-[clamp(5.4px,5.5vw,85px)] lg:leading-[clamp(5.4px,2.8vw,80.24px)]'}  `}>{title}</div>

          {/* Barra de colores */}
          <div className="w-full flex justify-center">
            <div className="flex h-1 w-50 rounded-full overflow-hidden">
            <div className="flex-1 bg-[#2970B7]"></div>
            <div className="flex-1 bg-[#3EAE64]"></div>
            <div className="flex-1 bg-[#EFBA06]"></div>
            <div className="flex-1 bg-[#79368C]"></div>
          </div>
          </div>
          
          
        </div>
        <div className={`text-white  z-20 flex flex-col z-20  0 justify-center mt-[20px]`}>
        <div className={`relative z-10 flex flex-col ${isBigSize ? 'justify-end items-end':'justify-start'} `}>
          <div 
          className={`rounded-2xl ${isBigSize? 'pl-[clamp(8.1px,0.8vw,15.36px)] pr-[clamp(16px,1.6vw,30.72px)] py-[clamp(5.4px,0.53vw,10.24px)]' :'pl-[clamp(8.1px,0.8vw,15.36px)] pr-[clamp(16px,1.6vw,30.72px)] py-[clamp(5.4px,0.53vw,10.24px)]'}   shadow-lg leading-none h-[60%] rounded-[10px] bg-[linear-gradient(180deg,#3EAE64_0%,#1A4829_100%)]`}
          >

        <div className="flex items-start ">
          <span className="text-sm lg:text-[clamp(9.5px,0.93vw,17.92px)] text-[#EFBA06]">S/</span>
          <div className="flex flex-col justify-center">

          <span className={`${isBigSize ? 'text-[clamp(11.04px,3.66vw,71.2px)]' : 'text-[clamp(11.04px,4.66vw,81.2px)] lg:text-[clamp(11.04px,2.4vw,51.2px)]'} leading-none lg:text-[clamp(11.04px,2.4vw,51.2px)] font-bold text-center`}>{price}</span>
          <div className="relative z-10 text-[#EFBA06] text-[clamp(3.31px,1.8vw,45.36px)] lg:text-[clamp(3.31px,0.66vw,12.8px)]">
        {perPerson}
        </div>
          </div>
          
        </div>
          
          </div>
        </div>
        
        <div className="absolute inset-0 lg:translate-y-0 flex items-center justify-end  w-full">
          
        </div>
        </div>
        <div className=" leading-none rounded-b-[6px] bg-[linear-gradient(0deg,#EFBA06_0%,#EFBA06_100%)] uppercase p-[clamp(5.4px,0.5vw,10.24px)] text-sm lg:text-[clamp(9.5px,0.93vw,17.92px)] ">
          Ver oferta
        </div>
        </div>

        {/* Precio en la derecha */}
       

        {/* Texto adicional del precio */}

        {/* SVG con ancho máximo de 200px */}
        
      </Link>
    </div>
  )
}
