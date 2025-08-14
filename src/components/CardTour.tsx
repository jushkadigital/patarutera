"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Destination, Media, Paquete, Post, Tour } from "@/cms-types";
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import RichText from "./RichText"

export type CardTourData = Pick<Tour, 'id' | 'title'| 'miniDescription' | 'featuredImage' | 'Desde' | 'price' | 'Person desc' | 'iconMaxPassengers' | 'maxPassengers' |'iconDifficulty' | 'difficulty' | 'slug' | 'destinos'>


interface CardTourProps {
  unitData: CardTourData
  mode?: "grid" | "list"
}

const trad = {
  easy: 'Facil',
  medium: 'Intermedio',
  hard: 'Dificil'
}

export default function CardTour({ unitData, mode = "list" }: CardTourProps) {
  console.log("render card")


  if (mode === "grid") {
    return (
      <Card className="w-full max-w-[435px] mx-auto overflow-hidden rounded-3xl shadow-lg py-0 gap-3 h-[clamp(0px,166vw,1341.2px)] sm:h-[clamp(190.44px,74vw,883.2px)] lg:h-[clamp(190.44px,46vw,883.2px)] group hover:shadow-2xl transition-all duration-500 hover:shadow-blue-500/25">
          <Link href={`/tours/${unitData.slug}`} className="h-[63%]">
        <div className="relative h-full  w-full overflow-hidden">
          <div className="absolute top-2 left-2 sm:top-4 md:top-3 lg:top-1 sm:left-4 z-10 w-fit">
            <Badge variant="outline" className="bg-white  py-[clamp(1.3px,0.9vw,4.56px)] sm:py-[clamp(1.3px,0.6vw,4.56px)] lg:py-[clamp(1.3px,0.4vw,4.56px)] px-[clamp(0px,1.92vw,10.24px)]  lg:px-[clamp(3.31px,0.8vw,15.16px)]  rounded-full border-0  ">
              <span className="text-[#79368c] font-semibold uppercase text-[clamp(0px,2.8vw,15.36px)] sm:text-[clamp(0px,1.5vw,15.36px)] lg:text-[clamp(3.5px,0.8vw,16.64px)]">
                {unitData.destinos && (unitData.destinos as Destination).name}
              </span>
            </Badge>
          </div>
          <Image
            alt={unitData.title || "Imagen del Tour"}
            src={(unitData.featuredImage as Media).url! || "/placeholder.svg"}
            fill
            className=" object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-2"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

            {/* Efecto de brillo que se mueve */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
          </Link>

        {/* Content section */}
        <CardContent className="px-4 sm:px-6 h-[37%]">
          {/* title */}
        <Link href={`/tours/${unitData.slug}`}>
        <div className="flex justify-center items-center h-[clamp(0px,10.89vw,111.6px)] sm:h-[clamp(0px,3.19vw,111.6px)] lg:h-[clamp(12px,3vw,57.6px)]">
          <h2 className="text-[#2970b7] text-[clamp(0px,4.83vw,49.46px)]  sm:text-[clamp(5.96px,1.9vw,24.96px)] lg:text-[clamp(5.52px,1.3vw,25.6px)] font-bold text-center leading-tight  multi-line-truncate multi-line-truncate-2">
            {unitData.title}
          </h2>
        </div>
          </Link>
          {/* miniDescription */}
          <div className="text-[#6a6a6a]">
            <RichText data={unitData.miniDescription} enableGutter={false} className="h-[clamp(0px,10.07vw,124px)] sm:h-[clamp(0px,6.07vw,124px)] lg:h-[clamp(13.8px,3.3vw,64px)]! !my-1 lg:!my-1 prose-custom-lg  prose-pink"/>
          </div>

          <div className="flex flex-row flex-wrap justify-around lg:justify-around items-center sm:items-end mb-0 px-2  gap-0 sm:gap-0  mt-[clamp(0px,2.41vw,24.73px)] lg:mt-[clamp(2.7px,0.6vw,12.8px)]">
            <div className="text-center sm:text-left">
              {/* desde */}
              <p className="text-[#6a6a6a]  text-[clamp(13.28px,3.2vw,33.84px)]  sm:text-[clamp(5.68px,1.5vw,33.84px)] lg:text-[clamp(3.5px,0.86vw,16.64px)] ">{unitData.Desde}</p>
              <div className="flex items-baseline justify-center sm:justify-start">
                {/* price */}
                <span className="text-[#2970b7] text-[clamp(0px,6.76vw,69.25px)] sm:text-[clamp(0px,2.76vw,69.25px)]  lg:text-[clamp(7.78px,1.86vw,35.84px)] font-bold">S/. {unitData.price}</span>
              </div>
              {/* Person desc */}
              <p className="text-[#6a6a6a] text-[clamp(0px,2.65vw,27.2px)] sm:text-[clamp(0px,1.15vw,27.2px)] lg:text-[clamp(3.03px,0.7vw,14.08px)]">{unitData["Person desc"]}</p>
            </div>

            <div className="flex flex-col items-center justify-center lg:gap-[clamp(0.2px,0.1vw,3px)] h-full">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <Image
                        src={(unitData.iconMaxPassengers as Media).url! || "/placeholder.svg"}
                        alt="Max Passengers"
                        width={0}
                        height={0}
                      className="w-[clamp(0px,4.33vw,44.2px)] sm:w-[clamp(0px,2.33vw,44.2px)] lg:w-[clamp(4.9px,1.2vw,23px)] h-auto"
                      />
                      <span className="text-[#6a6a6a] text-[clamp(0px,2.65vw,27.20px)] sm:text-[clamp(0px,1.15vw,27.20px)] lg:text-[clamp(3.03px,0.7vw,14.08px)] mt-1">Hasta {unitData.maxPassengers}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Capacidad máxima de {unitData.maxPassengers} personas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <Image
                        src={(unitData.iconDifficulty as Media).url! || "/placeholder.svg"}
                        alt="Difficulty"
                        width={0}
                        height={0}
                      className="w-[clamp(0px,4.33vw,44.2px)] sm:w-[clamp(0px,2.33vw,44.2px)] lg:w-[clamp(4.9px,1.2vw,23px)] h-auto"
                        
                      />
                      <span className="text-[#6a6a6a] text-[clamp(0px,2.65vw,27.20px)] sm:text-[clamp(0px,1.15vw,27.20px)] lg:text-[clamp(3.03px,0.7vw,14.08px)] mt-1">{trad[unitData.difficulty]}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nivel de dificultad {unitData.difficulty}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="w-full flex flex-row mt-[clamp(0px,4.1vw,42.04px)] sm:mt-[clamp(0px,1.5vw,42.04px)] lg:mt-[clamp(4.6px,1.13vw,21.76px)]">
            <div className="w-1/2"></div>
            <Link href={`/tours/${unitData.slug}`} className="w-full flex justify-center cursor-pointer w-1/2">
           <Button className="w-fit h-fit bg-[#3eae64] hover:bg-[#35a058] text-white font-semibold  py-[clamp(0px,1.20vw,12.36px)] sm:py-[clamp(0px,0.70vw,12.36px)] lg:py-[clamp(1.38px,0.3vw,6.4px)] px-[clamp(0px,2.89vw,29.68px)]  sm:px-[clamp(0px,1.49vw,29.68px)] lg:px-[clamp(3.31px,0.8vw,15.36px)]  text-[clamp(0px,3.86vw,39.57px)] sm:text-[clamp(0px,1.86vw,39.57px)] lg:text-[clamp(4.4px,1vw,20.48px)] rounded-full cursor-pointer ">
              Ver Detalles
            </Button>
          </Link>

          </div>
          
        </CardContent>

      </Card>
    )
  } else {
    // mode === 'list' - Responsive: vertical on mobile, horizontal on larger screens
    return (
      <Card className="overflow-hidden gap-1! shadow-lg w-full rounded-3xl flex flex-row py-0 md:h-[clamp(191px,25.66vw,558px)] lg:h-[clamp(191px,18.66vw,358px)]  group hover:shadow-2xl transition-all duration-500 hover:shadow-blue-500/25">
        {/* Section 1: Image */}
        
          <Link href={`/tours/${unitData.slug}`} className="w-1/3">
        <div className=" relative h-full  overflow-hidden">
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
            
            <Badge variant="outline" className="bg-white  py-[clamp(1.3px,0.9vw,4.56px)] sm:py-[clamp(1.3px,0.6vw,4.56px)] lg:py-[clamp(1.3px,0.4vw,4.56px)] px-[clamp(0px,1.92vw,10.24px)]  lg:px-[clamp(3.31px,0.8vw,15.16px)]  rounded-full border-0  ">
              <span className="text-[#79368c] font-semibold uppercase text-[clamp(0px,2.8vw,15.36px)] sm:text-[clamp(0px,1.5vw,15.36px)] lg:text-[clamp(3.5px,0.8vw,16.64px)]">
                {unitData.destinos && (unitData.destinos as Destination).name}
              </span>
            </Badge>
          </div>

          <Image
            alt={unitData.title || "Imagen del Tour"}
            src={(unitData.featuredImage as Media).url! || "/placeholder.svg"}
            fill
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-2"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

            {/* Efecto de brillo que se mueve */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
        </Link>

        {/* Section 2: Title and Description */}
        <div className="w-1/3 p-4 sm:p-2 flex flex-col justify-center gap-y-3 md:border-r border-gray-100">
        <Link href={`/tours/${unitData.slug}`}>
        <div className="flex justify-center items-center min-h-15">
            <h2 className="text-[#2970b7] text-2xl sm:text-[clamp(13.65px,2.3vw,25.6px)] md:text-[clamp(13.65px,2.3vw,25.6px)] lg:text-[clamp(13.65px,1.3vw,25.6px)] font-bold text-center leading-tight  multi-line-truncate multi-line-truncate-2">
            {unitData.title}
          </h2>
        </div>
        </Link>
          <div className="text-[#6a6a6a]  text-center md:text-left">
            <RichText data={unitData.miniDescription} enableGutter={false} className="min-h-1!  !my-2 "/>
          </div>
        </div>

        {/* Section 3: Price, Icons and Button */}
        <div className="w-1/3 p-1 sm:p-1 flex flex-col justify-center">
          <div className="flex flex-col justify-center items-center">
            <div className="mb-4 sm:mb-6 text-center">
              <p className="text-[#6a6a6a] text-sm mb-1 text-[#6a6a6a]  text-[clamp(13.28px,3.2vw,33.84px)]  sm:text-[clamp(5.68px,1.5vw,33.84px)] lg:text-[clamp(3.5px,0.86vw,16.64px)] ">{unitData.Desde}</p>
              <div className="flex items-baseline justify-center">
                <span className="text-[#2970b7] text-3xl sm:text-4xl font-bold text-[#2970b7] text-[clamp(0px,6.76vw,69.25px)] sm:text-[clamp(0px,2.76vw,69.25px)]  lg:text-[clamp(7.78px,1.86vw,35.84px)] font-bold">S/. {unitData.price}</span>
              </div>
              <p className="text-[#6a6a6a] text-sm text-[#6a6a6a] text-[clamp(0px,2.65vw,27.2px)] sm:text-[clamp(0px,1.15vw,27.2px)] lg:text-[clamp(3.03px,0.7vw,14.08px)]">{unitData["Person desc"]}</p>
            </div>

            <div className="flex gap-6 sm:gap-6 mb-4 sm:mb-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <Image
                        src={(unitData.iconMaxPassengers as Media).url! || "/placeholder.svg"}
                        alt="Max Passengers"
                        width={16}
                        height={13}
                        className="w-[clamp(0px,4.33vw,44.2px)] sm:w-[clamp(0px,2.33vw,44.2px)] lg:w-[clamp(4.9px,1.2vw,23px)] h-auto"
                      />
                      <span className="text-[#6a6a6a] text-[clamp(0px,2.65vw,27.20px)] sm:text-[clamp(0px,1.15vw,27.20px)] lg:text-[clamp(3.03px,0.7vw,14.08px)] ">Hasta {unitData.maxPassengers}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Capacidad máxima de {unitData.maxPassengers} personas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <Image
                        src={(unitData.iconDifficulty as Media).url! || "/placeholder.svg"}
                        alt="Difficulty"
                        width={16}
                        height={13}
                        className="w-[clamp(0px,4.33vw,44.2px)] sm:w-[clamp(0px,2.33vw,44.2px)] lg:w-[clamp(4.9px,1.2vw,23px)] h-auto"
                      />
                      <span className="text-[#6a6a6a] text-[clamp(0px,2.65vw,27.20px)] sm:text-[clamp(0px,1.15vw,27.20px)] lg:text-[clamp(3.03px,0.7vw,14.08px)] mt-1">{trad[unitData.difficulty]} </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nivel de dificultad {unitData.difficulty}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Link href={`/tours/${unitData.slug}`} className="w-full flex justify-center">
          <Button className="w-fit h-fit bg-[#3eae64] hover:bg-[#35a058] text-white font-semibold  py-[clamp(0px,1.20vw,12.36px)] sm:py-[clamp(0px,0.70vw,12.36px)] lg:py-[clamp(1.38px,0.3vw,6.4px)] px-[clamp(0px,2.89vw,29.68px)]  sm:px-[clamp(0px,1.49vw,29.68px)] lg:px-[clamp(3.31px,0.8vw,15.36px)]  text-[clamp(0px,3.86vw,39.57px)] sm:text-[clamp(0px,1.86vw,39.57px)] lg:text-[clamp(4.4px,1vw,20.48px)] rounded-full cursor-pointer ">
              Ver Detalles
            </Button>
            
          </Link>
        </div>
      </Card>
    )
  }
}

